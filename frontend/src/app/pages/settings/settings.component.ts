import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { AppIconComponent } from '../../shared/components/icon/app-icon.component';
import { Language, Theme } from '../../models/chat.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppIconComponent],
  template: `
    <div class="settings-layout">
      <app-header [showSidebarToggle]="false" />
      <main class="settings-main">
        <div class="settings-container">
          <div class="settings-header">
            <a
              routerLink="/chat"
              class="back-btn"
              [attr.aria-label]="langService.t('رجوع إلى المحادثة', 'Back to chat')"
            >
              <app-icon name="arrow-left" [size]="16" class="back-icon" />
              <span>{{ langService.t('رجوع', 'Back') }}</span>
            </a>
            <h1>{{ langService.t('الإعدادات', 'Settings') }}</h1>
          </div>
          <section class="settings-section">
            <h2>{{ langService.t('اللغة', 'Language') }}</h2>
            <div class="option-group" role="radiogroup" [attr.aria-label]="langService.t('اختيار اللغة', 'Select language')">
              <button
                type="button"
                class="option-btn"
                [class.active]="langService.language() === 'ar'"
                (click)="setLanguage('ar')"
                role="radio"
                [attr.aria-checked]="langService.language() === 'ar'"
              >
                <app-icon name="globe" [size]="16" />
                <span>العربية</span>
              </button>
              <button
                type="button"
                class="option-btn"
                [class.active]="langService.language() === 'en'"
                (click)="setLanguage('en')"
                role="radio"
                [attr.aria-checked]="langService.language() === 'en'"
              >
                <app-icon name="globe" [size]="16" />
                <span>English</span>
              </button>
            </div>
          </section>
          <section class="settings-section">
            <h2>{{ langService.t('المظهر', 'Appearance') }}</h2>
            <div class="option-group" role="radiogroup" [attr.aria-label]="langService.t('اختيار المظهر', 'Select theme')">
              <button
                type="button"
                class="option-btn"
                [class.active]="themeService.theme() === 'light'"
                (click)="setTheme('light')"
                role="radio"
                [attr.aria-checked]="themeService.theme() === 'light'"
              >
                <app-icon name="sun" [size]="16" />
                <span>{{ langService.t('فاتح', 'Light') }}</span>
              </button>
              <button
                type="button"
                class="option-btn"
                [class.active]="themeService.theme() === 'dark'"
                (click)="setTheme('dark')"
                role="radio"
                [attr.aria-checked]="themeService.theme() === 'dark'"
              >
                <app-icon name="moon" [size]="16" />
                <span>{{ langService.t('داكن', 'Dark') }}</span>
              </button>
              <button
                type="button"
                class="option-btn"
                [class.active]="themeService.theme() === 'system'"
                (click)="setTheme('system')"
                role="radio"
                [attr.aria-checked]="themeService.theme() === 'system'"
              >
                <app-icon name="settings" [size]="16" />
                <span>{{ langService.t('النظام', 'System') }}</span>
              </button>
            </div>
          </section>
          <section class="settings-section">
            <h2>{{ langService.t('عن التطبيق', 'About') }}</h2>
            <div class="about-card">
              <div class="about-row"><span class="about-label">{{ langService.t('الاسم', 'Name') }}</span><span>LubriExpert AI</span></div>
              <div class="about-row"><span class="about-label">{{ langService.t('الإصدار', 'Version') }}</span><span>1.0.0</span></div>
              <div class="about-row"><span class="about-label">{{ langService.t('الذكاء الاصطناعي', 'AI') }}</span><span>{{ langService.t('مدعوم بنماذج لغوية متقدمة', 'Powered by Advanced Language Models') }}</span></div>
              <div class="about-row"><span class="about-label">{{ langService.t('التخصص', 'Specialty') }}</span><span>{{ langService.t('التشحيم الصناعي والسيارات', 'Automotive & Industrial Lubrication') }}</span></div>
              <div class="disclaimer">
                <app-icon name="alert-triangle" [size]="16" class="disclaimer-icon" />
                <span>{{ langService.t('دائماً تحقق من توصيات الشركة المصنعة لأي توصيات تشحيم.', 'Always verify manufacturer specifications for any lubrication recommendations.') }}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .settings-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      height: 100dvh;
      min-height: 100dvh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: var(--bg-app);
    }
    .settings-main {
      flex: 1;
      padding: 28px 20px max(28px, env(safe-area-inset-bottom));
      background: var(--bg-app);
      width: 100%;
    }
    .settings-container { max-width: 600px; margin: 0 auto; width: 100%; }
    .settings-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
    .settings-header h1 { font-size: 1.4rem; font-weight: 700; color: var(--text-primary); }
    .back-btn {
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: var(--border-radius-sm);
      background: var(--bg-hover);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      touch-action: manipulation;
      transition: background 0.15s, color 0.15s;

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }
    .back-btn:hover { background: var(--color-primary-light); }

    [dir='rtl'] .back-icon {
      transform: scaleX(-1);
    }

    .settings-section {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 18px;
      margin-bottom: 16px;
      box-shadow: var(--shadow-sm);
    }
    .settings-section h2 {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .option-group { display: flex; gap: 8px; flex-wrap: wrap; }
    .option-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 10px 16px;
      min-height: 40px;
      border: 1.5px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      background: var(--bg-app);
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
      touch-action: manipulation;

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }
    .option-btn.active {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: rgba(26,111,196,0.08);
      font-weight: 600;
    }
    .option-btn:hover:not(.active), .option-btn:active {
      border-color: var(--border-color-strong);
      background: var(--bg-hover);
    }
    .about-card { display: flex; flex-direction: column; gap: 10px; }
    .about-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color);
      gap: 12px;
    }
    .about-row:last-of-type { border-bottom: none; padding-bottom: 0; }
    .about-label { color: var(--text-muted); font-weight: 500; flex-shrink: 0; }
    .disclaimer {
      font-size: 0.78rem;
      color: var(--text-muted);
      background: var(--bg-hover);
      border-radius: var(--border-radius-sm);
      padding: 10px 12px;
      line-height: 1.5;
      border-inline-start: 3px solid var(--color-accent);
      display: flex;
      align-items: flex-start;
      gap: 8px;

      .disclaimer-icon {
        flex-shrink: 0;
        margin-top: 2px;
        color: var(--color-accent);
      }
    }
    @media (max-width: 480px) {
      .settings-main { padding: 16px 12px max(16px, env(safe-area-inset-bottom)); }
      .settings-section { padding: 14px 12px; }
      .settings-header { margin-bottom: 16px; }
      .settings-header h1 { font-size: 1.2rem; }
      .option-btn { padding: 8px 12px; font-size: 0.8rem; }
      .about-row { font-size: 0.8rem; flex-wrap: wrap; }
    }
  `]
})
export class SettingsComponent {
  langService = inject(LanguageService);
  themeService = inject(ThemeService);
  setLanguage(lang: Language): void { this.langService.setLanguage(lang); }
  setTheme(theme: Theme): void { this.themeService.setTheme(theme); }
}
