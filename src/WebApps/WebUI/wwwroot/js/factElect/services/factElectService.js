
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
        let service = {}

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

                    if (params.tipo === 2) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let tiposDoc = mainData[1];
                        let estadosDoc = mainData[2];

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
                            tiposDoc,
                            estadosDoc
                        }
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

                    // Extrae la tarifa actual para el impuesto
                    let tarifaImpuestoVigente = mainData[11][0];

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
                        tarifaImpuestoVigente,
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
            query.paraNotaCredito = true;
            query.checkBoxCliente = true;
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload) || [];
                    let facturasRepository = mainData[0];
                    let facturas = facturasRepository.map(item => {
                        return {
                            idDocumento: item.idDocumento,
                            nroFactura: item.nroFactura,
                            serieComprobante: item.nroFactura,
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
                        infoAdicionalDocumento: []
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

                    let items = itemsApi.map(itemPrincipal => {

                        const { fraccionado, principal, consolidacion, ...restItem } = itemPrincipal;

                        // Medidas del artículo fraccionado del principal
                        let medidasFraccionadoTemp = JSON.parse(fraccionado) || [];

                        // Medida principal con las tarifas
                        let medidasPrincipalTemp = JSON.parse(principal) || [];

                        // 
                        let consolidacionesFecha = JSON.parse(consolidacion) || [];

                        const medidasPrincipal = medidasPrincipalTemp.map(medidaPrincipal => ({
                            ...medidaPrincipal,
                            tipo: 'PRINCIPAL'
                        }))
                        const medidasFraccionado = medidasFraccionadoTemp.map(medidaFraccionado => ({
                            ...medidaFraccionado,
                            tipo: 'FRACCIONADO'
                        }))

                        /**
                         * Combinar los dos arrays de medidas en uno solo
                         *
                         * Parámetros:
                         *  - mergedMedidasArray: El array resultante de la combinación de los dos arrays de medidas
                         */
                        // Combinar los dos arrays de medidas en uno solo

                        const mergedMedidasArray = [...medidasFraccionado, ...medidasPrincipal];

                        /**
                         * Ordenar el array de medidas en función de la propiedad "orden" y
                         * establecer la propiedad "defaultMedida" en falso para todos los elementos
                         *
                         * Parámetros:
                         *  - orderMedidaArray: El array de medidas ordenado
                         */
                        let orderMedidaArray = mergedMedidasArray.sort((a, b) => a.orden - b.orden).map(medida => ({
                            ...medida,
                            defaultMedida: false
                        }));

                        // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
                        orderMedidaArray[0].defaultMedida = true;


                        /**
                         * Obtener los datos de la medida
                         *
                         * Parámetros:
                         *  - orderMedidaArray: El array de medidas ordenado
                         *  - restItem: El artículo
                         *
                         * Devuelve:
                         *  - Los datos de la medida, o un objeto vacío si la medida no se encuentra
                         */
                        let dataMedida = orderMedidaArray.find(m => m.idMedida === restItem.idMedida) || {};

                        // Crear un nuevo array de medidas con un formato específico
                        let medidas = orderMedidaArray.map(item => ({
                            idMedida: item.idMedida,
                            conversion: item.conversion,
                            descripcion: item.descripcion,
                            defaultMedida: item.defaultMedida,
                            tipo: item.tipo,
                            tarifas: item.tarifas
                        }))

                        // Asignar los datos de la medida al artículo
                        restItem.medidas = medidas;
                        restItem.conversion = dataMedida.conversion;
                        // Asignar los datos de las tarifas obtenidos de data medida 
                        restItem.articuloTarifas = dataMedida.tarifas || [];

                        restItem.consolidacionesFecha = consolidacionesFecha.map((data) => ({
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }))


                        let subTotal = restItem.cantidad * restItem.precioUnitario || 0;
                        let totalDescuento = restItem.cantidad * restItem.valorDescuento || 0;

                        restItem.subTotal = subTotal || 0;
                        restItem.totalDescuento = totalDescuento || 0;
                        //Para validacion del cantidad stock
                        restItem.cantidadOriginal = restItem.cantidad;

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

                        return restItem;
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
                idCliente: data.idCliente,
                idTiempoCredito: data.idTiempoCredito,
                idPuntoEmision: data.idPuntoEmision,
                idUsuario: data.idUsuario,
                tarifa: data.tarifa,
                fechaEmision: data.fechaEmision,
                fechaVencimiento: data.fechaVencimiento,
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                totalDescuento: data.totalDescuento,
                porcentajeDescuento: data.porcentajeDescuento,
                irbpnr: data.irbpnr,
                propina: data.propina,
                iva: data.iva,
                recargo: data.recargo,
                transporte: data.transporte,
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
         * 
         * @param {*} detalles 
         * @param {*} fromAprobacion si es verdadero el origen del detalle es desde aprobacion del documento 
         * @returns 
         */
        service.detalleMapperTo = function (detalles, fromAprobacion = false) {
            let tempDetails = [];
            let orderIndex = 1;

            for (let item of detalles) {

                // Llamar a la función 'getCantidadStock' para obtener la cantidad en stock del elemento actual
                let cantidadStock = 0, action = 0, cantidadTransaccion = 0;

                if (!fromAprobacion) {
                    let dataValidationStock = service.getCantidadStock(item);

                    cantidadStock = dataValidationStock.cantidadStock;
                    action = dataValidationStock.action;

                    cantidadTransaccion = item.cantidad * item.conversion;

                    if (action === 0) {
                        // Comprobar si el elemento tiene un 'idFacturaDetalle' positivo y está en estado 'activo'
                        if (item.idFacturaDetalle > 0 && item.estado) {
                            //cantidadAnulada = cantidadTransaccion;
                            // Verificar si 'cantidad' es igual a 'cantidadOriginal'
                            if (item.cantidad === item.cantidadOriginal) {
                                cantidadStock = 0;  // Si son iguales, establecer 'cantidadStock' en 0

                            } else {
                                // Calcular 'cantidadStock' en función de la diferencia entre 'cantidadOriginal' y 'cantidad'
                                if (item.cantidad > item.cantidadOriginal) {
                                    cantidadStock = item.cantidadOriginal - item.cantidad;
                                } else {
                                    cantidadStock = item.cantidadOriginal - item.cantidad;
                                }
                            }
                        }
                        if (item.idFacturaDetalle > 0 && item.estado === 0) {
                            cantidadStock = Math.abs(cantidadStock)
                            //  cantidadAnulada = item.cantidad;
                        }
                    }
                }

                tempDetails.push({
                    orderIndex: orderIndex++,
                    idFacturaDetalle: item.idFacturaDetalle || 0,
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
                    precioSinSubsidio: item.precioSinSubsidio || 0,
                    precioCostoNeto: item.precioCostoNeto,
                    precioUnitario: item.precioUnitario,
                    precioVenta: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    total: item.total,
                    nota: item.nota,

                    cantidadStock: fromAprobacion ? item.cantidadStock : cantidadStock, //✅
                    llevaInventario: item.llevaInventario,//✅
                    precioCosto: item.precioCosto,  //✅
                    cantidadTransaccion: fromAprobacion ? item.cantidadTransaccion : cantidadTransaccion, //✅
                    // cantidadAnulada,
                    estado: item.estado, //✅                      
                    valorImpuesto: fS.getTaxBaseAndTaxValue(item).taxValue
                })
            }
            return tempDetails;
        }

        /**
        * 
        * @param {*} rowEntity 
        * @param {*} fechaEmision unicamente se envia desde el controlador de FacturaCtrl
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

            if (typeof service.data === 'object' && service.data.idFactura > 0) {
                fechaEmisionDocCreado = service.data.fechaEmisionDocCreado;
            }

            if (!fechaEmisionValidate) {
                console.warn('Para validacion del cantidad stock la fecha emision del comprobante es nula')
            }

            let dataConsolidacionFecha = rowEntity.consolidacionesFecha.find(
                cdataFecha => cdataFecha.idBodega === rowEntity.idBodega
            )

            if (dataConsolidacionFecha && fS.isDateValid(dataConsolidacionFecha.fechaConsolidacion)) {
                if (rowEntity.idFacturaDetalle > 0 && rowEntity.estado && fechaEmisionDocCreado.getTime() !== fechaEmisionValidate.getTime()) {

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

                    if (params.tipo === 2) {
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
                            codigoPorcentaje: itemPrincipal.codigoPorcentaje,
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
                            tarifa: itemPrincipal.tarifa,
                            total: itemPrincipal.total,
                            valorDescuento: itemPrincipal.valorDescuento,
                            valorImpuesto: itemPrincipal.valorImpuesto,

                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha,
                            subTotal: restItem.cantidad * restItem.precioUnitario || 0,
                            totalDescuento: restItem.cantidad * restItem.valorDescuento || 0,
                            estado: 1
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
                irbpnr: data.irbpnr,
                propina: data.propina,
                iva: data.iva,
                recargo: data.recargo,
                transporte: data.transporte,
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
                    precioConIva: orderItem.precioConIva,
                    valorDescuento: orderItem.valorDescuento,
                    porcentajeDescuento: orderItem.porcentajeDescuento,
                    total: orderItem.total,
                    nota: orderItem.nota,
                    descripcion: orderItem.descripcion,
                    idTipoIva: orderItem.idTipoIva,
                    llevaInventario: orderItem.llevaInventario,
                    cantidadTransaccion: cantidadTransaccion,
                    precioCosto: orderItem.precioCosto,
                    valorImpuesto: fS.getTaxBaseAndTaxValue(orderItem).taxValue,
                    estado: orderItem.estado
                };
                return obj;
            })
            return resultMap;
        }

        return service;



    });



})(window.angular);