import { ProductPVPReadDto } from "."

 
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
    codigoPorcentaje: string,
    codigoArticulo: string,
    stock: number    
    s3ObjectKey: string
    s3ObjectUrl: string
}




export interface ProductSaleReadDto {
    productId: number,
    measureId: number,
    vatRatId: number, 
    taxRateCode: string   
    description: string,    
    takesInventory: boolean,        
    costPrice: number,
    priceWithoutSubsidy: number, 
    productCode: string,
    stock: number    
    s3ObjectKey: string
    s3ObjectUrl: string 
}
 
//Medida Api
export interface RawMeasure {
    idMedida: number
    medida: string
    tarifas: string
 }

 

 //Medida para el adapter
 export interface Measure{
    measureId: number
    description: string,
    pvps: Array<ProductPVPReadDto>
 }