import {ClassProvider} from "@angular/core";
import {ProductRepository} from "@domain/repositories/product.repository";
import {ProductRepositoryImpl} from "@data/repositories/product/product.repository.impl";


export const productProvider:ClassProvider = {
  provide: ProductRepository,
  useClass: ProductRepositoryImpl
}
