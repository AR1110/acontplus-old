import { 
    categoryReadAdapter, 
    decimalSaleReadAdapter, 
    emissionPointAdapter, 
    tableReadAdapter, 
    taxAdapter, 
    taxRateAdapter, 
    warehouseAdapter,   
 } from "../adapters"

import { PATHS } from "../constants"
import { Floor, Room } from "../models";
import { Http } from "../utilities"
 
const URL = 'Configuration'; 
export const SaleService = {
    async getDataForForm(json: string) {
        const resultAxios = await Http({
                method: 'get',
                url: `${PATHS.PRIVATE}${URL}`,
                params: {
                    json
                }        
        }) 
        const { 
            subCategorias, 
            configDecimal, 
            table, 
            impuesto, 
            tarifaImpuesto, 
            bodega_Asign,
            ptoEmi_Asig, 
            room,
            floor
        } = resultAxios.data; 
        const categories = categoryReadAdapter(subCategorias || []); 
        const rooms: Array<Room> = room;
        const floors: Array<Floor> = floor;
        console.log(impuesto)
        console.log(tarifaImpuesto)
        return{
            categories: [{
                idSubFamilia: 0,
                description: 'Todos',
                s3ObjectUrl: ''
            }, ...categories], 
            decimal: decimalSaleReadAdapter(configDecimal[0]),
            tables: tableReadAdapter(table || []),
            taxes: taxAdapter(impuesto),
            taxRates: taxRateAdapter(tarifaImpuesto), 
            warehouses: warehouseAdapter(bodega_Asign || []),
            emissionPoints: emissionPointAdapter(ptoEmi_Asig || []),  
            rooms,
            floors
        }
    }
}