export interface ListControlCaja {
  id: number;
  fechaApertura: string;
  fechaCierre: string | null;
  faltante: number;
  sobrante: number;
  totalArqueo: number;
  estado: boolean;
  receptor: string;
  totalRecords: number;
  statusName: string;
}

export class ListControlCajaResponse {
  data: ListControlCaja[] = [];
  totalRecords = 0;
}

export class FilterDataControlCajaResponse {
  estados: any[] = [];
}

export class FormDataControlCajaResponse {
  formaPagos: any[] = [];
  tipoDocumento: any[] = [];
}

export class ArqueoControlCajaResponse {
  data: any[] = [];
}
