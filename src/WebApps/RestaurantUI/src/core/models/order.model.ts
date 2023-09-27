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
  userName: string
  totalRecords: number
  divided: boolean
}

export interface OrderReadDto {
  orderId: number;
  documentoId: number;
  establecimientoId: number;
  codEstab: string
  puntoEmisionId: number;
  nameFiscal: string
  userName: string
  serie: string;
  total: number;
  codDoc?: "" | DOC_TYPE.FV | DOC_TYPE.NE;
  createdAt: string;
  totalRecords: number
  divided: boolean
}



export interface OrderFilter {
  tipo: number
  pageIndex: number
  pageSize: number
  startDate: any
  endDate: any
  customerCompanyId: number
}
 
export const orderFilter: OrderFilter = {
  tipo: 1,
  pageIndex: 1,
  pageSize: 25,
  startDate: formatDateTimeZone(dayjs()),
  endDate: formatDateTimeZone(dayjs()),
  customerCompanyId: 0
}