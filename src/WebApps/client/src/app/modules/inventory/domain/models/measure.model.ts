import { TarifaProducto } from "./tarifa.model"

export interface Measure {
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
  precioUnitario: number
  precioCosto: number
  precioCostoFraccionado: number
  tipo: "FRACCIONADO" | "PRINCIPAL"
  tarifas: TarifaProducto[]
}
