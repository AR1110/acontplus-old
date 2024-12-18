import { TAX_RATE_CODE } from "@domain/enums/main.enum"
import { Tarifa } from "./tarifa.model"


export interface ProductSearchApiDto {
  idArticulo: number
  codigo: string
  descripcion: string
  iva: string
  s3ObjectUrl: string
  priceSale: string
}

export interface ProductSearchDto {
  idArticulo: number
  codigo: string
  descripcion: string
  iva: string
  tarifas: Array<Tarifa>
  s3ObjectUrl: string
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


export interface ProductoConsolidacion {
    idArticulo: number
    idBodega: number
    fechaConsolidacion: Date
}
