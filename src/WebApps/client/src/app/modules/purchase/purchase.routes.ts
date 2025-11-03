import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/purchase-home.component').then((m) => m.PurchaseHomeComponent),
    data: { breadcrumb: 'Compras' },
  },
  {
    path: 'documento-recibido',
    title: 'Documento Recibido',
    loadComponent: () =>
      import('@purchase/ui/documento-received/document-received.component').then(
        (m) => m.DocumentReceivedComponent,
      ),
    data: {
      breadcrumb: 'Documento Recibido',
    },
  },
  {
    path: 'reports',
    title: 'Reporte Compras',
    loadComponent: () =>
      import('@purchase/ui/reports/reports.component').then((m) => m.ReportsComponent),
    data: {
      breadcrumb: 'Reporte Compras',
    },
  },
  {
    path: 'reception-reports',
    title: 'Reportes Recepción',
    loadComponent: () =>
      import('@purchase/ui/reception-reports/reception-reports.component').then(
        (m) => m.ReceptionReportsComponent,
      ),
    data: {
      breadcrumb: 'Reportes Recepción',
    },
  },
  {
    path: 'factura-fisica',
    title: 'Factura Física',
    loadComponent: () =>
      import('@purchase/ui/factura-fisica/factura-fisica.component').then(
        (m) => m.FacturaFisicaComponent,
      ),
    data: {
      breadcrumb: 'Factura Física',
    },
  },
  {
    path: 'retencion-ats',
    title: 'Retención ATS',
    loadComponent: () =>
      import('@billing/ui/retencion-ats/retencion-ats.component').then(
        (m) => m.RetencionAtsComponent,
      ),
    data: {
      breadcrumb: 'Retención ATS',
    },
  },
];
