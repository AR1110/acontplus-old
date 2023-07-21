import { Http } from "@/core/utils/http";

export const productController = {
  getAll: function () {
    return Http({
      method: "get",
      url: "Inventario/api/Articulo/Get",
      params: {
        json: JSON.stringify({
          pageSize: "1",
          tipo: "1",
        }),
      },
    });
  },

  findById: function (id: number) {
    return Http({
      method: "get",
      url: `Tables/${id}`,
    });
  },

  search: function (query: string) {
    return Http({
      method: "get",
      url: `Tables?query=${query}`,
    });
  },
};
