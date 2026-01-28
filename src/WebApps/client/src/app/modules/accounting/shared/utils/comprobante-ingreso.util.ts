import { roundNumber } from '@core/utils/round-number.utils';
import {
  MultiplesPaymentType,
  PaymentDetail,
  PaymentHistory,
} from '@accounting/data/models/comprobante-ingreso';
import {
  CuentaPorCobrar,
  CuentaPorCobrarComprobante,
  Cuota,
} from '@accounting/data/models/cuenta-por-cobrar.model';

type CuotaExtend = Cuota & {
  abonoPosfechado: number;
};
class ComprobanteIngresoUtil {
  private MAX_NUMBER_ROUND_GENERAL = 3;
  private MAX_NUMBER_ROUND_CUOTA_ABONO = 5;

  private receivedAmount = 0;
  private voucher = {} as CuentaPorCobrar;
  private esAbonoPosfechado = false;
  paymentDetails: PaymentDetail[] = [];
  historialCuentas: PaymentHistory[] = [];
  private sequencia = 0;

  constructor(sequencia: number) {
    this.sequencia = sequencia;
    this.paymentDetails = [];
    this.receivedAmount = 0;
  }

  setReceivedAmount(value: number, esAbonoPosfechado: boolean) {
    this.receivedAmount = value;
    this.esAbonoPosfechado = esAbonoPosfechado;
  }

  setPaymentDetail(paymentDetails: PaymentDetail[]) {
    this.paymentDetails = paymentDetails;
  }

  getEstadoCuota(item: any) {
    let estado = '';
    if (item.saldo === 0) estado = 'COBRADA';
    if (item.saldo > 0) estado = 'PENDIENTE PARCIAL';
    if (item.abono === 0) estado = 'PENDIENTE';
    return estado;
  }

