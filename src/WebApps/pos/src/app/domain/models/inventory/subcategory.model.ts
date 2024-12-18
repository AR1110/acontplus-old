import { SUB_CATEGORY_CODE } from "@/shared/enums/main.enum"


export interface SubCategory {
    idSubFamilia: number
    descripcion: string,
    codigo: string | SUB_CATEGORY_CODE.COM | SUB_CATEGORY_CODE.PROM
    img?: string
}


