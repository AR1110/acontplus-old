
(function () {

    'use strict';

    app.factory('aprobacionDocService', function ($injector) {
        let url = 'Venta/AprobacionDocumento/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        const pricingUtils = $injector.get('pricingUtils')
        const userCustomerPermissionSvc = $injector.get('userCustomerPermissionService');


        let service = {}

        service.getDataFilter = function () {
            let spParms = {
                tipo: 3
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(spParms), null, true).then(response => {
                if (response.code == "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    let tempEstabsAndPtosEmision = mainData[0];
                    let estadoDocs = mainData[1];
                    let dataToGroup = {
                        estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision 
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
                    return {
                        estabs,
                        estadoDocs
                    }

                }
            })
        }

        service.getDataForm = function () {
            let spParms = {
                tipo: 2,

            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(spParms), null, true).then(response => {
                if (response.code == "0") {
                    throw response;
                }
                if (response.code === "1") {
                    const mainData = JSON.parse(response.payload); 

                    let decimal = mainData[0][0];
                    let tarifasImpuesto = mainData[1];
                    let tarifas = mainData[2];
                    let tiemposCredito = mainData[3];

                    let tempEstabsAndPtosEmision = mainData[4];
                    let tempBodegas = mainData[5];
                    let vendedores = mainData[6]; 
                    let config = mainData[7][0];
                    let { sales: permisoVenta } = userCustomerPermissionSvc.userPermissionAdapter();

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
                        decimal,
                        vendedores,
                        config
                    }
                }
            })
        }

        service.getAll = function (query) {
            let spParms = structuredClone({
                ...query,
                tipo: 1
            })
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(spParms), null, true)
                .then(response => {

                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let aprobComprobantes = JSON.parse(response.payload)[0];


                        return aprobComprobantes.map(item => {
                            return {
                                idAprob_Document: item.idAprob_Document,
                                uniqueId: item.uniqueId,
                                codEstab: item.codEstab,
                                docOrigen: item.docOrigen,
                                codDoc: item.codDoc,
                                docDestino: item.codDoc,
                                docOrigenDesc: item.docOrigenDesc,
                                docDestinoDesc: item.docDestinoDesc,
                                fechaEmision: item.fechaEmision,
                                serie: item.serie,
                                serieComprobante: item.serie,
                                identificacionComprador: item.identificacionComprador,
                                razonSocialComprador: item.razonSocialComprador,
                                total: item.total,
                                codEstado: item.codEstado,
                                estado: item.estado,
                                colorFila: item.colorFila,
                                userName: item.userName
                            }
                        })

                    }
                })

        }

        service.findById = function (id) {
            return mS.getData('get', url + 'GetId/' + id, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let dataRepository = JSON.parse(response.payload);

                    let compRepository = dataRepository[0][0];
                    let clienteRepository = dataRepository[1][0];
                    let detalleRepository = dataRepository[2];
                    let historialRepository = dataRepository[3];
                    let infoAdicionalDocumento = dataRepository[4];
                    let datosAdicionalesArticulo = dataRepository[5];
                    let formasPago = dataRepository[6];
                    let config = dataRepository[7] ? dataRepository[7][0] : {}

                    let clienteMapper = {
                        idCliente: clienteRepository.idCliente,
                        nombreComercial: clienteRepository.nombreComercial,
                        nombreFiscal: clienteRepository.nombreFiscal,
                        numeroIdentificacion: clienteRepository.numeroIdentificacion,
                        direccion: clienteRepository.direccion,

                        idTipoIdentificacion: clienteRepository.idTipoIdentificacion,
                        codigoSriTipoIdentificacion: clienteRepository.tipoIdentificacion,
                        identificacionComprador: clienteRepository.numeroIdentificacion,
                        razonSocialComprador: clienteRepository.nombreFiscal,

                        idFormaPagoSri: clienteRepository.idFormaPagoSri
                    }

                    let compMapper = {
                        idCliente: clienteMapper.idCliente,
                        idAprob_Document: compRepository.idAprob_Document,
                        uniqueId: compRepository.uniqueId,
                        idTiempoCredito: compRepository.idTiempoCredito,
                        idPuntoEmision: compRepository.idPuntoEmision,
                        estab: compRepository.estab,
                        ptoEmi: compRepository.ptoEmi,
                        serieComprobante: compRepository.serieComprobante,
                        identificacionComprador: compRepository.identificacionComprador,
                        codDoc: compRepository.codDoc,
                        docDestino: compRepository.codDoc,
                        docOrigen: compRepository.docOrigen,
                        observacion: compRepository.observacion,
                        totalDescuento: compRepository.totalDescuento,
                        propina: compRepository.propina,
                        importeTotal: compRepository.importeTotal,
                        total: compRepository.importeTotal,

                        puntoEmision: `${compRepository.estab}-${compRepository.ptoEmi}`,
                        fechaEmision: fS.formatDate(compRepository.fechaEmision),
                        fechaEmisionDocCreado: fS.formatDate(compRepository.fechaEmision),
                        idUsuario: compRepository.idUsuario
                    }
                    

                    let items = detalleRepository.map((itemPrincipal, index) => {

                        const { fraccionado, principal, consolidacion, fechaEmision, ...restItem } = itemPrincipal;

                        let consolidacionesFechaTemp = consolidacion && JSON.parse(consolidacion) || [];
                        let consolidacionesFecha = consolidacionesFechaTemp.map((data) => ({
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }))

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};
 

                        let precioConIva = pricingUtils.calcularPrecioConIva(itemPrincipal.precioUnitario, itemPrincipal.tarifa);

                        let obj = {
                            n: index + 1,
                            idAprob_Document_Detailt: restItem.idAprob_Document_Detailt,
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
                            porcentajeDescuento: restItem.porcentajeDescuento || 0,
                            precioSinSubsidio: restItem.precioSinSubsidio || 0,
                            precioCosto: dataMedida.precioCosto,
                            precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                            precioUnitario: restItem.precioUnitario,
                            precioConIva: precioConIva || 0,
                            tarifa: restItem.tarifa,//✅
                            valorDescuento: restItem.descuento,
                            valorImpuesto: restItem.valorImpuesto,//✅
                            precioTotalSinImpuesto: restItem.precioTotalSinImpuesto,
                            medidas,
                            conversion: dataMedida.conversion,
                            articuloTarifas: dataMedida.tarifas,
                            consolidacionesFecha,
                            estado: 1,
                            datosAdicionalesArticulo: restItem.datosAdicionalesArticulo || [],
                            fechaEmision: fechaEmision && fS.formatDate(fechaEmision) || null,
                            datosAdicionales: restItem.datosAdicionales,
                            nota: restItem.nota || null
                        }

                        return obj;
                    });

                    return {
                        comprobante: compMapper,
                        cliente: clienteMapper,
                        detalles: items,
                        historial: historialRepository,
                        infoAdicionalDocumento: infoAdicionalDocumento,
                        datosAdicionalesArticulo: [],
                        formasPago: fS.mapperFromFormaPago(formasPago),
                        config
                    }
                }
            }).catch(error => {
                throw error
            })
        }




        service.save = function (data) {
            return mS.getData('post', url + 'Insert', { data }, true) 
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, { data }, true) 
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true) 
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
                    let itemsTemp = mainDataApi[2];
                    let historialRepository = mainDataApi[3];
                    let tarifasImpuesto = mainDataApi[4];
                    let { nombreComercial, fechaEmision, ...restData } = dataTemp;
                    let data = {
                        ...restData,
                        establecimiento: nombreComercial,
                        fechaEmision: fS.formatDate(fechaEmision),
                        fechaEmisionEscrita: fS.getFechaEscrita(fS.formatDate(fechaEmision)),
                    }


                    let resultsItems = itemsTemp.map(item => {
                        let precioConIva = pricingUtils.calcularPrecioConIva(item.precioUnitario, item.tarifa);
                        return {
                            ...item,
                            precioConIva
                        }
                    })

                    return {
                        comprobante: data,
                        cliente,
                        items: resultsItems,
                        historial: historialRepository || [],
                        tarifasImpuesto
                    }

                }
            })
        }

        service.queryMapper = function (obj) {

            let { comprobante, detalles, detallesDeleted, selectedDocshistorial, infoAdicionalDocumento, datosAdicionalesArticulo } = obj;


            const itemsMainMapper = service.detalleMapperTo(detalles);
            const itemsDeletedMapper = service.detalleMapperTo(detallesDeleted)
            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]


            return {
                comprobante: service.infoComprobanteMapperTo(comprobante),
                detalles: mergeItems,
                impuestos,
                historial: selectedDocshistorial,
                infoAdicional: infoAdicionalDocumento,
                infoAdicionalArticulo: datosAdicionalesArticulo
            }


        }


        service.infoComprobanteMapperTo = function (data) {
            const result = {
                idCliente: data.idCliente,
                idTiempoCredito: data.idTiempoCredito,
                idPuntoEmision: data.idPuntoEmision,
                fechaEmision: data.fechaEmision,
                codDoc: data.codDoc,
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                totalDescuento: data.totalDescuento,
                total: data.total,
                importeTotal: data.total,
                propina: data.propina,
                docOrigen: data.docOrigen,
                docDestino: data.docDestino,
                observacion: data.observacion,
                idUsuario: data.idUsuario
            }
            return result;
        }

        service.detalleMapperTo = function (detalles) {
            let tempDetail = [];
            let orderIndex = 1;
            for (let item of detalles) {
                let obj = {
                    orderIndex: orderIndex++,
                    idAprob_Document_Detailt: item.idAprob_Document_Detailt || 0,
                    idTarifa: item.idTarifa,
                    idArticulo: item.idArticulo,
                    idTipoIva: item.idTipoIva,
                    idMedida: item.idMedida,
                    cantidad: item.cantidad,
                    descripcion: item.descripcion,
                    precioUnitario: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    descuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                    nota: item.nota,
                    codigoPorcentaje: item.codigoPorcentaje, //✅
                    tarifa: item.tarifa,//✅
                    valorImpuesto: item.valorImpuesto,//✅
                    llevaInventario: item.llevaInventario,
                    idBodega: item.idBodega,
                    fechaEmision: fS.formatDateTimeZone(item.fechaEmision),
                    nota: item.nota
                }
                tempDetail.push(obj);
            }
            return tempDetail;
        }


        service.addRow = function () {
            return {
                rowguid: fS.generateUuidv4(),
                idAprob_Document_Detailt: 0,
                idFacturaDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 1,
                codigoPorcentaje: "",
                tarifa: 0,
                articuloTarifas: [],
                idTarifa: 0,
                precioUnitario: 0,
                precioConIva: 0,
                porcentajeDescuento: 0,
                valorDescuento: 0,
                totalDescuento: 0,
                ice: 0,
                idBodega: 0,
                total: 0,
                nota: null,
                llevaInventario: false,
                datosAdicionales: false,
                estado: 1
            }
        }


        /**
         * Aprobaciones doc. destino
         * @param {*} data 
         * @returns 
         */
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
                dataFormaPago,
                historyDatosAdicionales
            } = obj;

            let resultComprobante = {
                idAprob_Document: id,
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


            const resultDetalles = detalles.map((item, index) => {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                return {
                    orderIndex: index++,
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
                infoAdicionalArticulo: historyDatosAdicionales || [],
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

    })




})(window.angular)