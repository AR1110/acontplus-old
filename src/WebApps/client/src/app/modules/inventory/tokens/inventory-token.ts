import { FractionalProductRepository } from '@inventory/domain/interfaces/fractional-product.repository';
import { ProductRepository } from '@inventory/domain/interfaces/product.repository';
import { InjectionToken } from '@angular/core';
import { ProductBarcodeRepository } from '@inventory/domain/interfaces/product-barcode.repository';
import { ProductUbicationRepository } from '@inventory/domain/interfaces/product-ubication.repository';
import { ProductPhotoRepository } from '@inventory/domain/interfaces/product-photo.repository';
import { InventoryAdjustmentRepository } from '@inventory/domain/interfaces/inventory-adjustment.repository';
import { BrandRepository } from '@inventory/domain/repositories/brand.repository';
import { MeasureRepository } from '@inventory/domain/repositories/measure.repository';
import { TagRepository } from '@inventory/domain/repositories/tag.repository';
import { WarehouseRepository } from '@inventory/domain/repositories/warehouse.repository';
import { WarehouseTransferRepository } from '@inventory/domain/repositories/warehouse-transfer.repository';
import { MassiveTaxRepository } from '@inventory/domain/repositories/massive-tax.repository';
import { InventarioModeloRepository } from '@inventory/domain/repositories/inventario-modelo.repository';

export const FRACTIONAL_PRODUCT_SERVICE = new InjectionToken<FractionalProductRepository>(
  'FRACTIONAL_PRODUCT_SERVICE',
);

export const PRODUCT_SERVICE = new InjectionToken<ProductRepository>('PRODUCT_SERVICE');

export const PRODUCT_PHOTO_SERVICE = new InjectionToken<ProductPhotoRepository>(
  'PRODUCT_PHOTO_SERVICE',
);

export const PRODUCT_BARCODE_SERVICE = new InjectionToken<ProductBarcodeRepository>(
  'PRODUCT_BARCODE_SERVICE',
);

export const PRODUCT_UBICATION_SERVICE = new InjectionToken<ProductUbicationRepository>(
  'PRODUCT_UBICATION_SERVICE',
);

export const INVENTORY_ADJUSTMENT_SERVICE = new InjectionToken<InventoryAdjustmentRepository>(
  'INVENTORY_ADJUSTMENT_SERVICE',
);

export const BRAND_SERVICE = new InjectionToken<BrandRepository>('BRAND_SERVICE');

export const MEASURE_SERVICE = new InjectionToken<MeasureRepository>('MEASURE_SERVICE');

export const TAG_SERVICE = new InjectionToken<TagRepository>('TAG_SERVICE');

export const WAREHOUSE_SERVICE = new InjectionToken<WarehouseRepository>('WAREHOUSE_SERVICE');

export const WAREHOUSE_TRANSFER_SERVICE = new InjectionToken<WarehouseTransferRepository>(
  'WAREHOUSE_TRANSFER_SERVICE',
);

export const MASSIVE_TAX_SERVICE = new InjectionToken<MassiveTaxRepository>('MASSIVE_TAX_SERVICE');

export const INVENTARIO_MODELO_SERVICE = new InjectionToken<InventarioModeloRepository>(
  'INVENTARIO_MODELO_SERVICE',
);
