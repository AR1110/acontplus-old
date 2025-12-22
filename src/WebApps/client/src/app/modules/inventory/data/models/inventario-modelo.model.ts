export interface Model {
  idModelo: number;
  codigo: string;
  descripcion: string;
  estado: boolean;
  idMarca: number;
}

export type ModelRead = Model & {
  marca: string;
  totalRecords: number;
};
