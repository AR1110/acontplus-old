import { client } from "../api/axiosClient.js";
let url = "Inventario/Articulo/";
async function search(params: any) {
    return await client.get(`${url}Search?json=${params}`).then((response: any) => {
        console.log(response);
        return response.data;
    }).catch((error) => {
        console.log(error.response)
        return null;
    })
}
export const Articulos = {
    search,
}
