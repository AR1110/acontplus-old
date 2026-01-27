import {Route} from "@angular/router";

export const routes: Route[] = [
  {
    path: "received-documents",
    title: 'Documento Recibido',
    loadComponent: () =>
      import('@purchases/ui/received-document/received-document').then(
        (m) => m.ReceivedDocument,
      ),
    data: {
      breadcrumb: 'Documento Recibido',
    },
  },

  {
    path: 'reports',
    title: 'Reporte Compras',
    loadComponent: () =>
      import('@purchases/ui/reports/reports.component').then((m) => m.ReportsComponent),
    data: {
      breadcrumb: 'Reporte Compras',
    },
  },
  {
    path: 'reception-reports',
    title: 'Reportes Recepción',
    loadComponent: () =>
      import('@purchases/ui/reception-reports/reception-reports.component').then(
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
      import('@purchases/ui/factura-fisica/factura-fisica.component').then(
        (m) => m.FacturaFisicaComponent,
      ),
    data: {
      breadcrumb: 'Factura Física',
    },
  },
  {
    path: 'retencion-ats-page',
    title: 'Retención ATS',
    loadComponent: () =>
      import('@billing/ui/retencion-ats/retencion-ats.component').then(
        (m) => m.RetencionAtsComponent,
      ),
    data: {
      breadcrumb: 'Retención ATS',
    },
  },
]
