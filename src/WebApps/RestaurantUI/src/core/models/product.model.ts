//Product
export interface RawProductSaleData {
    idArticulo: number,
    idMedida: number,
    idTipoIva: number,    
    descripcion: string,    
    llevaInventario: boolean,        
    precioCosto: number,
    precioSinSubsidio: number,    
    tarifa: number,
    codigoPorcentaje: number,
    codigoArticulo: number,
    stock: number    
}

export interface ProductSaleReadDto {
    productId: number,
    measureId: number,
    vatRatId: number,    
    description: string,    
    takesInventory: boolean,        
    costPrice: number,
    priceWithoutSubsidy: number, 
    productCode: number,
    stock: number    
}

//Tarifa Api
export interface RawRateData {
    idTarifa: number,
    precioVenta: number,
    precioConIva: number,
    tarifa: string, 
}

//Medida Api
export interface RawMeasure {
    idMedida: number
    descripcion: string
    tarifas: string
 }

 //Tarifa para el adapter
 export interface Rate {
    rateId: number
    salePrice: number
    priceWithVat: number
    description: string
 }

 //Medida para el adapter
 export interface Measure{
    measureId: number
    description: string,
    rates: Array<Rate>
 }