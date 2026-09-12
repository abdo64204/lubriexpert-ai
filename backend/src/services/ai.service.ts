import { AIProvider } from './ai-provider.interface';
import { OpenAIProvider } from './providers/openai.provider';
import { AIMessage, AIResponse } from '../models/types';
import { LUBRIEXPERT_SYSTEM_PROMPT } from '../config/ai-system-prompt';
import { env } from '../config/environment';

/**
 * AIService — Orchestrates AI response generation.
 *
 * Responsibilities:
 * - Selects the correct provider based on environment config
 * - Injects the system prompt into every request
 * - Combines conversation history with the new user message
 * - Provides a clean interface for controllers (no provider details leak out)
 *
 * To add a new provider in future phases:
 *   1. Create a new class implementing AIProvider in /services/providers/
 *   2. Add it to the switch in createProvider()
 *   3. Set AI_PROVIDER=your_provider_name in .env
 */
class AIService {
  private provider: AIProvider;

  constructor() {
    this.provider = this.createProvider();
  }

  private createProvider(): AIProvider {
    const providerName = env.aiProvider.toLowerCase();

    switch (providerName) {
      case 'gemini':
        return new OpenAIProvider('gemini');

      case 'openai':
        return new OpenAIProvider('openai');

      // Future providers:
      // case 'anthropic':
      //   return new AnthropicProvider();

      default:
        console.warn(
          `Unknown AI_PROVIDER "${env.aiProvider}" — falling back to OpenAI-compatible`
        );
        return new OpenAIProvider(env.aiProvider || 'openai');
    }
  }

  isConfigured(): boolean {
    return this.provider.isConfigured();
  }

  getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Generate a response from the AI given a user message and conversation history.
   *
   * @param userMessage   The latest message from the user
   * @param conversationHistory   Previous messages (excluding the current one)
   * @returns The AI's response
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: AIMessage[]
  ): Promise<AIResponse> {
    // Build the full message array: system prompt + history + new user message
    const messages: AIMessage[] = [
      { role: 'system', content: LUBRIEXPERT_SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    return this.provider.generateResponse({
      messages,
      model: env.aiModel,
      maxTokens: 2048,
      temperature: 0.7,
    });
  }
}

// Export as a singleton
export const aiService = new AIService();
