import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef, inject, AfterViewInit, AfterViewChecked, OnChanges, SimpleChanges
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ChatMessage, EXAMPLE_QUESTIONS } from '../../models/chat.models';
import { LanguageService } from '../../services/language.service';
import { ChatMessageComponent } from '../../shared/components/message/chat-message.component';
import { TypingIndicatorComponent } from '../../shared/components/typing-indicator/typing-indicator.component';
import { QuickActionsComponent } from '../../shared/components/quick-actions/quick-actions.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [NgIf, NgFor, ChatMessageComponent, TypingIndicatorComponent, QuickActionsComponent],
  template: `
    <div class="chat-window" #scrollEl>

      <!-- ──── EMPTY STATE ──── -->
      <div class="empty-state" *ngIf="messages.length === 0 && !isLoading">
        <div class="empty-icon">🛢️</div>

        <h2 class="empty-title">
          {{ langService.t('خبير التشحيم الذكي', 'AI Lubrication Expert') }}
        </h2>

        <p class="empty-sub">
          {{ langService.t(
            'اسألني عن زيوت السيارات والمحركات والتشحيم الصناعي والجريس والمواصفات ومنتجات موبيل.',
            'Ask me about automotive oils, industrial lubricants, machinery oils, greases, viscosity, specifications, and Mobil products.'
          ) }}
        </p>

        <p class="empty-tags">
          {{ langService.t(
            'سيارات • صناعي • آلات • جريس',
            'Automotive • Industrial • Machinery • Grease'
          ) }}
        </p>

        <!-- Example questions -->
        <div class="examples-section">
          <p class="examples-label">
            {{ langService.t('أسئلة مثال:', 'Example questions:') }}
          </p>
          <div class="examples-grid">
            <button
              *ngFor="let q of exampleQs"
              class="example-btn"
              (click)="exampleClicked.emit(q)"
            >{{ q }}</button>
          </div>
        </div>

        <!-- Quick actions in empty state -->
        <div class="empty-actions">
          <app-quick-actions (actionClicked)="exampleClicked.emit($event)" />
        </div>
      </div>

      <!-- ──── MESSAGES ──── -->
      <div class="messages" *ngIf="messages.length > 0 || isLoading">
        <app-chat-message
          *ngFor="let m of messages; trackBy: trackMessage"
          [message]="m"
          (regenerate)="regenerate.emit()"
        />
        <app-typing-indicator *ngIf="isLoading" />
      </div>

    </div>
  `,
  styles: [`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    .chat-window {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
      background: var(--bg-chat);
      display: flex;
      flex-direction: column;
      overscroll-behavior-y: contain;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }

    /* ── Empty state ── */
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px 16px;
      max-width: 640px;
      margin: 0 auto;
      width: 100%;
    }

    .empty-icon {
      font-size: clamp(2.4rem, 6vw, 3.2rem);
      margin-bottom: 12px;
      line-height: 1;
    }

    .empty-title {
      font-size: clamp(1.2rem, 4vw, 1.55rem);
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 10px;
      letter-spacing: -0.02em;
      line-height: 1.25;
    }

    .empty-sub {
      font-size: clamp(0.825rem, 2.5vw, 0.925rem);
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 500px;
      margin-bottom: 8px;
    }

    .empty-tags {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 20px;
    }

    .examples-section {
      width: 100%;
      margin-bottom: 18px;
    }

    .examples-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 10px;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .example-btn {
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      font-size: 0.82rem;
      color: var(--text-secondary);
      cursor: pointer;
      text-align: start;
      transition: all var(--transition);
      font-family: inherit;
      line-height: 1.4;
      touch-action: manipulation;

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background: var(--color-primary-light);
      }
    }

    .empty-actions { width: 100%; }

    /* ── Messages list ── */
    .messages {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 880px;
      margin: 0 auto;
      width: 100%;
    }

    @media (max-width: 640px) {
      .examples-grid { grid-template-columns: 1fr; gap: 6px; }
      .empty-state { padding: 16px 8px; }
      .chat-window { padding: 10px 8px; }
      .messages { gap: 6px; }
    }
  `],
})
export class ChatWindowComponent implements AfterViewInit, AfterViewChecked, OnChanges {
  @Input() messages: ChatMessage[] = [];
  @Input() isLoading = false;
  @Output() exampleClicked = new EventEmitter<string>();
  @Output() regenerate = new EventEmitter<void>();

  @ViewChild('scrollEl') scrollEl!: ElementRef<HTMLDivElement>;

  langService = inject(LanguageService);
  private prevScrollHeight = 0;

  get exampleQs(): string[] {
    return EXAMPLE_QUESTIONS[this.langService.language()];
  }

  trackMessage(_: number, m: ChatMessage): string {
    return m.id;
  }

  ngAfterViewInit(): void {
    this.scrollToBottom('auto');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] || changes['isLoading']) {
      const isFirst = changes['messages']?.isFirstChange();
      this.scrollToBottom(isFirst ? 'auto' : 'smooth');
    }
  }

  ngAfterViewChecked(): void {
    const el = this.scrollEl?.nativeElement;
    if (!el) return;
    if (el.scrollHeight !== this.prevScrollHeight) {
      this.prevScrollHeight = el.scrollHeight;
      // Scroll to bottom when content height changes
      el.scrollTop = el.scrollHeight;
    }
  }

  /**
   * Smoothly or immediately scroll the chat container to the bottom.
   */
  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    const scroll = () => {
      const el = this.scrollEl?.nativeElement;
      if (el) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior,
        });
      }
    };
    // Immediate scroll attempt
    scroll();
    // Schedule after current render frame
    requestAnimationFrame(scroll);
    // Timeout fallback for markdown / fonts that expand layout
    setTimeout(scroll, 50);
  }
}
