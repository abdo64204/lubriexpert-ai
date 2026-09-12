import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <button
      class="btn btn-ghost btn-icon theme-btn"
      (click)="themeService.toggleTheme()"
      [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      {{ themeService.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
  styles: [`.theme-btn { font-size: 1rem; }`],
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
}
