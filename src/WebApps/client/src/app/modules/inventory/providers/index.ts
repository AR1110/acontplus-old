import {productProvider} from "@inventory/providers/product.provider";
import {tagProvider} from "@inventory/providers/tag.provider";
import {inventarioModeloProvider} from "@inventory/providers/inventario-modelo.provider";
import {brandProvider} from "@inventory/providers/brand.provider";
import {measureProvider} from "@inventory/providers/measure.provider";
import {massiveTaxProvider} from "@inventory/providers/massive-tax.provider";


export const inventoryProviders = [
  productProvider,
  tagProvider,
  inventarioModeloProvider,
  brandProvider,
  measureProvider,
  massiveTaxProvider
]
