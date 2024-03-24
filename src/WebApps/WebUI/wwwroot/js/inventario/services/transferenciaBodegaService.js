

(function () {

    'use strict';

    app.factory('transferenciaBodegaService', function ($injector) {
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        let url = 'Inventario/TransferenciaBodega/';


        return {
            getDataFilter,
            getDataForm,
            generateSerieComprobante,
            getAll,
            mapTo,
            insert,
            update,
            anular,
            getId,
            getIdDetalle
        }


        function getDataFilter() {
            return mS.getData('get', `${url}?json=${JSON.stringify({ tipo: 2 })}`, null, true).then(response => {
                const data = {
                    estabs: []
                }
                if (response !== null && typeof response === 'object') {
                    let dataToGroup = {
                        estabs: response.establecimientos
                    }
                    data.estabs = fS.groupingEstab(dataToGroup);
                }
                return data;
            })
        }


        function getDataForm() {
            return mS.getData('get', `${url}?json=${JSON.stringify({ tipo: 3 })}`, null, true).then(response => {
                const data = {
                    estabs: [],
                    tiposTransaccion: []
                }
                if (response !== null && typeof response === 'object') {
                    const { ptoEmision, bodega, tipoTransaccion } = response;
                    const dataToGroup = {
                        estabs: ptoEmision,
                        bodegas: bodega,
                        isGroupBodega: true
                    }
                    data.estabs = fS.groupingEstab(dataToGroup);
                    data.tiposTransaccion = tipoTransaccion;
                }

                return data;
            })
        }
        function generateSerieComprobante(query) {
            return mS.getData('get', url + '?json=' + JSON.stringify(Object.assign(query, { tipo: 4 })), null, true).then(response => {
                let value = null;
                if (response !== null && typeof response === 'object') {
                    const { serieComprobante } = response;
                    value = serieComprobante[0].serieComprobante
                }
                return value;
            })
        }
        function getAll(obj) {
            let json = JSON.stringify({
                ...obj,
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let transferenciasBodega = [];
                if (response !== null && typeof response === 'object') {
                    const tempData = response.tranferencias;
                    transferenciasBodega = tempData.map(item => {
                        return {
                            idTransferenciaBodega: item.idTransferenciaBodega,
                            idTipoDocumento: item.idTipoDocumento,
                            codEstab: item.codEstab,
                            nroDoc: item.nroDoc,
                            fechaEmision: item.fechaEmision,
                            estadoDesc: item.estadoDesc,
                            estadoCodigo: item.estadoCodigo,
                            total: item.total,
                            bodegaOrigen: item.bodegaOrigen,
                            bodegaDestino: item.bodegaDestino,
                            rowColor: item.rowColor,
                            totalRecords: item.totalRecords
                        }
                    })
                }

                return transferenciasBodega;
            })
        }

        function mapTo(obj) {
            const { data, detalles, tiposTransaccion, itemsDeleted } = obj;

            const idTipoTransaccionOrigen = tiposTransaccion.find(item => item.codigo === 'S').idTipoTransaccion
            const idTipoTransaccionDestino = tiposTransaccion.find(item => item.codigo === 'E').idTipoTransaccion
            data.total = detalles.reduce((acc, curr) => acc + curr.total, 0);

            const comprobante = mapComprobanteTo(data);
            const resultsDetalleOrigen = mapDetalleOrigen(detalles, idTipoTransaccionOrigen, data.idBodegaOrigen)
            const resultsDetalleDestino = mapDetalleDestino(detalles, idTipoTransaccionDestino, data.idBodegaDestino)
            const mergeDetalle = [...resultsDetalleOrigen, ...resultsDetalleDestino].map((item, index) => ({ ...item, orderIndex: index + 1 }))


            const tempItemsDeleted = itemsDeleted.map((item, index) => ({ ...item, orderIndex: index + 1 }))
            const mergeDetalleOrigen = [...resultsDetalleOrigen, ...tempItemsDeleted];


            return ({
                comprobante,
                detalles: mergeDetalleOrigen,
                transaccion: mergeDetalle,
            })

        }
        function mapComprobanteTo(data) {
            return {
                idPuntoEmision: data.idPuntoEmision,
                idBodegaOrigen: data.idBodegaOrigen,
                idBodegaDestino: data.idBodegaDestino,
                fechaEmision: fS.formatDateMoment(data.fechaEmision),
                observacion: data.observacion,
                total: data.total,
            }

        }

        function mapDetalleOrigen(detalles, idTipoTransaccionOrigen, idBodega) {
            let results = detalles.map((item, index) => {
                return {
                    orderIndex: index + 1,
                    idTransferenciaBodegaDetalle: item.idTransferenciaBodegaDetalle,
                    idTipoTransaccion: idTipoTransaccionOrigen,
                    idArticulo: item.idArticulo,
                    idBodega: idBodega,
                    idMedida: item.idMedida,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    cantidadTransaccion: fS.roundNumber(item.cantidad * item.conversion),
                    precioUnitario: item.precioUnitario,
                    precioCosto: item.precioCosto,
                    precioUnitario: item.precioCosto,
                    total: item.total,
                    estado: item.estado
                }
            })
            return results;
        }
        function mapDetalleDestino(detalles, idTipoTransaccionDestino, idBodega) {
            let results = detalles.map((item, index) => {
                return {
                    orderIndex: index + 1,
                    idTransferenciaBodegaDetalle: item.idTransferenciaBodegaDetalle,
                    idTipoTransaccion: idTipoTransaccionDestino,
                    idArticulo: item.idArticulo,
                    idBodega: idBodega,
                    idMedida: item.idMedida,
                    cantidad: item.cantidad,
                    cantidadTransaccion: fS.roundNumber(item.cantidad * item.conversion),
                    precioUnitario: item.precioUnitario,
                    precioCosto: item.precioCosto,
                    precioUnitario: item.precioCosto,
                    total: item.total,
                    descripcion: item.descripcion,
                    estado: item.estado
                }
            })
            return results;
        }

        function insert(data) {
            return mS.getData('post', `${url}`, { data }, true)
        }


        function update(id, data) {
            return mS.getData('put', `${url}${id}`, { data }, true)
        }

        function anular(id) {
            return mS.getData('delete', `${url}${id}`, null, true)
        }


        function getId(id) {

            return mS.getData('get', `${url}GetId/${id}`, null, true).then(response => {
                const data = {
                    comprobante: {},
                    detalles: []
                }
                if (response !== null && typeof response === 'object') {
                    const { detalles: detallesTemp } = response;

                    const comprobante = response.comprobante[0];
                    data.comprobante = {
                        ...comprobante,
                        fechaEmision: fS.formatDate(comprobante.fechaEmision),
                        fechaEmisionDocCreado: fS.formatDate(comprobante.fechaEmision),
                    }

                    data.detalles = detallesTemp.map(item => {
                        const { fraccionado, principal, ...restItem } = item;

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        const dataMedida = medidas.find(m => m.idMedida === restItem.idMedida);
                        restItem.conversion = dataMedida.conversion;
                        restItem.medidas = medidas;
                        return restItem;
                    })


                }
                return data;

            })

        }

        function getIdDetalle(id) {
            return mS.getData('get', url + '?json=' + JSON.stringify(Object.assign({ id }, { tipo: 5 })), null, true).then(response => {
                const data = {
                    dataDocumento: {},
                    detalleDocumento: []
                }
                if (response !== null && typeof response === 'object') {
                    const { detalles } = response;

                    const comprobante = response.comprobante[0];
                    data.dataDocumento = {
                        ...comprobante,
                        fechaEmision: fS.formatDate(comprobante.fechaEmision)
                    }
                    data.detalleDocumento = detalles;
                }
                return data;

            })
        }

    })


})(window.angular)