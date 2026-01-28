export interface TiempoCredito {
  idTiempoCredito: number;
  descripcion: string;
  diasCredito: string;
  numeroCuota: number;
  entrada?: boolean;
  estado: boolean;
  tipo?: boolean;
}

export interface CreditTimeList {
  index: number;
  idTiempoCredito: number;
  gestion: boolean;
  diasCredito: number;
  numeroCuota: number;
  descripcion: string;
  entrada: boolean;
  estado: boolean;
  tipo: boolean;
  nombreGestion: string;
  nombreEntrada: string;
  tipoCredito: string;
  totalRecords: number;
}

export class ListCreditTimeResponse {
  data: CreditTimeList[] = [];
  totalRecords = 0;
}
