import { Routes } from '@angular/router';
import { sessionGuard } from '@core/guards/session.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/home',
  //   pathMatch: 'full',
  // },
  {
    path: 'auth',
    title: 'App - Auth',
    loadChildren: () =>
      import(`./layouts/auth-layout/auth.routes`).then((m) => m.routes),
  },
  {
    path: '',
    canActivate: [sessionGuard],
    loadChildren: () =>  import(`./layouts/main-layout/main-layout.routes`).then((m) => m.routes),
    // data: {
    //   breadcrumb: 'Soporte Técnico'
    // }
  },
  {
    path: '**',
    // redirectTo: 'page-error',
    loadComponent: () =>
      import('@core/components/page-error-404/page-error-404.component').then(
        (c) => c.PageError404Component,
      ),
  },
  // {
  //   path: 'home',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import(`./modules/home/home.routes`).then((m) => m.routes),
  //   data: {
  //     breadcrumb: 'Home',
  //   },
  // },
  // {
  //   path: '',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import(`./modules/main/main.routes`).then((m) => m.routes),
  //   data: {
  //     breadcrumb: 'Configuración',
  //   },
  // },
  // {
  //   path: 'config',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import('./modules/config/config.routes').then((m) => m.routes),
  //   data: {
  //     breadcrumb: 'Configuración',
  //   },
  // },
  // {
  //   path: '',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import(`./modules/sales/sales.routes`).then((m) => m.routes),
  //   data: {
  //     breadcrumb: 'Ventas',
  //   },
  // },
  // {
  //   path: '',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import(`./modules/customer-support/customer-support.routes`).then(
  //       (m) => m.routes,
  //     ),
  //   data: {
  //     breadcrumb: 'Soporte al Cliente',
  //   },
  // },
  // {
  //   path: '',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import(`./modules/seguridad/seguridad.routes`).then((m) => m.routes),
  //   data: {
  //     breadcrumb: 'Seguridad',
  //   },
  // },
  // {
  //   path: '',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import(`./modules/sri/sri.routes`).then((m) => m.routes),
  //   data: {
  //     breadcrumb: 'Sri',
  //   },
  // },
];
