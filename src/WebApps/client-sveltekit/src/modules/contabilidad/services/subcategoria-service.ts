import { client } from "$utils/axiosClient.js";
const url = "Contabilidad/Subcategoria/";

async function get(params: any) {
    return await client.get(`${url}?json=${params}`).then((response: any) => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.log(response.status);
            return null;
        }
    }).catch((error) => {
        console.log(error.response)
        return null;
    })
}

async function post(data: any) {
    return await client.post(`${url}`, data).then((response: any) => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.log(response.status);
            return null;
        }
    }).catch((error) => {
        console.log(error.response)
        return null;
    })
}

export const SubcategoriaService = {
    get,
    post
}