import { PATHS } from "@/core/constants/path";
import { Http } from "@/core/utils/http";

export const tableSvc = {
  getAll: function (query?: string) {
    console.log(query);
    return Http({
      method: "get",
      url: PATHS.PRIVATE + "Tables",
      params: {
        json: JSON.stringify({ codEstab: "ESTAB-000000117" }),
      },
    });
  },
  findById: function (id?: number) {
    console.log(id)
    return Http({
      method: "get",
      url: PATHS.PRIVATE + "Table",
    });
  },
};
