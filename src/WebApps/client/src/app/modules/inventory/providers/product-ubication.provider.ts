import {ClassProvider} from "@angular/core";
import {ProductUbicationRepository} from "@inventory/domain/repositories/product-ubication.repository";
import {ProductUbicationRepositoryImpl} from "@inventory/data/product-ubication/product-ubication-repository-impl";

export const productUbicationProvider:ClassProvider = {
  provide: ProductUbicationRepository,
  useClass: ProductUbicationRepositoryImpl,
}

