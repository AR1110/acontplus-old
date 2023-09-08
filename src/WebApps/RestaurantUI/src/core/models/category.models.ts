export interface RawCategoryData {
    idSubFamilia: number
    descripcion: string,
    codigo: string
    s3ObjectUrl?: string
}
export interface CategoryReadDto {
    idSubFamilia: number
    description: string,
    code: string
    s3ObjectUrl?: string
}