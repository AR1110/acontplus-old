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
      import('@inventory/ui/category-page/category-page').then(
        (m) => m.CategoryPage,
      ),
    data: {
      breadcrumb: 'Reporte Compras',
    },
  },
  {
    path: 'subcategories',
    title: 'SubCategoria',
    loadComponent: () =>
      import('@inventory/ui/sub-category/sub-category-page').then(
        (m) => m.SubCategoryPage,
      ),
    data: {
      breadcrumb: 'Sub Categorias',
    },
  },

  {
    path: INVENTORY_ROUTES.products,
    title: 'Productos',
    loadComponent: () =>
      import('@inventory/ui/product/product-page').then(
        (m) => m.ProductPage,
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
      import('@inventory/ui/fracc-product-page/fracc-product-page').then(
        (m) => m.FraccProductPage,
      ),
    data: {
      breadcrumb: 'Productos Fraccionados',
    },
  },
  {
    path: 'massive-tax-page',
    title: 'Cambio Masivo de IVA',
    loadComponent: () =>
      import('@inventory/ui/massive-tax-page/massive-tax-page').then(
        (m) => m.MassiveTaxPage,
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
      import('@inventory/ui/measure-page/measure-page').then(
        (m) => m.MeasurePage,
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
      import('@inventory/ui/inv-model-page/inv-model-page').then(
        (m) => m.InvModelPage,
      ),
    data: {
      breadcrumb: 'Modelo',
    },
  },
  {
    path: 'tarifa',
    title: 'Tarifa',
    loadComponent: () =>
      import('@inventory/ui/tarifa-page/tarifa-page').then((m) => m.TarifaPage),
    data: {
      breadcrumb: 'Tarifa',
    },
  },
  {
    path: 'tags',
    title: 'Etiquetas',
    loadComponent: () => import('@inventory/ui/tags/tags-page').then((m) => m.TagsPage),
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
        '@inventory/ui/inventory-adjustment/inventory-adjustment-page'
      ).then((m) => m.InventoryAdjustmentPage),
    data: {
      breadcrumb: 'Ajuste Inventario',
    },
  },
  {
    path: 'warehouse-page-transfer',
    loadComponent: () =>
      import('@inventory/ui/warehouse-transfer/warehouse-transfer-page').then(
        (m) => m.WarehouseTransferPage,
      ),
    canActivate: [permissionGuard],
    data: {
      breadcrumb: 'Transferencia de Mercaderia',
      context: INVENTORY_MODULES_CODE.WAREHOUSE_TRANSFER,
      requiredActions: [ACTION_ALIASES.READ],
    },
  },
];
