import { Route } from '@angular/router';

import { ACTION_ALIASES } from '@core/constants/permission-actions';
import { BILLING_MODULES_CODE } from '@billing/domain/enums/billing.enum.ts';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./ui/billing-home.component').then((m) => m.BillingHomeComponent),
    data: { breadcrumb: 'Facturación' },
  },
  {
    path: 'ats-page',
    title: 'Ats',
    loadComponent: () => import('@billing/ui/ats-page/ats-page').then((m) => m.AtsPage),
    data: {
      breadcrumb: 'Ats',
    },
  },
  {
    path: 'fact-elect-report',
    title: 'Reporte Tributario',
    loadComponent: () =>
      import('@billing/ui/reports/fact-elect-report-page/fact-elect-report-page.component').then(
        (m) => m.FactElectReportPageComponent,
      ),
    data: {
      breadcrumb: 'Reporte Tributario',
    },
  },

  {
    path: 'doc-elects',
    title: 'Documento Electrónico',
    loadComponent: () => import('@billing/ui/doc-elect/doc-elect-page').then((m) => m.DocElectPage),
    data: {
      breadcrumb: 'Documento Electrónico',
      context: BILLING_MODULES_CODE.DOC_ELECT,
      requiredActions: [ACTION_ALIASES.READ],
    },
  },

  {
    path: 'invoices',
    title: 'Factura',
    loadComponent: () => import('@billing/ui/invoice-page/invoice-page').then((m) => m.InvoicePage),
    data: {
      breadcrumb: 'Factura',
    },
  },
  {
    path: 'guia-remision',
    title: 'Guia Remisión',
    loadComponent: () =>
      import('@billing/ui/guia-remision/guia-remision.component').then(
        (m) => m.GuiaRemisionComponent,
      ),
    data: {
      breadcrumb: 'Guía de Remisión',
    },
  },
];
