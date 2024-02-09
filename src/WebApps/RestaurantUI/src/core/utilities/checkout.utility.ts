import { RoundNumber } from ".";
import { MultiplesPaymentType, PaymentDetail, PaymentHistory, Quota, Voucher, VoucherQuota } from "../models";


//--------------
class CheckoutUtility {
    private MAX_NUMBER_ROUND = 5;
    private receivedAmount = 0;
    private voucher = {} as VoucherQuota;
    private esAbonoPosfechado = false;
    paymentDetails: Array<PaymentDetail> = [];
    private sequencia = 0;

    constructor(sequencia: number) {
        this.sequencia = sequencia;
        this.paymentDetails = [];
        this.receivedAmount = 0;
    }

    setReceivedAmount(value: number) {
        this.receivedAmount = value;
    }

    setPaymentDetail(paymentDetails: Array<PaymentDetail>) {
        this.paymentDetails = paymentDetails;
    }

    applyReceivedAmountToQuota(voucherQuotas: Array<VoucherQuota>): Array<VoucherQuota> {
        const tempVoucherQuotas = JSON.parse(JSON.stringify(voucherQuotas));

        for (const group of tempVoucherQuotas) {
            this.voucher = group;
            for (const item of group.cuotas) {
                item.abonoPosfechado = 0;

                if (typeof this.receivedAmount !== "number" || this.receivedAmount === 0) return []

                //Si la cuota no tiene ningún abono
                if (item.abono > 0) {
                    this.feeWithPayment(item);
                } else {
                    this.unpaidFee(item);
                }

                item.cuota = RoundNumber(item.cuota, this.MAX_NUMBER_ROUND);
                item.abono = RoundNumber(item.abono, this.MAX_NUMBER_ROUND);
                item.abonoPosfechado = RoundNumber(
                    item.abonoPosfechado,
                    this.MAX_NUMBER_ROUND
                );
                // item.saldo = this.getValorSaldo(item) //Verificamos el saldo de la Cuota
                //item.estado = this.getEstadoCuota(item);

                // item.esCuotaAfectada = true;
            }
        }
        return tempVoucherQuotas;
    }

    private feeWithPayment(item: Quota) {
        //Validaciones Saldo Cuota
        if (item.saldoCta >= this.receivedAmount) {
            const valorSaldoCta = item.saldoCta - this.receivedAmount;
            item.saldoCta = RoundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);
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
            item.saldo = RoundNumber(valorSaldo, this.MAX_NUMBER_ROUND);
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
            this.receivedAmount = RoundNumber(
                this.receivedAmount,
                this.MAX_NUMBER_ROUND
            );
            this.addPaymentDetail(item, abonoCuota, 0);
            item.saldo = 0;
        }
    }

    /**
     *
     * @param item Quota
     */
    private unpaidFee(item: Quota) {
        //Validaciones Saldo Cuota
        if (item.saldoCta >= this.receivedAmount) {
            const valorSaldoCta = item.saldoCta - this.receivedAmount;
            item.saldoCta = RoundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);
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
            item.saldo = RoundNumber(valorSaldo, this.MAX_NUMBER_ROUND);
            // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);

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
    private addPaymentDetail(item: Quota, abono: number, saldo: number) {
        if (item.cuota == 0) return;

        let valorMovimientoSaldo = 0;
        const cobrosDetalleFiltered = this.paymentDetails.filter(cd => (
            cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar &&
            cd.idCuotaPorCobrar === item.idCuotaPorCobrar
        ))

        const dataUltimoCobroDetalle = cobrosDetalleFiltered.pop();
        if (dataUltimoCobroDetalle) {
            valorMovimientoSaldo = dataUltimoCobroDetalle.saldoOriginal - dataUltimoCobroDetalle.abono;
        } else {
            valorMovimientoSaldo = item.saldoOriginal;
        }

        this.paymentDetails.push({
            idCuentaPorCobrar: this.voucher.idCuentaPorCobrar,
            idCuotaPorCobrar: item.idCuotaPorCobrar,
            abono: RoundNumber(abono, this.MAX_NUMBER_ROUND),
            interes: item.interes,
            diasMora: item.diasMora,
            mora: item.mora,
            cuota: RoundNumber(item.cuota, this.MAX_NUMBER_ROUND),
            saldo,
            secuencial: this.sequencia,
            saldoOriginal: RoundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND)
        });
        item.saldo = RoundNumber(item.saldo, this.MAX_NUMBER_ROUND);
        item.saldoOriginal = RoundNumber(item.saldoOriginal - abono, this.MAX_NUMBER_ROUND);
    }

    getHistoryPayments(voucherQuotas: Array<VoucherQuota>, paymentDetails: Array<PaymentDetail>): Array<PaymentHistory> {
        const historialCobros: Array<PaymentHistory> = [];
        for (const item of voucherQuotas) {
            const totalAbono = paymentDetails.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar)
                .reduce((prev, curr) => prev + curr.abono, 0);
            // if (paymentDetails) {
            //     totalAbono = paymentDetails.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar)
            //         .reduce((prev, curr) => prev + curr.abono, 0);
            // } else {
            //     totalAbono = this.paymentDetails.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar)
            //         .reduce((prev, curr) => prev + curr.abono, 0);
            // }
            if (totalAbono > 0) {
                historialCobros.push({
                    idCuentaPorCobrar: item.idCuentaPorCobrar,
                    abono: totalAbono,
                    diasMora: item.diasMora,
                    mora: item.mora,
                    saldo: item.saldo,
                }) 
            } else break;
        }
        return historialCobros;
    }
}

export const getTotalesCuota = (voucherQuotas: Array<VoucherQuota>) => {
    const { importeTotal, totalAbonoAnterior, totalSaldo, totalSaldoDoc } = voucherQuotas.reduce((total, voucher) => {
        total.importeTotal += voucher.importeTotal;
        total.totalSaldo += voucher.saldo;
        total.totalAbonoAnterior += voucher.abono;
        total.totalMora += voucher.mora;
        total.totalSaldoDoc += voucher.saldoDoc;
        return total;
    }, {
        importeTotal: 0,
        totalAbonoAnterior: 0,
        totalSaldo: 0,
        totalMora: 0,
        totalSaldoDoc: 0
    })

    return {
        importeTotal: RoundNumber(importeTotal, 5),
        totalAbonoAnterior: RoundNumber(totalAbonoAnterior, 5),
        totalSaldo: RoundNumber(totalSaldo, 5),
        totalSaldoDoc: RoundNumber(totalSaldoDoc, 5),
    }

}

export const getCheckoutSubTotales = (voucherQuotas: Array<VoucherQuota>, multiplesPaymentType: Array<MultiplesPaymentType>, comprobante: Voucher) => {
    const totalValorAbono = multiplesPaymentType.reduce((prev, curr) => prev + curr.receivedAmount, 0)
    const totalSaldo = voucherQuotas.flatMap(item => item.cuotas)
        .reduce((prev, curr) => prev + curr.saldo, 0);
    let valorCambio = 0;


    if (totalValorAbono >= comprobante.totalBalance) {
        valorCambio = totalValorAbono - comprobante.totalBalance;
    }
    return {
        totalValorAbono: RoundNumber(totalValorAbono, 5),
        totalSaldo: RoundNumber(totalSaldo, 5),
        valorCambio: RoundNumber(valorCambio, 5)
    }
}

export default CheckoutUtility