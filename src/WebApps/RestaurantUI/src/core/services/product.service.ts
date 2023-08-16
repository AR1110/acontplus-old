import { PATHS } from '@/core/constants/path';
import { Http, loadAbort } from '@/core/utilities';

const URL = 'Articulo/'
export const ProductService = {
    getAll: () => {
        const controller = loadAbort(); //Cancelar peticion 
        const query = JSON.stringify({
            tipo: 1,
            pageIndex: 1,
            pageSize: 50,
        })

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
    }
};
