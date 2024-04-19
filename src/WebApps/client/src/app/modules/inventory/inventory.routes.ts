import { Route } from "@angular/router";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { SubCategoryPageComponent } from "./pages/sub-category-page/sub-category-page.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";
import { MassiveTaxPageComponent } from "./pages/massive-tax-page/massive-tax-page.component";
import { LotPricePageComponent } from "./pages/lot-price-page/lot-price-page.component";
import { MeasurePageComponent } from "./pages/measure-page/measure-page.component";


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
    path: 'massive-tax-page',
    title: 'Cambio Masivo de IVA',
    component: MassiveTaxPageComponent,
    data: {
      breadcrumb: 'Cambio Masivo de IVA'
    },
  },
  {
    path: 'lot-price-page',
    title: 'Precio por Lote',
    component: LotPricePageComponent,
    data: {
      breadcrumb: 'Precio por Lote'
    },
  },

  {
    path: 'measure-page',
    title: 'Medida',
    component: MeasurePageComponent,
    data: {
      breadcrumb: 'Medida'
    },
  },


]
