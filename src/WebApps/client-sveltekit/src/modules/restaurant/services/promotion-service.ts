import { client } from "$utils/axiosClient.js";
const url = "Restaurant/Promotion/";

async function get(params) {
    return await client
        .get(`${url}?json=${params}`)
        .then((response) => {
            if (response.status != 200) return null;
            return response.data;
        })
        .catch((error) => {
            console.log(error)
            return null;
        });
}

// Client for post method file
async function post(data, file) {
    return await client
        .post(`${url}?json=${data}`, { file: file }, { headers: { "Content-Type": "multipart/form-data" } })
        .then((response) => {
            let { status, data } = response;
            return { status, data };
        })
        .catch((error) => {
            let { status, data } = error.response;
            return { status, data };
        });
}

async function put(id, data, file) {
    return await client
        .put(`${url + id}/?json=${data}`, { file: file }, { headers: { "Content-Type": "multipart/form-data" } })
        .then((response) => {
            let { status, data } = response;
            return { status, data };
        })
        .catch((error) => {
            let { status, data } = error.response;
            return { status, data };
        });
}

export const PromotionService = {
    get,
    post,
    put,
};
