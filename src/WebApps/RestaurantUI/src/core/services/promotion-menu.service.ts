
import { PATHS_API } from "../constants"
import { Http, loadAbort } from "../utilities"

const URL = 'PromotionMenu/'
export const promotionMenuService = {
    getById: (obj: {tipo:number, id:number}) => {
        const controller = loadAbort(); //Cancelar peticion 
        const json = JSON.stringify(obj)
        return {
            call: Http({
                method: 'get',
                url: `${PATHS_API.PRIVATE}${URL}GetById/${obj.id}`, 
                params:{
                    json
                },
                signal: controller.signal
            }),
            controller
        }
    }, 
}