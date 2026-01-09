import { Route } from '@angular/router';
import { permissionGuard } from '@core/guards/permission.guard';
import { INVENTORY_MODULES_CODE, INVENTORY_ROUTES } from '@inventory/inventory.const';
import { ACTION_ALIASES } from '@core/constants/permission-actions';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/inventory-home.component').then((m) => m.InventoryHomeComponent),
    data: { breadcrumb: 'Inventario' },
  },
  {
    path: 'category',
    title: 'Categoria',
    loadComponent: () =>
      import('@inventory/ui/category-page/category-page.component').then(
        (m) => m.CategoryPageComponent,
      ),
    data: {
      breadcrumb: 'Reporte Compras',
    },
  },
  {
    path: 'subcategories',
    title: 'SubCategoria',
    loadComponent: () =>
      import('@inventory/ui/sub-category/sub-category').then(
        (m) => m.SubCategory,
      ),
    data: {
      breadcrumb: 'Sub Categorias',
    },
  },

  {
    path: INVENTORY_ROUTES.products,
    title: 'Productos',
    loadComponent: () =>
      import('@inventory/ui/product/product').then(
        (m) => m.Product,
      ),
    canActivate: [permissionGuard],
    data: {
      breadcrumb: 'Productos',
      context: INVENTORY_MODULES_CODE.PRODUCT,
      requiredActions: [ACTION_ALIASES.READ],
    },
  },
  {
    path: 'fracc-product',
    title: 'Productos Fraccionados',
    loadComponent: () =>
      import('@inventory/ui/fracc-product-page/fracc-product-page.component').then(
        (m) => m.FraccProductPageComponent,
      ),
    data: {
      breadcrumb: 'Productos Fraccionados',
    },
  },
  {
    path: 'massive-tax-page',
    title: 'Cambio Masivo de IVA',
    loadComponent: () =>
      import('@inventory/ui/massive-tax-page/massive-tax-page.component').then(
        (m) => m.MassiveTaxPageComponent,
      ),
    data: {
      breadcrumb: 'Cambio Masivo de IVA',
    },
  },
  {
    path: 'lot-price-page',
    title: 'Precio por Lote',
    loadComponent: () =>
      import('@inventory/ui/lot-price-page/lot-price-page.component').then(
        (m) => m.LotPricePageComponent,
      ),
    data: {
      breadcrumb: 'Precio por Lote',
    },
  },

  {
    path: 'measure',
    title: 'Medida',
    loadComponent: () =>
      import('@inventory/ui/measure-page/measure-page.component').then(
        (m) => m.MeasurePageComponent,
      ),
    data: {
      breadcrumb: 'Medida',
    },
  },
  {
    path: 'brand',
    title: 'Marca',
    loadComponent: () =>
      import('@inventory/ui/brand-page/brand-page').then((m) => m.BrandPage),
    data: {
      breadcrumb: 'Marca',
    },
  },
  {
    path: 'model',
    title: 'Modelo',
    loadComponent: () =>
      import('@inventory/ui/inv-model-page/inv-model-page.component').then(
        (m) => m.InvModelPageComponent,
      ),
    data: {
      breadcrumb: 'Modelo',
    },
  },
  {
    path: 'tarifa',
    title: 'Tarifa',
    loadComponent: () =>
      import('@inventory/ui/tarifa-page/tarifa-page.component').then((m) => m.TarifaPageComponent),
    data: {
      breadcrumb: 'Tarifa',
    },
  },
  {
    path: 'tags',
    title: 'Etiquetas',
    loadComponent: () => import('@inventory/ui/tags/tags.component').then((m) => m.TagsComponent),
    data: {
      breadcrumb: 'Etiquetas',
    },
  },
  {
    path: 'report',
    title: 'Reporte Inventario',
    loadComponent: () =>
      import('@inventory/ui/inventory-report/inventory-report.component').then(
        (m) => m.InventoryReportComponent,
      ),
    data: {
      breadcrumb: 'Reporte Inventario',
    },
  },
  {
    path: 'inventory-adjustments',
    loadComponent: () =>
      import(
        '@inventory/ui/inventory-adjustment/inventory-adjustment.component'
      ).then((m) => m.InventoryAdjustmentComponent),
    data: {
      breadcrumb: 'Ajuste Inventario',
    },
  },
  {
    path: 'warehouse-transfer',
    loadComponent: () =>
      import('@inventory/ui/warehouse-transfer/warehouse-transfer').then(
        (m) => m.WarehouseTransfer,
      ),
    canActivate: [permissionGuard],
    data: {
      breadcrumb: 'Transferencia de Mercaderia',
      context: INVENTORY_MODULES_CODE.WAREHOUSE_TRANSFER,
      requiredActions: [ACTION_ALIASES.READ],
    },
  },
];
