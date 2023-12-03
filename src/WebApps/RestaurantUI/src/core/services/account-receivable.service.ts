
import {
    bankAdapter, 
    paymentTypeAdapter,
    voucherQuotaAdapter,
    comprobanteAdpater
} from "../adapters"
import { cityAdapter } from "../adapters/account-receivable.adapter"
import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http, SnackbarUtility } from "../utilities"

const URL = 'CuentaPorCobrar'
export const accountReceivableService = {
    async get(data: object, cancelToken?: any) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.ACCOUNTING}${URL}`,
            params: {
                json: JSON.stringify(data)
            },
            cancelToken: cancelToken
        })


        const response: ApiResponse = resultAxios.data;

        if (response.code === "0") {
            SnackbarUtility.warning(response.message)
            throw response;
        }

        const dataRepository = JSON.parse(response.payload);
        const paymentTypes = dataRepository[0], paymentSubTypes = dataRepository[1]
        
        console.log(dataRepository)
        const voucherRepository = dataRepository[6][0] ?? {};

        const resultMapper = {
            paymentTypes: paymentTypeAdapter(paymentTypes, paymentSubTypes), 
            banks: bankAdapter(dataRepository[2]),
            cities: cityAdapter(dataRepository[3] ?? []),
            voucherQuotas: voucherQuotaAdapter(dataRepository[5] ?? []), //cuotas
            comprobante: comprobanteAdpater(voucherRepository)
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