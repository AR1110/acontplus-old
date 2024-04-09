import { TarifaProducto } from "./tarifa.model"

export type Measure = {
    idMedida: number,
    descripcion: string
    estado: boolean,
    codigo: string
}

export type MeasureRead = Measure & {
    totalRecords: number
}

export interface MeasureSelectHtmlOnly extends Pick<Measure, 'idMedida' | 'descripcion'> { }


export interface MedidaProducto {
  idMedida: number;
  descripcion: string;
  conversion: number;
  defaultMedida: boolean;
  precioCosto: number
  precioCostoFraccionado: number
  tipo: "FRACCIONADO" | "PRINCIPAL"
  tarifas: Array<TarifaProducto>
}
