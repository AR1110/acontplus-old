import { ProductPVPReadDto } from "."

export interface RawItemData {
    id: number //idItem 
    userId: number
    productId: number
    descripcion: string
    s3ObjectUrl: string
    stockMinimo: number
    stock: number
    codigo: string
    codigoAuxiliar: string
    tipoIva: string
    tipoArticulo: string            
    totalRecords: number    
    pvp: string
}

export interface ItemReadDto {
    itemId: number //idItem 
    menuId: number // para listar combos 
    userId: number
    productId: number
    description: string
    s3ObjectUrl: string
    minStock: number
    stock: number
    code: string
    auxiliaryCode: string
    vatRate: string
    itemType: string            
    totalRecords: number
    pvps: ProductPVPReadDto
    taxRateCode?:string
}

export interface ItemSearch {
    tipo: number
    checkSubFamilia: boolean 
    idSubFamilia: number
    pageIndex: number,
    pageSize: number
    checkBySearch: boolean
    code: string
}

export const itemSearchInitialState: ItemSearch = {
    tipo: 1, 
    checkSubFamilia: false,
    idSubFamilia: 0, 
    pageIndex: 1, 
    pageSize: 25,
    checkBySearch: true,
    code: "",
}

