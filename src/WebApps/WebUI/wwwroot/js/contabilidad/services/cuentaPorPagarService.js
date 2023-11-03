(function () {

    'use strict';

    app.factory('cuentaPorPagarService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Contabilidad/CuentaPorPagar/';
        const service = {};

        service.get = function (obj) {
            let params = {
                ...obj,
                tipo: ('tipo' in obj) ? obj.tipo : 1
            }
            return mS.getData('get', `${URL}?json=${JSON.stringify(params)}`, null, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let mainData = JSON.parse(response.payload) || []; 
                    console.log(mainData)
                    if(params.tipo===1){
                        return mainData[0]
                    }
                    if(params.tipo ===5){
                        console.log(mainData)
                    }
                }
            })            
        }
        return service;
    })



})(window.angular)