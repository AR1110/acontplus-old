import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  computed,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { MenuService } from '@core/bootstrap';
import { TopmenuPanel } from './topmenu-panel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

export interface TopmenuState {
  active: boolean;
  route: string;
}

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.html',
  styleUrl: './topmenu.scss',
  host: {
    class: 'acontplus-topmenu',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    NgxPermissionsModule,
    TranslateModule,
    TopmenuPanel,
  ],
})
export class Topmenu {
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private tokenUseCase = inject(TokenUseCase);

  // 🚀 Convertimos el observable a signal reactivo
  readonly menuList = computed(() => this.getMenusignal());

  // Signal para la URL actual
  readonly currentUrl = signal(this.router.url);

  getMenusignal = () => {
    const resultMenus = this.processApiMenuItems(this.tokenUseCase.getSession()?.menuItems || []);
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
    ];
  };

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

  // Actualiza currentUrl cada vez que cambia la navegación
  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e: NavigationEnd) => {
        this.currentUrl.set(e.urlAfterRedirects);
      });
  }

  // 🔁 Computed: genera el estado de cada menú automáticamente
  readonly menuStates = computed<TopmenuState[]>(() =>
    this.menuList().map((item) => ({
      active: this.currentUrl().split('/').includes(item.route),
      route: item.route,
    })),
  );

  buildRoute = this.menuService.buildRoute;

  // ✅ Cuando cambie el estado, Angular detecta automáticamente el cambio
  onRouteChange(rla: RouterLinkActive, index: number) {
    // No es necesario suscribirse a router events aquí.
    // Signals ya re-renderizan automáticamente.
  }
}
