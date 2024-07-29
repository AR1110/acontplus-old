//@ts-check
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
                        numAutDocSustento: item.numAutDocSustento,
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

                    }

                    if (params.tipo === 5) {
                        return {
                            tiemposCredito: mainData[0]
                        }
                    }
                }
            })
        }

        function post(data) {
            return mS.getData('post', `${url}` + JSON.stringify(data), null, true)
        }

        function put(id, data) {
            return mS.getData('put', `${url}` + id, data, true)
        }

        function getDataFilter() {
            return mS.getData('get', `${url}?json=${JSON.stringify({ tipo: 6 })}`, null, true).then(response => {
                if (response.code === "0") {
                    console.log(response)
                    return {}
                }
                const [tempEstabs, tempEstados, tiposDoc] = JSON.parse(response.payload)

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
                    estadosDoc,
                    tiposDoc
                }

            })
        }




        function getDataFormCuota() {
            const json = JSON.stringify({
                tipo: 5,
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                const data = {
                    tiemposCredito: [],
                }
                if (response.code === "0") {
                    console.log(response)
                }
                if (response.code === "1") {
                    const [tiemposCredito] = JSON.parse(response.payload);
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
            getCuotasByIdCuentaPorPagar,
            getDataFormaPago,
            getDataToDelete,
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
                            codEstab: item.codEstab,
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

        function getCuotasByIdCuentaPorPagar(id) {
            let json = JSON.stringify({
                idCuentaPorPagar: id,
                tipo: 4
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let results = [];
                if (response && typeof response === 'object') {
                    const { cuotas } = response;

                    results = cuotas.map(item => {
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
                            saldoOriginal: item.saldo,
                            valorSaldoLectura: item.saldo,
                        }
                    })

                }

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
                    docs: [],
                    estadosPago: []
                }

                if (response && typeof response === 'object') {
                    const {
                        entidadFinanciera,
                        subEntidadFinanciera,
                        banco,
                        ciudad,
                        documentos,
                        estadoPago
                    } = response;

                    data.entidadesFinancieras = entidadFinanciera.map(item => {
                        let subEntidadesFinanciera = subEntidadFinanciera.filter(sef => sef.idEntidadFinanciera === item.idEntidadFinanciera);

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

                    data.bancos = banco.map(b => {
                        return {
                            idBanco: b.idBanco,
                            descripcion: b.descripcion,
                        }
                    })


                    let docsRelacionados = documentos.map(item => {
                        return {
                            idComprobante: item.idComprobante,
                            idTipoDocumento: item.idTipoDocumento,
                            nroDocumento: item.nroDocumento,
                            tipoDocumento: item.tipoDocumento,
                            saldo: item.saldo,
                            numAutDocSustento: item.numAutDocSustento,
                            codDoc: item.codDoc,
                        }
                    })
                    data.ciudades = ciudad;
                    data.docs = docsRelacionados;
                    data.estadosPago = estadoPago;
                }

                return data;
            })

        }

        function getDataToDelete(id) {
            const json = JSON.stringify({
                tipo: 5,
                id
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let resultData = {};
                if (response && typeof response === 'object') {

                    let { cuentas, cuotas, estadoPago } = response;

                    resultData.cuentasPorPagar = cuentas;
                    resultData.cuotasPorPagar = cuotas;
                    resultData.estadosPago = estadoPago;
                } else {
                    throw new Error('Error en petición')
                }
                return resultData
            })
        }

        function mapperTo(obj) {
            const {
                comprobante,
                pagos,
                pagosDetalle,
                historialCuentas,
                cuentasPorPagarEstado,
                cuotasPorPagarEstado
            } = obj;



            let comprobanteMappeado = {
                idProveedor: comprobante.idProveedor,
                total: comprobante.total,
                abono: comprobante.abono,
                codEstab: comprobante.codEstab,
                nroIdentificacion: comprobante.identificacionComprador,
                nombreFiscal: comprobante.razonSocialComprador,
                observacion: fS.isValidField(comprobante.observacion)
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
                    observacion: fS.isValidField(item.observacion)
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
                let saldo = fS.roundNumber(item.saldo, 5)

                return {

                    idCuentaPorPagar: item.idCuentaPorPagar,
                    saldo,
                    abono: fS.roundNumber(item.abono, 5),
                    secuencial: item.secuencial
                }
            })

            const params = {
                comprobante: comprobanteMappeado,
                pagos: pagosMappeado,
                pagoDetalle: pagosDetalleMappeado,
                historial: historialCuentasMappeado,
                cuenta: cuentasPorPagarEstado,
                cuota: cuotasPorPagarEstado
            }
            return params;
        }

        function post(data) {
            return mS.getData('post', url, { data }, true)
        }

        function update(data) {
            return mS.getData('put', `${url}`, { data }, true)
        }


        function anular(id, data) {
            return mS.getData('put', `${url}${id}`, { data }, true)
        }

    }])


    /**
     * COBROS 
     */
    app.factory('comprobanteIngresoService', ['mainService', 'formulario', function (mS, fS) {
        const url = `Contabilidad/ComprobanteIngreso/`
        return {
            getAll,
            getDataForm,
            post,
            mapperTo,
            getHistorialCobrosById,
            getHistorialCobrosByDoc,
            update,
            cancel,
            getCuotasByIdCuentaPorCobrar,
            getDataToOverride
        }

        function newGenerateQuota(cuotas) {
            let resultsCuotas = cuotas.map(item => {
                return {
                    idCuotaPorCobrar: item.idCuotaPorCobrar,
                    idCuentaPorCobrar: item.idCuentaPorCobrar,
                    fechaVencimiento: item.fechaVencimiento,
                    //fechaVecimientoLectura: fS
                    nroCuota: item.nroCuota,
                    cuota: item.cuota,
                    mora: item.mora,
                    interes: item.interes,
                    diasMora: item.diasMora,
                    abono: item.abono,
                    saldoCta: item.saldoCta,
                    saldo: item.saldo,
                    estado: item.estado,
                    saldoOriginal: item.saldo,
                    valorSaldoLectura: item.saldo
                }
            })
            return resultsCuotas;
        }

        function getAll(obj) {

            let params = JSON.stringify({
                ...obj,
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let results = [];

                if (response.code === "1") {
                    const { comprobanteIngreso } = JSON.parse(response.payload);
                    results = comprobanteIngreso.map(item => {
                        return {
                            codDoc: 'CI',
                            idComprobanteIngreso: item.idComprobanteIngreso,
                            idDocumento: item.idDocumento,
                            codEstab: item.codEstab,
                            total: item.total,
                            fechaRegistro: item.fechaRegistro,
                            abono: item.abono,
                            cambio: item.cambio,
                            nroDoc: item.nroDoc,
                            cliente: item.cliente,
                            nroIdentificacion: item.nroIdentificacion,
                            caja: item.caja,
                            style: item.style,
                            estado: item.estado,
                            usuario: item.usuario,
                            serieComprobante: item.nroDoc,
                            comprobante: 'Comprobante Ingreso',
                            esAnulado: item.color === 'table-danger',
                            totalRecords: item.totalRecords
                        }
                    })
                }
                return results;
            })
        }

        function getDataForm(idCuentaPorCobrar, idCliente) {

            const params = JSON.stringify({ idCuentaPorCobrar, idCliente, tipo: 5 });
            try {

                return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                    // Inicializa el objeto resultante con estructuras vacías
                    const resultData = {
                        entidadesFinanciera: [],
                        bancos: [],
                        documentos: [],
                        ciudades: [],
                        cuentaPorCobrar: [],
                        estadosPago: [],
                        configCobro: {}
                    };


                    if (response.code === "1") {

                        const {
                            entidadFinanciera,
                            banco,
                            documentos,
                            subEntidadFinanciera,
                            provincia,
                            cuentaPorCobrar,
                            estadoPago,
                            config
                        } = JSON.parse(response.payload);
                        console.log(JSON.parse(response.payload))

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


                        //cuando el cobro es por documento 
                        if (Array.isArray(cuentaPorCobrar)) {
                            resultData.cuentaPorCobrar = cuentaPorCobrar.map(cxc => {
                                let cuotas = JSON.parse(cxc.cuotas) || [];
                                let resultsCuotas = newGenerateQuota(cuotas);
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
                                    valorSaldoLectura: cxc.saldo,
                                    descripcion: cxc.descripcion,
                                    cuotas: structuredClone(resultsCuotas),
                                    cuotasOriginal: structuredClone(resultsCuotas)
                                }
                            })
                        }

                        let configCobro = config[0];

                        resultData.entidadesFinanciera = resultEntidadesFinanciera;
                        resultData.bancos = banco;
                        resultData.documentos = documentos;
                        resultData.ciudades = provincia;
                        resultData.estadosPago = estadoPago;
                        resultData.configCobro = configCobro;

                    }
                    return resultData;
                })
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        }

        function getCuotasByIdCuentaPorCobrar(id) {
            const params = JSON.stringify({ idCuentaPorCobrar: id, tipo: 6 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let results = [];
                if (response.code === "1") {
                    let { cuotas } = JSON.parse(response.payload);
                    results = newGenerateQuota(cuotas);
                }
                return results;
            })
        }

        //obtiene datos para anular el comprobante de ingreso 
        function getDataToOverride(id) {
            const params = JSON.stringify({ id, tipo: 7 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let resultData = {};
                if (response.code === "1") {

                    let { cuentas, cuotas, estadoPago } = JSON.parse(response.payload);

                    resultData.cuentasPorCobrar = cuentas;
                    resultData.cuotasPorCobrar = cuotas;
                    resultData.estadosPago = estadoPago;
                } else {
                    throw new Error('Error en petición')
                }
                return resultData
            })
        }

        function mapperTo(obj) {
            const {
                comprobante,
                cobros,
                cobroDetalle,
                historialCobros,
                cuentasPorCobrarEstado,
                cuotasPorCobrarEstado
            } = obj;

            let comprobanteMappeado = {
                idCliente: comprobante.idCliente,
                total: comprobante.total,
                abono: comprobante.abono,
                codEstab: comprobante.codEstab,
                numeroIdentificacion: comprobante.numeroIdentificacion,
                nombreFiscal: comprobante.nombreFiscal,
                observacion: fS.isValidField(comprobante.observacion)
            }

            let cobrosMappeado = cobros.map(cobro => {
                return {
                    idSubEntidadFinanciera: cobro.idSubEntidadFinanciera,
                    idEntidadFinanciera: cobro.idEntidadFinanciera,
                    idBanco: fS.isValidField(cobro.idBanco),
                    idCuentaBancaria: fS.isValidField(cobro.idCuentaBancaria),
                    fechaEmision: cobro.fechaEmision,
                    valor: cobro.valor,
                    posfechado: cobro.posfechado,
                    cobro: cobro.cobro,
                    secuencial: cobro.secuencial,
                    infoCobro: cobro.infoCobro,
                    abono: cobro.abono,
                    controlCaja: cobro.controlCaja,
                    idComprobante: fS.isValidField(cobro.idComprobante),
                    idTipoDocumento: fS.isValidField(cobro.idTipoDocumento),
                    observacion: fS.isValidField(cobro.observacion)
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
                cobros: cobrosMappeado,
                cobroDetalle: cobroDetalleMappeado,
                historial: historialCobrosMappeado,
                cuenta: cuentasPorCobrarEstado,
                cuota: cuotasPorCobrarEstado
            }

            return objComprobanteIngreso;
        }

        function post(data) {
            return mS.getData('post', url + 'Insert', { data }, true)
        }

        function getHistorialCobrosById(idComprobanteIngreso) {
            let params = JSON.stringify({ idComprobanteIngreso, tipo: 2 })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let resultData = {
                    comprobante: [],
                    cobros: [],
                    cobroDetalles: []
                }
                if (response.code === '1') {

                    let { comprobanteIngreso, cobro, cobroDetalle } = JSON.parse(response.payload);

                    let comprobante = comprobanteIngreso[0];
                    let cobros = cobro;
                    let cobroDetalles = cobroDetalle;

                    for (let item of cobros) {
                        item.infoCobro = JSON.parse(item.infoCobro)
                        item.cobroDetalles = cobroDetalles.filter(itemDetalle => itemDetalle.idCobro === item.idCobro);
                        item.showInfoCobro = item.codPago !== 'EFE'
                    }


                    resultData.comprobante = comprobante;
                    resultData.cobros = cobros;
                    resultData.cobroDetalles = cobroDetalles

                }
                return resultData;
            })
        }
        function getHistorialCobrosByDoc(idCuentaPorCobrar) {
            let params = JSON.stringify({ idCuentaPorCobrar, tipo: 3 })
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                let result = {
                    comprobante: [],
                    cobroDetalles: [],
                    comprobanteIngresos: []
                }
                if (response.code === '1') {

                    let { cuentaPorCobrar, comprobanteIngreso, cobro, cobroDetalle } = JSON.parse(response.payload);

                    result.comprobante = cuentaPorCobrar[0];
                    let comprobanteIngresos = comprobanteIngreso;

                    let cobros = cobro;
                    result.cobroDetalles = cobroDetalle;



                    for (let item of cobros) {
                        item.infoCobro = JSON.parse(item.infoCobro)
                        item.cobroDetalles = result.cobroDetalles.filter(itemDetalle => itemDetalle.idCobro === item.idCobro);

                    }

                    result.comprobanteIngresos = comprobanteIngresos.map(item => {
                        item.cobros = cobros.filter(cc => cc.idComprobanteIngreso === item.idComprobanteIngreso)
                            .map(cobro => {
                                cobro.infoCobro = cobro.infoCobro
                                cobro.showInfoCobro = cobro.codPago !== 'EFE'
                                return cobro;
                            })
                        return item;
                    })
                }

                return result;
            })
        }

        //==================SE USA EN CHEQUE===========
        function update(comprobanteIngresoId, data) {
            return mS.getData('put', `${url}${comprobanteIngresoId}`, { data }, true)
        }



        function cancel(data) {
            return mS.getData('put', `${url}Cancel`, { data }, true)
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

                const { establecimientos, estadoPago, tipoDocumento, empresas } = response;
                let dataToGroup = {
                    estabs: establecimientos, //Establecimientos con puntos de emision 
                }
                let estabs = fS.groupingEstab(dataToGroup);

                return {
                    estabs,
                    estadosDoc: estadoPago,
                    tiposDoc: tipoDocumento,
                    empresas: empresas
                }
            })
        }

        function getAll(obj) {
            const params = JSON.stringify({ ...obj, tipo: 1 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                if (!response) throw response


                const { cuentasPorCobrar } = response;
                console.log(cuentasPorCobrar)


                const results = cuentasPorCobrar.map(item => {
                    return {
                        idCuentaPorCobrar: item.idCuentaPorCobrar,
                        codDoc: item.codDoc,
                        razonSocialComprador: item.razonSocialComprador,
                        serieComprobante: item.serieComprobante,
                        fechaEmision: item.fechaEmision,
                        fechaVencimiento: item.fechaVencimiento,
                        importeTotal: item.importeTotal,
                        abono: item.abono,
                        saldo: item.saldo,
                        tiempoCredito: item.tiempoCredito,
                        estado: item.estado,
                        codEstado: item.codEstado,
                        idCliente: item.idCliente,
                        codEstab: item.codEstab,
                        identificacionComprador: item.identificacionComprador,
                        diasMora: item.diasMora,
                        mora: item.mora,
                        enabledHistorialCobro: item.codEstado === 'PE',
                        tipo: item.tipo //item.tipo? CREDITO: CONTADO
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
                let results = [];
                if (response && typeof response === 'object') {

                    results = response.cuotas.map(item => {
                        return {
                            idCuotaPorCobrar: item.idCuotaPorCobrar,
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            fechaVencimiento: item.fechaVencimiento,
                            nroCuota: item.nroCuota,
                            cuota: item.cuota,
                            mora: item.mora,
                            interes: item.interes,
                            diasMora: item.diasMora,
                            abono: item.abono,
                            saldoCta: item.saldoCta,
                            saldo: item.saldo,
                            estado: item.estado,
                            saldoOriginal: item.saldo
                        }
                    })
                }
                return results;
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
            return mS.getData('get', `Venta/Estadistica/Get?json=${JSON.stringify(params)}`).then(response => {
                if (response.code === "0") return []
                return JSON.parse(response.payload);
            });

            // return mS.getData('get', `/EstadisticaVenta/Get?json=${JSON.stringify(params)}`).then(response => {
            //     if (response.code === "0") return []
            //     return response;
            // });
        }
    }])


    app.factory('contabilidadUtils', [function () {
        return {
            generarCuentasPorCobrarEstado,
            generarCuotasPorCobrarEstado
        }


        function getDataEstadoPago({ saldo, abono, esPosfechado, estadosPago }) {
            let estado = '';
            let dataEstadoPago = {};

            if (esPosfechado) {
                dataEstadoPago = estadosPago.find(ep => ep.codigo === 'PFC');
            } else {
                if (saldo === 0) {
                    dataEstadoPago = estadosPago.find(ep => ep.codigo === 'CBR');
                    estado = 'COBRADA'
                }
                if (saldo > 0) {
                    dataEstadoPago = estadosPago.find(ep => ep.codigo === 'PP');
                    estado = "PENDIENTE PARCIAL";
                }
                if (abono === 0) {
                    dataEstadoPago = estadosPago.find(ep => ep.codigo === 'PE');
                    estado = "PENDIENTE";
                }

            }


            return {
                idEstadoPago: dataEstadoPago.idEstadoPago,
                descripcion: estado
            }
        }

        function generarCuentasPorCobrarEstado({ historialCuentas, cobrosDetalle, estadosPago }) {
            let cuentasPorCobrarAgrupado = historialCuentas.reduce((acc, curr) => {

                let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar);
                if (!existeDato) {
                    acc.push({
                        idCuentaPorCobrar: curr.idCuentaPorCobrar,
                        valorSaldoLectura: curr.valorSaldoLectura,
                        abono: curr.abono,
                        diasMora: curr.diasMora,
                        mora: curr.mora
                    })
                } else {
                    existeDato.abono += curr.abono;

                }
                return acc;

            }, [])

            let cuentasPorCobrarEstado = [];


            for (let item of cuentasPorCobrarAgrupado) {
                let valorSaldo = 0, dataEstadoPago = {};

                let totalPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && cd.posfechado).reduce((acc, curr) => {
                    acc += curr.abono;
                    return acc;
                }, 0)

                let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && !cd.posfechado).reduce((acc, curr) => {
                    acc += curr.abono;
                    return acc;
                }, 0)

                valorSaldo = item.valorSaldoLectura - totalNoPosfechado;

                if (totalPosfechado > 0) {
                    dataEstadoPago = getDataEstadoPago({
                        esPosfechado: true,
                        estadosPago
                    })
                }


                if (totalPosfechado <= 0) {
                    dataEstadoPago = getDataEstadoPago({
                        saldo: valorSaldo,
                        abono: totalNoPosfechado,
                        estadosPago
                    })
                }

                cuentasPorCobrarEstado.push({
                    idCuentaPorCobrar: item.idCuentaPorCobrar,
                    idEstadoPago: dataEstadoPago.idEstadoPago,
                    abono: totalNoPosfechado
                })

            }
            return cuentasPorCobrarEstado;

        }


        function generarCuotasPorCobrarEstado({ cobrosDetalle, estadosPago }) {

            let cuotasPorCobrarAgrupado = cobrosDetalle.reduce((acc, curr) => {

                let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar && curr.idCuentaPorCobrar && dataCxc.idCuotaPorCobrar === curr.idCuotaPorCobrar);
                if (!existeDato) {
                    acc.push({
                        idCuentaPorCobrar: curr.idCuentaPorCobrar,
                        idCuotaPorCobrar: curr.idCuotaPorCobrar,
                        valorSaldoLectura: curr.valorSaldoLectura,
                        abono: curr.abono,
                    })
                } else {
                    existeDato.abono += curr.abono;

                }
                return acc;

            }, [])

            let cuotasPorCobrarEstado = [];

            for (let item of cuotasPorCobrarAgrupado) {

                let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuotaPorCobrar === item.idCuotaPorCobrar && !cd.posfechado).reduce((acc, curr) => {
                    acc += curr.abono;
                    return acc;
                }, 0)

                let valorSaldo = item.valorSaldoLectura - totalNoPosfechado;

                let dataEstadoPago = getDataEstadoPago({
                    saldo: valorSaldo,
                    abono: item.abono,
                    estadosPago
                })


                cuotasPorCobrarEstado.push({
                    idEstadoPago: dataEstadoPago.idEstadoPago,
                    abono: totalNoPosfechado,
                    idCuotaPorCobrar: item.idCuotaPorCobrar
                })

            }
            return cuotasPorCobrarEstado;

        }


    }])


})();


