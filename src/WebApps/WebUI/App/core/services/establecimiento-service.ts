import { client } from "../api/axiosClient.js";
import type { StructureResponse } from "../interfaces/structure-response.js";
let url = "Config/EstabAsig/";

async function get(params: any) {
    return await client.get(`${url}?json=${params}`).then((response: StructureResponse) => {
        return response
    }).catch((error) => {
        console.log(error)
        return {
            status: error.status,
            data: error.response
        }
    })
}
export const Estabs = {
    get: get,
}

