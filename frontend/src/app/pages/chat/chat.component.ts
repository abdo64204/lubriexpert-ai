import { Component, ViewChild, inject, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { ConversationSidebarComponent } from './conversation-sidebar.component';
import { ChatWindowComponent } from './chat-window.component';
import { ChatInputComponent } from './chat-input.component';
import { QuickActionsComponent } from '../../shared/components/quick-actions/quick-actions.component';
import { ChatMessage } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';
import { ConversationService } from '../../services/conversation.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgIf, AppHeaderComponent, ConversationSidebarComponent, ChatWindowComponent, ChatInputComponent, QuickActionsComponent],
  template: `
    <div class="chat-layout" [class.sidebar-open]="sidebarOpen">
      <app-conversation-sidebar class="sidebar-component" (closed)="onConversationSelected()" />
      <div class="sidebar-overlay" *ngIf="sidebarOpen" (click)="sidebarOpen = false"></div>
      <div class="main-area">
        <app-header />
        <button class="mobile-sidebar-btn" (click)="sidebarOpen = !sidebarOpen">☰</button>
        <div class="chat-body">
          <app-chat-window #chatWindow [messages]="currentMessages()" [isLoading]="isLoading()"
            (exampleClicked)="onExampleOrQuickAction($event)" (regenerate)="onRegenerate()" />
          <div class="bottom-area">
            <div class="quick-actions-bar" *ngIf="currentMessages().length > 0">
              <app-quick-actions (actionClicked)="onExampleOrQuickAction($event)" />
            </div>
            <app-chat-input #chatInput [isLoading]="isLoading()" (messageSent)="onMessageSent($event)" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-layout { display: flex; height: 100vh; overflow: hidden; }
    .sidebar-component { display: flex; }
    .main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
    .chat-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    app-chat-window { flex: 1; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
    .bottom-area { background: var(--bg-chat); border-top: 1px solid var(--border-color); }
    .quick-actions-bar { padding: 10px 20px 0; }
    .mobile-sidebar-btn { display: none; position: absolute; top: 14px; inset-inline-start: 14px; z-index: 200; background: none; border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 10px; cursor: pointer; color: var(--text-secondary); font-size: 1rem; }
    .sidebar-overlay { display: none; }
    @media (max-width: 768px) {
      .sidebar-component { position: fixed; top: 0; inset-inline-start: -280px; height: 100%; z-index: 300; transition: inset-inline-start 0.25s ease; box-shadow: var(--shadow-lg); }
      .chat-layout.sidebar-open .sidebar-component { inset-inline-start: 0; }
      .mobile-sidebar-btn { display: flex; }
      .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; }
    }
  `]
})
export class ChatComponent implements OnInit {
  @ViewChild('chatWindow') chatWindow?: ChatWindowComponent;
  @ViewChild('chatInput') chatInputRef!: ChatInputComponent;
  chatService = inject(ChatService);
  convService = inject(ConversationService);
  langService = inject(LanguageService);
  isLoading = signal(false);
  sidebarOpen = false;

  ngOnInit(): void {
    if (!this.convService.currentConversation()) {
      const convs = this.convService.conversations();
      if (convs.length > 0 && convs[0]) { this.convService.setCurrentConversation(convs[0].id); }
    }
  }

  currentMessages(): ChatMessage[] { return this.convService.currentConversation()?.messages ?? []; }
  onConversationSelected(): void {
    this.sidebarOpen = false;
    setTimeout(() => this.chatWindow?.scrollToBottom('auto'), 50);
  }

  onExampleOrQuickAction(text: string): void {
    this.chatInputRef?.setMessage(text);
    this.onMessageSent(text);
  }

  onMessageSent(text: string): void {
    const trimmed = text.trim();
    if (this.isLoading() || !trimmed) return;

    const conversation = this.convService.getOrCreateCurrent(this.langService.language());

    // 1. Immediately display user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    this.convService.addMessage(conversation.id, userMessage);

    // 2. Immediately display loading indicator
    this.isLoading.set(true);

    // 3. Auto-scroll to bottom so user message and typing indicator are visible
    this.chatWindow?.scrollToBottom('smooth');

    // 4. Send request to backend API
    this.chatService
      .sendMessage({
        message: trimmed,
        conversationId: conversation.id,
        language: this.langService.language(),
      })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response?.success && response.message?.content) {
            const aiMessage: ChatMessage = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: response.message.content,
              timestamp: new Date(),
            };
            this.convService.addMessage(conversation.id, aiMessage);
          } else {
            console.error('AI chat response failed or empty:', response);
            const errorMsg =
              response?.error ||
              'The AI service returned an empty response. Please try again.';
            const errorMessage: ChatMessage = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: errorMsg,
              timestamp: new Date(),
              error: true,
            };
            this.convService.addMessage(conversation.id, errorMessage);
          }
          this.chatWindow?.scrollToBottom('smooth');
        },
        error: (err: Error) => {
          this.isLoading.set(false);
          console.error('Chat API error:', err);
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              err.message ||
              'An unexpected error occurred. Please check your connection and try again.',
            timestamp: new Date(),
            error: true,
          };
          this.convService.addMessage(conversation.id, errorMessage);
          this.chatWindow?.scrollToBottom('smooth');
        },
      });
  }

  onRegenerate(): void {
    const conv = this.convService.currentConversation();
    if (!conv || conv.messages.length === 0) return;
    const lastUserMsg = [...conv.messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) { this.onMessageSent(lastUserMsg.content); }
  }
}