//utils 

(function () {
    'use strict';
    app.service('modalCobroService', ['formulario', 'toastService', function (fS, tS) {

        this.selectedDocumentos = [];
        this.cobrosDetalle = [];
        this.historialCuentas = [];

        this.cuentasPorCobrarEstado = [];
        this.cuotasPorCobrarEstado = [];

        this.valorAbono = 0;

        this.esAbonoPosfechado = false;
        this.uniqueIndex = 0;

        this.MAX_NUMBER_ROUND = 5;
        this.MAX_NUMBER_ROUND_GENERAL = 3;

        this.estadosPago = [];

        this.configCobro = {};

        this.group = {};

        this.setEstadoPago = function (values) {
            this.estadosPago = values;
        }

        this.setConfigCobro = function (value) {
            this.configCobro = value;
        }

        this.obtenerDiferenciaDia = function (fechaVencimiento) {
            const hoy = new Date();
            const formatearFechaVcto = new Date(fechaVencimiento);
            const diasMora = Math.floor((hoy.getTime() - formatearFechaVcto.getTime()) / (1000 * 60 * 60 * 24)); // Diferencia en días
            return diasMora;
        }

        this.calcularInteresMora = function (docsCuotas) {
            let results = docsCuotas.map(item => {

                let resultCuotas = item.cuotas.map(rowCuota => {

                    let saldo = rowCuota.saldo;
                    let diasMoraInteres = 0;
                    let diasMoraActual = 0;
                    let interesActual = 0;
                    let saldoDiaMoraInteres = 0;

                    console.log(rowCuota.fechaVencimiento)
                    diasMoraActual = this.obtenerDiferenciaDia(rowCuota.fechaVencimiento);
                    console.log(diasMoraActual)
                    if (item.tipo && this.configCobro.configDeuda && this.configCobro.tipoConfig === "PI" && diasMoraActual > 0) {
                        interesActual = fS.div(fS.mul(saldo, this.configCobro.interes, 5), 100, 5);
                        diasMoraInteres = fS.mul(interesActual, diasMoraActual, 5)
                        saldoDiaMoraInteres += diasMoraInteres;

                        saldoDiaMoraInteres += saldo;
                    }

                    return {
                        idCuotaPorCobrar: rowCuota.idCuotaPorCobrar,
                        idCuentaPorCobrar: rowCuota.idCuentaPorCobrar,
                        fechaVencimiento: rowCuota.fechaVencimiento,
                        nroCuota: rowCuota.nroCuota,
                        cuota: rowCuota.cuota,
                        mora: item.mora,
                        interes: item.interes,
                        diasMora: item.diasMora,
                        diasMoraActual,
                        diasMoraInteres,
                        interesActual,
                        abono: rowCuota.abono,
                        saldoCta: rowCuota.saldoCta,
                        saldo,
                        estado: rowCuota.estado,
                        saldoOriginal: saldo,
                        valorSaldoLectura: saldo,
                        saldoDiaMoraInteres: fS.instanceDecimal(saldoDiaMoraInteres, 5)
                    }
                })

                return {
                    ...item,
                    cuotas: structuredClone(resultCuotas),
                    cuotasOriginal: structuredClone(resultCuotas),
                }

            })
            return results;
        }


        this.isValidForm = function (data, codigoSubentidadFinanciera) {
            if (!fS.getValidId(data.idSubEntidadFinanciera)) {
                tS.toastr({
                    type: 'warning',
                    message: 'Seleccione la SubEntidad Financiera'
                })
                return
            }

            if (!fS.isValidField(data.fechaEmision)) {
                tS.toastr({
                    type: 'warning',
                    message: 'Ingrese la fecha de emisión'
                })
                return
            }
            if (!fS.isDateValid(data.fechaEmision)) {
                tS.toastr({
                    type: 'warning',
                    message: 'Ingrese una fecha válida'
                })
                return
            }

            if (!fS.getValidId(data.valorAbono)) {
                tS.toastr({
                    type: 'warning',
                    message: 'Ingrese el valor de abono'
                })
                return
            }

            // =================== TRANSFERENCIAS  =================================== //

            if (codigoSubentidadFinanciera === 'TRA') {
                if (!fS.getValidId(data.idBanco)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese el Banco'
                    })
                    return
                }
                if (!fS.isValidField(data.nro)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese el Número'
                    })
                    return
                }
            }

            // =================== CHEQUES  =================================== //

            if (codigoSubentidadFinanciera === 'CHE') {
                if (!fS.getValidId(data.idBanco)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese el Banco'
                    })
                    return
                }
                if (!fS.isValidField(data.nro)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese el Número'
                    })
                    return
                }

                if (!fS.getValidId(data.idCiudad)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese la Ciudad'
                    })
                    return
                }
                if (!fS.isValidField(data.referencia)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese a quien va dirigido el Cheque'
                    })
                    return
                }
            }

            return true;
        }


        this.addFormaCobro = () => {

            for (let group of this.selectedDocumentos) {

                this.group = group;

                if (typeof this.valorAbono !== 'number' || this.valorAbono > 0) {

                    let valorMovimientoSaldo = fS.instanceDecimal(0);
                    let historialAbono = fS.instanceDecimal(0);

                    const cobrosDetalleFiltered = this.cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar)

                    const totalAbonoCuenta = cobrosDetalleFiltered.reduce((acc, curr) => acc.plus(curr.abono), fS.instanceDecimal(0));



                    if (cobrosDetalleFiltered.length === 0) {

                        let historialCuentasFiltered = this.historialCuentas.filter(cd => (
                            cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar && cd.secuencial === this.uniqueIndex
                        ));

                        let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                        if (dataUltimoCobroDetalle) {

                            valorMovimientoSaldo = fS.minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono).toNumber();
                        } else {
                            // valorMovimientoSaldo = group.saldo;
                            valorMovimientoSaldo = fS.instanceDecimal(this.group.saldo).toNumber();
                        }

                        if (this.valorAbono <= this.group.saldo) {
                            historialAbono = this.valorAbono;

                        } else if (this.valorAbono >= this.group.saldo) {
                            historialAbono = this.group.saldo;
                        }



                        this.historialCuentas.push({
                            secuencial: this.uniqueIndex,
                            valorSaldoLectura: this.group.valorSaldoLectura,
                            idCuentaPorCobrar: this.group.idCuentaPorCobrar,
                            //  abono: this.fS.roundNumber(historialAbono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                            //  saldo: this.fS.roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                            abono: fS.instanceDecimal(historialAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                            saldo: fS.instanceDecimal(valorMovimientoSaldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                            diasMora: this.group.diasMora,
                            mora: this.group.mora,
                        })

                    }
                    if (cobrosDetalleFiltered.length > 0) {
                        if (totalAbonoCuenta !== fS.roundNumber(this.group.saldo, this.MAX_NUMBER_ROUND_GENERAL)) {

                            let historialCuentasFiltered = this.historialCuentas.filter(cd => (
                                cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar
                            ));

                            let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                            if (dataUltimoCobroDetalle) {

                                valorMovimientoSaldo = fS.minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono).toNumber();

                            } else {
                                valorMovimientoSaldo = fS.instanceDecimal(this.group.saldo).toNumber();
                            }

                            if (this.valorAbono <= valorMovimientoSaldo) {
                                historialAbono = this.valorAbono;

                            } else {
                                historialAbono = valorMovimientoSaldo
                            }


                            this.historialCuentas.push({
                                secuencial: this.uniqueIndex,
                                valorSaldoLectura: this.group.valorSaldoLectura,
                                idCuentaPorCobrar: this.group.idCuentaPorCobrar,

                                abono: fS.instanceDecimal(historialAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                                saldo: fS.instanceDecimal(valorMovimientoSaldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                                diasMora: this.group.diasMora,
                                mora: this.group.mora,
                            })
                        }
                    }

                }



                for (let item of group.cuotas) {

                    item.abonoPosfechado = 0;


                    if (typeof this.valorAbono !== 'number' || this.valorAbono === 0) return;

                    //Si la cuota no tiene ningún abono

                    if (item.abono > 0) {
                        this.cuotaConAbono(item)
                    } else {
                        this.cuotaSinAbono(item)
                    }

                    item.cuota = fS.instanceDecimal(item.cuota).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
                    item.abono = fS.instanceDecimal(item.abono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
                    item.abonoPosfechado = fS.instanceDecimal(item.abonoPosfechado).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

                    let dataEstadoPago = this.getEstadoCuota({
                        saldo: item.saldo,
                        abono: item.abono
                    });
                    item.estado = dataEstadoPago.descripcion;


                    item.esCuotaAfectada = true;

                }

            }
        }




        /**
       * 
       * @param {object} item 
       */
        this.cuotaSinAbono = (item) => {

            //Validaciones Saldo Cuota 
            if (item.saldoCta >= this.valorAbono) {

                item.saldoCta = fS.minus(item.saldoCta, this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

            } else if (item.saldoCta <= this.valorAbono) {
                item.saldoCta = 0;
            }

            //Validaciones Saldo 
            if (item.saldo >= this.valorAbono) {

                //Si el Abono pago no es Posfechado
                item.abono = this.esAbonoPosfechado ? 0 : this.valorAbono;

                //Si el abono pago es posfechado
                item.abonoPosfechado = this.esAbonoPosfechado ? this.valorAbono : 0;

                //let valorSaldo = item.saldo - this.valorAbono;
                item.saldo = fS.minus(item.saldo, this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

                this.addCobroDetalle(item, this.valorAbono, item.saldo)
                this.valorAbono = 0;

            } else if (item.saldo <= this.valorAbono) {

                //Si el Abono pago no es Posfechado
                item.abono = this.esAbonoPosfechado ? 0 : fS.instanceDecimal(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

                //Si el abono pago es posfechado
                item.abonoPosfechado = this.esAbonoPosfechado ? fS.instanceDecimal(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber() : 0;

                //this.valorAbono = this.valorAbono - item.saldo;
                this.valorAbono = fS.minus(this.valorAbono, item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

                this.addCobroDetalle(item, item.saldo, 0)
                item.saldo = 0;
            }

        }

        /**
        * 
        * @param {object} item 
        */
        this.cuotaConAbono = (item) => {

            //Validaciones Saldo Cuota 
            if (item.saldoCta >= this.valorAbono) {

                item.saldoCta = fS.minus(item.saldoCta, this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

            } else if (item.saldoCta <= this.valorAbono) {
                item.saldoCta = 0;
            }

            //Validaciones Saldo 

            if (item.saldo >= this.valorAbono) {

                item.abono = this.esAbonoPosfechado ? item.abono : fS.plus(item.abono, this.valorAbono, this.MAX_NUMBER_ROUND);
                item.abonoPosfechado = this.esAbonoPosfechado ? fS.plus(item.abonoPosfechado, this.valorAbono, this.MAX_NUMBER_ROUND) : item.abonoPosfechado;

                item.saldo = fS.minus(item.saldo, this.valorAbono, this.MAX_NUMBER_ROUND)


                this.addCobroDetalle(item, this.valorAbono, item.saldo);
                this.valorAbono = 0;


            } else if (item.saldo <= this.valorAbono) {
                item.abono = this.esAbonoPosfechado ? item.abono : fS.plus(item.abono, item.saldo, this.MAX_NUMBER_ROUND)
                item.abonoPosfechado = this.esAbonoPosfechado ? fS.plus(item.abonoPosfechado, item.saldo, this.MAX_NUMBER_ROUND) : item.abonoPosfechado;

                this.addCobroDetalle(item, item.saldo, 0);

                this.valorAbono = fS.minus(this.valorAbono, item.saldo, this.MAX_NUMBER_ROUND)
                item.saldo = 0;
            }
        }


        /**
         * 
         * @param {object} item 
         * @param {number} abono 
         * @returns void
         */
        this.addCobroDetalle = (item, abono, saldo) => {
            if (item.cuota === 0 || abono === 0) return;

            let valorMovimientoSaldo = 0;
            let cobrosDetalleFiltered = this.cobrosDetalle.filter(cd => (
                cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar &&
                cd.idCuotaPorCobrar === item.idCuotaPorCobrar
            ))

            let dataUltimoCobroDetalle = cobrosDetalleFiltered.pop();
            if (dataUltimoCobroDetalle) {
                valorMovimientoSaldo = fS.minus(dataUltimoCobroDetalle.saldoOriginal, dataUltimoCobroDetalle.abono, this.MAX_NUMBER_ROUND)
            } else {
                valorMovimientoSaldo = fS.instanceDecimal(item.saldoOriginal, this.MAX_NUMBER_ROUND)
            }


            this.cobrosDetalle.push({
                idCuentaPorCobrar: this.group.idCuentaPorCobrar,
                idCuotaPorCobrar: item.idCuotaPorCobrar,
                abono,
                //  abono: this.fS.roundNumber(abono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                interes: item.interes,
                diasMora: item.diasMora,
                mora: item.mora,
                cuota: fS.instanceDecimal(item.cuota, this.MAX_NUMBER_ROUND),
                //  cuota: this.fS.roundNumber(item.cuota, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                saldo: fS.instanceDecimal(saldo, this.MAX_NUMBER_ROUND),
                secuencial: this.uniqueIndex,
                valorSaldoLectura: item.valorSaldoLectura,
                saldoOriginal: fS.instanceDecimal(valorMovimientoSaldo, this.MAX_NUMBER_ROUND),
                posfechado: this.esAbonoPosfechado
            })
            item.saldo = fS.instanceDecimal(item.saldo, this.MAX_NUMBER_ROUND)
            item.saldoOriginal = fS.minus(item.saldoOriginal, abono, this.MAX_NUMBER_ROUND);
        }




        /**
         * 
         * @param {*} param0 
         * @returns 
         */
        this.getEstadoCuota = ({ saldo, abono, esPosfechado }) => {
            let estado = '';
            let dataEstadoPago = {};

            if (esPosfechado) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PFC');
            } else {
                if (saldo === 0) {
                    dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'CBR');
                    estado = 'COBRADA'
                }
                if (saldo > 0) {
                    dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PP');
                    estado = "PENDIENTE PARCIAL";
                }
                if (abono === 0) {
                    dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PE');
                    estado = "PENDIENTE";
                }

            }


            return {
                idEstadoPago: dataEstadoPago.idEstadoPago,
                descripcion: estado
            }
        }










    }]);

})()