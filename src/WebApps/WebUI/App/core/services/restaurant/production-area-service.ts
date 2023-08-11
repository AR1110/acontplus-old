import { client } from "../../api/axiosClient";
let url = "Restaurant/ProductionAreas/";

async function get() {
    return await client.get(url).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        return null;
    });
}

// Post
async function post(data) {
    return await client.post(url, data).then((response) => {
        let { status, data } = response;
        return { status, data };
    }, (err) => {
        let { status, data } = err.response;
        return { status, data };
    });
};

// Put
async function put(id, data) {
    return await client.put(url + id, data).then((response) => {
        let { status, data } = response;
        return { status, data };
    }, (err) => {
        let { status, data } = err.response;
        return { status, data };
    });
};

// Delete
async function remove(id) {
    return await client.delete(url + id).then((response) => {
        let { status, data } = response;
        return { status, data };
    }, (err) => {
        let { status, data } = err.response;
        return { status, data };
    });
}

export const productionAreaService = {
    get,
    post,
    put,
    remove
}