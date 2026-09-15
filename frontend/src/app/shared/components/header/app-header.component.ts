import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { AppIconComponent } from '../icon/app-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, LanguageSwitcherComponent, ThemeSwitcherComponent, AppIconComponent],
  template: `
    <header class="app-header">
      <div class="header-start">
        <button
          *ngIf="showSidebarToggle"
          type="button"
          class="header-sidebar-btn"
          (click)="toggleSidebar.emit()"
          [attr.aria-expanded]="sidebarOpen"
          [attr.aria-label]="sidebarOpen ? langService.t('إغلاق القائمة', 'Close menu') : langService.t('فتح القائمة', 'Open menu')"
          [title]="sidebarOpen ? langService.t('إغلاق', 'Close') : langService.t('المحادثات', 'Conversations')"
        >
          <app-icon [name]="sidebarOpen ? 'close' : 'menu'" [size]="20" />
        </button>

        <div class="brand">
          <div class="brand-icon-wrapper" aria-hidden="true">
            <app-icon name="brand-mark" [size]="26" />
          </div>
          <div class="brand-text">
            <span class="brand-name">LubriExpert AI</span>
            <span class="brand-tagline">
              {{ langService.t('خبير التشحيم الذكي', 'AI Lubrication Expert') }}
            </span>
          </div>
        </div>
      </div>

      <nav class="header-nav" aria-label="Main navigation">
        <app-language-switcher />
        <app-theme-switcher />
        <a
          routerLink="/settings"
          class="btn btn-ghost btn-icon settings-btn"
          [title]="langService.t('الإعدادات', 'Settings')"
          aria-label="Settings"
        >
          <app-icon name="settings" [size]="18" />
        </a>
      </nav>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: var(--header-height);
      background: var(--bg-header);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      flex-shrink: 0;
      z-index: 50;
      width: 100%;
    }

    .header-start {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .header-sidebar-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      min-width: 36px;
      min-height: 36px;
      padding: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      touch-action: manipulation;
      transition: background 0.15s, color 0.15s, border-color 0.15s;

      &:hover, &:active {
        background: var(--bg-hover);
        color: var(--text-primary);
        border-color: var(--border-color-strong);
      }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .brand-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
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

    .settings-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 0 12px;
        height: 56px;
      }
      .header-sidebar-btn {
        display: inline-flex;
      }
      .header-start {
        gap: 8px;
      }
      .brand-tagline { display: none; }
      .brand { gap: 8px; }
      .brand-name { font-size: 0.95rem; }
      .header-nav { gap: 4px; }
    }

    @media (max-width: 360px) {
      .app-header {
        padding: 0 8px;
      }
      .header-start {
        gap: 6px;
      }
      .header-sidebar-btn {
        width: 34px;
        height: 34px;
        min-width: 34px;
        min-height: 34px;
      }
      .brand-name { font-size: 0.85rem; }
      .header-nav { gap: 2px; }
    }
  `],
})
export class AppHeaderComponent {
  @Input() sidebarOpen = false;
  @Input() showSidebarToggle = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  langService = inject(LanguageService);
}
