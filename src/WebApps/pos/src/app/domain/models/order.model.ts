import { ConsolidacionFecha, MedidaProducto } from "@domain/models/inventory/medida.model"
import { TarifaProducto } from "@domain/models/inventory/tarifa.model"
import {UserSelectHtmlOnly} from "@domain/models/user.model";



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



export interface OrderData {
  order: Order
}



export interface GetFilterDataOrderResponse {
  tablesGroup: any[]
  users:  UserSelectHtmlOnly[]
}

export interface OrderList {
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
  identificacionComprador: string
  userName: string
  totalRecords: number
  divided: boolean
  finished: boolean
  tableName: string
}

export class ListOrderResponse {
  data: OrderList[]=[]
  totalRecords: number = 0
}

export interface GetIdOrderResponse {
  order: Order
}

export class GetStatsOrderResponse {
  sales:   any[]=[]
  productsTop:   any[]=[]
  documentCounts:   any[]=[]
}
