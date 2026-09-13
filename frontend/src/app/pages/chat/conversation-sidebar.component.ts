import { Component, Output, EventEmitter, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ConversationService } from '../../services/conversation.service';
import { LanguageService } from '../../services/language.service';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/chat.models';

@Component({
  selector: 'app-conversation-sidebar',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <aside class="sidebar">
      <!-- Header -->
      <div class="sb-header">
        <button class="new-chat-btn" (click)="newChat()">
          <span>✏️</span>
          <span>{{ langService.t('محادثة جديدة', 'New Chat') }}</span>
        </button>
      </div>

      <!-- Conversations list -->
      <div class="sb-body">
        <p class="section-label" *ngIf="convService.conversations().length > 0">
          {{ langService.t('المحادثات الأخيرة', 'Recent') }}
        </p>

        <div class="empty-msg" *ngIf="convService.conversations().length === 0">
          <p>{{ langService.t('لا توجد محادثات بعد', 'No conversations yet') }}</p>
          <p class="empty-hint">{{ langService.t('ابدأ بسؤال جديد', 'Start by asking a question') }}</p>
        </div>

        <div
          *ngFor="let conv of convService.conversations()"
          class="conv-item"
          [class.active]="convService.currentConversation()?.id === conv.id"
          (click)="select(conv)"
        >
          <div class="conv-info">
            <span class="conv-title">{{ conv.title }}</span>
            <span class="conv-date">{{ relativeTime(conv.updatedAt) }}</span>
          </div>
          <button class="del-btn" (click)="del($event, conv)" [title]="langService.t('حذف','Delete')">
            🗑️
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="sb-footer">
        <div class="ai-status">
          <span class="status-dot"></span>
          {{ langService.t('مدعوم بالذكاء الاصطناعي', 'Powered by AI') }}
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      max-width: min(var(--sidebar-width), calc(100vw - 44px));
      height: 100%;
      background: var(--bg-sidebar);
      border-inline-end: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow: hidden;
    }

    .sb-header {
      padding: 14px 12px;
      border-bottom: 1px solid var(--border-color);
    }

    .new-chat-btn {
      width: 100%;
      min-height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 9px 14px;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--border-radius-sm);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background var(--transition);
      font-family: inherit;
      line-height: 1;
      touch-action: manipulation;

      &:hover { background: var(--color-primary-dark); }
    }

    .sb-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      -webkit-overflow-scrolling: touch;
    }

    .section-label {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 6px 8px 4px;
    }

    .empty-msg {
      padding: 20px 10px;
      text-align: center;

      p { font-size: 0.825rem; color: var(--text-muted); }
      .empty-hint { font-size: 0.75rem; margin-top: 4px; }
    }

    .conv-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 10px;
      min-height: 44px;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: background var(--transition);
      margin-bottom: 2px;
      touch-action: manipulation;

      &:hover, &.active { background: var(--bg-hover); }
      &:hover .del-btn { opacity: 1; }
    }

    .conv-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .conv-title {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .conv-date {
      font-size: 0.68rem;
      color: var(--text-muted);
    }

    .del-btn {
      background: none;
      border: none;
      padding: 6px;
      min-width: 32px;
      min-height: 32px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 0.8rem;
      opacity: 0;
      transition: opacity var(--transition), background var(--transition);
      flex-shrink: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;

      &:hover { background: var(--bg-hover); opacity: 1 !important; }
    }

    @media (hover: none), (max-width: 768px) {
      .del-btn { opacity: 0.7; }
    }

    .sb-footer {
      padding: 10px 14px max(10px, env(safe-area-inset-bottom));
      border-top: 1px solid var(--border-color);
    }

    .ai-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--color-success);
      animation: pulse 2.5s infinite;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `],
})
export class ConversationSidebarComponent {
  @Output() closed = new EventEmitter<void>();

  convService = inject(ConversationService);
  langService = inject(LanguageService);
  chatService = inject(ChatService);

  newChat(): void {
    this.convService.createConversation(this.langService.language());
    this.closed.emit();
  }

  select(conv: Conversation): void {
    this.convService.setCurrentConversation(conv.id);
    this.closed.emit();
  }

  del(e: MouseEvent, conv: Conversation): void {
    e.stopPropagation();
    this.chatService.deleteConversation(conv.id).subscribe();
    this.convService.deleteConversation(conv.id);
  }

  relativeTime(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60_000);
    const hrs = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    const ar = this.langService.language() === 'ar';

    if (mins < 1) return ar ? 'الآن' : 'just now';
    if (mins < 60) return ar ? `منذ ${mins}د` : `${mins}m ago`;
    if (hrs < 24) return ar ? `منذ ${hrs}س` : `${hrs}h ago`;
    return ar ? `منذ ${days}ي` : `${days}d ago`;
  }
}
