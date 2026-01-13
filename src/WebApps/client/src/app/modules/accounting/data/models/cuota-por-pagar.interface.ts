export interface CuotaPorPagar {
  idCuentaPorPagar: number;
  idCuotaPorPagar: number;
  fechaVencimiento: string;
  nroCuota: number | string;
  cuota: number;
  abono: number;
  saldo: number;
}

export interface CuotaPorPagarLista extends CuotaPorPagar {
  nombreEstado: string;
  codigoEstado: string;
  esCuotaAbonado?: boolean;
  saldoInicial: number;
}
