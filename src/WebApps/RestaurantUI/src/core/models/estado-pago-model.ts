import { CODIGO_ESTADO_PAGO } from "../constants"

export interface EstadoPagoRead {
    idEstadoPago: number
    codigo: CODIGO_ESTADO_PAGO.CBR|CODIGO_ESTADO_PAGO.PE|CODIGO_ESTADO_PAGO.PFC|CODIGO_ESTADO_PAGO.PP | null
}