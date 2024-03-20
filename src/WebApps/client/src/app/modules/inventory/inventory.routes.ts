import { Route } from "@angular/router";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { SubCategoryPageComponent } from "./pages/sub-category-page/sub-category-page.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";
import { MassiveTaxChangePageComponent } from "./pages/massive-tax-change-page/massive-tax-change-page.component";


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

  {
    path: 'product-page',
    title: 'Productos',
    component: ProductPageComponent,
    data: {
      breadcrumb: 'Productos'
    },
  },
  {
    path: 'massive-tax-change-page',
    title: 'Cambio Masivo de IVA',
    component: MassiveTaxChangePageComponent,
    data: {
      breadcrumb: 'Cambio Masivo de IVA'
    },
  },


]
