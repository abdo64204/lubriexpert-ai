import { AIRequest, AIResponse } from '../models/types';

/**
 * AIProvider interface — abstraction layer over different LLM providers.
 *
 * Implement this interface to add a new provider (e.g., Gemini, Anthropic).
 * The AIService selects the provider based on the AI_PROVIDER env variable.
 */
export interface AIProvider {
  /** Human-readable provider name for logging */
  readonly name: string;

  /** Generate a response given a structured AI request */
  generateResponse(request: AIRequest): Promise<AIResponse>;

  /** Returns true if the provider is properly configured (e.g., has API key) */
  isConfigured(): boolean;
}
