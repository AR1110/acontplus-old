import { client } from "../../api/axiosClient";
let url = "Restaurant/Tables/";

async function get() {
    return await client.get(url).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (error) => {
        return null;
    });
}

// Post
async function post(data) {
    return await client.post(url, data).then((response) => {
        let { status, data } = response;
        return { status, data };
    }, (error) => {
        let { status, data } = error.response;
        return { status, data };
    });
};

// Put
async function put(id, data) {
    return await client.put(url + id, data).then((response) => {
       let { status, data } = response;
         return { status, data };
    }, (error) => {
        let { status, data } = error.response;
        return { status, data };
    });
};

// Delete
async function remove(id) {
    return await client.delete(url + id).then((response) => {
        let { status, data } = response;
        return { status, data };
    }, (error) => {
        let { status, data } = error.response;
        return { status, data };
    });
}

export const tableService = {
    get,
    post,
    put,
    remove
}