import { PATHS } from "../constants"
import { Http, loadAbort } from "../utilities"

const URL = 'Promotion/'
export const promotionService = {
    get: (obj:object) => {
        const controller = loadAbort(); //Cancelar peticion 
        const query = JSON.stringify(obj)

        return {
            call: Http({
                method: 'get',
                url: `${PATHS.PRIVATE}${URL}`,
                params: {
                    json: query
                },
                signal: controller.signal
            }),
            controller
        }
    }, 
}