import { RoundNumber } from ".";
import { CODIGO_ESTADO_PAGO } from "../constants";
import { CuentasPorCobrarAgrupado, CuotasPorCobrarEstado, MultiplesPaymentType, PaymentDetail, PaymentHistory, Quota, Voucher, VoucherQuota } from "../models";
import { EstadoPagoRead } from "../models/estado-pago-model";


//--------------
class CheckoutUtility {
    private MAX_NUMBER_ROUND = 5;
    private receivedAmount = 0;
    private voucher = {} as VoucherQuota;
    private esAbonoPosfechado = false;
    paymentDetails: Array<PaymentDetail> = [];
    historialCuentas: Array<PaymentHistory> = [];
    private estadosPago:EstadoPagoRead[]=[]

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

    set setEstadosPago(estadosPago:EstadoPagoRead[]){
        this.estadosPago = estadosPago
    }

    /**
     * 
     * @param {*} historialCuentas 
     * @param {*} cobros 
     * @param {*} cobrosDetalle 
     */
    generarCuentasPorCobrarEstado<T extends { 
        historialCuentas :PaymentHistory[]
        cobrosDetalle:PaymentDetail[] 
    }>({ historialCuentas, cobrosDetalle }:T) {
        const cuentasPorCobrarAgrupado = historialCuentas.reduce((acc, curr) => {

            const existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar);
            if (!existeDato) {
                acc.push({
                    idCuentaPorCobrar: curr.idCuentaPorCobrar,
                    valorSaldoLectura: curr.valorSaldoLectura,
                    abono: curr.abono,
                    diasMora: curr.diasMora,
                    mora: curr.mora
                })
            } else {
                existeDato.abono += curr.abono;

            }
            return acc;

        }, [] as CuentasPorCobrarAgrupado[])

        const cuentasPorCobrarEstado = [];


        for (const item of cuentasPorCobrarAgrupado) {
            let valorSaldo = 0, dataEstadoPago:any = {};

            const totalPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && cd.posfechado).reduce((acc, curr) => {
                acc += curr.abono;
                return acc;
            }, 0)

