import { ProductFee, TarifaProducto } from './tarifa.model';

export interface Measure {
  idMedida: number;
  descripcion: string;
  estado: boolean;
  codigo: string;
}

export type MeasureRead = Measure & {
  totalRecords: number;
};

export interface PaginatedMeasureResponse {
  items: Measure[];
  totalRecords: number;
}

export enum MeasureType {
  FRACCIONADO = 'FRACCIONADO',
  PRINCIPAL = 'PRINCIPAL',
}
export interface MedidaProducto {
  idMedida: number;
  descripcion: string;
  conversion: number;
  defaultMedida: boolean;
  precioUnitario: number;
  precioCosto: number;
  precioCostoFraccionado: number;
  tipo: MeasureType;
  tarifas: TarifaProducto[];
  fees: ProductFee[];
}

// Alternativa a MeasureSelectHtmlOnly
export interface MeasureBasic extends Pick<Measure, 'idMedida' | 'descripcion'> {}
