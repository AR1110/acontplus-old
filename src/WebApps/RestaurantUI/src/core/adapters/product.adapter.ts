import { ApiProduct, Product } from "../models";
// API wants a nested, complicated object
export const ApiProductAdapter = (product: ApiProduct): Product => ({
  id: product.id,
  title: product.title,
  price: product.price,
  description: product.description,
  images: product.images,
});
