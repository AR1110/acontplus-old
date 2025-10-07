import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="acontplus-user-panel" routerLink="/profile/overview">
      <img class="acontplus-user-panel-avatar" [src]="user.avatar" alt="avatar" width="64" />
      <div class="acontplus-user-panel-info">
        <h4>Emilio</h4>
        <h5>Emilio Senguana</h5>
      </div>
    </div>
  `,
  styleUrl: './user-panel.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
})
export class UserPanel implements OnInit {
  user = {
    avatar: 'images/user-avatar.jpg',
  } as any;

  ngOnInit(): void {
    //  this.auth.user().subscribe((user) => (this.user = user));
  }
}
