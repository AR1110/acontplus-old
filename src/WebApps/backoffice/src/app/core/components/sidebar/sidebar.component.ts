import {
  Component,
  computed,
  inject,
  Input,
  output,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserData } from '@modules/auth/services/auth.service';
import { IconUserComponent } from 'acontplus-ui-components';
import { MenusRoute, menusRoutes } from '@core/components/sidebar/menus-routes'; // Ensure this path is correct
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true, // Assuming you are using standalone components
  imports: [
    MatIconButton,
    MatIcon,
    MatNavList,
    MatListItem,
    RouterModule,
    IconUserComponent,
    MatExpansionModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styles: `
    :host * {
      transition: all 500ms ease-in-out;
    }

    .sidenav-header {
      padding-top: 24px;
      text-align: center;

      > img {
        border-radius: 100%;
        object-fit: cover;
        margin-bottom: 10px;
      }

      .header-text {
        height: 3rem;
        > h2 {
          margin: 0;
          font-size: 1rem;
          line-height: 1.5rem;
        }
        > p {
          margin: 0;
          font-size: 0.8rem;
        }
      }
    }

    .hide-header-text {
      opacity: 0;
      height: 0px !important;
    }

    .menu-item {
      border-left: 5px solid;
      border-left-color: rgba(0, 0, 0, 0);
    }

    .selected-menu-item {
      /*border-left-color: var(--pink);*/
      background: rgba(0, 0, 0, 0.05);
    }

    .sidenav-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 16px 0;
    }

    .hide-expanded-sidenav {
      position: absolute;
      right: 0px;
      top: 0.5%;
    }
    .hide-expanded-sidenav:hover {
      color: #0000;
    }
    /* navigation-list.component.scss */
    /* navigation-list.component.scss */
    .sidenav-menu {
      width: 240px; /* Ancho fijo cuando está expandido */
      padding: 8px 0;

      /* Items principales */
      .mat-list-item {
        min-height: 40px;
        height: auto;
        padding: 8px 16px;
        margin: 0 8px 4px 8px;

        /* Contenedor interno */
        .mat-list-item-content {
          display: flex;
          align-items: center;
          width: 100%;

          /* Icono principal */
          .mat-icon:first-child {
            margin-right: 16px;
            color: inherit;
            flex-shrink: 0;
          }

          /* Texto del menú */
          .menu-title {
            flex-grow: 1;
            white-space: nowrap;
            overflow: visible;
            text-overflow: clip;
            font-size: 14px;
            font-weight: 400;
          }

          /* Chevron para items con hijos */
          .menu-chevron {
            margin-left: 8px;
            color: rgba(0, 0, 0, 0.54);
          }
        }

        /* Estado hover */
        &:hover {
        }

        /* Estado activo */
        &.active {
          font-weight: 500;
        }
      }

      /* Submenús */
      .submenu-container {
        margin-left: 24px;
        overflow: hidden;
        transition: height 0.3s ease;

        .submenu-item {
          padding-left: 8px !important;
          min-height: 36px;

          .mat-icon {
            font-size: 16px;
            margin-right: 12px;
          }

          .menu-title {
            font-size: 13px;
            font-weight: 400;
          }
        }
      }
    }

    /* Cuando el sidebar está colapsado */
    .sidenav-collapsed {
      .sidenav-menu {
        width: 72px; /* Ancho colapsado */

        .menu-title,
        .menu-chevron {
          display: none;
        }

        .mat-list-item {
          justify-content: center;
          padding: 8px 0;

          .mat-icon:first-child {
            margin-right: 0;
          }
        }
      }
    }
  `,
})
export class SidebarComponent {
  private authSvc = inject(AuthService);
  user: UserData = {
    email: '',
    name: '',
  };
  username = signal('');

  toggle = output();
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  profilePickSize = computed(() => (this.sideNavCollapsed() ? '32' : '50'));

  menus: MenusRoute[] = menusRoutes;
  private expandedItems = new Set<string>();

  constructor(private router: Router) {
    // Note: item.path == item.path is not necessary for initialization
    // IDs for menu items are naturally their paths as they are unique identifiers.

    // Automatically expand the current active menu
    this.autoExpandActiveMenu();
  }

  isExpanded(item: MenusRoute): boolean {
    return this.expandedItems.has(item.path); // Use item.path as the identifier
  }

  setExpanded(item: MenusRoute, expanded: boolean): void {
    if (expanded) {
      this.expandedItems.add(item.path);
    } else {
      this.expandedItems.delete(item.path);
    }
  }

  isChildActive(item: MenusRoute): boolean {
    return (
      item.children?.some((child) =>
        // Construct the full path for comparison
        this.router.isActive(`${item.path}/${child.path}`, {
          paths: 'subset',
          queryParams: 'subset',
          fragment: 'ignored',
          matrixParams: 'ignored',
        }),
      ) ?? false
    );
  }

  // Renamed from navigateToParent to a more generic toggleMenu to avoid confusion
  // This function now only handles expanding/collapsing.
  toggleMenu(item: MenusRoute): void {
    // Only toggle expansion if the item has children
    if (item.children?.length) {
      this.setExpanded(item, !this.isExpanded(item));
      // No navigation here. Navigation is handled by routerLink when children are null.
    }
  }

  private autoExpandActiveMenu(): void {
    const currentUrl = this.router.url;

    for (const item of this.menus) {
      // Check if any child route is active within this parent
      if (
        item.children?.some((child) =>
          // Use full path for comparison
          currentUrl.includes(`${item.path}/${child.path}`),
        )
      ) {
        this.setExpanded(item, true);
        break;
      }
    }
  }
}
