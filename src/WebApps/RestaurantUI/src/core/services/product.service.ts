import { PATHS } from '@/core/constants';
import { Http, loadAbort } from '@/core/utilities';
import { ProductFilter } from '../models';

const URL = 'Articulo/'
export const ProductService = {
    getAll: (json: ProductFilter) => {
        const controller = loadAbort(); //Cancelar peticion 
        const query = JSON.stringify(json)

        return {
            call: Http({
                method: 'get',
                url: `${PATHS.INVENTARIO}${URL}Get`,
                params: {
                    json: query
                },
                signal: controller.signal
            }),
            controller
        }
    }, 
};
