export interface Brand {
  idMarca: number;
  descripcion: string;
  estado: boolean;
  codigo: string;
}

export type BrandRead = Brand & {
  totalRecords: number;
};
