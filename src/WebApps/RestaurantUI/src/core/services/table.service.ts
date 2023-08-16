import { PATHS } from "../constants"
import { Http, loadAbort } from "../utilities"

type tableSearch = {
    codEstab: string
}
export const TableService = {
    getAll: () => {
        const controller = loadAbort(); //Cancelar peticion 
        const query = JSON.stringify({})

        return {
            call: Http({
                method: 'get',
                url: `${PATHS.PRIVATE}${URL}Get`,
                params: {
                    json: query
                },
                signal: controller.signal
            }),
            controller
        }
    }, 
}