import { ApiCategoryAdapter } from "../adapters";
import { ApiCategory, Category } from "../models";
import { POSHttp } from "@/core/utils";

const getAll = (): Promise<Category[]> => {
  return POSHttp({ method: "get", url: "categories" }).then((response) => {
    return response.map((category: ApiCategory) =>
      ApiCategoryAdapter(category)
    );
  });
};

export default {
  getAll,
};
