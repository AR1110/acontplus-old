import { PATHS } from "@/core/constants/path";
import { Http } from "@/core/utils";

export const FloorSvc = {
  getAll: () => {
    return Http({
      method: "get",
      url: PATHS.PRIVATE + "Floor",
    });
  },
  insert: () => {
    return Http({
      method: "post",
      url: PATHS.PRIVATE + "Floor",
    });
  },
  update: () => {
    return Http({
      method: "put",
      url: PATHS.PRIVATE + "Floor",
    });
  },
};
