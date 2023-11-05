import { DOC_TYPE } from "../constants" 
export interface Print {
    orderId: number
    idDocument: number
    idTipoDocumento: number
    codEstab: string
    codDoc: DOC_TYPE.NE | DOC_TYPE.FV
    nroIdentificacion: string
}