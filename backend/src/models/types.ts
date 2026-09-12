// ============================================================
// Shared TypeScript types for LubriExpert AI Backend
// ============================================================

export type MessageRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  role: MessageRole;
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ConversationContext {
  id: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  language: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  language: 'ar' | 'en';
}

export interface ChatResponse {
  success: boolean;
  message: {
    role: MessageRole;
    content: string;
  };
  conversationId: string;
  error?: string;
}

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}
