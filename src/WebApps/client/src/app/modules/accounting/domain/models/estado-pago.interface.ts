import {CodigoEstadoPago} from "@accounting/domain/enums/codigo-estado-pago.enum";

export interface EstadoPago {
  idEstadoPago: number,
  descripcion: string
  codigo:  CodigoEstadoPago
}
