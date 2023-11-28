import { PATHS } from '@/core/constants';
import { Http, loadAbort } from '@/core/utilities';
import { ApiResponse, ConsolidacionFecha, Measure, ProductSaleReadDto } from '../models';
import { productSaleRateReadAdapter, productSaleReadAdapter } from '../adapters';

const URL = 'Articulo/'
export const productService = {

    async findForSale(productId: number, warehouseId?: number){
        
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
        let measures: Array<Measure> = [];
        let consolidacionesFecha: Array<ConsolidacionFecha> = [];

        
        if (response.code === '0') {
            throw response;
        }

        if(response.code==='1'){
            const repositoryData = JSON.parse(response.payload);
            const productReposData = repositoryData[0][0];
            
            // const productReposData = repositoryData[0][0];
            // const measureReposData = repositoryData[1];
            product = productSaleReadAdapter(productReposData);
            
            // Medidas del artículo fraccionado del principal
            const medidasFraccionadoTemp = repositoryData[1];
            
            // Medida principal con las tarifas
            const medidasPrincipalTemp = repositoryData[2];
            
            consolidacionesFecha = repositoryData[3] || []
            // Combinar los dos arrays de medidas en uno solo
            const mergedMedidasArray = [...medidasFraccionadoTemp, ...medidasPrincipalTemp];

            /**
             * Ordenar el array de medidas en función de la propiedad "orden" y 
             * establecer la propiedad "defaultMedida" en falso para todos los elementos 
             * */
            const orderMedidaArray = mergedMedidasArray.sort((a, b) => a.orden - b.orden).map(medida => ({
                ...medida,
                defaultMedida: false
            }))
            // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
            orderMedidaArray[0].defaultMedida = true;

            measures = productSaleRateReadAdapter(orderMedidaArray)      
            // Crear un nuevo array de medidas con un formato específico
            // const medidas = orderMedidaArray.map(item => ({
            //     idMedida: item.idMedida,
            //     conversion: item.conversion,
            //     descripcion: item.descripcion,
            //     defaultMedida: item.defaultMedida,
            //     tarifas: JSON.parse(item.tarifas)
            // }))   
            
            consolidacionesFecha = consolidacionesFecha.map(data=>{
                return {
                    ...data,
                    fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                }
            })
            
        }
        
        return {
            product,
            measures,
            consolidacionesFecha
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
    },
    search(obj:{ busqueda: string}){
        const controller = loadAbort(); //Cancelar peticion 
    
        return {
            call: Http({
                method: 'get',
                url: `${PATHS.INVENTARIO}${URL}Search`,
                params: {
                    json: JSON.stringify(obj)
                },
                signal: controller.signal
            }),
            controller
        }
    }
};
