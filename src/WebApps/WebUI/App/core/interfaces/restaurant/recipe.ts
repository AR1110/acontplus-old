export interface Recipe {
    id?: string;
    itemId: number;
    ingredientId: number;
    quantity: number;
    unit: number;
    instructions: string;
}