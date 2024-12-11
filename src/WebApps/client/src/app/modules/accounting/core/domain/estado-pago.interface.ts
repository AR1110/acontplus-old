import {CodigoEstadoPago} from "@accounting/core/enums/codigo-estado-pago.enum";

export interface EstadoPago {
  idEstadoPago: number,
  descripcion: string
  codigo:  CodigoEstadoPago
}
