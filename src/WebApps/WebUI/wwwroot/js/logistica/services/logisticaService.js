(function () {

    'use strict';

    app.factory('guiaRemisionService', function ($injector) {
        let url = 'Logistica/GuiaRemision/';
        let mS = $injector.get('mainService');
        let service = {};

        service.get = function (query) {
            return mS.getData('get', url + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response
                }
                if (response.code === '1') {
                    let mainData = JSON.parse(response.payload) || [];

                    if (query.tipo === 1) {
                        let guiasRemision = mainData[0]
                        return guiasRemision.map(item => {
                            return {
                                idGuiaRemision: item.idGuiaRemision,
                                fechaEmision: item.fechaEmision,
                                fechaInicio: item.fechaInicio,
                                fechaFin: item.fechaFin,
                                claveAcceso: item.claveAcceso,
                                autorizada: item.autorizada,
                                anulada: item.anulada,
                                nroDoc: item.nroDoc,
                                serieComprobante: item.nroDoc,
                                cliente: item.cliente,
                                correos: item.correos,
                                nroFactura: item.nroFactura,
                                transportista: item.transportista,
                                estadoSri: item.estadoSri,
                                usuario: item.usuario,
                                style: item.style,
                                codEstab: item.codEstab,
                            }
                        })
                    }

                    if (query.tipo === 2) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let estadosDoc = mainData[1];

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
                            estadosDoc
                        }
                    }
                }
            }).catch(error => {
                console.log(error)
                throw error
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true)
                .catch(errorResponse => {
                    throw errorResponse
                })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true)
                .catch(errorResponse => {
                    throw errorResponse
                })
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true)
                .catch(errorResponse => {
                    throw errorResponse
                })
        }
        return service;
    });


    app.factory('transportistaService', function ($injector) {
        let url = 'Logistica/Transportista/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let transportistas = JSON.parse(response.payload);
                    return transportistas.map(item => {
                        return {
                            idTransportista: item.idTransportista,
                            idTipoIdentificacion: item.idTipoIdentificacion,
                            nroIdentificacion: item.nroIdentificacion,
                            nombre: item.nombre,
                        }
                    })
                }
            }).catch(error => {
                throw error;
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    let dataRepository = JSON.parse(response.payload)[0];
                    let mapperPayload = {
                        idTipoIdentificacion: dataRepository.idTipoIdentificacion,
                        idTransportista: dataRepository.idTransportista,
                        nroIdentificacion: dataRepository.nroIdentificacion,
                        nombre: dataRepository.nombre,
                    }
                    return {
                        ...response,
                        payload: mapperPayload
                    }

                }
            }).catch(error => {
                throw error;
            })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    if (response.code === '1') {
                        let dataRepository = JSON.parse(response.payload)[0];
                        let mapperPayload = {
                            idTipoIdentificacion: dataRepository.idTipoIdentificacion,
                            idTransportista: dataRepository.idTransportista,
                            nroIdentificacion: dataRepository.nroIdentificacion,
                            nombre: dataRepository.nombre,
                        }
                        return {
                            ...response,
                            payload: mapperPayload
                        }

                    }
                }
            }).catch(error => {
                throw error;
            })
        }
        service.delete = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    return response;
                }
            }).catch(error => {
                throw error;
            })
        }

        service.getDataForm = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tyList : 4}), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload);
                    return  results;
                }
            }).catch(error => {
                throw error;
            })
        }
        return service;

    })


    app.factory('vehiculoService', function ($injector) {
        let url = 'Logistica/Vehiculo/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let vehiculos = JSON.parse(response.payload);

                    return vehiculos.map(item => {
                        return {
                            idVehiculo: item.idVehiculo,
                            placa: item.placa,
                            marca: item.marca,
                            modelo: item.modelo,
                            observacion: item.observacion,
                        }
                    })
                }
            }).catch(error => {
                throw error;
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    let dataRepository = JSON.parse(response.payload)[0];
                    let mapperPayload = {
                        idVehiculo: dataRepository.idVehiculo,
                        placa: dataRepository.placa,
                        marca: dataRepository.marca,
                        modelo: dataRepository.modelo,
                        observacion: dataRepository.observacion,
                    }
                    return {
                        ...response,
                        payload: mapperPayload
                    }

                }
            }).catch(error => {
                throw error;
            })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    if (response.code === '1') {
                        let dataRepository = JSON.parse(response.payload)[0];
                        let mapperPayload = {
                            idVehiculo: dataRepository.idVehiculo,
                            placa: dataRepository.placa,
                            marca: dataRepository.marca,
                            modelo: dataRepository.modelo,
                            observacion: dataRepository.observacion,
                        }
                        return {
                            ...response,
                            payload: mapperPayload
                        }

                    }
                }
            }).catch(error => {
                throw error;
            })
        }
        service.delete = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    return response
                }
            }).catch(error => {
                throw error;
            })
        }

        service.search = function (query) {
            return mS.getData('get', url + 'Search?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    let vehiculos = JSON.parse(response.payload);

                    return vehiculos.map(item => {
                        return {
                            idVehiculo: item.idVehiculo,
                            placa: item.placa,
                            marca: item.marca,
                            modelo: item.modelo,
                            observacion: item.observacion,
                        }
                    })
                }
            }).catch(error => {
                throw error;
            })
        }

        return service;

    })



})(window.angular)