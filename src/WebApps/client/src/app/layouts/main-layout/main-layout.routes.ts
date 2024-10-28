import { Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'purchase',
        title: 'App - Compras',
        loadChildren: () =>
          import('@modules/purchase/purchase.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Compras',
        },
      },
      {
        path: 'config',
        title: 'App - Config',
        loadChildren: () =>
          import('@modules/config/config.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Config',
        },
      },
      {
        path: 'technical-support',
        title: 'App - Soporte Técnico',
        loadChildren: () =>
          import('@modules/technical-support/technical-support.routes').then(
            (r) => r.routes,
          ),
        data: {
          breadcrumb: 'Soporte Técnico',
        },
      },
      {
        path: 'accounting',
        title: 'App - Contabilidad',
        loadChildren: () =>
          import('@modules/accounting/accounting.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Contabilidad',
        },
      },
      {
        path: 'inventory',
        title: 'App - Inventario',
        loadChildren: () =>
          import('@modules/inventory/inventory.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Inventario',
        },
      },
      {
        path: 'sale',
        title: 'App - Venta',
        loadChildren: () => import('@sale/sale.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Venta',
        },
      },
      {
        path: 'restaurant',
        title: 'App - Restaurante',
        loadChildren: () =>
          import('@restaurant/restaurant.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Restaurant',
        },
      },
      {
        path: 'billing',
        title: 'App - Fact. Elect.',
        loadChildren: () =>
          import('@billing/billing.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Facturación',
        },
      },
      {
        path: 'mechanical',
        title: 'App - Mecánica.',
        loadChildren: () =>
          import('@mechanical/mechanical.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Mecánica',
        },
      },
      {
        path: 'customer',
        title: 'App - Customer',
        loadChildren: () =>
          import('@customer/customer.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Cliente',
        },
      },
      {
        path: 'vet',
        title: 'App - Vet',
        loadChildren: () =>
          import('@modules/vet/vet.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'Vet',
        },
      },
      {
        path: 'common',
        title: 'App - Common',
        loadChildren: () =>
          import('@modules/common/common.routes').then((r) => r.routes),
        data: {
          breadcrumb: 'General',
        },
      },
    ],
  },
];
