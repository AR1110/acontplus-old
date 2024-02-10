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
            getDocs,
            generateSerieComprobante,
            mapperTo,
            getId,
            post,
            put,
            anular
        }

        function getDataForm() {
            return mS.getData('get', url + '?json=' + JSON.stringify({ tipo: 3 }), null, true).then(response => {
                if (!response) return {}
                const {
                    ptoEmision,
                    tipoDocumento
                } = response; 

                const estabs = fS.groupingEstab({
                    estabs: ptoEmision
                })
                return {
                    estabs: estabs || [],
                    tiposDoc: tipoDocumento
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

                let guiasRemision = response.guias || [];

                return guiasRemision.map(item => {
                    return {
                        idGuiaRemision: item.idGuiaRemision,
                        codEstab: item.codEstab,
                        fechaEmision: item.fechaEmision,
                        fechaInicio: item.fechaInicio,
                        fechaFin: item.fechaFin,
                        claveAcceso: item.claveAcceso,
                        serieFactura: item.serieFactura,
                        razonSocialDestinatario: item.razonSocialDestinatario,
                        identificacionDestinatario: item.identificacionDestinatario,
                        serieComprobante: item.serieComprobante,
                        razonSocialTransportista: item.razonSocialTransportista,
                        estado: item.estado,
                        usuario: item.usuario,
                        style: item.style,
                        totalRecords: item.totalRecords,
                    }
                })
            })
        }

        function getDocs(obj) {
            return mS.getData('get', url + '?json=' + JSON.stringify({ ...obj}), null, true).then(response=>{
                let docs = [];
                if(response!==null && typeof response==='object'){
                    let tempData = [];
                    if(obj.codDoc==="NE"){
                        tempData = response.notas;
                        docs = tempData.map(doc => {
                            let detalles = JSON.parse(doc.detalles);
                            return {
                                idDocumento: doc.idDocumento,
                                serieComprobante: doc.serieComprobante,
                                razonSocialComprador: doc.razonSocialComprador,
                                fechaEmision: doc.fechaEmision,
                                detalles,
                                totalRecords: doc.totalRecords,
                            }
                        })

                    }else{
                        tempData = response.facturas;
                        docs = tempData.map(doc => {
                            let detalles = JSON.parse(doc.detalles);
                            return {
                                idDocumento: doc.idFactura,
                                serieComprobante: doc.serieComprobante,
                                razonSocialComprador: doc.razonSocialComprador,
                                fechaEmision: doc.fechaEmision,
                                detalles,
                                totalRecords: doc.totalRecords,
                            }
                        }) 
                    }

                }
                return docs;
            })
        }

        function generateSerieComprobante (query) {
            return mS.getData('get', url + '?json=' + JSON.stringify(Object.assign(query, { tipo: 4 })), null, true).then(response => {
                let result = null;
                if(response !== null && typeof response === 'object'){
                    let {serieComprobante} = response;
                    if (serieComprobante.length>0){
                        result = serieComprobante[0].serieComprobante; 
                    }
                }
                return result;
            })
        }

        function mapperTo(obj) {
            const { data, detalles, infoAdicionalDocumento, deletedItems } = obj;


            const infoGuiaRemision = infoComprobanteMapperTo(data);
            const detallesResult = detalleMapperTo(detalles);
            const deletedItemsResult = detalleMapperTo(deletedItems);

            const mergeItems = [
                ...detallesResult,
                ...deletedItemsResult
            ]

            return {
                infoGuiaRemision,
                detalles: mergeItems,
                infoAdicional: infoAdicionalDocumento
            }
        }

        function infoComprobanteMapperTo(data) {
            return {
                idPuntoEmision: data.idPuntoEmision,
                idCliente: data.idCliente,
                idTransportista: data.idTransportista,
                idVehiculo: data.idVehiculo,
                idEmpleado: data.idEmpleado,
                idFactura: data.idFactura,
                fechaEmision: fS.formatDateMoment(data.fechaEmision),
                fechaInicio: fS.formatDateMoment(data.fechaInicio),
                fechaFin: fS.formatDateMoment(data.fechaFin),
                docAduanero: data.docAduanero,
                ptoPartida: data.ptoPartida,
                ptoLlegada: data.ptoLlegada,
                ruta: data.ruta,
                estableDestino: fS.isValidField(data.estableDestino),
                entregar: data.entregar,
                motivo: data.motivo,
                idFactura: fS.isValidField(data.idDocumento)
            }
        }

        function detalleMapperTo(items) {
            let arr = items.map((item, index) => {
                return {
                    idGuiaRemisionDetalle: item.idGuiaRemisionDetalle || 0,
                    orderIndex: index,
                    idArticulo: item.idArticulo,
                    cantidad: item.cantidad,
                    descripcion: item.descripcion,
                    estado: item.estado
                }
            })
            return arr;
        }

        function getId(id) {
            return mS.getData('get', `${url}GetId/${id}`, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code == "1") {
                    let { cliente, detalles, empleado, guia, infoAdicional, transportista, vehiculo } = JSON.parse(response.payload);

                    let comprobante = guia[0];
                    let resultComprobante = {

                        idGuiaRemision: comprobante.idGuiaRemision,
                        codEstab: comprobante.codEstab,
                        idPuntoEmision: comprobante.idPuntoEmision,
                        serieComprobante: comprobante.serieComprobante,
                        fechaEmisionDocCreado: fS.formatDate(comprobante.fechaEmision),
                        fechaEmision: fS.formatDate(comprobante.fechaEmision),
                        fechaInicio: fS.formatDate(comprobante.fechaInicio),
                        fechaFin: fS.formatDate(comprobante.fechaFin),
                        docAduanero: comprobante.docAduanero,
                        ptoPartida: comprobante.ptoPartida,
                        ptoLlegada: comprobante.ptoLlegada,
                        ruta: comprobante.ruta,
                        estableDestino: comprobante.estableDestino,
                        entregar: comprobante.entregar,
                        motivo: comprobante.motivo,
                        idDocumento: comprobante.idFactura
                    }

                    let resultDetalles = detalles.map((item, index) => {
                        return {
                            n: index + 1,
                            idGuiaRemisionDetalle: item.idGuiaRemisionDetalle,
                            idArticulo: item.idArticulo,
                            cantidad: item.cantidad,
                            descripcion: item.descripcion,
                            codigo: item.codigo,
                            estado: true
                        }
                    })

                    return {
                        comprobante: resultComprobante,
                        detalles: resultDetalles,
                        cliente: cliente[0] || {},
                        empleado: empleado[0] || {},
                        infoAdicionalDocumento: infoAdicional,
                        transportista: transportista[0] || {},
                        vehiculo: vehiculo[0] || {}
                    }
                }
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