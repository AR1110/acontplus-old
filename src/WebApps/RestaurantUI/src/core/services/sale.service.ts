import { PATHS } from "../constants"
import { Http, loadAbort } from "../utilities"

type tableSearch = {
    codEstab: string
}
const URL = 'Configuration'
export const SaleService = {
    getDataForForm: (json: string) => {
        const controller = loadAbort(); //Cancelar peticion  
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
}