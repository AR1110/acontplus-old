import { PATHS } from '@/core/constants/path';
import { Http } from '@/core/utils';
import { ProductReadDto } from '../models';

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

    if (response.code === '1') {
      const dishes = JSON.parse(response.payload);

      return dishes.map((item: ProductReadDto) => ({
         code: item.code,
         description: item.description,
         idProduct: item.idProduct,
         typeArticle: item.typeArticle,
         category: item.category,
         stock: item.stock,
      }));
    }
  },
};
