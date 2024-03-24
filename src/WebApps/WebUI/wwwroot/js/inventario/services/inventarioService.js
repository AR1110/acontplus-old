(function () {

    'use strict';

    app.factory('familiaService', function ($injector) {

        let url = 'Inventario/Familia/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let familias = JSON.parse(response.payload) || [];
                    return familias.map(item => ({
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                        siglas: item.siglas,
                        estado: item.estado,
                        totalRecords: item.totalRecords
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', { data }, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, { data }, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        return service;
    })



    /**
     * SubFamilias 
     */
    app.factory('subFamiliaService', function ($injector) {

        let url = 'Inventario/SubFamilia/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let subFamilias = JSON.parse(response.payload) || [];

                    return subFamilias.map(item => ({
                        idSubFamilia: item.idSubFamilia,
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        siglas: item.siglas,
                        codigo: item.codigo,
                        subcategoryPhotoId: item.subcategoryPhotoId,
                        s3ObjectUrl: item.s3ObjectUrl,
                        s3ObjectKey: item.s3ObjectKey,
                        montoObjetivo: item.montoObjetivo,
                        nombreFamilia: item.nombreFamilia,
                        totalRecords: item.totalRecords,
                        ultimoSecuencial: item.ultimoSecuencial
                    }))
                }
            })
        }

        service.save = function (file, data) {
            const spParams = {
                idFamilia: data.idFamilia,
                descripcion: data.descripcion,
                montoObjetivo: data.montoObjetivo,
                siglas: data.siglas,
            }
            return mS.getDataFile(url + "Post/?json=" + JSON.stringify(spParams), file, null, true);
        }

        service.update = function (id, data) {
            let spParams = {
                idFamilia: data.idFamilia,
                descripcion: data.descripcion,
                montoObjetivo: data.montoObjetivo,
                estado: data.estado,
                secuencial: data.ultimoSecuencial || 0
            }
            return mS.getData('PUT', url + `Put/${id}/?json=${JSON.stringify(spParams)}`, null, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + id, null, true);
        }

        service.listForSelect = function (query) {
            return mS.getData('get', url + 'ListForSelect?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let subFamilias = JSON.parse(response.payload) || [];
                    return subFamilias.map(item => ({
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                    }))
                }
            })
        }

        return service;
    })


    /**
     * Marcas 
     */
    app.factory('marcaService', function ($injector) {

        let url = 'Inventario/Marca/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let marcas = JSON.parse(response.payload) || [];

                    return marcas.map(item => ({
                        idMarca: item.idMarca,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        codigo: item.codigo,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        service.listForSelect = function (query) {
            return mS.getData('get', url + 'ListForSelect?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let marcas = JSON.parse(response.payload) || [];

                    return marcas.map(item => ({
                        idMarca: item.idMarca,
                        descripcion: item.descripcion,
                    }))
                }
            })
        }


        return service;
    })

    /**
     * Modelos 
     */
    app.factory('modeloService', function ($injector) {

        let url = 'Inventario/Modelo/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let modelos = JSON.parse(response.payload) || [];

                    return modelos.map(item => ({
                        idModelo: item.idModelo,
                        codigo: item.codigo,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        idMarca: item.idMarca,
                        marca: item.marca,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }


        return service;
    })




    /**
     * Modelos 
     */
    app.factory('medidaService', function ($injector) {

        let url = 'Inventario/Medida/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let medidas = JSON.parse(response.payload) || [];

                    return medidas.map(item => ({
                        idMedida: item.idMedida,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        codigo: item.codigo,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }


        return service;
    })


    /**
    * Modelos 
    */
    app.factory('tarifaService', function ($injector) {

        let url = 'Inventario/Tarifa/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let tarifas = JSON.parse(response.payload) || [];

                    return tarifas.map(item => ({
                        idTarifa: item.idTarifa,
                        descripcion: item.descripcion,
                        codigo: item.codigo,
                        predeterminada: item.predeterminada,
                        estado: item.estado,
                        ventaPorMayor: item.ventaPorMayor,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id + '?json=' + JSON.stringify(data), null, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }


        return service;
    })




    app.factory('kardexService', function ($injector) {
        let mS = $injector.get('mainService');
        let URL = 'Inventario/Kardex/'
        let service = {};



        service.get = (params) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                return JSON.parse(response.payload)
            })
        }

        service.getDataFilters = () => {
            return mS.getData('get', URL + 'Filters', null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    return {
                        estadoMovimientos: mainData[0]
                    }
                }
            })

        }
        return service;
    })

    app.factory('subcategoryPhotoService', subcategoryPhotoService);

    subcategoryPhotoService.$inject = ['mainService'];

    function subcategoryPhotoService(mS) {
        let service = {}
        let url = 'Inventario/SubcategoryPhoto/'
        function _get() {

        }
        function _post({ subcategoryId, file }) {
            return mS.uploadFile({ url: `${url}${subcategoryId}`, file, });
        }
        function _update({ id, data = null, file }) {
            return mS.uploadFile({ url: `${url}Put/${id}?json=${data}`, file, });
        }
        function _delete(id) {

        }
        service.get = _get;
        service.post = _post;
        service.update = _update;
        service.delete = _delete;
        return service;
    }


})(window.angular);

/**
 * CONSOLIDACION INVENTARIO 
 * 
 */

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
            getInfoById,
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

        function getProducts(obj) {
            const json = JSON.stringify({
                ...obj,
                tipo: 4
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let articulos = [];
                if (response !== null && typeof response === 'object') {
                    let mainData = response.articulos;

                    articulos = mainData.map(item => {
                        const { principal, fraccionado, ...restItem } = item;
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
                return { articulos };
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
                total: fS.roundNumber(data.total, 5),
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

        function getInfoById(id){
            const json = JSON.stringify({
                id,
                tipo: 3
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let {comprobante, detalles} = response;
                let tempComprobante = comprobante[0];
             
                comprobante = {       
                    establecimiento: tempComprobante.nombreComercial,
                    ptoEmi: tempComprobante.ptoEmi,             
                    idConsolidacionInventario: tempComprobante.idConsolidacionInventario,
                    fechaEmision: fS.formatDate(tempComprobante.fechaEmision),
                    observacion: tempComprobante.observacion,
                    total: tempComprobante.total, 
                }
                detalles = detalles.map((item, index)=>{
                    return {
                        index: index+1,
                        idConsolidacionInventarioDetalle:item.idConsolidacionInventarioDetalle,
                        codigo:item.codigo,
                        descripcion:item.descripcion,
                        cantidad:item.cantidad,
                        medida:item.medida,
                        bodega:item.bodega,
                        stock: item.stock,
                        precioActual:item.precioActual,
                        precioCosto:item.precioCosto,
                        total:item.total,
                    }
                })
                return {
                    comprobante,
                    detalles
                }
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