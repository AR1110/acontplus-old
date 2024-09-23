import { Route } from "@angular/router";

import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { LotPricePageComponent } from "./pages/lot-price-page/lot-price-page.component";
import { MassiveTaxPageComponent } from "./pages/massive-tax-page/massive-tax-page.component";
import { MeasurePageComponent } from "./pages/measure-page/measure-page.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";
import { SubCategoryPageComponent } from "./pages/sub-category-page/sub-category-page.component";
import {InventoryReportPageComponent} from "@inventory/reports/inventory-report-page/inventory-report-page.component";
import { BrandPageComponent } from "./pages/brand-page/brand-page.component";
import { InvModelPageComponent } from "./pages/inv-model-page/inv-model-page.component";
import { TarifaPageComponent } from "./pages/tarifa-page/tarifa-page.component";
import { TagsPageComponent } from "./pages/tags-page/tags-page.component";

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
    path: 'subcategory',
    title: 'SubCategoria',
    component: SubCategoryPageComponent,
    data: {
      breadcrumb: 'Sub Categorias'
    }
  },

  {
    path: 'product',
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
    path: 'measure',
    title: 'Medida',
    component: MeasurePageComponent,
    data: {
      breadcrumb: 'Medida'
    },
  },
  {
    path: 'brand',
    title: 'Marca',
    component: BrandPageComponent,
    data: {
      breadcrumb: 'Marca'
    },
  },
  {
    path: 'model',
    title: 'Modelo',
    component: InvModelPageComponent,
    data: {
      breadcrumb: 'Modelo'
    },
  },
  {
    path: 'tarifa',
    title: 'Tarifa',
    component: TarifaPageComponent,
    data: {
      breadcrumb: 'Tarifa'
    },
  },
  {
    path: 'tags',
    title: 'Etiquetas',
    component: TagsPageComponent,
    data: {
      breadcrumb: 'Etiquetas'
    },
  },
  {
    path: 'report',
    title: 'Reporte Inventario',
    component: InventoryReportPageComponent,
    data: {
      breadcrumb:  'Reporte Inventario'
    }
  }


]
