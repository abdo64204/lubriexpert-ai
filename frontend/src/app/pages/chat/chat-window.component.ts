import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef, inject, AfterViewInit, AfterViewChecked, OnChanges, SimpleChanges
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ChatMessage } from '../../models/chat.models';
import { LanguageService } from '../../services/language.service';
import { ChatMessageComponent } from '../../shared/components/message/chat-message.component';
import { TypingIndicatorComponent } from '../../shared/components/typing-indicator/typing-indicator.component';
import { QuickActionsComponent } from '../../shared/components/quick-actions/quick-actions.component';
import { AppIconComponent, AppIconName } from '../../shared/components/icon/app-icon.component';

interface CapabilityCard {
  icon: AppIconName;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  promptEn: string;
  promptAr: string;
}

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [NgIf, NgFor, ChatMessageComponent, TypingIndicatorComponent, QuickActionsComponent, AppIconComponent],
  template: `
    <div class="chat-window" #scrollEl>

      <!-- ──── EMPTY STATE ──── -->
      <div class="empty-state" *ngIf="messages.length === 0 && !isLoading">
        <div class="empty-brand-badge" aria-hidden="true">
          <app-icon name="brand-mark" [size]="48" />
        </div>

        <h2 class="empty-title">
          {{ langService.t('خبير التشحيم الهندسي الذكي', 'LubriExpert AI Engineering Assistant') }}
        </h2>

        <p class="empty-sub">
          {{ langService.t(
            'المساعد الهندسي المتخصص في زيوت المحركات، متطلبات التزييت الصناعي، درجات الشحوم، والمعايير والمواصفات التريبولوجية.',
            'Enterprise lubrication engineering assistant for automotive specifications, industrial machinery, greases, and tribological diagnostics.'
          ) }}
        </p>

        <!-- ──── CAPABILITY CARDS ──── -->
        <div class="capabilities-grid" role="region" [attr.aria-label]="langService.t('القدرات الفنية', 'Technical Capabilities')">
          <button
            *ngFor="let card of capabilityCards"
            type="button"
            class="capability-card"
            (click)="onCardClick(card)"
            [attr.aria-label]="langService.t(card.titleAr, card.titleEn)"
          >
            <div class="card-icon-badge" aria-hidden="true">
              <app-icon [name]="card.icon" [size]="20" />
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ langService.t(card.titleAr, card.titleEn) }}</h3>
              <p class="card-desc">{{ langService.t(card.descAr, card.descEn) }}</p>
            </div>
          </button>
        </div>

        <!-- Quick actions in empty state -->
        <div class="empty-actions">
          <app-quick-actions (actionClicked)="exampleClicked.emit($event)" />
        </div>
      </div>

      <!-- ──── MESSAGES ──── -->
      <div
        class="messages"
        *ngIf="messages.length > 0 || isLoading"
        role="log"
        aria-live="polite"
        [attr.aria-label]="langService.t('سجل الرسائل', 'Chat message stream')"
      >
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
      max-width: 680px;
      margin: 0 auto;
      width: 100%;
    }

    .empty-brand-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
      border-radius: 20px;
      background: var(--bg-card);
      border: 1.5px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      margin-bottom: 16px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }

    .empty-title {
      font-size: clamp(1.2rem, 3.8vw, 1.55rem);
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
      letter-spacing: -0.02em;
      line-height: 1.25;
    }

    .empty-sub {
      font-size: clamp(0.825rem, 2.4vw, 0.925rem);
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 560px;
      margin-bottom: 24px;
    }

    /* ── Capabilities Grid ── */
    .capabilities-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      width: 100%;
      margin-bottom: 20px;
    }

    .capability-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      text-align: start;
      font-family: inherit;
      box-shadow: var(--shadow-sm);
      touch-action: manipulation;
      transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

      &:hover {
        border-color: var(--color-primary);
        background: var(--bg-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);

        .card-icon-badge {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }
      }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }

    .card-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      min-width: 38px;
      min-height: 38px;
      border-radius: var(--border-radius-sm);
      background: var(--color-primary-light);
      color: var(--color-primary);
      border: 1px solid rgba(15, 91, 158, 0.15);
      flex-shrink: 0;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }

    .card-content {
      flex: 1;
      min-width: 0;
    }

    .card-title {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
      line-height: 1.35;
    }

    .card-desc {
      font-size: 0.78rem;
      color: var(--text-secondary);
      line-height: 1.45;
      margin: 0;
    }

    .empty-actions {
      width: 100%;
    }

    /* ── Messages list ── */
    .messages {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 880px;
      margin: 0 auto;
      width: 100%;
    }

    @media (max-width: 600px) {
      .capabilities-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .capability-card {
        padding: 12px 14px;
      }
      .empty-state {
        padding: 16px 8px;
      }
      .chat-window {
        padding: 10px 8px;
      }
      .messages {
        gap: 6px;
      }
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

  readonly capabilityCards: CapabilityCard[] = [
    {
      icon: 'car',
      titleEn: 'Engine Oil Match',
      titleAr: 'مطابقة زيوت المحركات',
      descEn: 'Find suitable engine oils based on viscosity, API, ACEA and OEM requirements.',
      descAr: 'البحث عن زيوت المحركات المناسبة بناءً على اللزوجة وتصنيفات API وACEA ومتطلبات الصانع.',
      promptEn: 'Find suitable engine oils matching viscosity, API, ACEA, and OEM requirements for modern vehicles.',
      promptAr: 'ما هي زيوت المحركات المناسبة بناءً على درجة اللزوجة ومواصفات API و ACEA ومتطلبات الصانع؟',
    },
    {
      icon: 'factory',
      titleEn: 'Industrial Lubricants',
      titleAr: 'الزيوت والتشحيم الصناعي',
      descEn: 'Explore hydraulic, gearbox, compressor and industrial lubrication requirements.',
      descAr: 'استكشاف متطلبات التزييت للأنظمة الهيدروليكية وصناديق التروس والضواغط والمعدات الصناعية.',
      promptEn: 'Explore hydraulic, gearbox, compressor and industrial lubrication requirements and ISO VG recommendations.',
      promptAr: 'ما هي متطلبات التزييت ودرجات لزوجة ISO VG الموصى بها للهيدروليك وصناديق التروس الصناعية والضواغط؟',
    },
    {
      icon: 'gear',
      titleEn: 'Grease & NLGI',
      titleAr: 'الشحوم ودرجات NLGI',
      descEn: 'Select grease based on NLGI grade, temperature, load and thickener compatibility.',
      descAr: 'اختيار الشحم المناسب بناءً على درجة NLGI ودرجة الحرارة والأحمال وتوافق المغلظات.',
      promptEn: 'How do I select grease based on NLGI grade, temperature, load, and thickener compatibility?',
      promptAr: 'كيف أختار الشحم المناسب بناءً على درجة NLGI ودرجة حرارة التشغيل والحمل وتوافق المغلظات؟',
    },
    {
      icon: 'scale',
      titleEn: 'Specification Comparison',
      titleAr: 'مقارنة المواصفات والمعايير',
      descEn: 'Compare viscosity grades, specifications, lubricant types and equivalent products.',
      descAr: 'مقارنة درجات اللزوجة والمواصفات وأنواع الزيوت والبدائل المكافئة للتشحيم.',
      promptEn: 'Compare viscosity grades, specifications, lubricant types, and equivalent products in lubrication engineering.',
      promptAr: 'قارن بين درجات اللزوجة والمواصفات وأنواع الزيوت والمنتجات البديلة المكافئة.',
    },
  ];

  onCardClick(card: CapabilityCard): void {
    const prompt = this.langService.language() === 'ar' ? card.promptAr : card.promptEn;
    this.exampleClicked.emit(prompt);
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
