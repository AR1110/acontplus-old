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
            return mS.getData('get', `${url}?json=${json}`).then(response => {
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
            return mS.getData('get', `${url}?json=${JSON.stringify(params)}`).then(response => {
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
            return mS.getData('get', `${url}?json=${JSON.stringify({ tipo: 6 })}`).then(response => {
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
            return mS.getData('get', `${url}?json=${json}`).then(response => {
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
            return mS.getData('get', `${url}?json=${json}`).then(response => {

                let cuentaPorPagar = {},
                    comprobantesEgreso = [],
                    historialPagos = [],
                    pagosDetalle = []

                if (response.code === "1") {
                    const mainData = JSON.parse(response.payload)
                    const [
                        tempCuentaPorPagar,
                        tempComprobanteEgreso,
                        tempHistorialPagos,
                        tempPagosDetalle,
                    ] = mainData;

                    const {
                        serieComprobante,
                        fechaEmision,
                        identificacionProveedor,
                        razonSocialProveedor,
                        importeTotal,
                        abono,
                        saldo,
                    } = tempCuentaPorPagar[0];


                    cuentaPorPagar = {
                        serieComprobante,
                        fechaEmision,
                        identificacionComprador: identificacionProveedor,
                        nombreComprador: razonSocialProveedor,
                        total: importeTotal,
                        abono,
                        saldo,
                    };

                    comprobantesEgreso = tempComprobanteEgreso.map(
                        (item, index) => {
                            return {
                                index: index + 1,
                                idComprobanteEgreso: item.idComprobanteEgreso,
                                fechaEmision: item.fechaEmision,
                                serieComprobante: item.serieComprobante,
                                total: item.total,
                                nombreEstado: item.nombreEstado,
                                estado: item.estado,
                                codEstab: item.codEstab,
                            };
                        },
                    );

                    historialPagos = tempHistorialPagos.map((item) => {
                        return {
                            idComprobanteEgreso: item.idComprobanteEgreso,
                            idPago: item.idPago,
                            nombrePosfechado: item.nombrePosfechado,
                            fechaEmision: item.fechaEmision,
                            nombreFormaPago: item.nombreFormaPago,
                            nombreBanco: item.nombreBanco,
                            valor: item.valor,
                            abono: item.abono,
                            vuelto: item.vuelto,
                            codigoFormaPago: item.codigoFormaPago,
                            nro: item.nro,
                            lote: item.lote,
                            referencia: item.referencia,
                            aprobacion: item.aprobacion,
                        };
                    });

                    pagosDetalle = tempPagosDetalle.map((item) => {
                        return {
                            idPago: item.idPago,
                            nroCuota: item.nroCuota,
                            fechaVencimiento: item.fechaVencimiento,
                            cuota: item.cuota,
                            abono: item.abono,
                            saldo: item.saldo,
                        };
                    })
                }

                return {
                    cuentaPorPagar,
                    comprobantesEgreso,
                    historialPagos,
                    pagosDetalle
                };
            })
        }

        /**
         * Modificacion de cuotas
         * @param {*} id 
         */
        function getCuotas(id) {
            let json = JSON.stringify({ idCuentaPorPagar: id, tipo: 2 });
            return mS.getData('get', `${url}?json=${json}`).then(response => {
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

    app.factory('comprobanteEgresoService', ['mainService', 'formulario', 'modalService', 'nombreModalContabilidad', function (mS, fS, modalSvc, nombreModalContab) {
        const url = `${PATH_API}ComprobanteEgreso/`

        return {
            getDataFilter,
            getAll,
            getCuotasByIdCuentaPorPagar,
            getDataFormaPago,
            getDataToDelete,
            getPosfechadoPagosModal,
            mapperTo,
            post,
            anular,
            update,
        }

        function getDataFilter() {
            let params = JSON.stringify({
                tipo: 2
            })
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${json}`).then(response => {
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
            return mS.getData('get', `${url}?json=${json}`).then(response => {
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
            return mS.getData('get', `${url}?json=${json}`).then(response => {
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


        function getPosfechadoPagosModal(obj) {
            let json = JSON.stringify({
                tipo: 6,
                pageIndex: obj && obj.pageIndex || 1,
                pageSize: obj && obj.pageSize || 25
            })
            mS.getData('get', `${url}?json=${json}`).then(async response => {
                let results = {
                    cheques: []
                };
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let cheques = mainData && mainData.cheques || [];

                    results.cheques = cheques.map(item => {
                        return {
                            id: item.id,
                            idComprobante: item.idComprobante,
                            nroDocumento: item.nroDocumento,
                            persona: item.persona,
                            nroIdentificacion: item.nroIdentificacion,
                            valor: item.valor,
                            nro: item.nro,
                            fechaEmision: item.fechaEmision,
                        }
                    })
                }

                if (results.cheques.length > 0) {

                    const { fileCtrl, ctrl, template } = nombreModalContab.POSFECHADO_PAGOS_MODAL;
                    let controller = (await import(fileCtrl))[ctrl];

                    modalSvc.open({
                        controller,
                        template,
                        size: 'xl',
                        params: results,
                        keyboard: true,
                    });
                }

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
    app.factory('comprobanteIngresoService', ['mainService', 'formulario', 'modalService', 'nombreModalContabilidad', function (mS, fS, modalSvc, nombreModalContab) {
        const url = `Contabilidad/ComprobanteIngreso/`
        return {
            getDataFilter,
            getAll,
            getDataForm,
            post,
            mapperTo,
            getHistorialCobrosById,
            getHistorialCobrosByDoc,
            getPosfechadoCobrosModal,
            update,
            cancel,
            getCuotasByIdCuentaPorCobrar,
            getDataForDelete,
            paymentFormData
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


        function transformarCuotas(cuotas) {
            return cuotas.map(item => ({
                idCuotaPorCobrar: item.idCuotaPorCobrar,
                idCuentaPorCobrar: item.idCuentaPorCobrar,
                fechaVencimiento: item.fechaVencimiento,
                nroCuota: item.nroCuota,
                cuota: item.cuota,
                mora: item.mora,
                interes: item.interes,
                diasMora: item.diasMora,
                abono: item.abono,
                saldoCta: item.saldoCta, //resta de cuota - saldo
                saldo: item.saldo,
                nombreEstado: item.estado,
            }));
        }

        function transformarCuentaPorCobrar(cuentas) {

            return cuentas.map((item, index) => {
                const cuotas = JSON.parse(item.cuotas || '[]');
                const cuotasTransformada = transformarCuotas(cuotas);
                return {
                    index: index + 1,
                    idCuentaPorCobrar: item.idCuentaPorCobrar,
                    idCliente: item.idCliente,
                    codEstab: item.codEstab,
                    identificacionComprador: item.identificacionComprador,
                    razonSocialComprador: item.razonSocialComprador,
                    serieComprobante: item.serieComprobante,
                    codDoc: item.codDoc,
                    fechaEmision: item.fechaEmision,
                    fechaVencimiento: item.fechaVencimiento,
                    importeTotal: item.importeTotal,
                    diasMora: item.diasMora,
                    mora: item.mora,
                    abono: item.abono,
                    saldo: item.saldo,
                    saldoDoc: item.saldoDoc, //resta de importe total - abono 
                    nombreEstado: item.descripcion, //nombre del estado de pago
                    cuotas: structuredClone(cuotasTransformada),
                    cuotasOriginal: structuredClone(cuotasTransformada)
                }
            });
        }


        function getDataFilter() {
            let params = JSON.stringify({
                tipo: 4
            })
            return mS.getData('get', `${url}?json=${params}`).then(response => {
                let resultData = {
                    estabs: []
                }
                if (response.code === "1") {
                    let { ptoEmision } = JSON.parse(response.payload)

                    let dataToGroup = {
                        estabs: ptoEmision, //Establecimientos con puntos de emision 
                    }
                    resultData.estabs = fS.groupingEstab(dataToGroup);

                }
                return resultData;
            })
        }


        function getAll(obj) {

            let params = JSON.stringify({
                ...obj,
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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


        function paymentFormData({ idCuentaPorCobrar, idCliente }) {
            const params = JSON.stringify({ idCuentaPorCobrar, idCliente, tipo: 5 });
            return mS.getData('get', `${url}?json=${params}`, null, true).then(response => {
                const cobroFormData = {
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

                    // Subentidades agrupadas por entidad
                    cobroFormData.entidadesFinanciera = entidadFinanciera.map(ef => ({
                        idEntidadFinanciera: ef.idEntidadFinanciera,
                        descripcion: ef.descripcion,
                        detalle: ef.detalle,
                        codigo: ef.codigo,
                        subEntidadesFinanciera: subEntidadFinanciera.filter(
                            sef => sef.idEntidadFinanciera === ef.idEntidadFinanciera
                        )
                    }));

                    // Documentos de cuenta por cobrar (si aplica)
                    if (Array.isArray(cuentaPorCobrar)) {
                        cobroFormData.cuentaPorCobrar = transformarCuentaPorCobrar(cuentaPorCobrar);
                    }

                    cobroFormData.bancos = banco;
                    cobroFormData.documentos = documentos;
                    cobroFormData.ciudades = provincia;
                    cobroFormData.estadosPago = estadoPago;
                    cobroFormData.configCobro = config[0] || {};
                }
                console.log('Cobro Form Data:', cobroFormData);
                return cobroFormData;

            })
        }


        function getDataForm(idCuentaPorCobrar, idCliente) {

            const params = JSON.stringify({ idCuentaPorCobrar, idCliente, tipo: 5 });
            try {

                return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
                let results = [];
                if (response.code === "1") {
                    let { cuotas } = JSON.parse(response.payload);
                    results = transformarCuotas(cuotas);
                }
                return results;
            })
        }

        //obtiene datos para anular el comprobante de ingreso 
        function getDataForDelete(id) {
            const params = JSON.stringify({ id, tipo: 7 });
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
                historialCuentas,
                cuentasPorCobrarEstado,
                cuotasPorCobrarEstado
            } = obj;

            let comprobanteMappeado = {
                idCliente: comprobante.idCliente,
                total: comprobante.total,
                abono: comprobante.abono,
                codEstab: comprobante.codEstab,
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
                    interes: detalle.interesActual,
                    diasMora: detalle.diasMoraActual,
                    mora: detalle.interesPorMoraActual,
                    saldo: fS.roundNumber(detalle.saldoOriginal, 5),
                    secuencial: detalle.secuencial,
                }
            })

            const historialCobrosMappeado = historialCuentas.map(hc => {
                return {
                    idCuentaPorCobrar: hc.idCuentaPorCobrar,
                    abono: fS.roundNumber(hc.abono, 5),
                    diasMora: hc.diasMoraActual,
                    mora: hc.interesPorMoraActual,
                    saldo: fS.roundNumber(hc.saldo, 5),
                    secuencial: hc.secuencial
                }
            })

            let cuenta = cuentasPorCobrarEstado.map(item => {
                return {
                    idCuentaPorCobrar: item.idCuentaPorCobrar,
                    idEstadoPago: item.idEstadoPago,
                    abono: item.abono,
                    diasMora: item.diasMoraActual,
                    mora: item.interesPorMoraActual,
                    interes: item.interesActual,
                }
            })

            let cuota = cuotasPorCobrarEstado.map(item => {
                return {
                    idEstadoPago: item.idEstadoPago,
                    abono: item.abono,
                    idCuotaPorCobrar: item.idCuotaPorCobrar,
                    diasMora: item.diasMoraActual,
                    mora: item.interesPorMoraActual,
                }
            })




            const objComprobanteIngreso = {
                comprobante: comprobanteMappeado,
                cobros: cobrosMappeado,
                cobroDetalle: cobroDetalleMappeado,
                historial: historialCobrosMappeado,
                cuenta,
                cuota
            }

            return objComprobanteIngreso;
        }

        function post(data) {
            return mS.getData('post', url + 'Insert', { data }, true)
        }

        function getHistorialCobrosById(idComprobanteIngreso) {
            let params = JSON.stringify({ idComprobanteIngreso, tipo: 2 })
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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


        function getPosfechadoCobrosModal(obj) {
            let json = JSON.stringify({
                tipo: 8,
                pageIndex: obj && obj.pageIndex || 1,
                pageSize: obj && obj.pageSize || 25
            })
            mS.getData('get', `${url}?json=${json}`).then(async response => {
                let results = {
                    cheques: []
                };
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let cheques = mainData && mainData.cheques || [];

                    results.cheques = cheques.map(item => {
                        return {
                            id: item.id,
                            idComprobante: item.idComprobante,
                            nroDocumento: item.nroDocumento,
                            persona: item.persona,
                            nroIdentificacion: item.nroIdentificacion,
                            valor: item.valor,
                            nro: item.nro,
                            fechaEmision: item.fechaEmision,
                        }
                    })
                }

                if (results.cheques.length > 0) {

                    const { fileCtrl, ctrl, template } = nombreModalContab.POSFECHADO_COBROS_MODAL;
                    let controller = (await import(fileCtrl))[ctrl];

                    modalSvc.open({
                        controller,
                        template,
                        size: 'xl',
                        params: results,
                        keyboard: true,
                    });
                }

            })
        }


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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
                if (!response) throw response

                const { cuentasPorCobrar } = response;


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
                        tipo: item.tipo //item.tipo? CONTADO: CREDITO
                    }
                })


                let dataFiltered = cuentasPorCobrar[0];


                return {
                    cuentasPorCobrar: results,
                    totalRecords: dataFiltered && dataFiltered.totalRecords || 0,
                    totalVenta: dataFiltered && dataFiltered.totalVenta || 0,
                    totalMora: dataFiltered && dataFiltered.totalMora || 0,
                    totalAbono: dataFiltered && dataFiltered.totalAbono || 0,
                    totalSaldo: dataFiltered && dataFiltered.totalSaldo || 0,
                };


            })
        }

        function getCuotasById(id) {
            const params = JSON.stringify({ idCuentaPorCobrar: id, tipo: 8 });
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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
            return mS.getData('get', `${url}?json=${params}`).then(response => {
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


    //control caja 

    app.factory('controlCajaService', ['mainService', function (mS) {
        let url = `Contabilidad/ControlCaja/`
        return {
            getDataFilter,
            getAll
        }
        function getDataFilter() {
            let json = JSON.stringify({
                tipo: 6
            })
            return mS.getData('get', `${url}?json=${json}`).then(response => {
                let result = {
                    estabs: []
                }
                if (response && typeof response === 'object') {
                    result.estabs = response.establecimiento;
                }
                return result;
            })
        }
        function getAll(obj) {
            let json = JSON.stringify({
                ...obj,
                tipo: 7
            })
            return mS.getData('get', `${url}?json=${json}`).then(response => {
                let result = {
                    cheques: []
                }
                if (response && typeof response === 'object') {

                    result.cheques = response.cheques.map(item => {
                        return {
                            id: item.id,

                            idComprobante: item.idComprobante, // idcomprobante ingreso e egreso
                            idEstablecimiento: item.idEstablecimiento,
                            codDoc: item.codDoc,
                            nroDocumento: item.nroDocumento,
                            persona: item.persona,
                            nroIdentificacion: item.nroIdentificacion,
                            valor: item.valor,
                            nro: item.nro,
                            fechaEmision: item.fechaEmision,
                            posfechado: item.posfechado,
                            cobro: item.cobro,
                            totalRecords: item.totalRecords,
                            posfechadoName: item.posfechado ? 'SI' : 'NO'
                        }
                    });
                }
                return result;
            })
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
        class ModalCobroService {

            constructor() {
                this._cuentasPorCobrar = [];
                this._valorAbono = 0;
                this._dataCuentaPorCobrar = {};
                this._esAbonoPosfechado = false;
                this._cobrosDetalle = [];
                this._uniqueIndex = 0;
                this._historialCuentas = [];
                this._estadosCobro = [];

                this._configCobro = {};

                this.MAX_DECIMALS = {
                    GENERAL: 3,
                    CUOTA_ABONO: 5,
                    DEFAULT: 5
                };
            }

            getCuentasPorCobrar() {
                return this._cuentasPorCobrar;
            }
            setCuentasPorCobrar(values) {
                this._cuentasPorCobrar = values;
            }
            setValorAbono(value) {
                this._valorAbono = value;
            }
            getValorAbono() {
                return this._valorAbono;
            }

            getUniqueIndex() {
                return this._uniqueIndex;
            }
            setUniqueIndex(index) {
                this._uniqueIndex = index;
            }

            setCobrosDetalle(values) {
                this._cobrosDetalle = values;
            }
            getCobrosDetalle() {
                return this._cobrosDetalle;
            }

            setHistorialCuentas(values) {
                this._historialCuentas = values;
            }
            getHistorialCuentas() {
                return this._historialCuentas;
            }

            getEstadoCobro() {
                return this._estadosCobro;
            }

            setEstadoCobro(values) {
                this._estadosCobro = values;
            }

            setConfigCobro(value) {
                this._configCobro = value;
            }

            setEsAbonoPosfechado(value) {
                this._esAbonoPosfechado = value;
            }

            getEsAbonoPosfechado() {
                return this._esAbonoPosfechado;
            }


            obtenerDiferenciaDias(fechaVencimiento) {
                const hoy = new Date();
                const formatearFechaVcto = new Date(fechaVencimiento);
                const diasMora = Math.floor((hoy.getTime() - formatearFechaVcto.getTime()) / (1000 * 60 * 60 * 24)); // Diferencia en días
                return diasMora;
            }


            prepararParaCobro(cuentasPorCobrar) {
                let resultados = cuentasPorCobrar.map(cuenta => {
                    let { cuotas, cuotasOriginal, ...documento } = cuenta;
                    let cuotasCalculadas = cuotas.map(cuota => {
                        // Inicialización de variables 
                        let saldoAnterior = cuota.saldoCta;
                        return {
                            ...cuota,
                            saldoTotalActual: fS.instanceDecimal(saldoAnterior, 5),
                            saldoTotalOriginal: fS.instanceDecimal(saldoAnterior, 5),
                            saldoTotalLectura: fS.instanceDecimal(saldoAnterior, 5),
                            interesActual: cuota.interes||0,

                            diasMoraActual: cuota.diasMora,
                            interesPorMoraActual:cuota.mora,

                            //nuevos
                            totalCobrar: saldoAnterior,
                            abonoAnterior: cuota.abono,
                            saldoAnterior,
                            abonoActual: 0,
                            saldoActual: 0,
                        };
                    });

                    let saldoActualDoc = 0;
                    let diasMoraActual = 0;
                    let interesPorMoraActual = fS.instanceDecimal(0);
                    let interesActual = fS.instanceDecimal(0);
                    let saldoAnterior = fS.instanceDecimal(0);
                    for (let cc of cuotasCalculadas) {
                        saldoActualDoc = fS.plus(saldoActualDoc, cc.saldoTotalActual, 5);
                        diasMoraActual += cc.diasMora;
                        interesPorMoraActual = interesPorMoraActual.plus(cc.interes);
                        interesActual = interesActual.plus(cc.interes),

                            //nuevo 
                            saldoAnterior = saldoAnterior.plus(cc.saldoAnterior, 5);

                    }
                    return {
                        ...documento,
                        saldoActualDoc: fS.roundNumber(saldoActualDoc, 2),
                        cuotasCalculadas: structuredClone(cuotasCalculadas),
                        cuotasCalculadasClone: structuredClone(cuotasCalculadas),
                        diasMoraActual,
                        interesPorMoraActual: fS.roundNumber(interesPorMoraActual.toNumber(), 2),
                        interesActual: fS.roundNumber(interesActual.toNumber(), 2),
                        saldoAnterior: fS.roundNumber(saldoAnterior.toNumber(), 2),

                    };
                });

                return resultados;
            }



            calcularInteresMora(documentosCuotas) {
                let resultados = documentosCuotas.map(x => {
                    let { cuotas, cuotasOriginal, ...documento } = x;
                    let cuotasCalculadas = cuotas.map(cuota => {
                        // Inicialización de variables
                        let interesPorMoraActual = cuota.interes;
                        let diasMoraActual = cuota.diasMora;
                        let interesActual = cuota.interes;
                        let saldoTotalActual = cuota.saldo;


                        // Calcular interés y mora si hay días de mora
                        // if (this._configCobro.configDeuda && this._configCobro.tipoConfig === "PI") {

                        //     diasMoraActual = this.obtenerDiferenciaDias(cuota.fechaVencimiento);

                        //     if (diasMoraActual > 0) {

                        //         interesActual = fS.div(fS.mul(cuota.saldo, this._configCobro.interes, 5), 100, 5);
                        //         interesPorMoraActual = fS.mul(interesActual, diasMoraActual, 5);
                        //         saldoTotalActual = fS.plus(saldoTotalActual, interesPorMoraActual, 5)

                        //     } else {
                        //         diasMoraActual = 0;
                        //     }
                        // }

                        return {
                            idCuotaPorCobrar: cuota.idCuotaPorCobrar,
                            idCuentaPorCobrar: cuota.idCuentaPorCobrar,
                            fechaVencimiento: cuota.fechaVencimiento,
                            nroCuota: cuota.nroCuota,
                            cuota: cuota.cuota,
                            mora: cuota.mora,
                            interes: cuota.interes,
                            diasMora: cuota.diasMora,
                            diasMoraActual: diasMoraActual,
                            interesPorMoraActual: interesPorMoraActual,
                            interesActual: interesActual,
                            abono: cuota.abono,
                            saldo: cuota.saldo,
                            estado: cuota.estado,
                            saldoTotalActual: fS.instanceDecimal(saldoTotalActual, 5),
                            saldoTotalOriginal: fS.instanceDecimal(saldoTotalActual, 5),
                            saldoTotalLectura: fS.instanceDecimal(saldoTotalActual, 5)
                        };
                    });

                    let saldoActualDoc = 0;
                    let diasMoraActual = 0;
                    let interesPorMoraActual = fS.instanceDecimal(0);
                    let interesActual = fS.instanceDecimal(0);
                    for (let cc of cuotasCalculadas) {
                        saldoActualDoc = fS.plus(saldoActualDoc, cc.saldoTotalActual, 5);
                        diasMoraActual += cc.diasMoraActual;
                        interesPorMoraActual = interesPorMoraActual.plus(cc.interesPorMoraActual);
                        interesActual = interesActual.plus(cc.interesActual)
                    }

                    let decimalSaldo = 2
                    if (cuotasCalculadas.length > 2) {

                        decimalSaldo = fS.contarDecimales(documento.saldo)
                    }
                    if (cuotasCalculadas.length === 1) {
                        decimalSaldo = fS.contarDecimales(documento.saldo);
                    }


                    return {
                        ...documento,
                        saldoActualDoc: fS.roundNumber(saldoActualDoc, 2),
                        cuotasCalculadas: structuredClone(cuotasCalculadas),
                        cuotasCalculadasClone: structuredClone(cuotasCalculadas),
                        diasMoraActual,
                        interesPorMoraActual: fS.roundNumber(interesPorMoraActual.toNumber(), 2),
                        interesActual: fS.roundNumber(interesActual.toNumber(), 2)

                    };
                });

                return resultados;
            }


            isValidForm(data, codigoSubentidadFinanciera) {
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
                    // if (!fS.isValidField(data.nro)) {
                    //     tS.toastr({
                    //         type: 'warning',
                    //         message: 'Ingrese el Número'
                    //     })
                    //     return
                    // }
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

            aplicarAbono() {

                for (let group of this.getCuentasPorCobrar()) {
                    this._dataCuentaPorCobrar = group;
                    this.processGroup();
                    this.processCuota()
                }

            }

            //INICIO FUNCIONES DATOS CUENTAS POR COBRAR
            processGroup() {
                if (typeof this.getValorAbono() !== 'number' || this.getValorAbono() > 0) {
                    //let valorMovimientoSaldo = 0, historialAbono = 0;
                    let valorMovimientoSaldo = fS.instanceDecimal(0), historialAbono = fS.instanceDecimal(0);

                    const cobrosDetalleFiltered = this.getCobrosDetalle().filter(cd => cd.idCuentaPorCobrar === this._dataCuentaPorCobrar.idCuentaPorCobrar)

                    const totalAbonoCuenta = cobrosDetalleFiltered.reduce((acc, curr) => acc.plus(curr.abono), fS.instanceDecimal(0));

                    if (cobrosDetalleFiltered.length === 0) {

                        let historialCuentasFiltered = this.getHistorialCuentas().filter(cd => (
                            cd.idCuentaPorCobrar === this._dataCuentaPorCobrar.idCuentaPorCobrar && cd.secuencial === this.getUniqueIndex()
                        ));

                        let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                        if (dataUltimoCobroDetalle) {

                            valorMovimientoSaldo = fS.instanceDecimal(dataUltimoCobroDetalle.saldo).minus(dataUltimoCobroDetalle.abono).toNumber();
                        } else {
                            valorMovimientoSaldo = fS.instanceDecimal(this._dataCuentaPorCobrar.saldoActualDoc).toNumber();
                        }

                        if (this.getValorAbono() <= this._dataCuentaPorCobrar.saldoActualDoc) {
                            historialAbono = this.getValorAbono();

                        } else if (this.getValorAbono() >= this._dataCuentaPorCobrar.saldoActualDoc) {
                            historialAbono = this._dataCuentaPorCobrar.saldoActualDoc
                        }

                        this.addHistorialCuenta(valorMovimientoSaldo, historialAbono)

                    }
                    if (cobrosDetalleFiltered.length > 0) {

                        if (fS.roundNumber(totalAbonoCuenta.toNumber(), this.MAX_DECIMALS.GENERAL) !== fS.roundNumber(this._dataCuentaPorCobrar.saldoActualDoc, this.MAX_DECIMALS.GENERAL)) {

                            let historialCuentasFiltered = this.getHistorialCuentas().filter(cd => (
                                cd.idCuentaPorCobrar === this._dataCuentaPorCobrar.idCuentaPorCobrar
                            ));

                            let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                            if (dataUltimoCobroDetalle) {

                                valorMovimientoSaldo = fS.minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono).toNumber();

                            } else {
                                valorMovimientoSaldo = fS.instanceDecimal(this._dataCuentaPorCobrar.saldoActualDoc).toNumber();
                            }

                            if (this.getValorAbono() <= valorMovimientoSaldo) {
                                historialAbono = this.getValorAbono();

                            } else {
                                historialAbono = valorMovimientoSaldo
                            }


                            this.addHistorialCuenta(valorMovimientoSaldo, historialAbono)
                        }
                    }

                }

            }


            calculateTotalAbonoCuenta(groupId) {
                return this.getCobrosDetalle()
                    .filter(cd => cd.idCuentaPorCobrar === groupId)
                    .reduce((acc, curr) => acc.plus(curr.abono), fS.instanceDecimal(0));
            }

            getLastCobroDetalle(groupId, uniqueIndex) {
                return this.getHistorialCuentas()
                    .filter(cd => cd.idCuentaPorCobrar === groupId && cd.secuencial === uniqueIndex)
                    .pop();
            }

            calculateValorMovimientoSaldo(dataUltimoCobroDetalle, groupSaldo) {
                return dataUltimoCobroDetalle
                    ? fS.minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono, this.MAX_DECIMALS.DEFAULT)
                    : fS.instanceDecimal(groupSaldo).toNumber();
            }

            calculateHistorialAbono(groupSaldo, valorMovimientoSaldo) {
                return Math.min(this.getValorAbono(), groupSaldo, valorMovimientoSaldo);
            }

            addHistorialCuenta(valorMovimientoSaldo, historialAbono) {
                this.getHistorialCuentas().push({
                    secuencial: this.getUniqueIndex(),
                    valorSaldoLectura: this._dataCuentaPorCobrar.saldoActualDoc,
                    idCuentaPorCobrar: this._dataCuentaPorCobrar.idCuentaPorCobrar,
                    abono: fS.roundNumber(historialAbono, fS.max_dos),
                    saldo: fS.roundNumber(valorMovimientoSaldo, fS.max_dos),
                    diasMoraActual: this._dataCuentaPorCobrar.diasMoraActual,
                    interesPorMoraActual: this._dataCuentaPorCobrar.interesPorMoraActual,
                    interesActual: this._dataCuentaPorCobrar.interesActual
                });
            }

            //FIN FUNCIONES DATOS CUENTAS POR COBRAR


            //INICIO FUNCIONES DATOS CUOTAS  
            processCuota() {
                for (let dataCuota of this._dataCuentaPorCobrar.cuotasCalculadas) {

                    dataCuota.abonoPosfechado = 0;

                    if (typeof this.getValorAbono() !== 'number' || this.getValorAbono() === 0) return;

                    if (dataCuota.abono > 0) {
                        this.cuotaConAbono(dataCuota);
                    } else {
                        this.cuotaSinAbono(dataCuota);
                    }

                    this.roundCuotaFields(dataCuota);
                    this.updateEstado(dataCuota);

                    dataCuota.esCuotaAfectada = true;


                }
            }


            //INICIO FUNCIONES DE LA CUOTAS CON ABONOS 

            /**
             * 
             * @param {*} item 
             */
            cuotaConAbono(item) {
                if (item.saldoTotalActual >= this.getValorAbono()) {
                    this.handleFullAbonoWithExistingAbono(item);
                } else {
                    this.handlePartialAbonoWithExistingAbono(item);
                }
            }

            /**
             * 
             * @param {*} dataCuota 
             */
            handleFullAbonoWithExistingAbono(dataCuota) {

                // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
                if (this.getEsAbonoPosfechado()) {
                    dataCuota.abonoPosfechado = fS.plus(dataCuota.abonoPosfechado, this.getValorAbono(), this.MAX_DECIMALS.DEFAULT);
                } else {
                    let totalAbonoCuota = fS.plus(dataCuota.abono, this.getValorAbono(), this.MAX_DECIMALS.DEFAULT);

                    const abonoRedondeado = fS.roundNumber(totalAbonoCuota, 2);
                    const saldoRedondeado = fS.roundNumber(dataCuota.saldo, 2);
                    const comparacionIgual = abonoRedondeado === saldoRedondeado;

                    if (comparacionIgual) {
                        dataCuota.abono = dataCuota.saldo;

                        //dato real que se presenta en la UI 
                        dataCuota.abonoActual = dataCuota.saldo;
                    } else {
                        dataCuota.abono = this.getValorAbono();


                    }

                }

                // Resta el valor del abono al saldo total actual de la cuota
                let saldoTotalActual = fS.minus(dataCuota.saldoTotalActual, this.getValorAbono(), this.MAX_DECIMALS.DEFAULT);

                //se verifica antes  por temas de decimales porque al final queda milesimas 
                if (fS.roundNumber(saldoTotalActual, 2) === 0) {
                    dataCuota.saldoTotalActual = 0;
                } else {
                    dataCuota.saldoTotalActual = saldoTotalActual;
                }


                // Agrega un detalle de cobro con el valor del abono y el saldo total actual
                this.addCobroDetalle(dataCuota, this.getValorAbono(), dataCuota.saldoTotalActual);

                // Resetea el valor del abono a 0
                this.setValorAbono(0);
            }


            /**
             * Maneja un abono parcial con un abono existente.
             * 
             * @param {*} dataCuota - El objeto que contiene información del abono y el saldoTotalActual.
             */
            handlePartialAbonoWithExistingAbono(dataCuota) {
                // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
                if (this.getEsAbonoPosfechado()) {
                    dataCuota.abonoPosfechado = fS.plus(dataCuota.abonoPosfechado, dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT);
                } else {
                    dataCuota.abono = fS.plus(dataCuota.abono, dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT);

                    //valor real que se presenta en la UI
                    dataCuota.abonoActual = dataCuota.saldoTotalActual;
                }

                // Agrega un detalle de cobro con el saldoTotalActual como valor del abono
                this.addCobroDetalle(dataCuota, dataCuota.saldoTotalActual, 0);

                // Calcula el nuevo valor del abono restando el saldo del valor actual del abono
                let valorAbono = fS.minus(this.getValorAbono(), dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT);
                this.setValorAbono(valorAbono);

                // Establece el saldo del dataCuota a 0
                dataCuota.saldoTotalActual = 0;
            }


            //FIN FUNCIONES DE LA CUOTAS CON ABONOS


            //INICIO FUNCIONES DE LA CUOTAS SIN ABONOS 
            /**
             * 
             * @param {*} dataCuota 
             */
            cuotaSinAbono(dataCuota) {

                if (dataCuota.saldoTotalActual >= this.getValorAbono()) {
                    this.handleFullAbono(dataCuota);
                } else {
                    this.handlePartialAbono(dataCuota);
                }
            }

            /**
             * 
             * @param {*} dataCuota 
             */
            handleFullAbono(dataCuota) {
                dataCuota.abono = this.getEsAbonoPosfechado() ? 0 : this.getValorAbono();

                //abono actual es el que se presenta en la UI
                dataCuota.abonoActual = this.getEsAbonoPosfechado() ? 0 : this.getValorAbono();

                dataCuota.abonoPosfechado = this.getEsAbonoPosfechado() ? this.getValorAbono() : 0;
                dataCuota.saldoTotalActual = fS.minus(dataCuota.saldoTotalActual, this.getValorAbono(), this.MAX_DECIMALS.DEFAULT);
                this.addCobroDetalle(dataCuota, this.getValorAbono(), dataCuota.saldoTotalActual);
                this.setValorAbono(0)
            }

            /**
             * 
             * @param {*} dataCuota 
             */
            handlePartialAbono(dataCuota) {
                dataCuota.abono = this.getEsAbonoPosfechado() ? 0 : fS.instanceDecimal(dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT);

                //valor real que se presenta en la UI
                dataCuota.abonoActual = this.getEsAbonoPosfechado() ? 0 : fS.instanceDecimal(dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT);

                dataCuota.abonoPosfechado = this.getEsAbonoPosfechado() ? fS.instanceDecimal(dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT) : 0;

                let valorAbono = fS.minus(this.getValorAbono(), dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT);

                //verificamos si la resta de valor abono es igual al total a cobrar 
                //tomar mucha en cuenta, se agrega por temas de decimales 
                if (fS.roundNumber(valorAbono, 2) === fS.roundNumber(dataCuota.saldoTotalActual, 2)) {
                    valorAbono = dataCuota.saldoTotalActual;
                }


                this.setValorAbono(valorAbono);

                this.addCobroDetalle(dataCuota, dataCuota.saldoTotalActual, 0);
                dataCuota.saldoTotalActual = 0;
            }

            //FIN FUNCIONES DE LA CUOTAS SIN ABONOS 


            //FUNCIONES COBRO DETALLE 
            /**
           * 
           * @param {*} dataCuota 
           * @param {*} abono 
           * @param {*} saldo 
           * @returns 
           */

            addCobroDetalle(dataCuota, abono, saldo) {
                if (dataCuota.cuota === 0 || abono === 0) return;

                let valorMovimientoSaldo = this.calculateValorMovimientoSaldoCuota(dataCuota);

                this.getCobrosDetalle().push({
                    idCuentaPorCobrar: this._dataCuentaPorCobrar.idCuentaPorCobrar,
                    idCuotaPorCobrar: dataCuota.idCuotaPorCobrar,
                    abono,

                    diasMoraActual: dataCuota.diasMoraActual,
                    interesPorMoraActual: dataCuota.interesPorMoraActual,
                    interesActual: dataCuota.interesActual,


                    cuota: fS.roundNumber(dataCuota.cuota, this.MAX_DECIMALS.DEFAULT),
                    saldo: fS.roundNumber(saldo, this.MAX_DECIMALS.DEFAULT),
                    secuencial: this.getUniqueIndex(),
                    valorSaldoLectura: dataCuota.saldoTotalLectura,
                    saldoOriginal: fS.roundNumber(valorMovimientoSaldo, this.MAX_DECIMALS.DEFAULT),
                    posfechado: this.getEsAbonoPosfechado()
                });

                dataCuota.saldoTotalActual = fS.roundNumber(dataCuota.saldoTotalActual, this.MAX_DECIMALS.DEFAULT);
                dataCuota.saldoTotalOriginal = fS.minus(dataCuota.saldoTotalOriginal, abono, this.MAX_DECIMALS.DEFAULT);
            }

            /**
             * 
             * @param {*} dataCuota 
             * @returns 
             */
            calculateValorMovimientoSaldoCuota(dataCuota) {
                let cobrosDetalleFiltered = this.getCobrosDetalle().filter(cd => (
                    cd.idCuentaPorCobrar === this._dataCuentaPorCobrar.idCuentaPorCobrar &&
                    cd.idCuotaPorCobrar === dataCuota.idCuotaPorCobrar
                ));

                let dataUltimoCobroDetalle = cobrosDetalleFiltered.pop();
                return dataUltimoCobroDetalle
                    ? fS.minus(dataUltimoCobroDetalle.saldoOriginal, dataUltimoCobroDetalle.abono, this.MAX_DECIMALS.DEFAULT)
                    : fS.roundNumber(dataCuota.saldoTotalOriginal, this.MAX_DECIMALS.DEFAULT)
            }



            roundCuotaFields(dataCuota) {
                dataCuota.cuota = dataCuota.cuota
                dataCuota.abono = dataCuota.abono
                dataCuota.abonoPosfechado = dataCuota.abonoPosfechado;
            }

            updateEstado(dataCuota) {
                let dataEstadoPago = this.getEstadoCuota({
                    saldo: dataCuota.saldoTotalActual,
                    abono: dataCuota.abono
                });
                dataCuota.estado = dataEstadoPago.descripcion;
                dataCuota.nombreEstado = dataEstadoPago.descripcion;
            }


            /**
             * 
             * @param {*} param0 
             * @returns 
             */


            getEstadoCuota({ saldo, abono, esPosfechado }) {
                let estado = '';
                let dataEstadoPago = {};

                if (esPosfechado) {
                    dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'PFC');
                } else {
                    if (saldo === 0) {
                        dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'CBR');
                        estado = 'COBRADA'
                    }
                    if (saldo > 0) {
                        dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'PP');
                        estado = "PENDIENTE PARCIAL";
                    }
                    if (abono === 0) {
                        dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'PE');
                        estado = "PENDIENTE";
                    }

                }


                return {
                    idEstadoPago: dataEstadoPago.idEstadoPago,
                    descripcion: estado
                }
            }



            getAbonoCuota() {
                let abonoCuota = this.getCobrosDetalle()
                    .filter(item => item.secuencial === this.getUniqueIndex())
                    .reduce((prev, curr) => fS.instanceDecimal(prev).plus(curr.abono), fS.instanceDecimal(0))
                    .toNumber();
                return abonoCuota;

            }

            /**
             * 
             * @param {*} param0 
             * @returns 
             */
            generarCuentasPorCobrarEstado({ historialCuentas, cobrosDetalle }) {

                let cuentasPorCobrarAgrupado = historialCuentas.reduce((acc, curr) => {
                    let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar);
                    if (!existeDato) {
                        acc.push({
                            ...curr,
                            valorSaldoLectura: fS.instanceDecimal(curr.valorSaldoLectura),
                            abono: fS.instanceDecimal(curr.abono),
                        });
                    } else {
                        existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono);
                    }
                    return acc;
                }, []);

                let cuentasPorCobrarEstado = [];

                for (let item of cuentasPorCobrarAgrupado) {
                    let valorSaldo = fS.instanceDecimal(item.valorSaldoLectura);
                    let totalPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && cd.posfechado)
                        .reduce((acc, curr) => acc.plus(curr.abono), fS.instanceDecimal(0));

                    let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && !cd.posfechado)
                        .reduce((acc, curr) => acc.plus(curr.abono), fS.instanceDecimal(0));


                    valorSaldo = valorSaldo.minus(totalNoPosfechado).toNumber();


                    let dataEstadoPago;
                    if (totalPosfechado.gt(0)) {
                        dataEstadoPago = this.getEstadoCuota({
                            esPosfechado: true,
                            saldo: 0,
                            abono: 0
                        });
                    } else {
                        dataEstadoPago = this.getEstadoCuota({
                            saldo: fS.roundNumber(valorSaldo, fS.max_dos),
                            abono: fS.roundNumber(totalNoPosfechado.toNumber(), fS.max_dos),
                            esPosfechado: false
                        });
                    }

                    cuentasPorCobrarEstado.push({
                        ...item,
                        idEstadoPago: dataEstadoPago.idEstadoPago,
                        abono: fS.roundNumber(totalNoPosfechado.toNumber(), fS.max_dos)
                    });
                }

                return cuentasPorCobrarEstado;

            }



            generarCuotasPorCobrarEstado({ cobrosDetalle }) {

                let cuotasPorCobrarAgrupado = cobrosDetalle.reduce((acc, curr) => {
                    let existeDato = acc.find(dataCxc => (dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar) && (dataCxc.idCuotaPorCobrar === curr.idCuotaPorCobrar));
                    if (!existeDato) {
                        acc.push({
                            ...curr,
                            abono: fS.instanceDecimal(curr.abono)
                        });
                    } else {
                        existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono);
                    }
                    return acc;
                }, []);

                let cuotasPorCobrarEstado = [];

                for (let item of cuotasPorCobrarAgrupado) {
                    let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuotaPorCobrar === item.idCuotaPorCobrar && !cd.posfechado)
                        .reduce((acc, curr) => {
                            return fS.instanceDecimal(acc).plus(curr.abono);
                        }, fS.instanceDecimal(0));

                    let valorSaldoLectura = fS.roundNumber(item.valorSaldoLectura, fS.max_dos);

                    let valorSaldo = fS.instanceDecimal(valorSaldoLectura)
                        .minus(fS.roundNumber(totalNoPosfechado.toNumber(), fS.max_dos))
                        .toNumber();


                    let dataEstadoPago = this.getEstadoCuota({
                        saldo: valorSaldo,
                        abono: item.abono.toNumber(),
                        esPosfechado: false,
                    });

                    cuotasPorCobrarEstado.push({
                        ...item,
                        idEstadoPago: dataEstadoPago.idEstadoPago,
                        abono: totalNoPosfechado.toNumber(),
                    });
                }

                return cuotasPorCobrarEstado;

            }


            clearData() {

                this.setCuentasPorCobrar([])
                this.setValorAbono(0)
                this.setUniqueIndex(0)
                this.setCobrosDetalle([]);
                this.setHistorialCuentas([]);
                //   this.setEstadoCobro([]); 
                this.setEsAbonoPosfechado(false);
            }


        }

        let modalCobroSvcInstance = new ModalCobroService();
        return {
            get: () => modalCobroSvcInstance
        }



    }]);

})()