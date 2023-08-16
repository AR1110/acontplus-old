


import { Http, loadAbort } from '@/core/utilities';
import { ItemSearch } from '../models';
import { PATHS } from '../constants';

const URL = 'Item/'
export const ItemService = {
    getAll: (objSearch: ItemSearch) => {
        const controller = loadAbort(); //Cancelar peticion 
        const json = JSON.stringify(objSearch)

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
};
