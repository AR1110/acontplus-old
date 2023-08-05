import { PATHS } from '@/core/constants/path';
import { Http, HttpUploadFile, loadAbort } from '@/core/utils';
import { TableCreateDto, TableUpdateDto } from '../models';
import { ApiResponse } from '@/core/models';

const URL = 'Tables/'
export const TableSvc = { 
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

  insert: async (data: TableCreateDto) => { 

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
  update: async (id: number, data: TableUpdateDto)=> {
     
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
  },

  imageUpload: async(data: any) => {
    const response = await HttpUploadFile({
      method: 'post',
      url: `${PATHS.INVENTARIO}${URL}Post`,
      data
    });

    console.log(response);
  }
};
