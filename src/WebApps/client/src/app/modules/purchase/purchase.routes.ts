import { Routes } from '@angular/router';
import { ReportsComponent } from '@purchase/ui/reports/reports.component';
import { ReceptionReportsComponent } from '@purchase/ui/reception-reports/reception-reports.component';
import { DocumentReceivedComponent } from '@purchase/ui/documento-received/document-received.component';
import { FacturaFisicaComponent } from '@purchase/ui/factura-fisica/factura-fisica.component';
import { RetencionAtsComponent } from '@billing/ui/retencion-ats/retencion-ats.component';

export const routes: Routes = [
  {
    path: 'documento-recibido',
    title: 'Documento Recibido',
    component: DocumentReceivedComponent,
    data: {
      breadcrumb: 'Documento Recibido',
    },
  },
  {
    path: 'reports',
    title: 'Reporte Compras',
    component: ReportsComponent,
    data: {
      breadcrumb: 'Reporte Compras',
    },
  },
  {
    path: 'reception-reports',
    title: 'Reportes Recepción',
    component: ReceptionReportsComponent,
    data: {
      breadcrumb: 'Reportes Recepción',
    },
  },
  {
    path: 'factura-fisica',
    title: 'Factura Física',
    component: FacturaFisicaComponent,
    data: {
      breadcrumb: 'Factura Física',
    },
  },
  {
    path: 'retencion-ats',
    title: 'Retención ATS',
    component: RetencionAtsComponent,
    data: {
      breadcrumb: 'Retención ATS',
    },
  },
];
