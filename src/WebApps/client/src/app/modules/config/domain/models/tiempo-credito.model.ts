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

}

export class ListCreditTimeResponse {
  data: CreditTimeList[]=[]
  totalRecords: number=0;
}
