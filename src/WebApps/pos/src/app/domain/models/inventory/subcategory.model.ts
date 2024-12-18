import { SUB_CATEGORY_CODE } from "@domain/enums/main.enum"


export interface SubCategory {
    idSubFamilia: number
    descripcion: string,
    codigo: string | SUB_CATEGORY_CODE.COM | SUB_CATEGORY_CODE.PROM
    img?: string
}


