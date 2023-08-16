export interface Summary {
    tax: number;
    taxAmount: number;
    total: number // With discount on items
    netTotal: number // Net - (tax + discount on total)

}


export interface CartItem {
    index: number;
    readonly productId: number;
    name: string;
    qty: number;
    price: number;
    discount: number;
    discountTotal: number; 
    sellingPrice: number;
    totalPrice: number;
    s3ObjectUrl: string;    
}