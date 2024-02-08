(function () {

    'use strict';
    const PATH_API = 'Contabilidad/'

    app.factory('comprobanteIngresoService', ['mainService', function (mS) {
        const url = `Contabilidad/ComprobanteIngreso/`
        return {
            getAll,
            post,
            mapperTo
        }

        function getAll(obj) {
            let params = JSON.stringify(obj)
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {

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
                            serieComprobante: compIngreso.nroDoc,
                            comprobante: 'Comprobante Ingreso',
                            esAnulado: compIngreso.color === 'table-danger'
                        }
                    })
                    return results;
                }
            })
        }

        function mapperTo(obj) {
            const {
                comprobante,
                cobros,
                cobroDetalle,
                historialCobros,
            } = obj;
            console.log(obj)

            let comprobanteMappeado = {
                idCliente: comprobante.idCliente,
                total: comprobante.total,
                abono: comprobante.abono,
                codEstab: comprobante.codEstab,
                numeroIdentificacion: comprobante.numeroIdentificacion,
                nombreFiscal: comprobante.nombreFiscal
            }


            let comprosMappeado = cobros.map(cobro => {
                return {
                    idSubEntidadFinanciera: cobro.idSubEntidadFinanciera,
                    idEntidadFinanciera: cobro.idEntidadFinanciera,
                    idBanco: cobro.idBanco,
                    idCuentaBancaria: cobro.idCuentaBancaria,
                    fechaEmision: cobro.fechaEmision,
                    valor: cobro.valor,
                    posfechado: cobro.posfechado,
                    secuencial: cobro.secuencial,
                    infoCobro: cobro.infoCobro,
                    abono: cobro.abono,
                    controlCaja: cobro.controlCaja,
                }
            })

            const cobroDetalleMappeado = cobroDetalle.map(detalle => {
                return {
                    idCuentaPorCobrar: detalle.idCuentaPorCobrar,
                    idCuotaPorCobrar: detalle.idCuotaPorCobrar,
                    abono: detalle.abono,
                    interes: detalle.interes,
                    diasMora: detalle.diasMora,
                    mora: detalle.mora,
                    cuota: detalle.cuota,
                    saldo: detalle.saldoOriginal,
                    secuencial: detalle.secuencial,
                }
            })

            const historialCobrosMappeado = historialCobros.map(hc => {
                return {
                    idCuentaPorCobrar: hc.idCuentaPorCobrar,
                    abono: hc.abono,
                    diasMora: hc.diasMora,
                    mora: hc.mora,
                    saldo: hc.saldo,
                }
            })

            const objComprobanteIngreso = {
                comprobante: comprobanteMappeado,
                cobros: comprosMappeado,
                cobroDetalle: cobroDetalleMappeado,
                historial: historialCobrosMappeado,
            }
            return objComprobanteIngreso;
        }

        function post(data) {
            return mS.getData('post', url + 'Insert', { data }, true)
        }
    }]);


    app.factory('cuentaPorCobrarService', ['mainService', 'formulario', function (mS, fS) {
        const url = 'Contabilidad/CuentaPorCobrar/';
        return {
            getDataFilter,
            getAll,
            getCuotasById,
            getDataForm,
            getCuotaByToGenerate,
            saveCuota,
            applyMora,
            updateCuota,
            getEstadisticas
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
                        codEstado: cxc.codEstado,
                        idCliente: cxc.idCliente,
                        codEstab: cxc.codEstab,
                        identificacionComprador: cxc.identificacionComprador,
                        diasMora: cxc.diasMora,
                        mora: cxc.mora
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

        function getCuotasById(id) {
            const params = JSON.stringify({ idCuentaPorCobrar: id, tipo: 8 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (response) {

                    return response.cuotas.map(cuota => {
                        return {
                            idCuotaPorCobrar: cuota.idCuotaPorCobrar,
                            idCuentaPorCobrar: cuota.idCuentaPorCobrar,
                            nroCuota: cuota.nroCuota,
                            cuota: cuota.cuota,
                            mora: cuota.mora,
                            interes: cuota.interes,
                            diasMora: cuota.diasMora,
                            abono: cuota.abono,
                            saldoCta: cuota.saldoCta,
                            saldo: cuota.saldo,
                            estado: cuota.estado,
                            saldoOriginal: cuota.saldo
                        }
                    })
                }
                return []
            })
        }

        //sirve para traer datos para cobro por lote y por documento
        function getDataForm(idCuentaPorCobrar, idCliente) {
            const params = JSON.stringify({ idCuentaPorCobrar, idCliente, tipo: 3 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (!response) return {};

                const { entidadFinanciera, banco, documentos, subEntidadFinanciera, provincia } = response;

                const resultEntidadesFinanciera = entidadFinanciera.map(ef => {
                    let filteredSubEntidadFinanciera = subEntidadFinanciera.filter(sef => sef.idEntidadFinanciera === ef.idEntidadFinanciera)
                    return {
                        idEntidadFinanciera: ef.idEntidadFinanciera,
                        descripcion: ef.descripcion,
                        detalle: ef.detalle,
                        codigo: ef.codigo,
                        subEntidadesFinanciera: filteredSubEntidadFinanciera
                    }
                })

                let cuentaPorCobrar = []
                //cuando el cobro es por documento 
                if (idCuentaPorCobrar > 0 && response.cuentaPorCobrar) {
                    cuentaPorCobrar = response.cuentaPorCobrar;
                    cuentaPorCobrar = cuentaPorCobrar.map(cxc => {
                        let cuotas = JSON.parse(cxc.cuotas);
                        let resultsCuotas = cuotas.map(cuota => {
                            return {
                                idCuotaPorCobrar: cuota.idCuotaPorCobrar,
                                idCuentaPorCobrar: cuota.idCuentaPorCobrar,
                                nroCuota: cuota.nroCuota,
                                cuota: cuota.cuota,
                                mora: cuota.mora,
                                interes: cuota.interes,
                                diasMora: cuota.diasMora,
                                abono: cuota.abono,
                                saldoCta: cuota.saldoCta,
                                saldo: cuota.saldo,
                                estado: cuota.estado,
                                saldoOriginal: cuota.saldo
                            }
                        })
                        return {
                            codEstab: cxc.codEstab,
                            idCliente: cxc.idCliente,
                            identificacionComprador: cxc.identificacionComprador,
                            razonSocialComprador: cxc.razonSocialComprador,
                            idCuentaPorCobrar: cxc.idCuentaPorCobrar,
                            serieComprobante: cxc.serieComprobante,
                            codDoc: cxc.codDoc,
                            fechaEmision: cxc.fechaEmision,
                            fechaVencimiento: cxc.fechaVencimiento,
                            importeTotal: cxc.importeTotal,
                            diasMora: cxc.diasMora,
                            mora: cxc.mora,
                            abono: cxc.abono,
                            saldo: cxc.saldo,
                            descripcion: cxc.descripcion,
                            cuotas: structuredClone(resultsCuotas),
                            cuotasOriginal: structuredClone(resultsCuotas)
                        }
                    })
                }

                let obj = {
                    entidadesFinanciera: resultEntidadesFinanciera,
                    bancos: banco,
                    documentos,
                    ciudades: provincia,
                    cuentaPorCobrar
                }
                return obj;
            })
        }

        //Obtener cuotas para generar cuotas 
        function getCuotaByToGenerate(idCuentaPorCobrar) {
            const params = JSON.stringify({ idCuentaPorCobrar, tipo: 2 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (!response) throw response;

                let { cuentaPorCobrar, cuotas, tiempoCredito } = response;

                let dataCuentaPorCobrar = cuentaPorCobrar[0];
                let tiemposCredito = tiempoCredito.map(tc => {
                    return {
                        idTiempoCredito: tc.idTiempoCredito,
                        descripcion: tc.descripcion,
                        diasCredito: tc.diasCredito,
                        numeroCuota: tc.numeroCuota,
                        tiempoCredito: tc.tiempoCredito,
                    }
                })

                let resultCuotas = cuotas.map(cxc => {
                    return {
                        idCuotaPorCobrar: cxc.idCuotaPorCobrar,
                        nroCuota: cxc.nroCuota,
                        cuota: cxc.cuota,
                        interes: cxc.interes,
                        diasMora: cxc.diasMora,
                        mora: cxc.mora,
                        abono: cxc.abono,
                        saldoCta: cxc.saldoCta,
                        saldo: cxc.saldo,
                        fechaVencimiento: cxc.fechaVencimiento,
                        estado: cxc.estado,
                        codEstado: cxc.codEstado,
                    }
                })

                return {
                    cuentaPorCobrar: {
                        identificacionComprador: dataCuentaPorCobrar.numeroIdentificacion,
                        razonSocialComprador: dataCuentaPorCobrar.nombreFiscal,
                        fechaEmision: dataCuentaPorCobrar.fechaEmision,
                        serieComprobante: dataCuentaPorCobrar.serieComprobante,
                        importeTotal: dataCuentaPorCobrar.importeTotal,
                        idTiempoCredito: dataCuentaPorCobrar.idTiempoCredito,
                        codEstado: dataCuentaPorCobrar.codEstado,
                        config: dataCuentaPorCobrar.config,
                        tipoConfig: dataCuentaPorCobrar.tipoConfig,
                        interes: dataCuentaPorCobrar.interes,
                    },
                    tiemposCredito,
                    cuotas: resultCuotas

                }
            })
        }

        function saveCuota(data) {
            return mS.getData('post', `${url}Insert/Cuota`, { data }, true)
        }

        function applyMora(obj) {
            const params = JSON.stringify({ ...obj, tipo: 4 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (!response) throw "No se completo el proceso!";

                let { cuotas } = response;
                return cuotas || [];
            })
        }

        function updateCuota(data) {
            return mS.getData('put', `${url}Update/Cuota`, { data }, true)
        }

        function getEstadisticas(params) {
            return mS.getData('get', `/EstadisticaVenta/Get?json=${JSON.stringify(params)}`).then(response => {
                if (response.code === "0") return []
                return response;
            });
        }
    }])
})(window.angular)