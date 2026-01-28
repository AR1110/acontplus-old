import { Route, Routes } from '@angular/router';

import { MenuItemList, menuItems } from './menu-items';
import { MainLayoutComponent } from './main-layout.component';

const itemToRoute = (i: MenuItemList): Route => {
  const route = {} as Route;

  route.path = i.route;
  route.component = i.component;
  route.data = i.data;

  if (i.loadChildren) {
    route.loadChildren = i.loadChildren;
  }

  if (i.subItems) {
    route.children = i.subItems.map((s) => itemToRoute(s));
  }
  console.log(route)
  return route;
};

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: menuItems.map((i) => itemToRoute(i)),
  },
];
// export const routes: Routes = [
//   {
//     path: '',
//     component: MainLayoutComponent,
//     children: [
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
//         path: 'home',
//         title: 'App - Home',
//         loadChildren: () =>
//           import('@modules/home/home.routes').then((r) => r.routes),
//       },
//       {
//         path: 'sale',
//         loadChildren: () =>
//           import(`@modules/sales/sales.routes`).then((m) => m.routes),
//         data: {
//           breadcrumb: 'Ventas',
//         },
//       },
//       {
//         path: 'customer-soport',
//         loadChildren: () =>
//           import(`@modules/customer-support/customer-support.routes`).then(
//             (m) => m.routes,
//           ),
//         data: {
//           breadcrumb: 'Soporte al Cliente',
//         },
//       },
//       {
//         path: 'security',
//         loadChildren: () =>
//           import(`@modules/seguridad/seguridad.routes`).then((m) => m.routes),
//         data: {
//           breadcrumb: 'Seguridad',
//         },
//       },
//       {
//         path: 'sri',
//         loadChildren: () =>
//           import(`@modules/sri/sri.routes`).then((m) => m.routes),
//         data: {
//           breadcrumb: 'Sri',
//         },
//       },
//       {
//         path: 'common',
//         loadChildren: () =>
//           import(`@modules/common/common.routes`).then((m) => m.routes),
//         data: {
//           breadcrumb: 'Common',
//         },
//       },
//       {
//         path: 'reports',
//         loadChildren: () =>
//           import(`@modules/reports/reports.routes`).then((m) => m.routes),
//         data: {
//           breadcrumb: 'Reports',
//         },
//       },
//       {
//         path: '',
//         redirectTo: 'home',
//         pathMatch: 'full',
//       },
//       {
//         path: 'bugs',
//         component: BugsComponent,
//         data: {
//           breadcrumb: 'Errores Sistema',
//         },
//       },
//     ],
//   },
// ];
