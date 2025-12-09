import { Route } from '@angular/router';

import { ACTION_ALIASES } from '@core/constants/permission-actions';
import { SALE_MODULES_CODE } from '@sale/domain/enums/sale.enum';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./ui/sale-home.component').then((m) => m.SaleHomeComponent),
    data: { breadcrumb: 'Ventas' },
  },
  {
    path: 'proforma-invoices',
    loadComponent: () => import('@sale/ui/proformas/proformas').then((m) => m.Proformas),
    data: {
      breadcrumb: 'Proformas',
      context: SALE_MODULES_CODE.PROFORMA_INVOICE,
      requiredActions: [ACTION_ALIASES.READ],
    },
  },
  {
    path: 'delivery-notes',
    loadComponent: () =>
      import('@sale/ui/delivery-notes/delivery-notes').then((m) => m.DeliveryNotes),
    data: {
      breadcrumb: 'Notas de Entrega',
    },
  },
  {
    path: 'reports',
    children: [
      {
        path: 'rentabilidad-page',
        loadComponent: () =>
          import('@sale/ui/reports/rentabilidad-page/rentabilidad-page.component').then(
            (m) => m.RentabilidadPageComponent,
          ),
        title: 'Reporte Rentabilidad',
        data: {
          breadcrumb: 'Reporte Rentabilidad',
        },
      },
      {
        path: 'sale-report',
        loadComponent: () =>
          import('@sale/ui/reports/sale-report-page/sale-report-page.component').then(
            (m) => m.SaleReportPageComponent,
          ),
        title: 'Reporte Venta',
        data: {
          breadcrumb: 'Reporte Venta',
        },
      },
      {
        path: 'sale-report',
        loadComponent: () =>
          import('@sale/ui/reports/sale-report-page/sale-report-page.component').then(
            (m) => m.SaleReportPageComponent,
          ),
        title: 'Reporte Venta',
        data: {
          breadcrumb: 'Reporte Venta',
        },
      },
    ],
  },
];
