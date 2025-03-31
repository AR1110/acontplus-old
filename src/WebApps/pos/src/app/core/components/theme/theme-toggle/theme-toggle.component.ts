import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '@ui/store/theme.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-theme-toggle',
  imports: [MatIconButton, MatIcon, AsyncPipe],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  darkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.darkMode$ = this.themeService.isDarkMode$;
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
