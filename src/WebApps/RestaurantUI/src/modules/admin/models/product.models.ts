export type ProductResponseFromApi = Array<{
  code_unique: string;
  codigo: string;
  descripcion: string;
  estado: boolean;
  idArticulo: number;
  idMedida: number;
  imagen: boolean;
  marca: string;
  medida: string;
  modelo: string;
  observaciones: string;
  precioCosto: number;
  precioSinSubsidio: number;
  stock: number;
  stockMinimo: number;
  style: string;
  subFamilia: string;
  tipoArticulo: string;
  tipoIva: string;
  totalRecords: number;
}>;

export interface IProduct {
  code_unique: string;
  codigo: string;
  description: string;
  estado: boolean;
  idArticulo: number;
  idMedida: number;
  imagen: boolean;
  marca: string;
  medida: string;
  modelo: string;
  observation: string;
  precioCosto: number;
  precioSinSubsidio: number;
  stock: number;
  stockMinimo: number;
  style: string;
  subFamilia: string;
  tipoArticulo: string;
  tipoIva: string;
  totalRecords: number;
}
