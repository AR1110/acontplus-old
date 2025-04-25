export interface OrderDocRed {
  codEstab: string;
  idCuentaPorCobrar: number;
  documentoId: number;
  orderId: number;
  docType: string;
  serie: string;
  serieComprobante: string;
  createAt: string;
  customerName: string;
  userName: string;
  tiempoCredito: true;
  importeTotal: number;
  abono: number;
  saldo: number;
  estado: string;
  codEstado: string;
}
