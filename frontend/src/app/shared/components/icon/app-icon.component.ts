import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AppIconName =
  | 'brand-mark'
  | 'menu'
  | 'close'
  | 'plus'
  | 'trash'
  | 'settings'
  | 'sun'
  | 'moon'
  | 'globe'
  | 'send'
  | 'spinner'
  | 'copy'
  | 'check'
  | 'refresh'
  | 'thumb-up'
  | 'thumb-down'
  | 'user'
  | 'sparkles'
  | 'alert-triangle'
  | 'arrow-left'
  | 'car'
  | 'factory'
  | 'gear'
  | 'droplet'
  | 'search'
  | 'scale';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      [attr.stroke]="name === 'brand-mark' ? null : 'currentColor'"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="app-icon"
      [class]="className"
      aria-hidden="true"
      focusable="false"
      [ngSwitch]="name"
    >
      <!-- BRAND MARK: Precision Oil Droplet + Engineering Geometry -->
      <g *ngSwitchCase="'brand-mark'">
        <defs>
          <linearGradient id="lubriGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="50%" stop-color="#1a6fc4" />
            <stop offset="100%" stop-color="#0e4b8a" />
          </linearGradient>
          <linearGradient id="amberCore" x1="12" y1="10" x2="16" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#fbbf24" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
        </defs>
        <!-- Outer precision droplet -->
        <path
          d="M12 2.5 C12 2.5, 5.5 10.5, 5.5 15.5 A6.5 6.5 0 0 0 18.5 15.5 C18.5 10.5, 12 2.5, 12 2.5 Z"
          fill="url(#lubriGrad)"
          stroke="#1558a0"
          stroke-width="1.2"
        />
        <!-- Engineering precision facet ring -->
        <path
          d="M12 7.5 L15 11.5 L14 17.5 L10 17.5 L9 11.5 Z"
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          stroke-width="1.2"
        />
        <!-- Amber lubricant energy core -->
        <circle cx="12" cy="14" r="2.4" fill="url(#amberCore)" />
      </g>

      <!-- MENU / HAMBURGER -->
      <g *ngSwitchCase="'menu'">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </g>

      <!-- CLOSE -->
      <g *ngSwitchCase="'close'">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </g>

      <!-- PLUS / NEW CHAT -->
      <g *ngSwitchCase="'plus'">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </g>

      <!-- TRASH -->
      <g *ngSwitchCase="'trash'">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1.5 14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </g>

      <!-- SETTINGS GEAR -->
      <g *ngSwitchCase="'settings'">
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </g>

      <!-- SUN -->
      <g *ngSwitchCase="'sun'">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>

      <!-- MOON -->
      <g *ngSwitchCase="'moon'">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </g>

      <!-- GLOBE -->
      <g *ngSwitchCase="'globe'">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </g>

      <!-- SEND -->
      <g *ngSwitchCase="'send'">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </g>

      <!-- SPINNER -->
      <g *ngSwitchCase="'spinner'">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </g>

      <!-- COPY -->
      <g *ngSwitchCase="'copy'">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </g>

      <!-- CHECK -->
      <g *ngSwitchCase="'check'">
        <polyline points="20 6 9 17 4 12" />
      </g>

      <!-- REFRESH / REGENERATE -->
      <g *ngSwitchCase="'refresh'">
        <path d="M1 4v6h6" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </g>

      <!-- THUMB UP -->
      <g *ngSwitchCase="'thumb-up'">
        <path
          d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        />
      </g>

      <!-- THUMB DOWN -->
      <g *ngSwitchCase="'thumb-down'">
        <path
          d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"
        />
      </g>

      <!-- USER -->
      <g *ngSwitchCase="'user'">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </g>

      <!-- SPARKLES -->
      <g *ngSwitchCase="'sparkles'">
        <path d="M12 3l1.9 4.9L19 10l-5.1 2.1L12 17l-1.9-4.9L5 10l5.1-2.1L12 3z" />
        <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
      </g>

      <!-- ALERT TRIANGLE -->
      <g *ngSwitchCase="'alert-triangle'">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </g>

      <!-- ARROW LEFT -->
      <g *ngSwitchCase="'arrow-left'">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </g>

      <!-- CAR (Automotive) -->
      <g *ngSwitchCase="'car'">
        <path d="M5 17h14m-1.5-6.5l-2-4.5H8.5l-2 4.5" />
        <rect x="3" y="11" width="18" height="6" rx="2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </g>

      <!-- FACTORY (Industrial) -->
      <g *ngSwitchCase="'factory'">
        <path d="M2 20h20M6 20V8l5 4V8l5 4V4l4 4v12" />
        <line x1="18" y1="14" x2="18.01" y2="14" />
        <line x1="18" y1="17" x2="18.01" y2="17" />
      </g>

      <!-- GEAR (Machinery) -->
      <g *ngSwitchCase="'gear'">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v3m0 16v3M1 12h3m16 0h3m-4.22-7.78l-2.12 2.12m-9.32 9.32l-2.12 2.12m0-13.56l2.12 2.12m9.32 9.32l2.12 2.12" />
      </g>

      <!-- DROPLET (Grease / Lubricants) -->
      <g *ngSwitchCase="'droplet'">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </g>

      <!-- SEARCH (Mobil & Products) -->
      <g *ngSwitchCase="'search'">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </g>

      <!-- SCALE (Comparison) -->
      <g *ngSwitchCase="'scale'">
        <path d="M16 16l3-8 3 8a3 3 0 0 1-6 0zM2 16l3-8 3 8a3 3 0 0 1-6 0z" />
        <line x1="7" y1="21" x2="17" y2="21" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="4" y1="7" x2="20" y2="7" />
      </g>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
    }

    .app-icon {
      display: inline-block;
      vertical-align: middle;
      flex-shrink: 0;
      transition: stroke 0.15s ease, transform 0.15s ease;
    }
  `]
})
export class AppIconComponent {
  @Input({ required: true }) name!: AppIconName;
  @Input() size = 18;
  @Input() strokeWidth = 2;
  @Input() className = '';
}
