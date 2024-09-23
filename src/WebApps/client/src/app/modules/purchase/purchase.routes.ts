import { Routes } from '@angular/router';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { ReceptionReportsPageComponent } from './pages/reception-reports-page/reception-reports-page.component';
import { DocumentoRecibidoPageComponent } from '@purchase/pages/documento-recibido-page/documento-recibido-page.component';

export const routes: Routes = [
  {
    path: 'documento-recibido',
    title: 'Documento Recibido',
    component: DocumentoRecibidoPageComponent,
    data: {
      breadcrumb: 'Documento Recibido',
    },
  },
  {
    path: 'reports-page',
    title: 'Reporte Compras',
    component: ReportsPageComponent,
    data: {
      breadcrumb: 'Reporte Compras',
    },
  },
  {
    path: 'reception-reports-page',
    title: 'Reportes Recepción',
    component: ReceptionReportsPageComponent,
    data: {
      breadcrumb: 'Reportes Recepción',
    },
  },
];
