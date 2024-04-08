import { PATHS_API } from '@/core/constants';
import { Http } from '@/core/utilities';
import { ApiResponse, Measure, ProductSaleReadDto } from '../models';

const URL = 'MenuItem/'
export const MenuItemService = {

    async get(menuId: number){
        
        const json = JSON.stringify({menuId})

        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS_API.PRIVATE}${URL}`,
            params: {
                json 
            }
        });

        const response: ApiResponse = resultAxios.data;
        console.log(response)                 
    }
}
