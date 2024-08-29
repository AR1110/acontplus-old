 
export interface Tarifa {
    idTarifa: number;
    precioVenta: number;
    precioConIva: number;
    descripcion: string;
    default: boolean;
}

export interface TarifaProducto {
    idTarifa: number;
    precioVenta: number;
    precioConIva: number;
    descripcion: string;
    default: boolean;
}
