import { Route } from '@angular/router';
import { UserManualPageComponent } from '@modules/common/ui/user-manual/user-manual-page.component';
import { EmailQueueComponent } from '@modules/common/ui/email-queue/email-queue.component';
import { CommonHomeComponent } from './ui/common-home.component';

export const routes: Route[] = [
  {
    path: '',
    component: CommonHomeComponent,
    data: { breadcrumb: 'Común' },
  },
  {
    path: 'user-manual',
    title: 'Manual de Usuario',
    component: UserManualPageComponent,
    data: {
      breadcrumb: 'Manual de Usuario',
    },
  },
  {
    path: 'email-queue',
    title: 'Envio de Correos',
    component: EmailQueueComponent,
    data: {
      breadcrumb: 'Envio de Correos',
    },
  },
];
