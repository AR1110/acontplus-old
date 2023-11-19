import { ProductPVPReadDto, ProductPVPSearch } from "."


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
    tarifaImpuesto: string
}





export interface ProductSaleReadDto {
    productId: number,
    measureId: number,
    vatRatId: number,
    taxRateCode: string
    description: string,
    carryInventory: boolean,
    costPrice: number,
    priceWithoutSubsidy: number,
    productCode: string,
    stock: number
    s3ObjectKey: string
    s3ObjectUrl: string
    tarifaImpuesto: string
}

//Product Search
export interface RawProductSearchData {
    idArticulo: number
    codigo: string
    descripcion: string
    iva: string,
    stock: number,
    stockMinimo: number
    subFamilia: string
    marca: string
    medida: string
    fraccionado: boolean
    style: string
    priceSale: string
    //warehouses,
    precioSinSubsidio: 0,
    s3ObjectUrl: string
    s3ObjectKey: string
}

export interface ProductSearchDto  {
    productId: number
    code: string
    description: string
    iva: string
    pvps: Array<ProductPVPSearch>
    s3ObjectUrl: string
    s3ObjectKey: string
}

//Medida Api
export interface RawMeasure {
    idMedida: number
    medida: string
    conversion: number
    descripcion: string
    defaultMedida: boolean
    tarifas: string
}



//Medida para el adapter
export interface Measure {
    measureId: number
    description: string,
    conversion: number 
    defaultMedida: boolean
    pvps: Array<ProductPVPReadDto>
}