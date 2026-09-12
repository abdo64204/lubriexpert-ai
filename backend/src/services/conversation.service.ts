import { v4 as uuidv4 } from 'uuid';
import { AIMessage, ConversationContext } from '../models/types';

// Cap conversation context to prevent excessive token usage
const MAX_CONTEXT_MESSAGES = 20;

/**
 * ConversationService — Manages in-memory conversation state.
 *
 * Phase 1: In-memory only (resets on server restart).
 * Future phases: Connect to a persistent database.
 *
 * Each conversation stores:
 * - A unique ID
 * - All messages (user + assistant)
 * - Auto-generated title from first message
 * - Timestamps for creation and last update
 */
class ConversationService {
  private conversations = new Map<string, ConversationContext>();

  createConversation(language = 'en'): ConversationContext {
    const id = uuidv4();
    const context: ConversationContext = {
      id,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      language,
    };
    this.conversations.set(id, context);
    return context;
  }

  getConversation(id: string): ConversationContext | undefined {
    return this.conversations.get(id);
  }

  getOrCreateConversation(
    id: string | undefined,
    language = 'en'
  ): ConversationContext {
    if (id) {
      const existing = this.conversations.get(id);
      if (existing) return existing;
    }
    return this.createConversation(language);
  }

  addMessage(
    conversationId: string,
    message: AIMessage
  ): ConversationContext | null {
    const context = this.conversations.get(conversationId);
    if (!context) return null;

    context.messages.push(message);
    context.updatedAt = new Date();

    // Auto-generate title from first user message
    if (!context.title && message.role === 'user') {
      context.title = this.generateTitle(message.content);
    }

    // Trim oldest messages to keep context within token limits
    if (context.messages.length > MAX_CONTEXT_MESSAGES) {
      context.messages = context.messages.slice(-MAX_CONTEXT_MESSAGES);
    }

    return context;
  }

  private generateTitle(firstMessage: string): string {
    const cleaned = firstMessage.trim().replace(/[\n\r]+/g, ' ');
    return cleaned.length > 50 ? `${cleaned.substring(0, 47)}...` : cleaned;
  }

  deleteConversation(id: string): boolean {
    return this.conversations.delete(id);
  }

  /**
   * Clean up conversations older than 24 hours to prevent memory leaks.
   * Called automatically every hour.
   */
  cleanupOldConversations(): void {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const [id, context] of this.conversations.entries()) {
      if (context.updatedAt < twentyFourHoursAgo) {
        this.conversations.delete(id);
      }
    }
  }

  get size(): number {
    return this.conversations.size;
  }
}

export const conversationService = new ConversationService();

// Cleanup old conversations every hour
setInterval(
  () => conversationService.cleanupOldConversations(),
  60 * 60 * 1000
);
