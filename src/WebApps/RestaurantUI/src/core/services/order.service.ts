import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http, loadAbort } from "../utilities"

const URL = 'Order'
const orderService = {
    async get(obj: object) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.PRIVATE}${URL}`,
            params: {
                json: JSON.stringify(obj)
            }
        })
        const response = resultAxios.data;
        return response;
    },

    getId(id: number) {
        const controller = loadAbort(); //Cancelar peticion 
        const json = JSON.stringify({
            tipo: 2,
            id
        })

        return {
            call: Http({
                method: 'get',
                url: `${PATHS.PRIVATE}${URL}`,
                params: {
                    json
                },
                signal: controller.signal
            }),
            controller
        }
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

    async put(id: number, data: object) {
        const resultAxios = await Http({
            method: 'put',
            url: `${PATHS.PRIVATE}${URL}/${id}`,
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

export {
    orderService
}