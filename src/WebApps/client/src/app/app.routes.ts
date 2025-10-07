
import { sessionGuard } from '@core/guards/session.guard';
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";

// export const routes: Routes = [
//   {
//     path: 'home',
//     canActivate: [sessionGuard],
//     loadChildren: () => import(`./modules/home/home.routes`).then(m => m.routes),
//     data: {
//       breadcrumb: 'Home'
//     }
//   },
//
//   {
//     path: 'auth',
//     title: 'Auth',
//     component: AuthLayoutComponent,
//     children: [
//       {
//         path: '',
//         loadComponent:()=> import('@modules/auth/ui/auth/auth.component').then(c=>c.AuthComponent)
//       }
//     ]
//   },
//
//   {
//     path: '',
//     canActivate: [sessionGuard],
//     loadChildren: () =>
//       import(`./layouts/main-layout/main-layout.routes`).then((m) => m.routes),
//     data: {
//       breadcrumb: 'Soporte Técnico'
//     }
//   },
// ];

import { Routes } from '@angular/router';
import {LoginComponent} from "@modules/auth/ui/login/login.component";

export const routes: Routes = [
  {
    path: '',
    // component: AdminLayout,
    // canActivate: [authGuard],
    // canActivateChild: [authGuard],
    children: [
    //  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: 'dashboard', component: Dashboard },
      // { path: '403', component: Error403 },
      // { path: '404', component: Error404 },
      // { path: '500', component: Error500 },

    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
     // { path: 'register', component: Register },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
