export interface Category {
  idFamilia: number
  descripcion: string
  siglas: string
  estado: true,
}

export interface CategoryRead extends Category {
  totalRecords: number
}
