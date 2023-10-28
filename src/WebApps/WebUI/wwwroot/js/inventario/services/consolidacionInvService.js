(function () {

    'use strict';
    app.factory('consolidacionInvService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Inventario/Consolidacion/';

        const service = {};

        service.get = function (query) {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload) || [];

                    if (query.tipo === 1) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let tempBodegas = mainData[1];
                        let tempSubFamilias = mainData[2];
                        let config = JSON.parse(mainData[3][0].jsonConfig).find(x => x.codTransaccion == 'AL')

                        const tempEstabs = tempEstabsAndPtosEmision.reduce((acc, item) => {
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

                        let estabs = tempEstabs.map(estab => ({
                            ...estab,
                            bodegas: tempBodegas.filter(bodega => (bodega.idEstablecimiento === estab.idEstablecimiento))
                                .map(bodega => ({
                                    idBodega: bodega.idBodega,
                                    bodega: bodega.bodega,
                                    defaultBodega: bodega.defaultBodega,
                                }))
                        }))

                        return {
                            estabs,
                            subFamilias: tempSubFamilias,
                            config
                        }
                    }

                    if (query.tipo === 2 || query.tipo === 4) {
                        return mainData[0];
                    }

                }
            })
        }

        service.post = function (data) {
            return mS.getData('post', `${URL}`, { data: data }, true);
        }

        service.put = function (id, data) {
            return mS.getData('put', `${URL}${id}?json=${JSON.stringify(data)}`, null, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', URL + '?id=' + id, null, true);
        }

        return service;
    })
})(window.angular)