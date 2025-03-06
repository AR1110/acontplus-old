import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { ThemePalette } from '@angular/material/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-theme-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      mat-raised-button
      [ngClass]="getButtonClasses()"
      [disabled]="disabled"
      [type]="type"
      (click)="handleClick.emit($event)"
    >
      @if (icon) {
        <mat-icon>{{ icon }}</mat-icon>
      }
      <ng-content></ng-content>
      {{ text }}
    </button>
  `,
  styles: [
    `
      /* Bootstrap-inspired color schemes */
      .btn-primary {
        background-color: var(--primary-color, #007bff) !important;
        color: var(--on-primary-color, white) !important;
      }

      .btn-secondary {
        background-color: var(--secondary-color, #6c757d) !important;
        color: var(--on-secondary-color, white) !important;
      }

      .btn-success {
        background-color: var(--success-color, #28a745) !important;
        color: var(--on-success-color, white) !important;
      }

      .btn-danger {
        background-color: var(--danger-color, #dc3545) !important;
        color: var(--on-danger-color, white) !important;
      }

      .btn-warning {
        background-color: var(--warning-color, #ffc107) !important;
        color: var(--on-warning-color, #212529) !important;
      }

      .btn-info {
        background-color: var(--info-color, #17a2b8) !important;
        color: var(--on-info-color, white) !important;
      }

      .btn-light {
        background-color: var(--light-color, #f8f9fa) !important;
        color: var(--on-light-color, #212529) !important;
      }

      .btn-dark {
        background-color: var(--dark-color, #343a40) !important;
        color: var(--on-dark-color, white) !important;
      }

      /* Size variations */
      .btn-sm {
        font-size: 0.875rem !important;
        line-height: 1.5 !important;
        padding: 0.25rem 0.5rem !important;
      }

      .btn-lg {
        font-size: 1.25rem !important;
        line-height: 1.5 !important;
        padding: 0.5rem 1rem !important;
      }

      /* Outlined variants */
      .btn-outlined {
        background-color: transparent !important;
        border: 1px solid currentColor !important;
      }

      .btn-primary.btn-outlined {
        color: var(--primary-color, #007bff) !important;
      }

      .btn-secondary.btn-outlined {
        color: var(--secondary-color, #6c757d) !important;
      }

      .btn-success.btn-outlined {
        color: var(--success-color, #28a745) !important;
      }

      .btn-danger.btn-outlined {
        color: var(--danger-color, #dc3545) !important;
      }

      .btn-warning.btn-outlined {
        color: var(--warning-color, #ffc107) !important;
      }

      .btn-info.btn-outlined {
        color: var(--info-color, #17a2b8) !important;
      }

      .btn-light.btn-outlined {
        color: var(--light-color, #f8f9fa) !important;
      }

      .btn-dark.btn-outlined {
        color: var(--dark-color, #343a40) !important;
      }

      button {
        margin: 0.25rem;
      }
    `,
  ],
})
export class ThemeButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() text = '';
  @Input() icon = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() outlined = false;
  @Input() disabled = false;
  @Input() useThemeColor = false;
  @Input() type: ButtonType = 'button'; // Default to regular button

  @Output() handleClick = new EventEmitter<unknown>();

  getButtonClasses(): Record<string, boolean> {
    return {
      [`btn-${this.variant}`]: true,
      [`btn-${this.size}`]: this.size !== 'md',
      'btn-outlined': this.outlined,
    };
  }

  // getThemeColor(): ThemePalette {
  //   if (!this.useThemeColor) return null;
  //
  //   switch (this.variant) {
  //     case 'primary':
  //       return 'primary';
  //     case 'secondary':
  //       return 'accent';
  //     case 'danger':
  //       return 'warn';
  //     default:
  //       return null;
  //   }
  // }
}
