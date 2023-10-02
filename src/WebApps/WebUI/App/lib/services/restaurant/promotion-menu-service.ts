import { client } from "$lib/utils/axiosClient.js";
let url = "Restaurant/PromotionMenu/";

async function get(id, params) {
    return await client.get(`${url}GetById/${id}?json=${params}`).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }).catch((error) => {
        return null;
    });
}

export const PromotionMenuService = {
    get
}