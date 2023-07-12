import { Http } from "@/core/utils";

const getRecipes = () => {
  return Http({
    method: "get",
    url: "Recipe",
  }).then((response) => {
    console.log(response);
    return response.payload;
  });
};

export default { getRecipes };
