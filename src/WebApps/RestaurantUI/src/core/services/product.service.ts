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
            tipo: 10
        }))

        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.INVENTARIO}${URL}Get`,
            params: {
                json 
            }
        });

        const response: ApiResponse = resultAxios.data;
        let product = {} as ProductSaleReadDto
        let measures: Array<Measure> = []
        
        if (response.code === '0') {
            throw response;
        }

        if(response.code==='1'){
            const repositoryData = JSON.parse(response.payload);
            console.log(repositoryData) 
            const productReposData = repositoryData[0][0];
            const measureReposData = repositoryData[1];
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

        const response: ApiResponse = resultAxios.data;
        
        if (response.code === '0') {
            throw response;
        }
        
        return JSON.parse(response.payload)[0][0];          
    }
};
