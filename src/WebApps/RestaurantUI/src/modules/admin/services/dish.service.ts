import { PATHS } from '@/core/constants/path';
import { Http } from '@/core/utils';
import { InsertDishDto, ReadDishDto } from '../models';

const URL = 'Dishes/GetDishes';
export const DishSvc = {
  getAll: async () => {
    const query = JSON.stringify({
      pageIndex: 1,
      pageSize: 10,
    });

    const response = await Http({
      method: 'get',
      url: `${PATHS.PRIVATE}${URL}Get`,
      params: {
        json: query,
      },
    });

    if (response.code === '1') {
      const dishes = JSON.parse(response.payload);

      return dishes.map((item: ReadDishDto) => ({
        Id: item.Id,
        Product: item.Product,
        CreateAt: item.CreateAt,
        UpdateAt: item.UpdateAt,
        Enabled: item.Enabled,
        Deleted: item.Deleted,
        ProductionArea: item.ProductionArea,
      }));
    }
  },

  search: async (search: string) => {
    const query = JSON.stringify({
      pageIndex: 1,
      pageSize: 10,
    });

    const response = await Http({
      method: 'get',
      url: `${PATHS.PRIVATE}${URL}Get?search=${search}`,
      params: {
        json: query,
      },
    });

    if (response.code === '1') {
      const dishes = JSON.parse(response.payload);

      return dishes.map((item: ReadDishDto) => ({
        Id: item.Id,
        Product: item.Product,
        CreateAt: item.CreateAt,
        UpdateAt: item.UpdateAt,
        Enabled: item.Enabled,
        Deleted: item.Deleted,
        ProductionArea: item.ProductionArea,
      }));
    }
  },

  post: (data: InsertDishDto) => {
    return Http({
      method: 'post',
      url: `${PATHS.PRIVATE}${URL}Post`,
      data: data,
    });
  },

  update: (data: InsertDishDto) => {
    return Http({
      method: 'put',
      url: `${PATHS.PRIVATE}${URL}Put`,
      data: data,
    });
  },

  delete: (id: number) => {
    return Http({
      method: 'delete',
      url: `${PATHS.PRIVATE}${URL}Delete/${id}`,
    });
  }
};
