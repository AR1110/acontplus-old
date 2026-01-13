import { DECIMALS } from '@core/constants/global.constants';
import { roundNumber } from '@core/utils/round-number.utils';
import { PagoDetalle } from '@accounting/data/models/pago-detalle.model';
import { determinadoEstadoPagoCuotaUtil } from './determinado-estado-pago-cuota.util';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';
import { minus } from '@core/utils/decimal.util';
import { CuotaPorPagarEstado } from '@accounting/data/models/comprobante-egreso.entity';

interface PagoDetallePick
  extends Pick<PagoDetalle, 'idCuentaPorPagar' | 'idCuotaPorPagar' | 'abono' | 'saldo'> {}
interface Props {
  pagosDetalle: PagoDetalle[];
  estadosPago: EstadoPago[];
}

/**
 * Genera el estado de las cuotas por pagar, considerando los pagos realizados.
 *
 * @param {Object} param0 - Objeto con los parámetros de entrada.
 * @param {Array} param0.pagosDetalle - Detalles de los pagos realizados.
 * @returns {Array} - Lista con el estado de cada cuota por pagar.
 */
export const obtenerCuotasPorPagarEstadoUtil = function ({
  pagosDetalle,
  estadosPago,
}: Props): CuotaPorPagarEstado[] {
  const cuotasPorPagarAgrupado = pagosDetalle.reduce((acc, curr) => {
    const existeDato = acc.find(
      (item) =>
        item.idCuentaPorPagar === curr.idCuentaPorPagar &&
        item.idCuotaPorPagar === curr.idCuotaPorPagar,
    );
    if (!existeDato) {
      acc.push({
        idCuentaPorPagar: curr.idCuentaPorPagar,
        idCuotaPorPagar: curr.idCuotaPorPagar,
        //   valorSaldoLectura: curr.valorSaldoLectura,
        saldo: curr.saldo,
        abono: curr.abono,
      });
    } else {
      existeDato.abono += curr.abono;
    }
    return acc;
  }, [] as PagoDetallePick[]);

  const cuotasPorPagarEstado: CuotaPorPagarEstado[] = [];

  for (const item of cuotasPorPagarAgrupado) {
    const totalNoPosfechado = pagosDetalle
      .filter((cd) => cd.idCuotaPorPagar === item.idCuotaPorPagar && !cd.esPosfechado)
      .map((item) => item.abono)
      .reduce((acc, curr) => acc + curr, 0);

    const valorSaldoLectura = roundNumber(item.saldo, DECIMALS.DOS);
    const totalNoPosfechadoTemp = roundNumber(totalNoPosfechado, DECIMALS.DOS);

    const valorSaldo = minus(valorSaldoLectura, totalNoPosfechadoTemp, DECIMALS.DOS) as number;

    const dataEstadoPago = determinadoEstadoPagoCuotaUtil({
      saldo: valorSaldo,
      estadosPago,
      abono: item.abono,
    });

    cuotasPorPagarEstado.push({
      idEstadoPago: dataEstadoPago.idEstadoPago,
      abono: totalNoPosfechado,
      idCuotaPorPagar: item.idCuotaPorPagar,
    });
  }

  return cuotasPorPagarEstado;
};
