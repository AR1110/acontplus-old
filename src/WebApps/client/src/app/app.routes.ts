// import { authGuard } from '@core/guards/auth.guard';
// import {Routes} from "@angular/router";
// import {FixTempLayout} from "./layouts/fix-temp-layout/fix-temp-layout";
//
// export const routes: Routes = [
//   {
//     path: '',
//     canActivate: [authGuard],
//     component: FixTempLayout,
//     children: [
//       {
//         path: 'purchase',
//         title: 'App - Compras',
//         loadChildren: () =>
//           import('@modules/purchase/purchase.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Compras',
//         },
//       },
//       {
//         path: 'config',
//         title: 'App - Config',
//         loadChildren: () =>
//           import('@modules/config/config.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Config',
//         },
//       },
//       {
//         path: 'technical-support',
//         title: 'App - Soporte Técnico',
//         loadChildren: () =>
//           import('@modules/technical-support/technical-support.routes').then(
//             (r) => r.routes,
//           ),
//         data: {
//           breadcrumb: 'Soporte Técnico',
//         },
//       },
//       {
//         path: 'accounting',
//         title: 'App - Contabilidad',
//         loadChildren: () =>
//           import('@modules/accounting/accounting.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Contabilidad',
//         },
//       },
//       {
//         path: 'inventory',
//         title: 'App - Inventario',
//         loadChildren: () =>
//           import('@modules/inventory/inventory.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Inventario',
//         },
//       },
//       {
//         path: 'sale',
//         title: 'App - Venta',
//         loadChildren: () => import('@sale/sale.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Venta',
//         },
//       },
//       {
//         path: 'restaurant',
//         title: 'App - Restaurante',
//         loadChildren: () =>
//           import('@restaurant/restaurant.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Restaurant',
//         },
//       },
//       {
//         path: 'billing',
//         title: 'App - Fact. Elect.',
//         loadChildren: () =>
//           import('@billing/billing.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Facturación',
//         },
//       },
//       {
//         path: 'mechanical',
//         title: 'App - Mecánica.',
//         loadChildren: () =>
//           import('@mechanical/mechanical.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Mecánica',
//         },
//       },
//       {
//         path: 'customer',
//         title: 'App - Customer',
//         loadChildren: () =>
//           import('@customer/customer.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Cliente',
//         },
//       },
//       {
//         path: 'vet',
//         title: 'App - Vet',
//         loadChildren: () =>
//           import('@modules/vet/vet.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'Vet',
//         },
//       },
//       {
//         path: 'common',
//         title: 'App - Common',
//         loadChildren: () =>
//           import('@modules/common/common.routes').then((r) => r.routes),
//         data: {
//           breadcrumb: 'General',
//         },
//       },
//       {
//         path: 'barber-shop',
//         title: 'App - Barberia',
//         loadChildren: () =>
//           import('@modules/barber-shop/barber-shop.routes').then(
//             (r) => r.routes,
//           ),
//         data: {
//           breadcrumb: 'Barbería',
//         },
//       },
//     ],
//   },
// ];




import { Routes } from '@angular/router';

import {authGuard} from "@core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('@modules/home/dashboard/dashboard').then(m => m.Dashboard) },
      // { path: '403', component: Error403 },
      // { path: '404', component: Error404 },
      // { path: '500', component: Error500 },
      {
        path: 'purchase',
        title: 'App - Compras',
        loadChildren: () => import('@modules/purchase/purchase.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Compras',
        },
      },
      {
        path: 'config',
        title: 'App - Config',
        loadChildren: () => import('@modules/config/config.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Config',
        },
      },
      {
        path: 'technical-support',
        title: 'App - Soporte Técnico',
        loadChildren: () =>
          import('@modules/technical-support/technical-support.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Soporte Técnico',
        },
      },
      {
        path: 'accounting',
        title: 'App - Contabilidad',
        loadChildren: () => import('@modules/accounting/accounting.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Contabilidad',
        },
      },
      {
        path: 'inventory',
        title: 'App - Inventario',
        loadChildren: () => import('@modules/inventory/inventory.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Inventario',
        },
      },
      {
        path: 'sales',
        title: 'App - Venta',
        loadChildren: () => import('@sale/sale.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Venta',
        },
      },
      {
        path: 'restaurant',
        title: 'App - Restaurante',
        loadChildren: () => import('@restaurant/restaurant.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Restaurant',
        },
      },
      {
        path: 'billing',
        title: 'App - Fact. Elect.',
        loadChildren: () => import('@billing/billing.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Facturación',
        },
      },
      {
        path: 'mechanical',
        title: 'App - Mecánica.',
        loadChildren: () => import('@mechanical/mechanical.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Mecánica',
        },
      },
      {
        path: 'customer',
        title: 'App - Customer',
        loadChildren: () => import('@customer/customer.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Cliente',
        },
      },
      {
        path: 'vet',
        title: 'App - Vet',
        loadChildren: () => import('@modules/vet/vet.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Vet',
        },
      },
      {
        path: 'common',
        title: 'App - Common',
        loadChildren: () => import('@modules/common/common.routes').then(r => r.routes),
        data: {
          breadcrumb: 'General',
        },
      },
      {
        path: 'barber-shop',
        title: 'App - Barberia',
        loadChildren: () => import('@modules/barber-shop/barber-shop.routes').then(r => r.routes),
        data: {
          breadcrumb: 'Barbería',
        },
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      { path: 'login', loadComponent: () => import('@modules/auth/ui/login/login.component').then(m => m.LoginComponent) },
      // { path: 'register', component: Register },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
