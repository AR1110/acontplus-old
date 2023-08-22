export interface Recipe {
  readonly id?: number;
  unit: number;
  weight: number;
  netWeight: number;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  deleted: boolean;
  userId: number;
  ingredientId: number;
  summary: string;
  instructions: string;
  quantity: number;
  itemId: number;
}
