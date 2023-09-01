import { PATHS } from "@/core/constants"
import { Http } from "@/core/utilities"
import { ApiResponse, CustomerCreateDto } from "@/core/models"
import { customerReadAdapter, dataFormReadAdapter } from "../adapters"

const URL = 'Cliente/'
const CustomerService = {
    async getDataForm(){
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.SALE}${URL}Get`,
            params: {
                json: JSON.stringify({tipo: 2})
            }
        }) 
        const response: ApiResponse = resultAxios.data;
        const mainDataRepository = JSON.parse(response.payload)   
        
        const obj =  {
            tipoIdentificacion: mainDataRepository[0],
            tipoContribuyentes: mainDataRepository[1],
            tiempoCreditos: mainDataRepository[2], 
        }  
        const dataForm =  dataFormReadAdapter(obj);
        return dataForm;
         
    },
    async post(data: CustomerCreateDto){
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.SALE}${URL}Insert`,
            data
        }) 
        const response: ApiResponse = resultAxios.data;
        
        console.log(response)
    },
    search: async (textSearch: string) => {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.SALE}${URL}Search`,
            params: {
                json: JSON.stringify({textSearch})
            }
        }) 
        const response: ApiResponse = resultAxios.data;
        return customerReadAdapter(JSON.parse(response.payload) || [])        
    }


    
}

export {
    CustomerService
}