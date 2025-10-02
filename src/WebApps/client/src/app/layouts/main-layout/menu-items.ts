import { DashboardComponent } from '@modules/home/dashboard/dashboard.component';
import { MainLayoutComponent } from './main-layout.component';
import { MenuConfig } from './menu.types';

export const autoMenuConfig: MenuConfig = {
  defaultRoute: 'dashboard',
  rootComponent: MainLayoutComponent,
  baseData: {
    breadcrumb: 'Home',
  },
  items: [
    {
      id: 'dashboard',
      icon: 'home',
      route: 'dashboard',
      label: 'Dashboard',
      routeMatch: 'full',
      component: DashboardComponent,
      order: 1,
      data: {
        breadcrumb: 'Dashboard',
        title: 'Panel Principal',
      },
    },
    {
      id: 'config',
      icon: 'settings',
      route: 'config',
      label: 'Configuración',
      order: 2,
      data: {
        breadcrumb: 'Config',
        title: 'Configuración del Sistema',
      },
      subItems: [],
    },
  ],
};
