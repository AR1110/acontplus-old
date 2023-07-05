import { POSHttp } from "@/core/utils";
import { PayloadResponse } from "../models";

const getRecipes = (): Promise<PayloadResponse> => {
  return POSHttp({
    method: "get",
    url: "Recipe",
  }).then((response) => {
    console.log(response);
    return response.data;
  });
};

export default { getRecipes };
