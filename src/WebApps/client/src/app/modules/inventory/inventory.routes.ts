import { Route } from '@angular/router';

import { CategoryPageComponent } from '@inventory/ui/category-page/category-page.component';
import { LotPricePageComponent } from '@inventory/ui/lot-price-page/lot-price-page.component';
import { MassiveTaxPageComponent } from '@inventory/ui/massive-tax-page/massive-tax-page.component';
import { MeasurePageComponent } from '@inventory/ui/measure-page/measure-page.component';
import { SubCategoryComponent } from '@inventory/ui/sub-category/sub-category.component';
import { InventoryReportComponent } from '@inventory/ui/inventory-report/inventory-report.component';
import { BrandPageComponent } from '@inventory/ui/brand-page/brand-page.component';
import { InvModelPageComponent } from '@inventory/ui/inv-model-page/inv-model-page.component';
import { TarifaPageComponent } from '@inventory/ui/tarifa-page/tarifa-page.component';
import { TagsComponent } from '@inventory/ui/tags/tags.component';
import { FraccProductPageComponent } from '@inventory/ui/fracc-product-page/fracc-product-page.component';
import { Product } from '@inventory/product/presentation/product/product';
import { InventoryAdjustmentComponent } from '@inventory/inventory-adjustment/presentation/inventory-adjustment/inventory-adjustment.component';
import { InventoryHomeComponent } from './ui/inventory-home.component';
import { WarehouseTransfer } from '@inventory/ui/warehouse-transfer/warehouse-transfer';
import {permissionGuard} from "@core/guards/permission.guard";
import {INVENTORY_MODULES_CODE, INVENTORY_ROUTES} from "@inventory/domain/enums/inventory.enum";
import {ACTION_ALIASES} from "@core/constants/permission-actions";

export const routes: Route[] = [
  {
    path: '',
    component: InventoryHomeComponent,
    data: { breadcrumb: 'Inventario' },
  },
  {
    path: 'category',
    title: 'Categoria',
    component: CategoryPageComponent,
    data: {
      breadcrumb: 'Reporte Compras',
    },
  },
  {
    path: 'subcategories',
    title: 'SubCategoria',
    component: SubCategoryComponent,
    data: {
      breadcrumb: 'Sub Categorias',
    },
  },

  {
    path: INVENTORY_ROUTES.products,
    title: 'Productos',
    component: Product,
    canActivate: [permissionGuard],
    data: {
      breadcrumb: 'Productos',
      context: INVENTORY_MODULES_CODE.PRODUCT,
      requiredActions: [ACTION_ALIASES.READ]
    },
  },
  {
    path: 'fracc-product',
    title: 'Productos Fraccionados',
    component: FraccProductPageComponent,
    data: {
      breadcrumb: 'Productos Fraccionados',
    },
  },
  {
    path: 'massive-tax-page',
    title: 'Cambio Masivo de IVA',
    component: MassiveTaxPageComponent,
    data: {
      breadcrumb: 'Cambio Masivo de IVA',
    },
  },
  {
    path: 'lot-price-page',
    title: 'Precio por Lote',
    component: LotPricePageComponent,
    data: {
      breadcrumb: 'Precio por Lote',
    },
  },

  {
    path: 'measure',
    title: 'Medida',
    component: MeasurePageComponent,
    data: {
      breadcrumb: 'Medida',
    },
  },
  {
    path: 'brand',
    title: 'Marca',
    component: BrandPageComponent,
    data: {
      breadcrumb: 'Marca',
    },
  },
  {
    path: 'model',
    title: 'Modelo',
    component: InvModelPageComponent,
    data: {
      breadcrumb: 'Modelo',
    },
  },
  {
    path: 'tarifa',
    title: 'Tarifa',
    component: TarifaPageComponent,
    data: {
      breadcrumb: 'Tarifa',
    },
  },
  {
    path: 'tags',
    title: 'Etiquetas',
    component: TagsComponent,
    data: {
      breadcrumb: 'Etiquetas',
    },
  },
  {
    path: 'report',
    title: 'Reporte Inventario',
    component: InventoryReportComponent,
    data: {
      breadcrumb: 'Reporte Inventario',
    },
  },
  {
    path: 'inventory-adjustments',
    component: InventoryAdjustmentComponent,
    data: {
      breadcrumb: 'Ajuste Inventario',
    },
  },
  {
    path: 'warehouse-transfer',
    component: WarehouseTransfer,
    canActivate: [permissionGuard],
    data: {
      breadcrumb: 'Transferencia de Mercaderia',
      context: INVENTORY_MODULES_CODE.WAREHOUSE_TRANSFER,
      requiredActions: [ACTION_ALIASES.READ]
    },
  },
];
