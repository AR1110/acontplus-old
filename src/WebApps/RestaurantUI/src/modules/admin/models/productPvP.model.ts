
//Dtos 

export interface ProductPvPReadDto {
    readonly id: number;
}

export interface ProductPvPCreateDto {
    readonly idArticuloPvP?: number;
    idTarifa: number;
    precioVenta: number;
    precioConIva: number;
    porcentajeUtilidad: number;
    precioPredeterminado: boolean;
}