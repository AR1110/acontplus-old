import { PATHS } from '@/core/constants/path';
import { Http, loadAbort } from '@/core/utilities'; 

const URL = 'SubFamilia/'
export const CategoryService = { 
  getAll: ()=> {
    const controller = loadAbort(); //Cancelar peticion 
    const query = JSON.stringify({
      pageIndex:1,pageSize:25,maxSize:5
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
