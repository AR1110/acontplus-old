import { configDataResolver } from '@core/resolvers/config-resolver';
import { Routes } from '@angular/router';
import { sessionGuard } from '@core/guards/session.guard';

export const routes: Routes = [
  {
    path: 'auth',
    title: 'AcontPlusPos-Login',
    loadChildren: () =>
      import(`@/ui/layouts/auth-layout.routes`).then((m) => m.routes),
  },
  // {
  //   path: '',
  //   canActivate: [sessionGuard],
  //   loadChildren: () =>
  //     import('@/ui/layouts/main-layout.routes').then((m) => m.routes),
  //     resolve: {
  //     configData: configDataResolver
  //     }
  // },
  {
    path: '',
    canActivate: [sessionGuard],
    loadChildren: () =>
      import('@/ui/layouts/main-layout.routes').then((m) => m.routes),
  },

  {
    path: '**',
    // redirectTo: 'page-error',
    loadComponent: () =>
      import(
        '@ui/layouts/components/page-error-404/page-error-404.component'
      ).then((c) => c.PageError404Component),
  },
];
