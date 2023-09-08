
import {
    bankAdapter,
    paymentSubTypeAdapter,
    paymentTypeAdapter,
    voucherQuotaAdapter,
    comprobanteAdpater
} from "../adapters"
import { cityAdapter } from "../adapters/account-receivable.adapter"
import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http, SnackbarUtility } from "../utilities"

const URL = 'CuentaPorCobrar'
export const AccountReceivableService = {
    async get(data: object) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.ACCOUNTING}${URL}`,
            params: {
                json: JSON.stringify(data)
            }
        })


        const response: ApiResponse = resultAxios.data;

        if (response.code === "0") {
            SnackbarUtility.warning(response.message)
            throw response;
        }

        const dataRepository = JSON.parse(response.payload);
        const voucherRepository = dataRepository[6][0] ?? {};

        const resultMapper = {
            paymentTypes: paymentTypeAdapter(dataRepository[0] ?? []).filter(item => {
                return item.code !== 'DOC'
            }),
            paymentSubTypes: paymentSubTypeAdapter(dataRepository[1] ?? []),
            banks: bankAdapter(dataRepository[2]),
            cities: cityAdapter(dataRepository[3] ?? []),
            voucherQuotas: voucherQuotaAdapter(dataRepository[5] ?? []), //cuotas
            comprobante: comprobanteAdpater(voucherRepository)
        }
        return resultMapper;
    },
}