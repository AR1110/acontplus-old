
/**
 * - Documento Electronico
 * - Factura 
 * - Nota Credito
 */
(function () {

    'use strict';
    const URL_API = 'FactElect/'

    app.factory('docElectService', function ($injector) {
        let URL = `${URL_API}DocumentoElectronico/`
        let URL_RETENCION_ATS = 'FactElect/RetencionAts/'
        let mS = $injector.get('mainService');
        let FileSaver = $injector.get('FileSaver');
        let fS = $injector.get('formulario');
        let service = {}


        service.getDataFilter = function () {
            return mS.getData('get', URL + '?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)

                    let tempEstabsAndPtosEmision = mainData[0];
                    let tiposDoc = mainData[1];
                    let estadosDoc = mainData[2];

                    const estabs = fS.groupingEstab({ estabs: tempEstabsAndPtosEmision });
                    return {
                        estabs,
                        tiposDoc,
                        estadosDoc
                    }

                }
            })
        }

        /**
         * tipo 1: get listado general 
         * tipo 2: get estabs, ptos. emisiones para los filtros
         * @returns 
         */
        service.get = (params) => {
            if (!(('tipo') in params)) {
                throw ('Requiere propiedad tipo');

            }
            return mS.getData('get', URL + '?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)
                    if (params.tipo === 1) {
                        return mainData[0];
                    }
                }
            })
        }

        service.getByStatus = (params) => {
            return mS.getData('get', `${URL}GetByStatus/?json=${JSON.stringify(params)}`, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)[0]
                    return mainData;
                }
            })
        }

        service.updateXml = (id) => {
            if (!(id > 0)) {
                throw 'id no valido'
            }
            return mS.getData('put', `${URL}${id}`, null, true)
        }

        service.downloadXml = function (id) {
            return mS.getFile('get', `${URL}GetXmlSri/${id}`, null, true).then(response => {
                let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
                fileName = fileName.replace('"', "")
                let serverData = new Blob([response.data], { type: response.headers()['content-type'] })
                FileSaver.saveAs(serverData, fileName)
            })
        }


        //Retencion ATS 
        service.retencionAtsCancel = (id) => {
            if (!(id > 0)) {
                throw 'id no valido'
            }
            return mS.getData('put', `${URL_RETENCION_ATS}Cancel/${id}`, null, true)
        }


        return service;

    })


    app.factory('facturaService', function ($injector) {
        let url = `${URL_API}Factura/`
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        let service = {
            data: {}
        }


        service.getDataForm = () => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 3 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let decimal = mainData[0][0];
                    let tarifasImpuesto = mainData[1];
                    let tarifas = mainData[2];
                    let tiemposCredito = mainData[3];

                    // Maneja datos opcionales para articuloDefault
                    let articuloDefaultTemp = mainData[4];
                    let articuloDefault = {};
                    if (articuloDefaultTemp && articuloDefaultTemp.length > 0) {
                        articuloDefault = articuloDefaultTemp[0];
                    }

                    // Maneja datos opcionales para clienteDefault 
                    let clienteDefaultTemp = mainData[5];
                    let clienteDefault = {};
                    if (clienteDefaultTemp && clienteDefaultTemp.length > 0) {
                        clienteDefault = clienteDefaultTemp[0];
                    }

                    let config = mainData[6][0];
                    let vendedores = mainData[7];

                    // Establece un valor predeterminado para notificacionVenta y actualiza si hay datos disponibles
                    let notificacionVenta = {
                        notificacionVenta: false
                    };
                    let notificacionVentaTemp = mainData[8];
                    notificacionVenta = notificacionVentaTemp.length === 0 ? notificacionVenta : notificacionVentaTemp[0];

                    // Extrae datos temporales para establecimientos y puntos de emisión
                    let tempEstabsAndPtosEmision = mainData[9];
                    let tempBodegas = mainData[10];

                    // Obtiene el permiso de venta a partir de los datos del rol del usuario
                    let { permisoVenta, permisoEditarDoc } = fS.getDataUserRol();

                    // Transforma datos temporales en un formato estructurado para establecimientos y puntos de emisión
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

                    // Organiza establecimientos y sus almacenes correspondientes
                    let estabs = tempEstabs.map(estab => ({
                        ...estab,
                        bodegas: tempBodegas.filter(bodega => (bodega.idEstablecimiento === estab.idEstablecimiento))
                            .map(bodega => ({
                                idBodega: bodega.idBodega,
                                bodega: bodega.bodega,
                                descripcion: bodega.bodega,
                                defaultBodega: bodega.defaultBodega,
                            }))
                    }));

                    // Devuelve los datos finales estructurados
                    return {
                        estabs,
                        tarifasImpuesto,
                        tiemposCredito,
                        tarifas,
                        permisoVenta,
                        notificacionVenta,
                        decimal,
                        config,
                        vendedores,
                        articuloDefault,
                        clienteDefault,
                        permisoEditarDoc
                    };

                }
            })
        }

        service.getDataFilter = () => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 4 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)
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
            })
        }

        /**
         *Esta funcion declarada se usa en Retencion de Venta, Factura Venta(Listado General) 
         * @param {object} query 
         * @returns 
         */
        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {

                    let mainData = JSON.parse(response.payload);
                    let facturasRepository = mainData[0];
                    let { totalRecords, totalDocument, totalAbono, totalSaldo } = facturasRepository[0];

                    let facturas = facturasRepository.map(item => {
                        return {
                            codigoTipoDoc: 'FV',//📛
                            comprobante: 'Factura',
                            idDocumento: item.idDocumento,
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            codEstab: item.codEstab,
                            telefonoEstablecimiento: item.telefonoEstablecimiento,
                            nombreComercial: item.nombreComercial,
                            fechaEmision: item.fechaEmision,
                            fechaVencimiento: item.fechaVencimiento,
                            total: item.total,
                            nroFactura: item.nroFactura, //📛
                            serieComprobante: item.nroFactura,
                            telefono: item.telefono,
                            nombreFiscal: item.nombreFiscal,
                            correos: item.correos,
                            identificacionComprador: item.identificacionComprador,
                            estadoFinanciero: item.estadoFinanciero,
                            codDoc: item.codDoc,
                            abono: item.abono,
                            saldo: item.saldo,
                            tiempoCredito: item.tiempoCredito,
                            style: item.style,
                            usuario: item.usuario,
                            codEstado: item.codEstado,
                            esContado: item.tiempoCredito,
                            totalRecords: item.totalRecords,
                            esCobrado: item.codEstado === 'CBR',
                            disabledActionUpdate: item.codEstado === 'CBR' || item.codEstado === 'PP' || item.codEstado === 'A',
                            disabledActionAnular: item.codEstado === 'A',
                            enabledActionCobro: item.codEstado === 'PP' || item.codEstado === 'PE',
                            enabledActionCuota: item.codEstado === 'PE',
                            enabledActionHC: ["PP", "CBR"].includes(item.codEstado)
                        }
                    })


                    return {
                        facturas,
                        dataTotals: { totalRecords, totalDocument, totalAbono, totalSaldo }
                    }

                }
            })
        }

        service.getForCreditNote = function (query) {
            if (!('byCliente' in query)) {
                fS.sweetAlert('warning', 'No se ha proporcionado el idCliente')
                throw ''
            }
            if (!('codEstab' in query)) {
                fDs.sweetAlert('warning', 'No se ha proporcionado el codEstab')
                throw ''
            }
            query.tipo = 2;
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload) || [];
                    let facturasRepository = mainData[0];
                    let facturas = facturasRepository.map(item => {
                        return {
                            idDocumento: item.idFactura,
                            serieComprobante: item.serieComprobante,
                        }
                    })
                    return {
                        facturas,
                    }

                }
            })
        }

        service.getIdForInfo = function (id) {
            let spParams = {
                tipo: 8,
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
                    let infoAdicionalDocumento = mainDataApi[3];
                    let tarifasImpuesto = mainDataApi[4];
                    let { nombreComercial, fechaEmision, fechaVencimiento, ...restData } = dataTemp;
                    let data = {
                        ...restData,
                        establecimiento: nombreComercial,
                        fechaEmision: fS.formatDate(fechaEmision),
                        fechaVencimiento: fS.formatDate(fechaVencimiento),
                        fechaEmisionEscrita: fS.getFechaEscrita(fS.formatDate(fechaEmision)),
                        fechaVencimientoEscrita: fS.getFechaEscrita(fS.formatDate(fechaVencimiento))
                    }
                    return {
                        data,
                        cliente,
                        items,
                        infoAdicionalDocumento: infoAdicionalDocumento || [],
                        tarifasImpuesto
                    }

                }
            })
        }

        service.generateSerieComprobante = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 7 })), null, true).then(response => {
                if (response.code === "0") {
                    console.warn(response)
                    throw null;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let data = mainData[0][0];
                    return data.serieComprobante;
                }
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

                        let obj = {
                            n: index + 1,
                            idFacturaDetalle: restItem.idFacturaDetalle,
                            cantidad: restItem.cantidad,
                            cantidadOriginal: restItem.cantidad,
                            codigo: restItem.codigo,
                            codigoPorcentaje: restItem.codigoPorcentaje, //✅
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
                            precioCosto: restItem.precioCosto,
                            precioUnitario: restItem.precioUnitario,
                            tarifa: restItem.tarifa,//✅
                            valorDescuento: restItem.valorDescuento,
                            valorImpuesto: restItem.valorImpuesto,//✅
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

        service.getDetalleDoc = function (id) {
            let spParams = {
                tipo: 9,
                id
            }
            return mS.getData('get', `${url}Get?json=${JSON.stringify(spParams)}`, null, true).then(response => {
                if (response.code === "0") {
                    console.log("Get Data Info", response)
                    throw response;
                }
                if (response.code === "1") {
                    let [itemsApi] = JSON.parse(response.payload);

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

                        let precioConIva = itemPrincipal.precioUnitario + itemPrincipal.valorImpuesto;
                        let precioTotalSinImpuesto = ((itemPrincipal.precioUnitario * itemPrincipal.cantidad)) - itemPrincipal.valorDescuento;
                        let total = precioTotalSinImpuesto + itemPrincipal.valorImpuesto;

                        let obj = {
                            n: index + 1,
                            idFacturaDetalle: itemPrincipal.idFacturaDetalle,
                            cantidad: itemPrincipal.cantidad,
                            cantidadOriginal: itemPrincipal.cantidad,
                            codigo: itemPrincipal.codigo,
                            codigoPorcentaje: itemPrincipal.codigoPorcentaje, //✅
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
                            tarifa: itemPrincipal.tarifa,//✅
                            valorDescuento: itemPrincipal.valorDescuento,
                            valorImpuesto: itemPrincipal.valorImpuesto,//✅
                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha,
                            estado: 1,
                            datosAdicionalesArticulo: restItem.datosAdicionalesArticulo || [],
                            precioConIva: fS.roundNumber(precioConIva, 3),
                            precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, 3),
                            total: fS.roundNumber(total, 3)
                        }

                        return obj;
                    });
                    return {
                        items
                    }
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', { data }, true).then(response => {
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
                service.data = {}
                throw error
            })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, { data }, true).then(response => {
                if (response.code === "0") {
                    service.data = {}
                    return response;
                }
                if (response.code === "1") {
                    return response;
                }
            }).catch(error => {
                service.data = {}
                throw error;
            })
        }


        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                return response;
            })
        }

        service.queryMapper = function (params) {
            const {
                data,
                cliente,
                detalles,
                itemsDeleted,
                infoAdicionalDocumento,
                historyDatosAdicionales,
                fromAprobacion = false
            } = params;

            //data que se usara dentro de la función "getCantidadStock"
            service.data = Object.assign({}, data);

            let factura = Object.assign({}, data);

            if (cliente.idCliente === 0 && !cliente.razonSocialComprador && !cliente.identificacionComprador) {
                throw new Error("Datos de cliente no proporcionados")
            }

            factura.idCliente = cliente.idCliente;
            factura.fechaEmision = fS.formatDateTimeZone(data.fechaEmision);
            factura.fechaVencimiento = fS.formatDateTimeZone(data.fechaVencimiento);
            factura.identificacionComprador = cliente.identificacionComprador;
            factura.razonSocialComprador = cliente.razonSocialComprador;
            factura.direccionComprador = cliente.direccionComprador;
            factura.email = cliente.email;
            factura.telefono = cliente.telefono;
            factura.recargo = data.recargo || 0;
            factura.propina = data.propina || 0;

            const itemsMainMapper = service.detalleMapperTo(detalles, fromAprobacion);
            const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted, fromAprobacion)
            const impuestos = fS.impuestoTarifaMapperTo(detalles);
            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]

            return {
                infoFactura: service.infoComprobanteMapperTo(factura),
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
         * Detalle Mapper Factura
         * @param {*} detalles 
         * @param {*} fromAprobacion si es verdadero el origen del detalle es desde aprobacion del documento 
         * @returns 
         */
        service.detalleMapperTo = function (detalles, fromAprobacion = false) {
            let tempDetails = [];
            let orderIndex = 1;

            for (let item of detalles) {

                tempDetails.push({
                    orderIndex: orderIndex++,
                    idFacturaDetalle: item.idFacturaDetalle || 0,
                    idArticulo: item.idArticulo,
                    idTarifa: item.idTarifa,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa, //✅
                    codigoPorcentaje: item.codigoPorcentaje,//✅
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioSinSubsidio: item.precioSinSubsidio || 0,
                    precioCostoNeto: item.precioCostoNeto,
                    precioUnitario: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    total: item.total,
                    nota: item.nota,
                    cantidadStock: 0,
                    llevaInventario: item.llevaInventario,
                    precioCosto: item.precioCosto,
                    cantidadTransaccion: fromAprobacion ? item.cantidadTransaccion : item.cantidad * item.conversion,
                    estado: item.estado,
                    valorImpuesto: item.valorImpuesto //✅
                })
            }
            return tempDetails;
        }


        return service;

    })



    function groupEstab(estabsAndPuntosEmision) {
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
        const fS = $injector.get('formulario');
        const URL = 'FactElect/NotaCredito/'
        const service = {};

        /**
         * tipo 1: get credit notes
         * tipo 5: get data for formulario   
         * @returns 
         */

        service.getDataForm = () => {
            return mS.getData('get', URL + '?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let tempEstabsAndPtosEmision = mainData[0];
                    let tempBodegas = mainData[1];
                    let decimal = mainData[2][0];
                    let tarifasImpuesto = mainData[3];
                    let tarifas = mainData[4];
                    let config = mainData[5][0];
                    let vendedores = mainData[6];

                    let dataToGroup = {
                        estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                        bodegas: tempBodegas, // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
                    // Obtiene el permiso de venta a partir de los datos del rol del usuario
                    let { permisoVenta } = fS.getDataUserRol();

                    return {
                        estabs,
                        decimal,
                        tarifasImpuesto,
                        tarifas,
                        config,
                        vendedores,
                        permisoVenta
                    }

                }
            })
        }

        service.get = (params) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    if (params.tipo === 1) {
                        let tempNotasCredito = mainData[0];
                        const notasCredito = tempNotasCredito.map((item) => ({
                            ...item,
                            idDocumento: item.idNotaCredito,
                            serieComprobante: item.nroDocumento,
                            codEstado: item.codDoc,
                            codDoc: '04'
                        }))
                        return notasCredito;
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
                }
            })
        }

        service.getAll = function (params) {
            return mS.getData('get', URL + '?json=' + JSON.stringify({ ...params, tipo: 1 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let tempNotasCredito = mainData[0];
                    const notasCredito = tempNotasCredito.map((item) => ({
                        ...item,
                        idDocumento: item.idNotaCredito,
                        serieComprobante: item.nroDocumento,
                        codEstado: item.codDoc,
                        codDoc: '04'
                    }))
                    return notasCredito;
                }
            })
        }

        service.post = function (data) {
            return mS.getData('post', URL, { data }, true)
        }

        service.put = function (id, data) {
            return mS.getData('put', `${URL}${id}`, { data }, true)
        }

        service.delete = function (id) {
            return mS.getData('delete', `${URL}${id}`, null, true)
        }

        service.generateSerieComprobante = function (query) {
            return mS.getData('get', URL + '?json=' + JSON.stringify(Object.assign(query, { tipo: 6 })), null, true).then(response => {
                if (response.code === "0") {
                    console.warn(response)
                    throw null;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let data = mainData[0][0];
                    return data.serieComprobante;
                }
            })
        }

        service.getIdForInfo = function (id) {
            return mS.getData('get', URL + '?json=' + JSON.stringify({ tipo: 5, id }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    const [mainData, mainDataFactura, mainDataCliente, mainDetalle, mainInfoAdicional] = JSON.parse(response.payload)

                    let { fechaEmision, ...restData } = mainData[0];
                    let comprobante = {
                        ...restData,
                        fechaEmision: fS.formatDate(fechaEmision),
                        fechaEmisionEscrita: fS.getFechaEscrita(fS.formatDate(fechaEmision)),
                    }

                    return {
                        data: comprobante,
                        factura: mainDataFactura.length > 0 ? mainDataFactura[0] : {},
                        cliente: mainDataCliente[0],
                        items: mainDetalle,
                        infoAdicionalDocumento: mainInfoAdicional
                    }

                }
            })
        }

        service.getId = function (id) {
            return mS.getData('get', URL + '?json=' + JSON.stringify({ tipo: 4, id }), null, true).then(response => {
                if (response.code === "0") {
                    console.log(response)
                }
                if (response.code === "1") {
                    let mainDataApi = JSON.parse(response.payload);
                    const [
                        comprobanteApi,
                        facturaApi,
                        clienteTempApi,
                        itemsApi,
                        infoAdicionalDocumento,
                    ] = mainDataApi;


                    let comprobanteTemp = comprobanteApi && comprobanteApi[0] || {};

                    let factura = facturaApi.reduce((acc, previous) => {

                        acc.idDocumento = previous.idFactura;
                        acc.serieComprobante = previous.nroFactura;
                        return acc;
                    }, { idDocumento: '', serieComprobante: '' });

                    let cliente = clienteTempApi && clienteTempApi[0] || {};

                    let detalleDocumento = itemsApi.map((itemPrincipal, index) => {

                        const { fraccionado, principal, consolidacion, ...restItem } = itemPrincipal;

                        let consolidacionesFechaTemp = consolidacion && JSON.parse(consolidacion) || [];
                        let consolidacionesFecha = consolidacionesFechaTemp.map((data) => ({
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }))

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};


                        let obj = {
                            n: index + 1,
                            idNotaCreditoDetalle: itemPrincipal.idNotaCreditoDetalle,
                            cantidad: itemPrincipal.cantidad,
                            cantidadOriginal: itemPrincipal.cantidad,
                            codigo: itemPrincipal.codigo,
                            codigoPorcentaje: itemPrincipal.codigoPorcentaje,//✅
                            descripcion: itemPrincipal.descripcion,
                            ice: itemPrincipal.ice,
                            idArticulo: itemPrincipal.idArticulo,
                            idBodega: itemPrincipal.idBodega,
                            idImpuesto: itemPrincipal.idImpuesto,
                            idMedida: itemPrincipal.idMedida,
                            idTarifa: itemPrincipal.idTarifa,
                            idTipoIva: itemPrincipal.idTipoIva,
                            llevaInventario: itemPrincipal.llevaInventario,
                            nota: itemPrincipal.nota,
                            porcentajeDescuento: itemPrincipal.porcentajeDescuento,
                            precioConIva: itemPrincipal.precioConIva,
                            precioCosto: itemPrincipal.precioCosto,
                            precioUnitario: itemPrincipal.precioUnitario,
                            tarifa: itemPrincipal.tarifa,//✅
                            valorDescuento: itemPrincipal.valorDescuento,
                            valorImpuesto: itemPrincipal.valorImpuesto,//✅
                            precioTotalSinImpuesto: itemPrincipal.precioTotalSinImpuesto,
                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha,
                            estado: 1,
                            datosAdicionales: restItem.datosAdicionales
                        }

                        return obj;
                    });

                    let infoComprobante = {
                        ...comprobanteTemp,
                        serieComprobante: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}-${comprobanteTemp.secuencial}`,
                        puntoEmision: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}`,
                        fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                        fechaEmisionDocCreado: fS.formatDate(comprobanteTemp.fechaEmision),
                        irbpnr: comprobanteTemp.irbpnr || 0
                    }

                    return {
                        infoComprobante,
                        factura,
                        cliente,
                        detalleDocumento,
                        infoAdicionalDocumento,
                    }
                }
            })
        }


        service.paramsMapperToApi = function (params) {
            const { infoComprbante, detalles, detallesDeleted, infoAdicional } = params;

            let resultInfoComprobante = service.infoComprobanteMapperTo(infoComprbante);
            const resultDetalles = service.detalleMapperTo(detalles);
            const resultDetallesDeleted = service.detalleMapperTo(detallesDeleted);
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeDetalles = [
                ...resultDetalles,
                ...resultDetallesDeleted
            ]
            return {
                infoNotaCredito: resultInfoComprobante,
                detalles: mergeDetalles,
                impuestos: impuestos,
                infoAdicional: infoAdicional || []
            }

        }




        service.infoComprobanteMapperTo = function (data) {
            let comprobante = {
                idCliente: data.idCliente,
                idPuntoEmision: data.idPuntoEmision,
                idUsuario: data.idUsuario,
                idFactura: data.idFactura,
                fechaEmision: data.fechaEmision,
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                totalDescuento: data.totalDescuento,
                porcentajeDescuento: data.porcentajeDescuento,
                irbpnr: data.irbpnr || 0,
                propina: data.propina || 0,
                recargo: data.recargo || 0,
                transporte: data.transporte || 0,
                total: data.total,
                observacion: data.observacion
            };
            return comprobante;
        }


        service.detalleMapperTo = function (detalles) {
            let resultMap = detalles.map((orderItem, index) => {
                let cantidadTransaccion = orderItem.cantidad * orderItem.conversion;
                let obj = {
                    idNotaCreditoDetalle: orderItem.idNotaCreditoDetalle || 0,
                    orderIndex: index,
                    idArticulo: orderItem.idArticulo,
                    idTarifa: orderItem.idTarifa,
                    idBodega: orderItem.idBodega,
                    idMedida: orderItem.idMedida,
                    ice: orderItem.ice,
                    cantidad: orderItem.cantidad,
                    precioUnitario: orderItem.precioUnitario,
                    codigoPorcentaje: orderItem.codigoPorcentaje,
                    tarifa: orderItem.tarifa,
                    precioConIva: orderItem.precioConIva,
                    valorDescuento: orderItem.valorDescuento,
                    precioTotalSinImpuesto: orderItem.precioTotalSinImpuesto,
                    porcentajeDescuento: orderItem.porcentajeDescuento,
                    total: orderItem.total,
                    nota: orderItem.nota,
                    descripcion: orderItem.descripcion,
                    idTipoIva: orderItem.idTipoIva,
                    llevaInventario: orderItem.llevaInventario,
                    cantidadTransaccion: cantidadTransaccion,
                    precioCosto: orderItem.precioCosto,
                    valorImpuesto: orderItem.valorImpuesto,
                    estado: orderItem.estado
                };
                return obj;
            })
            return resultMap;
        }

        return service;



    });



})(window.angular);