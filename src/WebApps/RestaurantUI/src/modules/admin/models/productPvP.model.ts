
//Dtos 

export interface ProductPvPReadDto {
    readonly id: number;
}

export interface ProductPvPCreateDto {
    readonly idArticuloPvP?: number; 
    tarifa: string
    tipoIva?: string
    porcentajeIva: number
    precioVenta: number
    precioConIva: number
    porcentajeUtilidad: number,
    utilidad: number,
    estado: string,
}