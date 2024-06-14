import { Route } from "@angular/router";
import { RentabilidadPageComponent } from "./reports/rentabilidad-page/rentabilidad-page.component";
import {SaleReportPageComponent} from "@sale/reports/sale-report-page/sale-report-page.component";

export const routes: Route[] = [
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
      }
    ]
  }

]
