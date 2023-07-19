import { Http } from "@/core/utils";

// Doc: get all product
const getProduct  = () => {
  return Http({
    method: "get",
    url: "Articulo/Search?json={'busqueda': ''}",
  });
};

// Doc: get product by id
const getProductById = (id: number) => {
  return Http({
    method: "get",
    url: `Articulo/${id}`,
  });
};

// Doc: search product
const searchProduct = (search: string) => {
  return Http({
    method: "get",
    url: `Articulo/Search?json={'busqueda': '${search}'}`,
  });
};


export default { getProduct, getProductById, searchProduct };
