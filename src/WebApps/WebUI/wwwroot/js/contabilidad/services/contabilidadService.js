(function () {

    'use strict';
    const PATH_API = 'Contabilidad/'

    //Contabilidad Pagos 

    app.factory('cuentaPorPagarService', ['$injector', 'formulario', function ($injector, fS) {
        const mS = $injector.get('mainService');
        const url = 'Contabilidad/CuentaPorPagar/';

        return {
            get,
            post,
            put,
            getDataFilter,
            getAll,
            getCuotasById,
            getDataFormaPago,
            getDataFormCuota,
            getHistorialPago,
            getCuotas
        }

        function getAll(obj) {
            const json = JSON.stringify({
                ...obj,
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let cuentasPorPagar = [];
                if (response.code === "1") {
                    const [tempData] = JSON.parse(response.payload);
                    cuentasPorPagar = tempData;
                } else {
                    console.log(response)
                }

                let results = cuentasPorPagar.map(item => {
                    return {
                        idCuentaPorPagar: item.idCuentaPorPagar,
                        idTiempoCredito: item.idTiempoCredito,
                        idProveedor: item.idProveedor,
                        codEstab: item.codEstab,
                        identificacionComprador: item.identificacion,
                        razonSocialComprador: item.nombreFiscal,
                        codDoc: item.codDoc,
                        serieComprobante: item.serieComprobante,
                        fechaEmision: item.fechaEmision,
                        fechaVencimiento: item.fechaVencimiento,
                        importeTotal: item.importeTotal,
                        abono: item.abono,
                        saldo: item.saldo,
                        diasCredito: item.diasCredito,
                        estado: item.estado,
                        codEstado: item.codPago,
                        colorRow: item.colorRow,
                        totalRecords: item.totalRecords
                    }
                })
                return results;
            })
        }

        function get(obj) {
            let params = {
                ...obj,
                tipo: ('tipo' in obj) ? obj.tipo : 1
            }
            return mS.getData('get', `${url}?json=${JSON.stringify(params)}`, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload) || [];

                    if (params.tipo === 1) {
                        return mainData[0]
                    }

                    if (params.tipo === 2) {
                        return {
                            cuotas: mainData[0]
                        }
                    }

                    if (params.tipo === 4) {
                        console.log(mainData)
                    }

                    if (params.tipo === 5) {
                        return {
                            tiemposCredito: mainData[0]
                        }
                    }
                }
            })
        }

        function post(data){
            return mS.getData('post', `${url}` + JSON.stringify(data), null, true)
        }
        
        function put(id, data){
            return mS.getData('put', `${url}` + id, data, true)
        }

        function getDataFilter() {
            return mS.getData('get', `${url}?json=${JSON.stringify({ tipo: 6 })}`, null, true).then(response => {
                if (response.code === "0") {
                    console.log(response)
                    return {}
                }
                const [tempEstabs, tempEstados] = JSON.parse(response.payload)

                let dataToGroup = {
                    estabs: tempEstabs, //Establecimientos con puntos de emision 
                }
                let estabs = fS.groupingEstab(dataToGroup);

                let estadosDoc = tempEstados.map(estado => {
                    return {
                        idEstado: estado.idEstadoPago,
                        descripcion: estado.descripcion,
                        codigo: estado.codigo,
                    }
                })

                return {
                    estabs,
                    estadosDoc
                }

            })
        }

        function getCuotasById(id) {
            let json = JSON.stringify({
                idCuentaPorPagar: id,
                codPago: 'PE',
                tipo: 2
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let cuotas = [];
                if (response.code === "1") {
                    const [tempData] = JSON.parse(response.payload) || [];
                    cuotas = tempData;
                } else {
                    console.log(response)
                }
                const results = cuotas.map(item => {
                    return {
                        idCuentaPorPagar: item.idCuentaPorPagar,
                        idCuotaPorPagar: item.idCuotaPorPagar,
                        fechaVencimiento: item.fechaVencimiento,
                        nroCuota: item.nroCuota,
                        cuota: item.cuota,
                        abono: item.abono,
                        saldo: item.saldo,
                        descripcion: item.descripcion,
                        estado: item.descripcion,
                        codigo: item.codigo,
                        saldoCta: item.saldoCta,
                        saldoOriginal: item.saldo
                    }
                })
                return results;
            })
        }


        function getDataFormaPago(idProveedor) {
            const json = JSON.stringify({
                tipo: 3,
                idProveedor
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                const data = {
                    entidadesFinancieras: [],
                    bancos: [],
                    ciudades: [],
                    docs: []
                }
                if (response.code === "0") {
                    console.log(response)
                }
                if (response.code === "1") {
                    const mainData = JSON.parse(response.payload);
                    const [entidadesFinancierasTemp, subEntidadesFinancieraTemp, bancoTemp, ciudadesTemp, docsTemp] = mainData;

                    data.entidadesFinancieras = entidadesFinancierasTemp.map(item => {
                        let subEntidadesFinanciera = subEntidadesFinancieraTemp.filter(sef => sef.idEntidadFinanciera === item.idEntidadFinanciera);

                        return {
                            idEntidadFinanciera: item.idEntidadFinanciera,
                            descripcion: item.descripcion,
                            detalle: item.detalle,
                            codigo: item.codigo,
                            idFormaPagoSri: item.idFormaPagoSri,
                            subEntidadesFinanciera: subEntidadesFinanciera.map(sef => {
                                return {
                                    idSubEntidadFinanciera: sef.idSubEntidadFinanciera,
                                    idEntidadFinanciera: sef.idEntidadFinanciera,
                                    descripcion: sef.descripcion,
                                    codigo: sef.codigo,
                                    predeterminado: sef.predeterminado,
                                    controlCaja: sef.controlCaja,
                                }
                            })
                        }
                    })

                    data.bancos = bancoTemp.map(b => {
                        return {
                            idBanco: b.idBanco,
                            descripcion: b.descripcion,
                        }
                    })

                    data.ciudades = ciudadesTemp;
                    data.docs = docsTemp; 
                }

                return data;
            })

        }

        function getDataFormCuota(){
            const json = JSON.stringify({
                tipo: 5, 
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                const data = {
                    tiemposCredito: [],
                }
                if(response.code==="0"){
                    console.log(response)
                }
                if(response.code==="1"){
                    const [tiemposCredito] = JSON.parse(response.payload ); 
                    data.tiemposCredito = tiemposCredito;
                }
                return data;                
            })
        }


        function getHistorialPago(id) {
            let json = JSON.stringify({
                idCuentaPorPagar: id,
                tipo: 4
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let historiales = [];
                if (response.code === "0") {
                    console.log(historiales)
                }
                if (response.code === "1") {
                    const [mainData] = JSON.parse(response.payload) || [];
                    historiales = mainData.map(item => {
                        return {
                            nroIdentificacion: item.nroIdentificacion,
                            nombreFiscal: item.nombreFiscal,
                            total: item.total,
                            tipoDocumento: item.tipoDocumento,
                            usuario: item.usuario,
                            estado: item.estado,
                            fechaRegistro: item.fechaRegistro,
                        }
                    })
                }

                return historiales;
            })
        }

        /**
         * Modificacion de cuotas
         * @param {*} id 
         */
        function getCuotas(id) {
            let json = JSON.stringify({ idCuentaPorPagar: id, tipo: 2 });
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let cuotas = [];
                if (response.code === "0") {
                    console.log(response)
                }
                if (response.code === "1") {
                    const [mainData] = JSON.parse(response.payload)
                    cuotas = mainData.map(item => {
                        return {
                            idCuotaPorPagar: item.idCuotaPorPagar,
                            idCuentaPorPagar: item.idCuentaPorPagar,
                            fechaVencimiento: item.fechaVencimiento,
                            nroCuota: item.nroCuota,
                            cuota: item.cuota,
                            abono: item.abono,
                            saldo: item.saldo,
                            descripcion: item.descripcion,
                            codigo: item.codigo,
                        }
                    })
                }
                return cuotas;
            })
        }

    }])

    app.factory('comprobanteEgresoService', ['mainService', 'formulario', function (mS, fS) {
        const url = `${PATH_API}ComprobanteEgreso/`

        return {
            getDataFilter,
            getAll,
            mapperTo,
            post,
            anular,
            update,
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

        function getAll(obj) {
            let params = JSON.stringify({
                ...obj,
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let comprobantesEgreso = [];
                if (response !== null && typeof response === 'object') {
                    const items = response.comprobantesEgreso;
                    comprobantesEgreso = items.map(item => {
                        return {
                            idComprobanteEgreso: item.idComprobanteEgreso,
                            total: item.total,
                            fechaRegistro: item.fechaRegistro,
                            nroDoc: item.nroDoc,
                            persona: item.persona,
                            nroIdentificacion: item.nroIdentificacion,
                            caja: item.caja,
                            color: item.color,
                            estado: item.estado,
                            usuario: item.usuario,
                            totalRecords: item.totalRecords
                        }
                    })
                }
                return comprobantesEgreso;
            })
        }

        function mapperTo(obj) {
            const {
                comprobante,
                pagos,
                pagosDetalle,
                historialCuentas,
            } = obj;

            let comprobanteMappeado = {
                idProveedor: comprobante.idProveedor,
                total: comprobante.total,
                abono: comprobante.abono,
                codEstab: comprobante.codEstab,
                nroIdentificacion: comprobante.identificacionComprador,
                nombreFiscal: comprobante.razonSocialComprador
            }

            let pagosMappeado = pagos.map(item => {
                return {
                    idSubEntidadFinanciera: item.idSubEntidadFinanciera,
                    idEntidadFinanciera: item.idEntidadFinanciera,
                    idBanco: item.idBanco,
                    idCuentaBancaria: item.idCuentaBancaria,
                    idTipoDocumento: item.idTipoDocumento,
                    idComprobante: item.idComprobante,
                    fechaEmision: item.fechaEmision,
                    nro: item.nro,
                    valor: item.valor,
                    posfechado: item.posfechado,
                    cobro: item.cobro,
                    secuencial: item.secuencial,
                    lote: item.lote,
                    infoCobro: item.infoCobro,
                    aprobacion: item.aprobacion,
                    referencia: item.referencia,
                    abono: item.abono,
                    controlCaja: item.controlCaja,
                }
            })

            const pagosDetalleMappeado = pagosDetalle.map(item => {
                return {
                    idCuotaPorPagar: item.idCuotaPorPagar,
                    saldo: fS.roundNumber(item.saldoOriginal, 5),
                    abono: fS.roundNumber(item.abono, 5),
                    secuencial: item.secuencial
                }
            })

            const historialCuentasMappeado = historialCuentas.map(item => {
                return {

                    idCuentaPorPagar: item.idCuentaPorPagar,
                    saldo: fS.roundNumber(item.saldo, 5),
                    abono: fS.roundNumber(item.abono, 5),
                    secuencial: item.secuencial
                }
            })

            const params = {
                comprobante: comprobanteMappeado,
                pagos: pagosMappeado,
                pagoDetalle: pagosDetalleMappeado,
                historial: historialCuentasMappeado
            }
            return params;
        }

        function post(data) {
            return mS.getData('post', url, { data }, true)
        }

        function update(data) {
            return mS.getData('put', `${url}`, { data }, true)
        }


        function anular(id, observacion) {
            return mS.getData('delete', `${url}${id}?observacion=${observacion}`, null, true)
        }

    }])


    /**
     * COBROS 
     */
    app.factory('comprobanteIngresoService', ['mainService', 'formulario', function (mS, fS) {
        const url = `Contabilidad/ComprobanteIngreso/`
        return {
            getAll,
            post,
            mapperTo,
            getHistorialCobrosById,
            getHistorialCobrosByDoc,
            update
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
                    idBanco: fS.isValidField(cobro.idBanco),
                    idCuentaBancaria: fS.isValidField(cobro.idCuentaBancaria),
                    fechaEmision: cobro.fechaEmision,
                    valor: cobro.valor,
                    posfechado: cobro.posfechado,
                    secuencial: cobro.secuencial,
                    infoCobro: cobro.infoCobro,
                    abono: cobro.abono,
                    controlCaja: cobro.controlCaja,
                    idComprobante: fS.isValidField(cobro.idComprobante),
                    idTipoDocumento: fS.isValidField(cobro.idTipoDocumento)
                }
            })

            const cobroDetalleMappeado = cobroDetalle.map(detalle => {
                return {
                    idCuentaPorCobrar: detalle.idCuentaPorCobrar,
                    idCuotaPorCobrar: detalle.idCuotaPorCobrar,
                    abono: fS.roundNumber(detalle.abono, 5),
                    interes: detalle.interes,
                    diasMora: detalle.diasMora,
                    mora: detalle.mora,
                    cuota: fS.roundNumber(detalle.cuota, 5),
                    saldo: fS.roundNumber(detalle.saldoOriginal, 5),
                    secuencial: detalle.secuencial,
                }
            })

            const historialCobrosMappeado = historialCobros.map(hc => {
                return {
                    idCuentaPorCobrar: hc.idCuentaPorCobrar,
                    abono: fS.roundNumber(hc.abono, 5),
                    diasMora: hc.diasMora,
                    mora: hc.mora,
                    saldo: fS.roundNumber(hc.saldo, 5),
                    secuencial: hc.secuencial
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

        function getHistorialCobrosById(idComprobanteIngreso) {
            let params = JSON.stringify({ idComprobanteIngreso, tipo: 2 })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                let mainDataRepository = JSON.parse(response.payload);

                let comprobante = mainDataRepository[0][0];
                let cobros = mainDataRepository[1];
                let cobroDetalles = mainDataRepository[2];

                for (let item of cobros) {
                    item.infoCobro = JSON.parse(item.infoCobro)
                    item.cobroDetalles = $scope.cobroDetalles.filter(itemDetalle => itemDetalle.idCobro === item.idCobro);
                    item.showInfoCobro = item.codPago !== 'EFE'
                }

                return {
                    comprobante,
                    cobros,
                    cobroDetalles
                }
            })
        }
        function getHistorialCobrosByDoc(idCuentaPorCobrar) {
            let params = JSON.stringify({ idCuentaPorCobrar, tipo: 3 })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }


                let mainDataRepository = JSON.parse(response.payload);

                let comprobante = mainDataRepository[0][0];
                let comprobanteIngresos = mainDataRepository[1];

                let cobros = mainDataRepository[2];
                let cobroDetalles = mainDataRepository[3];



                for (let item of cobros) {
                    item.infoCobro = JSON.parse(item.infoCobro)
                    item.cobroDetalles = cobroDetalles.filter(itemDetalle => itemDetalle.idCobro === item.idCobro);

                }

                comprobanteIngresos = comprobanteIngresos.map(item => {
                    item.cobros = cobros.filter(cc => cc.idComprobanteIngreso === item.idComprobanteIngreso)
                        .map(cobro => {
                            cobro.infoCobro = cobro.infoCobro
                            cobro.showInfoCobro = cobro.codPago !== 'EFE'
                            return cobro;
                        })
                    return item;
                })

                return {
                    comprobante,
                    cobroDetalles,
                    comprobanteIngresos
                }
            })
        }

        //==================SE USA EN CHEQUE===========
        function update(data) {
            return mS.getData('put', `${url}`, { data }, true)
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
                            saldoTemporal: cxc.saldo,
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