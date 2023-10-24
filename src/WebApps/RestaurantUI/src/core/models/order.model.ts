import dayjs from "dayjs";
import { formatDateTimeZone } from "../utilities";
import { DOC_TYPE } from "../constants";

export interface RawOrderData {
  id: number;
  codEstab: string
  establecimientoId: number;
  puntoEmisionId: number;
  appTableId?: number;
  tableId: number;
  sequence: number;
  serie: string;
  telefonoEstablecimiento: string
  nombreComercialEstab: string
  customerCompanyId?: number;
  tax?: number;
  discount: number;
  tip?: number;
  total: number;
  obs?: string;
  createdAt: string;
  updatedAt?: string;
  enabled: boolean;
  deleted?: string;
  userId: number;
  uuid?: string;
  documentoId: number;
  codDoc?: "" | DOC_TYPE.FV | DOC_TYPE.NE
  nameFiscal: string
  telefonoCliente: string
  userName: string
  totalRecords: number
  divided: boolean
  finished: boolean
}

export interface OrderReadDto {
  orderId: number;
  documentoId: number;
  establecimientoId: number;
  codEstab: string
  telefonoEstablecimiento: string
  nombreComercialEstab: string
  puntoEmisionId: number;
  nameFiscal: string
  telefonoCliente: string
  userName: string
  serie: string;
  total: number;
  codDoc?: "" | DOC_TYPE.FV | DOC_TYPE.NE;
  createdAt: string;
  totalRecords: number
  divided: boolean 
  finished: boolean
}



export type IOrderDocument = {
  id: number
  codEstab: string
  documentoId: number
  orderId: number
  docType: DOC_TYPE.FV | DOC_TYPE.NE
  serie: string
  createAt: string
  customerName: string
  userName: string
  importeTotal: number
  abono: number
  saldo: number
  telefono?: string
  telefonoEstablecimiento?: string
  nombreComercial?: string
}


export interface DataFilter {
  tipo: number
  pageIndex: number
  pageSize: number
  startDate: any
  endDate: any
  customerCompanyId: number
  customerName: string
}

export const orderFilter: DataFilter = {
  tipo: 1,
  pageIndex: 1,
  pageSize: 25,
  startDate: formatDateTimeZone(dayjs()),
  endDate: formatDateTimeZone(dayjs()),
  customerCompanyId: 0,
  customerName: ""
}

export interface OrderState {
  orderLoading: boolean
  orderError: boolean
  dataFilter: DataFilter
  orders: Array<OrderReadDto>
}


export interface OrderActions {
  fetchOrders(): void
  setDataFilter<T extends keyof typeof orderFilter>(
    prop: T,
    value: typeof orderFilter[T]
  ): void;
}