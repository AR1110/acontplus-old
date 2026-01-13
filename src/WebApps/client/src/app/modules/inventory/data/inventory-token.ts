import { FractionalProductRepository } from '@inventory/data/repositories/fractional-product.repository';
import { ProductRepository } from '@inventory/data/repositories/product.repository';
import { InjectionToken } from '@angular/core';
import { ProductBarcodeRepository } from '@inventory/data/repositories/product-barcode.repository';
import { ProductUbicationRepository } from '@inventory/data/repositories/product-ubication.repository';
import { ProductPhotoRepository } from '@inventory/data/repositories/product-photo.repository';
import { InventoryAdjustmentRepository } from '@inventory/data/repositories/inventory-adjustment.repository';
import { BrandRepository } from '@inventory/data/repositories/brand.repository';
import { MeasureRepository } from '@inventory/data/repositories/measure.repository';
import { TagRepository } from '@inventory/data/repositories/tag.repository';
import { WarehouseRepository } from '@inventory/data/repositories/warehouse.repository';
import { WarehouseTransferRepository } from '@inventory/data/repositories/warehouse-transfer.repository';
import { MassiveTaxRepository } from '@inventory/data/repositories/massive-tax.repository';
import { InventarioModeloRepository } from '@inventory/data/repositories/inventario-modelo.repository';
import { SubCategoryRepository } from '@inventory/data/repositories/sub-category.repository';
import { LotPriceRepository } from '@inventory/data/repositories/lot-price-repository';
import { CategoryRepository } from './repositories/category.repository';
import { SubcategoryPhotoRepository } from './repositories/subcategory-photo.repository';
import { StockRepository } from './repositories/stock.repository';
import { TarifaRepository } from './repositories/tarifa.repository';
import { TransactionRepository } from './repositories/transaction.repository';

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

export const BRAND_HTTP_TOKEN = new InjectionToken<BrandRepository>('BRAND_HTTP_TOKEN');

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

export const SUB_CATEGORY_SERVICE = new InjectionToken<SubCategoryRepository>(
  'SUB_CATEGORY_SERVICE',
);

export const LOT_PRICE_HTTP_TOKEN = new InjectionToken<LotPriceRepository>('LOT_PRICE_HTTP_TOKEN');
export const CATEGORY_SERVICE = new InjectionToken<CategoryRepository>('CATEGORY_SERVICE');

export const SUBCATEGORY_PHOTO_SERVICE = new InjectionToken<SubcategoryPhotoRepository>(
  'SUBCATEGORY_PHOTO_SERVICE',
);

export const STOCK_SERVICE = new InjectionToken<StockRepository>('STOCK_SERVICE');

export const TARIFA_SERVICE = new InjectionToken<TarifaRepository>('TARIFA_SERVICE');

export const TRANSACTION_SERVICE = new InjectionToken<TransactionRepository>('TRANSACTION_SERVICE');
