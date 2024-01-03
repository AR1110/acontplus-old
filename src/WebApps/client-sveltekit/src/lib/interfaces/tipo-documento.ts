import type { DOC_TYPE } from "$constants/constants"

export type TipoDocumento = {
    idTipoDocumento: number
    descripcion: string
    codigoSri?: DOC_TYPE.FV_SRI
    codigo: DOC_TYPE.NE | DOC_TYPE.FV
}