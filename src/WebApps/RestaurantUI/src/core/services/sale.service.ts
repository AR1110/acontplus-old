import { categoryReadAdapter, decimalSaleReadAdapter, emissionPointAdapter, tableReadAdapter, taxAdapter, taxRateAdapter, warehouseAdapter } from "../adapters"
import { PATHS } from "../constants"
import { Http } from "../utilities"
 
const URL = 'Configuration'
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
            ptoEmi_Asig
        } = resultAxios.data;

        let categories = categoryReadAdapter(subCategorias || []); 
      
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
            emissionPoints: emissionPointAdapter(ptoEmi_Asig || [])
        }
    },

}