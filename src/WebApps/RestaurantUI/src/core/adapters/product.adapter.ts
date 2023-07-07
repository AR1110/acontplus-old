import { ApiProduct, Product } from "../models";
// API wants a nested, complicated object
export const ApiProductAdapter = (product: ApiProduct): Product => ({
  idProduct: product.idProduct,
  description: product.description,
  iva: product.iva,
  stock: product.stock,
  stockMinimo: product.stockMinimo,
  subFamilia: product.subFamilia,
  marca: product.marca,
  medidad: product.medidad,
  style: product.style,
  precio: product.precio,
  images: product.images ? product.images.split(",") : [],
  creationAt: product.creationAt ? product.creationAt : undefined,
  updatedAt: product.updatedAt ? product.updatedAt : undefined,
});
