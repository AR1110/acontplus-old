import { CategoryReadDto, DecimalSale, TableReadDto } from ".";

export interface Summary {
    tax: number;
    taxAmount: number;
    total: number // With discount on items
    netTotal: number // Net - (tax + discount on total)

}


export interface CartItem {
    index: number;
    readonly productId: number;
    readonly code: string
    name: string;
    qty: number;
    price: number;
    discount: number;
    discountTotal: number; 
    sellingPrice: number;
    totalPrice: number;
    s3ObjectUrl: string;    
}


export interface DataFormSale {
    categories: Array<CategoryReadDto>
    tables: Array<TableReadDto>,
    decimal: DecimalSale  
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
    } 
}