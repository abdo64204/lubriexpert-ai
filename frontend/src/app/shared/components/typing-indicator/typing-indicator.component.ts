import { Component } from '@angular/core';

@Component({
  selector: 'app-typing-indicator',
  standalone: true,
  template: `
    <div class="typing-indicator">
      <div class="ai-avatar"><span>AI</span></div>
      <div class="dots-container">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  `,
  styles: [`
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
    }

    .ai-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .dots-container {
      display: flex;
      align-items: center;
      gap: 5px;
      background: var(--bg-ai-bubble);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      border-bottom-left-radius: 4px;
      padding: 12px 16px;
      box-shadow: var(--shadow-sm);
    }

    [dir='rtl'] .dots-container {
      border-bottom-left-radius: var(--border-radius-lg);
      border-bottom-right-radius: 4px;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--typing-dot);
      animation: dotBounce 1.3s ease-in-out infinite;

      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.22s; }
      &:nth-child(3) { animation-delay: 0.44s; }
    }

    @keyframes dotBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-7px); opacity: 1; }
    }
  `],
})
export class TypingIndicatorComponent {}
