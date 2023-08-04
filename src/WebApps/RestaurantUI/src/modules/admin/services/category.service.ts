import { PATHS } from '@/core/constants/path';
import { Http, HttpUploadFile, loadAbort } from '@/core/utils';
import { ApiResponse } from '@/core/models';

const URL = 'v3/SubFamilia/'
export const CategorySvc = { 
  getAll: ()=> {
    const controller = loadAbort(); //Cancelar peticion 
    const query = JSON.stringify({
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
  },

  post: async (data: any) => {

    console.log(data)

    const response = await Http({
      method: 'post',
      url: `${PATHS.INVENTARIO}${URL}Post`,
      data
    });

    console.log(response); 
  },

  // insert: () => {
  //   return Http({
  //     method: 'post',
  //     url: PATHS.PRIVATE + 'Category',
  //   });
  // },
  update: async (id: number, data: any): Promise<ApiResponse> => {
    const response = await Http({
      method: 'put',
      url: `${PATHS.INVENTARIO}${URL}Update/` + id, 
      data: { 
          Data: data
        
      }
    });
    return response.data; 
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
