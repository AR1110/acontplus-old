import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { map, Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { NavUserInfoToggleComponent } from '../components/nav-user-info-toggle/nav-user-info-toggle.component';
import { NavUserToggleComponent } from '../components/nav-user-toggle/nav-user-toggle.component';

@Component({
  selector: 'app-new-layout',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    AsyncPipe,
    SidebarComponent,
    RouterModule,
    MatBadgeModule,
    NavUserInfoToggleComponent,
    NavUserToggleComponent,
  ],
  templateUrl: './new-layout.component.html',
  styleUrl: './new-layout.component.scss',
})
export class NewLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  // isExpanded = false;
  // rootRoutes = menusRoutes;

  private breakpointObserver = inject(BreakpointObserver);
  // public themeService = inject(ThemeService);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(map((result) => result.matches));

  // constructor() {
  //   this.breakpointObserver
  //     .observe(['(max-width: 800px)'])
  //     .subscribe((result) => {
  //       this.isMobile = result.matches;

  //       if (this.isMobile) {
  //         this.sidenav.close();
  //       } else {
  //         this.sidenav?.open();
  //       }
  //     });
  // }

  // toggleSidebar() {
  //   this.isExpanded = !this.isExpanded;
  //   if (this.isMobile) {
  //   }
  //   this.sidenav.toggle();
  // }

  // toggleTheme(): void {
  //   this.themeService.toggleDarkMode();
  // }
  collapsed = signal(false);
  sidenavWidth = computed(() => {
    return this.collapsed() ? '70px' : '250px';
  });

  toggleSidenav() {
    this.collapsed.set(!this.collapsed());
  }
}
