
import { TarifaProducto } from "./inventory/tarifa.model";
import { ConsolidacionFecha, MedidaProducto } from "./inventory/medida.model"

export interface OrderRead {
  id: number
  codDoc: string
  codEstab: string
  sequence: string
  serie: string
  tax: number
  discount: number
  tip: number
  total: number
  obs: string
  createdAt: string
  enabled: boolean
  deleted: boolean
  uuid: string
  razonSocialComprador: string
  userName: string
  totalRecords: number
  divided: boolean
  finished: boolean
  tableName: string
}



export type OrderItem = {
  uuid: string;
  itemTypeCode: string;
  itemTypeId?: number
  id: number;
  menuId: number;
  itemId: number;
  taxId: number; // idImpuesto
  taxPercentId: number; // idTarifaImpuesto/idTipoIva
  feeId: number; // idTarifa
  taxValue: number;
  quantity: number;
  remainingQuantity?: number // se usa en division
  cost: number;
  costoFraccionado: number
  price: number;
  discount: number;
  obs?: string;
  bodegaId: number;
  medidaId: number;

  codigoTarifaImpuesto: string // codigo de tarifa impuesto (tipo iva)
  taxPercent: number //Tarifa o procentaje del tipo iva (tarifa impuesto)
  //Campos Adicionales
  summary?: string
  productId: number
  code: string
  precioConIva: number
  precioTotalSinImpuesto: number // sin incluir iva
  total: number //ya es incluido iva
  medida: string
  descripcion: string;
  llevaInventario: boolean;
  img?: string;
  medidas: MedidaProducto[];
  pvps: TarifaProducto[]
  consolidacionesFecha: ConsolidacionFecha[]
  envioSri?: boolean
  paid?: boolean
  conversion:number
}

export type Order = {
  uuid: string
  orderId: number
  userId: number
  tipoIdentificacionSri: string
  customerCompanyId: number
  customerName: string
  createdAt: Date
  subtotalSinImpuestos: number
  items: Array<OrderItem>
  customDetail?: Array<OrderItem>
  itemsToPay?: Array<OrderItem>
  tableId: number
  obs?: string | null
  tableDesc?: string | null
  establecimientoId: number
  puntoEmisionId: number
  codDoc?: string
  tax: number
  discount: number
  tip: number
  total: number
  quickSale?: boolean
  bodegaId?: number
  saveDoc?: boolean
  updateOrder?: boolean
}




export interface OrderDivideItem extends OrderItem {
  remainingQuantityReal: number
}




//Save order to DataBase
export interface OrderItemPostDB {
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

export interface OrderPostDB {
  orderId: number
  uuid: string,
  items: Array<OrderItemPostDB>,
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



export interface OrderData {
  order: Order
}
