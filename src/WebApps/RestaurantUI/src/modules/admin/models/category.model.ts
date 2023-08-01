export interface CategoryReadDto {
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
  nombreFamilia: string
  totalRecords: number;
}

export type CategoryReadDtoMapper = Array<CategoryReadDto>;

export interface CategoryCreateDto {
 readonly idSubFamilia: number;
  idFamilia: number;
  codigo: string;
  descripcion: string;
  nombreFamilia: string;
  siglas: string;
  montoObjetivo: number;
  estado: boolean;
}
  

export interface CategoryUpdateDto{
  idFamilia: number
  idSubFamilia: 0
  descripcion: string
  
  
}