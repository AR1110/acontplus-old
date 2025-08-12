import { Route } from "@angular/router";
import { SaleReportPageComponent } from "@sale/ui/reports/sale-report-page/sale-report-page.component";

import { NotaEntregaPageComponent } from "@sale/ui/nota-entrega-page/nota-entrega-page.component";
import { ProformaPageComponent } from "@sale/ui/proforma-page/proforma-page.component";
import { RentabilidadPageComponent } from "@sale/ui/reports/rentabilidad-page/rentabilidad-page.component";
import { SaleHomeComponent } from './ui/sale-home.component';

export const routes: Route[] = [
  {
    path: '',
    component: SaleHomeComponent,
    data: { breadcrumb: 'Ventas' },
  },
  {
    path: 'proforma',
    component: ProformaPageComponent,
    data: {
      breadcrumb: 'Proformas'
    }
  },
  {
    path: 'nota-entrega',
    component: NotaEntregaPageComponent,
    data: {
      breadcrumb: 'Notas de Entrega'
    }
  },
  {
    path: 'reports',
    children: [
      {
        path: 'rentabilidad-page',
        component: RentabilidadPageComponent,
        title: 'Reporte Rentabilidad',
        data: {
          breadcrumb: 'Reporte Rentabilidad'
        }
      },
      {
        path: 'sale-report',
        component: SaleReportPageComponent,
        title: 'Reporte Venta',
        data: {
          breadcrumb: 'Reporte Venta'
        }
      },
      {
        path: 'sale-report',
        component: SaleReportPageComponent,
        title: 'Reporte Venta',
        data: {
          breadcrumb: 'Reporte Venta'
        }
      }
    ]
  }

]
