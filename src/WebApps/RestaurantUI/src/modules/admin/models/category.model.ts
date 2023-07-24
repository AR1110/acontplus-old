export type CategoryResponseFromApi = Array<{
  readonly idSubFamilia: number;
  idFamilia: number;
  description: string;
  siglas: string;
  codigo: string;
  ultimoSecuencial: string;
  fechaRegistro: string;
  estado: boolean;
  fechaBaja: string;
  idUsuario: number;
  idEntidad: number;
  montoObjetivo: number;
  importacion: boolean;
  imgUrl: string;
}>;

export interface ICategory {
  idFamilia: number;
  siglas: number;
  description: string;
  imgUrl: string;
}
