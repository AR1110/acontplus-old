import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { SettingsService } from '@core/bootstrap';
import { debounceTime, tap } from 'rxjs';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

@Component({
  selector: 'app-user',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <img class="avatar" [src]="user.avatar" width="24" alt="avatar" />
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="config/profile/settings" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>{{ 'profile' | translate }}</span>
      </button>
      <button mat-menu-item (click)="restore()">
        <mat-icon>restore</mat-icon>
        <span>{{ 'restore_defaults' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: `
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50rem;
    }
  `,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserButton implements OnInit {
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsService);
  private tokenUseCase = inject(TokenUseCase);

  user = {
    avatar: '/assets/images/user-avatar.jpg',
  } as any;

  ngOnInit(): void {}

  logout() {
    this.tokenUseCase.clear();
    this.router.navigateByUrl('/auth').then();
  }

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}
