import { bankAdapter, cityAdapter, comprobanteAdpater, paymentTypeAdapter, voucherQuotaAdapter } from "../adapters";
import { PATHS_API } from "../constants";
import { ApiResponse } from "../models";
import { Http } from "../utilities";

const url = `${PATHS_API.ACCOUNTING}ComprobanteIngreso/`

export  const comprobanteIngresoSvc = {

    async getDataForm<T extends { idCuentaPorCobrar?: number }>(data: T, cancelToken?: any) {
    
        const json = JSON.stringify({ 
            idCuentaPorCobrar: data.idCuentaPorCobrar,  
            tipo: 5 
        });

        const resultAxios = await Http({
            method: 'get',
            url: `${url}`,
            params: {
                json
            },
            cancelToken: cancelToken
        })


        const response: ApiResponse = resultAxios.data;
        
        if (!response) throw response;

        const { entidadFinanciera, banco, subEntidadFinanciera, provincia, cuentaPorCobrar, estadoPago } = JSON.parse(response.payload);

        const resultData = {
            cuentaPorCobrar:  [] as any[], 
            comprobante : {}

        } 
        //cuando el cobro es por documento 
        if (Array.isArray(cuentaPorCobrar)) {
            
            resultData.cuentaPorCobrar = cuentaPorCobrar.map((cxc: any) => {
             

                const cuotas = cxc.cuotas && JSON.parse(cxc.cuotas) || []
               
                const resultsCuotas = cuotas.map((cuota: any) => {
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
                        saldoOriginal: cuota.saldo,
                        valorSaldoLectura: cuota.saldo,
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
                    valorSaldoLectura: cxc.saldo,
                    descripcion: cxc.descripcion,
                    cuotas: structuredClone(resultsCuotas),
                    cuotasOriginal: structuredClone(resultsCuotas)
                }
            })
        }

        if (resultData.cuentaPorCobrar.length > 0) {
            const dataCuentaPorCobrar = resultData.cuentaPorCobrar[0]
            resultData.comprobante = {
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
            voucherQuotas: voucherQuotaAdapter(resultData.cuentaPorCobrar), //cuotas
            comprobante: comprobanteAdpater(resultData.comprobante),
            estadosPago: estadoPago
        }
        return resultMapper;
    },


}