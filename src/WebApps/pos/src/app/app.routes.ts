import { Routes } from '@angular/router';
import {sessionGuard} from "@core/guards/session.guard";
import {configDataResolver} from "@/resolvers/config-resolver";

export const routes: Routes = [
  {
    path: 'auth',
    title: 'POS-Login',
    loadChildren: () =>
      import(`./layouts/auth-layout/auth-layout.routes`).then((m) => m.routes),
  },
  {
    path: '',
    canActivate: [sessionGuard],
    loadChildren: () => import('./layouts/main-layout/main-layout.routes').then(m => m.routes),
    resolve: {
      configData: configDataResolver
    }
    // data: {
    //   breadcrumb: 'Soporte Técnico'
    // }
  },

  {
    path: '**',
    // redirectTo: 'page-error',
    loadComponent: () => import('@core/components/page-error-404/page-error-404.component').then(c => c.PageError404Component)
  },
];
