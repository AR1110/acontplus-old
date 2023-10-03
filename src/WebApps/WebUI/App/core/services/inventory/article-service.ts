import { client } from "$core/api/axiosClient";
let url = "Inventario/Articulo/";


async function get(params) {
    return await client.get(`${url}Get?json=${params}`).then((responseAxios) => {
        const response = responseAxios.data;
        if (response.code == "1") {
            return JSON.parse(response.payload);
        }
    }, (err) => {
        return null;
    })
}

async function search(params) {
    return await client.get(`${url}Search?json=${params}`).then((responseAxios) => {
        const response = responseAxios.data;
        if (response.code == "1") {
            return JSON.parse(response.payload);
        }
    }, (err) => {
        return null;
    })
}

function getDataForm(obj: { tipo: 1 | 5 })  {
    return client.get(`${url}Get?json=${JSON.stringify(obj)}`).then(responseAxios => {
        let response = responseAxios.data;
        let obj = {
            subfamilias: []
        }
        if (response.code === "1") {
            let mainData = JSON.parse(response.payload);
            let tempSubfamilias = mainData[2];
            obj.subfamilias = tempSubfamilias.map(subfamilia => {
                return {
                    idSubFamilia: subfamilia.idSubFamilia,
                    siglas: subfamilia.siglas,
                    descripcion: subfamilia.subFamilia
                }
            })
        } else {
            console.log(response.data)
        }
        return obj;
    })
}

export const ArticleService = {
    search,
    getDataForm
}