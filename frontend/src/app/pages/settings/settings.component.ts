import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { Language, Theme } from '../../models/chat.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent],
  template: `
    <div class="settings-layout">
      <app-header />
      <main class="settings-main">
        <div class="settings-container">
          <div class="settings-header">
            <a routerLink="/chat" class="back-btn">← {{ langService.t('رجوع', 'Back') }}</a>
            <h1>{{ langService.t('الإعدادات', 'Settings') }}</h1>
          </div>
          <section class="settings-section">
            <h2>{{ langService.t('اللغة', 'Language') }}</h2>
            <div class="option-group">
              <button class="option-btn" [class.active]="langService.language() === 'ar'" (click)="setLanguage('ar')"><span>🇸🇦</span> العربية</button>
              <button class="option-btn" [class.active]="langService.language() === 'en'" (click)="setLanguage('en')"><span>🇺🇸</span> English</button>
            </div>
          </section>
          <section class="settings-section">
            <h2>{{ langService.t('المظهر', 'Appearance') }}</h2>
            <div class="option-group">
              <button class="option-btn" [class.active]="themeService.theme() === 'light'" (click)="setTheme('light')">☀️ {{ langService.t('فاتح', 'Light') }}</button>
              <button class="option-btn" [class.active]="themeService.theme() === 'dark'" (click)="setTheme('dark')">🌙 {{ langService.t('داكن', 'Dark') }}</button>
              <button class="option-btn" [class.active]="themeService.theme() === 'system'" (click)="setTheme('system')">🖥️ {{ langService.t('النظام', 'System') }}</button>
            </div>
          </section>
          <section class="settings-section">
            <h2>{{ langService.t('عن التطبيق', 'About') }}</h2>
            <div class="about-card">
              <div class="about-row"><span class="about-label">{{ langService.t('الاسم', 'Name') }}</span><span>LubriExpert AI</span></div>
              <div class="about-row"><span class="about-label">{{ langService.t('الإصدار', 'Version') }}</span><span>1.0.0</span></div>
              <div class="about-row"><span class="about-label">{{ langService.t('الذكاء الاصطناعي', 'AI') }}</span><span>{{ langService.t('مدعوم بنماذج لغوية متقدمة', 'Powered by Advanced Language Models') }}</span></div>
              <div class="about-row"><span class="about-label">{{ langService.t('التخصص', 'Specialty') }}</span><span>{{ langService.t('التشحيم الصناعي والسيارات', 'Automotive & Industrial Lubrication') }}</span></div>
              <div class="disclaimer">⚠️ {{ langService.t('دائماً تحقق من توصيات الشركة المصنعة لأي توصيات تشحيم.', 'Always verify manufacturer specifications for any lubrication recommendations.') }}</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .settings-layout { display: flex; flex-direction: column; min-height: 100vh; }
    .settings-main { flex: 1; padding: 32px 20px; background: var(--bg-app); }
    .settings-container { max-width: 600px; margin: 0 auto; }
    .settings-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
    .settings-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
    .back-btn { color: var(--color-primary); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
    .back-btn:hover { text-decoration: underline; }
    .settings-section { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 20px; margin-bottom: 16px; }
    .settings-section h2 { font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 14px; }
    .option-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .option-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border: 1.5px solid var(--border-color); border-radius: var(--border-radius-sm); background: var(--bg-app); color: var(--text-secondary); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit; }
    .option-btn.active { border-color: var(--color-primary); color: var(--color-primary); background: rgba(26,111,196,0.08); font-weight: 600; }
    .option-btn:hover:not(.active) { border-color: var(--border-color-strong); background: var(--bg-hover); }
    .about-card { display: flex; flex-direction: column; gap: 12px; }
    .about-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
    .about-row:last-of-type { border-bottom: none; padding-bottom: 0; }
    .about-label { color: var(--text-muted); font-weight: 500; }
    .disclaimer { font-size: 0.8rem; color: var(--text-muted); background: var(--bg-hover); border-radius: var(--border-radius-sm); padding: 10px 14px; line-height: 1.5; border-inline-start: 3px solid var(--color-accent); }
  `]
})
export class SettingsComponent {
  langService = inject(LanguageService);
  themeService = inject(ThemeService);
  setLanguage(lang: Language): void { this.langService.setLanguage(lang); }
  setTheme(theme: Theme): void { this.themeService.setTheme(theme); }
}
