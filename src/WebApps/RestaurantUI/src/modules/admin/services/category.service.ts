import { PATHS } from '@/core/constants/path';
import { Http } from '@/core/utils';

export const CategorySvc = {
  getAll: () => {
    return Http({
      method: 'get',
      url: `Inventario/v3/SubFamilia/Get?json=${JSON.stringify({
        pageIndex: 1,
        pageSize: 2,
      })}`,
    });
  },

  post: (data: any) => {
    return Http({
      method: 'post',
      url: `Inventario/v3/SubFamilia/Post`,
      data: data,
    });
  },

  // insert: () => {
  //   return Http({
  //     method: 'post',
  //     url: PATHS.PRIVATE + 'Category',
  //   });
  // },
  update: () => {
    return Http({
      method: 'put',
      url: PATHS.PRIVATE + 'Category',
    });
  },
};
