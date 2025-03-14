import {ClassProvider} from "@angular/core";
import {ProductPhotoRepository} from "@inventory/domain/repositories/product-photo.repository";
import {ProductPhotoRepositoryImpl} from "@inventory/data/product-photo/product-photo-repository-impl";

export const productPhotoProvider:ClassProvider = {
  provide: ProductPhotoRepository,
  useClass: ProductPhotoRepositoryImpl
}

