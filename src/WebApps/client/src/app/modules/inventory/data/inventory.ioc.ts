import { Provider } from '@angular/core';
import { BrandWebRepository } from '@inventory/data/brand-web.repository';
import { FractionalProductHttp } from '@inventory/data/fractional-product-http';
import { InventarioModeloHttp } from '@inventory/data/inventario-modelo-http';
import { MassiveTaxHttp } from '@inventory/data/massive-tax-http';
import { MeasureHttp } from '@inventory/data/measure-http';
import { ProductHttp } from '@inventory/data/product-http';
import { ProductBarcodeHttp } from '@inventory/data/product-barcode-http';
import { ProductPhotoHttp } from '@inventory/data/product-photo-http';
import { ProductUbicationHttp } from '@inventory/data/product-ubication-http';
import { TagHttp } from '@inventory/data/tag-http';
import { WarehouseTransferHttp } from '@inventory/data/warehouse-transfer-http';
import { WarehouseHttp } from '@inventory/data/warehouse-http';
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
} from '@inventory/tokens/inventory-token';
import { InventoryAdjustmentHttp } from '@inventory/data/inventory-adjustment-http';

export const DATA_INVENTORY_IOC: Provider[] = [
  {
    provide: BRAND_SERVICE,
    useClass: BrandWebRepository,
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
];
