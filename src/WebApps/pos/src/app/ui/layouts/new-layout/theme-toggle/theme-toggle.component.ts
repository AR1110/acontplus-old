import { ThemeService } from '@/ui/theme.service';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-theme-toggle',
  imports: [AsyncPipe, MatSlideToggleModule, MatIconModule],
  template: `
    <mat-slide-toggle
      [checked]="themeService.isDarkMode$ | async"
      (change)="themeService.toggleDarkMode()"
    >
      <mat-icon>{{
        (themeService.isDarkMode$ | async) ? 'dark_mode' : 'light_mode'
      }}</mat-icon>
    </mat-slide-toggle>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
      }
      mat-slide-toggle {
        margin: 0 16px;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
