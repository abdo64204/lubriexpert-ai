import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { AppIconComponent } from '../icon/app-icon.component';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <button
      class="btn btn-ghost btn-icon theme-btn"
      type="button"
      (click)="themeService.toggleTheme()"
      [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      [attr.aria-label]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      <app-icon [name]="themeService.isDark() ? 'sun' : 'moon'" [size]="18" />
    </button>
  `,
  styles: [`
    .theme-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }
  `],
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
}
