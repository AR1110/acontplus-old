import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http } from "../utilities"

const URL = 'Order'
export const OrdenService = {
    async get(obj: object) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.PRIVATE}${URL}`,
            params: {
                json: JSON.stringify(obj)
            }
        })

        const response: ApiResponse = resultAxios.data;
        console.log(response)
        return response;
    },
    async post(data: object) {
        const resultAxios = await Http({
            method: 'post',
            url: `${PATHS.PRIVATE}${URL}`,
            data: { data }
        })

        const response: ApiResponse = resultAxios.data;
        return response;
    },

    async updateState(id: number) {
        const resultAxios = await Http({
            method: 'put',
            url: `${PATHS.PRIVATE}${URL}`,
            params: {
                id
            }
        })

        const response: ApiResponse = resultAxios.data;
        return response;
    },

}