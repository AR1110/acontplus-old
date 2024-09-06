export interface Ingredient {
  id: number;
  ingredientTypeId?: number;
  quantity: number;
  productId: number;
  summary: string;
  productDescription: string;
  unit: number;
  content: string;
  s3ObjectUrl?: string;
  enabled: boolean;
  totalRecords: number;
}
