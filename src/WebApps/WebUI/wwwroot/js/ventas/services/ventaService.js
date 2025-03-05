//@ts-check

(function () {

    'use strict';
    const URL_API = 'Venta/'

    app.factory('ventaService', ['$injector', function ($injector) {
        let service = {};
        let mS = $injector.get('mainService');
        /**
         * 
         * @param {object} query  
         * @returns array
         */
        service.getDataForm = function (query) {
            return mS.getData('get', 'Venta/CatalogoVenta/?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let payload = JSON.parse(response.payload);

                    let estabs = payload[0];
                    let ptosEmision = payload[1];
                    let bodegas = payload[2];
                    let configVenta = payload[3][0]
                    let decimal = JSON.parse(payload[4][0].jsonConfig)
                    let configDetalle = payload[5][0];
                    let tipoIvas = payload[6];
                    let tarifas = payload[7];
                    let tiempoCreditos = payload[8];
                    let articuloPredeterminado = payload[9][0]
                    let clientePredeterminado = payload[10][0];
                    let permisoVenta = JSON.parse(payload[11][0].jsonPermission);
                    let permisoArticulo = payload[12][0];


                    let estabsMapper = estabs.map(item => ({
                        codEstab_Asig: item.codEstab_Asig,
                        codEstab: item.codEstab,
                        predeterminado: item.predeterminado,
                        nombreComercial: item.nombreComercial,
                        estab: item.estab,
                        tarifasImpuestos: JSON.parse(item.tarifasImpuestos)
                    }))

                    let ptosEmisionMapper = ptosEmision.map(item => ({
                        codEstab_Asig: item.codEstab_Asig,
                        idPuntoEmision: item.idPuntoEmision,
                        ptoEmi: item.ptoEmi,
                        predeterminado: item.predeterminado,
                    }))

                    let configVentaMapper = {
                        idCliente: configVenta.idCliente | 0,
                        searchCode: configVenta.searchCode | false,
                        printerAutomatic: configVenta.printerAutomatic | false,
                        payAutomatic: configVenta.payAutomatic | true,
                    }

                    let decimalMapper = {
                        nroPrecio: decimal.nroPrecio || 3,
                        nroCantidad: decimal.nroCantidad || 3,
                        nroIva: decimal.nroIva || 3,
                        nroDescuentoDetalle: decimal.nroDescuentoDetalle || 3,
                        nroTotalDetalle: decimal.nroTotalDetalle || 3,
                        nroTotalSubTotal: decimal.nroTotalSubTotal || 3,
                        nroDescuento: decimal.nroDescuento || 3,
                        nroIce: decimal.nroIce || 3,
                        importeTotal: decimal.importeTotal || 3,
                    }


                    let tipoIvasMapper = tipoIvas.map(item => ({
                        idTipoIva: item.idTipoIva,
                        descripcion: item.descripcion,
                        tarifa: item.tarifa,
                        codigoPorcentaje: item.codigoPorcentaje,
                    }))

                    let tiempoCreditosMapper = tiempoCreditos.map(item => ({
                        idTiempoCredito: item.idTiempoCredito,
                        descripcion: item.descripcion,
                        diasCredito: item.diasCredito,
                        numeroCuota: item.numeroCuota,
                    }))


                    return {
                        establecimientos: estabsMapper,
                        ptosEmision: ptosEmisionMapper,
                        bodegas,
                        configVenta: configVentaMapper,
                        decimal: decimalMapper,
                        configDetalle,
                        tipoIvas: tipoIvasMapper,
                        tarifas,
                        tiempoCreditos: tiempoCreditosMapper,
                        articuloPredeterminado,
                        clientePredeterminado,
                        permisoVenta,
                        permisoArticulo
                    }

                }
            })
        }


        service.getIdNotaEntrega = function (id) {
            return mS.getData('get', "Venta/NotaEntrega/GetId/" + id, null, true).catch(error => {
                console.log('sale service', error)
                throw new Error(error)
            })
        }

        service.verifyPendientAccount = (query) => {
            let params = {
                tipo: 5,
                idCliente: query.idCliente
            }
            showLoader();
            return mS.getData('get', 'Contabilidad/CuentaPorCobrar/?json=' + JSON.stringify(params), null, true)
                .then(async response => {
                    hideLoader();
                    if (!response) return true;

                    const { deuda } = response;
                    let pendientAccounts = deuda;

                    if (pendientAccounts.length === 0) return false;

                    let { totalImporteTotal, totalAbono, totalSaldo } = pendientAccounts.reduce((value, item) => {
                        value.totalImporteTotal += item.importeTotal;
                        value.totalAbono += item.abono;
                        value.totalSaldo += item.saldo;
                        return value;

                    }, { totalImporteTotal: 0, totalAbono: 0, totalSaldo: 0 })

                    let html = `<div class="table-responsive">
                    <table class="table table-hover table-bordered table-sm">
                        <thead>
                            <tr>
                                <th><small>N°</small></th>                              
                                <th><small>Tipo. Doc.</small></th>                                                              
                                <th><small>Total</small></th>
                                <th><small>Abono</small></th>
                                <th><small>Saldo</small></th>
                            </tr>
                        </thead>
                        <tbody>`;

                    let index = 1;
                    for (let pendientAccount of pendientAccounts) {
                        html += ` <tr>
                        <td>${index++}</td>
                        <td>${pendientAccount.documento}</td>                        
                        <td>$${pendientAccount.importeTotal}</td>
                        <td>$${pendientAccount.abono}</td>
                        <td>$${pendientAccount.saldo}</td>
                    </tr>
                `
                    }
                    html += `</tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2">Total:</td>
                                <td>${totalImporteTotal.toFixed(2)}</td>
                                <td>${totalAbono.toFixed(2)}</td>
                                <td>${totalSaldo.toFixed(2)}</td>
                            </tr>
                        </tfoot></table></div>`
                    await Swal.fire({
                        title: '<small>Cuentas pendientes</small>',
                        icon: 'info',
                        html,
                        width: 800
                    })
                    return true;

                })
                .catch(error => {
                    hideLoader();
                    throw error;
                })
        }
        return service;
    }])

    /**
     * Nota Entrega 
     */

    app.factory('notaEntregaService', ['$injector', function ($injector) {
        let url = `${URL_API}NotaEntrega/`;
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')
        const pricingUtils = $injector.get('pricingUtils')
        const userCustomerPermissionSvc = $injector.get('userCustomerPermissionService');

        let service = {
            data: {}
        };

        service.getDataFilter = function () {
            let json = JSON.stringify({
                tipo: 3
            })
            return mS.getData('get', url + 'Get?json=' + json, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let tempEstabsAndPtosEmision = mainData[0];
                    let estadosDoc = mainData[1];

                    let dataToGroup = {
                        estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision 
                    }
                    let estabs = fS.groupingEstab(dataToGroup);

                    return {
                        estabs,
                        estadosDoc
                    }
                }
            })
        }

        service.getDataForm = () => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let decimal = mainData[0][0];
                    let tarifasImpuesto = mainData[1];
                    let tarifas = mainData[2];
                    let tiemposCredito = mainData[3];

                    let clienteDefaultTemp = mainData[5];
                    let clienteDefault = {};
                    if (clienteDefaultTemp && clienteDefaultTemp.length > 0) {
                        clienteDefault = clienteDefaultTemp[0];

                        clienteDefault = {
                            ...clienteDefault,
                            placas: clienteDefault.placa ? clienteDefault.placa.split(/[\|;]/) : []
                        }
                    }
                    let config = mainData[6][0];
                    let vendedores = mainData[7];
                    let notificacionVenta = {
                        notificacionVenta: false
                    }
                    let notificacionVentaTemp = mainData[8];
                    notificacionVenta = notificacionVentaTemp.length === 0 ? notificacionVenta : notificacionVentaTemp[0];
                    let tempEstabsAndPtosEmision = mainData[9];
                    let tempBodegas = mainData[10];
                    let { sales: permisoVenta, permisoEditarDoc } = userCustomerPermissionSvc.userPermissionAdapter();

                    let dataToGroup = {
                        estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                        bodegas: tempBodegas, // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);

                    let formasPago = mainData[11];
                    let tiposIdentificacion = mainData[12];
                    let infoAdicional = mainData[13] || [];
                    infoAdicional = infoAdicional.map((item) => {
                        return {
                            ...item,
                            infoAdicional: JSON.parse(item.infoAdicional),
                        };
                    });
                    return {
                        estabs,
                        tarifasImpuesto,
                        clienteDefault,
                        tiemposCredito,
                        tarifas,
                        permisoVenta,
                        notificacionVenta,
                        decimal,
                        config,
                        vendedores,
                        permisoEditarDoc,
                        formasPago: fS.mapperFromFormaPago(formasPago),
                        tiposIdentificacion,
                        infoAdicional

                    }
                }
            })
        }


        /**
         * tipo 1: get notas entrega 
         * tipo 2: get invoices for credit note 
         * tipo 3: get estabs, ptos. emisiones para los filtros
         * @returns 
         */

        service.get = (params) => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(params), null, true).then(response => {
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
                }
            })
        }

        service.getAll = function (query) {

            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 1 })), null, true).then(response => {

                if (!response || response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let notaEntregaRepos = mainData[0];
                    let { totalRecords, totalDocument, totalAbono, totalSaldo } = notaEntregaRepos[0];


                    let notaEntregas = notaEntregaRepos.map(item => {

                        return {
                            comprobante: 'Nota de Entrega',
                            idDocumento: item.idDocumento,
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            codEstab: item.codEstab,
                            razonSocialComprador: item.nombreFiscal,
                            fechaEmision: item.fechaEmision,
                            fechaVencimiento: item.fechaVencimiento,
                            total: item.total,
                            serieComprobante: item.serieComprobante,
                            estadoFinanciero: item.estadoFinanciero,
                            codDoc: "NE",
                            abono: item.abono,
                            saldo: item.saldo,
                            style: item.style,
                            esContado: item.tiempoCredito,
                            tiempoCredito: item.tiempoCredito,
                            usuario: item.usuario,
                            codEstado: item.codEstado,
                            disabledUpdate: item.codEstado === 'A' || item.codEstado === 'TRA' || item.codEstado === 'CBR' || item.anulada || item.convertToDoc,
                            disabledAnular: item.codEstado === 'A' || item.codEstado === 'TRA' || item.codEstado === 'CBR' || item.convertToDoc,
                            enabledConvertToDoc: !(item.convertToDoc || item.codEstado === 'A'),
                            enabledHistorialConvert: item.convertToDoc,
                            enabledHistorialCobro: item.codEstado === 'CBR' || item.codEstado === 'PP',
                            convertToDoc: item.convertToDoc,
                            esAnulado: item.codEstado === 'A',
                            enabledPayment: item.codEstado === 'PP' || item.codEstado === 'PE',
                            totalRecords: item.totalRecords

                        }
                    })


                    return {
                        notaEntregas,
                        dataTotals: { totalRecords, totalDocument, totalAbono, totalSaldo }
                    }
                }
            })
        }

        service.generateSerieComprobante = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 4 })), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let data = mainData[0][0];
                    return data.serieComprobante;
                }
            })
        }

        service.queryMapper = function (params) {
            let {
                data,
                cliente,
                detalles,
                itemsDeleted,
                infoAdicionalDocumento,
                cuotas
            } = params;
            //data que se usara dentro de la función "getCantidadStock"
            service.data = Object.assign({}, data);

            let notaEntrega = Object.assign({}, data);
            notaEntrega.fechaEmision = fS.formatDateTimeZone(data.fechaEmision)
            notaEntrega.fechaVencimiento = fS.formatDateTimeZone(data.fechaVencimiento)


            if (cliente.idCliente === 0 && !cliente.razonSocialComprador && !cliente.identificacionComprador) {
                throw new Error("Datos de cliente no proporcionados")
            }

            notaEntrega.idTipoIdentificacion = cliente.idTipoIdentificacion;
            notaEntrega.idCliente = cliente.idCliente;
            notaEntrega.identificacionComprador = cliente.identificacionComprador;
            notaEntrega.razonSocialComprador = cliente.razonSocialComprador;
            notaEntrega.direccionComprador = cliente.direccionComprador;
            notaEntrega.email = cliente.email;
            notaEntrega.telefono = cliente.telefono;

            let mergeDetalles = [
                ...detalles,
                ...itemsDeleted
            ]

            const itemsMainMapper = service.detalleMapperTo(mergeDetalles);

            //  const itemsMainMapper = service.detalleMapperTo(detalles);
            // const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted || [])
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            infoAdicionalDocumento = infoAdicionalDocumento || [];
            let infoAdicionalDocumentoMapped = infoAdicionalDocumento.map(item => {
                return {
                    // uuid: item.uniqueRowDetalle, //uid de articulo detalle 
                    idInfoAdicional: item.idInfoAdicional,
                    idInfoAdicionalDoc: item.idInfoAdicionalDoc,
                    nombre: item.nombre,
                    valor: item.valor,
                    estado: item.estado
                }
            })

            const mapItem = (item, estado) => ({
                uuid: item.uniqueRowDetalle,
                idHistoryInfoAdicional: item.idHistoryInfoAdicional || 0,
                idArticulo: item.idArticulo,
                idInfoAdicional: item.idInfoAdicional,
                estado: estado
            });


            const datosAdicionalesArticuloDeleted = mergeDetalles
                .flatMap(md => md.datosAdicionalesArticulo)
                .filter(md => md.idHistoryInfoAdicional > 0 && !md.selected)
                .map(item => mapItem(item, 1));

            const datosAdicionalesArticuloSelectedDeleted = mergeDetalles
                .flatMap(md => md.datosAdicionalesArticulo)
                .filter(md => md.idHistoryInfoAdicional > 0 && md.selected)
                .map(item => mapItem(item, 2));

            const datosAdicionalesArticuloSelected = mergeDetalles
                .flatMap(md => md.datosAdicionalesArticulo)
                .filter(md => !(md.idHistoryInfoAdicional > 0) && md.selected)
                .map(item => mapItem(item, 2));

            const mergeDatosAdicionalesArticulo = [
                ...datosAdicionalesArticuloSelected,
                ...datosAdicionalesArticuloSelectedDeleted,
                ...datosAdicionalesArticuloDeleted
            ];




            return {
                notaEntrega: service.infoComprobanteMapperTo(notaEntrega),
                detalles: itemsMainMapper,
                impuestos: impuestos,
                infoAdicional: infoAdicionalDocumentoMapped,
                infoAdicionalArticulo: mergeDatosAdicionalesArticulo,
                cuotas
            }
        }

        service.infoComprobanteMapperTo = function (data) {
            const result = {
                uniqueId: data.uniqueId, //se envia cuando el documento proviebe desde el modulo de aprobacion
                idCliente: data.idCliente,
                idTiempoCredito: data.idTiempoCredito,
                idPuntoEmision: data.idPuntoEmision,
                idUsuario: data.idUsuario,
                tarifa: data.tarifa,
                fechaEmision: data.fechaEmision,
                fechaVencimiento: data.fechaVencimiento,
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                totalDescuento: data.totalDescuento || 0,
                porcentajeDescuento: data.porcentajeDescuento || 0,
                irbpnr: data.irbpnr || 0,
                propina: data.propina || 0,
                recargo: data.recargo || 0,
                transporte: data.transporte || 0,
                total: data.total,
                observacion: data.observacion,
                placa: data.placa,
                idTipoIdentificacion: data.idTipoIdentificacion,
                identificacionComprador: data.identificacionComprador,
                razonSocialComprador: data.razonSocialComprador,
                direccionComprador: data.direccionComprador,
                email: data.email,
                telefono: data.telefono,
            }
            return result;
        }

        /**
         * Detalle Mapper Nota Entrega
         * @param {*} detalles 
         * @returns 
         */
        service.detalleMapperTo = function (detalles) {
            let tempDetails = [];
            let orderIndex = 1;

            for (let item of detalles) {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                tempDetails.push({
                    orderIndex: orderIndex++,
                    uuid: item.uniqueRowDetalle,
                    idNotaEntregaDetalle: item.idNotaEntregaDetalle || 0,
                    idFacturaDetalle: item.idFacturaDetalle || 0,
                    idArticulo: item.idArticulo,
                    idTarifa: item.idTarifa,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa, //✅
                    codigoPorcentaje: item.codigoPorcentaje, //✅
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    nota: item.nota || undefined,
                    llevaInventario: item.llevaInventario,
                    precioCosto: item.precioCosto,
                    conversion: item.conversion,
                    precioCostoFraccionado: item.precioCostoFraccionado,
                    cantidadTransaccion,
                    estado: item.estado,
                    valorImpuesto: item.valorImpuesto
                })
            }
            return tempDetails;
        }

        /**
         * 
         * @param {*} rowEntity 
         * @param {*} fechaEmision unicamente se envia desde el controlador de NotaEntregaCtrl
         * @returns 
         */
        service.getCantidadStock = function (rowEntity, fechaEmision) {
            let fechaEmisionValidate = null;
            let cantidadStock = 0;
            let action = 0;
            let fechaEmisionDocCreado = null;

            if (fechaEmision) {
                fechaEmisionValidate = fechaEmision;
            } else {
                fechaEmisionValidate = service.data.fechaEmision;
            }

            if (typeof service.data === 'object' && service.data.idNotaEntrega > 0) {
                fechaEmisionDocCreado = service.data.fechaEmisionDocCreado;
            }

            if (!fechaEmisionValidate) {
                console.warn('Para validacion del cantidad stock la fecha emision del comprobante es nula')
            }

            let dataConsolidacionFecha = rowEntity.consolidacionesFecha.find(
                cdataFecha => cdataFecha.idBodega === rowEntity.idBodega
            )
            if (dataConsolidacionFecha && fS.isDateValid(dataConsolidacionFecha.fechaConsolidacion)) {
                if (rowEntity.idNotaEntregaDetalle > 0 && rowEntity.estado && fechaEmisionDocCreado.getTime() !== fechaEmisionValidate.getTime()) {

                    //si fecha documento creado es anterior a fecha consolidacion articulo
                    if (fechaEmisionDocCreado >= dataConsolidacionFecha.fechaConsolidacion) {
                        //si fecha emision actual creado es anterior a fecha consolidacion articulo 
                        if (fechaEmisionValidate <= dataConsolidacionFecha.fechaConsolidacion) {
                            return {
                                cantidadStock: rowEntity.cantidadOriginal * rowEntity.conversion,
                                action: 2
                            }
                        } else if (fechaEmisionValidate >= dataConsolidacionFecha.fechaConsolidacion) {
                            cantidadStock = rowEntity.cantidad * rowEntity.conversion;

                            let resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;
                            return {
                                cantidadStock: resultCantStock,
                                action: 2
                            };
                        }
                    }

                    //si fecha documento creado es anterior a fecha consolidacion articulo
                    if (fechaEmisionDocCreado <= dataConsolidacionFecha.fechaConsolidacion) {
                        //si fecha emision actual creado es anterior a fecha consolidacion articulo 
                        if (fechaEmisionValidate >= dataConsolidacionFecha.fechaConsolidacion) {
                            cantidadStock = rowEntity.cantidad * rowEntity.conversion;

                            let resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;

                            return {
                                cantidadStock: resultCantStock,
                                action: 2
                            };
                        }
                    }

                    // if (fechaEmisionDocCreado > dataConsolidacionFecha.fechaConsolidacion &&
                    //     fS.getDate(dataConsolidacionFecha.fechaConsolidacion) >= fS.getDate(fechaEmisionValidate)
                    // ) {
                    //     return {
                    //         cantidadStock: rowEntity.cantidadOriginal * rowEntity.conversion,
                    //         action: 2
                    //     }

                    // }
                }



                // if (
                //     rowEntity.idNotaEntregaDetalle > 0 &&
                //     fechaEmisionDocCreado !== fechaEmisionValidate &&
                //     rowEntity.estado &&
                //     dataConsolidacionFecha.fechaConsolidacion > fechaEmisionValidate
                // ) {
                //     return {
                //         cantidadStock: rowEntity.cantidadOriginal * rowEntity.conversion,
                //         action: 2
                //     }
                // }

                if (dataConsolidacionFecha.fechaConsolidacion >= fechaEmisionValidate) {
                    cantidadStock = 0;
                    action = 1;
                    return {
                        cantidadStock,
                        action
                    };
                }
            }

            cantidadStock = rowEntity.cantidad * rowEntity.conversion;

            let resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;

            return {
                cantidadStock: resultCantStock,
                action
            };
        }



        service.save = function (data) {
            return mS.getData('post', url + 'Insert/', { data }, true).then(response => {
                if (response.code === "0") {
                    service.data = {};
                    return response;
                }
                if (response.code === "1") {
                    let dataRepository = JSON.parse(response.payload)[0];

                    let dataResponse = {
                        ...dataRepository,
                        esContado: dataRepository.tiempoCredito,
                    }

                    return {
                        dataResponse,
                        code: '1',
                        message: 'Registrado Correctamente'
                    }
                }
            }).catch(error => {
                service.data = {};
                throw error;
            })
        }

        service.getId = function (id) {
            return mS.getData('get', `${url}GetId/${id}`, null, true).then(response => {
                if (response.code === "0") {
                    console.log(response)
                }
                if (response.code === "1") {
                    let mainDataApi = JSON.parse(response.payload);

                    let [
                        comprobanteApi,
                        clienteTempApi,
                        itemsApi,
                        infoAdicionalDocumento,
                        datosAdicionalesArticuloTemp,
                        cuentaPorCobrar,
                        cuotas,
                    ] = mainDataApi;

                    let comprobanteTemp = comprobanteApi && comprobanteApi[0] || {};
                    let cliente = clienteTempApi && clienteTempApi[0] || {};
                    cliente = {
                        ...cliente,
                        razonSocialComprador: cliente.nombreFiscal,
                        identificacionComprador: cliente.numeroIdentificacion,
                        placas: cliente.placa ? cliente.placa.split(/[\|;]/) : []
                    }

                    let items = itemsApi.map((itemPrincipal, index) => {

                        const { fraccionado, principal, consolidacion, ...restItem } = itemPrincipal;

                        let consolidacionesFechaTemp = consolidacion && JSON.parse(consolidacion) || [];
                        let consolidacionesFecha = consolidacionesFechaTemp.map((data) => ({
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }))

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let uniqueRowDetalle = restItem.uuid;
                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};

                        let datosAdicionalesArticulo = [];

                        if (itemPrincipal.infoAdicionalArticulo && typeof itemPrincipal.infoAdicionalArticulo === 'string') {
                            let infoAdicionalArrayTemp = JSON.parse(itemPrincipal.infoAdicionalArticulo);
                            datosAdicionalesArticulo = infoAdicionalArrayTemp.map(dataAdicional => ({
                                uniqueRowDetalle,
                                idArticulo: restItem.idArticulo,
                                idInfoAdicional: dataAdicional.idInfoAdicional,
                                jsonAdicional: JSON.parse(dataAdicional.jsonAdicional),
                            }))
                        }

                        if (Array.isArray(datosAdicionalesArticuloTemp) && datosAdicionalesArticuloTemp.length > 0) {
                            let datosAdicionalesFiltered = datosAdicionalesArticuloTemp.filter(daa => daa.uuid === uniqueRowDetalle)
                                .map(daa => {
                                    return {
                                        idHistoryInfoAdicional: daa.idHistoryInfoAdicional,
                                        uniqueRowDetalle,
                                        idInfoAdicional: daa.idInfoAdicional,
                                        jsonAdicional: daa.jsonAdicional && JSON.parse(daa.jsonAdicional) || [],
                                        selected: daa.selected,
                                    }
                                })

                            datosAdicionalesArticulo = [...datosAdicionalesArticulo, ...datosAdicionalesFiltered]
                        }


                        let precioConIva = pricingUtils.calcularPrecioConIva(itemPrincipal.precioUnitario, itemPrincipal.tarifa);

                        let total = fS.roundNumber(itemPrincipal.precioTotalSinImpuesto, pricingUtils.max_dos) + fS.roundNumber(itemPrincipal.valorImpuesto, pricingUtils.max_dos);

                        let obj = {
                            n: index + 1,
                            uniqueRowDetalle,
                            idNotaEntregaDetalle: itemPrincipal.idNotaEntregaDetalle,
                            cantidad: itemPrincipal.cantidad,
                            cantidadOriginal: itemPrincipal.cantidad,
                            codigo: itemPrincipal.codigo,
                            codigoPorcentaje: itemPrincipal.codigoPorcentaje,//✅
                            descripcion: itemPrincipal.descripcion,
                            ice: itemPrincipal.ice || 0,
                            idArticulo: itemPrincipal.idArticulo,
                            idBodega: itemPrincipal.idBodega,
                            idImpuesto: itemPrincipal.idImpuesto,
                            idMedida: itemPrincipal.idMedida,
                            idTarifa: itemPrincipal.idTarifa,
                            idTipoIva: itemPrincipal.idTipoIva,
                            llevaInventario: itemPrincipal.llevaInventario,
                            nota: itemPrincipal.nota,
                            porcentajeDescuento: itemPrincipal.porcentajeDescuento,
                            precioSinSubsidio: itemPrincipal.precioSinSubsidio || 0,
                            precioCosto: itemPrincipal.precioCosto,
                            precioUnitario: itemPrincipal.precioUnitario,
                            precioConIva,
                            tarifa: itemPrincipal.tarifa,//✅
                            valorDescuento: itemPrincipal.valorDescuento,
                            valorImpuesto: itemPrincipal.valorImpuesto,//✅
                            precioTotalSinImpuesto: itemPrincipal.precioTotalSinImpuesto,
                            medidas,
                            conversion: dataMedida.conversion,
                            precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha,
                            estado: 1,
                            datosAdicionalesArticulo,
                            datosAdicionales: restItem.datosAdicionales,
                            total
                        }

                        return obj;
                    });

                    let comprobante = {
                        ...comprobanteTemp,
                        idCliente: cliente.idCliente,
                        serieComprobante: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}-${comprobanteTemp.secuencial}`,
                        puntoEmision: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}`,
                        fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                        fechaEmisionDocCreado: fS.formatDate(comprobanteTemp.fechaEmision),
                        irbpnr: comprobanteTemp.irbpnr || 0,
                        idTiempoCredito: cuentaPorCobrar[0].idTiempoCredito,
                        fechaVencimiento: fS.formatDate(cuentaPorCobrar[0].fechaVencimiento),

                    }

                    cuotas = cuotas.map(item => {
                        return {
                            idCuotaPorCobrar: item.idCuotaPorCobrar,
                            nroCuota: item.nroCuota,
                            fechaVencimiento: fS.formatDate(item.fechaVencimiento),
                            cuota: item.cuota,
                            entrada: item.entrada,
                        }
                    })

                    infoAdicionalDocumento = infoAdicionalDocumento || [];
                    infoAdicionalDocumento = infoAdicionalDocumento.map(item => {
                        return {
                            uniqueRowDetalle: item.uuid,
                            idInfoAdicional: item.idInfoAdicional,
                            idInfoAdicionalDoc: item.idInfoAdicionalDoc,
                            nombre: item.nombre,
                            valor: item.valor,
                            estado: item.estado
                        }
                    })

                    return {
                        comprobante,
                        cliente,
                        items,
                        infoAdicionalDocumento,
                        cuotas
                    }
                }
            })
        }

        service.getIdForInfo = function (id) {
            let spParams = {
                tipo: 5,
                id
            }
            return mS.getData('get', `${url}Get?json=${JSON.stringify(spParams)}`, null, true).then(response => {
                if (response.code === "0") {
                    console.log("Get Data Info", response)
                    throw response;
                }
                if (response.code === "1") {
                    let mainDataApi = JSON.parse(response.payload);

                    let dataTemp = mainDataApi[0][0];
                    let cliente = mainDataApi[1][0];
                    let { nombreComercial, fechaEmision, fechaVencimiento, ...restData } = dataTemp;

                    let items = mainDataApi[2];
                    let infoAdicionalDocumento = mainDataApi[3];
                    let tarifasImpuesto = mainDataApi[4];

                    let data = {
                        ...restData,
                        establecimiento: nombreComercial,
                        fechaEmision: fS.formatDate(fechaEmision),
                        fechaVencimiento: fS.formatDate(fechaVencimiento),
                    }
                    let resultsItems = items.map(item => {
                        let precioConIva = pricingUtils.calcularPrecioConIva(item.precioUnitario, item.tarifa);
                        return {
                            ...item,
                            precioConIva
                        }
                    })
                    return {
                        data,
                        cliente,
                        items: resultsItems,
                        infoAdicionalDocumento,
                        tarifasImpuesto
                    }

                }
            })
        }


        service.getDetalleDoc = function (id) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ tipo: 6, id })}`, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let [itemsApi] = JSON.parse(response.payload);
                    let items = itemsApi.map((itemPrincipal, index) => {

                        const { fraccionado, principal, ...restItem } = itemPrincipal;

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};

                        let precioConIva = restItem.precioUnitario + restItem.valorImpuesto;
                        let total = restItem.precioTotalSinImpuesto + restItem.valorImpuesto;

                        let obj = {
                            n: index + 1,
                            idNotaEntregaDetalle: itemPrincipal.idNotaEntregaDetalle,
                            cantidad: itemPrincipal.cantidad,
                            cantidadOriginal: itemPrincipal.cantidad,
                            codigo: itemPrincipal.codigo,
                            codigoPorcentaje: itemPrincipal.codigoPorcentaje,//✅
                            descripcion: itemPrincipal.descripcion,
                            ice: itemPrincipal.ice || 0,
                            idArticulo: itemPrincipal.idArticulo,
                            idBodega: itemPrincipal.idBodega,
                            idImpuesto: itemPrincipal.idImpuesto,
                            idMedida: itemPrincipal.idMedida,
                            idTarifa: itemPrincipal.idTarifa,
                            idTipoIva: itemPrincipal.idTipoIva,
                            llevaInventario: itemPrincipal.llevaInventario,
                            nota: itemPrincipal.nota,
                            porcentajeDescuento: itemPrincipal.porcentajeDescuento,
                            precioSinSubsidio: itemPrincipal.precioSinSubsidio || 0,
                            precioCosto: 0,
                            precioUnitario: itemPrincipal.precioUnitario,
                            tarifa: itemPrincipal.tarifa,//✅
                            valorDescuento: itemPrincipal.valorDescuento,
                            valorImpuesto: itemPrincipal.valorImpuesto,//✅
                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha: [],
                            estado: 1,
                            datosAdicionalesArticulo: [],
                            precioTotalSinImpuesto: itemPrincipal.precioTotalSinImpuesto,
                            fechaEmision: fS.formatDate(itemPrincipal.fechaEmision),
                            precioConIva,
                            total: fS.roundNumber(total, 5)
                        }

                        return obj;

                    })
                    return {
                        items
                    }
                }
            })
        }


        service.update = function (id, data) {

            return mS.getData('put', url + 'Update/' + id, { data }, true).then(response => {
                if (response.code === "0") {
                    service.data = {};
                    return response;
                }
                if (response.code === "1") {
                    return response
                }
            }).catch(error => {
                service.data = {};
                throw error;
            })
        }

        // service.delete = function (id) {
        //     return mS.getData('delete', url + 'Delete/' + id, null, true).then(response => {
        //         if (response.code === "0") {
        //             return response;
        //         }
        //         if (response.code === "1") {
        //             return response
        //         }
        //     })
        // }

        service.anular = function(id, infoAdicional){
            let data = {
                infoAdicional
            }
            return mS.getData('put',  `${url}Cancel/${id}`, {data})

        }


        //Validaciones
        service.getTotales = function (notaEntregas) {
            let total = 0, totalAbono = 0, totalSaldo = 0;
            for (let val of notaEntregas) {
                if (val.codEstado !== 'A') {
                    total += val.total;
                    totalAbono += val.abono;
                    totalSaldo += val.saldo;
                }
            }
            return {
                total,
                totalAbono,
                totalSaldo
            }
        }


        //Conversion nota entrega a FACTURA  
        service.getDataFormConvert = function () {
            let json = JSON.stringify({
                tipo: 9
            })
            return mS.getData('get', `${url}Get?json=${json}`, null, true).then(response => {
                let result = {
                    tiemposCredito: [],
                    formasPagoSri: [],
                    config: {
                        idFormaPagoSri: 0,
                        multipleVendedor: false,
                    },
                    vendedores: []
                };
                if (response.code === "1") {
                    let [tiemposCredito, config, formasPagoSri, vendedores] = JSON.parse(response.payload);
                    let dataConfig = config[0];

                    result.tiemposCredito = tiemposCredito;
                    result.formasPagoSri = formasPagoSri;

                    result.config = {
                        idFormaPagoSri: dataConfig.idFormaPagoSri,
                        multipleVendedor: dataConfig.multipleVendedor
                    }
                    result.vendedores = vendedores;
                }

                return result;

            })
        }

        service.convertToDoc = function (data) {
            return mS.getData('post', url + 'ConvertToDoc', { data }, true)
        }

        service.queryMapperConvertToDoc = function (obj) {
            let {
                id,
                codDocDestino,
                codDoc,
                comprobante,
                detalles,
                infoAdicionalDocumento,
                cuotas,
                dataFormaPago
            } = obj;

            let resultComprobante = {
                idNotaEntrega: id,
                idTiempoCredito: comprobante.idTiempoCredito,
                idCliente: comprobante.idCliente,
                idPuntoEmision: comprobante.idPuntoEmision,
                idUsuario: comprobante.idUsuario || 0,
                fechaEmision: fS.formatDateMoment(comprobante.fechaEmision),
                fechaVencimiento: fS.formatDateMoment(comprobante.fechaVencimiento),
                subTotalSinImpuestos: comprobante.subTotalSinImpuestos,
                totalDescuento: comprobante.totalDescuento,
                porcentajeDescuento: comprobante.porcentajeDescuento,
                propina: comprobante.propina || 0,
                recargo: comprobante.recargo || 0,
                transporte: comprobante.transporte || 0,
                total: comprobante.total,
                observacion: comprobante.observacion,
                docDestino: codDocDestino,
                codDoc
            }


            // let datosAdicionalesArticuloSelected = detalles.flatMap(md => md.datosAdicionalesArticulo).filter(md => {
            //     return !(md.idHistoryInfoAdicional > 0) && (md.selected)
            // }).map(item => {
            //     return {
            //         uuid: item.uniqueRowDetalle,
            //         idHistoryInfoAdicional: item.idHistoryInfoAdicional || 0,
            //         idArticulo: item.idArticulo,
            //         idInfoAdicional: item.idInfoAdicional,
            //         estado: 2
            //     }
            // })


            const resultDetalles = detalles.map((item, index) => {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                return {
                    orderIndex: index++,
                    uuid: item.uniqueRowDetalle || fS.generateUuidv4(),
                    idArticulo: item.idArticulo,
                    idTarifa: item.idTarifa,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa, //✅
                    codigoPorcentaje: item.codigoPorcentaje, //✅
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    nota: item.nota || undefined,
                    llevaInventario: item.llevaInventario,
                    precioCosto: item.precioCosto,
                    precioSinSubsidio: item.precioSinSubsidio,
                    conversion: item.conversion,
                    precioCostoFraccionado: item.precioCostoFraccionado,
                    cantidadTransaccion,
                    estado: item.estado,
                    valorImpuesto: item.valorImpuesto
                }
            })
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            return {
                comprobante: resultComprobante,
                detalles: resultDetalles,
                impuestos: impuestos,
                infoAdicional: infoAdicionalDocumento || [],
                cuotas,
                formaPago: dataFormaPago,
            }
        }

        service.getHistorialConversionDoc = function (id) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 8, id }), null, true).then(response => {
                let results = [];
                if (response.code === "1") {
                    let [historialConversion] = JSON.parse(response.payload)
                    results = historialConversion;
                }
                return results;
            })
        }

        return service;

    }])

    /**
     * Proforma 
     */
    app.factory('proformaService', ['$injector', function ($injector) {
        let url = `${URL_API}Proforma/`;
        // let url_v2 = `${URL_API}v2/Proforma/`;
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        const pricingUtils = $injector.get('pricingUtils')
        const userCustomerPermissionSvc = $injector.get('userCustomerPermissionService');

        let service = {};

        service.getDataForm = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    let decimal = mainData[0][0];
                    let tarifasImpuesto = mainData[1];
                    let tarifas = mainData[2];
                    let tiemposCredito = mainData[3];
                    let clienteDefaultTemp = mainData[5];
                    let clienteDefault = {};
                    if (clienteDefaultTemp && clienteDefaultTemp.length > 0) {
                        clienteDefault = clienteDefaultTemp[0];

                        clienteDefault = {
                            ...clienteDefault,
                            placas: clienteDefault.placa ? clienteDefault.placa.split(/[\|;]/) : []
                        }
                    }
                    let config = mainData[6][0];
                    let vendedores = mainData[7];
                    let tempEstabsAndPtosEmision = mainData[8];
                    let tempBodegas = mainData[9];
                    let infoAdicional = mainData[10] || [];
                    infoAdicional = infoAdicional.map((item) => {
                        return {
                            ...item,
                            infoAdicional: JSON.parse(item.infoAdicional),
                        };
                    });
                    let { sales: permisoVenta, permisoEditarDoc } = userCustomerPermissionSvc.userPermissionAdapter();

                    let dataToGroup = {
                        estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                        bodegas: tempBodegas, // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);

                    return {
                        estabs,
                        tarifasImpuesto,
                        tiemposCredito,
                        tarifas,
                        permisoVenta,
                        clienteDefault,
                        decimal,
                        config,
                        vendedores,
                        permisoEditarDoc,
                        infoAdicional
                    }
                }
            })
        }


        /**
         * tipo 1: get proformas  
         * tipo 3: get estabs, ptos. emisiones para los filtros
         * @returns 
         */
        service.get = (params) => {
            if (!("tipo" in params)) {
                throw "Requiere propiedad tipo"
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);


                    if (params.tipo === 3) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let estadosDoc = mainData[1];

                        let dataToGroup = {
                            estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision 
                        }
                        let estabs = fS.groupingEstab(dataToGroup);

                        return {
                            estabs,
                            estadosDoc
                        }
                    }
                }
            })
        }

        //se a mas de listar en modulo de proformas en Aprobacion Documento 
        service.getAll = function (query) {

            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 1 })), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload) || [];
                    let proformasRepos = mainData[0];
                    let totalRecords = 0, totalDocument = 0;
                    let data = proformasRepos[0];
                    if (data) {
                        totalRecords = data.totalRecords;
                        totalDocument = data.totalDocument;
                    }
                    let proformas = proformasRepos.map(item => {
                        return {
                            comprobante: 'Proforma',
                            entidad: item.entidad,
                            codEstab: item.codEstab,
                            idProforma: item.idProforma,
                            idDocumento: item.idDocumento,
                            idTipoDocumento: item.idTipoDocumento,
                            idCliente: item.idCliente,
                            nombreComercial: item.nombreComercial,
                            telefonoEstablecimiento: item.telefonoEstablecimiento,
                            correo: item.correo,
                            fechaEmision: item.fechaEmision,
                            total: item.total,
                            nroDocumento: item.nroDocumento, //📛eliminar posteriormente
                            serieComprobante: item.nroDocumento,
                            nombreFiscal: item.nombreFiscal,
                            nroIdentificacion: item.nroIdentificacion,
                            telefono: item.telefono,
                            usuario: item.usuario,
                            estadoDoc: item.estadoDoc,
                            codDoc: item.codDoc,
                            rowColor: item.rowColor,
                            codEstado: item.codEstado,
                            disabledUpdate: item.codEstado === 'TRA' || item.codEstado === 'CR' || item.anulada,
                            isApplied: item.codEstado === "APL",
                            totalRecords: item.totalRecords
                        }
                    })

                    return {
                        proformas,
                        dataTotals: { totalRecords, totalDocument }
                    }
                }
            }).catch(error => {
                throw error;
            })
        }

        service.generateSerieComprobante = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 5 })), null, true).then(response => {
                if (response.code === "0") {
                    throw `Generar Serie comprobante: ${JSON.stringify(response)}`;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let data = mainData[0][0];
                    return data.serieComprobante;
                }
            })
        }



        service.save = function (data) {
            return mS.getData('post', url + 'Insert/', { data }, true)
        }

        service.getId = function (id) {
            return mS.getData('get', url + 'GetId/' + id, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    const mainDataApi = JSON.parse(response.payload);
                    const [
                        comprobanteApi,
                        clienteTempApi,
                        itemsApi,
                        infoAdicionalDocumento,
                    ] = mainDataApi;
                    let comprobanteTemp = comprobanteApi && comprobanteApi[0] || {};
                    let cliente = clienteTempApi && clienteTempApi[0] || {};

                    if (Object.keys(cliente).length > 0) {
                        cliente = {
                            ...cliente,
                            razonSocialComprador: cliente.nombreFiscal,
                            identificacionComprador: cliente.numeroIdentificacion,
                            placas: cliente.placa ? cliente.placa.split(/[\|;]/) : []
                        }
                    }

                    let items = itemsApi.map((itemPrincipal, index) => {

                        const { fraccionado, principal, ...restItem } = itemPrincipal;

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};

                        let precioConIva = pricingUtils.calcularPrecioConIva(itemPrincipal.precioUnitario, itemPrincipal.tarifa);

                        let total = fS.roundNumber(itemPrincipal.precioTotalSinImpuesto, pricingUtils.max_dos) + fS.roundNumber(itemPrincipal.valorImpuesto, pricingUtils.max_dos);

                        let obj = {
                            n: index + 1,
                            idProformaDetalle: restItem.idProformaDetalle,
                            cantidad: restItem.cantidad,
                            cantidadOriginal: restItem.cantidad,
                            codigo: restItem.codigo,
                            codigoPorcentaje: restItem.codigoPorcentaje,//✅
                            descripcion: restItem.descripcion,
                            ice: restItem.ice || 0,
                            idArticulo: restItem.idArticulo,
                            idBodega: restItem.idBodega,
                            idImpuesto: restItem.idImpuesto,
                            idMedida: restItem.idMedida,
                            idTarifa: restItem.idTarifa,
                            idTipoIva: restItem.idTipoIva,
                            llevaInventario: restItem.llevaInventario,
                            nota: restItem.nota,
                            porcentajeDescuento: restItem.porcentajeDescuento,
                            precioSinSubsidio: restItem.precioSinSubsidio || 0,
                            precioCosto: dataMedida.precioCosto,
                            precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                            precioUnitario: restItem.precioUnitario,
                            precioConIva: precioConIva || 0,
                            tarifa: restItem.tarifa,//✅
                            valorDescuento: restItem.valorDescuento,
                            valorImpuesto: restItem.valorImpuesto,//✅
                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha: [],
                            estado: 1,
                            datosAdicionalesArticulo: [],
                            datosAdicionales: restItem.datosAdicionales,
                            precioTotalSinImpuesto: itemPrincipal.precioTotalSinImpuesto,
                            total
                        }

                        return obj;

                    });

                    let comprobante = {
                        ...comprobanteTemp,
                        serieComprobante: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}-${comprobanteTemp.secuencial}`,
                        puntoEmision: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}`,
                        fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                        fechaEmisionDocCreado: fS.formatDate(comprobanteTemp.fechaEmision),
                        irbpnr: comprobanteTemp.irbpnr || 0
                    }

                    return {
                        comprobante,
                        cliente,
                        items,
                        infoAdicionalDocumento: infoAdicionalDocumento || [],
                    }
                }
            })
        }

        service.getIdForInfo = function (id) {
            let spParams = {
                tipo: 4,
                id
            }
            return mS.getData('get', `${url}Get?json=${JSON.stringify(spParams)}`, null, true).then(response => {
                if (response.code === "0") {
                    console.log("Get Data Info", response)
                    throw response;
                }
                if (response.code === "1") {
                    let mainDataApi = JSON.parse(response.payload);
                    let dataTemp = mainDataApi[0][0];
                    let cliente = mainDataApi[1][0];
                    let items = mainDataApi[2];
                    let tarifasImpuesto = mainDataApi[3];

                    let infoAdicionalDocumento = mainDataApi[4];

                    let { nombreComercial, fechaEmision, ...restData } = dataTemp;
                    let data = {
                        ...restData,
                        establecimiento: nombreComercial,
                        fechaEmision: fS.formatDate(fechaEmision),
                        fechaEmisionEscrita: fS.getFechaEscrita(fS.formatDate(fechaEmision)),
                    }

                    let resultsItems = items.map(item => {
                        let precioConIva = pricingUtils.calcularPrecioConIva(item.precioUnitario, item.tarifa);
                        return {
                            ...item,
                            precioConIva
                        }
                    })

                    return {
                        data,
                        cliente,
                        items: resultsItems,
                        tarifasImpuesto,
                        infoAdicionalDocumento: infoAdicionalDocumento || [],
                    }

                }
            })
        }

        service.getDetalleDoc = function (id) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 6, id }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let [itemsApi] = JSON.parse(response.payload);
                    let items = itemsApi.map((itemPrincipal, index) => {

                        const { fraccionado, principal, ...restItem } = itemPrincipal;

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};


                        let precioConIva = pricingUtils.calcularPrecioConIva(itemPrincipal.precioUnitario, itemPrincipal.tarifa);

                        let obj = {
                            n: index + 1,
                            idProformaDetalle: itemPrincipal.idProformaDetalle,
                            cantidad: itemPrincipal.cantidad,
                            cantidadOriginal: itemPrincipal.cantidad,
                            codigo: itemPrincipal.codigo,
                            codigoPorcentaje: itemPrincipal.codigoPorcentaje,//✅
                            descripcion: itemPrincipal.descripcion,
                            ice: itemPrincipal.ice || 0,
                            idArticulo: itemPrincipal.idArticulo,
                            idBodega: itemPrincipal.idBodega,
                            idImpuesto: itemPrincipal.idImpuesto,
                            idMedida: itemPrincipal.idMedida,
                            idTarifa: itemPrincipal.idTarifa,
                            idTipoIva: itemPrincipal.idTipoIva,
                            llevaInventario: itemPrincipal.llevaInventario,
                            nota: itemPrincipal.nota,
                            porcentajeDescuento: itemPrincipal.porcentajeDescuento,
                            precioSinSubsidio: itemPrincipal.precioSinSubsidio || 0,
                            precioCosto: 0,
                            precioUnitario: itemPrincipal.precioUnitario,
                            precioConIva: precioConIva || 0,
                            tarifa: itemPrincipal.tarifa,//✅
                            valorDescuento: itemPrincipal.valorDescuento,
                            valorImpuesto: itemPrincipal.valorImpuesto,//✅
                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha: [],
                            estado: 1,
                            datosAdicionalesArticulo: [],
                            precioTotalSinImpuesto: itemPrincipal.precioTotalSinImpuesto,
                            fechaEmision: fS.formatDate(itemPrincipal.fechaEmision)
                        }

                        return obj;

                    })
                    return {
                        items
                    }
                }
            })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, { data }, true)
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true)
        }




        service.queryMapper = function (obj) {
            let { data, cliente, detalles, itemsDeleted, infoAdicionalDocumento } = obj;
            if (cliente.idCliente === 0 && !cliente.razonSocialComprador && !cliente.identificacionComprador) {
                throw new Error("Datos de cliente no proporcionados")
            }

            let proforma = Object.assign({}, data);

            //Tarifa Aplicada al Documento
            proforma.idCliente = cliente.idCliente;
            proforma.identificacionComprador = cliente.identificacionComprador;
            proforma.razonSocialComprador = cliente.razonSocialComprador;
            proforma.direccionComprador = cliente.direccionComprador;
            proforma.email = cliente.email;
            proforma.telefono = cliente.telefono;
            proforma.fechaEmision = fS.formatDateTimeZone(proforma.fechaEmision);

            const itemsMainMapper = service.detalleMapperTo(detalles)
            const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted || [])
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]

            return {
                proforma: service.infoComprobanteMapperTo(proforma),
                detalles: mergeItems,
                impuestos: impuestos,
                infoAdicional: infoAdicionalDocumento || [],
            }
        }

        service.infoComprobanteMapperTo = function (data) {
            const result = {
                uniqueId: data.uniqueId, //se envia cuando el documento proviebe desde el modulo de aprobacion
                idCliente: data.idCliente,
                idPuntoEmision: data.idPuntoEmision,
                idUsuario: data.idUsuario,
                tarifa: data.tarifa,
                fechaEmision: data.fechaEmision,
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                totalDescuento: data.totalDescuento || 0,
                porcentajeDescuento: data.porcentajeDescuento || 0,
                irbpnr: data.irbpnr || 0,
                propina: data.propina || 0,
                recargo: data.recargo || 0,
                transporte: data.transporte || 0,
                total: data.total,
                observacion: data.observacion,
                placa: data.placa,
                identificacionComprador: data.identificacionComprador,
                razonSocialComprador: data.razonSocialComprador,
                direccionComprador: data.direccionComprador,
                email: data.email,
                telefono: data.telefono,
            }
            return result;
        }

        service.detalleMapperTo = function (detalles) {
            let tempDetails = [];
            let orderIndex = 1;

            for (let item of detalles) {
                tempDetails.push({
                    orderIndex: orderIndex++,
                    idProformaDetalle: item.idProformaDetalle || 0,
                    idArticulo: item.idArticulo,
                    idTarifa: item.idTarifa,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa,
                    codigoPorcentaje: item.codigoPorcentaje,
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioCostoNeto: item.precioCostoNeto,
                    precioUnitario: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    total: item.total,
                    nota: item.nota,
                    valorImpuesto: item.valorImpuesto,
                    estado: item.estado
                })
            }
            return tempDetails;

        }

        //Conversion proforma a FACTURA O NOTA ENTREGA
        service.getDataFormConvert = function () {
            let json = JSON.stringify({
                tipo: 8
            })
            return mS.getData('get', `${url}Get?json=${json}`, null, true).then(response => {
                let result = {
                    tiemposCredito: [],
                    formasPagoSri: [],
                    config: {
                        idFormaPagoSri: 0,
                        multipleVendedor: false,
                    },
                    vendedores: [],
                };
                if (response.code === "1") {
                    let [tiemposCredito, config, formasPagoSri, vendedores] = JSON.parse(response.payload);
                    let dataConfig = config[0];

                    result.tiemposCredito = tiemposCredito;
                    result.formasPagoSri = formasPagoSri;

                    result.config = {
                        idFormaPagoSri: dataConfig.idFormaPagoSri,
                        multipleVendedor: dataConfig.multipleVendedor
                    }
                    result.vendedores = vendedores;
                }

                return result;

            })
        }

        service.convertToDoc = function (data) {
            return mS.getData('post', url + 'ConvertToDoc', { data }, true)
        }

        service.queryMapperConvertToDoc = function (obj) {
            let {
                id,
                codDocDestino,
                codDoc,
                comprobante,
                detalles,
                infoAdicionalDocumento,
                cuotas,
                dataFormaPago
            } = obj;


            const resultDetalles = detalles.map((item, index) => {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                return {
                    orderIndex: index++,
                    uuid: item.uniqueRowDetalle || fS.generateUuidv4(),
                    idArticulo: item.idArticulo,
                    idTarifa: item.idTarifa,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa, //✅
                    codigoPorcentaje: item.codigoPorcentaje, //✅
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    nota: item.nota || undefined,
                    llevaInventario: item.llevaInventario,
                    precioCosto: item.precioCosto,
                    conversion: item.conversion,
                    precioCostoFraccionado: item.precioCostoFraccionado,
                    cantidadTransaccion,
                    estado: item.estado,
                    valorImpuesto: item.valorImpuesto
                }
            })
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            let resultComprobante = {
                idProforma: id,
                idTiempoCredito: comprobante.idTiempoCredito,
                idCliente: comprobante.idCliente,
                idPuntoEmision: comprobante.idPuntoEmision,
                idUsuario: comprobante.idUsuario || 0,
                fechaEmision: fS.formatDateMoment(comprobante.fechaEmision),
                fechaVencimiento: fS.formatDateMoment(comprobante.fechaVencimiento),
                subTotalSinImpuestos: comprobante.subTotalSinImpuestos,
                totalDescuento: comprobante.totalDescuento,
                porcentajeDescuento: comprobante.porcentajeDescuento,
                propina: comprobante.propina || 0,
                recargo: comprobante.recargo || 0,
                transporte: comprobante.transporte || 0,
                total: comprobante.total,
                observacion: comprobante.observacion,
                docDestino: codDocDestino,
                codDoc
            }

            return {
                comprobante: resultComprobante,
                detalles: resultDetalles,
                impuestos: impuestos,
                infoAdicional: infoAdicionalDocumento || [],
                cuotas,
                formaPago: dataFormaPago,
            }
        }

        service.getHistorialConversionDoc = function (id) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 7, id }), null, true).then(response => {
                let results = [];
                if (response.code === "1") {
                    let [historialConversion] = JSON.parse(response.payload)
                    results = historialConversion;
                }
                return results;
            })
        }
        return service;

    }])


    //---------------------------------Cliente------------------------------------------
    app.factory('clienteService', ['$injector', function ($injector) {
        let url = `FactElect/CompanyCustomer/`;
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        let tS = $injector.get('toastService');

        let service = {};

        service.getDataForm = function () {
            return mS.getData('get', url + '?json=' + JSON.stringify({ tipo: 2 }), null, true)
                .then(response => {
                    if (response.code === '0') {
                        console.log('Status code 0: Get Data Form Customer')
                        throw response
                    }
                    if (response.code === '1') {
                        let mainData = JSON.parse(response.payload)


                        return {
                            tipoIdentificacion: mainData[0],
                            tipoContribuyentes: mainData[1],
                            tiempoCreditos: mainData[2] || [],
                            ciudades: mainData[3],
                            tiposCliente: mainData[4] || [],
                            empresas: mainData[5] || [],
                            cargos: mainData[6] || [],
                            formasPagoSri: mainData[7] || [],
                            housingTypes: mainData[8] || [],
                            maritalStatuses: mainData[9] || []
                        }
                    }
                })

        }

        service.getAll = function (query) {
            query.tipo = 1;
            return mS.getData('get', url + '?json=' + JSON.stringify(query), null, true)
                .then(response => {
                    if (response.code == "0") {
                        throw response;
                    }
                    if (response.code == "1") {
                        let clientes = JSON.parse(response.payload)[0] || [];

                        return clientes.map(item => {
                            return {
                                idCliente: item.idCliente,
                                numeroIdentificacion: item.numeroIdentificacion,
                                nombreFiscal: item.nombreFiscal,
                                direccion: item.direccion,
                                telefono: item.telefono,
                                correo: item.correo,
                                estado: item.estado,
                                consumidorFinal: item.consumidorFinal,
                                validationSri: item.validationSri,
                                tipoIdentificacion: item.tipoIdentificacion,
                                esConsumidorFinal: item.codTipoIdentificacion == 'CF',
                                totalRecords: item.totalRecords,
                            }
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    throw error;
                })
        }

        service.mapperTo = function (data) {

            return {
                idCliente: fS.isValidField(data.idCliente),
                idEmpleado: fS.isValidField(data.idEmpleado),
                idTipoIdentificacion: data.idTipoIdentificacion,
                idTipoClienteProveedor: fS.isValidField(data.idTipoClienteProveedor),
                idTipoEntidad: fS.isValidField(data.idTipoEntidad),
                idCiudad: fS.isValidField(data.idCiudad),
                idSubContribuyente: fS.isValidField(data.idSubContribuyente),
                idTiempoCredito: data.idTiempoCredito,
                idEmpresa: fS.isValidField(data.idEmpresa),
                idCargo: fS.isValidField(data.idCargo),
                numeroIdentificacion: data.numeroIdentificacion,
                nombreFiscal: data.nombreFiscal,
                nombreComercial: data.nombreComercial,
                direccion: fS.isValidField(data.direccion),
                telefono: fS.isValidField(data.telefono),
                correo: fS.isValidField(data.correo),
                placa: fS.isValidField(data.placa),
                montoCredito: fS.isValidField(data.montoCredito),
                nota: fS.isValidField(data.nota),
                validationSri: data.validationSri,
                idFormaPagoSri: fS.isValidField(data.idFormaPagoSri),
                estado: data.estado || true,
                infoCrediticia: data.dataInfoCred && JSON.stringify(data.dataInfoCred),
                configValorBruto : data.configValorBruto || null
            }

        }

        service.save = function (data) {
            const params = service.mapperTo(data);
            return mS.getData('post', url, { data: params }, true)
        }

        service.update = function (id, data) {
            const params = service.mapperTo(data);
            return mS.getData('put', url + id, { data: params }, true)
        }

        service.delete = function (id) {
            return mS.getData('delete', url + id, null, true)
        }

        service.findById = function (id) {
            return mS.getData('get', url + 'GetId/' + id, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let { correo, telefono, placa, infoCrediticia, ...data } = JSON.parse(response.payload)[0];

                    const correos = correo ? correo.split(/[\|;]/) : [];
                    const telefonos = telefono ? telefono.split(/[\|;]/) : [];
                    const placas = placa ? placa.split(/[\|;]/) : [];

                    return {
                        idCliente: data.idCliente,
                        idTipoClienteProveedor: data.idTipoClienteProveedor,
                        idTipoEntidad: data.idTipoEntidad,
                        idSubContribuyente: data.idSubContribuyente,
                        idTiempoCredito: data.idTiempoCredito,
                        idTipoIdentificacion: data.idTipoIdentificacion,
                        idCiudad: data.idCiudad,
                        numeroIdentificacion: data.numeroIdentificacion,
                        identificacionComprador: data.numeroIdentificacion,
                        razonSocialComprador: data.nombreFiscal,
                        nombreFiscal: data.nombreFiscal,
                        montoCredito: data.montoCredito,
                        nombreComercial: data.nombreComercial,
                        direccion: data.direccion,
                        telefono: telefono,
                        correo: correo,
                        estado: data.estado,
                        idEmpleado: data.idEmpleado,
                        diasCredito: data.diasCredito,
                        empleado: data.empleado,
                        idEmpresa: data.idEmpresa,
                        idCargo: data.idCargo,
                        placa: placa,
                        validationSri: data.validationSri,
                        correos,
                        telefonos,
                        placas,
                        idFormaPagoSri: data.idFormaPagoSri,
                        dataInfoCred: JSON.parse(infoCrediticia) || {},
                        nota: data.nota,
                        configValorBruto : data.configValorBruto || false
                    }
                }
            })
        }

        /**
         * 
         * @param {object} query  {textSearch}
         * @returns 
         */
        service.search = function (query) {
            if (!query) {
                throw new Error('No se ha proporcionado ningun parámetro')
            }
            if (!('textSearch' in query)) {
                throw new Error(`La propiedad "textSearch" no se ha proporcionado`)
            }

            let text = query.textSearch ? query.textSearch.replace(/^-+|-+$| [^A-Za-z0-9.-]+/g, "") : ''
            let obj = {
                ...query,
                textSearch: text
            }

            return mS.getData('get', url + 'Search?json=' + encodeURIComponent(JSON.stringify(obj)), null, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    let clientes = JSON.parse(response.payload) || [];
                    return clientes.map(item => {
                        return {
                            idCliente: item.idCliente,
                            nombreFiscal: item.nombreFiscal,
                            nombreComercial: item.nombreComercial,
                            numeroIdentificacion: item.numeroIdentificacion,
                            direccion: item.direccion,
                            correo: item.correo,
                            idTiempoCredito: item.idTiempoCredito,
                            diasCredito: item.diasCredito,
                            nombreCompleto: item.nombreCompleto,
                            placa: item.placa,
                            validationSri: item.validationSri,
                            tipoIdentificacion: item.tipoIdentificacion
                        }
                    })
                }
            }).catch(error => {
                throw error;
            })
        }


        service.validateForm = function (data) {

            if (!data.numeroIdentificacion) {
                tS.toastr('warning', 'Ingrese Número de Identificación')
                return;
            }

            // if ($("#numeroIdentificacion").hasClass('is-invalid')) {
            //     tS.toastr('warning', 'Ingrese el número de Identificación válido');
            //     return
            // }

            if (data.codigoIdentificacion === "CF" && data.numeroIdentificacion.length !== 13) {
                tS.toastr('warning', 'Número de Consumidor Final tiene que ser de 13 dígitos');
                return
            }

            if (data.codigoIdentificacion === "C" && data.numeroIdentificacion.length !== 10) {
                tS.toastr('warning', 'Número de Cédula tiene que ser de 10 dígitos');
                return
            }

            if (data.codigoIdentificacion === "R" && data.numeroIdentificacion.length !== 13) {
                tS.toastr('warning', 'Número de RUC tiene que ser de 13 dígitos');
                return
            }

            if (data.codigoIdentificacion === "R" && data.numeroIdentificacion.slice(-3) !== '001') {
                tS.toastr('warning', 'Número de RUC tiene que contener 001');
                return
            }

            // if (form.campo(data.idSubContribuyente)) {
            //     tS.toastr('warning', 'Seleccione el Contribuyente', tituloModal)
            //     return
            // }
            if (!data.nombreFiscal) {
                tS.toastr('warning', 'Ingrese el nombre Fiscal')
                return
            }
            if (!data.nombreComercial) {
                tS.toastr('warning', 'Ingrese el nombre Comercial')
                return
            }

            if (data.correos.length > 0) {
                if (!data.correos.every(item => fS.isEmail(item))) {
                    tS.toastr('warning', 'Verifique que los correos  esten ingresado correctamente');
                    return
                }
            }

            if (!(data.idTiempoCredito > 0)) {
                tS.toastr('warning', 'Seleccione el Tiempo Credito');
                return
            }


            data.direccion = data.direccion ? fS.letterInline(data.direccion) : "";
            data.telefono = data.telefonos.length > 0 ? data.telefonos.join('|') : "";
            data.correo = data.correos.length > 0 ? data.correos.join('|') : "";
            data.placa = data.placas.length > 0 ? data.placas.join('|') : "";


            return true;
        }

        service.checkClientByIdentification = function (query, codigoIdentificacion, callback, id) {
            let params = {
                tipo: 3,
                textSearch: query.textSearch,
                codigoIdentificacion
            }
            mS.getData('get', url + '?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === '0') {
                    callback(codigoIdentificacion)
                    // return response;
                }
                if (response.code === "1") {
                    let [mainData] = JSON.parse(response.payload);
                    let clienteRepository = mainData[0];

                    if(!clienteRepository){
                    callback(codigoIdentificacion)
                    return 
                    }


                    let showConfirmButton = id > 0 && ['C', 'R'].includes(codigoIdentificacion);
                    // return {
                    //     idCliente: clienteRepository.idCliente,
                    //     numeroIdentificacion: clienteRepository.numeroIdentificacion,
                    //     nombreFiscal: clienteRepository.nombreFiscal,
                    //     direccion: clienteRepository.direccion,
                    //     telefono: clienteRepository.telefono,
                    //     correo: clienteRepository.correo,
                    //     estado: clienteRepository.estado,
                    //     consumidorFinal: clienteRepository.consumidorFinal,
                    //     totalRecords: clienteRepository.totalRecords,
                    //     validationSri: clienteRepository.validationSri,
                    //     tipoIdentificacion: clienteRepository.tipoIdentificacion,
                    //     esConsumidorFinal: clienteRepository.tipoIdentificacion=='CF',
                    // }
                    Swal.fire({
                        title: `Cliente Registrado`,
                        html: `
                                <small><strong>Nro. Identificación</strong></small>
                                <br>
                                <p class="text-muted small">${clienteRepository.numeroIdentificacion}</p>
                                <small><strong>Nombre Fiscal</strong></small> <br>
                                <p class="text-muted small">${clienteRepository.nombreFiscal}</p>

                                <small><strong>Nombre Comercial</strong></small> <br>
                                <p class="text-muted small">${clienteRepository.nombreComercial}</p>
                            `,
                        icon: 'info',
                        showCancelButton: true,
                        showConfirmButton,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Actualizar con el SRI!",
                        cancelButtonText: 'Cancelar'
                    }).then(result => {
                        if (result.isConfirmed) {
                            callback(codigoIdentificacion, clienteRepository);
                        }
                    })
                }
            }).catch(error => {
                console.log(error);
                throw error;
            })
        }

        service.checkClientSRIByRUC = function (identificacion) {
            return mS.getData('get', 'FactElect/Consultas/GetRucSRI?Ruc=' + identificacion, null, true)
        }

        service.checkClientSRIByCedula = function (identificacion) {
            return mS.getData('get', 'FactElect/Consultas/GetCedulaSri?Ruc=' + identificacion, null, true)
        }


        service.onKeyupEmail = function (item) {
            let textChip = item.target.value || "";
            textChip = fS.removeAccents(textChip);
            item.target.value = textChip.toLowerCase();
        }

        service.transformChipEmail = function (item) {
            let textChip = item || "";
            textChip = fS.removeAccents(textChip);
            item = textChip.toLowerCase();
        }
        return service;

    }])


    app.factory('empleadoService', ['$injector', function ($injector) {
        let url = `${URL_API}Empleado/`;
        let mS = $injector.get('mainService');
        return {
            getAll,
            getDataForm,
            search,
            deleteEmployee,
            save,
            update
        }

        function getAll(query) {
            let spParams = {
                ...query,
                tipo: 1,
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(spParams), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let employeesApi = JSON.parse(response.payload);
                    return employeesApi.map(item => ({
                        idEmpleado: item.idEmpleado,
                        idTipoIdentificacion: item.idTipoIdentificacion,
                        nroIdentificacion: item.nroIdentificacion,
                        nombreCompleto: item.nombreCompleto,
                        estado: item.estado,
                        totalDatos: item.totalDatos,
                    }))
                }
            })
        }

        function getDataForm() {
            let spParams = {
                tipo: 2,
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(spParams), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    return {
                        tiposIdentificacion: mainData
                    }
                }
            })
        }

        function search(json) {
            return mS.getData('get', url + 'Search?json=' + JSON.stringify(json), null, true)
                .then(response => {
                    if (response.code === '0') {
                        throw response;
                    }
                    if (response.code === '1') {
                        let employeesApi = JSON.parse(response.payload);
                        return employeesApi.map(item => ({
                            idEmpleado: item.idEmpleado,
                            idTipoIdentificacion: item.idTipoIdentificacion,
                            nroIdentificacion: item.nroIdentificacion,
                            nombreCompleto: item.nombreCompleto,
                            estado: item.estado,
                        }))
                    }
                })
        }

        function deleteEmployee(id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        function save(data) {
            return mS.getData('post', url + 'Insert?json=' + JSON.stringify(data), null, true)
        }

        function update(id, data) {
            return mS.getData('put', url + 'Update/' + id + '?json=' + JSON.stringify(data), null, true)
        }

    }])


    app.factory('cargoService', ['$injector', function ($injector) {
        let URL = `${URL_API}Cargo/`;
        let mS = $injector.get('mainService');

        let service = {}

        service.get = (query) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let cargos = JSON.parse(response.payload);
                    return cargos;

                }
            })
        }

        service.post = (data) => {
            return mS.getData('post', URL + '?json=' + JSON.stringify(data), null, true)
        }

        service.put = (id, data) => {
            return mS.getData('put', URL + id + '?json=' + JSON.stringify(data), null, true)
        }

        service.delete = (id) => {
            return mS.getData('delete', URL + '' + id, null, true)
        }

        return service;

    }])


    app.factory('empresaService', ['$injector', function ($injector) {
        let url = `${URL_API}Empresa/`;
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')

        let service = {}

        service.getAll = (obj) => {
            let json = JSON.stringify({
                tipo: 1,
                ...obj
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let results = [];
                if (response.code === "1") {
                    let { empresa } = JSON.parse(response.payload);
                    results = empresa;
                }
                return results;
            })
        }
        service.getDataForm = function () {
            let json = JSON.stringify({
                tipo: 2,
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let results = {
                    tiposIdentificacion: []
                }
                if (response.code === "1") {
                    let { tipoIdentificacion } = JSON.parse(response.payload);
                    results.tiposIdentificacion = tipoIdentificacion;
                }
                return results;
            })
        }

        service.getId = function (id) {
            let json = JSON.stringify({
                tipo: 1,
                id
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let data = {};
                if (response.code === "1") {
                    let { empresa } = JSON.parse(response.payload);
                    data = empresa[0];
                } 
                return data;
            })
        }

        service.mappTo = function (data) {

            let telephone = data.telefonos.length > 0 ? data.telefonos.join('|') : null;
            let email = data.correos.length > 0 ? data.correos.join('|') : null;
            return {
                iDType: data.codigoSri,
                iDCard: data.numeroIdentificacion,
                businessName: data.razonSocial,
                tradeName: data.nombreComercial,
                email,
                telephone,
                address: fS.isValidField(data.direccion),
                sriValidation: data.sriValidation,
                estado: true
            }
        }

        service.post = (obj) => {
            let data = service.mappTo(obj);
            return mS.getData('post', url, { data }, true)
        }

        service.put = (id, obj) => {
            let data = service.mappTo(obj);
            return mS.getData('put', url + id, { data }, true)
        }

        service.delete = (id) => {
            return mS.getData('delete', url + id, null, true)
        }

        return service;

    }])



    app.factory('creditoGaranteService', ['$injector', function ($injector) {
       // let url = `${URL_API}CreditoGarante`;
        const url = 'Contabilidad/CuentaPorCobrar/';
        let mS = $injector.get('mainService');
        return {
            getAll,
            post,
        }

        function getAll(obj) {
            let json = JSON.stringify({
                tipo: 3,
                ...obj
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let result = {
                    guarantors: []
                }
                if (response.code === "1") {
                    let { guarantors } = JSON.parse(response.payload)
                    result.guarantors = guarantors;
                }
                return result;
            })
        }

        function post(data) {
            return mS.getData('post', url, { data }, true)
        }
    }])

})(window.angular)