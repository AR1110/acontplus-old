import { minus } from "@core/utils/decimal.util";
import { CuotaPorPagarLista } from "../interfaces/cuota-por-pagar.interface";
import { DECIMALS } from "@core/constants/global.constants";
import { roundNumber } from "@core/utils/round-number.utils";

type Props = {
  dataCuota: CuotaPorPagarLista
  valorAbono: number
  esAbonoPosfechado: boolean

  agregarPagoDetalle(dataCuota: CuotaPorPagarLista, abono: number, saldo: number): void
  setValorAbono(value: number): void
}

/**
 * Procesa una cuota que no tiene un abono previo.
 * Dependiendo del saldo y el valor del abono, actualiza los valores correspondientes.
 *
 * @param {CuotaPorPagarLista} item - La cuota a procesar.
 */
export const pagoCuotaSinAbonoUtil = function ({ dataCuota, valorAbono, esAbonoPosfechado, agregarPagoDetalle, setValorAbono }: Props): void {

  if (dataCuota.saldo >= valorAbono) {
    // Si el abono no es posfechado, asignar el valor al abono
    dataCuota.abono = esAbonoPosfechado ? 0 : valorAbono;

    // Actualizar el saldo de la cuota restando el abono
    dataCuota.saldo = minus(dataCuota.saldo, valorAbono, DECIMALS.CINCO) as number;

    // Registrar el detalle del pago y ajustar el valor restante del abono

    agregarPagoDetalle(dataCuota, valorAbono, dataCuota.saldo)
    setValorAbono(0);
  } else if (dataCuota.saldo < valorAbono) {



    const saldoDecimal = roundNumber(dataCuota.saldo, DECIMALS.CINCO);

    // Asignar abono según si es posfechado o no
    dataCuota.abono = esAbonoPosfechado ? 0 : saldoDecimal;
    // dataCuota.abonoPosfechado = this.esAbonoPosfechado ? saldoDecimal : 0;

    // Calcular el valor restante del abono
    let valorRestanteAbono = minus(valorAbono, dataCuota.saldo, DECIMALS.CINCO) as number;

    // Ajustar el valor del abono para evitar problemas de redondeo
    if (roundNumber(valorRestanteAbono, DECIMALS.DOS) === roundNumber(dataCuota.saldo, DECIMALS.DOS)) {
      valorRestanteAbono = dataCuota.saldo;
    }

    // Actualizar el valor del abono restante
    setValorAbono(valorRestanteAbono);

    // Agregar el detalle del pago y actualizar el saldo de la cuota
    agregarPagoDetalle(dataCuota, dataCuota.saldo, 0);
    dataCuota.saldo = 0;
  }
}
