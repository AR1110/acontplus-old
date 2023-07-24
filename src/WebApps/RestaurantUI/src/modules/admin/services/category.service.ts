import { PATHS } from "@/core/constants/path";
import { Http } from "@/core/utils";

export const CategorySvc = {
  getAll: () => {
    return Http({
      method: "get",
      url: PATHS.PRIVATE + "Category",
    });
  },
  insert: () => {
    return Http({
      method: "post",
      url: PATHS.PRIVATE + "Category",
    });
  },
  update: () => {
    return Http({
      method: "put",
      url: PATHS.PRIVATE + "Category",
    });
  },
};
