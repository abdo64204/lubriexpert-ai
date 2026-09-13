import OpenAI from 'openai';
import { AIProvider } from '../ai-provider.interface';
import { AIRequest, AIResponse } from '../../models/types';
import { env } from '../../config/environment';

/**
 * OpenAIProvider — Implements AIProvider using the OpenAI SDK.
 *
 * Compatible with:
 * - OpenAI (api.openai.com) — GPT-4o, GPT-4, GPT-3.5-turbo, etc.
 * - Azure OpenAI (set AI_BASE_URL to your Azure endpoint)
 * - Any OpenAI-compatible API (Ollama, LM Studio, Groq, Together AI, etc.)
 *
 * Configure via environment variables:
 *   AI_API_KEY   — your API key
 *   AI_MODEL     — model name (e.g., gpt-4o)
 *   AI_BASE_URL  — base URL (defaults to https://api.openai.com/v1)
 */
function sanitizeApiKey(raw: string): string {
  if (!raw) return '';
  let k = raw.trim();
  while (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'")) ||
    (k.startsWith('`') && k.endsWith('`'))
  ) {
    k = k.slice(1, -1).trim();
  }
  k = k.replace(/[;,]+$/, '').trim();
  if (k.toLowerCase().startsWith('bearer ')) {
    k = k.slice(7).trim();
  }
  return k;
}

function sanitizeBaseUrl(raw: string): string {
  if (!raw) return 'https://generativelanguage.googleapis.com/v1beta/openai/';
  let u = raw.trim();
  while (
    (u.startsWith('"') && u.endsWith('"')) ||
    (u.startsWith("'") && u.endsWith("'"))
  ) {
    u = u.slice(1, -1).trim();
  }
  if (u.includes('generativelanguage.googleapis.com') && !u.includes('/openai')) {
    u = u.replace(/\/+$/, '') + '/openai';
  }
  return u.replace(/\/+$/, '') + '/';
}

export class OpenAIProvider implements AIProvider {
  readonly name: string;
  private client: OpenAI | null = null;

