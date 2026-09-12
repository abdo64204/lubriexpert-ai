import { Component, Output, EventEmitter, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="input-area">
      <div class="input-wrapper">
        <textarea #textareaEl class="message-input" [(ngModel)]="inputText"
          [placeholder]="langService.t('اكتب سؤالك هنا...', 'Type your question here...')"
          [disabled]="isLoading" (keydown.enter)="onEnter($event)" (input)="autoResize()"
          rows="1" maxlength="4000"></textarea>
        <button class="send-btn" [disabled]="isLoading || !inputText.trim()" (click)="onSend()"
          [title]="langService.t('إرسال', 'Send')">
          <span *ngIf="!isLoading">➤</span>
          <span *ngIf="isLoading" class="spinner">⟳</span>
        </button>
      </div>
      <p class="input-disclaimer">{{ langService.t('LubriExpert AI قد يرتكب أخطاء. تحقق دائماً من توصيات الشركة المصنعة.', 'LubriExpert AI can make mistakes. Always verify manufacturer recommendations.') }}</p>
    </div>
  `,
  styles: [`
    .input-area { padding: 12px 20px 16px; background: var(--bg-chat); border-top: 1px solid var(--border-color); }
    .input-wrapper { display: flex; align-items: flex-end; gap: 10px; background: var(--bg-input); border: 1.5px solid var(--border-color); border-radius: var(--border-radius); padding: 10px 12px; transition: border-color 0.15s; }
    .input-wrapper:focus-within { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(26,111,196,0.12); }
    .message-input { flex: 1; border: none; background: transparent; resize: none; font-family: inherit; font-size: 0.9rem; line-height: 1.5; color: var(--text-primary); max-height: 150px; min-height: 24px; overflow-y: auto; }
    .message-input:focus { outline: none; }
    .message-input::placeholder { color: var(--text-muted); }
    .message-input:disabled { opacity: 0.6; cursor: not-allowed; }
    .send-btn { width: 36px; height: 36px; border-radius: 8px; background: var(--color-primary); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; transition: background 0.15s, transform 0.1s; }
    .send-btn:hover:not(:disabled) { background: var(--color-primary-dark); transform: scale(1.05); }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .spinner { display: inline-block; animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .input-disclaimer { text-align: center; font-size: 0.68rem; color: var(--text-muted); margin-top: 8px; line-height: 1.4; }
    @media (max-width: 640px) { .input-area { padding: 8px 12px 10px; } }
  `]
})
export class ChatInputComponent {
  @Input() isLoading = false;
  @Output() messageSent = new EventEmitter<string>();
  @ViewChild('textareaEl') textareaEl!: ElementRef<HTMLTextAreaElement>;
  langService = inject(LanguageService);
  inputText = '';

  onSend(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;
    this.messageSent.emit(text);
    this.inputText = '';
    setTimeout(() => this.autoResize(), 0);
  }

  onEnter(event: Event): void {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) { event.preventDefault(); this.onSend(); }
  }

  autoResize(): void {
    const el = this.textareaEl?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  }

  setMessage(text: string): void {
    this.inputText = text;
    setTimeout(() => { this.autoResize(); this.textareaEl?.nativeElement.focus(); }, 0);
  }
}
