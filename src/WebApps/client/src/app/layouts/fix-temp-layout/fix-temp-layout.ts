import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@core/theme/theme.service';
import { RouterOutlet } from '@angular/router';
import { ThemeClass } from '@core/theme/types';

@Component({
  selector: 'app-fix-temp-layout',
  imports: [RouterOutlet],
  templateUrl: './fix-temp-layout.html',
  styleUrl: './fix-temp-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixTempLayout {
  #themeService = inject(ThemeService);
  activeTheme = this.#themeService.theme;

  changeTheme(newTheme: ThemeClass) {
    this.#themeService.changeTheme(newTheme);
  }
}
