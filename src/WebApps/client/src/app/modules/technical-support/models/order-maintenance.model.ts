import { MedidaProducto } from "@modules/inventory/shared/models/measure.model"
import { TarifaProducto } from "@modules/inventory/shared/models/tarifa.model"

export interface OrderMaintenance {
  bodegaId: number
  feeId: number
  medidaId: number
  orderDetailId: number
  productId: number
  taxId: number
  taxPercentId: number
  quantity: number
  cost: number
  taxValue: number
  price: number
  discount: number
  total: number
  obs: string
  medidas: MedidaProducto[]
  tarifas: TarifaProducto[]
  costoFraccionado: number
  conversion: number
}
