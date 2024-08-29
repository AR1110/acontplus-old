import { Tarifa, TarifaProducto } from "./tarifa.model"

 

export interface MedidaApiResponse {
    idMedida: number
    descripcion: string
    tarifas: string
    orden: number
    conversion: number
}



export interface Medida {
    idMedida: number;
    descripcion: string;
    conversion: number;
    defaultMedida: boolean;
    tipo: "FRACCIONADO" | "PRINCIPAL"
    pvps: Array<Tarifa>
}

export interface MedidaProducto {
    idMedida: number;
    descripcion: string;
    conversion: number;
    defaultMedida: boolean;
    precioCosto: number
    precioCostoFraccionado: number
    tipo: "FRACCIONADO" | "PRINCIPAL"
    pvps: Array<TarifaProducto>
}


export interface ConsolidacionFecha {
    idArticulo: number
    idBodega: number
    fechaConsolidacion: Date
}
