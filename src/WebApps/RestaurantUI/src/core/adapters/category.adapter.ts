import { ApiCategory, Category } from "../models/category";
// API wants a nested, complicated object
export const ApiCategoryAdapter = (category: ApiCategory): Category => ({
  id: category.id,
  name: category.name,
  image: category.image,
});
