import { PATHS } from '@/core/constants/path';
import { Http } from '@/core/utils';

const URL = 'v3/Articulo';
export const DishSvc = {
  getAll: async () => {
    const query = JSON.stringify({
      pageIndex: 1,
      pageSize: 2,
    });

    const response = await Http({
      method: 'get',
      url: `${PATHS.INVENTARIO}${URL}Get`,
      params: {
        json: query,
      },
    });

   if(response.code === "1") {

   }
  },
};
