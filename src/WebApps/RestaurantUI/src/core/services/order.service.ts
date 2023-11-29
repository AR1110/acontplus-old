import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http, loadAbort } from "../utilities"

const URL = 'Order'
const orderService = {
    async get(obj: object, cancelToken?:any) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.PRIVATE}${URL}`,
            params: {
                json: JSON.stringify(obj)
            },
            cancelToken: cancelToken
        })
        const response = resultAxios.data;
        return response;
    },

    getId(id: number, tipo = 2) {
        const controller = loadAbort(); //Cancelar peticion 
        const json = JSON.stringify({
            tipo,
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
    // async getDataFilter() {
    //     const resultAxios = await Http({
    //         method: 'get',
    //         url: `${PATHS.PRIVATE}${URL}`,
    //         data: { 
    //             json: JSON.stringify({tipo: 4})
    //          }
    //     })

    //     const response: ApiResponse = resultAxios.data;
    //     console.log(response)
    //     return response;
    // },
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
        console.log(data)
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

    async delete(id: number) {
        const resultAxios = await Http({
            method: 'delete',
            url: `${PATHS.PRIVATE}${URL}/${id}`,
             
        })

        const response: ApiResponse = resultAxios.data;
        return response;
    },

}

export {
    orderService
}