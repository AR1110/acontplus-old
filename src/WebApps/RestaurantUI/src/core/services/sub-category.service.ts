import { POSHttp } from "@/core/utils";

const getAll = (query: string) => {
  return POSHttp({
    method: "get",
    url: "subFamilia" + JSON.stringify(query),
  });
};

export { getAll };
