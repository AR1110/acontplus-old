import { CategoryReadDto, DecimalSale, PaymentSubType, PaymentType, TableReadDto, Tax, TaxRate, WarehouseAsign } from ".";
import { EmissionPointAsign } from "./emission-point.model";

export interface Summary {
    establecimientoId: number
    puntoEmisionId : number
    customerCompanyId : number
    bodegaId: number
    tableId: number
    subTotalSinImpuestos: number
    tax: number;
    taxPercent: number
    taxAmount: number;
    discount: number
    total: number // With discount on items
    netTotal: number // Net - (tax + discount on total)
    tip: number //Propina    
    obs: string
    codDoc: string
    quickSale: boolean
    creationDate: Date
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
    index: number
    productId: number
    code: string    
    itemId: number
    feeId: number
    taxId: number
    taxPercentId: number
    taxValue: number
    description: string
    quantity: number
    cost: number
    price: number
    discount: number
    discountTotal: number
    total: number
}

export interface ItemRead extends ItemBase {
    uuid: string
    s3ObjectUrl: string;    
    takesInventory: boolean
    taxes: Array<ItemTaxes>
}


//Start To Api 
export interface ItemPostDto {
    uuid: string
    itemId: number
    taxId: number
    taxPercentId: number
    taxValue: number
    quantity: number
    cost: number
    price: number
    discount: number
    total: number
}
export interface SummaryPostDto {

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
    fechaEmision: Date
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
}

export const summaryInitialState: Summary = {
    establecimientoId: 0,
    puntoEmisionId: 0,
    customerCompanyId: 0,
    bodegaId: 0,
    tableId: 0,
    subTotalSinImpuestos: 0,
    tax: 0,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    netTotal: 0,
    tip: 0,
    obs: "",
    codDoc: "NE",
    quickSale: true,
    creationDate: new Date()
}