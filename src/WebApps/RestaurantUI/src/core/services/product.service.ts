import { PATHS } from '@/core/constants';
import { Http, loadAbort } from '@/core/utilities';
import { ApiResponse, Measure, ProductSaleReadDto } from '../models';
import { productSaleRateReadAdapter, productSaleReadAdapter } from '../adapters';

const URL = 'Articulo/'
export const ProductService = {

    async findForSale(productId: number, warehouseId: number){
        
        const json = JSON.stringify(Object.assign({
            idArticulo: productId,
            idBodega: warehouseId,
            tipo: 6
        }))

        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.INVENTARIO}${URL}Get`,
            params: {
                json 
            }
        });

        let response: ApiResponse = resultAxios.data;
        let product = {} as ProductSaleReadDto
        let measures: Array<Measure> = []
        
        if (response.code === '0') {
            throw response;
        }

        if(response.code==='1'){
            let repositoryData = JSON.parse(response.payload);
            let measureReposData = []
            
            let productReposData = repositoryData[0][0];

            if (repositoryData[1]) {
                measureReposData = repositoryData[1];
            } 
            
            product = productSaleReadAdapter(productReposData),
            measures = productSaleRateReadAdapter(measureReposData)
            
        }
        
        return {
            product,
            measures
        }  
    },
    async checkNotificationStock(obj: {idArticulo: number, cantidad: number, idBodega: number}):Promise<ApiResponse>{
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.INVENTARIO}${URL}Get`,
            params: {
                json: JSON.stringify(Object.assign(obj, { tipo: 7 }))
            }
        });

        let response: ApiResponse = resultAxios.data;
        
        if (response.code === '0') {
            throw response;
        }
        
        return JSON.parse(response.payload)[0][0];          
    }
};
