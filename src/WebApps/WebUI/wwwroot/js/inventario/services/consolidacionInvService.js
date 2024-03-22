(function () {

    'use strict';
    app.factory('consolidacionInvService', ['$injector', function ($injector) {
        const mS = $injector.get('mainService');
        const fS = $injector.get("formulario");
        const url = 'Inventario/Consolidacion/';

        return {
            getDataForm,
            getAll,
            getProducts,
            generateSerieComprobante,
            mapTo,
            post,
            getId,
            put,
            anular
        }

        function getDataForm() {
            const json = JSON.stringify({ tipo: 2 })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                const data = {
                    estabs: [],
                    subFamilias: [],
                    config: {}
                }
                if (response !== null && typeof response === 'object') {
                    const { bodegas, decimales, ptoEmision, subFamilia } = response;
                    const dataToGroup = {
                        estabs: ptoEmision,
                        bodegas: bodegas,
                        isGroupBodega: true
                    }
                    data.estabs = fS.groupingEstab(dataToGroup);
                    data.subFamilias = subFamilia;
                    data.decimal = decimales[0]
                }
                return data;
            })
        }


        function getAll(obj) {
            const json = JSON.stringify({
                ...obj,
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let consolidaciones = []
                if (response !== null && typeof response === 'object') {
                    consolidaciones = response.consolidaciones;
                }
                return consolidaciones;
            })
        }

        function getProducts(obj){
            const json = JSON.stringify({
                ...obj,
                tipo: 4
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let articulos = [];
                if(response!==null && typeof response==='object'){
                    let mainData = response.articulos;

                    articulos = mainData.map(item=>{
                        const {principal, fraccionado, ...restItem} = item;
                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        const dataMedida = medidas.find(m => m.idMedida === restItem.idMedida);
                        
                        

                        return {
                            idArticulo: restItem.idArticulo,
                            codigo: restItem.codigo,
                            codigoAuxiliar: restItem.codigoAuxiliar,
                            codigoBarra: restItem.codigoBarra,
                            descripcion: restItem.descripcion,
                            stock: restItem.stock,
                            precioCosto: restItem.precioCosto,
                            estado: restItem.estado,
                            iva: restItem.iva,
                            cantidad: restItem.cantidad,
                            llevaInventario: restItem.llevaInventario,
                            idMedida: restItem.idMedida,
                            medida: restItem.medida,
                            nombreTipoIva: restItem.nombreTipoIva, 
                            medidas,
                            conversion: dataMedida.conversion

                        }
                    })
                }
                return {articulos};
            })
        }

        function generateSerieComprobante(obj) {
            const json = JSON.stringify({
                ...obj,
                tipo: 5
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let serieComprobante = null;
                if (response !== null && typeof response === "object") {
                    serieComprobante = response.serieComprobante[0].serieComprobante;
                }
                return serieComprobante;
            })
        }
        function mapTo(obj) {
            const { data, detalles, itemsDeleted } = obj;

            const consolidacion = headerTo(data);
            const resultsItemsDeleted = detalleTo(itemsDeleted)
            const resultsDetalle = detalleTo(detalles)
            let mergeDetalles = [...resultsDetalle, ...resultsItemsDeleted]
            return {
                consolidacion,
                detalles: mergeDetalles
            }

        }

        function headerTo(data) {
            return {
                idPuntoEmision: data.idPuntoEmision,
                fechaEmision: fS.formatDateMoment(data.fechaEmision),
                total: fS.isValidField(data.total, 5),
                observacion: fS.isValidField(data.observacion),
            }
        }
        function detalleTo(detalles) {
            let results = detalles.map((item, index) => {
                return {
                    idConsolidacionInventarioDetalle: item.idConsolidacionInventarioDetalle,
                    orderIndex: index + 1,
                    idArticulo: item.idArticulo,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    cantidad: item.cantidad,
                    cantidadTransaccion: fS.roundNumber(item.cantidad * item.conversion, 5),
                    precioUnitario: item.precioUnitario || item.precioCosto,
                    precioCosto: item.precioUnitario || item.precioCosto,
                    total: fS.roundNumber(item.total, 5),
                    nota: fS.isValidField(item.nota),
                    descripcion: item.descripcion,
                    estado: item.estado
                }
            })
            return results;
        }


        function post(data) {
            return mS.getData('post', `${url}`, { data }, true);
        }
        function getId(id) {
            return mS.getData('get', `${url}GetId/${id}`, null, true).then(response => {
                const data = {
                    comprobante: {},
                    detalles: [],
                }
                if (response !== null && typeof response === 'object') {
                    const comprobanteTemp = response.comprobante[0];
                    const detallesTemp = response.detalles;

                    data.comprobante = {
                        ...comprobanteTemp,
                        fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                        fechaEmisionDocCreado: fS.formatDate(comprobanteTemp.fechaEmision),
                    }

                    data.detalles = detallesTemp.map(item => {
                        const { fraccionado, principal, ...restItem } = item;

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        const dataMedida = medidas.find(m => m.idMedida === restItem.idMedida);
                        restItem.conversion = dataMedida.conversion;
                        restItem.medidas = medidas;
                        return {
                            idConsolidacionInventarioDetalle: restItem.idConsolidacionInventarioDetalle,
                            idBodega: restItem.idBodega,
                            idArticulo: restItem.idArticulo,
                            idMedida: restItem.idMedida,
                            descripcion: restItem.descripcion,
                            cantidad: restItem.cantidad,
                            precioCosto: restItem.precioCosto,
                            precioActual: restItem.precioActual,
                            codigo: restItem.codigo,
                            stock: restItem.stock, 
                            estado: restItem.estado,
                            conversion: dataMedida.conversion,
                            medidas,
                            total: fS.roundNumber(restItem.cantidad * restItem.precioActual, 5),
                            estado: true
                        };

                    })
                }
                return data;
            })
        }

        function put(id, data) {
            return mS.getData('put', `${url}${id}`, { data }, true);
        }

        function anular(id) {
            return mS.getData('delete', `${url}${id}`, null, true);
        }

        // return service;
    }])
})(window.angular)