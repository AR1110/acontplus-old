export interface RawCategoryData {
    idSubFamilia: number
    descripcion: string,
    codigo: "COM" | ""
    s3ObjectUrl?: string
}
export interface CategoryReadDto {
    idSubFamilia: number
    description: string,
    code: "COM" | ""
    s3ObjectUrl?: string
}