  applyReceivedAmountToQuota(cuentasPorCobrar: CuentaPorCobrar[]): CuentaPorCobrar[] {
    const tempVoucherQuotas = JSON.parse(JSON.stringify(cuentasPorCobrar));

    for (const group of tempVoucherQuotas) {
      this.voucher = group;

      if (typeof this.receivedAmount !== 'number' || this.receivedAmount > 0) {
        let valorMovimientoSaldo = 0,
          historialAbono = 0;

        const cobrosDetalleFiltered = this.paymentDetails.filter(
          (cd) => cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar,
        );

        const totalAbonoCuenta = roundNumber(
          cobrosDetalleFiltered.reduce((acc, curr) => acc + curr.abono, 0),
          this.MAX_NUMBER_ROUND_GENERAL,
        );

        if (cobrosDetalleFiltered.length === 0) {
          const historialCuentasFiltered = this.historialCuentas.filter(
            (cd) =>
              cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar &&
              cd.secuencial === this.sequencia,
          );

          const dataUltimoCobroDetalle = historialCuentasFiltered.pop();

          if (dataUltimoCobroDetalle) {
            valorMovimientoSaldo = dataUltimoCobroDetalle.saldo - dataUltimoCobroDetalle.abono;
          } else {
            valorMovimientoSaldo = group.saldo;
          }

          if (this.receivedAmount <= this.voucher.saldo) {
            historialAbono = this.receivedAmount;
          } else if (this.receivedAmount >= this.voucher.saldo) {
            historialAbono = this.voucher.saldo;
          }

          this.historialCuentas.push({
            secuencial: this.sequencia,
            idCuentaPorCobrar: this.voucher.idCuentaPorCobrar,
            abono: roundNumber(historialAbono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
            saldo: roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
            diasMora: this.voucher.diasMora,
            mora: this.voucher.mora,
          });
        }
        if (cobrosDetalleFiltered.length > 0) {
          if (totalAbonoCuenta !== roundNumber(this.voucher.saldo, this.MAX_NUMBER_ROUND_GENERAL)) {
            const historialCuentasFiltered = this.historialCuentas.filter(
              (cd) => cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar,
            );

            const dataUltimoCobroDetalle = historialCuentasFiltered.pop();

            if (dataUltimoCobroDetalle) {
              valorMovimientoSaldo = dataUltimoCobroDetalle.saldo - dataUltimoCobroDetalle.abono;
            } else {
              valorMovimientoSaldo = group.saldo;
            }

            if (this.receivedAmount <= valorMovimientoSaldo) {
              historialAbono = this.receivedAmount;
            } else {
              historialAbono = valorMovimientoSaldo;
            }

            this.historialCuentas.push({
              secuencial: this.sequencia,
              idCuentaPorCobrar: this.voucher.idCuentaPorCobrar,
              abono: roundNumber(historialAbono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
              saldo: roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
              diasMora: this.voucher.diasMora,
              mora: this.voucher.mora,
            });
          }
        }
      }

      for (const item of group.cuotas) {
        item.abonoPosfechado = 0;

        if (typeof this.receivedAmount !== 'number' || this.receivedAmount === 0) return [];

        //Si la cuota no tiene ningún abono
        if (item.abono > 0) {
          this.feeWithPayment(item);
        } else {
          this.unpaidFee(item);
        }

        item.cuota = roundNumber(item.cuota, this.MAX_NUMBER_ROUND_GENERAL);
        item.abono = roundNumber(item.abono, this.MAX_NUMBER_ROUND_GENERAL);
        item.abonoPosfechado = roundNumber(item.abonoPosfechado, this.MAX_NUMBER_ROUND_GENERAL);
        item.estado = this.getEstadoCuota(item);

        item.esCuotaAfectada = true; //
      }
    }
    return tempVoucherQuotas;
  }

  private feeWithPayment(item: CuotaExtend) {
    //Validaciones Saldo Cuota
    if (item.saldoCta >= this.receivedAmount) {
      const valorSaldoCta = item.saldoCta - this.receivedAmount;
      item.saldoCta = roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND_GENERAL);
    } else if (item.saldoCta <= this.receivedAmount) {
      item.saldoCta = 0;
    }

    //Validaciones Saldo

    if (item.saldo >= this.receivedAmount) {
      if (this.esAbonoPosfechado) {
        item.abonoPosfechado = this.receivedAmount + item.abonoPosfechado;
      } else {
        item.abono = this.receivedAmount + item.abono;
      }

      const valorSaldo = item.saldo - this.receivedAmount;
      item.saldo = roundNumber(valorSaldo, this.MAX_NUMBER_ROUND_GENERAL);
      // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_

      this.addPaymentDetail(item, this.receivedAmount, item.saldo);
      this.receivedAmount = 0;
    } else if (item.saldo <= this.receivedAmount) {
      const abonoCuota = item.saldo;
      if (this.esAbonoPosfechado) {
        item.abonoPosfechado = item.abonoPosfechado + item.saldo;
      } else {
        item.abono = item.abono + item.saldo;
      }

      this.receivedAmount = this.receivedAmount - item.saldo;
      this.receivedAmount = roundNumber(this.receivedAmount, this.MAX_NUMBER_ROUND_GENERAL);
      this.addPaymentDetail(item, abonoCuota, 0);
      item.saldo = 0;
    }
  }

  /**
   *
   * @param item Quota
   */
  private unpaidFee(item: CuotaExtend) {
    //Validaciones Saldo Cuota
    if (item.saldoCta >= this.receivedAmount) {
      const valorSaldoCta = item.saldoCta - this.receivedAmount;
      item.saldoCta = roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND_GENERAL);
    } else if (item.saldoCta <= this.receivedAmount) {
      item.saldoCta = 0;
    }

    //Validaciones Saldo
    if (item.saldo >= this.receivedAmount) {
      //Si el Abono pago no es Posfechado
      item.abono = this.esAbonoPosfechado ? 0 : this.receivedAmount;

      //Si el abono pago es posfechado
      item.abonoPosfechado = this.esAbonoPosfechado ? this.receivedAmount : 0;

      const valorSaldo = item.saldo - this.receivedAmount;
      // let valorSaldoCta = item.saldoCta - this.valorAbono;
      item.saldo = roundNumber(valorSaldo, this.MAX_NUMBER_ROUND_GENERAL);
      // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND_GENERAL);

      this.addPaymentDetail(item, this.receivedAmount, item.saldo);
      this.receivedAmount = 0;
    } else if (item.saldo <= this.receivedAmount) {
      //Si el Abono pago no es Posfechado
      item.abono = this.esAbonoPosfechado ? 0 : item.saldo;

      //Si el abono pago es posfechado
      item.abonoPosfechado = this.esAbonoPosfechado ? item.saldo : 0;

      this.receivedAmount = this.receivedAmount - item.saldo;

      this.addPaymentDetail(item, item.saldo, 0);
      item.saldo = 0;
    }
  }

