import { FractionalProductRepository } from '@inventory/domain/interfaces/fractional-product.repository';
import { ProductRepository } from '@inventory/domain/interfaces/product.repository';
import { InjectionToken } from '@angular/core';
import { ProductBarcodeRepository } from '@inventory/domain/interfaces/product-barcode.repository';
import { ProductUbicationRepository } from '@inventory/domain/interfaces/product-ubication.repository';
import { ProductPhotoRepository } from '@inventory/domain/interfaces/product-photo.repository';

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
