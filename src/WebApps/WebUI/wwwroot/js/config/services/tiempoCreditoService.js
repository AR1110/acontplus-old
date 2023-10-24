(function () {

    'use strict';
    app.factory('tiempoCreditoService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Config/TiempoCredito/';         

        const service = {};

        service.get = function (query) {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let tiempoCreditos = JSON.parse(response.payload) || [];                    
                    return tiempoCreditos;
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

        
        return service;
    })
})(window.angular)