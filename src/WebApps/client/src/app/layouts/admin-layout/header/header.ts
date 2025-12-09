import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Input,
  output,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import screenfull from 'screenfull';

import { NotificationButton } from '../widgets/notification-button';
import { TranslateButton } from '../widgets/translate-button';
import { GithubButton } from '../widgets/github-button';
import { UserButton } from '../widgets/user-button';
import { Branding } from '../widgets/branding';
import { AdminLayoutService } from '@core/services/admin-layout.service';
import { ThemeToggle } from '@acontplus/ng-components';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'acontplus-header',
  },
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    Branding,
    NotificationButton,
    TranslateButton,
    UserButton,
    ThemeToggle,
  ],
})
export class Header {
  adminLayoutSvc = inject(AdminLayoutService);
  showToggle = input(false);
  showBranding = input(false);

  toggleSidenav = output<void>();
  toggleSidenavNotice = output<void>();

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}
