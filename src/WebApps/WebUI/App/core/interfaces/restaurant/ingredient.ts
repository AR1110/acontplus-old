export interface Ingredient {
   readonly id?: number;
   productId: number;
   productDescription: string;
   s3ObjectUrl: string;
   summary: string;
   quantity: number;
   unit: number;
   content: number;
   createdAt: string;
   updatedAt: string;
   enabled: boolean;
   deleted: boolean;
   userId: number;
   ingredientTypeId: number;
}