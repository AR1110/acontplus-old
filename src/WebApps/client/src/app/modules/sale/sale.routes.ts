import { Route } from "@angular/router";
import { RentabilidadPageComponent } from "./reports/rentabilidad-page/rentabilidad-page.component";

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
      }
    ]
  }

]
