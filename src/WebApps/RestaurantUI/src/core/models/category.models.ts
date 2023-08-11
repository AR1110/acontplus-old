export interface RawCategoryData {
    idSubFamilia: number
    descripcion: string,
    s3ObjectUrl?: string
}
export interface CategoryReadDto {
    idSubFamilia: number
    description: string,
    s3ObjectUrl?: string
}