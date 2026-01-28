import { CuentaPorPagar } from './cuenta-por-pagar.model';

import { CuentaPorPagarLista } from '@accounting/data/models/cuenta-por-pagar.model';
import { CuotaPorPagarLista } from '@accounting/data/models/cuota-por-pagar.interface';
import { PaymentTypeCode } from '@accounting/shared/enums/accounting.constants';
import { roundNumber } from '@core/utils/round-number.utils';
import { DECIMALS } from '@core/constants/global.constants';
import { GroupedEstab } from '@core/models/estab.model';

interface ComprobanteEgreso {
  idComprobanteEgreso: number;
  fechaEmision: string;
  serieComprobante: string;
  total: number;
  nombreEstado: string;
  estado: boolean;
  codEstab: string;
}

export interface ComprobanteEgresoList {
  index: number;
  idComprobanteEgreso: number;
  total: number;
  codEstab: string;
  fechaRegistro: string;
  nroDoc: string;
  nomPersona: string;
  nroIdentificacion: string;
  nomCaja: string;
  color: string;
  nomEstado: string;
  nomUsuario: string;
  totalRecords: number;
  estado: boolean;
}
export interface ComprobanteEgresoResponse {
  data: ComprobanteEgresoList[];
  totalRecords: number;
}

export interface ComprobanteEgresoFilterResponse {
  estabs: GroupedEstab[];
  users: any[];
  bancos: any[];
  tiposDoc: any[];
  subEntidadesFinanciera: any[];
}

export interface ComprobanteEgresoDeleteResponse {
  cuentas: any[];
  cuotas: any[];
  estadosPago: any[];
}

export interface ComprobanteEgresoDeleteParams {
  id: number;
  data: unknown;
}

export interface ComprobanteEgresoLista extends ComprobanteEgreso {
  index: number;
}

export interface CuentaPorPagarCuota extends CuentaPorPagarLista {
  cuotas: CuotaPorPagarLista[];
  cuotasCopy: CuotaPorPagarLista[];
}

export interface CuentaPorPagarHistorial extends Pick<CuentaPorPagar, 'idCuentaPorPagar'> {
  secuencial: number;
  // valorSaldoLectura: this.group.valorSaldoLectura,

  abono: number;
  saldo: number;

  // diasMora: this.group.diasMora,
  // mora: this.group.mora,
}

export interface FormaPago {
  uuid: string;
  codigoEntidadFinanciera: PaymentTypeCode | null;
  fechaEmision: Date;
  idEntidadFinanciera: number;
  idSubEntidadFinanciera: number;
  idCiudad?: number;
  idCuentaPorPagar?: number;
  nro?: string;
  referencia?: string;
  aprobacion?: string;
  posfechado: boolean;
  idBanco?: number;
  lote?: string;
  nombreBanco?: string;
  nombreFormaPago?: string;
  nombrePosfechado?: string;
  nombreCiudad?: string;
  valorAbonoInput: number;
  abono: number;
  secuencial: number;
  controlCaja?: boolean;
}

export interface CuentaPorPagarEstado {
  idCuentaPorPagar: number;
  idEstadoPago: number;
  abono: number;
}

export interface CuotaPorPagarEstado {
  idEstadoPago: number;
  abono: number;
  idCuotaPorPagar: number;
}
