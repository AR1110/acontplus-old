import { CATEGORY_CODE, ProductPVPReadDto } from "."
import { ITEM_TYPE_CODE } from "../constants"

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
    summary: string
    itemTypeCode: ITEM_TYPE_CODE.MENU | ITEM_TYPE_CODE.ITEM
}

export interface ItemReadDto {
    index: number,
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
    itemTypeCode: ITEM_TYPE_CODE.MENU | ITEM_TYPE_CODE.ITEM
    summary:string,
    uuid: string
}

export interface ItemSearch {
    tipo: number
    checkSubFamilia: boolean 
    idSubFamilia: number
    pageIndex: number,
    pageSize: number
    checkBySearch: boolean
    code: "" | CATEGORY_CODE.COM | CATEGORY_CODE.PROM
}

export const itemSearchInitialState: ItemSearch = {
    tipo: 2, 
    checkSubFamilia: false,
    idSubFamilia: 0, 
    pageIndex: 1, 
    pageSize: 25,
    checkBySearch: true,
    code: "",
}

