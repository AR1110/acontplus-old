
(function () {

    'use strict';

    app.factory('aprobacionDocService', function ($injector) {
        let url = 'Venta/AprobacionDocumento/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
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
                    let tarifaImpuestoVigente = mainData[6][0];
                    let { permisoVenta } = fS.getDataUserRol();

                    const tempEstabs = tempEstabsAndPtosEmision.reduce((acc, item) => {
                        const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                        if (!existingItem) {
                            acc.push({
                                idEstablecimiento: item.idEstablecimiento,
                                nombreComercial: item.nombreComercial,
                                codEstab: item.codEstab,
                                defaultEstab: item.defaultEstab,
                                puntosEmision: [{
                                    codEstab: item.codEstab,
                                    idPuntoEmision: item.idPuntoEmision,
                                    ptoEmi: item.ptoEmi,
                                    defaultPtoEmi: item.defaultPtoEmi
                                }]
                            });
                        } else {
                            existingItem.puntosEmision.push({
                                codEstab: item.codEstab,
                                idPuntoEmision: item.idPuntoEmision,
                                ptoEmi: item.ptoEmi,
                                defaultPtoEmi: item.defaultPtoEmi
                            });
                        }
                        return acc;
                    }, []);

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
                        tarifasImpuesto,
                        tiemposCredito,
                        tarifas,
                        permisoVenta,
                        decimal,
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

                    let compMapper = {
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
                        codigoPorcentaje: compRepository.codigoPorcentaje,
                        totalSinImpuestos: compRepository.totalSinImpuestos,
                        totalDescuento: compRepository.totalDescuento,
                        totalConImpuestos: compRepository.totalConImpuestos,
                        propina: compRepository.propina,
                        importeTotal: compRepository.importeTotal,
                        total: compRepository.importeTotal,

                        puntoEmision: `${compRepository.estab}-${compRepository.ptoEmi}`,
                        fechaEmision: fS.formatDate(compRepository.fechaEmision),
                        fechaEmisionDocCreado: fS.formatDate(compRepository.fechaEmision)
                    }
                    let clienteMapper = {
                        idCliente: clienteRepository.idCliente,
                        nombreComercial: clienteRepository.nombreComercial,
                        nombreFiscal: clienteRepository.nombreFiscal,
                        numeroIdentificacion: clienteRepository.numeroIdentificacion,
                        direccion: clienteRepository.direccion
                    }

                    let items = detalleRepository.map(itemPrincipal => {

                        const { fraccionado, principal, consolidacion, ...restItem } = itemPrincipal;

                        // Medidas del artículo fraccionado del principal
                        let medidasFraccionadoTemp = JSON.parse(fraccionado) || [];

                        // Medida principal con las tarifas
                        let medidasPrincipalTemp = JSON.parse(principal) || [];

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

                        restItem.consolidacionesFecha = consolidacionesFecha.map((data) => ({
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }));

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

                        let precioConIva = ((restItem.precioUnitario * (restItem.tarifa / 100)) + restItem.precioUnitario);
                        let porcentajeDescuento = restItem.precioUnitario === 0 ? 0 : (restItem.descuento / restItem.precioUnitario) * 100;
                        restItem.precioConIva = fS.roundNumber(precioConIva, 3);
                        restItem.porcentajeDescuento = fS.roundNumber(porcentajeDescuento, 3)
                        restItem.precioTotalSinImpuesto = (restItem.precioUnitario - restItem.descuento) * restItem.cantidad
                        restItem.valorDescuento = restItem.descuento;
                        let subTotal = restItem.cantidad * restItem.precioUnitario || 0;
                        let totalDescuento = restItem.cantidad * restItem.descuento || 0;

                        restItem.subTotal = subTotal || 0;
                        restItem.total = restItem.precioTotalSinImpuesto;
                        restItem.totalDescuento = totalDescuento || 0;
                        restItem.cantidadOriginal = restItem.cantidad;
                        restItem.ice = 0;

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

                    return {
                        comprobante: compMapper,
                        cliente: clienteMapper,
                        detalles: items,
                        historial: historialRepository,
                        infoAdicionalDocumento: infoAdicionalDocumento,
                        datosAdicionalesArticulo: datosAdicionalesArticulo.map(item => ({
                            idDocumento: item.idDocumento,
                            idHistoryInfoAdicional: item.idHistoryInfoAdicional,
                            idArticulo: item.idArticulo,
                            idEtiqueta: item.idEtiqueta,
                            idInfoAdicional: item.idInfoAdicional,
                            jsonAdicional: JSON.parse(item.jsonAdicional),
                            selected: item.selected,
                            estado: item.estado
                        }))
                    }
                }
            }).catch(error => {
                throw error
            })
        }




        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true)
                .then(response => {
                    return response;
                })
        }


        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true)
                .then(response => {
                    return response;
                })
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true)
                .then(response => {
                    return response;
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
                    let itemsTemp = mainDataApi[2];
                    let historialRepository = mainDataApi[3];
                    let { nombreComercial, fechaEmision, ...restData } = dataTemp;
                    let data = {
                        ...restData,
                        establecimiento: nombreComercial,
                        fechaEmision: fS.formatDate(fechaEmision),
                        fechaEmisionEscrita: fS.getFechaEscrita(fS.formatDate(fechaEmision)),
                    }
                    return {
                        comprobante: data,
                        cliente,
                        items: itemsTemp.map((item) => {
                            let subTotal = item.cantidad * item.precioUnitario || 0;
                            let precioTotalSinImpuesto = (item.precioUnitario - item.descuento) * item.cantidad;
                            return {
                                ...item,
                                precioConIva: item.precioConIva || 0,
                                ice: 0,
                                valorDescuento: item.descuento || 0,

                                subTotal: fS.roundNumber(subTotal, 3),
                                total: precioTotalSinImpuesto,
                            }
                        }),
                        historial: historialRepository || []
                    }

                }
            })
        }

        service.detalleMapperTo = function (detalles, decimal) {
            let tempDetail = [];
            let orderIndex = 1;
            for (let item of detalles) {

                let precioTotalSinImpuesto = (item.precioUnitario - item.valorDescuento) * item.cantidad;
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
                    valorDescuento: item.valorDescuento,
                    descuento: item.valorDescuento,
                    precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, decimal.nroTotalDetalle),
                    baseImponible: fS.roundNumber(precioTotalSinImpuesto, decimal.nroTotalDetalle),
                    nota: item.nota,
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa,
                    idBodega: item.idBodega,
                }
                tempDetail.push(obj);
            }
            return tempDetail;
        }


        service.addRow = function () {
            return {
                idAprob_Document_Detailt: 0,
                idFacturaDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 1,
                nombreMedida: "",
                codigoPorcentaje: "",
                tarifa: 0,
                nombreTipoIva: "",
                articuloTarifas: [],
                idTarifa: 0,
                precioUnitario: 0,
                precioConIva: 0,
                porcentajeDescuento: 0,
                valorDescuento: 0,
                totalDescuento: 0,
                ice: 0,
                idBodega: 0,
                subTotal: 0,
                total: 0,
                nota: "S/N",
                llevaInventario: false,
                datosAdicionales: false
            }
        }


        return service;

    })




})(window.angular)