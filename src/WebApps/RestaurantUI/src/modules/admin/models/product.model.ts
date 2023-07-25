//API
export interface ProductoApi {
  readonly idArticulo: number;
  idSubFamilia: number;
  idTipoIce: number;
  idTipoArticulo: number;
  idModelo: number;
  codigo: string;
  codigoAuxiliar: string;
  descripcion: string;
  valorIce: number;
  llevaInventario: boolean;
  datosAdicionales: boolean;
  datosLote: boolean;
  lote: string;
  fechaCreacion: string;
  fechaCaducidadLote: string;
  productoFraccionable: boolean;
  stockMinimo: number;
  stockMaximo: number;
  observaciones: string;
  caducidad: boolean;
  fechaCaducidad: string;
  fechaRegistro: string;
  estado: boolean;
  idUsuario: number;
  idEntidad: number;
  idMarca: number;
  idTipoIva: number;
  precioCosto: number;
  idMedida: number;
  idFamilia: number;
  fechaBaja: string;
  codigoBarra: string;
  stock: number;
  imagen: string;
  importacion: boolean;
  code_unique: string;
  idEtiqueta: number;
  precioSinSubsidio: number;
  cantMinimaVentaPorMayor: number;
}

export type ProductResponseFromApi = Array<{
  code_unique: string;
  codigo: string;
  descripcion: string;
  estado: boolean;
  idArticulo: number;
  idMedida: number;
  imagen: boolean;
  marca: string;
  medida: string;
  modelo: string;
  observaciones: string;
  precioCosto: number;
  precioSinSubsidio: number;
  stock: number;
  stockMinimo: number;
  style: string;
  subFamilia: string;
  tipoArticulo: string;
  tipoIva: string;
  totalRecords: number;
}>;

//Front End
export interface IProduct {
  code_unique: string;
  codigo: string;
  description: string;
  estado: boolean;
  idArticulo: number;
  idMedida: number;
  imagen: boolean;
  marca: string;
  medida: string;
  modelo: string;
  observation: string;
  precioCosto: number;
  precioSinSubsidio: number;
  stock: number;
  stockMinimo: number;
  style: string;
  subFamilia: string;
  tipoArticulo: string;
  tipoIva: string;
  totalRecords: number;
}

export interface IProductView {
  readonly idProduct: number;
  code: string;
  description: string;
  typeArticle: string;
  category: string;
  stock: number
}
