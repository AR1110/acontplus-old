import { routes } from '@/config/app.routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatNavList,
    AsyncPipe,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  rootRoutes = routes.filter((r) => r.path);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
