import { client } from "../../api/axiosClient";
let url = "Restaurant/Floor/";

async function get() {
    return await client.get(url).then((response) => {
        if (response.status === 200) {
            return response;
        } else {
            console.log(response);
            return null;
        }
    }).catch((err) => {
        console.log(err);
        return null;
    });
}

// Post
async function post(data) {
    return await client.post(url, data).then((response) => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.log(response);
            return null;
        }
    }).catch((err) => {
        console.log(err);
        return null;
    });
};

// Put
async function put(id, data) {
    return await client.put(url + id, data).then((response) => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.log(response);
            return null;
        }
    }).catch((err) => {
        console.log(err);
        return null;
    });
};

// Delete
async function remove(id) {
    return await client.delete(url + id).then((response) => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.log(response);
            return null;
        }
    }).catch((err) => {
        console.log(err);
        return null;
    });
}

export const floorService = {
    get,
    post,
    put,
    remove
}