            const totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && !cd.posfechado).reduce((acc, curr) => {
                acc += curr.abono;
                return acc;
            }, 0)
 

            valorSaldo = item.valorSaldoLectura - totalNoPosfechado;

            if (totalPosfechado > 0) {
                dataEstadoPago = this.getDataEstadoPago({
                    esPosfechado: true,
                    saldo: 0,
                    abono: 0
                })
            }


            if (totalPosfechado <= 0) {
                dataEstadoPago = this.getDataEstadoPago({
                    esPosfechado: false,
                    saldo: valorSaldo,
                    abono: totalNoPosfechado
                })
            }

            cuentasPorCobrarEstado.push({
                idCuentaPorCobrar: item.idCuentaPorCobrar,
                idEstadoPago: dataEstadoPago?.idEstadoPago,
                abono: totalNoPosfechado
            })

        }
        return cuentasPorCobrarEstado;

    }

     

    generarCuotasPorCobrarEstado<T extends { cobrosDetalle: PaymentDetail []}>({ cobrosDetalle }:T) {

        const cuotasPorCobrarAgrupado = cobrosDetalle.reduce((acc, curr) => {

            const existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar && curr.idCuentaPorCobrar && dataCxc.idCuotaPorCobrar === curr.idCuotaPorCobrar);
            if (!existeDato) {
                acc.push({
                    idCuentaPorCobrar: curr.idCuentaPorCobrar,
                    idCuotaPorCobrar: curr.idCuotaPorCobrar,
                    valorSaldoLectura: curr.valorSaldoLectura,
                    abono: curr.abono,
                })
            } else {
                existeDato.abono += curr.abono;

            }
            return acc;

        }, [] as CuotasPorCobrarEstado[])

        const cuotasPorCobrarEstado = [];

        for (const item of cuotasPorCobrarAgrupado) {

            const totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuotaPorCobrar === item.idCuotaPorCobrar && !cd.posfechado).reduce((acc, curr) => {
                acc += curr.abono;
                return acc;
            }, 0)

            const valorSaldo = item.valorSaldoLectura - totalNoPosfechado;

            const dataEstadoPago = this.getDataEstadoPago({
                esPosfechado: false,
                saldo: valorSaldo,
                abono: item.abono
            })


            cuotasPorCobrarEstado.push({
                idEstadoPago: dataEstadoPago.idEstadoPago,
                abono: totalNoPosfechado,
                idCuotaPorCobrar: item.idCuotaPorCobrar
            })

        }
        return cuotasPorCobrarEstado;

    }

    applyReceivedAmountToQuota(voucherQuotas: Array<VoucherQuota>): Array<VoucherQuota> {
        const tempVoucherQuotas = JSON.parse(JSON.stringify(voucherQuotas));

        for (const group of tempVoucherQuotas) {
            this.voucher = group;

            if (typeof this.receivedAmount !== 'number' || this.receivedAmount > 0) {

                let valorMovimientoSaldo = 0, historialAbono = 0;

                const cobrosDetalleFiltered = this.paymentDetails.filter(cd => cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar)

                const totalAbonoCuenta = RoundNumber(cobrosDetalleFiltered.reduce((acc, curr) => acc + curr.abono, 0), this.MAX_NUMBER_ROUND);

                if (cobrosDetalleFiltered.length === 0) {

                    const historialCuentasFiltered = this.historialCuentas.filter(cd => (
                        cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar && cd.secuencial === this.sequencia
                    ));

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
                        valorSaldoLectura: this.voucher.valorSaldoLectura,
                        idCuentaPorCobrar: this.voucher.idCuentaPorCobrar,
                        abono: historialAbono,
                        saldo: RoundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND),
                        diasMora: this.voucher.diasMora,
                        mora: this.voucher.mora,
                    })

                }
                if (cobrosDetalleFiltered.length > 0) {
                    if (totalAbonoCuenta !== RoundNumber(this.voucher.saldo, this.MAX_NUMBER_ROUND)) {

                        const historialCuentasFiltered = this.historialCuentas.filter(cd => (
                            cd.idCuentaPorCobrar === this.voucher.idCuentaPorCobrar
                        ));

                        const dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                        if (dataUltimoCobroDetalle) {
                            valorMovimientoSaldo = dataUltimoCobroDetalle.saldo - dataUltimoCobroDetalle.abono;
                        } else {
                            valorMovimientoSaldo = group.saldo;
                        }

                        if (this.receivedAmount <= valorMovimientoSaldo) {
                            historialAbono = this.receivedAmount;

                        } else {
                            historialAbono = valorMovimientoSaldo
                        }

                        this.historialCuentas.push({
                            secuencial: this.sequencia,
                            valorSaldoLectura: this.voucher.valorSaldoLectura,
                            idCuentaPorCobrar: this.voucher.idCuentaPorCobrar,
                            abono: historialAbono,
                            saldo: RoundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND),
                            diasMora: this.voucher.diasMora,
                            mora: this.voucher.mora,
                        })
                    }
                }
            }



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
            saldoOriginal: RoundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND),
            posfechado: this.esAbonoPosfechado,
            valorSaldoLectura: item.valorSaldoLectura,
        });
        item.saldo = RoundNumber(item.saldo, this.MAX_NUMBER_ROUND);
        item.saldoOriginal = RoundNumber(item.saldoOriginal - abono, this.MAX_NUMBER_ROUND);
    }


    /**
    * 
    * @param {*} saldo 
    * @param {*} abono 
    * @returns 
    */
    getDataEstadoPago<T extends { saldo: number, abono: number, esPosfechado :boolean}>({ saldo, abono, esPosfechado }:T) {
        let estado = '';
        let dataEstadoPago:EstadoPagoRead | undefined= {
            idEstadoPago: 0,
            codigo: null
        };

        if (esPosfechado) {
            dataEstadoPago = this.estadosPago.find(ep => ep.codigo === CODIGO_ESTADO_PAGO.PFC);
        } else {
            if (saldo === 0) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === CODIGO_ESTADO_PAGO.CBR);
                estado = 'COBRADA'
            }
            if (saldo > 0) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === CODIGO_ESTADO_PAGO.PP);
                estado = "PENDIENTE PARCIAL";
            }
            if (abono === 0) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === CODIGO_ESTADO_PAGO.PE);
                estado = "PENDIENTE";
            }

        }
        if(!dataEstadoPago){
            console.error('no se encontro datos de estado pago')
        }


        return {
            idEstadoPago: dataEstadoPago?.idEstadoPago,
            descripcion: estado
        }
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