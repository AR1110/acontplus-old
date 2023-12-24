import { client } from "$utils/axiosClient.js";
let url = "Config/PuntoEmision/";
async function get(params: any) {
    return await client.get(`${url}?json=${params}`).then((response: any) => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.log(response.status);
            return null;
        }
    }).catch((error) => {
        console.log(error.response)
        return null;
    })
}
export const PuntosEmision = {
    get: get,
}