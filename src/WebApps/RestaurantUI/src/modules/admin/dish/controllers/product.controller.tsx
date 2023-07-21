import { Http } from '@/core/utils/http';

export const productController = {
  getAll: function () {
    return Http({
      method: 'get',
      url: `Inventario/v3/Articulo/Get?json=${JSON.stringify({
        tipo: 1,
        pageIndex: 1,
        pageSize: 10,
      })}`,
    });
  },

  findById: function (id: number) {
    return Http({
      method: 'get',
      url: `Tables/${id}`,
    });
  },

  search: function (query: string) {
    return Http({
      method: 'get',
      url: `Tables?query=${query}`,
    });
  },
};
