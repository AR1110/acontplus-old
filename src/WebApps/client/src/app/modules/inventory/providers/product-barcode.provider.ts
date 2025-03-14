import {ClassProvider} from "@angular/core";
import {ProductBarcodeRepository} from "@inventory/domain/repositories/product-barcode.repository";
import {ProductBarcodeRepositoryImpl} from "@inventory/data/product-barcode/product-barcode-repository-impl";

export const productBarcodeProvider:ClassProvider = {
  provide: ProductBarcodeRepository,
  useClass: ProductBarcodeRepositoryImpl,
}

