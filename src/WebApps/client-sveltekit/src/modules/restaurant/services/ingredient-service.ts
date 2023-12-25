import { client } from "$utils/axiosClient.js";
const url = "Restaurant/Ingredient/";
async function get(params: any) {
    return await client.get(`${url}?json=${params}`).then((response: any) => {
        if (response.status != 200) return null;
        return response.data;
    }).catch((error) => {
        console.log(error)
        return null;
    })
}
async function post(data: any) {
    return await client.post(`${url}`, data).then((response: any) => {
        let { status, data } = response;
        return { status, data };
    }).catch((error) => {
        let { status, data } = error.response;
        return { status, data };
    })
}

async function put(id: any, data: any) {
    return await client.put(`${url}${id}`, data).then((response: any) => {
        let { status, data } = response;
        return { status, data };
    }).catch((error) => {
        let { status, data } = error.response;
        return { status, data };
    })
}

export const IngredientService = {
    get,
    post,
    put
}