export interface RawProductPVPData { 
    idTarifa: number,
    precioVenta: number,
    precioConIva: number,
    tarifa: string, 
    precioPredeterminado: boolean
} 

export interface ProductPVPReadDto {
    feeId: number
    salePrice: number
    priceWithVat: number
    description: string,
    default: boolean
}


export interface ProductPVPSearch {
    tarifa: string
    precio: number
}