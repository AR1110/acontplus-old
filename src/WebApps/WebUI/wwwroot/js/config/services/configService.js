(function () {
    'use strict';

    app.factory('bodegaService', ['$injector', function ($injector) {
        let url = '/Config/Bodega/'








    }])

    app.factory('bodegaAsignacionService', ['$injector', function ($injector) {
        let url = 'Config/BodegaAsignacion/'
        let mS = $injector.get('mainService');

        return {
            get,
            put,
            post
        }

        function get(obj) {
            let params = JSON.stringify({
                codEstab_Asig: obj.codEstab_Asig
            })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let bodegasAsignadas = [];
                if (response !== null && typeof response === 'object') {
                    bodegasAsignadas = response.
                        bodegasAsignadas;
                }
                return bodegasAsignadas;
            })
        }

        function put(idPtoEmi_Asig) {
            return mS.getData('put', `${url}${idPtoEmi_Asig}`, null, true)
        }

        function post(data) {
            return mS.getData('post', `${url}`, { data }, true)
        }








    }])

})(window.angular);


(function () {
'use strict';

app.factory('puntoEmisionService', ['$injector', function ($injector) {
    let url = '/Config/PuntoEmision/'








}])

app.factory('puntoEmisionAsignacionService', ['$injector', function ($injector) {
    let url = 'Config/PtoEmiAsig/'
    let mS = $injector.get('mainService');

    return {
        get,
        put,
        post
    }

    function get(obj) {
        let params = JSON.stringify({
            codEstab_Asig: obj.codEstab_Asig
        })
        return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
            let puntosEmisionAsignadas = [];
            if (response !== null && typeof response === 'object') {
                puntosEmisionAsignadas = response.puntosEmisionAsignadas;
            }
            return puntosEmisionAsignadas;
        })
    }

    function put(idPtoEmi_Asig){
        return mS.getData('put', `${url}${idPtoEmi_Asig}`, null, true)
    }

    function post(data) {
        return mS.getData('post', `${url}`, {data}, true)
    }







}])

})(window.angular)