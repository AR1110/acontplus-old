export interface ApiProduct {
  idProduct: number;
  description: string;
  iva: string;
  stock: number;
  stockMinimo: number;
  subFamilia: string;
  marca: string;
  medidad: string;
  style: string;
  precio?: number;
  images?: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  idProduct: number;
  description: string;
  iva: string;
  stock: number;
  stockMinimo: number;
  subFamilia: string;
  marca: string;
  medidad: string;
  style: string;
  precio?: number;
  images?: string[];
  creationAt?: string;
  updatedAt?: string;
}

export interface PriceSale  {
  string: string;
  precio: number;
}
