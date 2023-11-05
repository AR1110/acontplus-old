
export enum CATEGORY_CODE  {
    COM='COM',
    PROM='PROM' 
}
type CODE = '' | CATEGORY_CODE.COM | CATEGORY_CODE.PROM
export interface RawCategoryData {
    idSubFamilia: number
    descripcion: string,
    codigo: CODE
    s3ObjectUrl?: string
}
export interface CategoryReadDto {
    idSubFamilia: number
    description: string,
    code: CODE
    s3ObjectUrl?: string
}