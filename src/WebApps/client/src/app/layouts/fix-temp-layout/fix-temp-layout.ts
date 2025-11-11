import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSwitcher } from '@acontplus/ng-components';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fix-temp-layout',
  imports: [RouterOutlet],
  templateUrl: './fix-temp-layout.html',
  styleUrl: './fix-temp-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixTempLayout {
  private readonly themeSwitcher = inject(ThemeSwitcher);
  darkMode$: Observable<boolean>;

  constructor() {
    this.darkMode$ = this.themeSwitcher.isDarkMode$;
  }

  changeTheme() {
    this.themeSwitcher.toggleDarkMode();
  }
}
