import { Provider } from '@angular/core';
import { BrandHttp } from '@inventory/data/https/brand-http';
import { FractionalProductHttp } from '@inventory/data/https/fractional-product-http';
import { InventarioModeloHttp } from '@inventory/data/https/inventario-modelo-http';
import { MassiveTaxHttp } from '@inventory/data/https/massive-tax-http';
import { MeasureHttp } from '@inventory/data/https/measure-http';
import { ProductHttp } from '@inventory/data/https/product-http';
import { ProductBarcodeHttp } from '@inventory/data/https/product-barcode-http';
import { ProductPhotoHttp } from '@inventory/data/https/product-photo-http';
import { ProductUbicationHttp } from '@inventory/data/https/product-ubication-http';
import { TagHttp } from '@inventory/data/https/tag-http';
import { WarehouseTransferHttp } from '@inventory/data/https/warehouse-transfer-http';
import { WarehouseHttp } from '@inventory/data/https/warehouse-http';
import {
  FRACTIONAL_PRODUCT_SERVICE,
  PRODUCT_SERVICE,
  PRODUCT_BARCODE_SERVICE,
  PRODUCT_PHOTO_SERVICE,
  PRODUCT_UBICATION_SERVICE,
  INVENTORY_ADJUSTMENT_SERVICE,
  BRAND_SERVICE,
  MEASURE_SERVICE,
  TAG_SERVICE,
  WAREHOUSE_SERVICE,
  WAREHOUSE_TRANSFER_SERVICE,
  MASSIVE_TAX_SERVICE,
  INVENTARIO_MODELO_SERVICE,
  SUB_CATEGORY_SERVICE,
  LOT_PRICE_HTTP_TOKEN,
  CATEGORY_SERVICE,
  SUBCATEGORY_PHOTO_SERVICE,
  STOCK_SERVICE,
  TARIFA_SERVICE,
  TRANSACTION_SERVICE,
} from '@inventory/data/inventory-token';
import { InventoryAdjustmentHttp } from '@inventory/data/https/inventory-adjustment-http';
import { SubCategoryHttp } from '@inventory/data/https/sub-category-http';
import { LotPriceHttp } from '@inventory/data/https/lot-price-http';
import { CategoryHttp } from '@inventory/data/https/category-http';
import { SubcategoryPhotoHttp } from '@inventory/data/https/subcategory-photo-http';
import { StockHttp } from '@inventory/data/https/stock-http';
import { TarifaHttp } from '@inventory/data/https/tarifa-http';
import { TransactionHttp } from '@inventory/data/https/transaction-http';

export const DATA_INVENTORY_IOC: Provider[] = [
  {
    provide: BRAND_SERVICE,
    useClass: BrandHttp,
  },
  {
    provide: FRACTIONAL_PRODUCT_SERVICE,
    useClass: FractionalProductHttp,
  },
  {
    provide: INVENTARIO_MODELO_SERVICE,
    useClass: InventarioModeloHttp,
  },
  {
    provide: MASSIVE_TAX_SERVICE,
    useClass: MassiveTaxHttp,
  },
  {
    provide: MEASURE_SERVICE,
    useClass: MeasureHttp,
  },
  {
    provide: PRODUCT_SERVICE,
    useClass: ProductHttp,
  },
  {
    provide: PRODUCT_BARCODE_SERVICE,
    useClass: ProductBarcodeHttp,
  },
  {
    provide: PRODUCT_PHOTO_SERVICE,
    useClass: ProductPhotoHttp,
  },
  {
    provide: PRODUCT_UBICATION_SERVICE,
    useClass: ProductUbicationHttp,
  },
  {
    provide: TAG_SERVICE,
    useClass: TagHttp,
  },
  {
    provide: WAREHOUSE_TRANSFER_SERVICE,
    useClass: WarehouseTransferHttp,
  },
  {
    provide: WAREHOUSE_SERVICE,
    useClass: WarehouseHttp,
  },
  {
    provide: INVENTORY_ADJUSTMENT_SERVICE,
    useClass: InventoryAdjustmentHttp,
  },
  {
    provide: SUB_CATEGORY_SERVICE,
    useClass: SubCategoryHttp,
  },
  {
    provide: LOT_PRICE_HTTP_TOKEN,
    useClass: LotPriceHttp,
  },
  {
    provide: CATEGORY_SERVICE,
    useClass: CategoryHttp,
  },
  {
    provide: SUBCATEGORY_PHOTO_SERVICE,
    useClass: SubcategoryPhotoHttp,
  },
  {
    provide: STOCK_SERVICE,
    useClass: StockHttp,
  },
  {
    provide: TARIFA_SERVICE,
    useClass: TarifaHttp,
  },
  {
    provide: TRANSACTION_SERVICE,
    useClass: TransactionHttp,
  },
];
