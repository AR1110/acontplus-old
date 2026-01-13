export interface CashboxList {
  idCaja: number;
  descripcion: string;
  estado: boolean;
  actividad: string;
  usuario: string;
  turno: string;
  idTurno: number;
  idUsuario: number;
  totalRecords: number;
}

export interface ControlCaja {
  id: number;
  fechaApertura: string;
  fechaCierre: string | null;
  faltante: number;
  sobrante: number;
  totalArqueo: number;
  estado: boolean;
  totalRecords: number;
}

export interface CashboxSelectHtmlOnly extends Pick<CashboxList, 'idCaja' | 'descripcion'> {}

export class ListCajaResponse {
  data: CashboxList[] = [];
  totalRecords = 0;
}

export class FormDataCajaResponse {
  usuarios: any[] = [];
  turnos: any[] = [];
}

export class GetIdCajaResponse {
  caja: any = {};
  asignaciones: any[] = [];
}
