import {client} from "$core/api/axiosClient";
let url = "Venta/Cliente/Search/";

async function search(params) {
    return await client.get(`${url}?json=${params}`).then((responseAxios) => {
        const response = responseAxios.data;
        if (response.code == "1") {
            return JSON.parse(response.payload);
        }
    }, (err) => {
        return null;
    })
}

export const CustomerService = {
    search
}