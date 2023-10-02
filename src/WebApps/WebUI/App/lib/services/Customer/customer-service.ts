import { client } from "$lib/utils/axiosClient";
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

async function getCedula(idCard) {
    return await client.get("Consultas/GetCedulaSri?Ruc=" + idCard).then(
        (response) => {
            if (response.status != 200) return null;
            return response.data;
        },
        (err) => {
            return null;
        }
    );
}

async function getRuc(idCard) {
    return await client.get("Consultas/GetRucSRI?Ruc=" + idCard).then(
        (response) => {
            if (response.status != 200) return null;
            return response.data;
        },
        (err) => {
            return null;
        }
    );
}

export const CustomerService = {
    search,
    getCedula,
    getRuc
}