import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  imports: [
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    DynamicCard,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    TranslateModule,
    BreadcrumbComponent,
  ],
})
export class ProfileLayout implements OnInit {
  private readonly tokenUseCase = inject(TokenUseCase);
  private readonly router = inject(Router);
  user = signal({} as any);
  ngOnInit(): void {
    const session = this.tokenUseCase.getSession();
    if (session) {
      this.user.set(session.userData);
    }
  }
  logout() {
    this.tokenUseCase.clear();
    this.router.navigateByUrl('/auth').then();
  }
}
