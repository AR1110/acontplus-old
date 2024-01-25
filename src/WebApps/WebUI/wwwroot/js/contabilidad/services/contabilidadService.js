(function () {

    'use strict';
    const PATH_API = 'Contabilidad/'
    app.factory('cuentaPorCobrarService', function ($injector) {
        const url = `${PATH_API}CuentaPorCobrar/`
        const mS = $injector.get('mainService');
        const fS = $injector.get('formulario');

        return {
            getDataFilterReport
        }

        function getDataFilterReport() {
            return mS.getData('get', `${url}?json=${JSON.stringify({ tipo: 6 })}`, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
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




    app.factory('comprobanteIngresoService', ['mainService', function (mS) {
        const url = `Contabilidad/ComprobanteIngreso/`
        return {
            getAll
        }

        function getAll(obj) {
            let params = JSON.stringify(obj)
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                console.log(response)
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    const [comprobantesIngreso] = JSON.parse(response.payload);
                    const results = comprobantesIngreso.map(compIngreso => {
                        return {
                            codDoc: 'CI',
                            idComprobanteIngreso: compIngreso.idComprobanteIngreso,
                            idDocumento: compIngreso.idDocumento,
                            codEstab: compIngreso.codEstab,
                            total: compIngreso.total,
                            fechaRegistro: compIngreso.fechaRegistro,
                            abono: compIngreso.abono,
                            cambio: compIngreso.cambio,
                            nroDoc: compIngreso.nroDoc,
                            cliente: compIngreso.cliente,
                            nroIdentificacion: compIngreso.nroIdentificacion,
                            caja: compIngreso.caja,
                            style: compIngreso.style,
                            estado: compIngreso.estado,
                            usuario: compIngreso.usuario,
                            serieComprobante: item.nroDoc,
                            comprobante: 'Comprobante Ingreso',
                            esAnulado: item.color === 'table-danger'
                        }
                    })
                    return results;
                }
            })
        }
    }]);


    app.factory('cuentaPorCobrarService', ['mainService', 'formulario', function (mS, fS) {
        const url = 'Contabilidad/CuentaPorCobrar/';
        return {
            getDataFilter,
            getAll
        }

        function getDataFilter() {
            const params = JSON.stringify({ tipo: 6 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (!response) throw response;

                const { establecimientos, estadoPago, tipoDocumento } = response;
                let dataToGroup = {
                    estabs: establecimientos, //Establecimientos con puntos de emision 
                }
                let estabs = fS.groupingEstab(dataToGroup);

                return {
                    estabs,
                    estadosDoc: estadoPago,
                    tiposDoc: tipoDocumento
                }
            })
        }

        function getAll(obj) {
            const params = JSON.stringify({ ...obj, tipo: 1 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (!response) throw response


                const { cuentasPorCobrar } = response;

                const results = cuentasPorCobrar.map(cxc => {
                    return {
                        idCuentaPorCobrar: cxc.idCuentaPorCobrar,
                        codDoc: cxc.codDoc,
                        razonSocialComprador: cxc.razonSocialComprador,
                        serieComprobante: cxc.serieComprobante,
                        fechaEmision: cxc.fechaEmision,
                        fechaVencimiento: cxc.fechaVencimiento,
                        importeTotal: cxc.importeTotal,
                        abono: cxc.abono,
                        saldo: cxc.saldo,
                        tiempoCredito: cxc.tiempoCredito,
                        estado: cxc.estado,
                    }
                })

                let dataFiltered = cuentasPorCobrar[0];


                return {
                    cuentasPorCobrar: results,
                    totalRecords: dataFiltered && dataFiltered.totalRecords || 0,
                    totalVenta: dataFiltered && dataFiltered.totalVenta || 0,
                    totalAbono: dataFiltered && dataFiltered.totalAbono || 0,
                    totalSaldo: dataFiltered && dataFiltered.totalSaldo || 0,
                };

            })
        }

    }])
})(window.angular)