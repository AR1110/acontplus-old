export interface Recipe {
    readonly id?: number;
    unit: number;
    weight: number;
    netWeight: number;
    userId: number;
    ingredientId: number;
    summary: string;
    instructions: string;
    quantity: number;
    itemId: number;
    extendId?: number;

    //Todo: Optional for filter
    productId?: number;
    extents?: [];
}
