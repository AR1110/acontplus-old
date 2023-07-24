import { PATHS } from "@/core/constants/path";
import { Http } from "@/core/utils";

export const ProductSvc = {
  getAll: () => {
    return Http({
      method: "get",
      url: PATHS.PRIVATE + "Articulo",
    });
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
