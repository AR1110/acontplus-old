(function () {
    'use strict';

    app.factory('chequeService', ['mainService', 'formulario', function (mS, fS) {
        const url = `Contabilidad/Cheque/`;

        return {
            getAll,
            getDataFilter
        }

        function getAll(obj) {
            let params = JSON.stringify({
                ...obj,
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let cheques = [];
                if (response !== null && typeof response === 'object') {
                    let itemsTemp = response.cheques;

                    cheques = itemsTemp;
                }

                return {
                    cheques
                }
            })
        }


        function getDataFilter() {
            let params = JSON.stringify({
                tipo: 2
            })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let estabs = [];
                if (response !== null && typeof response === 'object') {
                    let tempEstabs = response.estabs;
                    let dataToGroup = {
                        estabs: tempEstabs, //Establecimientos con puntos de emision 
                    }
                    estabs = fS.groupingEstab(dataToGroup);
                }
                return {
                    estabs
                }
            })
        }



    }])




})(window.angular)