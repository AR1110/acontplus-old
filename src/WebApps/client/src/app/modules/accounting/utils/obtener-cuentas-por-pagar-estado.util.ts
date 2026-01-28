import { PagoDetalle } from '@accounting/data/models/pago-detalle.model';
import {
  CuentaPorPagarEstado,
  CuentaPorPagarHistorial,
} from '@accounting/data/models/comprobante-egreso.entity';
import { minus } from '@core/utils/decimal.util';
import { DECIMALS } from '@core/constants/global.constants';
import { determinadoEstadoPagoCuotaUtil } from './determinado-estado-pago-cuota.util';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';
import { roundNumber } from '@core/utils/round-number.utils';

interface Props {
  pagosDetalle: PagoDetalle[];
  cuentasPorPagarHistorial: CuentaPorPagarHistorial[];
  estadosPago: EstadoPago[];
}
/**
 * Calcula el estado de las cuentas por pagar, agrupando por cuenta y considerando los pagos posfechados.
 *
 * @param {Object} param0 - Objeto con los parámetros de entrada.
 * @param {Array} param0.cuentasPorPagarHistorial - Historial de las cuentas por pagar.
 * @param {Array} param0.pagosDetalle - Detalles de los pagos realizados.
 * @returns {Array} - Lista con el estado de cada cuenta por pagar.
 */
export const obtenerCuentasPorPagarEstado = function ({
  cuentasPorPagarHistorial,
  pagosDetalle,
  estadosPago,
}: Props): CuentaPorPagarEstado[] {
  // Agrupando las cuentas por pagar y sumando los abonos para cada cuenta
  const cuentasPorPagarAgrupado = cuentasPorPagarHistorial.reduce((acc, curr) => {
    const existeDato = acc.find((item) => item.idCuentaPorPagar === curr.idCuentaPorPagar);
    if (!existeDato) {
      acc.push({
        idCuentaPorPagar: curr.idCuentaPorPagar,
        saldo: curr.saldo,
        //  valorSaldoLectura: this.fS.instanceDecimal(curr.valorSaldoLectura),
        abono: curr.abono,
        // diasMora: curr.diasMora,
        // mora: curr.mora
        secuencial: 0,
      });
    } else {
      existeDato.abono += curr.abono;
    }
    return acc;
  }, [] as CuentaPorPagarHistorial[]);

  const cuentasPorPagarEstado: CuentaPorPagarEstado[] = [];

  for (const item of cuentasPorPagarAgrupado) {
    let valorSaldo = item.saldo;

    // Calcular el total de pagos posfechados y no posfechados
    const totalPosfechado = pagosDetalle
      .filter((cd) => cd.idCuentaPorPagar === item.idCuentaPorPagar && cd.esPosfechado)
      .map((item) => item.abono)
      .reduce((acc, curr) => acc + curr, 0);

    const totalNoPosfechado = pagosDetalle
      .filter((cd) => cd.idCuentaPorPagar === item.idCuentaPorPagar && !cd.esPosfechado)
      .map((item) => item.abono)
      .reduce((acc, curr) => acc + curr, 0);

    valorSaldo = minus(valorSaldo, totalNoPosfechado, DECIMALS.CINCO) as number;

    // Determinar el estado de la cuota en función de los pagos
    let dataEstadoPago = {} as Partial<EstadoPago>;
    if (totalPosfechado > 0) {
      dataEstadoPago = determinadoEstadoPagoCuotaUtil({
        esPosfechado: true,
        estadosPago,
        abono: 0,
        saldo: 0,
      });
    } else {
      dataEstadoPago = determinadoEstadoPagoCuotaUtil({
        esPosfechado: false,
        estadosPago,
        saldo: roundNumber(valorSaldo, DECIMALS.DOS),
        abono: roundNumber(totalNoPosfechado, DECIMALS.DOS),
      });
    }

    // Agregar la información del estado de la cuenta por pagar
    cuentasPorPagarEstado.push({
      idCuentaPorPagar: item.idCuentaPorPagar,
      idEstadoPago: dataEstadoPago.idEstadoPago ?? 0,
      abono: roundNumber(totalNoPosfechado, DECIMALS.DOS),
    });
  }

  return cuentasPorPagarEstado;
};
