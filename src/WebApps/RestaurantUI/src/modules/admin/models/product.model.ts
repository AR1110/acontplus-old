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


// =============================START INTERFACES FOR ARTICLE FORM DATA =================
 
interface CategoryApi { 
    idFamilia: number,
    idSubFamilia: number,
    familia: string,
    subFamilia: string,
    siglas: string,
    ultimoSecuencial: number
 
}
interface MeasureApi {
  idMedida: number, 
  codigo: string, 
  descripcion: string
}

interface SaleFeeApi  
{
  idTarifa: number, 
  descripcion: string, 
  codigo: string, 
  predeterminada: boolean
}
interface VatRateApi {
  idTipoIva: number, 
  descripcion: string
  codigo: string, 
  porcentaje: number
}
export interface DataFormApi {
  categories: CategoryApi[]
  measures: MeasureApi[]
  saleFees: SaleFeeApi[]
  vatRates: VatRateApi[]
}

// =============================END INTERFACES FOR ARTICLE FORM DATA =================
 


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


//==================================Context=================================== 

export interface ProductState {
  products: IProductView[]
  dataFormApi: DataFormApi
}