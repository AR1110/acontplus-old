import {
  Component,
  computed,
  inject,
  Input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {PermissionStore} from "@ui/store/permission.store";
import {IconUserComponent} from "@ui/components/icons/icon-user/icon-user.component";
import {LayoutStore} from "@ui/store/layout.store";

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    IconUserComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  $layoutStore = inject(LayoutStore)
   $permissionStore = inject(PermissionStore)

  userName = computed(() => this.$layoutStore.userName());

  toggle = output();
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  // menuItems = signal<any[]>(menusRoutes);

  profilePickSize = computed(() => (this.sideNavCollapsed() ? '32' : '50'));




}
