export interface RawProductPVPData {
    idArticuloPvP: number
    idTarifa: number
    precioVenta: number
    precioConIva: number
    porcentajeUtilidad: number
    precioPredeterminado: boolean
    tarifa: string
    porcentajeIva: number
} 

export interface ProductPVPReadDto {
    salePrice: number
    priceWithVat: number
}