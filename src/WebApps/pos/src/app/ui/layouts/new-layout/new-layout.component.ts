import { ThemeToggleComponent } from '@/ui/layouts/new-layout/theme-toggle/theme-toggle.component';
import { ThemeService } from '@/ui/theme.service';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { map, Observable, shareReplay } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { menusRoutes } from '../menus-routes';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-layout',
  imports: [
    ThemeToggleComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    DashboardComponent,
    AsyncPipe,
    SidebarComponent,
    RouterModule,
  ],
  templateUrl: './new-layout.component.html',
  styleUrl: './new-layout.component.scss',
})
export class NewLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  isExpanded = false;
  isDarkMode = false;
  rootRoutes = menusRoutes;

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(map((result) => result.matches));

  constructor(public themeService: ThemeService) {
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;

        if (this.isMobile) {
          this.sidenav.close();
          this.isExpanded = false;
        } else {
          this.sidenav?.open();
          this.isExpanded = false; // Asegurar que inicie colapsado en desktop
        }
      });
  }
  ngOnInit() {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    if (this.isMobile) {
    }
    this.sidenav.toggle();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
