import { client } from "@/lib/utils/axiosClient.js";
let url = "Mechanical/Support/";

async function get(params) {
    return await client.get(`${url}?json=${params}`).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        return null;
    })
}

async function post(data) {
    return await client.post(url, data).then((responseAxios) => {
        if (responseAxios.status == 200) return { code: responseAxios.data.code, message: responseAxios.data.message };
        else return { code: 0, message: responseAxios.status }
    }, (err) => {
        return { code: 0, message: err.status }
    })
}

async function put(id, data) {
    return await client.put(url + id, data).then((responseAxios) => {
        if (responseAxios.status == 200) return { code: responseAxios.data.code, message: responseAxios.data.message };
        else return { code: 0, message: responseAxios.status }
    }, (err) => {
        return { code: 0, message: err.status }
    })
}

async function remove(id) {
    return await client.delete(url + id).then((response) => {
        if (response.status == 200)
            return {
                code: response.data = true ? "1" : "0",
                message: response.data = true ? "Eliminado Correctamente" : "No se pudo Eliminar"
            };
        else return { code: 0, message: response.data }
    }, (err) => {
        return { code: 0, message: err.status }
    })
}

export const SupportService = {
    get,
    post,
    put,
    remove
}