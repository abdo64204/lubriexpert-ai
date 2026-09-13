import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { Language } from '../../../models/chat.models';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <div class="lang-switcher" role="group" aria-label="Language selector">
      <button
        class="lang-btn"
        [class.active]="langService.language() === 'ar'"
        (click)="setLang('ar')"
        title="العربية"
        aria-label="Switch to Arabic"
      >العربية</button>
      <span class="sep" aria-hidden="true">|</span>
      <button
        class="lang-btn"
        [class.active]="langService.language() === 'en'"
        (click)="setLang('en')"
        title="English"
        aria-label="Switch to English"
      >English</button>
    </div>
  `,
  styles: [`
    .lang-switcher {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .lang-btn {
      background: none;
      border: none;
      padding: 5px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-muted);
      transition: all var(--transition);
      font-family: inherit;
      line-height: 1;
      touch-action: manipulation;

      &.active {
        color: var(--color-primary);
        font-weight: 600;
      }

      &:hover:not(.active), &:active {
        background: var(--bg-hover);
        color: var(--text-primary);
      }
    }

    .sep {
      color: var(--border-color-strong);
      font-size: 0.75rem;
      user-select: none;
    }

    @media (max-width: 480px) {
      .lang-btn {
        padding: 4px 5px;
        font-size: 0.75rem;
      }
    }
  `],
})
export class LanguageSwitcherComponent {
  langService = inject(LanguageService);

  setLang(lang: Language): void {
    this.langService.setLanguage(lang);
  }
}
