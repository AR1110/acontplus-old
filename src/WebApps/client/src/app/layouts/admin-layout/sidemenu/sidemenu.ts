import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';

import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { NavAccordionToggle } from './nav-accordion-toggle';
import { NavAccordionItem } from './nav-accordion-item';
import { NavAccordion } from './nav-accordion';
import { MenuService } from '@core/bootstrap';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    NgxPermissionsModule,
    MatIconModule,
    MatRippleModule,
    TranslateModule,
    NavAccordion,
    NavAccordionItem,
    NavAccordionToggle,
  ],
})
export class Sidemenu {
  // The ripple effect makes page flashing on mobile
  ripple = input(false);

  private readonly menu = inject(MenuService);
  private tokenUseCase = inject(TokenUseCase);

  menus = computed(() => {
    const resultMenus = this.processApiMenuItems(this.tokenUseCase.getSession()?.menuItems ?? []);
    return [
      {
        route: 'dashboard',
        name: 'dashboard',
        type: 'link',
        icon: 'dashboard',
        badge: {
          color: 'red-50',
          value: '5',
        },
      },
      ...resultMenus,
      {
        "route": "menu-level",
        "name": "menu-level",
        "type": "sub",
        "icon": "subject",
        "children": [
          {
            "route": "level-1-1",
            "name": "level-1-1",
            "type": "sub",
            "children": [
              {
                "route": "level-2-1",
                "name": "level-2-1",
                "type": "link",
              },
              {
                "route": "level-2-2",
                "name": "level-2-2",
                "type": "link"
              }
            ]
          },
          {
            "route": "level-1-2",
            "name": "level-1-2",
            "type": "link"
          }
        ],
        "permissions": {
          "only": "ADMIN"
        }
      }
    ];
  });

  buildRoute = this.menu.buildRoute;

  private processApiMenuItems(items: any[]): any[] {
    return items.map((item: any) => {
      const children: any[] = item.children ? this.processApiMenuItems(item.children || []) : [];

      return {
        id: item.id,
        name: item.name,
        icon: 'home',
        route: item.url,
        actions: item.actions,
        children,
        type: children.length > 0 ? 'sub' : 'link',
      };
    });
  }
}
