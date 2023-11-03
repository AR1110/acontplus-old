(function () {

    'use strict';

    app.factory('cuentaPorPagarService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Contabilidad/CuentaPorPagar/';
        const service = {};

        service.get = function () {
            return mS.getData('get', URL);
        }
        return service;
    })



})(window.angular)