import {ClassProvider} from "@angular/core";
import {ProductRepository} from "@inventory/domain/repositories/product.repository";
import {ProductRepositoryImpl} from "@inventory/data/product/product-repository-impl";

export const productProvider:ClassProvider = {
  provide: ProductRepository,
  useClass: ProductRepositoryImpl
}

