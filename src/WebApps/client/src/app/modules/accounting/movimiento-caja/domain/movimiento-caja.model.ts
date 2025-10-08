export interface MovimientoCaja {
  idTipoDocumento: number;
  codDoc: string;
  idMovimientoCaja: number;
  codEstab: string;
  fechaEmision: string;
  valor: number;
  observaciones: string;
  nroDoc: string;
  subEntidadFinanciera: string;
  empleado: string;
  caja: string;
  nroIdentificacion: string;

  nomEstado: string;
  nomSubEntidadFinanciera: string;
  nomEmpleado: string;
  nomCaja: string;
  nomUsuario: string;
}

export interface MovimientoCajaList extends MovimientoCaja {
  totalRecords: number;
  index: number;
}

export class ListMovimientoCajaResponse {
  data: MovimientoCajaList[] = [];
  totalRecords = 0;
}
