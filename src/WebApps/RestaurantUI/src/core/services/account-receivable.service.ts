
import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http } from "../utilities"
 
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

        console.log(resultAxios)
        const response: ApiResponse = resultAxios.data;

         return response;
    },
}