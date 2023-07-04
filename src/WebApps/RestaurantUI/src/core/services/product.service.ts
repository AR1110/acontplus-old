import { ApiProductAdapter } from "../adapters";
import { ApiProduct, Product } from "../models";
import { POSHttp } from "@/core/utils";

const getProducts = (categoryId: number): Promise<Array<Product>> => {
  return POSHttp({
    method: "get",
    url: "products/?categoryId=" + categoryId,
  }).then((response) => {
    return response.data.map((product: ApiProduct) => ApiProductAdapter(product));
  });
};

export default { getProducts };
