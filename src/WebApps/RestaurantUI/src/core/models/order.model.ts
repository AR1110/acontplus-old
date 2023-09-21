import dayjs from "dayjs"; 
import { formatDateTimeZone } from "../utilities";

export interface RawOrderData {
  id: number;
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
  codDoc?: string;
  nameFiscal: string
  userName: string
  totalRecords: number
}

export interface OrderReadDto {
  orderId: number;
  documentoId: number;
  establecimientoId: number;
  puntoEmisionId: number;
  nameFiscal: string
  userName: string
  serie: string;
  total: number;
  codDoc?: string;
  createdAt: string;
  totalRecords: number
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