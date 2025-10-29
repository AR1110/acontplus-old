import { Route } from '@angular/router';
import { ItemReportComponent } from '@restaurant/ui/reports/item-report/item-report.component';
import { InfrastructurePageComponent } from '@restaurant/ui/pages/infrastructure-page/infrastructure-page.component';
import { RestaurantHomeComponent } from './ui/restaurant-home.component';
import { restaurantConfigDataResolver } from './resolvers/restaurant-config.resolver';
import {Items} from "@restaurant/ui/items/items";

export const routes: Route[] = [
  {
    path: 'products',
    title: 'Items',
    component: Items,
    data: {
      breadcrumb: 'Productos',
    },
    resolve: {
      configData: restaurantConfigDataResolver,
    },
  },
  {
    path: '',
    component: RestaurantHomeComponent,
    data: { breadcrumb: 'Restaurante' },
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
    path: 'infrastructure',
    title: 'Restaurant Infrastructure',
    component: InfrastructurePageComponent,
    data: {
      breadcrumb: 'Configuración del Restaurante',
    },
  },
];
