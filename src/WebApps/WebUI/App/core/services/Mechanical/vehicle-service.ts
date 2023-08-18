import { client } from "$core/api/axiosClient.js";
let url = "Mechanical/Vehicle/";

async function get(params) {
    return await client.get(`${url}?json=${params}`).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        return null;
    })
}

async function post(data) {
    return await client.post(url, data).then((response) => {
        let { status, data } = response;
        return { status, data };
    }, (err) => {
        let { status, data } = err.response;
        return { status, data };
    })
}

async function put(id, data) {
    return await client.put(url + id, data).then((response) => {
        let { status, data } = response;
        return { status, data };
    }, (err) => {
        let { status, data } = err.response;
        return { status, data };
    })
}

async function remove(id){
    return await client.delete(url + id).then((response) => {
        let { status, data } = response;
        return { status, data };
    }), (err) => {
        let { status, data } = err.response;
        return { status, data };
    }
}

export const VehicleService = {
    get,
    post,
    put,
    remove
}