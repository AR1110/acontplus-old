(function () {

    'use strict';

    app.factory('facturaService', function ($injector) {
        let url = 'Factura/'
        let mainService = $injector.get('mainService');
        let formSvc = $injector.get('formulario');
        let service = {}


        service.getDataForm = () => {
            return mainService.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 3 }), null, true).then(response => {
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
            return mainService.getData('get', url + 'Get?json=' + JSON.stringify(params), null, true).then(response => {
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
            return mainService.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
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
            return mainService.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
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

        service.save = function (data) {
            return mainService.getData('post', url + 'Insert', data, true).then(response => {
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
            return mainService.getData('put', url + 'Update/' + id, data, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response;
                }
            })
        }


        service.delete = function (id) {
            return mainService.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                return response;
            })
        }

        service.queryMapper = function ({ data, cliente, detalles, infoAdicionalDocumento, historyDatosAdicionales }) {

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

            return {
                factura: JSON.stringify(factura),
                detalle: JSON.stringify(service.detalleMapperTo(detalles)),
                adicional: JSON.stringify(infoAdicionalDocumento || []),
                infoAdicionalArticulo: JSON.stringify(historyDatosAdicionales)
            }
        }

        service.detalleMapperTo = function (detalles) {
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
                    idPresentacion: item.idPresentacion || 0,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa,
                    codigoPorcentaje: item.codigoPorcentaje,
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioSinSubsidio: item.precioSinSubsidio,
                    precioCostoNeto: item.precioCostoNeto,
                    precioUnitario: item.precioUnitario,
                    precioVenta: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    total: item.total,
                    nota: item.nota,
                })
            }
            return tempDetails;
        }

        return service;

    })


})(window.angular);