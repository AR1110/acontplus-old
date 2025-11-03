import { GroupedEstab } from '@core/models/estab.model';

export interface WarehouseTransferDataFormResult {
  establishments: GroupedEstab[];
  transactionTypes: { id: number; code: string; name: string }[];
  documentTypes: { id: number; code: string; name: string }[];
  categories: { id: number; code: string; name: string }[];
}
