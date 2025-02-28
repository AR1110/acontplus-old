export interface NotaEntregaComprobanteEntity {
  idCliente: number;
  idTiempoCredito: number;
  idPuntoEmision: number;
  idUsuario: number;
  idTipoIdentificacion: number;
  fechaEmision: string;
  fechaVencimiento: string;
  subTotalSinImpuestos: number;
  totalDescuento: number;
  porcentajeDescuento: number;
  propina: number;
  recargo: number;
  transporte: number;
  total: number;
  observacion: string | null;
  identificacionComprador: string | null;
  razonSocialComprador: string | null;
  direccionComprador: string | null;
  email: string | null;
  telefono: string | null;
  supportId?: number;
  uniqueId?: number;
}

export interface NotaEntregaDetailEntity {
  orderIndex: number;
  idArticulo: number;
  idTarifa: number;
  idBodega: number;
  idMedida: number;
  idTipoIva?: number;
  ice?: number;
  cantidad: number;
  precioCosto: number;
  precioUnitario: number;
  valorDescuento: number;
  precioTotalSinImpuesto: number;
  codigoPorcentaje?: string;
  tarifa: number;
  porcentajeDescuento: number;
  valorImpuesto: number;
  nota: string | undefined | null;
  descripcion: string;
  llevaInventario: boolean;
  cantidadTransaccion: number;
  conversion: number;
  precioCostoFraccionado: number;
}
