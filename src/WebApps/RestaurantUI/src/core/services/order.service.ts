import { categoryReadAdapter, decimalSaleReadAdapter, emissionPointAdapter, tableReadAdapter, taxAdapter, taxRateAdapter, warehouseAdapter } from "../adapters"
import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http } from "../utilities"
 
const URL = 'Order'
export const OrdenService = {
    async post(data: {}) {
        const resultAxios = await Http({
                method: 'post',
                url: `${PATHS.PRIVATE}${URL}`,
                data: {data}       
        })

        const response: ApiResponse = resultAxios.data;
         return response;
    },

}