(function () {

    'use strict';

    app.factory('docElectService', function ($injector) {
        let URL = 'FactElect/DocumentoElectronico/'
        let URL_RETENCION_ATS = 'FactElect/RetencionAts/'
        let mS = $injector.get('mainService');
        let FileSaver = $injector.get('FileSaver');
        let service = {}

        /**
         * tipo 1: get listado general 
         * tipo 2: get estabs, ptos. emisiones para los filtros
         * @returns 
         */
        service.get = (params) => {
            if (!(('tipo') in params)) {
                throw ('Requiere propiedad tipo');

            }
            return mS.getData('get', URL + '?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)
                    if (params.tipo === 1) {
                        return mainData[0];
                    }

                    if (params.tipo === 2) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let tiposDoc = mainData[1];
                        let estadosDoc = mainData[2];

                        const estabs = tempEstabsAndPtosEmision.reduce((acc, item) => {
                            const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                            if (!existingItem) {
                                acc.push({
                                    idEstablecimiento: item.idEstablecimiento,
                                    nombreComercial: item.nombreComercial,
                                    codEstab: item.codEstab,
                                    defaultEstab: item.defaultEstab,
                                    puntosEmision: [{
                                        idPuntoEmision: item.idPuntoEmision,
                                        ptoEmi: item.ptoEmi,
                                        defaultPtoEmi: item.defaultPtoEmi
                                    }]
                                });
                            } else {
                                existingItem.puntosEmision.push({
                                    idPuntoEmision: item.idPuntoEmision,
                                    ptoEmi: item.ptoEmi,
                                    defaultPtoEmi: item.defaultPtoEmi
                                });
                            }
                            return acc;
                        }, []);


                        return {
                            estabs,
                            tiposDoc,
                            estadosDoc
                        }
                    }
                }
            })
        }

        service.getByStatus = (params) => {
            return mS.getData('get', `${URL}GetByStatus/?json=${JSON.stringify(params)}`, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)[0]
                    return mainData;
                }
            })
        }

        service.updateXml = (id) => {
            if (!(id > 0)) {
                throw 'id no valido'
            }
            return mS.getData('put', `${URL}${id}`, null, true)
        }

        service.downloadXml = function (id) {
            return mS.getFile('get', `${URL}GetXmlSri/${id}`, null, true).then(response => {
                let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
                fileName = fileName.replace('"', "")
                let serverData = new Blob([response.data], { type: response.headers()['content-type'] })
                FileSaver.saveAs(serverData, fileName)
            })
        }


        //Retencion ATS 
        service.retencionAtsCancel = (id) => {
            if (!(id > 0)) {
                throw 'id no valido'
            }
            return mS.getData('put', `${URL_RETENCION_ATS}Cancel/${id}`, null, true)
        }


        return service;

    })


})(window.angular);