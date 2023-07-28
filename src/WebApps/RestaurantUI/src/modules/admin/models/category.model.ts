export type CategoryResponseFromApi = Array<{
  readonly idSubFamilia: number;
  idFamilia: number;
  descripcion: string;
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

export interface ICategoryView {
 readonly idSubFamilia: number;
  idFamilia: number;
  codigo: string;
  descripcion: string;
  nombreFamilia: string;
  siglas: string;
  montoObjetivo: number;
  estado: boolean;
}

interface CategoryApi {
  idSubFamilia: number;
  idFamilia: number;
  codigo: string;
  descripcion: string;
  nombreFamilia: string;
  siglas: string;
  montoObjetivo: number;
  estado: boolean;
}

export interface DataFormApi {
  subFamilias: CategoryApi[]
}


export interface CategoryState {
  subFamilia: ICategoryView[]
  dataFormApi: DataFormApi
}