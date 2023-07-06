import { ApiDish, Dish } from '../models';

export const ApiDishAdapter = (dish: ApiDish): Dish => ({
  ProductId: dish.ProductId,
  CreatedAt: dish.CreatedAt,
  UpdatedAt: dish.UpdatedAt,
  Enabled: dish.Enabled,
  DeletedAt: dish.DeletedAt,
  ProductionArea: dish.ProductionArea,
});
