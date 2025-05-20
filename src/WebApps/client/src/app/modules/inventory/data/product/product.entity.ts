

export interface ProductDataEntity {
  idSubFamilia: number;
  idMarca?: number;
  idModelo?: number;
  idTipoIce?: number;
  idTipoArticulo: number;
  idTipoIva: number;
  idMedida: number;
  precioCosto: number;
  precioSinSubsidio: number;
  codigo: string;
  codigoAuxiliar: string;
  valorIce: number;
  descripcion: string;
  llevaInventario: boolean;
  datosAdicionales: boolean;
  productoFraccionable: boolean;
  datosLote: boolean;
  lote?: string;
  fechaCreacion?: string;
  fechaCaducidadLote?: string;
  stockMinimo: number;
  stockMaximo: number;
  observaciones: string;
  caducidad: boolean;
  fechaCaducidad?: string;
  codigoBarra: string;
  idEtiqueta?: number;
  cantMinimaVentaPorMayor: number;
}

export interface ProductDataPvpEntity {
  index ?: number
  idArticuloPvP        : number
  idTarifa             : number
  precioVenta          : number
  precioConIva         : number
  porcentajeUtilidad   : number
  precioPredeterminado : boolean
}

export interface ProductParamsSaveEntity  {
  jsonArticulo: string
  jsonPvp    : string
  idBodega     : number
  ubicacion   : string
}


