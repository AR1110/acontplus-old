import { Component, inject, OnInit, signal } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService, UserData } from '@modules/auth/services/auth.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-nav-user-toggle',
  imports: [
    MatIcon,
    MatMenu,
    MatButton,
    MatMenuTrigger,
    MatMenuItem,
    MatTooltip,
  ],
  templateUrl: './nav-user-toggle.component.html',
  styles: ``,
})
export class NavUserToggleComponent implements OnInit {
  private authSvc = inject(AuthService);
  user: UserData = {
    email: '',
    name: '',
  };
  username = signal('');

  logout() {
    this.authSvc.logout();
  }
  ngOnInit(): void {
    const decodedToken = this.authSvc.getDecodedToken();
    if (decodedToken) {
      this.user = decodedToken;
      this.username.set(this.user.name);
    }
  }
}
