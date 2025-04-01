import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { SidebarComponent } from '../app-layout/sidebar/sidebar.component';
import { map, Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { HeaderComponent } from './header/header.component';
import {FooterComponent} from "@core/components/footer/footer.component";
@Component({
  selector: 'app-app-layout',
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
        HeaderComponent,
        FooterComponent,
    ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);

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
    return this.collapsed() ? '70px' : '230px';
  });

  toggleSidenav() {
    this.collapsed.set(!this.collapsed());
  }
}
