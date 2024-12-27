import { Route } from "@angular/router";
import { SaleReportPageComponent } from "@sale/reports/sale-report-page/sale-report-page.component";

import { NotaEntregaPageComponent } from "./pages/nota-entrega-page/nota-entrega-page.component";
import { ProformaPageComponent } from "./pages/proforma-page/proforma-page.component";
import { RentabilidadPageComponent } from "./reports/rentabilidad-page/rentabilidad-page.component";

export const routes: Route[] = [
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
