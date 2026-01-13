export interface GeneralConfig {}

export class GeneralConfigResponse {
  configVenta: any = {};
  decimalAlmacen: any = {};
  decimalVenta: any = {};
  decimalCompra: any = {};
  formasPagoSri: any[] = [];
  configInventario: any = {};
  metodosValoracion: any[] = [];
  notificaciones: any[] = [];
}
