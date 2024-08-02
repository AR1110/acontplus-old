
import {
    bankAdapter, 
    paymentTypeAdapter,
    voucherQuotaAdapter,
    comprobanteAdpater
} from "../adapters"
import { cityAdapter } from "../adapters/account-receivable.adapter"
import { PATHS_API } from "../constants"
import { ApiResponse } from "../models"
import { Http } from "../utilities"

const URL = 'CuentaPorCobrar'
export const accountReceivableService = {
   

    async post(data: object) {
        const resultAxios = await Http({
            method: 'post',
            url: `${PATHS_API.ACCOUNTING}ComprobanteIngreso/Insert`,
            data: {
                data
            }
        })
        return resultAxios.data;
    }
}