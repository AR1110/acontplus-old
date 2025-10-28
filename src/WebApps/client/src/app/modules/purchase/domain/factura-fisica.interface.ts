export interface FacturaFisicaLista {
  id: number;
  fechaEmision: string;
  fechaVencimiento: string;
  serieComprobante: string;
  identificacionComprador: string;
  nombreComprador: string;
  total: number;
  abono: number;
  saldo: number;
  nombreEstado: string;
  nombreUsuario: string;
  style: string;
  totalRecords: number;
}
