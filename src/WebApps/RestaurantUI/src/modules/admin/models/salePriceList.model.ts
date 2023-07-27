

export interface SalePriceList{
    id: number
    tarifa: string
    tipoIva?: string
    precioVenta: number
    precioConIva: number
    porcentajeUtilidad: number,
    utilidad: number,
    estado: string,
}