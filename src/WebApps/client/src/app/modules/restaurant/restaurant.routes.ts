import { Route } from '@angular/router';
import { TablePageComponent } from './pages/table-page/table-page.component';
import { ItemReportComponent } from './reports/item-report/item-report.component';
import { InfrastructurePageComponent } from '@restaurant/pages/infrastructure-page/infrastructure-page.component';

export const routes: Route[] = [
  {
    path: 'table-page',
    title: 'Mesas',
    component: TablePageComponent,
    data: {
      breadcrumb: 'Gestión de Pisos, Salas y Mesas',
    },
  },
  {
    path: 'item-report',
    title: 'Reporte Items',
    component: ItemReportComponent,
    data: {
      breadcrumb: 'Reporte Item-Ingrediente',
    },
  },
  {
    path: 'infrastructure-page',
    title: 'Restaurant Infrastructure',
    component: InfrastructurePageComponent,
    data: {
      breadcrumb: 'Infraestructura',
    },
  },
];
