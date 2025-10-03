import { MenuItemComponent } from '../menu-item/menu-item.component';
import {Component, computed, inject, input, signal} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MenuUtils } from '@core/utils/menu.utils';
import { RouterModule } from '@angular/router';
import { autoMenuConfig } from '../menu-items';
import { MenuConfig } from '../menu.types';
import {TokenUseCase} from "@modules/auth/domain/use-cases/token.use-case";
import {MatTree} from "@angular/material/tree";

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MenuItemComponent,
    MatTree,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private tokenUseCase = inject(TokenUseCase)
  collapsed = input(false);
  profilePicSize = computed(()=>this.collapsed()?'32':'80')


  // Items del menú procesados
  menuItems = computed(() => {
    return this.processApiMenuItems(this.tokenUseCase.getSession()?.menus || []);

    // return MenuUtils.sortMenuItems(config.items.filter((item) => !item.hidden && !item.disabled));
  });

  private processApiMenuItems(items: any[]):any[] {
    return items.map((item:any) => {
     const   subItems = item.children ? this.processApiMenuItems(item.children || []) : [];

      return {
        id: item.id,
        label: item.name,
        icon: 'home',
        route: item.url,
        actions:  item.actions,
        subItems
      }

    });
  }

}
