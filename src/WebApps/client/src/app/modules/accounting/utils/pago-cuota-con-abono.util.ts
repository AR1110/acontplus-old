import { minus, plus } from '@core/utils/decimal.util';
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

export const pagoCuotaConAbonoUtil = function ({
  dataCuota,
  valorAbono,
  esAbonoPosfechado,
  agregarPagoDetalle,
  setValorAbono,
}: Props) {
  if (dataCuota.saldo >= valorAbono) {
    // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
    if (esAbonoPosfechado) {
      //   dataCuota.abonoPosfechado = this.fS.plus(dataCuota.abonoPosfechado, this.valorAbono, this.DECIMAL_CINCO);
    } else {
      const totalAbonoCuota = plus(dataCuota.abono, valorAbono, DECIMALS.CINCO) as number;
      console.log(totalAbonoCuota);
      console.log(dataCuota.saldo);
      if (
        roundNumber(totalAbonoCuota, DECIMALS.DOS) === roundNumber(dataCuota.saldo, DECIMALS.DOS)
      ) {
        dataCuota.abono = dataCuota.saldo;
      } else {
        dataCuota.abono = totalAbonoCuota;
      }
    }

    // Resta el valor del abono al saldo total actual de la cuota
    const saldoTotalActual = minus(dataCuota.saldo, valorAbono, DECIMALS.CINCO) as number;
    console.log(saldoTotalActual);
    //se verifica antes  por temas de decimales porque al final queda milesimas
    if (roundNumber(saldoTotalActual, DECIMALS.DOS) === 0) {
      dataCuota.saldo = 0;
    } else {
      dataCuota.saldo = saldoTotalActual;
    }

    agregarPagoDetalle(dataCuota, valorAbono, dataCuota.saldo);
    setValorAbono(0);
  } else if (dataCuota.saldo < valorAbono) {
    // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
    if (esAbonoPosfechado) {
      //  dataCuota.abonoPosfechado = this.fS.plus(dataCuota.abonoPosfechado, dataCuota.saldo, this.DECIMAL_CINCO);
    } else {
      dataCuota.abono = plus(dataCuota.abono, dataCuota.saldo, DECIMALS.CINCO) as number;
    }

    // Agrega un detalle de cobro con el saldoTotalActual como valor del abono
    agregarPagoDetalle(dataCuota, dataCuota.saldo, 0);

    // Calcula el nuevo valor del abono restando el saldo del valor actual del abono

    const valorAbonoDiferencia = minus(valorAbono, dataCuota.saldo, DECIMALS.CINCO) as number;

    setValorAbono(valorAbonoDiferencia);
    dataCuota.saldo = 0;
  }
};
