import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { NgIf } from '@angular/common';
import { ChatMessage } from '../../../models/chat.models';
import { LanguageService } from '../../../services/language.service';
import { marked } from 'marked';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="msg-row"
      [class.user-row]="message.role === 'user'"
      [class.ai-row]="message.role === 'assistant'"
    >
      <!-- AI Avatar -->
      <div class="avatar ai-av" *ngIf="message.role === 'assistant'">AI</div>

      <!-- Bubble + Meta -->
      <div class="bubble-col" [class.user-col]="message.role === 'user'">
        <div
          class="bubble"
          [class.user-bubble]="message.role === 'user'"
          [class.ai-bubble]="message.role === 'assistant'"
          [class.error-bubble]="message.error"
        >
          <!-- User: plain text -->
          <span *ngIf="message.role === 'user'">{{ message.content }}</span>

          <!-- AI: rendered markdown -->
          <div
            *ngIf="message.role === 'assistant' && !message.error"
            class="markdown-content"
            [innerHTML]="renderedContent"
          ></div>

          <!-- Error -->
          <div *ngIf="message.error" class="error-msg">
            ⚠️ {{ message.content }}
          </div>
        </div>

        <!-- Meta row -->
        <div class="meta-row">
          <span class="ts">{{ formatTime(message.timestamp) }}</span>

          <div class="actions" *ngIf="message.role === 'assistant' && !message.error && !message.isLoading">
            <button class="act-btn" (click)="copy()" [title]="langService.t('نسخ','Copy')">
              {{ copied ? '✓' : '📋' }}
            </button>
            <button class="act-btn" (click)="regenerate.emit()" [title]="langService.t('إعادة المحاولة','Regenerate')">
              🔄
            </button>
            <button class="act-btn" [class.voted]="vote==='up'" (click)="castVote('up')" title="👍">👍</button>
            <button class="act-btn" [class.voted]="vote==='down'" (click)="castVote('down')" title="👎">👎</button>
          </div>
        </div>
      </div>

      <!-- User Avatar -->
      <div class="avatar user-av" *ngIf="message.role === 'user'">👤</div>
    </div>
  `,
  styles: [`
    .msg-row {
      display: flex;
      gap: 10px;
      padding: 3px 0;
      align-items: flex-end;
    }

    /* LTR: user = row-reverse, AI = row */
    .user-row { flex-direction: row-reverse; }
    .ai-row   { flex-direction: row; }

    /* RTL flip */
    [dir='rtl'] .user-row { flex-direction: row; }
    [dir='rtl'] .ai-row   { flex-direction: row-reverse; }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
      margin-bottom: 2px;
    }

    .ai-av {
      background: var(--color-primary);
      color: white;
      font-size: 10px;
    }

    .user-av {
      background: var(--bg-hover);
      border: 1px solid var(--border-color);
      font-size: 15px;
    }

    .bubble-col {
      max-width: 78%;
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
      min-width: 0;
    }

    .user-col { align-items: flex-end; }

    [dir='rtl'] .user-col { align-items: flex-start; }
    [dir='rtl'] .bubble-col { align-items: flex-end; }

    .bubble {
      padding: 11px 15px;
      border-radius: var(--border-radius-lg);
      font-size: 0.9rem;
      line-height: 1.65;
      overflow-wrap: anywhere;
      word-break: break-word;
      max-width: 100%;
    }

    .user-bubble {
      background: var(--bg-user-bubble);
      color: var(--text-user-bubble);
      border-bottom-right-radius: 4px;
    }

    .ai-bubble {
      background: var(--bg-ai-bubble);
      color: var(--text-ai-bubble);
      border: 1px solid var(--border-color);
      border-bottom-left-radius: 4px;
      box-shadow: var(--shadow-sm);
    }

    [dir='rtl'] .user-bubble {
      border-bottom-right-radius: var(--border-radius-lg);
      border-bottom-left-radius: 4px;
    }

    [dir='rtl'] .ai-bubble {
      border-bottom-left-radius: var(--border-radius-lg);
      border-bottom-right-radius: 4px;
    }

    .error-bubble {
      background: rgba(229, 62, 62, 0.08);
      border-color: rgba(229, 62, 62, 0.3) !important;
      color: var(--color-danger);
    }

    .error-msg { font-size: 0.875rem; }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 2px;
      min-height: 22px;
      flex-wrap: wrap;
    }

    .ts {
      font-size: 0.7rem;
      color: var(--text-muted);
      line-height: 1;
    }

    .actions {
      display: flex;
      gap: 2px;
      opacity: 0;
      transition: opacity var(--transition);
    }

    .bubble-col:hover .actions { opacity: 1; }

    /* Touch screen support — make actions visible on touch without hover */
    @media (hover: none), (max-width: 768px) {
      .actions { opacity: 0.75; }
    }

    .act-btn {
      background: none;
      border: none;
      padding: 4px 6px;
      min-width: 28px;
      min-height: 28px;
      cursor: pointer;
      border-radius: 5px;
      font-size: 0.8rem;
      transition: background var(--transition), opacity var(--transition);
      opacity: 0.7;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;

      &:hover, &:active { background: var(--bg-hover); opacity: 1; }
      &.voted { opacity: 1; }
    }

    @media (max-width: 640px) {
      .bubble-col { max-width: 88%; }
      .bubble { padding: 9px 12px; font-size: 0.875rem; }
      .msg-row { gap: 6px; }
      .avatar { width: 30px; height: 30px; font-size: 10px; }
    }

    @media (max-width: 360px) {
      .bubble-col { max-width: 92%; }
      .bubble { padding: 8px 10px; font-size: 0.85rem; }
      .avatar { display: none; }
    }
  `],
})
export class ChatMessageComponent implements OnInit, OnChanges {
  @Input({ required: true }) message!: ChatMessage;
  @Output() regenerate = new EventEmitter<void>();

  langService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

  renderedContent = '';
  copied = false;
  vote: 'up' | 'down' | null = null;

  ngOnInit(): void {
    this.updateRenderedContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      this.updateRenderedContent();
    }
  }

  private updateRenderedContent(): void {
    if (this.message?.role === 'assistant' && !this.message.error && this.message.content) {
      try {
        this.renderedContent = marked.parse(this.message.content, { async: false }) as string;
      } catch (err) {
        console.error('Failed to parse markdown:', err);
        this.renderedContent = this.message.content;
      }
    } else {
      this.renderedContent = '';
    }
    this.cdr.markForCheck();
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat(
      this.langService.language() === 'ar' ? 'ar-EG' : 'en-US',
      { hour: '2-digit', minute: '2-digit' }
    ).format(date);
  }

  copy(): void {
    navigator.clipboard.writeText(this.message.content).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

  castVote(type: 'up' | 'down'): void {
    this.vote = this.vote === type ? null : type;
  }
}
