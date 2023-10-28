(function () {

    'use strict';
    app.factory('politicaService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Config/Politica/';
        const URL_ACCESO = 'Config/Acceso/'

        const service = {};

        service.get = function (query) {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let politicas = JSON.parse(response.payload) || [];
                    return politicas;
                }
            })
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

        //Acceso 
        service.getAcceso = (query) => {
            return mS.getData('get', URL_ACCESO + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let accesos = JSON.parse(response.payload) || [];
                    return accesos;
                }
            })
        }

        service.updateAcceso = function (data) {
            return mS.getData('put', `${URL_ACCESO}`, {
                data: {
                    accesos: data
                }
            }, true);
        }

        return service;
    })
})(window.angular)