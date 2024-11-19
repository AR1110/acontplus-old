import {CodigoEstadoPago} from "@accounting/enums/codigo-estado-pago.enum";

export interface EstadoPago {
  idEstadoPago: number,
  descripcion: string
  codigo:  CodigoEstadoPago
}
