import {
    categoryReadAdapter,
    customerReadAdapter,
    decimalSaleReadAdapter,
    emissionPointAdapter,
    tableReadAdapter,
    taxAdapter,
    taxRateAdapter,
    warehouseAdapter,
} from "../adapters"

import { PATHS } from "../constants"
import { ConfigSistema, Floor, Room, Vendedor } from "../models";
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
            floor,
            customer,
            tarifaImpuestoVigente,
            config,
            vendedores, 
        } = resultAxios.data; 

        const rooms: Array<Room> = room;
        const floors: Array<Floor> = floor;
        const tarifaVigente = taxRateAdapter(tarifaImpuestoVigente);
       
        return {
            categories: categoryReadAdapter(subCategorias || []),
            decimal: decimalSaleReadAdapter(configDecimal[0]),
            tables: tableReadAdapter(table || []),
            taxes: taxAdapter(impuesto),
            taxRates: taxRateAdapter(tarifaImpuesto),
            warehouses: warehouseAdapter(bodega_Asign || []),
            emissionPoints: emissionPointAdapter(ptoEmi_Asig || []),
            rooms,
            floors,
            customer: customerReadAdapter(customer.length > 0 ? customer[0] : {}),
            tarifaImpuestoVigente: tarifaVigente[0]!,
            configSistema: config[0] as ConfigSistema,
            vendedores: vendedores as Vendedor[]
        }
    }
}