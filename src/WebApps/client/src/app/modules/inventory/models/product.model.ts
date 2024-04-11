import { TAX_RATE_CODE } from "@core/constants/global.constants";

import { TarifaProductSearch } from "../shared/models/tarifa.model";

export interface Product {
  descripcion: string;
}

export interface ProductSearch {
  idArticulo: number,
  codigo: string,
  descripcion: string
  iva: string,
  stock: number,
  subFamilia: string,
  marca: string,
  medida: string
  fraccionado: boolean
  style: string
  tarifas: Array<TarifaProductSearch>,
  warehouses: unknown,
  precioSinSubsidio: number,
  s3ObjectUrl: string
  s3ObjectKey: string
  totalRecords: number
}

export interface ProductSale {
  idArticulo: number
  idMedida: number
  idTipoIva: number
  descripcion: string
  llevaInventario: true,
  precioCosto: number
  precioSinSubsidio: number
  tarifaImpuesto: string
  tarifa: number
  codigoPorcentaje:
  TAX_RATE_CODE.DIFFERENTIATED_TAX
  | TAX_RATE_CODE.FOURTEEN_PERCENT
  | TAX_RATE_CODE.NOT_SUBJECT_TO_TAX
  | TAX_RATE_CODE.TAX_EXEMPT
  | TAX_RATE_CODE.TWELVE_PERCENT
  | TAX_RATE_CODE.ZERO_PERCENT
  codigoArticulo: string
  stock: string
  s3ObjectKey: string
  s3ObjectUrl: string
}


