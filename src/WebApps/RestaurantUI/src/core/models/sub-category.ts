export interface ApiSubCategory {
  readonly idSubFamilia: number;
  readonly idFamilia: number;
  readonly totalRecords: number;
  readonly estado: boolean;
  descripcion: string;
  siglas: string;
  codigo: string;
  montoObjetivo: number;
  nombreFamilia: string;
}

export interface FrontCategory {
  descripcion: string;
}
