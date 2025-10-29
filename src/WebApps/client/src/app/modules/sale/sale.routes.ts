import { Route } from '@angular/router';
import { SaleReportPageComponent } from '@sale/ui/reports/sale-report-page/sale-report-page.component';

import { DeliveryNotes } from '@sale/ui/delivery-notes/delivery-notes';
import { ProformaInvoices } from '@sale/ui/proforma-invoices/proforma-invoices';
import { RentabilidadPageComponent } from '@sale/ui/reports/rentabilidad-page/rentabilidad-page.component';
import { SaleHomeComponent } from './ui/sale-home.component';
import {ACTION_ALIASES} from "@core/constants/permission-actions";
import {SALE_MODULES_CODE} from "@sale/domain/enums/sale.enum";

export const routes: Route[] = [
  {
    path: '',
    component: SaleHomeComponent,
    data: { breadcrumb: 'Ventas' },
  },
  {
    path: 'proforma-invoices',
    component: ProformaInvoices,
    data: {
      breadcrumb: 'Proformas',
      context: SALE_MODULES_CODE.PROFORMA_INVOICE,
      requiredActions: [ACTION_ALIASES.READ]
    },
  },
  {
    path: 'delivery-notes',
    component: DeliveryNotes,
    data: {
      breadcrumb: 'Notas de Entrega',
    },
  },
  {
    path: 'reports',
    children: [
      {
        path: 'rentabilidad-page',
        component: RentabilidadPageComponent,
        title: 'Reporte Rentabilidad',
        data: {
          breadcrumb: 'Reporte Rentabilidad',
        },
      },
      {
        path: 'sale-report',
        component: SaleReportPageComponent,
        title: 'Reporte Venta',
        data: {
          breadcrumb: 'Reporte Venta',
        },
      },
      {
        path: 'sale-report',
        component: SaleReportPageComponent,
        title: 'Reporte Venta',
        data: {
          breadcrumb: 'Reporte Venta',
        },
      },
    ],
  },
];
