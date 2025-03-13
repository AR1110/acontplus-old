import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemePalette } from '@angular/material/core';

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

export type MaterialButtonStyle =
  | 'basic' // mat-button
  | 'raised' // mat-raised-button
  | 'flat' // mat-flat-button
  | 'stroked' // mat-stroked-button
  | 'icon' // mat-icon-button
  | 'fab' // mat-fab
  | 'mini-fab'; // mat-mini-fab

@Component({
  selector: 'app-theme-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: `./theme-button.component.html`,
  styleUrl: `./theme-button.component.scss`,
})
export class ThemeButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() outlined: boolean = false;
  @Input() disabled: boolean = false;
  @Input() useThemeColor: boolean = false;
  @Input() type: ButtonType = 'button';
  @Input() matStyle: MaterialButtonStyle = 'raised';

  @Output() handleClick = new EventEmitter<unknown>();

  getButtonClasses(): Record<string, boolean> {
    return {
      [`btn-${this.variant}`]: true,
      'btn-outlined': this.outlined && this.matStyle !== 'stroked', // Stroked buttons are already outlined
    };
  }

  getThemeColor(): ThemePalette | null {
    if (!this.useThemeColor) return null;

    switch (this.variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      case 'danger':
        return 'warn';
      default:
        return null;
    }
  }
}