  constructor(name: string = 'openai') {
    this.name = name;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      const cleanedKey = sanitizeApiKey(env.aiApiKey);
      const cleanedBaseUrl = sanitizeBaseUrl(env.aiBaseUrl);

      // Custom fetch interceptor:
      // 1. Injects clean Authorization and x-goog-api-key headers
      // 2. Unwraps Google's array error format [ { error: ... } ] so OpenAI SDK parses the true error message
      // 3. Logs safe server-side diagnostics without leaking credentials
      const customFetch = async (url: any, init?: any): Promise<any> => {
        const headers = new Headers(init?.headers || {});
        headers.set('Authorization', `Bearer ${cleanedKey}`);
        if (this.name.includes('gemini') || cleanedBaseUrl.includes('googleapis.com')) {
          headers.set('x-goog-api-key', cleanedKey);
        }

        const res = await fetch(url, { ...init, headers });
        if (!res.ok) {
          try {
            const clone = res.clone();
            const text = await clone.text();
            let parsed: any;
            try { parsed = JSON.parse(text); } catch { parsed = null; }

            if (Array.isArray(parsed) && parsed[0]?.error) {
              parsed = parsed[0];
            }

            const safeMsg = parsed?.error?.message ?? res.statusText;
            const safeStatus = parsed?.error?.status ?? 'UNKNOWN';

            // Safe server-side diagnostic — NEVER logs the actual API key or auth headers
            console.warn(`[Google API Diagnostic] HTTP ${res.status}: ${safeMsg} (${safeStatus})`);

            if (parsed) {
              const resHeaders = new Headers(res.headers);
              resHeaders.set('content-type', 'application/json');
              return new Response(JSON.stringify(parsed), {
                status: res.status,
                statusText: res.statusText,
                headers: resHeaders,
              });
            }
          } catch {
            // If response parsing fails, pass through original response
          }
        }
        return res;
      };

      this.client = new OpenAI({
        apiKey: cleanedKey,
        baseURL: cleanedBaseUrl,
        timeout: 15000, // 15s timeout per request
        maxRetries: 0,  // Controlled fallback across candidate models
        fetch: customFetch as any,
      });
    }
    return this.client;
  }

  isConfigured(): boolean {
    const key = sanitizeApiKey(env.aiApiKey);
    return Boolean(key && key.length > 0);
  }

  /**
   * Determine candidate models for resilient fallback.
   * If the requested model is overloaded (503) or rate-limited (429),
   * the provider automatically tries the next candidate.
   */
  private getCandidateModels(primaryModel: string): string[] {
    const isGemini =
      this.name.toLowerCase().includes('gemini') ||
      env.aiProvider.toLowerCase().includes('gemini') ||
      env.aiBaseUrl.includes('googleapis.com');

    if (isGemini) {
      // Order: requested model first, then tested high-speed & high-availability models
      const geminiFallbacks = [
        primaryModel,
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        'gemini-3.7-flash',
      ].filter(Boolean);

      // Deduplicate while preserving order
      return Array.from(new Set(geminiFallbacks));
    }

    return [primaryModel];
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error(
        'AI_API_KEY is not configured. Please add your API key to the environment variables and restart the server.'
      );
    }

    const client = this.getClient();
    const candidateModels = this.getCandidateModels(request.model);

    // Sanitize message array to eliminate null/empty content or invalid roles that cause HTTP 400
    const sanitizedMessages = request.messages
      .filter((msg) => msg && typeof msg.content === 'string' && msg.content.trim().length > 0)
      .map((msg) => ({
        role: (msg.role === 'assistant' || msg.role === 'system' ? msg.role : 'user') as 'user' | 'assistant' | 'system',
        content: msg.content.trim(),
      }));

    const messagesToSend =
      sanitizedMessages.length > 0
        ? sanitizedMessages
        : [{ role: 'user' as const, content: 'Hello' }];

    let endpointHost = 'default';
    try {
      endpointHost = env.aiBaseUrl ? new URL(env.aiBaseUrl).hostname : 'default';
    } catch {
      endpointHost = 'invalid-url';
    }

    const totalMessageContentLength = messagesToSend.reduce((acc, m) => acc + m.content.length, 0);
    const messageRoles = messagesToSend.map((m) => m.role);
    const payloadParams = ['model', 'messages', 'max_tokens', 'temperature'];

    let lastError: any = null;
    const overallStartTime = Date.now();

    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i]!;
      const attemptStartTime = Date.now();

      try {
        // Safe sanitized request diagnostic — contains NO credentials, API keys, or raw message text
        console.log(
          `[AI Request Diagnostic] Model: "${model}", Host: "${endpointHost}", ` +
          `Roles: [${messageRoles.join(', ')}], ContentLength: ${totalMessageContentLength}, ` +
          `Parameters: [${payloadParams.join(', ')}]`
        );

        const completion = await client.chat.completions.create({
          model,
          messages: messagesToSend,
          max_tokens: request.maxTokens ?? 2048,
          temperature: request.temperature ?? 0.7,
        });

        const choice = completion.choices[0];
        let content = choice?.message?.content;

        if (content && typeof content === 'string') {
          content = content.trim();
        }

        if (!content) {
          throw new Error(`Model "${model}" returned an empty response or exhausted tokens during generation.`);
        }

        const duration = Date.now() - attemptStartTime;
        console.log(
          `[AI Response Diagnostic] Model: "${model}", Host: "${endpointHost}", ` +
          `Status: 200, Timing: ${duration}ms`
        );

        return {
          content,
          model: completion.model,
          usage: completion.usage
            ? {
                promptTokens: completion.usage.prompt_tokens,
                completionTokens: completion.usage.completion_tokens,
                totalTokens: completion.usage.total_tokens,
              }
            : undefined,
        };
      } catch (err: any) {
        lastError = err;
        const duration = Date.now() - attemptStartTime;
        const status = err?.status ?? err?.statusCode ?? 'N/A';
        const errType = err?.name ?? typeof err;
        const errMsg = err?.message ?? String(err);

        // Safe diagnostic warning — NEVER logs API keys, auth headers, or user secrets
        console.warn(
          `[AI Provider Fallback] Model "${model}" failed on "${endpointHost}". ` +
          `Status: ${status}, Type: ${errType}, Error: ${errMsg}. ` +
          `Timing: ${duration}ms. ${i < candidateModels.length - 1 ? 'Attempting next candidate...' : 'All candidates exhausted.'}`
        );
      }
    }

    const totalDuration = Date.now() - overallStartTime;
    console.error('[AI Provider Exhausted]', {
      provider: this.name,
      endpointHost,
      modelsAttempted: candidateModels,
      lastStatus: lastError?.status ?? lastError?.statusCode ?? 500,
      lastErrorType: lastError?.name ?? 'UnknownError',
      lastErrorMessage: lastError?.message ?? 'Unknown error',
      totalDurationMs: totalDuration,
    });

    const status = lastError?.status ?? lastError?.statusCode ?? 503;
    const clientSafeMessage =
      status === 503
        ? 'The AI service is temporarily overloaded or experiencing high traffic. Please try again in a few moments.'
        : status === 429
        ? 'The AI service rate limit was reached. Please wait a moment and try again.'
        : lastError?.message || 'Failed to generate a response from the AI provider.';

    const finalError: any = new Error(clientSafeMessage);
    finalError.statusCode = status;
    finalError.status = status;
    throw finalError;
  }
}
