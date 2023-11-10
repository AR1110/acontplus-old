
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
        let formSvc = $injector.get('formulario');
        let service = {}


        service.getDataForm = () => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 3 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {

                    let mainData = JSON.parse(response.payload);
                    return mainData;
                }
            })
        }

        /**
         * tipo 1: get invoices 
         * tipo 2: get invoices for credit note 
         * tipo 3: ----
         * tipo 4: get estabs, ptos. emisiones para los filtros
         * @returns 
         */
        service.get = (params) => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)

                    if (params.tipo === 4) {
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
                            codigoTipoDoc: 'FV',
                            comprobante: 'Factura',
                            idDocumento: item.idDocumento,
                            idFactura: item.idFactura,
                            idTipoDocumento: item.idTipoDocumento,
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            idTiempoCredito: item.idTiempoCredito,
                            idCliente: item.idCliente,
                            codEstab: item.codEstab,
                            telefonoEstablecimiento: item.telefonoEstablecimiento,
                            entidad: item.razonSocial,
                            nombreComercial: item.nombreComercial,
                            fechaEmision: item.fechaEmision,
                            fechaVencimiento: item.fechaVencimiento,
                            total: item.total,
                            nroFactura: item.nroFactura,
                            serieComprobante: item.nroFactura,
                            telefono: item.telefono,
                            nombreFiscal: item.nombreFiscal,
                            correos: item.correos,
                            identificacionComprador: item.identificacionComprador,
                            estadoFinanciero: item.estadoFinanciero,
                            estadoSri: item.estadoSri,
                            claveAcceso: item.claveAcceso,
                            codDoc: item.codDoc,
                            abono: item.abono,
                            saldo: item.saldo,
                            posfechado: item.posfechado,
                            tiempoCredito: item.tiempoCredito,
                            style: item.style,
                            usuario: item.usuario,
                            nroNotaCredito: item.nroNotaCredito,
                            nroGuiaRemision: item.nroGuiaRemision,
                            nroRetencion: item.nroRetencion,
                            nroIdentificacion: item.nroIdentificacion,
                            anulada: item.anulada,
                            codEstado: item.codEstado,
                            esContado: item.tiempoCredito,
                            totalRecords: item.totalRecords
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
                formSvc.sweetAlert('warning', 'No se ha proporcionado el idCliente')
                throw ''
            }
            if (!('codEstab' in query)) {
                formSvc.sweetAlert('warning', 'No se ha proporcionado el codEstab')
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

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true).then(response => {
                if (response.code === "0") {
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
            })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response;
                }
            })
        }


        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                return response;
            })
        }

        service.queryMapper = function (params) {
            const { data, cliente, detalles, itemsDeleted, infoAdicionalDocumento, historyDatosAdicionales } = params;

            //data que se usara dentro de la función "getCantidadStock"
            service.data = Object.assign({}, data);

            let factura = Object.assign({}, data);

            if (cliente.idCliente === 0 && !cliente.razonSocialComprador && !cliente.identificacionComprador) {
                throw new Error("Datos de cliente no proporcionados")
            }

            factura.idCliente = cliente.idCliente;
            factura.fechaEmision = formSvc.formatDateTimeZone(data.fechaEmision);
            factura.fechaVencimiento = formSvc.formatDateTimeZone(data.fechaVencimiento);
            factura.identificacionComprador = cliente.identificacionComprador;
            factura.razonSocialComprador = cliente.razonSocialComprador;
            factura.direccionComprador = cliente.direccionComprador;
            factura.email = cliente.email;
            factura.telefono = cliente.telefono;
            factura.recargo = data.recargo || 0;
            factura.propina = data.propina || 0;

            const itemsMainMapper = service.detalleMapperTo(detalles);
            const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted)

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]

            return {
                factura: JSON.stringify(factura),
                detalle: JSON.stringify(mergeItems),
                adicional: JSON.stringify(infoAdicionalDocumento || []),
                infoAdicionalArticulo: JSON.stringify(historyDatosAdicionales)
            }
        }

        service.detalleMapperTo = function (detalles) {
            let tempDetails = [];
            let orderIndex = 1;

            for (let item of detalles) {
                // Llamar a la función 'getCantidadStock' para obtener la cantidad en stock del elemento actual
                let {
                    cantidadStock,
                    action
                } = service.getCantidadStock(item);


                if (action === 0) {
                    // Comprobar si el elemento tiene un 'idFacturaDetalle' positivo y está en estado 'activo'
                    if (item.idFacturaDetalle > 0 && item.estado) {
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

                    llevaInventario: item.llevaInventario,//✅
                    precioCosto: item.precioCosto,  //✅
                    cantidadTransaccion: item.cantidad * item.conversion, //✅
                    estado: item.estado //✅
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

            if (fechaEmision) {
                fechaEmisionValidate = fechaEmision;
            } else {
                fechaEmisionValidate = service.data.fechaEmision;
            }
            if (!fechaEmisionValidate) {
                console.warn('Para validacion del cantidad stock la fecha emision del comprobante es nula')
            }

            let dataConsolidacionFecha = rowEntity.consolidacionesFecha.find(
                cdataFecha => cdataFecha.idBodega === rowEntity.idBodega
            )
            if (dataConsolidacionFecha && formSvc.isDateValid(dataConsolidacionFecha.fechaConsolidacion)) {
                if (dataConsolidacionFecha.fechaConsolidacion > fechaEmisionValidate) {
                    cantidadStock = 0;
                    action = 1;
                    return {
                        cantidadStock,
                        action
                    };
                } else {
                    action = 2;
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
                        return tempNotasCredito;
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
                        console.log(mainData)
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

        service.post = function (data) {
            return mS.getData('post', URL, data, true)
        }

        service.put = function (id, data) {
            return mS.getData('put', `${URL}${id}`, data, true)
        }

        service.delete = function (id) {
            return mS.getData('delete', `${URL}${id}`, null, true)
        }


        return service;



    });



})(window.angular);