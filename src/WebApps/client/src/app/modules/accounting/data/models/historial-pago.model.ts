export interface HistorialPagoLista {
  idComprobanteEgreso: number;
  idPago: number;
  nombrePosfechado: string;
  fechaEmision: string;
  nombreFormaPago: string;
  nombreBanco?: string;
  valor: number;
  abono: number;
  vuelto: number;
  codigoFormaPago: string;
  nro?: string;
  referencia?: string;
  lote?: string;
  aprobacion?: string;
}
