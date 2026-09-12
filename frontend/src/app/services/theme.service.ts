import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/chat.models';

const STORAGE_KEY = 'lubriexpert_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<Theme>(this.loadTheme());
  readonly theme = this._theme.asReadonly();
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.applyTheme(this._theme());
    this.mediaQuery.addEventListener('change', () => {
      if (this._theme() === 'system') { this.applyTheme('system'); }
    });
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'light' || stored === 'dark' || stored === 'system') ? stored as Theme : 'system';
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const resolvedTheme = theme === 'system' ? (this.mediaQuery.matches ? 'dark' : 'light') : theme;
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }

  isDark(): boolean {
    const t = this._theme();
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return this.mediaQuery.matches;
  }

  toggleTheme(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }
}
