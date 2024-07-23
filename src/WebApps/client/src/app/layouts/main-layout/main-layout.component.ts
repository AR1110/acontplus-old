import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { THEME_OPTIONS } from '@core/theme/theme-options';
import { ThemeService } from '@core/theme/theme.service';
import { ThemeClass } from '@core/theme/types';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  themeOptions = THEME_OPTIONS;
  #themeService = inject(ThemeService);
  activeTheme = this.#themeService.theme;

  changeTheme(newTheme: ThemeClass) {
    this.#themeService.changeTheme(newTheme);
  }

  ngOnInit(): void {}
}
