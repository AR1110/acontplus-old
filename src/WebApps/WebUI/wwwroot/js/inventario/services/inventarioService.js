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
            return mS.getData('post', url + 'Insert', {data}, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, {data}, true);
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
            return mS.getData(url + `Put/${id}/?json=${JSON.stringify(spParams)}`, null, true);
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


})(window.angular)