import { PATHS } from '@/core/constants/path';
import { Http } from '@/core/utils';
import { InsertDishDto } from '../models';

const URL = 'Dishes/';
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
    console.log(response);
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
    console.log(response);
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
