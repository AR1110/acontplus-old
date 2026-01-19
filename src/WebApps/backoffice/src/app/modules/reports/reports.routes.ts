import { Route } from '@angular/router';
import { SuscripcionReportPageComponent } from '@modules/sales/pages/suscription-report-page/suscripcion-report-page.component';

export const routes: Route[] = [
  {
    path: 'subscription-report',
    component: SuscripcionReportPageComponent,
    data: {
      breadcrumb: 'Reporte de Suscripciones',
    },
  },
];
