import { TAX_RATE_CODE } from '@core/constants/global.constants';

import { TarifaProductSearch } from './tarifa.model';
import { GroupedEstab } from '@core/models/estab.model';
import { GroupedSubFamilia } from '@inventory/domain/models/sub-category.model';
import { MedidaProducto } from '@inventory/domain/models/measure.model';

export interface ProductList {
  position: number;
  idArticulo: number;
  idMedida: number;
  code_unique: string;
  codigo: string;
  descripcion: string;
  precioCosto: number;
  estado: boolean;
  stock: number;
  observaciones: string;
  subFamilia: string;
  medida: string;
  marca: string;
  modelo: string;
  tipoIva: string;
  tipoArticulo: string;
  style: string;
  precioSinSubsidio: number;
  stockMinimo: number;
  totalRecords: number;
  s3ObjectKey: string;
  s3ObjectUrl: string;
}

export interface Product {
  descripcion: string;
}

export interface ProductSearch {
  position?: number;
  idArticulo: number;
  codigo: string;
  descripcion: string;
  iva: string;
  stock: number;
  subFamilia: string;
  marca: string;
  medida: string;
  fraccionado: boolean;
  style: string;
  tarifas: TarifaProductSearch[];
  warehouses: any;
  precioSinSubsidio: number;
  imagen?: string;
  s3ObjectUrl: string;
  s3ObjectKey: string;
  totalRecords: number;
}

export interface ProductSale {
  idArticulo: number;
  idMedida: number;
  idTipoIva: number;
  descripcion: string;
  llevaInventario: true;
  precioCosto: number;
  precioSinSubsidio: number;
  tarifaImpuesto: string;
  tarifa: number;
  codigoPorcentaje:
    | TAX_RATE_CODE.DIFFERENTIATED_TAX
    | TAX_RATE_CODE.FOURTEEN_PERCENT
    | TAX_RATE_CODE.NOT_SUBJECT_TO_TAX
    | TAX_RATE_CODE.TAX_EXEMPT
    | TAX_RATE_CODE.TWELVE_PERCENT
    | TAX_RATE_CODE.ZERO_PERCENT;
  codigoArticulo: string;
  stock: string;
  s3ObjectKey: string;
  s3ObjectUrl: string;
}

export class ProductDataForm {
  categorias: any[] = [];
  decimal: Record<string, any> = {};
  estabs: GroupedEstab[] = [];
  etiquetas: any[] = [];
  marcas: any[] = [];
  medidas: any[] = [];
  modelos: any[] = [];
  subCategorias: any[] = [];
  subCategoriasGroup: GroupedSubFamilia[] = [];
  tarifas: any[] = [];
  tiposArticulo: any[] = [];
  tiposIce: any[] = [];
  tiposIva: any[] = [];

  constructor() {
    /* empty */
  }
}

export class ProductGetIdResult {
  data = {} as any;
  productPvps: any[] = [];
  productBarcodes: any[] = [];
  productLocations: any[] = [];
  productMeasures: any[] = [];
}

export class GetProductPurchaseResult {
  data = {} as any;
  measures: MedidaProducto[] = [];
  tags = [] as any[];
}

export interface ValidateProductStockParams {
  idArticulo: number;
  cantidad: number;
  idBodega: number;
  idMedida: number;
}

export interface GetProductEstabStockResult {
  establishments: any[];
}
