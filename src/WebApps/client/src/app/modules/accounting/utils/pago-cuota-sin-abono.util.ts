import { minus } from '@core/utils/decimal.util';
import { DECIMALS } from '@core/constants/global.constants';
import { roundNumber } from '@core/utils/round-number.utils';
import { CuotaPorPagarLista } from '@accounting/data/models/cuota-por-pagar.interface';

interface Props {
  dataCuota: CuotaPorPagarLista;
  valorAbono: number;
  esAbonoPosfechado: boolean;

  agregarPagoDetalle(dataCuota: CuotaPorPagarLista, abono: number, saldo: number): void;
  setValorAbono(value: number): void;
}

/**
 * Procesa una cuota que no tiene un abono previo.
 * Dependiendo del saldo y el valor del abono, actualiza los valores correspondientes.
 *
 * @param {CuotaPorPagarLista} item - La cuota a procesar.
 */
export const pagoCuotaSinAbonoUtil = function ({
  dataCuota,
  valorAbono,
  esAbonoPosfechado,
  agregarPagoDetalle,
  setValorAbono,
}: Props): void {
  // Validación inicial para evitar errores
  if (
    !dataCuota ||
    valorAbono == null ||
    typeof agregarPagoDetalle !== 'function' ||
    typeof setValorAbono !== 'function'
  ) {
    console.error('Datos incompletos o inválidos.');
    return;
  }

  // Si el saldo es suficiente para cubrir el abono
  if (dataCuota.saldo >= valorAbono) {
    // Determinar el abono (0 si es posfechado, valor completo si no lo es)
    dataCuota.abono = esAbonoPosfechado ? 0 : valorAbono;

    // Calcular el saldo restante y ajustarlo si es necesario
    let saldoRestante = minus(dataCuota.saldo, valorAbono, DECIMALS.CINCO) as number;
    if (roundNumber(saldoRestante, DECIMALS.DOS) === 0) {
      saldoRestante = 0;
    }

    // Actualizar saldo de la cuota y registrar el detalle del pago
    dataCuota.saldo = saldoRestante;
    agregarPagoDetalle(dataCuota, valorAbono, saldoRestante);

    // Restablecer el valor del abono restante a 0
    setValorAbono(0);
  } else if (dataCuota.saldo < valorAbono) {
    // Si el saldo no es suficiente, usar todo el saldo disponible
    const saldoDisponible = roundNumber(dataCuota.saldo, DECIMALS.CINCO);
    dataCuota.abono = esAbonoPosfechado ? 0 : saldoDisponible;

    // Calcular el abono restante después de usar el saldo disponible
    let abonoRestante = minus(valorAbono, dataCuota.saldo, DECIMALS.CINCO) as number;

    // Ajustar el abono restante si es casi igual al saldo (evitando problemas de redondeo)
    if (roundNumber(abonoRestante, DECIMALS.DOS) === roundNumber(dataCuota.saldo, DECIMALS.DOS)) {
      abonoRestante = dataCuota.saldo;
    }

    // Actualizar el valor del abono restante
    setValorAbono(abonoRestante);

    // Registrar el detalle del pago con el saldo total utilizado
    agregarPagoDetalle(dataCuota, dataCuota.saldo, 0);

    // Establecer el saldo de la cuota a 0
    dataCuota.saldo = 0;
  }
};
