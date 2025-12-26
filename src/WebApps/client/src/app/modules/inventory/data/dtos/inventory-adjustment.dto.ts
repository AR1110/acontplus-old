import { GroupedEstab } from '@core/models/estab.model';

export interface InventoryAdjustmentListDto {
  index: number;
  id: number;
  fechaEmision: string;
  observacion: string;
  total: number;
  nroDoc: string;
  estadoNombre: string;
  codDoc: string;
  usuarioNombre: string;
  style: string;
  tipoDocNombre: string;
  totalRecords: number;
}

export class InventoryAdjustmentListResultDto {
  data: InventoryAdjustmentListDto[] = [];
  totalRecords = 0;
}

export class InventoryAdjustmentFormDataDto {
  estabs: GroupedEstab[] = [];
  subFamilias: any[] = [];
  decimal: any = {};
  tiposDoc: any[] = [];
  tiposTransaccion: any[] = [];
}

export class InventoryAdjustmentDetailDto {
  header: any = {};
  items: any[] = [];
}

export class InventoryAdjustmentListProductsDto {
  data: any[] = [];
}
