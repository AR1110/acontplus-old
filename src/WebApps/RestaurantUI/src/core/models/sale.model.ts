import { CategoryReadDto, CustomerReadDto, DecimalSale, Floor, ProductPVPReadDto, Room, TableReadDto, Tax, TaxRate, WarehouseAsign } from ".";
import { DOC_TYPE, ITEM_TYPE_CODE } from "../constants";
import { EmissionPointAsign } from "./emission-point.model";

export interface Order {
    orderId: number
    establecimientoId: number
    puntoEmisionId : number
    customerCompanyId : number
    customerName: string
    bodegaId: number
    tableId: number
    subTotalSinImpuestos: number
    tax: number;
    taxPercent: number
    taxAmount: number;
    discount: number
    total: number // With discount on items 
    tip: number //Propina    
    obs: string
    codDoc: string
    quickSale: boolean
    createdAt: Date
    //Opcionales - se usa cuando se actualiza el orden 
    saveDoc?: boolean
    updateOrder?: boolean
    uuid?: string
    table?: any
    
}

//Impuesto Articulos 
export interface ItemTaxes {
    uuid: string
    taxId: number
    taxPercentId: number
    taxBase: number
    taxValue: number
}

export interface ItemBase {
    id: number
    orderId: number
    index: number
    productId: number
    code: string    
    itemId: number
    feeId: number
    taxId: number
    taxPercentId: number
    taxValue: number
    description: string
    summary: string
    quantity: number
    remainingQuantity?: number
    cost: number
    price: number
    priceWithVat: number
    discount: number
    discountTotal: number
    total: number
    bodegaId: number
}

export interface ItemRead extends ItemBase {
    uuid: string
    s3ObjectUrl: string;    
    carryInventory: boolean
    taxes: Array<ItemTaxes>
    pvps: Array<ProductPVPReadDto>
    obs?: string
    taxRateCode?: string
    itemTypeCode: ITEM_TYPE_CODE.ITEM | ITEM_TYPE_CODE.MENU
    menuId?: number
    envioSri: boolean
    paid: boolean
}


//Start To Api 
export interface ItemPostDto {
    readonly orderItemId: number
    readonly orderId?: number
    uuid: string
    itemId: number
    taxId: number
    taxPercentId: number
    productId: number
    taxValue: number
    quantity: number
    remainingQuantity?: number
    description: string
    cost: number
    price: number
    discount: number
    total: number
    itemTypeCode: ITEM_TYPE_CODE.ITEM | ITEM_TYPE_CODE.MENU
    menuId?: number
    bodegaId: number
    envioSri: boolean
}
export interface SummaryPostDto {
    orderId: number
    establecimientoId: number
    puntoEmisionId: number
    bodegaId: number
    customerCompanyId: number
    tableId: number
    subtotalSinImpuestos: number
    tax: number;
    taxPercent: number
    //taxAmount: number;
    total: number // With discount on items
   // netTotal: number // Net - (tax + discount on total)
    discount: number
    items: any
    taxes: any
    payments: any
    tip: number
    obs: string
    codDoc: string
    quickSale: boolean
    fechaEmision: Date,   
    uuid?: string 
}


// End To Api


export interface DataFormSale {
    categories: Array<CategoryReadDto>
    tables: Array<TableReadDto>
    decimal: DecimalSale
    taxes: Array<Tax>
    taxRates: Array<TaxRate>
    warehouses: Array<WarehouseAsign>
    emissionPoints: Array<EmissionPointAsign> 
    rooms: Array<Room>
    floors: Array<Floor>
    customer: CustomerReadDto
    tarifaImpuestoVigente: TaxRate
} 


export const dataFormInitialState: DataFormSale = {
    categories: [],
    tables: [],
    decimal: {
        nroPrecio: 0,
        nroCantidad: 0,
        nroIva: 0,
        nroDescuentoDetalle: 0,
        nroTotalDetalle: 0,
        nroTotalSubTotal: 0,
        nroDescuento: 0,
        importeTotal: 0,
        nroIce: 0
    },
    taxes: [],
    taxRates: [],
    warehouses: [],
    emissionPoints: [], 
    rooms: [],
    floors: [],
    customer: {
        customerCompanyId: 0,
        fiscalName: "",
        tradeName: "",
        identificationNumber: "",
        correo: "",
        telefono: "",
        direccion: ""
    },
    tarifaImpuestoVigente: {
        taxRateId: 0,
        taxCode: "",
        taxRateCode: "",
        description: "",
        percentage: 0
    }
}

export const orderInitialState: Order = {
    orderId: 0,
    establecimientoId: 0,
    puntoEmisionId: 0,
    customerCompanyId: 0,
    customerName: "",
    bodegaId: 0,
    tableId: 0,
    subTotalSinImpuestos: 0,
    tax: 0,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    total: 0, 
    tip: 0,
    obs: "",
    codDoc: DOC_TYPE.OR, //Type doc default Orden 
    quickSale: true,
    createdAt: new Date(), 
    saveDoc: false,
    updateOrder: false,
    table: {}
}