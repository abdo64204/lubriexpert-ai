import { Component, Output, EventEmitter, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { AppIconComponent } from '../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [NgIf, FormsModule, AppIconComponent],
  template: `
    <div class="input-area">
      <div class="input-wrapper">
        <textarea
          #textareaEl
          class="message-input"
          [(ngModel)]="inputText"
          [placeholder]="langService.t('اكتب سؤالك هنا...', 'Type your question here...')"
          [disabled]="isLoading"
          (keydown)="onEnter($event)"
          (focus)="onFocus()"
          (input)="autoResize()"
          inputmode="text"
          enterkeyhint="send"
          autocomplete="off"
          autocorrect="on"
          autocapitalize="sentences"
          rows="1"
          maxlength="4000"
          aria-label="Message input"
        ></textarea>
        <button
          class="send-btn"
          type="button"
          [disabled]="isLoading || !inputText.trim()"
          (click)="onSend()"
          [title]="langService.t('إرسال', 'Send')"
          [attr.aria-label]="langService.t('إرسال الرسالة', 'Send message')"
        >
          <app-icon *ngIf="!isLoading" name="send" [size]="18" />
          <app-icon *ngIf="isLoading" name="spinner" [size]="18" class="spinner" />
        </button>
      </div>
      <p class="input-disclaimer">
        {{ langService.t('LubriExpert AI قد يرتكب أخطاء. تحقق دائماً من توصيات الشركة المصنعة.', 'LubriExpert AI can make mistakes. Always verify manufacturer recommendations.') }}
      </p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .input-area {
      padding: 10px 16px max(10px, env(safe-area-inset-bottom));
      background: var(--bg-chat);
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
    }

    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: var(--bg-input);
      border: 1.5px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 8px 12px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .input-wrapper:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(26, 111, 196, 0.12);
    }

    .message-input {
      flex: 1;
      border: none;
      background: transparent;
      resize: none;
      font-family: inherit;
      /* 16px minimum prevents iOS Safari from auto-zooming viewport on focus */
      font-size: 16px;
      line-height: 1.45;
      color: var(--text-primary);
      max-height: 140px;
      min-height: 24px;
      overflow-y: auto;
      -webkit-tap-highlight-color: transparent;
    }

    @media (min-width: 641px) {
      .message-input { font-size: 0.925rem; }
    }

    .message-input:focus { outline: none; }
    .message-input::placeholder { color: var(--text-muted); }
    .message-input:disabled { opacity: 0.6; cursor: not-allowed; }

    .send-btn {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      border-radius: var(--border-radius-sm);
      background: var(--color-primary);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
      touch-action: manipulation;
      transition: background 0.15s, transform 0.1s;
    }

    .send-btn:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: scale(1.04);
    }

    .send-btn:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .input-disclaimer {
      text-align: center;
      font-size: 0.68rem;
      color: var(--text-muted);
      margin-top: 6px;
      line-height: 1.4;
      padding: 0 4px;
    }

    @media (max-width: 480px) {
      .input-area { padding: 8px 10px max(8px, env(safe-area-inset-bottom)); }
      .input-wrapper { padding: 6px 10px; gap: 6px; }
      .send-btn { width: 38px; height: 38px; min-width: 38px; min-height: 38px; }
      .input-disclaimer { font-size: 0.62rem; margin-top: 4px; }
    }
  `]
})
export class ChatInputComponent {
  @Input() isLoading = false;
  @Output() messageSent = new EventEmitter<string>();
  @Output() focused = new EventEmitter<void>();
  @ViewChild('textareaEl') textareaEl!: ElementRef<HTMLTextAreaElement>;
  langService = inject(LanguageService);
  inputText = '';

  onFocus(): void {
    this.focused.emit();
    setTimeout(() => {
      this.textareaEl?.nativeElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 120);
  }

  onSend(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;
    this.messageSent.emit(text);
    this.inputText = '';
    setTimeout(() => this.autoResize(), 0);
  }

  onEnter(event: KeyboardEvent): void {
    // IME composition safety check: prevents premature submit while IME is converting characters
    if (event.isComposing || event.keyCode === 229 || event.shiftKey) {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSend();
    }
  }

  autoResize(): void {
    const el = this.textareaEl?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }

  setMessage(text: string): void {
    this.inputText = text;
    setTimeout(() => {
      this.autoResize();
      this.textareaEl?.nativeElement.focus();
    }, 0);
  }
}

