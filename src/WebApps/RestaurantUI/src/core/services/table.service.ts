import { PATHS } from "../constants/path";
import { Http } from "../utils";

export const TableService = {
  get: (query: string) => {
    return Http({
      method: "get",
      url: PATHS.PRIVATE + "Table",
    });
  },
};
