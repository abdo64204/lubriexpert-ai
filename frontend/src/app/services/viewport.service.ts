import { Injectable, signal, NgZone, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private ngZone = inject(NgZone);

  readonly isKeyboardVisible = signal<boolean>(false);
  readonly visualViewportHeight = signal<number>(0);

  constructor() {
    if (typeof window !== 'undefined') {
      this.initViewportListeners();
    }
  }

  private initViewportListeners(): void {
    const updateViewport = () => {
      const vv = window.visualViewport;
      const height = vv ? vv.height : window.innerHeight;
      const fullHeight = window.innerHeight;
      const keyboardOpen = fullHeight - height > 140; // Virtual keyboard is typically > 140px

      this.ngZone.run(() => {
        this.visualViewportHeight.set(height);
        this.isKeyboardVisible.set(keyboardOpen);
      });

      // Update CSS custom property for styles to consume directly
      if (document.documentElement) {
        document.documentElement.style.setProperty('--visual-viewport-height', `${height}px`);
        document.documentElement.style.setProperty(
          '--keyboard-offset',
          `${Math.max(0, fullHeight - height)}px`
        );
      }
    };

    // Initial calculation
    updateViewport();

    // Listen to visualViewport if supported (iOS Safari 13+, Chrome 61+, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    }

    // Standard resize and orientation change fallback
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewport, 150);
    });
  }
}
