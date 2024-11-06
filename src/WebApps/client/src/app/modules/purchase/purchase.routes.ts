import { Routes } from '@angular/router';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { ReceptionReportsPageComponent } from './pages/reception-reports-page/reception-reports-page.component';
import { DocumentReceivedPageComponent } from '@purchase/pages/documento-received-page/document-received-page.component';
import { FacturaFisicaPageComponent } from './factura-fisica/factura-fisica-page/factura-fisica-page.component';

export const routes: Routes = [
  {
    path: 'documento-recibido',
    title: 'Documento Recibido',
    component: DocumentReceivedPageComponent,
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
  {
    path: 'factura-fisica',
    title: 'Factura Física',
    component: FacturaFisicaPageComponent,
    data: {
      breadcrumb: 'Factura Física',
    },
  },
];
