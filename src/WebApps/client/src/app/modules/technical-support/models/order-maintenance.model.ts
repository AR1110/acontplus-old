import { ConsolidacionBodega } from "@modules/inventory/shared/models/consolidacion-bodega.model"
import { MedidaProducto } from "@modules/inventory/shared/models/measure.model"
import { TarifaProducto } from "@modules/inventory/shared/models/tarifa.model"

export interface OrderMaintenance {
  rowguid: string
  bodegaId: number
  feeId: number
  medidaId: number
  orderDetailId: number
  productId: number
  descripcion: string
  codigo: string
  taxId: number
  taxPercentId: number
  quantity: number
  cost: number
  precioConIva: number
  taxValue: number
  price: number
  percentageDiscount: number
  discount: number
  precioTotalSinImpuesto: number
  total: number
  obs: string
  medidas: MedidaProducto[]
  tarifas: TarifaProducto[]
  consolidacionesBodega: ConsolidacionBodega[]
  costoFraccionado: number
  conversion: number
}

export type ColOrderMaintenance = keyof OrderMaintenance;
