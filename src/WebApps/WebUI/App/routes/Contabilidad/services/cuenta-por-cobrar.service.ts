import { client } from '$lib/utils/axiosClient';
const URL = 'Contabilidad/CuentaPorCobrar/'

export const cuentaPorCobrarService = {
    get<T extends {tipo:number}>(params:T){
        return client.get(`${URL}?json=${JSON.stringify(params)}`).then((response) => {
            console.log(response)
        }) 
    }
}