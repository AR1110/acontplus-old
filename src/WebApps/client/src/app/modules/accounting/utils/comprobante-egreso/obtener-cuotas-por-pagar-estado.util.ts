import { DECIMALS } from "@core/constants/global.constants";
import { roundNumber } from "@core/utils/round-number.utils";
import { PagoDetalle } from "@accounting/core/domain/pago-detalle.model";
import { determinadoEstadoPagoCuotaUtil } from "./determinado-estado-pago-cuota.util";
import { EstadoPago } from "@accounting/core/domain/estado-pago.interface";
import { minus } from "@core/utils/decimal.util";
import {CuotaPorPagarEstado} from "@accounting/core/domain/comprobante-egreso.interface";


interface PagoDetallePick extends Pick<PagoDetalle, "idCuentaPorPagar" | "idCuotaPorPagar" | "abono" | "saldo"> { }
type Props = {
  pagosDetalle: PagoDetalle[]
  estadosPago: EstadoPago[]
}

/**
 * Genera el estado de las cuotas por pagar, considerando los pagos realizados.
 *
 * @param {Object} param0 - Objeto con los parámetros de entrada.
 * @param {Array} param0.pagosDetalle - Detalles de los pagos realizados.
 * @returns {Array} - Lista con el estado de cada cuota por pagar.
 */
export const obtenerCuotasPorPagarEstadoUtil = function ({ pagosDetalle, estadosPago }: Props): CuotaPorPagarEstado[] {


  let cuotasPorPagarAgrupado = pagosDetalle.reduce((acc, curr) => {
    let existeDato = acc.find(item => (item.idCuentaPorPagar === curr.idCuentaPorPagar) && (item.idCuotaPorPagar === curr.idCuotaPorPagar));
    if (!existeDato) {
      acc.push({
        idCuentaPorPagar: curr.idCuentaPorPagar,
        idCuotaPorPagar: curr.idCuotaPorPagar,
        //   valorSaldoLectura: curr.valorSaldoLectura,
        saldo: curr.saldo,
        abono: curr.abono
      });
    } else {
      existeDato.abono += curr.abono;
    }
    return acc;
  }, [] as PagoDetallePick[]);

  let cuotasPorPagarEstado: CuotaPorPagarEstado[] = [];

  for (let item of cuotasPorPagarAgrupado) {
    let totalNoPosfechado = pagosDetalle.filter(cd => cd.idCuotaPorPagar === item.idCuotaPorPagar && !cd.esPosfechado)
      .map(item => item.abono)
      .reduce((acc, curr) => acc + curr, 0);

    let valorSaldoLectura = roundNumber(item.saldo, DECIMALS.DOS);
    let totalNoPosfechadoTemp = roundNumber(totalNoPosfechado, DECIMALS.DOS);

    let valorSaldo = minus(valorSaldoLectura, totalNoPosfechadoTemp, DECIMALS.DOS) as number

    let dataEstadoPago = determinadoEstadoPagoCuotaUtil({
      saldo: valorSaldo,
      estadosPago,
      abono: item.abono
    });

    cuotasPorPagarEstado.push({
      idEstadoPago: dataEstadoPago.idEstadoPago,
      abono: totalNoPosfechado,
      idCuotaPorPagar: item.idCuotaPorPagar
    });
  }

  return cuotasPorPagarEstado;

}
