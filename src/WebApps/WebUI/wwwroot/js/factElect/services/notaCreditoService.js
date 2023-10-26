(function () {

    'use strict';

    function groupEstab(estabsAndPuntosEmision){
        const estabs = estabsAndPuntosEmision.reduce((acc, item) => {
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
        return estabs;
    }

    app.factory('notaCreditoService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'FactElect/NotaCredito/'
        const service = {};

        /**
         * tipo 1: get credit notes
         * tipo 5: get data for formulario   
         * @returns 
         */
        service.get = (params) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    if(params.tipo===1){
                        let tempNotasCredito = mainData[0]; 
                        return tempNotasCredito;
                    }

                    if (params.tipo === 3) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let estadosDoc = mainData[1];
                        let estabs = groupEstab(tempEstabsAndPtosEmision);
                        return {
                            estabs,
                            estadosDoc
                        }
                    }
                    
                    if(params.tipo===2){
                        console.log(mainData)
                        let tempEstabsAndPtosEmision = mainData[0];
                        let tempBodegas = mainData[1];
                        let tarifaImpuestoVigente = mainData[2][0];
                        let decimal = mainData[3][0];
                        let tarifasImpuesto = mainData[4];
                        let tarifas = mainData[5];
                        let config = mainData[6][0];
                        let vendedores = mainData[7]; 
                        let tempEstabs = groupEstab(tempEstabsAndPtosEmision);

                        let estabs = tempEstabs.map(estab => ({
                            ...estab,
                            bodegas: tempBodegas.filter(bodega => (bodega.idEstablecimiento === estab.idEstablecimiento))
                                .map(bodega => ({
                                    idBodega: bodega.idBodega,
                                    bodega: bodega.bodega,
                                    descripcion: bodega.bodega,
                                    defaultBodega: bodega.defaultBodega,
                                }))
                        }))
                        return {
                            estabs,
                            tarifaImpuestoVigente,
                            decimal,
                            tarifasImpuesto,
                            tarifas,
                            config,
                            vendedores 
                        }
                    }
                }
            })
        }

        service.post = function (data) {
            return mS.getData('post', URL, data, true)
        }

        service.put = function (id, data) {
            return mS.getData('put',`${URL}${id}`, data, true)
        }

        service.delete = function (id) {
            return mS.getData('delete', `${URL}${id}`, null, true)
        }


        return service;



    });


})(window.angular)