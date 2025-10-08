import { CodigoEstadoPago } from '@accounting/shared/enums/codigo-estado-pago.enum';

export interface EstadoPago {
  idEstadoPago: number;
  descripcion: string;
  codigo: CodigoEstadoPago;
}
