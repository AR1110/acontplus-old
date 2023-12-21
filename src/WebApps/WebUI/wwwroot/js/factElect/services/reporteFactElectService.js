(function () {

    'use strict';

    app.factory('reporteFactElectService', reporteFactElectService)

    reporteFactElectService.$inject = ['mainService', 'formulario'];
    function reporteFactElectService(mS, fS) {
        const URL = 'FacteElect/CuentaPorCobrar/';
        let service = {};

        service.getDataForm = function () {
            return mS.getData('get', `${URL}?json=${JSON.stringify({
                tipo: 7
            })}`, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let [tempEstabs, estadosDoc, tiposDoc] = JSON.parse(response.payload) || [];

                    let estabs = fS.groupingEstab({ estabs: tempEstabs });


                    return {
                        estabs,
                        estadosDoc,
                        tiposDoc
                    }

                }
            })
        } 

        return service;
    }


})(window.angular)