  /**
   *
   * @param {object} item
   * @param {number} abono
   * @param {number} saldo
   * @returns void
   */
  private addPaymentDetail(item: CuotaExtend, abono: number, saldo: number) {
    if (item.cuota == 0) return;

    let valorMovimientoSaldo = 0;
    const cobrosDetalleFiltered = this.paymentDetails.filter(
      (cd) =>
        cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar &&
        cd.idCuotaPorCobrar === item.idCuotaPorCobrar,
    );

    const dataUltimoCobroDetalle = cobrosDetalleFiltered.pop();
    if (dataUltimoCobroDetalle) {
      valorMovimientoSaldo = dataUltimoCobroDetalle.saldoOriginal - dataUltimoCobroDetalle.abono;
    } else {
      valorMovimientoSaldo = item.saldoOriginal;
    }

    this.paymentDetails.push({
      idCuentaPorCobrar: this.voucher.idCuentaPorCobrar,
      idCuotaPorCobrar: item.idCuotaPorCobrar,
      abono: roundNumber(abono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
      interes: item.interes,
      diasMora: item.diasMora,
      mora: item.mora,
      cuota: roundNumber(item.cuota, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
      saldo,
      secuencial: this.sequencia,
      saldoOriginal: roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
    });
    item.saldo = roundNumber(item.saldo, this.MAX_NUMBER_ROUND_GENERAL);
    item.saldoOriginal = roundNumber(item.saldoOriginal - abono, this.MAX_NUMBER_ROUND_GENERAL);
  }
}

export const getTotalesCuota = (voucherQuotas: CuentaPorCobrar[]) => {
  const { importeTotal, totalAbonoAnterior, totalSaldo, totalSaldoDoc } = voucherQuotas.reduce(
    (total, voucher) => {
      total.importeTotal += voucher.importeTotal;
      total.totalSaldo += voucher.saldo;
      total.totalAbonoAnterior += voucher.abono;
      total.totalMora += voucher.mora;
      total.totalSaldoDoc += voucher.saldoDoc;
      return total;
    },
    {
      importeTotal: 0,
      totalAbonoAnterior: 0,
      totalSaldo: 0,
      totalMora: 0,
      totalSaldoDoc: 0,
    },
  );

  return {
    importeTotal: roundNumber(importeTotal, 5),
    totalAbonoAnterior: roundNumber(totalAbonoAnterior, 5),
    totalSaldo: roundNumber(totalSaldo, 5),
    totalSaldoDoc: roundNumber(totalSaldoDoc, 5),
    cambio: 0,
    totalValorAbono: 0,
    receivedAmount: 0,
  };
};

export const getPaymentSubTotales = (
  cuotasPorCobrar: CuentaPorCobrar[],
  multiplesPaymentType: MultiplesPaymentType[],
  comprobante: CuentaPorCobrarComprobante,
) => {
  const { totalValorAbono, totalValorAbonoEfectivo } = multiplesPaymentType.reduce(
    (prev, curr) => {
      prev.totalValorAbono += curr.valorAbono;
      if (curr.paymentTypeCode === 'EFE') {
        prev.totalValorAbonoEfectivo += curr.valorAbono;
      }
      return prev;
    },
    {
      totalValorAbono: 0,
      totalValorAbonoEfectivo: 0,
    },
  );

  const totalSaldo = cuotasPorCobrar
    .flatMap((item) => item.cuotas)
    .reduce((prev, curr) => prev + curr.saldo, 0);
  let valorCambio = 0;

  if (totalValorAbonoEfectivo >= comprobante.saldo) {
    valorCambio = totalValorAbonoEfectivo - comprobante.saldo;
  }

  return {
    totalValorAbono: roundNumber(totalValorAbono, 5),
    totalSaldo: roundNumber(totalSaldo, 5),
    valorCambio: roundNumber(valorCambio, 5),
  };
};

export default ComprobanteIngresoUtil;
