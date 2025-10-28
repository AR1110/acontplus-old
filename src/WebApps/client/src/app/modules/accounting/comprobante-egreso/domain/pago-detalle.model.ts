export interface PagoDetalleComprobanteEgreso {
  idPago: number;
  nroCuota: number;
  fechaVencimiento: string;
  cuota: number;
  abono: number;
  saldo: number;
}

export interface PagoDetalle {
  idCuentaPorPagar: number;
  idCuotaPorPagar: number;
  abono: number;
  cuota: number;
  saldo: number;
  secuencial: number;
  saldoMovimiento: number;
  esPosfechado: boolean;
}
