import { PATHS } from '@/core/constants/path';
import { Http, loadAbort } from '@/core/utils';
import { ItemCreateDto, ItemUpdateDto} from '../models';
import { ApiResponse } from '@/core/models';

const URL = 'Item/'
export const ItemSvc = { 
  getAll: ()=> {
    const controller = loadAbort(); //Cancelar peticion 
    const query = JSON.stringify({
      pageIndex: 1,
      pageSize: 50,
    })
 
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

  insert: async (data: ItemCreateDto) => { 

    const resultAxios = await Http({
      method: 'post',
      url: `${PATHS.PRIVATE}${URL}`,
      data: {
        Data: data
      }
    });
    const response: ApiResponse = resultAxios.data;
    return response;
    
  }, 
  update: async (id: number, data: ItemUpdateDto)=> {
     
    const resultAxios = await Http({
      method: 'put',
      url: `${PATHS.PRIVATE}${URL}` + id, 
      data: { 
          Data: data
        
      }
    });
    return resultAxios.data as ApiResponse;    
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await Http({
      method: 'delete',
      url: `${PATHS.INVENTARIO}${URL}Delete/` + id,
    });
    return response.data; 
  }
};
