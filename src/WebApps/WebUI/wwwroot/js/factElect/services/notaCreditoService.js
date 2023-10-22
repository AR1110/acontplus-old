(function () {

    'use strict';

    app.factory('notaCreditoService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'FactElect/NotaCredito/'
        const service = {};

        /**
         * tipo 1: get credit notes  
         * @returns 
         */
        service.get = (params) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    if (params.tipo === 3) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let estadosDoc = mainData[1];

                        const estabs = tempEstabsAndPtosEmision.reduce((acc, item) => {
                            const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                            if (!existingItem) {
                                acc.push({
                                    idEstablecimiento: item.idEstablecimiento,
                                    nombreComercial: item.nombreComercial,
                                    codEstab: item.codEstab,
                                    defaultEstab: item.defaultEstab,
                                    puntosEmision: [{
                                        idPuntoEmision: item.idPuntoEmision,
                                        ptoEmi: item.ptoEmi,
                                        defaultPtoEmi: item.defaultPtoEmi
                                    }]
                                });
                            } else {
                                existingItem.puntosEmision.push({
                                    idPuntoEmision: item.idPuntoEmision,
                                    ptoEmi: item.ptoEmi,
                                    defaultPtoEmi: item.defaultPtoEmi
                                });
                            }
                            return acc;
                        }, []);


                        return {
                            estabs,
                            estadosDoc
                        }
                    }

                    if(params.tipo===1){
                        let tempNotasCredito = mainData[0]; 
                        return tempNotasCredito;
                    }
                }
            })
        }


        service.delete = function (id) {
            return mainService.getData('delete', url + 'Delete/' + id, null, true)
        }


        return service;



    });


})(window.angular)