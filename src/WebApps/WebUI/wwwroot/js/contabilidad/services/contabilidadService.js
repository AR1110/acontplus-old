(function () {

    'use strict';
    const PATH_API = 'Contabilidad/'
    app.factory('cuentaPorCobrarService', function($injector){
        const url = `${PATH_API}CuentaPorCobrar/`
        const mS = $injector.get('mainService');
        const fS = $injector.get('formulario');

        return {
            getDataFilterReport
        }

        function getDataFilterReport(){
            return mS.getData('get', `${url}?json=${JSON.stringify({tipo: 6})}`, null, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    const mainData = JSON.parse(response.payload) 
                    const tempEstabs = mainData[0];
                    const estadosDoc = mainData[1];
                    const tiposDoc = mainData[2]
                    let dataToGroup = {
                        estabs: tempEstabs, //Establecimientos con puntos de emision 
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
                    return {
                        estabs,
                        estadosDoc,
                        tiposDoc
                    } 
                }
            })
        }




    })



})(window.angular)