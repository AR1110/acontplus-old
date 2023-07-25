import { PATHS } from "@/core/constants/path";
import { Http } from "@/core/utils";
import { IProductView, ProductResponseFromApi } from "../models";

const ProductSvc = {
  getAll: async (): Promise<IProductView[]> => {
    const response = await Http({
      method: "get",
      url: `${PATHS.INVENTARIO}v3/Articulo`,
      params: {
        json: JSON.stringify({
          tipo: 1,
          pageIndex: 1,
          pageSize: 10,
        }),
      },
    });
    if (response.code === "0") {
      return [];
    }
    if (response.code === "1") {
      const articulosApi: ProductResponseFromApi = JSON.parse(
        response.payload
      )[0];
      return articulosApi.map((product) => ({
        idProduct: product.idArticulo,
        code: product.codigo,
        description: product.descripcion,
        typeArticle: product.tipoArticulo,
        category: product.subFamilia,
        stock: product.stock,
      }));
    }
    return [];
  },
  insert: () => {
    return Http({
      method: "post",
      url: PATHS.PRIVATE + "Articulo",
    });
  },
  update: () => {
    return Http({
      method: "put",
      url: PATHS.PRIVATE + "Articulo",
    });
  },
};

export default ProductSvc;
