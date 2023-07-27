import { PATHS } from "@/core/constants/path";
import { Http } from "@/core/utils";
import { IProductView, ProductResponseFromApi } from "../models";

const URL = 'v3/Articulo'

const ProductSvc = {
	getAll: async (): Promise<IProductView[]> => {

		const json = JSON.stringify({
			tipo: 1, pageIndex: 1, pageSize: 50      	      		
		});
		
		const response = await Http({
			method: "get",
			url: `${PATHS.INVENTARIO}${URL}`,
			params: {
				json
			}
		}) 
		if (response.code === "1") {
			const articulosApi: ProductResponseFromApi = JSON.parse(response.payload)[0];
			return articulosApi.map((product) => ({
				idProduct: product.idArticulo,
				code: product.codigo,
				description: product.descripcion,
				typeArticle: product.tipoArticulo,
				category: product.subFamilia,
				stock: product.stock,
			}));
		}
    return [];
	},
	getDataForm: async() => {
		const params = {
			json: JSON.stringify({
				tipo: 8
			})
		}
		const response = await Http({
			method: 'get',
			url: `${PATHS.INVENTARIO}${URL}`,
			params
		})
		const dataApi = JSON.parse(response.payload);
		// const familias = dataApi[0];
		const categories = dataApi[1]; //subfamilias
		const measures = dataApi[2]; //medidas
		const vatRates = dataApi[3]; //tipos iva
		const saleFees = dataApi[4]; //tarifas
		return {
			categories,
			measures,
			vatRates,
			saleFees
		} 
	},
  insert: () => {
    return Http({
      method: "post",
      url: PATHS.PRIVATE + "Articulo",
    });
  },
  update: () => {
    return Http({
      method: "put",
      url: PATHS.PRIVATE + "Articulo",
    });
  },
};

export default ProductSvc;
