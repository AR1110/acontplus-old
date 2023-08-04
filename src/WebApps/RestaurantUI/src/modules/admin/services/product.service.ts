import { PATHS } from "@/core/constants/path";
import { Http } from "@/core/utils";
import { ProductResponseFromApi } from "../models";
import { ApiResponse } from "@/core/models";
 

const URL = 'v3/Articulo'

export const ProductSvc = {
	getAll: async () => {

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
		
		const resultData: ApiResponse = response.data;
		const articulosApi: ProductResponseFromApi = JSON.parse(resultData.payload)[0];
		return articulosApi.map((product) => ({
			idProduct: product.idArticulo,
			code: product.codigo,
			description: product.descripcion,
			typeArticle: product.tipoArticulo,
			category: product.subFamilia,
			stock: product.stock,
		})); 
	},
	getDataForm: async() => {
		const params = {
			json: JSON.stringify({
				tipo: 8
			})
		}
		const resultAxios = await Http({
			method: 'get',
			url: `${PATHS.INVENTARIO}${URL}`,
			params
		})

		const response: ApiResponse = resultAxios.data;
		const dataApi = JSON.parse(response.payload); 
		
		const decimalInventory = dataApi[0][0];
		console.log(decimalInventory)
		//const familias = dataApi[1];
		const categories = dataApi[2]; //subfamilias
		const measures = dataApi[3]; //medidas
		const vatRates = dataApi[4]; //tipos iva
		const saleFees = dataApi[5]; //tarifas
		return {
			decimalInventory: {
				nroPrecio: Number(decimalInventory.nroPrecio),
			},
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

