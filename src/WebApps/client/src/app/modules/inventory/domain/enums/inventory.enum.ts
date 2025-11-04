export const enum INVENTORY_PATHS {
  PRODUCT_OLD = 'Articulo/',
  PRODUCT = 'Product/',
  CATEGORY = 'Familia/',
  SUBCATEGORY = 'SubFamilia/',
  MASSIVE_TAX = 'MassiveTax/',
  LOT_PRICE = 'LotPrice/',
  TRANSACTION = 'Transaccion/',
  MEASURE = 'Measure/',
  SUBCATEGORY_PHOTO = 'SubcategoryPhoto/',
  BRAND = 'Marca/',
  MODEL = 'Modelo/',
  TARIFA = 'Tarifa/',
  TAGS = 'Etiqueta/',
  PRODUCT_PHOTO = 'ProductPhoto/',
  STOCK = 'Stock/',
  TRANSFERENCIA_BODEGA = 'TransferenciaBodega',
  PRODUCT_UBICATION = 'ArticuloUbicacion',
  PRODUCT_BARCODE = 'ArticuloCodigoBarra',
  FRACTIONAL_PRODUCT = 'ArticuloFraccionado',
  WAREHOUSE = 'Bodega',
  INVENTORY_ADJUSTMENT = 'Consolidacion',
}

export const enum INVENTORY_CODE_REPORT {
  RK = 'RK',
  CDAA = 'CDAA',
  CDA = 'CDA',
  STOCK_VALORACION = 'INVRV',
  ARTICULO_PVP = 'INVAT',
  RAF = 'RAF', //REPORTE DE ARTICULOS FRACCIONADOS
  RCAA = 'RCAA', //REPORTE DE CADUCIDAD DE ARTICULOS
  RASR = 'RASR', //Reporte de Articulo Stock Valoración
  RCD = 'RCD', //Reporte Consolidacion Detalle
  RTB = 'RTB', //Reporte Transferencia Bodega
}

export enum InventoryDocumentType {
  CONSOLIDATION = 'CI',
  INVENTORY_WRITEOFF = 'BI',
  INVENTORY_RECEIPT = 'EI',
}

export enum InventoryTransactionType {
  INBOUND = 'E',
  OUTBOUND = 'S',
  ADJUSTMENT = 'A',
}

export const enum INVENTORY_ROUTES {
  products = 'products',
}
export const INVENTORY_MODULES_CODE = {
  PRODUCT: 'ART', //artpiculos
  WAREHOUSE_TRANSFER: 'TI', //Transferencia de Bodega
} as const;
