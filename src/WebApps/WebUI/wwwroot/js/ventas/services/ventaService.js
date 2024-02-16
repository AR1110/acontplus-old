/**
 * 1. ventaService
 * 2. notaEntregaService
 * 3. proformaService
 * 4. clienteService
 * 5. empleadoService 
 * 6. cargoService
 */
(function () {

    'use strict';
    const URL_API = 'Venta/'

    app.factory('ventaService', function ($injector) {
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
            // return mS.getData('get', 'Venta/NotaEntrega/' + 'GetId/' + id, null, true)

            // .catch(error=>{
            //     console.log('sale service', error)
            //     throw new Error(error)
            // })
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
                    let pendientAccounts = deuda[0];

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
    })

    /**
     * Nota Entrega 
     */

    app.factory('notaEntregaService', function ($injector) {
        let url = `${URL_API}NotaEntrega/`;
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')
        const pricingUtils = $injector.get('pricingUtils')

        let service = {
            data: {}
        };

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
                    // let articuloDefaultTemp = mainData[6];
                    // let articuloDefault = {}
                    // if(articuloDefaultTemp && articuloDefaultTemp.length>0){
                    //     articuloDefault = articuloDefaultTemp[0];
                    // }
                    let clienteDefaultTemp = mainData[5];
                    let clienteDefault = {};
                    if (clienteDefaultTemp && clienteDefaultTemp.length > 0) {
                        clienteDefault = clienteDefaultTemp[0];
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
                    let { permisoVenta, permisonEditarDoc } = fS.getDataUserRol();

                    let dataToGroup = {
                        estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                        bodegas: tempBodegas, // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
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
                        permisonEditarDoc
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
                            idCliente: item.idCliente,
                            comprobante: 'Nota de Entrega',
                            idDocumento: item.idDocumento,
                            idNotaEntrega: item.idNotaEntrega,
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            codEstab: item.codEstab,
                            telefonoEstablecimiento: item.telefonoEstablecimiento,
                            nombreComercial: item.nombreComercial,
                            fechaEmision: item.fechaEmision,
                            fechaVencimiento: item.fechaVencimiento,
                            total: item.total,
                            serieComprobante: item.nroDocumento,
                            nombreFiscal: item.nombreFiscal,
                            identificacionComprador: item.identificacionComprador,
                            correo: item.correo,
                            telefono: item.telefono,
                            estadoFinanciero: item.estadoFinanciero,
                            codDoc: item.codDoc,
                            abono: item.abono,
                            saldo: item.saldo,
                            style: item.style,
                            usuario: item.usuario,
                            codEstado: item.codEstado,
                            tiempoCredito: item.tiempoCredito,
                            esContado: item.tiempoCredito,
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
            const { data, cliente, detalles, itemsDeleted, historyDatosAdicionales, infoAdicionalDocumento } = params;
            //data que se usara dentro de la función "getCantidadStock"
            service.data = Object.assign({}, data);

            let notaEntrega = Object.assign({}, data);
            notaEntrega.fechaEmision = fS.formatDateTimeZone(data.fechaEmision)
            notaEntrega.fechaVencimiento = fS.formatDateTimeZone(data.fechaVencimiento)


            if (cliente.idCliente === 0 && !cliente.razonSocialComprador && !cliente.identificacionComprador) {
                throw new Error("Datos de cliente no proporcionados")
            }

            notaEntrega.idCliente = cliente.idCliente;
            notaEntrega.identificacionComprador = cliente.identificacionComprador;
            notaEntrega.razonSocialComprador = cliente.razonSocialComprador;
            notaEntrega.direccionComprador = cliente.direccionComprador;
            notaEntrega.email = cliente.email;
            notaEntrega.telefono = cliente.telefono;

            const itemsMainMapper = service.detalleMapperTo(detalles);
            const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted)
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]

            return {
                notaEntrega: service.infoComprobanteMapperTo(notaEntrega),
                detalles: mergeItems,
                impuestos: impuestos,
                infoAdicional: infoAdicionalDocumento || [],
                infoAdicionalArticulo: historyDatosAdicionales
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
                    total: item.total,
                    nota: item.nota,
                    llevaInventario: item.llevaInventario,
                    precioCosto: item.precioCosto,
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

                    const [
                        comprobanteApi,
                        clienteTempApi,
                        itemsApi,
                        infoAdicionalDocumento,
                        datosAdicionalesArticuloTemp
                    ] = mainDataApi;

                    let comprobanteTemp = comprobanteApi && comprobanteApi[0] || {};
                    let cliente = clienteTempApi && clienteTempApi[0] || {};

                    let items = itemsApi.map((itemPrincipal, index) => {

                        const { fraccionado, principal, consolidacion, ...restItem } = itemPrincipal;

                        let consolidacionesFechaTemp = consolidacion && JSON.parse(consolidacion) || [];
                        let consolidacionesFecha = consolidacionesFechaTemp.map((data) => ({
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }))

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};

                        if ('infoDatosAdicionales' in itemPrincipal) {
                            let infoAdicionalArrayTemp = JSON.parse(itemPrincipal.infoDatosAdicionales);
                            restItem.datosAdicionalesArticulo = infoAdicionalArrayTemp.map(dataAdicional => ({
                                idArticulo: dataAdicional.idArticulo,
                                idEtiqueta: dataAdicional.idEtiqueta,
                                idInfoAdicional: dataAdicional.idInfoAdicional,
                                jsonAdicional: JSON.parse(dataAdicional.jsonAdicional),
                                uniqueId: dataAdicional.uniqueId,
                                estado: dataAdicional.estado
                            }))
                        }


                        let precioConIva = pricingUtils.calcularPrecioConIva(itemPrincipal.precioUnitario, itemPrincipal.tarifa);

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
                            precioCosto: itemPrincipal.precioCosto,
                            precioUnitario: itemPrincipal.precioUnitario,
                            precioConIva,
                            tarifa: itemPrincipal.tarifa,//✅
                            valorDescuento: itemPrincipal.valorDescuento,
                            valorImpuesto: itemPrincipal.valorImpuesto,//✅
                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha,
                            estado: 1,
                            datosAdicionalesArticulo: restItem.datosAdicionalesArticulo || [],
                            datosAdicionales: restItem.datosAdicionales
                        }

                        return obj;
                    });

                    let comprobante = {
                        ...comprobanteTemp,
                        serieComprobante: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}-${comprobanteTemp.secuencial}`,
                        puntoEmision: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}`,
                        fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                        fechaVencimiento: fS.formatDate(comprobanteTemp.fechaVencimiento),
                        fechaEmisionDocCreado: fS.formatDate(comprobanteTemp.fechaEmision),
                        irbpnr: comprobanteTemp.irbpnr || 0
                    }

                    let datosAdicionalesArticulo = datosAdicionalesArticuloTemp.map(item => ({
                        idDocumento: item.idDocumento,
                        idHistoryInfoAdicional: item.idHistoryInfoAdicional,
                        idArticulo: item.idArticulo,
                        idEtiqueta: item.idEtiqueta,
                        idInfoAdicional: item.idInfoAdicional,
                        jsonAdicional: item.jsonAdicional && JSON.parse(item.jsonAdicional) || [],
                        selected: item.selected,
                        estado: item.estado
                    }))

                    return {
                        comprobante,
                        cliente,
                        items,
                        infoAdicionalDocumento,
                        datosAdicionalesArticulo
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

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response
                }
            })
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

        return service;

    })

    /**
     * Proforma 
     */
    app.factory('proformaService', function ($injector) {
        let url = `${URL_API}Proforma/`;
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        const pricingUtils = $injector.get('pricingUtils')

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
                    // let articuloDefaultTemp = mainData[6];
                    // let articuloDefault = {}
                    // if(articuloDefaultTemp && articuloDefaultTemp.length>0){
                    //     articuloDefault = articuloDefaultTemp[0];
                    // }
                    let clienteDefaultTemp = mainData[5];
                    let clienteDefault = {};
                    if (clienteDefaultTemp && clienteDefaultTemp.length > 0) {
                        clienteDefault = clienteDefaultTemp[0];
                    }
                    let config = mainData[6][0];
                    let vendedores = mainData[7];
                    let tempEstabsAndPtosEmision = mainData[8];
                    let tempBodegas = mainData[9];
                    let { permisoVenta, permisoEditarDoc } = fS.getDataUserRol();

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
                        permisoEditarDoc
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
                    let { totalRecords, totalDocument } = proformasRepos[0];
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
            return mS.getData('post', url + 'Insert/', { data }, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response;
                }
            })
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
                    ] = mainDataApi;
                    let comprobanteTemp = comprobanteApi && comprobanteApi[0] || {};
                    let cliente = clienteTempApi && clienteTempApi[0] || {};

                    let items = itemsApi.map((itemPrincipal, index) => {

                        const { fraccionado, principal, ...restItem } = itemPrincipal;

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};

                        let precioConIva = pricingUtils.calcularPrecioConIva(itemPrincipal.precioUnitario, itemPrincipal.tarifa);
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
                            precioCosto: 0,
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
                            datosAdicionales: restItem.datosAdicionales
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
                        tarifasImpuesto
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
            return mS.getData('put', url + 'Update/' + id, { data }, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response
                }
            })
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response
                }
            })
        }


        service.queryMapper = function (obj) {
            let { data, cliente, detalles, itemsDeleted } = obj;
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
            const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted)
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]

            return {
                proforma: service.infoComprobanteMapperTo(proforma),
                detalles: mergeItems,
                impuestos: impuestos,
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

        return service;

    })


    //---------------------------------Cliente------------------------------------------
    app.factory('clienteService', function ($injector) {
        let url = `Customer/CompanyCustomer/`;
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
                        let mainDataRepository = JSON.parse(response.payload)
                        return {
                            tipoIdentificacion: mainDataRepository[0],
                            tipoContribuyentes: mainDataRepository[1],
                            tiempoCreditos: mainDataRepository[2] || [],
                            ciudades: mainDataRepository[3],
                            tiposCliente: mainDataRepository[4] || [],
                            empresas: mainDataRepository[5] || [],
                            cargos: mainDataRepository[6] || [],
                        }
                    }
                }).catch(response => {
                    throw response;
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
            return mS.getData('get', url + 'GetId/' + id, null, true)
                .then(response => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let dataRepository = JSON.parse(response.payload)[0];

                        return {
                            idCliente: dataRepository.idCliente,
                            idTipoClienteProveedor: dataRepository.idTipoClienteProveedor,
                            idTipoEntidad: dataRepository.idTipoEntidad,
                            idSubContribuyente: dataRepository.idSubContribuyente,
                            idTiempoCredito: dataRepository.idTiempoCredito,
                            idTipoIdentificacion: dataRepository.idTipoIdentificacion,
                            idCiudad: dataRepository.idCiudad,
                            numeroIdentificacion: dataRepository.numeroIdentificacion,
                            nombreFiscal: dataRepository.nombreFiscal,
                            montoCredito: dataRepository.montoCredito,
                            nombreComercial: dataRepository.nombreComercial,
                            direccion: dataRepository.direccion,
                            telefono: dataRepository.telefono,
                            correo: dataRepository.correo,
                            estado: dataRepository.estado,
                            idEmpleado: dataRepository.idEmpleado,
                            diasCredito: dataRepository.diasCredito,
                            empleado: dataRepository.empleado,
                            idEmpresa: dataRepository.idEmpresa,
                            idCargo: dataRepository.idCargo,
                            placa: dataRepository.placa,
                            validationSri: dataRepository.validationSri,
                            correos: dataRepository.correo ? dataRepository.correo.split('|') : [],
                            telefonos: dataRepository.telefono ? dataRepository.telefono.split('|') : [],
                            placas: dataRepository.placa !== '' ? dataRepository.placa.split('|') : []
                        }
                    }
                })
                .catch(error => {
                    console.log('Error service get customer Find by Id: ' + error)
                    throw error;
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

            if ($("#numeroIdentificacion").hasClass('is-invalid')) {
                tS.toastr('warning', 'Ingrese el número de Identificación válido');
                return
            }

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
            mS.getData('get', url + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    callback(codigoIdentificacion)
                    // return response;
                }
                if (response.code === "1") {

                    let clienteRepository = JSON.parse(response.payload)[0][0];

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
            return mS.getData('get', 'Consultas/GetRucSRI?Ruc=' + identificacion, null, true)
        }

        service.checkClientSRIByCedula = function (identificacion) {
            return mS.getData('get', 'Consultas/GetCedulaSri?Ruc=' + identificacion, null, true)
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

    })


    app.factory('empleadoService', function ($injector) {
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
                .catch(error => {
                    console.log(error)
                    throw error;
                })
        }

        function deleteEmployee(id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        function save(data) {
            return mS.getData('post', url + 'Insert?json=' + JSON.stringify(data), null, true)
                .catch(error => {
                    console.log(error)
                    throw error;
                })
        }

        function update(id, data) {
            return mS.getData('put', url + 'Update/' + id + '?json=' + JSON.stringify(data), null, true)
                .catch(error => {
                    console.log(error)
                    throw error;
                })
        }

    })


    app.factory('cargoService', function ($injector) {
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

    })


    app.factory('empresaService', function ($injector) {
        let URL = `${URL_API}Empresa/`;
        let mS = $injector.get('mainService');

        let service = {}

        service.get = (query) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let empresas = JSON.parse(response.payload);
                    return empresas;

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

    })


})(window.angular)