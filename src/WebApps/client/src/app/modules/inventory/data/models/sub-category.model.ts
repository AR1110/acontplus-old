export interface SubCategory {
  idSubFamilia: number;
  idFamilia: number;
  descripcion: string;
  estado: boolean;
  siglas: string;
  codigo: string;
  montoObjetivo: number;
  nombreFamilia: string;
  ultimoSecuencial: number;
  s3ObjectKey?: string;
  s3ObjectUrl?: string;
  subcategoryPhotoId?: number;
  totalRecords?: number;
}

export interface SubCategoryListDto {
  index: number;
  id: number;
  idFamilia: number;
  descripcion: string;
  estado: boolean;
  siglas: string;
  codigo: string;
  montoObjetivo: number;
  nombreFamilia: string;
  ultimoSecuencial: number;
  imageUrl?: string;
  subcategoryPhotoId?: number;
  totalRecords: number;
  s3ObjectKey?: string;
}

export interface SubCategoryCreateCommand {
  idFamilia: number;
  descripcion: string;
  siglas: string;
  codigo: string;
  montoObjetivo: number;
}

export interface SubCategoryUpdateCommand extends SubCategoryCreateCommand {
  idSubFamilia: number;
  estado: boolean;
}

export interface GroupedSubFamilia {
  familia: string;
  subFamilias: {
    idSubFamilia: number;
    subFamilia: string;
  }[];
}

export interface SubCategorySelectHtmlOnly {
  id: number;
  code: string;
  name: string;
}
