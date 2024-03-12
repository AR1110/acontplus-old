import { Route } from "@angular/router";
import { TablePageComponent } from "./pages/table-page/table-page.component";


export const routes: Route[] = [
  {
    path: 'table-page',
    title: 'Mesas',
    component: TablePageComponent,
    data: {
      breadcrumb: 'Gestión de Pisos, Salas y Mesas'
    }
  }
]
