import { PATHS_API } from "../constants"
import { Http, loadAbort } from "../utilities"

// type tableSearch = {
//     codEstab: string
// }
 
const url = 'Tables/'
export const tableService = {
    getAll: () => {
        const controller = loadAbort(); //Cancelar peticion 
        const query = JSON.stringify({})

        return {
            call: Http({
                method: 'get',
                url: `${PATHS_API.PRIVATE}${URL}Get`,
                params: {
                    json: query
                },
                signal: controller.signal
            }),
            controller
        }
    }, 
    async putStateAssigned(id:number, data: object){
        const responseAxios = await Http({
            method: 'put',
            url: `${PATHS_API.PRIVATE}${url}${id}`,
            data, 
        })        
        return responseAxios;
    }
}