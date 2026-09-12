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
        <span class="brand-icon">🛢️</span>
        <div class="brand-text">
          <span class="brand-name">LubriExpert AI</span>
          <span class="brand-tagline">
            {{ langService.t('خبير التشحيم الذكي', 'AI Lubrication Expert') }}
          </span>
        </div>
      </div>

      <nav class="header-nav">
        <app-language-switcher />
        <app-theme-switcher />
        <a routerLink="/settings" class="btn btn-ghost btn-icon settings-btn" title="Settings">
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
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-icon {
      font-size: 1.75rem;
      line-height: 1;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .brand-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.025em;
      line-height: 1.2;
    }

    .brand-tagline {
      font-size: 0.66rem;
      font-weight: 600;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .settings-btn { font-size: 1rem; }

    @media (max-width: 768px) {
      .app-header { padding-inline-start: 56px; }
      .brand-tagline { display: none; }
    }
  `],
})
export class AppHeaderComponent {
  langService = inject(LanguageService);
}
