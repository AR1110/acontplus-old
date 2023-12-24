import { client } from "$utils/axiosClient";
const url = "Inventario/SubFamilia/";

async function get(json: string) {
    return await client.get(`${url}Get?json=${json}`).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        console.log(err)
        return null;
    });
}

export const SubFamiliaService = {
    get
}