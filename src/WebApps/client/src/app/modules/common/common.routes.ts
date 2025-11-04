import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./ui/common-home.component').then((m) => m.CommonHomeComponent),
    data: { breadcrumb: 'Común' },
  },
  {
    path: 'user-manual',
    title: 'Manual de Usuario',
    loadComponent: () =>
      import('@modules/common/ui/user-manual/user-manual-page.component').then(
        (m) => m.UserManualPageComponent,
      ),
    data: {
      breadcrumb: 'Manual de Usuario',
    },
  },
  {
    path: 'email-queue',
    title: 'Envio de Correos',
    loadComponent: () =>
      import('@modules/common/ui/email-queue/email-queue.component').then(
        (m) => m.EmailQueueComponent,
      ),
    data: {
      breadcrumb: 'Envio de Correos',
    },
  },
];
