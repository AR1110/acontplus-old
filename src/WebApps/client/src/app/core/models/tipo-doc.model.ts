import { DOC_TYPE, DOC_TYPE_SRI } from "@core/constants/global.constants"

export interface TipoDoc {
  idTipoDocumento: number
  descripcion: string
  codigoSri: DOC_TYPE_SRI.LC | DOC_TYPE_SRI.F | DOC_TYPE_SRI.NC | DOC_TYPE_SRI.R
  codigo: DOC_TYPE.FC | DOC_TYPE.DNH | DOC_TYPE.LC
}
