import { Component, Output, EventEmitter, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { QUICK_ACTIONS, QuickAction } from '../../../models/chat.models';
import { LanguageService } from '../../../services/language.service';
import { AppIconComponent } from '../icon/app-icon.component';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [NgFor, AppIconComponent],
  template: `
    <div class="quick-actions" role="toolbar" [attr.aria-label]="langService.t('إجراءات سريعة', 'Quick actions')">
      <button
        *ngFor="let a of actions"
        class="chip"
        type="button"
        (click)="actionClicked.emit(langService.language() === 'ar' ? a.messageAr : a.messageEn)"
        [attr.aria-label]="langService.language() === 'ar' ? a.labelAr : a.labelEn"
      >
        <app-icon [name]="a.iconName" [size]="14" class="chip-icon" />
        <span class="chip-label">{{ langService.language() === 'ar' ? a.labelAr : a.labelEn }}</span>
      </button>
    </div>
  `,
  styles: [`
    .quick-actions {
      display: flex;
      gap: 7px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      background: var(--bg-quick-action);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);
      font-family: inherit;
      white-space: nowrap;
      line-height: 1;
      touch-action: manipulation;

      &:hover, &:active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(26, 111, 196, 0.28);
      }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      .chip-icon {
        display: inline-flex;
        align-items: center;
      }
    }

    @media (max-width: 640px) {
      .quick-actions {
        flex-wrap: nowrap;
        overflow-x: auto;
        justify-content: flex-start;
        padding: 4px 2px 8px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        &::-webkit-scrollbar { display: none; }
      }
      .chip {
        padding: 6px 11px;
        font-size: 0.76rem;
        flex-shrink: 0;
      }
    }
  `],
})
export class QuickActionsComponent {
  @Output() actionClicked = new EventEmitter<string>();
  langService = inject(LanguageService);
  actions: QuickAction[] = QUICK_ACTIONS;
}
