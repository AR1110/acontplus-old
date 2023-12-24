import { client } from "$utils/axiosClient.js";
let url = "Restaurant/Recipe/";


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

async function getByItem(id: number) {
    return await client.get(`${url}GetByItem/${id}`).then((response) => {
        if (response.status != 200) return null;

        return response.data;
    }).catch((error) => {
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
export const RecipeService = {
    get,
    getByItem,
    post,
}