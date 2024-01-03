(function () {

    'use strict';

    app.factory('reporteVentaService', reporteVentaService)

    reporteVentaService.$inject = ['mainService', 'formulario'];
    function reporteVentaService(mS, fS) {
        const URL = 'Contabilidad/CuentaPorCobrar/';
        let service = {};

        service.getDataForm = function () {
            return mS.getData('get', `${URL}?json=${JSON.stringify({
                tipo: 6
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


        service.getEstadisticas = function(params){
            return mS.getData('get', `/EstadisticaVenta/Get?json=${JSON.stringify(params)}`).then(response => {            
                if(response.code==="0") return []
                return response;             
            });
        }

        return service;
    }


})(window.angular)