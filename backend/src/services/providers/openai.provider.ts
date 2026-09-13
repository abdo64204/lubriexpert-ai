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
export class OpenAIProvider implements AIProvider {
  readonly name: string;
  private client: OpenAI | null = null;

  constructor(name: string = 'openai') {
    this.name = name;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: env.aiApiKey.trim(),
        baseURL: env.aiBaseUrl.trim(),
        timeout: 15000, // 15s timeout per request — prevents hanging serverless instances
        maxRetries: 0,  // We manage retries and model fallbacks explicitly
      });
    }
    return this.client;
  }

  isConfigured(): boolean {
    return Boolean(env.aiApiKey && env.aiApiKey.trim().length > 0);
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
        'gemini-3.7-flash',
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
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

    let endpointHost = 'default';
    try {
      endpointHost = env.aiBaseUrl ? new URL(env.aiBaseUrl).hostname : 'default';
    } catch {
      endpointHost = 'invalid-url';
    }

    let lastError: any = null;
    const overallStartTime = Date.now();

    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i]!;
      const attemptStartTime = Date.now();

      try {
        console.log(`[AI Provider] Invoking model "${model}" on host "${endpointHost}"...`);

        const completion = await client.chat.completions.create({
          model,
          messages: request.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
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
          `[AI Provider Success] Response generated using model "${model}" via "${endpointHost}" in ${duration}ms.`
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
          `Duration: ${duration}ms. ${i < candidateModels.length - 1 ? 'Attempting next candidate...' : 'All candidates exhausted.'}`
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
