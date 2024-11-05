import app from '@src/app'; 
const URL_API = "FactElect/";
app.factory("docElectService", docElectService);

docElectService.$inject = ["$injector"];

function docElectService($injector) {
    let URL = `${URL_API}DocumentoElectronico/`;
    let URL_RETENCION_ATS = "FactElect/RetencionAts/";
    let mS = $injector.get("mainService");
    let FileSaver = $injector.get("FileSaver");
    let fS = $injector.get("formulario");
    let service = {};

    service.getDataFilter = function () {
        return mS
            .getData(
                "get",
                URL + "?json=" + JSON.stringify({ tipo: 2 }),
                null,
                true
            )
            .then((response) => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    let tempEstabsAndPtosEmision = mainData[0];
                    let tiposDoc = mainData[1];
                    let estadosDoc = mainData[2];

                    const estabs = fS.groupingEstab({
                        estabs: tempEstabsAndPtosEmision,
                    });
                    return {
                        estabs,
                        tiposDoc,
                        estadosDoc,
                    };
                }
            });
    };

    /**
     * tipo 1: get listado general
     * tipo 2: get estabs, ptos. emisiones para los filtros
     * @returns
     */
    service.get = (params) => {
        if (!("tipo" in params)) {
            throw "Requiere propiedad tipo";
        }
        return mS
            .getData("get", URL + "?json=" + JSON.stringify(params), null, true)
            .then((response) => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    if (params.tipo === 1) {
                        return mainData[0];
                    }
                }
            });
    };

    service.getAll = function (obj) {
        let pageIndex = obj.pageIndex || 1;
        let pageSize = obj.pageSize || 25;

        let json = JSON.stringify({
            tipo: 1,
            ...obj,
            pageIndex,
            pageSize,
        });
        return mS
            .getData("get", `${URL}?json=${json}`, null, true)
            .then((response) => {
                let results = [];
                if (response.code === "1") {
                    let [comprobantesElectronicos] = JSON.parse(response.payload);

                    comprobantesElectronicos = comprobantesElectronicos || [];
                    results = comprobantesElectronicos.map((item) => {
                        return {
                            idDocumentoElectronico: item.idDocumentoElectronico,
                            idDocumento: item.idDocumento,
                            codDoc: item.codDoc,
                            comprobante: item.comprobante,
                            comprobanteVersion: `${item.comprobante}-${item.versionComp}`,
                            serieComprobante: item.serieComprobante,
                            rucReceptor: item.rucReceptor,
                            razonSocial: item.razonSocial,
                            fechaEmision: item.fechaEmision,
                            claveAcceso: item.claveAcceso,
                            fechaAutorizacion: item.fechaAutorizacion,
                            estado: item.estado,
                            codEstado: item.codEstado,
                            versionComp: item.versionComp,
                            usuario: item.usuario,
                            codEstab: item.codEstab,
                            totalRecords: item.totalRecords,
                        };
                    });
                }
                return results;
            });
    };

    service.getByStatus = (params) => {
        return mS
            .getData(
                "get",
                `${URL}GetByStatus/?json=${JSON.stringify(params)}`,
                null,
                true
            )
            .then((response) => {
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)[0];
                    return mainData;
                }
            });
    };

    service.updateXml = (id) => {
        if (!(id > 0)) {
            throw "id no valido";
        }
        return mS.getData("put", `${URL}${id}`, null, true);
    };

    service.downloadXml = function (id) {
        return mS
            .getFile("get", `${URL}GetXmlSri/${id}`, null, true)
            .then((response) => {
                let fileName = response
                    .headers()
                ["content-disposition"].split(";")[1]
                    .split("=")[1]
                    .replace('"', "");
                fileName = fileName.replace('"', "");
                let serverData = new Blob([response.data], {
                    type: response.headers()["content-type"],
                });
                FileSaver.saveAs(serverData, fileName);
            });
    };

    //Retencion ATS
    service.retencionAtsCancel = (id) => {
        if (!(id > 0)) {
            throw "id no valido";
        }
        return mS.getData("put", `${URL_RETENCION_ATS}Cancel/${id}`, null, true);
    };

    return service;
}