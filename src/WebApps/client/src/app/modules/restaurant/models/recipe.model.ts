export interface Recipe {
  id: number;
  itemId: number;
  productId?: number;
  ingredientId: number;
  quantity: number;
  summary: string;
  instructions: string;
  weight?: number;
  netWeight: number;
  extentId: number;
  precioCosto: number;
  extents?: string;
  costPrice: number;
}
