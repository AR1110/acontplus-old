(function () {
    'use strict';

    app.factory('notaEntregaService', function ($injector) {
        let url = 'Venta/NotaEntrega/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')

        let service = {};

        service.getDataForm = () => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
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
                if (response.code === "0") {
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
                            idNotaEntrega: item.idNotaEntrega,
                            idTipoDocumento: item.idTipoDocumento,
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            idTiempoCredito: item.idTiempoCredito,
                            idCliente: item.idCliente,
                            codEstab: item.codEstab,
                            telefonoEstablecimiento: item.telefonoEstablecimiento,
                            entidad: item.entidad,
                            nombreComercial: item.nombreComercial,
                            fechaEmision: item.fechaEmision,
                            fechaVencimiento: item.fechaVencimiento,
                            total: item.total,
                            nroDocumento: item.nroDocumento, //eliminar mas adelante
                            serieComprobante: item.nroDocumento,
                            nombreFiscal: item.nombreFiscal,
                            identificacionComprador: item.identificacionComprador,
                            correo: item.correo,
                            telefono: item.telefono,
                            estadoFinanciero: item.estadoFinanciero,
                            codDoc: item.codDoc,
                            abono: item.abono,
                            saldo: item.saldo,
                            posfechado: item.posfechado,
                            style: item.style,
                            usuario: item.usuario,
                            codEstado: item.codEstado,
                            tiempoCredito: item.tiempoCredito,
                            esContado: item.tiempoCredito,
                            nroIdentificacion: item.nroIdentificacion
                        }
                    })


                    return {
                        notaEntregas,
                        dataTotals: { totalRecords, totalDocument, totalAbono, totalSaldo }
                    }
                }
            })
        } 
        service.queryMapper = function ({ data, cliente, detalles, historyDatosAdicionales }) {

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


            return {
                notaEntrega,
                detalle: service.detalleMapperTo(detalles),
                infoAdicionalArticulo: JSON.stringify(historyDatosAdicionales)
            }

        }

        service.detalleMapperTo = function (detalles) {
            let tempDetails = [];
            let orderIndex = 1;

            for (let item of detalles) {
                tempDetails.push({
                    orderIndex: orderIndex++,
                    idNotaEntregaDetalle: item.idNotaEntregaDetalle || 0,
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

        service.save = function (data) {
            let { notaEntrega, detalle, infoAdicionalArticulo } = data;
            let params = {
                notaEntrega,
                detalles: detalle,
                infoAdicionalArticulo
            }
            return mS.getData('post', url + 'Insert/', { data: params }, true).then(response => {
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
            let { notaEntrega, detalle, infoAdicionalArticulo } = data;
            let params = {
                notaEntrega,
                detalles: detalle,
                infoAdicionalArticulo
            }
            return mS.getData('put', url + 'Update/' + id, { data: params }, true).then(response => {
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

        //Validaciones
        service.getTotales = function (notaEntregas) {
            let total = 0, totalAbono = 0, totalSaldo = 0;
            for (let val of notaEntregas) {
                total += val.total;
                totalAbono += val.abono;
                totalSaldo += val.saldo;
            }
            return {
                total,
                totalAbono,
                totalSaldo
            }
        }

        return service;

    })

})(window.angular)