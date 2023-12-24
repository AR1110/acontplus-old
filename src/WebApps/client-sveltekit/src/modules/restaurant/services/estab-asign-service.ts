import { client } from "$utils/axiosClient";
const url = "Config/EstabAsig/";

async function get(params: any) {
    return await client.get(`${url}?json=${params}`).then((response) => {
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }).catch((err) => {
        console.log(err)
        return null;
    });
}

export const estabAsignService = {
    get
}