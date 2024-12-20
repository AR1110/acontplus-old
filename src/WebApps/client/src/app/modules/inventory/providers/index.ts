import {productProvider} from "@inventory/providers/product.provider";
import {tagProvider} from "@inventory/providers/tag.provider";
import {inventarioModeloProvider} from "@inventory/providers/inventario-modelo.provider";


export const inventoryProviders = [
  productProvider,
  tagProvider,
  inventarioModeloProvider
]
