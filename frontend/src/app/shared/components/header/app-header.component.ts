import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LanguageSwitcherComponent, ThemeSwitcherComponent],
  template: `
    <header class="app-header">
      <div class="brand">
        <span class="brand-icon" aria-hidden="true">🛢️</span>
        <div class="brand-text">
          <span class="brand-name">LubriExpert AI</span>
          <span class="brand-tagline">
            {{ langService.t('خبير التشحيم الذكي', 'AI Lubrication Expert') }}
          </span>
        </div>
      </div>

      <nav class="header-nav" aria-label="Main navigation">
        <app-language-switcher />
        <app-theme-switcher />
        <a routerLink="/settings" class="btn btn-ghost btn-icon settings-btn" title="Settings" aria-label="Settings">
          ⚙️
        </a>
      </nav>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 18px;
      height: var(--header-height);
      background: var(--bg-header);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      flex-shrink: 0;
      z-index: 50;
      width: 100%;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .brand-icon {
      font-size: 1.75rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    .brand-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.025em;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .brand-tagline {
      font-size: 0.66rem;
      font-weight: 600;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      white-space: nowrap;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .settings-btn { font-size: 1rem; touch-action: manipulation; }

    @media (max-width: 768px) {
      .app-header {
        padding-inline-start: 52px;
        padding-inline-end: 12px;
        height: 56px;
      }
      .brand-tagline { display: none; }
      .brand { gap: 6px; }
      .brand-icon { font-size: 1.4rem; }
      .brand-name { font-size: 0.95rem; }
      .header-nav { gap: 4px; }
    }

    @media (max-width: 360px) {
      .app-header {
        padding-inline-start: 46px;
        padding-inline-end: 8px;
      }
      .brand-name { font-size: 0.85rem; }
      .brand-icon { font-size: 1.25rem; }
      .header-nav { gap: 2px; }
    }
  `],
})
export class AppHeaderComponent {
  langService = inject(LanguageService);
}
