import { Injectable, signal, computed } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Conversation, Language } from '../models/chat.models';

const STORAGE_KEY = 'lubriexpert_conversations';
const CURRENT_KEY = 'lubriexpert_current_conv';
const MAX_CONVERSATIONS = 20;
const MAX_MESSAGES_PER_CONV = 100;

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private _conversations = signal<Conversation[]>(this.loadFromStorage());
  private _currentId = signal<string | null>(this.loadCurrentId());

  readonly conversations = this._conversations.asReadonly();
  readonly currentConversation = computed(() =>
    this._conversations().find((c) => c.id === this._currentId()) ?? null
  );

  private loadCurrentId(): string | null {
    try { return localStorage.getItem(CURRENT_KEY); } catch { return null; }
  }

  private loadFromStorage(): Conversation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Conversation[];
      return parsed.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        messages: (c.messages || [])
          .filter((m) => m && m.content && m.content.trim().length > 0)
          .map((m) => ({
            ...m,
            isLoading: false,
            timestamp: new Date(m.timestamp),
          })),
      }));
    } catch { return []; }
  }

  private persist(): void {
    try {
      const toSave = this._conversations()
        .slice(0, MAX_CONVERSATIONS)
        .map((c) => ({
          ...c,
          messages: c.messages.slice(-MAX_MESSAGES_PER_CONV),
        }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* localStorage full — ignore */ }
  }

  createConversation(language: Language = 'en'): Conversation {
    const conv: Conversation = {
      id: uuidv4(),
      title: language === 'ar' ? 'محادثة جديدة' : 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      language,
    };
    this._conversations.update((convs) => [conv, ...convs]);
    this.setCurrentConversation(conv.id);
    this.persist();
    return conv;
  }

  setCurrentConversation(id: string | null): void {
    this._currentId.set(id);
    try {
      if (id) { localStorage.setItem(CURRENT_KEY, id); }
      else { localStorage.removeItem(CURRENT_KEY); }
    } catch { /* ignore */ }
  }

  addMessage(conversationId: string, message: ChatMessage): void {
    this._conversations.update((convs) =>
      convs.map((c) => {
        if (c.id !== conversationId) return c;
        const updated: Conversation = {
          ...c,
          messages: [...c.messages, message],
          updatedAt: new Date(),
        };
        // Auto-title from first user message
        if (
          (c.title === 'New Conversation' || c.title === 'محادثة جديدة') &&
          message.role === 'user'
        ) {
          const raw = message.content.trim().replace(/\s+/g, ' ');
          updated.title = raw.length > 45 ? `${raw.slice(0, 42)}...` : raw;
        }
        return updated;
      })
    );
    this.persist();
  }

  updateLastMessage(conversationId: string, patch: Partial<ChatMessage>): void {
    this._conversations.update((convs) =>
      convs.map((c) => {
        if (c.id !== conversationId || c.messages.length === 0) return c;
        const messages = [...c.messages];
        const last = messages[messages.length - 1];
        if (!last) return c;
        messages[messages.length - 1] = { ...last, ...patch };
        return { ...c, messages, updatedAt: new Date() };
      })
    );
    this.persist();
  }

  deleteConversation(id: string): void {
    this._conversations.update((convs) => convs.filter((c) => c.id !== id));
    if (this._currentId() === id) {
      const first = this._conversations()[0];
      this.setCurrentConversation(first?.id ?? null);
    }
    this.persist();
  }

  getOrCreateCurrent(language: Language): Conversation {
    const current = this.currentConversation();
    if (current) return current;
    // Restore from list if current ID points to an existing conv
    const convs = this._conversations();
    if (convs.length > 0 && convs[0]) {
      this.setCurrentConversation(convs[0].id);
      return convs[0];
    }
    return this.createConversation(language);
  }
}
