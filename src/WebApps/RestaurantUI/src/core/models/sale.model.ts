export interface CartItem {
    index: number;
    readonly productId: number;
    description: string;
    unitPrice: number;
    cantidad: number;
    total: number;
    imgUrl: string;    
}