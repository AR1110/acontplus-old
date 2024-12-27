import {ClassProvider} from "@angular/core";
import {ProductRepository} from "@inventory/domain/repositories/product.repository";
import {ProductWebRepository} from "@inventory/data/product/product-web.repository";
import {ProductDeprecatedRepository} from "@inventory/data/product/product-deprecated.repository";

export const productProvider:ClassProvider = {
  provide: ProductRepository,
  useClass: ProductWebRepository
}

