(function () {

    'use strict';

    app.factory('proveedorService', function ($injector) {
        const URL = 'Compra/Proveedor/';
        const service = {};
        const mS = $injector.get('mainService');

        service.get = function () {

        }

        service.save = function (data) {
            return mS.getData('post', `${URL}?json=${JSON.stringify(data)}`, null, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', `${URL}${id}?json=${JSON.stringify(data)}`, null, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', URL + id, null, true);
        }

        return service;

    })

    app.factory('categoriaCompraService', function ($injector) {
        const URL = 'Compra/CategoriaCompra/';
        const mS = $injector.get('mainService');

        const service = {}

        service.get = (query) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let results = JSON.parse(response.payload);
                    return results;

                }
            })
        }

        service.post = (data) => {
            return mS.getData('post', URL + '?json=' + JSON.stringify(data), null, true)
        }

        service.put = (id, data) => {
            return mS.getData('put', URL + id + '?json=' + JSON.stringify(data), null, true)
        }

        service.delete = (id) => {
            return mS.getData('delete', URL + '' + id, null, true)
        }

        return service;

    })




})(window.angular)