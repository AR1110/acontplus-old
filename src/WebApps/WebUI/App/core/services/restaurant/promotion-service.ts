import { client } from "$core/api/axiosClient.js";
let url = "Restaurant/Promotion/";

async function get(params) {
    return await client.get(`${url}?json=${params}`).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }).catch((error) => {
        return null;
    });
}
async function post(data) {
    return await client.post(`${url}`, data).then((response) => {
        let { status, data } = response;
        return { status, data };
    }).catch((error) => {
        let { status, data } = error.response;
        return { status, data };
    });
}

async function put(id, data) {
    return await client.put(`${url + id}`, data).then((response) => {
        let { status, data } = response;
        return { status, data };
    }).catch((error) => {
        let { status, data } = error.response;
        return { status, data };
    });
}

export const PromotionService = {
    get,
    post,
    put,
}