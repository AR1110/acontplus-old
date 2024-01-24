import { Route } from "@angular/router";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { SubCategoryPageComponent } from "./pages/sub-category-page/sub-category-page.component";


export const routes: Route[] = [
  {
    path: 'category-page',
    title: 'Categoria',
    component: CategoryPageComponent,
    data: {
      breadcrumb: 'Reporte Compras'
    }
  },
  {
    path: 'subcategory-page',
    title: 'SubCategoria',
    component: SubCategoryPageComponent,
    data: {
      breadcrumb: 'Reporte Compras'
    }
  },


]
