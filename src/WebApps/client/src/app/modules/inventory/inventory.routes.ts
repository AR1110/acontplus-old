import { Route } from "@angular/router";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";


export const routes: Route[] = [{
  path: 'category-page',
  title: 'Categoria',
  component: CategoryPageComponent,
  data: {
    breadcrumb: 'Reporte Compras'
  }
},]
