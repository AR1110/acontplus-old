import { Http } from '@/core/utils/http';

export const productController = {
  getAll: function () {
    return Http({
      method: 'get',
      url: 'Articulo/Search?json={"busqueda": ""}',
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
