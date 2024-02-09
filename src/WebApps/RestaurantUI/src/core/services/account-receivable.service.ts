
import {
    bankAdapter, 
    paymentTypeAdapter,
    voucherQuotaAdapter,
    comprobanteAdpater
} from "../adapters"
import { cityAdapter } from "../adapters/account-receivable.adapter"
import { PATHS } from "../constants"
import { Http } from "../utilities"

const URL = 'CuentaPorCobrar'
export const accountReceivableService = {
    async get<T extends { idCuentaPorCobrar?: number}>(data: T, cancelToken?: any) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.ACCOUNTING}${URL}`,
            params: {
                json: JSON.stringify(data)
            },
            cancelToken: cancelToken
        })


        const response = resultAxios.data;
        if(!response) throw response;

        const { entidadFinanciera, banco, documentos, subEntidadFinanciera, provincia } = response; 

        let cuentaPorCobrar: Array<any> = [], comprobante = {};
        //cuando el cobro es por documento 
        if (data.idCuentaPorCobrar && data.idCuentaPorCobrar > 0 && response.cuentaPorCobrar) {
            cuentaPorCobrar = response.cuentaPorCobrar;
            cuentaPorCobrar = cuentaPorCobrar.map((cxc:any) => { 

                const cuotas = JSON.parse(cxc.cuotas);
                const resultsCuotas = cuotas.map((cuota:any) => {
                    return {
                        idCuotaPorCobrar: cuota.idCuotaPorCobrar,
                        idCuentaPorCobrar: cuota.idCuentaPorCobrar,
                        nroCuota: cuota.nroCuota,
                        cuota: cuota.cuota,
                        mora: cuota.mora,
                        interes: cuota.interes,
                        diasMora: cuota.diasMora,
                        abono: cuota.abono,
                        saldoCta: cuota.saldoCta,
                        saldo: cuota.saldo,
                        estado: cuota.estado,
                        saldoOriginal: cuota.saldo
                    }
                })

                return {
                    codEstab: cxc.codEstab,
                    idCliente: cxc.idCliente,
                    identificacionComprador: cxc.identificacionComprador,
                    razonSocialComprador: cxc.razonSocialComprador,
                    idCuentaPorCobrar: cxc.idCuentaPorCobrar,
                    serieComprobante: cxc.serieComprobante,
                    codDoc: cxc.codDoc,
                    fechaEmision: cxc.fechaEmision,
                    fechaVencimiento: cxc.fechaVencimiento,
                    importeTotal: cxc.importeTotal,
                    diasMora: cxc.diasMora,
                    mora: cxc.mora,
                    abono: cxc.abono,
                    saldo: cxc.saldo,
                    saldoDoc: cxc.saldo,
                    descripcion: cxc.descripcion,
                    cuotas: structuredClone(resultsCuotas),
                    cuotasOriginal: structuredClone(resultsCuotas)
                }
            }) 
        }

        if (cuentaPorCobrar.length>0){
            const dataCuentaPorCobrar = cuentaPorCobrar[0]
            comprobante = {
                codEstab: dataCuentaPorCobrar.codEstab,
                idCliente: dataCuentaPorCobrar.idCliente,
                identificacionComprador: dataCuentaPorCobrar.identificacionComprador,
                razonSocialComprador: dataCuentaPorCobrar.razonSocialComprador,
                serieComprobante: dataCuentaPorCobrar.serieComprobante, 
                importeTotal: dataCuentaPorCobrar.importeTotal,
                saldo: dataCuentaPorCobrar.saldo,
                abono: dataCuentaPorCobrar.abono,
                fechaEmision: dataCuentaPorCobrar.fechaEmision
            } 
        } 

        const resultMapper = {
            paymentTypes: paymentTypeAdapter(entidadFinanciera, subEntidadFinanciera), 
            banks: bankAdapter(banco),
            cities: cityAdapter(provincia),
            voucherQuotas: voucherQuotaAdapter(cuentaPorCobrar), //cuotas
            comprobante: comprobanteAdpater(comprobante)
        }
        return resultMapper;
    },

    async post(data: object) {
        const resultAxios = await Http({
            method: 'post',
            url: `${PATHS.ACCOUNTING}ComprobanteIngreso/Insert`,
            data: {
                data
            }
        })
        return resultAxios.data;
    }
}