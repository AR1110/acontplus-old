import { PATHS } from "@/core/constants/path"
import { Http } from "@/core/utilities"
import { ApiResponse } from "@/core/models"
import { customerReadAdapter } from "../adapters"

const URL = 'Cliente/'
const CustomerService = {
    search: async (textSearch: string) => {
        const resultAxios = await Http({
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