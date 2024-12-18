import { ITEM_TYPE_CODE } from "@domain/enums/main.enum"

export interface ItemPvp {
  feeId: number,
  precioVenta: number,
  precioConIva: number,
  descripcion: string,
  default: boolean
}

export interface ItemRead {
    uniqueItem: string
    id: number
    menuId: number
    summary?: string
    productId: number
    descripcion: string
    img?: string
    stock: number,
    codigo: string
    medida: string
    tipoIva: string
    cost: string
    dataPvp: ItemPvp
    totalRecords: number
    itemTypeCode: ITEM_TYPE_CODE.MENU | ITEM_TYPE_CODE.ITEM
    idMedida: number
}
