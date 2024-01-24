
export interface SubCategory {
  idSubFamilia: number
  descripcion: string
  estado: true,
  siglas: string
  codigo: string
  montoObjetivo: number
  ultimoSecuencial: number
  s3ObjectKey: string
  s3ObjectUrl: string
  subcategoryPhotoId: number
}

export interface SubCategoryRead extends SubCategory {
  idFamilia: number
  nombreFamilia: string
  totalRecords: number
}
