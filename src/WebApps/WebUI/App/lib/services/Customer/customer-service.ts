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
            tiposIdentificacion: [],
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
                tiposIdentificacion: mainDataRepository[0],
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

function post(data) {
    return client.post(url + 'Insert', data).then(response => response.data)
}

function put(id, data) {
    return client.put(url + 'Update/' + id, data).then(response => response.data)
}

function getId(id) {
    return client.get(url + 'FindById/' + id).then(responseAxios => {
        let response = responseAxios.data;

        if (response.code === "0") {
            throw response;
        }
        if (response.code === "1") {
            let dataRepository = JSON.parse(response.payload)[0];

            return {
                idCliente: dataRepository.idCliente,
                idTipoClienteProveedor: dataRepository.idTipoClienteProveedor,
                idTipoEntidad: dataRepository.idTipoEntidad,
                idSubContribuyente: dataRepository.idSubContribuyente,
                idTiempoCredito: dataRepository.idTiempoCredito,
                idTipoIdentificacion: dataRepository.idTipoIdentificacion,
                idCiudad: dataRepository.idCiudad,
                numeroIdentificacion: dataRepository.numeroIdentificacion,
                nombreFiscal: dataRepository.nombreFiscal,
                montoCredito: dataRepository.montoCredito,
                nombreComercial: dataRepository.nombreComercial,
                direccion: dataRepository.direccion,
                telefono: dataRepository.telefono,
                correo: dataRepository.correo,
                estado: dataRepository.estado,
                idEmpleado: dataRepository.idEmpleado,
                diasCredito: dataRepository.diasCredito,
                empleado: dataRepository.empleado,
                idEmpresa: dataRepository.idEmpresa,
                idCargo: dataRepository.idCargo,
                placa: dataRepository.placa,
                validationSri: dataRepository.validationSri,
                correos: dataRepository.correo ? dataRepository.correo.split(';') : [],
                telefonos: dataRepository.telefono ? dataRepository.telefono.split(';') : [],
                placas: dataRepository.placa !== '' ? dataRepository.placa.split(';') : []
            }
        }
    })
}
async function search(params, cancelToken) {
    return await client.get(`${url}Search/?json=${params}`, { cancelToken }).then((responseAxios) => {
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
    post,
    put,
    getId,
    search,
    getCedula,
    getRuc
}