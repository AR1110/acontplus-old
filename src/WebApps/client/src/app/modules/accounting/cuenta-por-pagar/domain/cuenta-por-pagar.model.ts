import { GroupedEstab } from '@core/models/estab.model';

export interface CuentaPorPagar {
  idCuentaPorPagar: number;
}

export interface CuentaPorPagarLista extends CuentaPorPagar {
  idDocumento: number;
  idTiempoCredito: number;
  idProveedor: number;
  codEstab: string;
  identificacionComprador: string;
  nombreComprador: string;
  nombreDoc: string;
  codDoc: string;
  serieComprobante: string;
  fechaEmision: string;
  fechaVencimiento: string;
  total: number;
  abono: number;
  saldo: number;
  diasCredito: number;
  nombreEstado: string;
  codigoEstado: string;
  numAutDocSustento: string;
  totalRecords: number;
}

export interface CuentaPorPagarCuotaConfig {
  idCuotaPorPagar: number;
  idCuentaPorPagar: number;
  fechaVencimiento: Date;
  nroCuota: number | string;
  cuota: number;
  abono: number;
  saldo: number;
  nombreEstado: string;
  codigoEstado: string;
}

export class FilterDataCuentaPorPagarResponse {
  estabs: GroupedEstab[] = [];
  estadosDoc: any[] = [];
  tiposDoc: any[] = [];
  categorias: any[] = [];
}
