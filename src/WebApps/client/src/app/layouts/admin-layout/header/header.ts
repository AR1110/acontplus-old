import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import screenfull from 'screenfull';

import { NotificationButton } from '../widgets/notification-button';
import { TranslateButton } from '../widgets/translate-button';
import { GithubButton } from '../widgets/github-button';
import { UserButton } from '../widgets/user-button';
import { Branding } from '../widgets/branding';

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
  ],
})
export class Header {
  @Input() showToggle = true;
  @Input() showBranding = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}
