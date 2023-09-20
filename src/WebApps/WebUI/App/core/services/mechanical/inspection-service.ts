import { client } from "$core/api/axiosClient.js";
let url = "Mechanical/Inspection/";

async function get(params) {
    return await client.get(`${url}?json=${params}`).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        return null;
    })
}

export const InspectionService = {
    get,
}