import { Route } from "@angular/router";
import { TablePageComponent } from "./pages/table-page/table-page.component";
import { ItemReportComponent } from "./reports/item-report/item-report.component";


export const routes: Route[] = [
  {
    path: 'table-page',
    title: 'Mesas',
    component: TablePageComponent,
    data: {
      breadcrumb: 'Gestión de Pisos, Salas y Mesas'
    }
  },
  {
    path: 'item-report',
    title: 'Reporte Items',
    component: ItemReportComponent,
    data: {
      breadcrumb: 'Reporte Item-Ingrediente'
    }
  }
]
