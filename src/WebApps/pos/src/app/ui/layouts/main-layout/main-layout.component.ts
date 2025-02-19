import { NavUserInfoToggleComponent } from '@ui/layouts/components/nav-user-info-toggle/nav-user-info-toggle.component';
import { NavUserToggleComponent } from '@ui/layouts/components/nav-user-toggle/nav-user-toggle.component';
import { MainStoreService } from '@domain/services/main-store.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { menusRoutes } from '../menus-routes';

@Component({
  selector: 'app-main-layout',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    NavUserInfoToggleComponent,
    NavUserToggleComponent,
    RouterOutlet,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);
  mainStore = inject(MainStoreService);
  private document = inject(DOCUMENT);
  rootRoutes = menusRoutes;

  isDark = signal(false);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  changeTheme() {
    this.document.documentElement.classList.toggle('dark-theme');

    this.isDark.set(!this.isDark());
  }
}
