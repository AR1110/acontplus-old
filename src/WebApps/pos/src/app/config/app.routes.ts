import { configDataResolver } from '@core/resolvers/config-resolver';
import { Routes } from '@angular/router';
import { sessionGuard } from '@core/guards/session.guard';
import {ROUTES_PATH} from "@domain/enums/main.enum";

export const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES_PATH.DASHBOARD,
    pathMatch: 'full',
  },
  {
    path: ROUTES_PATH.AUTH,
    title: 'AcontPlus Pos',
    loadChildren: () =>
      import(`@/ui/layouts/auth-layout.routes`).then((m) => m.routes),
  },
  {
    path: '',
    canActivate: [sessionGuard],
    loadChildren: () =>
      import('@/ui/layouts/app-layout.routes').then((m) => m.routes),
    resolve: {
      configData: configDataResolver,
    },
  },

  {
    path: '**',
    loadComponent: () =>
      import('@/ui/components/page-error-404/page-error-404.component').then(
        (c) => c.PageError404Component
      ),
  },
];
