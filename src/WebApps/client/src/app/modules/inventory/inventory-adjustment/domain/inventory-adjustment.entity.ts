import {GroupedEstab} from "@core/models/estab.model";
import {DOC_TYPE} from "@core/constants/global.constants";

export interface InventoryAdjustmentList {
  index: number;
  "id": number
  "fechaEmision": string
  "observacion": string
  "total": number
  "nroDoc": string
  "estadoNombre": string
  "codDoc": string
  "usuarioNombre": DOC_TYPE.AC
  "style": string
  "tipoDocNombre": string
  "totalRecords": number
}


export class InventoryAdjustmentListResponse {
  data: InventoryAdjustmentList[]=[];
  totalRecords = 0;
}

export class InventoryAdjustmentFormDataResponse {
  estabs: GroupedEstab[]=[];
  subFamilias:any[]=[];
  decimal: any ={};
  tiposDoc:any[]=[];
  tiposTransaccion:any[]=[];
}

export class InventoryAdjustmentDetailResponse {
  header:any = {};
  items: any[]=[]
}

export class InventoryAdjustmentListProductsResponse {
   data: any[]=[]
}
