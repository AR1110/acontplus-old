import { Route } from '@angular/router';
import { SuscripcionPageComponent } from './pages/suscripcion-page/suscripcion-page.component';

export const routes: Route[] = [
  {
    path: 'subscription',
    component: SuscripcionPageComponent,
    data: {
      breadcrumb: 'Suscripción',
    },
  },
];
