
import { PATHS } from "../constants"
import { Http, loadAbort } from "../utilities"

const URL = 'PromotionMenu/'
export const promotionMenuService = {
    getById: (id: number) => {
        const controller = loadAbort(); //Cancelar peticion 
        
        return {
            call: Http({
                method: 'get',
                url: `${PATHS.PRIVATE}${URL}GetById/${id}`, 
                signal: controller.signal
            }),
            controller
        }
    }, 
}