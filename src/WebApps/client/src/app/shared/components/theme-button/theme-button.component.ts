import { Component, Input, input, output } from '@angular/core';
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
  templateUrl: './theme-button.component.html',
  styleUrl: './theme-button.component.scss',
})
export class ThemeButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  text = input<string>('');
  icon = input<string>('');
  outlined = input<boolean>(false);
  disabled = input<boolean>(false);
  useThemeColor = input<boolean>(false); // Use theme color based on variant
  @Input() type: ButtonType = 'button';
  @Input() matStyle: MaterialButtonStyle = 'raised';

  // Additional common button properties
  title = input<string>(''); // Tooltip text shown on hover
  ariaLabel = input<string>(''); // Accessibility label
  name = input<string>(''); // Name attribute for form submission
  id = input<string>(''); // ID for element reference
  form = input<string>(''); // Associated form ID
  tabIndex = input<number>(0); // Tab order
  testId = input<string>(''); // For testing purposes

  handleClick = output<unknown>();

  getButtonClasses(): Record<string, boolean> {
    return {
      [`btn-${this.variant}`]: true,
      'btn-outlined': this.outlined() && this.matStyle !== 'stroked', // Stroked buttons are already outlined
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
