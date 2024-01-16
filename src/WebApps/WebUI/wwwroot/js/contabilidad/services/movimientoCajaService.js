(function(){

    'use strict';

    app.factory('movimientoCajaService', movimientoCajaService);

    movimientoCajaService.$inject = ['mainService'];
    function movimientoCajaService(mS){
        const url = 'Contabilidad/MovimientoCaja/'
        return {
            getAll
        }

        function getAll(obj){
            return mS.getData('get', `${url}Get?json=${JSON.stringify(obj)}`).then(response=>{
                console.log(response)
            })
        }

    }



})(window.angular)