import {ClassProvider} from "@angular/core";
import {FractionalProductRepository} from "@inventory/domain/repositories/fractional-product.repository";
import {FractionalProductRepositoryImpl} from "@inventory/data/fractional-product/fractional-product-repository-impl";

export const fractionalProvider:ClassProvider = {
  provide: FractionalProductRepository,
  useClass: FractionalProductRepositoryImpl,
}

