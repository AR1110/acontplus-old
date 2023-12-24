import { client } from "$utils/axiosClient.js";
let url = "Restaurant/Menu/";
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
        let { status, data } = response;
        return { status, data };
    }).catch((error) => {
        let { status, data } = error.response;
        return { status, data };
    })
}

async function put(id: number, data: any) {
    return await client.put(`${url + id}`, data).then((response: any) => {
        let { status, data } = response;
        return { status, data };
    }).catch((error) => {
        let { status, data } = error.response;
        return { status, data };
    })
}

export const MenuService = {
    get,
    post,
    put,
}