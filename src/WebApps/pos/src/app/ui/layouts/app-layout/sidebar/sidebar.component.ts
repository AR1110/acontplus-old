import {
  Component,
  computed,
  inject,
  input,
  Input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { menusRoutes } from '../../menus-routes';
import { ThemeService } from '@/ui/theme.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  toggle = output();
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  public themeService = inject(ThemeService);

  menuItems = signal<any[]>(menusRoutes);

  profilePickSize = computed(() => (this.sideNavCollapsed() ? '32' : '50'));

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
