(function () {
    'use strict';

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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
                let puntosEmisionAsignadas = [];
                if (response !== null && typeof response === 'object') {
                    puntosEmisionAsignadas = response.puntosEmisionAsignadas;
                }
                return puntosEmisionAsignadas;
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

    app.service('PolicyService', ['mainService', 'APP_CONSTANTS', function (mS, APP_CONSTANTS) {

        const endpoint = 'Config/GeneralConfig'; // Replace with your actual endpoint

        // Generic function to send any policy
        this.sendPolicy = function (codePolicy, tipo) {
            const json = JSON.stringify({
                codeApp: APP_CONSTANTS.CODE_APP,
                codePolicy: codePolicy,
                tipo: tipo || APP_CONSTANTS.TYPES.ADVANCED
            });
            return mS.getData('get', `${endpoint}?json=${json}`).then(response => {
                if (response.code === "1") {
                    let parsedPayload;
                    try {
                        parsedPayload = JSON.parse(response.payload);
                    } catch (e) {
                        return null;
                    }
                    const table = Array.isArray(parsedPayload.data) ? parsedPayload.data : [];


                    for (let i = 0; i < table.length; i++) {
                        const row = table[i];
                        if (row.code === '0') {
                            Swal.fire({
                                icon: 'warning',
                                html: row.message
                            })
                            throw new Error(row.message)
                        }
                    }
                    return table;

                }
            })
        };

        // Specific helpers for reuse
        this.sendMaxUsers = function () {
            return this.sendPolicy(APP_CONSTANTS.POLICIES.MAX_USERS);
        };

        this.sendMaxDocuments = function () {
            return this.sendPolicy(APP_CONSTANTS.POLICIES.MAX_DOCUMENTS);
        };

        this.sendMaxInventoryItems = function () {
            return this.sendPolicy(APP_CONSTANTS.POLICIES.MAX_INVENTORY_ITEMS);
        };

        this.sendMaxWarehouses = function () {
            return this.sendPolicy(APP_CONSTANTS.POLICIES.MAX_WAREHOUSES);
        };

        this.sendMaxEstablishments = function () {
            return this.sendPolicy(APP_CONSTANTS.POLICIES.MAX_ESTABLISHMENTS);
        };


    }])



})(window.angular)
