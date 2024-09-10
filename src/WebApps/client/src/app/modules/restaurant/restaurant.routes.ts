import { Route } from '@angular/router';
import { ItemReportComponent } from './reports/item-report/item-report.component';
import { InfrastructurePageComponent } from '@restaurant/pages/infrastructure-page/infrastructure-page.component';
import { ProductsPageComponent } from '@restaurant/pages/products-page/products-page.component';
import { restaurantConfigDataResolver } from './resolvers/restaurant-config.resolver';

export const routes: Route[] = [
  {
    path: 'products-page',
    title: 'Productos',
    component: ProductsPageComponent,
    data: {
      breadcrumb: 'Productos',
    },
    resolve: {
      configData: restaurantConfigDataResolver
    }
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
      breadcrumb: 'Configuración del Restaurante',
    },
  },
];
