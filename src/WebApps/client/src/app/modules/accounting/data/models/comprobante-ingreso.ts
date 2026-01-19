import {
  CuentaPorCobrar,
  CuentaPorCobrarComprobante,
} from './cuenta-por-cobrar.model';
import { PaymentType } from '../../shared/models/payment-type.model';

export interface PaymentData {
  idEntidadFinanciera: number;
  idSubEntidadFinanciera: number;
  fechaEmision: Date | string;
  valorAbono: number;
  controlCaja: boolean;
  paymentTypeCode: string;
  paymentTypeName?: string;
  paymentSubTypeName?: string;
  nro?: string;
  referencia?: string | null;
  aprobacion?: string | null;
  lote?: string | null;
  idCiudad?: number | null;
  idBanco?: number | null;
  posFechado: boolean;
  ciudad: string;
  banco: string;
  idTipoDocumento?: number;
  idComprobante?: number;
  tipoDocumento?: string;
  infoCobro?: string | null;
  abonoCuota: number;
  secuencial: number;
}

export interface PaymentDataForm {
  paymentTypes: PaymentType[];
  cuentasPorCobrar: CuentaPorCobrar[];
  bancos: any[];
  ciudades: any[];
  comprobante: CuentaPorCobrarComprobante;
}

export interface PaymentSubTotal {
  importeTotal: number;
  totalAbonoAnterior: number;
  totalSaldo: number;
  totalSaldoDoc: number;
  cambio: number;
  totalValorAbono: number;
  receivedAmount: number;
}

/**
 * Datos cobro
 */
export interface MultiplesPaymentType extends PaymentData {
  idCuentaBancaria: number | null;
  paymentSubTypeName: string;
  infoCobro?: string;
}

export interface PaymentDetail {
  idCuentaPorCobrar: number;
  idCuotaPorCobrar: number;
  abono: number;
  interes: number;
  diasMora: number;
  mora: number;
  cuota: number;
  saldo: number;
  secuencial: number;
  saldoOriginal: number;
}

export interface PaymentHistory {
  idCuentaPorCobrar: number;
  abono: number;
  diasMora: number;
  mora: number;
  saldo: number;
  secuencial: number;
}

export const paymentDataInitialState: PaymentData = {
  idEntidadFinanciera: 0,
  idSubEntidadFinanciera: 0,
  fechaEmision: new Date(),
  paymentTypeCode: '',
  paymentSubTypeName: '',
  paymentTypeName: '',
  nro: '',
  referencia: '',
  aprobacion: '',
  lote: '',
  idCiudad: 0,
  idBanco: 0,
  posFechado: false,
  ciudad: '',
  banco: '',
  valorAbono: 0,
  controlCaja: false,
  abonoCuota: 0,
  secuencial: 0,
};

export const paymentDataFormInitialState: PaymentDataForm = {
  paymentTypes: [],
  cuentasPorCobrar: [],
  bancos: [],
  ciudades: [],
  comprobante: {
    codEstab: '',
    idCliente: 0,
    identificacionComprador: '',
    razonSocialComprador: '',
    serieComprobante: '',
    importeTotal: 0,
    saldo: 0,
    abono: 0,
    fechaEmision: '',
  },
};

export const paymentSubTotalInitialState: PaymentSubTotal = {
  importeTotal: 0,
  totalAbonoAnterior: 0,
  totalSaldo: 0,
  totalSaldoDoc: 0,
  cambio: 0,
  totalValorAbono: 0,
  receivedAmount: 0,
};
