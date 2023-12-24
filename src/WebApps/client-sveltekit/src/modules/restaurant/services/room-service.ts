import { client } from "$utils/axiosClient";
const url = "Restaurant/Rooms/";


async function get() {
    return await client.get(url + "Get").then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        console.log(err)
        return null;
    });
}

async function getByCode(CodEstab: string) {
    return await client.get(url + "GetByCode/" + CodEstab).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        console.log(err)
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

export const roomService = {
    get,
    getByCode,
    post,
    put,
    remove
}