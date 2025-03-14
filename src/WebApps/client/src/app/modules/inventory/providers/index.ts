import {productProvider} from "@inventory/providers/product.provider";
import {tagProvider} from "@inventory/providers/tag.provider";
import {inventarioModeloProvider} from "@inventory/providers/inventario-modelo.provider";
import {brandProvider} from "@inventory/providers/brand.provider";
import {measureProvider} from "@inventory/providers/measure.provider";
import {massiveTaxProvider} from "@inventory/providers/massive-tax.provider";
import {transferenciaBodegaProvider} from "@inventory/providers/transferencia-bodega.provider";
import {productUbicationProvider} from "@inventory/providers/product-ubication.provider";
import {productBarcodeProvider} from "@inventory/providers/product-barcode.provider";
import {fractionalProvider} from "@inventory/providers/fractional-product.provider";
import {productPhotoProvider} from "@inventory/providers/product-photo.provider";

export const inventoryProviders = [
  productProvider,
  tagProvider,
  inventarioModeloProvider,
  brandProvider,
  measureProvider,
  massiveTaxProvider,
  transferenciaBodegaProvider,
  productUbicationProvider,
  productBarcodeProvider,
  fractionalProvider,
  productPhotoProvider
]
