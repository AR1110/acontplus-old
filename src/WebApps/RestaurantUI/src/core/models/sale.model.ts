export interface CartItem {
    index: number;
    readonly productId: number;
    description: string;
    unitPrice: number;
    amount: number;
    total: number;
    imgUrl: string;    
}