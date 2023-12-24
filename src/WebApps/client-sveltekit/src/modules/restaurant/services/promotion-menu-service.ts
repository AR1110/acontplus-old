import { client } from "$utils/axiosClient.js";
const url = "Restaurant/PromotionMenu/";

async function get(id, params) {
    return await client.get(`${url}GetById/${id}?json=${params}`).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }).catch((error) => {
        console.log(error)
        return null;
    });
}

export const PromotionMenuService = {
    get
}