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
        apiKey: env.aiApiKey,
        baseURL: env.aiBaseUrl,
      });
    }
    return this.client;
  }

  isConfigured(): boolean {
    return Boolean(env.aiApiKey && env.aiApiKey.trim().length > 0);
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error(
        'AI_API_KEY is not configured. Please add your API key to the .env file and restart the server.'
      );
    }

    const client = this.getClient();

    const completion = await client.chat.completions.create({
      model: request.model,
      messages: request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: request.maxTokens ?? 2048,
      temperature: request.temperature ?? 0.7,
    });

    const choice = completion.choices[0];
    if (!choice || !choice.message.content) {
      throw new Error('AI provider returned an empty response. Please try again.');
    }

    return {
      content: choice.message.content,
      model: completion.model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }
}
