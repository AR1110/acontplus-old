import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="acontplus-user-panel" routerLink="config/profile/settings">
      <img class="acontplus-user-panel-avatar" [src]="user().avatar" alt="avatar" width="64" />
      <div class="acontplus-user-panel-info">
        <h4>{{ user().roleName }}</h4>
        <h5>{{ user().username }}</h5>
      </div>
    </div>
  `,
  styleUrl: './user-panel.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
})
export class UserPanel implements OnInit {
  tokenUseCase = inject(TokenUseCase);
  user = signal({} as any);

  ngOnInit(): void {
    const session = this.tokenUseCase.getSession();
    if (session) {
      this.user.set(session.userData);
    }
  }
}
