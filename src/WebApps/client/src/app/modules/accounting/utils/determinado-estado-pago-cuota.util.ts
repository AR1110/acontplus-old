import { CodigoEstadoPago } from '@accounting/shared/enums/codigo-estado-pago.enum';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';

interface Props {
  abono: number;
  saldo: number;
  esPosfechado?: boolean;
  estadosPago: EstadoPago[];
}
export const determinadoEstadoPagoCuotaUtil = function ({
  saldo,
  abono,
  esPosfechado,
  estadosPago,
}: Props) {
  let estadoKey: CodigoEstadoPago;
  let nombreEstado;

  if (esPosfechado) {
    estadoKey = CodigoEstadoPago.POSFECHADO;
    nombreEstado = 'POSFECHADO';
  } else if (saldo === 0) {
    estadoKey = CodigoEstadoPago.PAGADA;
    nombreEstado = 'PAGADA';
  } else if (saldo > 0 && abono > 0) {
    estadoKey = CodigoEstadoPago.PENDIENTE_PARCIAL;
    nombreEstado = 'PENDIENTE PARCIAL';
  } else {
    estadoKey = CodigoEstadoPago.PENDIENTE;
    nombreEstado = 'PENDIENTE';
  }
  const estadoPago = estadosPago.find((ep) => ep.codigo === estadoKey) || {
    idEstadoPago: 0,
    descripcion: '',
  };

  return {
    idEstadoPago: estadoPago.idEstadoPago,
    descripcion: nombreEstado,
  };
};
