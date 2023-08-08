import { PATHS } from '@/core/constants/path';
import { ApiResponse } from '@/core/models';
import { Http, loadAbort } from '@/core/utils';

const URL = 'ProductionAreas/';
export const ProductionAreaSvc = {
  getAll: () => {
    const controller = loadAbort();

    return {
      call: Http({
        method: 'get',
        url: `${PATHS.PRIVATE}${URL}`,
        signal: controller.signal,
      }),
      controller,
    };
  },

  post: async (data: any) => {
    console.log(data);
    const response = await Http({
      method: 'post',
      url: `${PATHS.PRIVATE}${URL}`,
      data,
    });
    console.log(response);
  },

  update: async (id: number, data: any): Promise<ApiResponse> => {
    const response = await Http({
      method: 'put',
      url: `${PATHS.PRIVATE}${URL}` + id,
      data,
    });
    console.log(response);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await Http({
      method: 'delete',
      url: `${PATHS.PRIVATE}${URL}` + id,
    });
    return response.data;
  },
};
