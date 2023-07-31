import { ProductPvPCreateDto, VatRateReadDto } from '.';
import { MeasureReadDto } from './measure.model';
import { SaleFeeReadDto } from './saleFee.model';

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

//Dtos (Request and response)
export interface ProductReadDto {
  readonly idProduct: number;
  code: string;
  description: string;
  typeArticle: string;
  category: string;
  stock: number;
}

export interface ProductCreateDto {
  idArticulo: number;
  idSubFamilia: number;
  idMarca?: number;
  idModelo?: number;
  idTipoIce?: number;
  idTipoArticulo?: number;
  idTipoIva: number;
  idMedida: number;
  precioCosto: number;
  precioSinSubsidio: number;
  codigo: string;
  codigoAuxiliar: string;
  valorIce: number;
  descripcion: string;
  llevaInventario: boolean;
  datosAdicionales?: boolean;
  productoFraccionable?: boolean;
  datosLote?: boolean;
  lote?: string;
  fechaCreacion?: string;
  fechaCaducidadLote?: string;
  stockMinimo?: number;
  stockMaximo?: number;
  observaciones?: string;
  caducidad?: boolean;
  fechaCaducidad?: string;
  codigoBarra: string;
  idEtiqueta: number;
  cantMinimaVentaPorMayor: number;
}


// // =============================START INTERFACES FOR ARTICLE FORM DATA =================

interface CategoryApi {
  idFamilia: number;
  idSubFamilia: number;
  familia: string;
  subFamilia: string;
  siglas: string;
  ultimoSecuencial: number;
}

interface DecimalInventario {
  nroPrecio: number;
}
export interface ProductDataFormApi {
  decimalInventory: DecimalInventario;
  categories: CategoryApi[];
  measures: MeasureReadDto[];
  saleFees: SaleFeeReadDto[];
  vatRates: VatRateReadDto[];
}

export interface DialogProps {
  dialogTitle: string;
}
export interface ProductState {
  products: ProductReadDto[];
  dataFormApi: ProductDataFormApi;
  data: ProductCreateDto;
  productPvPs: ProductPvPCreateDto[];
  dialogProps: DialogProps;
}
