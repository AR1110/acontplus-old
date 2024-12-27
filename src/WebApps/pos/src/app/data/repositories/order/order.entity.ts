import { OrderItem } from "@domain/models/order.model"

export interface OrderItemApi {
  uuid: string
  itemTypeCode: string
  menuId: number
  itemId: number
  taxId: number
  taxPercentId: number
  feeId: number
  taxValue: number
  quantity: number
  cost: number
  price: number
  discount: number
  total: number
  obs?: string | null
  bodegaId: number
  medidaId: number
}


export interface OrderApi {
  orderId: number
  uuid: string,
  items: Array<OrderItemApi>,
  customDetail?: Array<OrderItem>
  itemsToPay?: Array<OrderItem>
  establecimientoId: number
  puntoEmisionId: number
  tableId: number
  subtotalSinImpuestos: number
  codDoc?: string
  customerCompanyId: number
  tax: number
  discount: number
  tip: number
  total: number
  obs?: string | null,
  userId: number
  taxPercentId: number
  quickSale?: boolean
  saveDoc?: boolean
  updateOrder?: boolean,
  taxes: []
}
