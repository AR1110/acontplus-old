import { client } from "$lib/utils/axiosClient";
let url = "Venta/Cliente/";


function getAll(params) {
    return client.get(`${url}Get?json=${JSON.stringify({ ...params, tipo: 1 })}`).then((responseAxios) => {
        const response = responseAxios.data;
        return JSON.parse(response.payload);
    })
}


function getDataForm() {
    return client.get(url + 'Get?json=' + JSON.stringify({ tipo: 2 })).then(responseAxios => {
        let response = responseAxios.data;
        let obj = {
            tipoIdentificacion: [],
            tipoContribuyentes: [],
            tiempoCreditos: [],
            ciudades: [],
            tiposCliente: [],
            empresas: [],
            cargos: [],
        }
        if (response.code === '0') {
            console.log(response.data)
            return obj;
        }
        if (response.code === '1') {
            let mainDataRepository = JSON.parse(response.payload)
            obj = {
                tipoIdentificacion: mainDataRepository[0],
                tipoContribuyentes: mainDataRepository[1],
                tiempoCreditos: mainDataRepository[2],
                ciudades: mainDataRepository[3],
                tiposCliente: mainDataRepository[4],
                empresas: mainDataRepository[5],
                cargos: mainDataRepository[6],
            }
        }
        return obj;
    }).catch(response => {
        throw response;
    })
}
async function search(params) {
    return await client.get(`${url}Search/?json=${params}`).then((responseAxios) => {
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
    getDataForm,
    getAll,
    search,
    getCedula,
    getRuc
}