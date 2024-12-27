import { ConsolidacionBodega } from "@inventory/domain/models/consolidacion-bodega.model"
import { MedidaProducto } from "@inventory/domain/models/measure.model"
import { TarifaProducto } from "@inventory/domain/models/tarifa.model"

export interface OrderMaintenance {
  id: number
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
  obs?: string | null
  medidas: MedidaProducto[]
  tarifas: TarifaProducto[]
  consolidacionesBodega: ConsolidacionBodega[]
  costoFraccionado: number
  llevaInventario: boolean
  conversion: number
  deviceName?:  string | null
}

export type ColOrderMaintenance = keyof OrderMaintenance;
