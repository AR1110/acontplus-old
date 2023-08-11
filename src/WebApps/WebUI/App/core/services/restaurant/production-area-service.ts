import { client } from "../../api/axiosClient";
let url = "Restaurant/ProductionAreas/";

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
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            console.log(`Error request in post ${response}`);
            return null;
        }
    }).catch((err) => {
        console.log(`Error request ${err}`);
        return null;
    });
};

// Put
async function put(id, data) {
    return await client.put(url + id, data).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            console.log(`Error request in put ${response}`);
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
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            console.log(`Error request in delete ${response}`);
            return null;
        }
    }).catch((err) => {
        console.log(`Error request ${err}`);
        return null;
    });
}

export const productionAreaService = {
    get,
    post,
    put,
    remove
}