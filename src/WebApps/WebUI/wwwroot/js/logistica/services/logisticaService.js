(function () {

    'use strict';

    app.factory('guiaRemisionService', ['$injector', function ($injector) {
        let url = 'Logistica/GuiaRemision/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');

        return {
            getDataForm,
            getDataFilter,
            getAll,
            post,
            put,
            anular
        }

        function getDataForm(){
            return mS.getData('get', url + '?json=' + JSON.stringify({ tipo: 3 }), null, true).then(response=>{ 
                if(!response) return {}
                const { ptoEmision } = response;

                const estabs = fS.groupingEstab({
                    estabs: ptoEmision
                })
                return {
                    estabs: estabs || [],
                }
            })
        }
        function getDataFilter() {
            return mS.getData('get', url + '?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
                if (!response) return {};
                const { ptoEmision, estadoDocumento } = response;

                const estabs = fS.groupingEstab({
                    estabs: ptoEmision
                })
                return {
                    estabs,
                    estadosDoc: estadoDocumento
                }
            })
        }

        function getAll(obj) {
            return mS.getData('get', url + '?json=' + JSON.stringify({ ...obj, tipo: 1 }), null, true).then(response => {
                if (!response) []; 

                let guiasRemision = response.guias || []
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
            })
        }


        function post(data) {
            return mS.getData('post', url, { data }, true)
        }

        function put(id, data) {
            return mS.getData('put', url + id, { data }, true)
        }
        function anular(id) {
            return mS.getData('delete', url + id, null, true)
        }
    }]);


    app.factory('transportistaService', ["$injector", function ($injector) {
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
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tyList: 4 }), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload);
                    return results;
                }
            }).catch(error => {
                throw error;
            })
        }
        return service;

    }])


    app.factory('vehiculoService', ["$injector", function ($injector) {
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

    }])



})(window.angular)