import { Provider } from '@angular/core';
import { BrandRepository } from '@inventory/domain/repositories/brand.repository';
import { BrandWebRepository } from '@inventory/data/brand/brand-web.repository';
import { FractionalProductHttp } from '@inventory/data/fractional-product-http';
import { InventarioModeloRepository } from '@inventory/domain/repositories/inventario-modelo.repository';
import { InventarioModeloWebRepository } from '@inventory/data/inventario-modelo/inventario-modelo-web.repository';
import { MassiveTaxRepository } from '@inventory/domain/repositories/massive-tax.repository';
import { MassiveTaxWebRepository } from '@inventory/data/massive-tax/massive-tax-web.repository';
import { MeasureRepository } from '@inventory/domain/repositories/measure.repository';
import { MeasureWebRepository } from '@inventory/data/measure/measure-web.repository';
import { ProductHttp } from '@inventory/data/product-http';
import { ProductBarcodeHttp } from '@inventory/data/product-barcode-http';
import { ProductPhotoHttp } from '@inventory/data/product-photo-http';
import { ProductUbicationHttp } from '@inventory/data/product-ubication-http';
import { TagRepository } from '@inventory/domain/repositories/tag.repository';
import { TagWebRepository } from '@inventory/data/tag/tag-web.repository';
import { WarehouseTransferRepository } from '@inventory/domain/repositories/warehouse-transfer.repository';
import { WarehouseTransferHttpRepository } from '@inventory/data/warehouse-transfer/warehouse-transfer-http.repository';
import { WarehouseRepository } from '@inventory/domain/repositories/warehouse.repository';
import { WarehouseRepositoryImpl } from '@inventory/data/warehouse/warehouse-repository.impl';
import {
  FRACTIONAL_PRODUCT_SERVICE,
  PRODUCT_SERVICE,
  PRODUCT_BARCODE_SERVICE,
  PRODUCT_PHOTO_SERVICE,
  PRODUCT_UBICATION_SERVICE,
} from '@inventory/tokens/inventory-token';
import { InventoryAdjustmentRepository } from '@inventory/inventory-adjustment/domain/repositories/inventory-adjustment.repository';
import { InventoryAdjustmentRepositoryImpl } from '@inventory/inventory-adjustment/infrastructure/inventory-adjustment-repository.impl';

export const DATA_INVENTORY_IOC: Provider[] = [
  {
    provide: BrandRepository,
    useClass: BrandWebRepository,
  },
  {
    provide: FRACTIONAL_PRODUCT_SERVICE,
    useClass: FractionalProductHttp,
  },
  {
    provide: InventarioModeloRepository,
    useClass: InventarioModeloWebRepository,
  },
  {
    provide: MassiveTaxRepository,
    useClass: MassiveTaxWebRepository,
  },
  {
    provide: MeasureRepository,
    useClass: MeasureWebRepository,
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
    provide: TagRepository,
    useClass: TagWebRepository,
  },
  {
    provide: WarehouseTransferRepository,
    useClass: WarehouseTransferHttpRepository,
  },
  {
    provide: WarehouseRepository,
    useClass: WarehouseRepositoryImpl,
  },
  {
    provide: InventoryAdjustmentRepository,
    useClass: InventoryAdjustmentRepositoryImpl,
  },
];
