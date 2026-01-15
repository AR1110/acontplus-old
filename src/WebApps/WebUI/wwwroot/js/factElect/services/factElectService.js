//@ts-check
(function () {
    "use strict";
    const URL_API = "FactElect/";

    app.factory("docElectService", docElectService);

    docElectService.$inject = ["$injector"];

    function docElectService($injector) {
        let url = `${URL_API}DocumentoElectronico/`;
        let URL_RETENCION_ATS = "RetencionAts/";
        let mS = $injector.get("mainService");
        let FileSaver = $injector.get("FileSaver");
        let fS = $injector.get("formulario");
        let service = {};

        service.getDataFilter = function () {
            return mS
                .getData(
                    "get",
                    url + "?json=" + JSON.stringify({ tipo: 2 }),
                    null,
                    true
                )
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }

                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload);

                        let tempEstabsAndPtosEmision = mainData[0];
                        let tiposDoc = mainData[1];
                        let estadosDoc = mainData[2];

                        const estabs = fS.groupingEstab({
                            estabs: tempEstabsAndPtosEmision,
                        });
                        return {
                            estabs,
                            tiposDoc,
                            estadosDoc,
                        };
                    }
                });
        };

        /**
         * tipo 1: get listado general
         * tipo 2: get estabs, ptos. emisiones para los filtros
         * @returns
         */
        service.get = (params) => {
            if (!("tipo" in params)) {
                throw "Requiere propiedad tipo";
            }
            return mS
                .getData("get", url + "?json=" + JSON.stringify(params), null, true)
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }

                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload);
                        if (params.tipo === 1) {
                            return mainData[0];
                        }
                    }
                });
        };

        service.getAll = function (obj) {
            let pageIndex = obj.pageIndex || 1;
            let pageSize = obj.pageSize || 25;

            let json = JSON.stringify({
                tipo: 1,
                ...obj,
                pageIndex,
                pageSize,
            });
            return mS
                .getData("get", `${url}?json=${json}`, null, true)
                .then((response) => {
                    let results = [];
                    if (response.code === "1") {
                        let [comprobantesElectronicos] = JSON.parse(response.payload);

                        comprobantesElectronicos = comprobantesElectronicos || [];
                        results = comprobantesElectronicos.map((item) => {
                            return {
                                idDocumentoElectronico: item.idDocumentoElectronico,
                                idDocumento: item.idDocumento,
                                codDoc: item.codDoc,
                                comprobante: item.comprobante,
                                comprobanteVersion: `${item.comprobante}-${item.versionComp}`,
                                serieComprobante: item.serieComprobante,
                                rucReceptor: item.rucReceptor,
                                razonSocial: item.razonSocial,
                                fechaEmision: item.fechaEmision,
                                claveAcceso: item.claveAcceso,
                                fechaAutorizacion: item.fechaAutorizacion,
                                estado: item.estado,
                                codEstado: item.codEstado,
                                versionComp: item.versionComp,
                                usuario: item.usuario,
                                codEstab: item.codEstab,
                                totalRecords: item.totalRecords,
                            };
                        });
                    }
                    return results;
                });
        };

        service.getByStatus = (params) => {
            return mS
                .getData(
                    "get",
                    `${url}GetByStatus/?json=${JSON.stringify(params)}`,
                    null,
                    true
                )
                .then((response) => {
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload)[0];
                        return mainData;
                    }
                });
        };

        service.updateXml = (id) => {
            if (!(id > 0)) {
                throw "id no valido";
            }
            return mS.getData("put", `${url}${id}`, null, true);
        };

        service.downloadXml = function (id) {
            return mS
                .getFile("get", `${url}GetXmlSri/${id}`, null, true)
                .then((response) => {
                    let fileName = response
                        .headers()
                    ["content-disposition"].split(";")[1]
                        .split("=")[1]
                        .replace('"', "");
                    fileName = fileName.replace('"', "");
                    let serverData = new Blob([response.data], {
                        type: response.headers()["content-type"],
                    });
                    FileSaver.saveAs(serverData, fileName);
                });
        };

        service.downloadMultipleXmlsAsZip = function (ids) {
            const zip = new JSZip();
            let promises = [];

            ids.forEach(id => {
                // obtenemos cada archivo
                const p = mS.getFile("get", `${url}GetXmlSri/${id}`, null, true)
                    .then((response) => {
                        let fileName = response.headers()["content-disposition"]
                            .split(";")[1].split("=")[1].replace(/"/g, "");

                        // añadir archivo al ZIP
                        zip.file(fileName, response.data, { binary: true });
                    });

                promises.push(p);
            });

            // Cuando todas las descargas terminan
            Promise.all(promises).then(() => {
                zip.generateAsync({ type: "blob" }).then(function (content) {
                    FileSaver.saveAs(content, "ArchivosXML.zip");
                });
            });
        };

        service.validateNormativeSri = function (params) {
            const {
                accion,
                codDoc,
                identificacion,
                fechaEmision,
                idFormaPago,
                importeTotal
            } = params;


            if (!accion) throw new Error("Acción no definida");

            if (!identificacion) throw new Error("Identificación es requerida.");

            if (accion === 'anular' && !fechaEmision) {
                throw new Error("Fecha Emisión es requerida para anular.");
            }

            if (accion === 'guardar') {
                if (!idFormaPago) throw new Error("idFormaPago es requerida.");
                if (!importeTotal) throw new Error("importeTotal es requerida.");
            }

            const json = JSON.stringify({
                tipo: 3,
                codDoc,
                identificacion,
                fechaEmision,
                idFormaPago,
                importeTotal
            });


            return mS
                .getData("get", `${url}?json=${json}`, null, true)
                .then(async (response) => {
                    if (response.code !== "1") {
                        throw new Error(response.message || "Error al validar normativa SRI.");
                    }


                    const [parsedList] = JSON.parse(response.payload);
                    const parsed = parsedList[0] || null;

                    //  Si no hay datos devueltos, asumimos que todo está OK
                    //  Si no hay datos devueltos, asumimos que todo está OK
                    if (!parsed) return { code: "1" };

                    //  Si el backend devuelve restricción, se muestra alerta
                    //  Si el backend devuelve restricción, se muestra alerta
                    if (parsed.code === "0") {
                        if (accion === 'anular') {
                            await Swal.fire({
                                icon: 'warning',
                                html: response.message,
                            });
                            return parsed;
                        }
                        if (accion === 'anular') {
                            await Swal.fire({
                                icon: 'warning',
                                html: response.message,
                            });
                            return parsed;
                        }
                        Swal.fire({
                            icon: 'warning',
                            html: parsed.message,
                        });
                        throw new Error("Operación restringida por normativa SRI.");
                    }

                    return parsed; //  Devuelve el objeto si todo fue exitoso

                })
                };


            //Retencion ATS
            service.retencionAtsCancel = (id) => {
                if (!(id > 0)) {
                    throw "id no valido";
                }
                return mS.getData("put", `${URL_RETENCION_ATS}Cancel/${id}`, null, true);
            };

            return service;
        }

        app.factory("facturaService", facturaService);

        facturaService.$inject = ["$injector"];

        function facturaService($injector) {
            let url = `${URL_API}Factura/`;
            let mS = $injector.get("mainService");
            let fS = $injector.get("formulario");
            const pricingUtils = $injector.get("pricingUtils");
            const userCustomerPermissionSvc = $injector.get(
                "userCustomerPermissionService"
            );

            const tS = $injector.get("toastService");

            let service = {
                data: {},
            };

            service.getDataForm = () => {
                return mS
                    .getData(
                        "get",
                        url + "?json=" + JSON.stringify({ tipo: 3 }),
                        null,
                        true
                    )
                    .then((response) => {
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

                                clienteDefault = {
                                    ...clienteDefault,
                                    placas: clienteDefault.placa
                                        ? clienteDefault.placa.split(/[\|;]/)
                                        : [],
                                };
                            }

                            let config = mainData[6][0];
                            let vendedores = mainData[7];

                            // Establece un valor predeterminado para notificacionVenta y actualiza si hay datos disponibles
                            let notificacionVenta = {
                                notificacionVenta: false,
                            };
                            let notificacionVentaTemp = mainData[8];
                            notificacionVenta =
                                notificacionVentaTemp.length === 0
                                    ? notificacionVenta
                                    : notificacionVentaTemp[0];

                            // Extrae datos temporales para establecimientos y puntos de emisiÃ³n
                            let tempEstabsAndPtosEmision = mainData[9];
                            let tempBodegas = mainData[10];

                            // Obtiene el permiso de venta a partir de los datos del rol del usuario
                            let { sales, permisoEditarDoc } =
                                userCustomerPermissionSvc.userPermissionAdapter();

                            // Transforma datos temporales en un formato estructurado para establecimientos y puntos de emisiÃ³n
                            let dataToGroup = {
                                estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                                bodegas: tempBodegas, // Establecimientos con bodegas
                                isGroupBodega: true,
                            };
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
                            // Devuelve los datos finales estructurados

                            return {
                                estabs,
                                tarifasImpuesto,
                                tiemposCredito,
                                tarifas,
                                permisoVenta: sales,
                                notificacionVenta,
                                decimal,
                                config,
                                vendedores,
                                articuloDefault,
                                clienteDefault,
                                permisoEditarDoc,
                                formasPago: fS.mapperFromFormaPago(formasPago),
                                tiposIdentificacion,
                                infoAdicional,
                            };
                        }
                    });
            };

            service.getDataFilter = () => {
                return mS
                    .getData(
                        "get",
                        url + "?json=" + JSON.stringify({ tipo: 4 }),
                        null,
                        true
                    )
                    .then((response) => {
                        if (response.code === "0") {
                            throw response;
                        }

                        if (response.code === "1") {
                            let mainData = JSON.parse(response.payload);
                            let tempEstabsAndPtosEmision = mainData[0];
                            let estadosDoc = mainData[1];

                            let dataToGroup = {
                                estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                            };
                            let estabs = fS.groupingEstab(dataToGroup);
                            return {
                                estabs,
                                estadosDoc,
                            };
                        }
                    });
            };

            /**
             *Esta funcion declarada se usa en Retencion de Venta, Factura Venta(Listado General)
             * @param {object} query
             * @returns
             */
            service.getAll = function (query) {
                return mS
                    .getData("get", url + "?json=" + JSON.stringify(query), null, true)
                    .then((response) => {
                        let data = {
                            facturas: [],
                            dataTotals: {},
                        };
                        if (response.code === "0") {
                            throw response;
                        }

                        if (response.code === "1") {
                            let mainData = JSON.parse(response.payload);
                            let facturasRepository = mainData[0];
                            let totalRecords = 0,
                                totalDocument = 0,
                                totalAbono = 0,
                                totalSaldo = 0;
                            if (facturasRepository.length > 0) {
                                let data = facturasRepository[0];

                                totalRecords = data.totalRecords;
                                totalDocument = data.totalDocument;
                                totalAbono = data.totalAbono;
                                totalSaldo = data.totalSaldo;
                            }

                            let facturas = facturasRepository.map((item) => {
                                let colorRow = "";
                                if (item.estadoSri === 6) {
                                    colorRow = "table-danger";
                                }
                                if (item.estadoSri === 4) {
                                    colorRow = "table-success";
                                }

                                return {
                                    comprobante: "Factura",
                                    idCliente: item.idCliente,
                                    idDocumento: item.idDocumento,
                                    idCuentaPorCobrar: item.idCuentaPorCobrar,
                                    idDocumentoElectronico: item.idDocumentoElectronico,
                                    codEstab: item.codEstab,
                                    razonSocialComprador: item.nombreFiscal,
                                    identificacionComprador: item.identificacionComprador,
                                    fechaEmision: item.fechaEmision,
                                    fechaVencimiento: item.fechaVencimiento,
                                    total: item.total,
                                    serieComprobante: item.serieComprobante,
                                    estadoFinanciero: item.estadoFinanciero,
                                    codDoc: "01",
                                    abono: item.abono,
                                    saldo: item.saldo,
                                    tiempoCredito: item.tiempoCredito,
                                    usuario: item.usuario,
                                    codEstado: item.codEstado,
                                    esContado: item.tiempoCredito,
                                    estadoSri: item.estadoSri,
                                    colorRow,
                                    totalRecords: item.totalRecords,
                                    esCobrado: item.codEstado === "CBR",
                                    disabledActionUpdate:
                                        item.codEstado === "CBR" ||
                                        item.codEstado === "PP" ||
                                        item.codEstado === "A",
                                    disabledActionAnular: item.codEstado === "A",
                                    enabledActionCobro:
                                        item.codEstado === "PP" || item.codEstado === "PE",
                                    enabledActionCuota: item.codEstado === "PE",
                                    enabledActionHC: ["PP", "CBR"].includes(item.codEstado),
                                };
                            });

                            (data.facturas = facturas),
                                (data.dataTotals = {
                                    totalRecords,
                                    totalDocument,
                                    totalAbono,
                                    totalSaldo,
                                });
                        }
                        return data;
                    });
            };

            service.getForCreditNote = function (query) {
                if (!("byCliente" in query)) {
                    fS.sweetAlert("warning", "No se ha proporcionado el idCliente");
                    throw "";
                }
                if (!("codEstab" in query)) {
                    fS.sweetAlert("warning", "No se ha proporcionado el codEstab");
                    throw "";
                }
                query.tipo = 2;
                return mS
                    .getData("get", url + "?json=" + JSON.stringify(query), null, true)
                    .then((response) => {
                        if (response.code === "0") {
                            throw response;
                        }

                        if (response.code === "1") {
                            let mainData = JSON.parse(response.payload) || [];
                            let facturasRepository = mainData[0];
                            let facturas = facturasRepository.map((item) => {
                                return {
                                    idDocumento: item.idFactura,
                                    serieComprobante: item.serieComprobante,
                                    fechaEmision: item.fechaEmision,
                                    usuario: item.usuario,
                                    totalRecords: item.totalRecords
                                };
                            });
                            return {
                                facturas,
                            };
                        }
                    });
            };

            service.getIdForInfo = function (id, idDocumentoElectronico) {
                let spParams = {
                    tipo: 8,
                    id,
                    idDocumentoElectronico, //solo se envia cuando proviene de doc. electronico
                };
                return mS
                    .getData("get", `${url}?json=${JSON.stringify(spParams)}`, null, true)
                    .then((response) => {
                        if (response.code === "0") {
                            console.log("Get Data Info", response);
                            throw response;
                        }
                        if (response.code === "1") {
                            let mainDataApi = JSON.parse(response.payload);

                            let dataTemp = mainDataApi[0][0];
                            let cliente = mainDataApi[1][0];
                            let items = mainDataApi[2];
                            let infoAdicionalDocumento = mainDataApi[3];
                            let tarifasImpuesto = mainDataApi[4];
                            let formasPago = mainDataApi[5];

                            let {
                                nombreComercial,
                                fechaEmision,
                                fechaVencimiento,
                                ...restData
                            } = dataTemp;
                            let data = {
                                ...restData,
                                establecimiento: nombreComercial,
                                fechaEmision: fS.formatDate(fechaEmision),
                                fechaVencimiento: fS.formatDate(fechaVencimiento),
                                fechaEmisionEscrita: fS.getFechaEscrita(
                                    fS.formatDate(fechaEmision)
                                ),
                                fechaVencimientoEscrita: fS.getFechaEscrita(
                                    fS.formatDate(fechaVencimiento)
                                ),
                            };

                            let resultsItems = items.map((item) => {
                                let precioConIva = pricingUtils.calcularPrecioConIva(
                                    item.precioUnitario,
                                    item.tarifa
                                );
                                return {
                                    ...item,
                                    precioConIva,
                                };
                            });

                            return {
                                data,
                                cliente,
                                items: resultsItems,
                                infoAdicionalDocumento: infoAdicionalDocumento || [],
                                tarifasImpuesto,
                                formasPago,
                            };
                        }
                    });
            };

            service.getGroupInfoAdicionalArticulo = function (idInfoAdicional) {
                let json = JSON.stringify({
                    tipo: 6,
                    idInfoAdicional,
                });
                return mS
                    .getData("get", `${url}?json=${json}`, null, true)
                    .then((response) => {
                        let results = [];
                        if (response.code === "1") {
                            let [mainData] = JSON.parse(response.payload);
                            results = mainData;
                        }
                        return results;
                    });
            };

            service.generateSerieComprobante = function (query) {
                return mS
                    .getData(
                        "get",
                        url + "?json=" + JSON.stringify(Object.assign(query, { tipo: 7 })),
                        null,
                        true
                    )
                    .then((response) => {
                        if (response.code === "0") {
                            console.warn(response);
                            tS.toastr({
                                type: 'warning',
                                message: response.message
                            })
                            throw null;
                        }
                        if (response.code === "1") {
                            let mainData = JSON.parse(response.payload);
                            let data = mainData[0][0];
                            if (!data) {
                                tS.toastr({
                                    type: 'warning',
                                    message: "No se ha configurado secuencial doc."
                                })
                                throw null;
                            }
                            return data.serieComprobante;
                        }
                    });
            };

            service.getId = function (id) {
                return mS.getData("get", `${url}${id}`).then((response) => {
                    if (response.code === "0") {
                        throw new Error(response);
                    }
                    if (response.code === "1") {
                        let mainDataApi = JSON.parse(response.payload);
                        let [
                            comprobanteApi,
                            clienteTempApi,
                            itemsApi,
                            infoAdicionalDocumento,
                            datosAdicionalesArticuloTemp,
                            formasPagoTemp,
                            cuenta,
                            cuotas,
                        ] = mainDataApi;

                        let comprobanteTemp = (comprobanteApi && comprobanteApi[0]) || {};
                        let cliente = (clienteTempApi && clienteTempApi[0]) || {};
                        cliente = {
                            ...cliente,
                            identificacionComprador: cliente.numeroIdentificacion,
                            razonSocialComprador: cliente.nombreFiscal,
                            placas: cliente.placa ? cliente.placa.split(/[\|;]/) : [],
                        };

                        let items = itemsApi.map((itemPrincipal, index) => {
                            const { fraccionado, principal, consolidacion, ...restItem } =
                                itemPrincipal;

                            let consolidacionesFechaTemp =
                                (consolidacion && JSON.parse(consolidacion)) || [];
                            let consolidacionesFecha = consolidacionesFechaTemp.map((data) => ({
                                ...data,
                                fechaConsolidacion:
                                    data.fechaConsolidacion && new Date(data.fechaConsolidacion),
                            }));

                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            let uniqueRowDetalle = restItem.uuid;

                            let dataMedida =
                                medidas.find((m) => m.idMedida === restItem.idMedida) || {};

                            let datosAdicionalesArticulo = [];

                            if (
                                itemPrincipal.infoAdicionalArticulo &&
                                typeof itemPrincipal.infoAdicionalArticulo === "string"
                            ) {
                                let infoAdicionalArrayTemp = JSON.parse(
                                    itemPrincipal.infoAdicionalArticulo
                                );
                                datosAdicionalesArticulo = infoAdicionalArrayTemp.map(
                                    (dataAdicional) => ({
                                        uniqueRowDetalle,
                                        idArticulo: restItem.idArticulo,
                                        idInfoAdicional: dataAdicional.idInfoAdicional,
                                        jsonAdicional: JSON.parse(dataAdicional.jsonAdicional),
                                    })
                                );
                            }

                            if (
                                Array.isArray(datosAdicionalesArticuloTemp) &&
                                datosAdicionalesArticuloTemp.length > 0
                            ) {
                                let datosAdicionalesFiltered = datosAdicionalesArticuloTemp
                                    .filter(
                                        (daa) => daa.idFacturaDetalle === restItem.idFacturaDetalle
                                    )
                                    .map((daa) => {
                                        return {
                                            idHistoryInfoAdicional: daa.idHistoryInfoAdicional,
                                            uniqueRowDetalle,
                                            idInfoAdicional: daa.idInfoAdicional,
                                            jsonAdicional:
                                                (daa.jsonAdicional && JSON.parse(daa.jsonAdicional)) ||
                                                [],
                                            selected: daa.selected,
                                        };
                                    });

                                datosAdicionalesArticulo = [
                                    ...datosAdicionalesArticulo,
                                    ...datosAdicionalesFiltered,
                                ];
                            }

                            let precioConIva = pricingUtils.calcularPrecioConIva(
                                itemPrincipal.precioUnitario,
                                itemPrincipal.tarifa
                            );
                            // let total =
                            //     fS.roundNumber(
                            //         restItem.precioTotalSinImpuesto,
                            //         pricingUtils.max_dos
                            //     ) + fS.roundNumber(restItem.valorImpuesto, pricingUtils.max_dos);

                            let total = fS.roundNumber(restItem.precioTotalSinImpuesto + restItem.valorImpuesto, pricingUtils.max_cinco)

                            let obj = {
                                n: index + 1,
                                uniqueRowDetalle,
                                idFacturaDetalle: restItem.idFacturaDetalle,
                                cantidad: restItem.cantidad,
                                cantidadOriginal: restItem.cantidad,
                                codigo: restItem.codigo,
                                codigoPorcentaje: restItem.codigoPorcentaje, //âœ…
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
                                precioConIva: precioConIva || 0,
                                tarifa: restItem.tarifa, //âœ…
                                valorDescuento: restItem.valorDescuento,
                                valorImpuesto: restItem.valorImpuesto, //âœ…
                                precioTotalSinImpuesto: restItem.precioTotalSinImpuesto,
                                medidas,
                                conversion: dataMedida.conversion,
                                precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                                articuloTarifas: dataMedida.tarifas,
                                consolidacionesFecha,
                                estado: 1,
                                datosAdicionalesArticulo,
                                datosAdicionales: restItem.datosAdicionales,
                                total: fS.roundNumber(total, 5),
                            };

                            return obj;
                        });

                        let comprobante = {
                            ...comprobanteTemp,
                            serieComprobante: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}-${comprobanteTemp.secuencial}`,
                            puntoEmision: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}`,
                            fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                            fechaEmisionDocCreado: fS.formatDate(comprobanteTemp.fechaEmision),
                            irbpnr: comprobanteTemp.irbpnr || 0,
                            idTiempoCredito: cuenta[0].idTiempoCredito,
                            fechaVencimiento: fS.formatDate(cuenta[0].fechaVencimiento),
                        };

                        cuotas = cuotas.map((item) => {
                            return {
                                idCuotaPorCobrar: item.idCuotaPorCobrar,
                                nroCuota: item.nroCuota,
                                fechaVencimiento: fS.formatDate(item.fechaVencimiento),
                                cuota: item.cuota,
                                entrada: item.entrada,
                            };
                        });

                        infoAdicionalDocumento = infoAdicionalDocumento || [];
                        infoAdicionalDocumento = infoAdicionalDocumento.map((item) => {
                            return {
                                uniqueRowDetalle: item.uuid,
                                idInfoAdicional: item.idInfoAdicional,
                                idInfoAdicionalDoc: item.idInfoAdicionalDoc,
                                nombre: item.nombre,
                                valor: item.valor,
                                estado: item.estado,
                            };
                        });

                        let formasPago = formasPagoTemp.map((fp) => {
                            return {
                                idFormaPagoFactura: fp.idFormaPagoFactura,
                                idFormaPagoSri: fp.idFormaPagoSri,
                                idFactura: fp.idFactura,
                                idTiempoCredito: fp.idTiempoCredito,
                                total: fp.total,
                                plazo: fp.plazo,
                            };
                        });

                        let resultData = {
                            comprobante,
                            cliente,
                            items,
                            infoAdicionalDocumento,
                            formasPago,
                            cuotas,
                        };
                        return resultData;
                    }
                });
            };

            service.getDetalleDoc = function (id) {
                let spParams = {
                    tipo: 9,
                    id,
                };
                return mS
                    .getData("get", `${url}?json=${JSON.stringify(spParams)}`, null, true)
                    .then((response) => {
                        if (response.code === "0") {
                            console.log("Get Data Info", response);
                            throw response;
                        }
                        if (response.code === "1") {
                            let [itemsApi] = JSON.parse(response.payload);

                            let items = itemsApi.map((itemPrincipal, index) => {
                                const { fraccionado, principal, consolidacion, ...restItem } =
                                    itemPrincipal;

                                let consolidacionesFechaTemp =
                                    (consolidacion && JSON.parse(consolidacion)) || [];
                                let consolidacionesFecha = consolidacionesFechaTemp.map(
                                    (data) => ({
                                        ...data,
                                        fechaConsolidacion:
                                            data.fechaConsolidacion &&
                                            new Date(data.fechaConsolidacion),
                                    })
                                );

                                const medidas = fS.processAndSortMeasures(principal, fraccionado);

                                let dataMedida =
                                    medidas.find((m) => m.idMedida === restItem.idMedida) || {};

                                if ("infoDatosAdicionales" in itemPrincipal) {
                                    let infoAdicionalArrayTemp = JSON.parse(
                                        itemPrincipal.infoDatosAdicionales
                                    );
                                    restItem.datosAdicionalesArticulo = infoAdicionalArrayTemp.map(
                                        (dataAdicional) => ({
                                            idArticulo: dataAdicional.idArticulo,
                                            idEtiqueta: dataAdicional.idEtiqueta,
                                            idInfoAdicional: dataAdicional.idInfoAdicional,
                                            jsonAdicional: JSON.parse(dataAdicional.jsonAdicional),
                                            uniqueId: dataAdicional.uniqueId,
                                            estado: dataAdicional.estado,
                                        })
                                    );
                                }

                                let precioConIva = pricingUtils.calcularPrecioConIva(
                                    itemPrincipal.precioUnitario,
                                    itemPrincipal.tarifa
                                );

                                let total = pricingUtils.decPlus(restItem.precioTotalSinImpuesto, itemPrincipal.valorImpuesto, pricingUtils.precisionMaxima,);

                                let obj = {
                                    n: index + 1,
                                    idFacturaDetalle: itemPrincipal.idFacturaDetalle,
                                    cantidad: itemPrincipal.cantidad,
                                    cantidadOriginal: itemPrincipal.cantidad,
                                    codigo: itemPrincipal.codigo,
                                    codigoPorcentaje: itemPrincipal.codigoPorcentaje, //âœ…
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
                                    tarifa: itemPrincipal.tarifa, //âœ…
                                    valorDescuento: itemPrincipal.valorDescuento,
                                    valorImpuesto: itemPrincipal.valorImpuesto, //âœ…
                                    medidas,
                                    conversion: dataMedida.conversion,
                                    precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                                    articuloTarifas: dataMedida.tarifas,
                                    consolidacionesFecha,
                                    estado: 1,
                                    datosAdicionalesArticulo:
                                        restItem.datosAdicionalesArticulo || [],
                                    precioConIva: fS.roundNumber(precioConIva, 3),
                                    precioTotalSinImpuesto: restItem.precioTotalSinImpuesto,
                                    total,
                                };

                                return obj;
                            });
                            return {
                                items,
                            };
                        }
                    });
            };

            service.save = function (data) {
                return mS
                    .getData("post", url, { data }, true)
                    .then((response) => {
                        if (response.code === "0") {
                            service.data = {};
                            return response;
                        }
                        if (response.code === "1") {
                            let dataRepository = JSON.parse(response.payload)[0];

                            let dataResponse = {
                                ...dataRepository,
                                esContado: dataRepository.tiempoCredito,
                            };
                            return {
                                dataResponse,
                                code: "1",
                                message: "Registrado Correctamente",
                            };
                        }
                    })
                    .catch((error) => {
                        service.data = {};
                        throw error;
                    });
            };

            service.update = function (id, data) {
                return mS
                    .getData("put", url + id, { data }, true)
                    .then((response) => {
                        if (response.code === "0") {
                            service.data = {};
                            return response;
                        }
                        if (response.code === "1") {
                            return response;
                        }
                    })
                    .catch((error) => {
                        service.data = {};
                        throw error;
                    });
            };

            // service.delete = function (id) {
            //     return mS.getData("delete", `${url}${id}`, null, true);
            // };

            service.anular = function (id, infoAdicional) {
                let data = {
                    infoAdicional
                }
                return mS.getData('put', `${url}Cancel/${id}`, { data })

            }

            service.queryMapper = function (params) {
                let {
                    data,
                    cliente,
                    dataFormaPago,
                    detalles,
                    itemsDeleted,
                    infoAdicionalDocumento,
                    cuotas,
                    fromAprobacion = false,
                } = params;

                //data que se usara dentro de la funciÃ³n "getCantidadStock"
                service.data = Object.assign({}, data);

                let factura = Object.assign({}, data);

                if (
                    cliente.idCliente === 0 &&
                    !cliente.razonSocialComprador &&
                    !cliente.identificacionComprador
                ) {
                    throw new Error("Datos de cliente no proporcionados");
                }

                factura.idCliente = cliente.idCliente;
                factura.idTipoIdentificacion = cliente.idTipoIdentificacion;
                factura.fechaEmision = fS.formatDateTimeZone(data.fechaEmision);
                factura.fechaVencimiento = fS.formatDateTimeZone(data.fechaVencimiento);
                factura.identificacionComprador = cliente.identificacionComprador;
                factura.razonSocialComprador = cliente.razonSocialComprador;
                factura.direccionComprador = cliente.direccionComprador;
                factura.email = cliente.email;
                factura.telefono = cliente.telefono;
                factura.recargo = data.recargo || 0;
                factura.propina = data.propina || 0;

                let mergeDetalles = [...detalles, ...itemsDeleted];

                const itemsMainMapper = service.detalleMapperTo(
                    mergeDetalles,
                    fromAprobacion
                );
                // const itemsMainMapper = service.detalleMapperTo(detalles, fromAprobacion);
                //const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted, fromAprobacion)
                const impuestos = fS.impuestoTarifaMapperTo(detalles);
                // const mergeItems = [
                //     ...itemsMainMapper,
                //     ...itemsDeletedMapper
                // ]

                infoAdicionalDocumento = infoAdicionalDocumento || [];
                let infoAdicionalDocumentoMapped = infoAdicionalDocumento.map((item) => {
                    return {
                        // uuid: item.uniqueRowDetalle, //uid de articulo detalle
                        idInfoAdicional: item.idInfoAdicional,
                        idInfoAdicionalDoc: item.idInfoAdicionalDoc,
                        nombre: item.nombre,
                        valor: item.valor,
                        estado: item.estado,
                    };
                });

                const mapItem = (item, estado) => ({
                    uuid: item.uniqueRowDetalle,
                    idHistoryInfoAdicional: item.idHistoryInfoAdicional || 0,
                    idArticulo: item.idArticulo,
                    idInfoAdicional: item.idInfoAdicional,
                    estado: estado,
                });

                const datosAdicionalesArticuloDeleted = mergeDetalles
                    .flatMap((md) => md.datosAdicionalesArticulo)
                    .filter((md) => md.idHistoryInfoAdicional > 0 && !md.selected)
                    .map((item) => mapItem(item, 1));

                const datosAdicionalesArticuloSelectedDeleted = mergeDetalles
                    .flatMap((md) => md.datosAdicionalesArticulo)
                    .filter((md) => md.idHistoryInfoAdicional > 0 && md.selected)
                    .map((item) => mapItem(item, 2));

                const datosAdicionalesArticuloSelected = mergeDetalles
                    .flatMap((md) => md.datosAdicionalesArticulo)
                    .filter((md) => !(md.idHistoryInfoAdicional > 0) && md.selected)
                    .map((item) => mapItem(item, 2));

                const mergeDatosAdicionalesArticulo = [
                    ...datosAdicionalesArticuloSelected,
                    ...datosAdicionalesArticuloSelectedDeleted,
                    ...datosAdicionalesArticuloDeleted,
                ];

                return {
                    infoFactura: service.infoComprobanteMapperTo(factura),
                    detalles: itemsMainMapper,
                    impuestos: impuestos,
                    infoAdicional: infoAdicionalDocumentoMapped,
                    infoAdicionalArticulo: mergeDatosAdicionalesArticulo,
                    formaPago: dataFormaPago,
                    cuotas,
                };
            };

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
                    idTipoIdentificacion: data.idTipoIdentificacion,
                    identificacionComprador: data.identificacionComprador,
                    razonSocialComprador: data.razonSocialComprador,
                    direccionComprador: data.direccionComprador,
                    email: data.email,
                    telefono: data.telefono,
                };
                return result;
            };

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
                        uuid: item.uniqueRowDetalle,
                        idFacturaDetalle: item.idFacturaDetalle || 0,
                        idArticulo: item.idArticulo,
                        idTarifa: item.idTarifa,
                        idBodega: item.idBodega,
                        idMedida: item.idMedida,
                        idTipoIva: item.idTipoIva,
                        tarifa: item.tarifa, //âœ…
                        codigoPorcentaje: item.codigoPorcentaje, //âœ…
                        ice: item.ice,
                        descripcion: item.descripcion,
                        cantidad: item.cantidad,
                        precioSinSubsidio: item.precioSinSubsidio || 0,
                        precioUnitario: item.precioUnitario,
                        valorDescuento: item.valorDescuento,
                        precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                        porcentajeDescuento: item.porcentajeDescuento,
                        nota: item.nota,
                        llevaInventario: item.llevaInventario,
                        precioCosto: item.precioCosto,
                        precioCostoFraccionado: item.precioCostoFraccionado,
                        conversion: item.conversion,
                        cantidadTransaccion: fromAprobacion
                            ? item.cantidadTransaccion
                            : item.cantidad * item.conversion,
                        estado: item.estado,
                        valorImpuesto: item.valorImpuesto, //âœ…
                    });
                }
                return tempDetails;
            };

            return service;
        }

        app.factory("notaCreditoService", notaCreditoService);

        notaCreditoService.$inject = ["$injector"];
        function notaCreditoService($injector) {
            const mS = $injector.get("mainService");
            const fS = $injector.get("formulario");
            const pricingUtils = $injector.get("pricingUtils");
            const userCustomerPermissionSvc = $injector.get(
                "userCustomerPermissionService"
            );
            const tS = $injector.get("toastService");


            const URL = "FactElect/NotaCredito/";
            const service = {};

            /**
             * tipo 1: get credit notes
             * tipo 5: get data for formulario
             * @returns
             */

            service.getDataForm = () => {
                return mS
                    .getData(
                        "get",
                        URL + "?json=" + JSON.stringify({ tipo: 2 }),
                        null,
                        true
                    )
                    .then((response) => {
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
                            let infoAdicional = mainData[7] || [];
                            infoAdicional = infoAdicional.map((item) => {
                                return {
                                    ...item,
                                    infoAdicional: JSON.parse(item.infoAdicional),
                                };
                            });

                            let dataToGroup = {
                                estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                                bodegas: tempBodegas, // Establecimientos con bodegas
                                isGroupBodega: true,
                            };
                            let estabs = fS.groupingEstab(dataToGroup);
                            // Obtiene el permiso de venta a partir de los datos del rol del usuario
                            let { sales: permisoVenta } =
                                userCustomerPermissionSvc.userPermissionAdapter();

                            return {
                                estabs,
                                decimal,
                                tarifasImpuesto,
                                tarifas,
                                config,
                                vendedores,
                                permisoVenta,
                                infoAdicional,
                            };
                        }
                    });
            };

            service.getDataFilter = function () {
                let params = JSON.stringify({
                    tipo: 3
                })
                return mS
                    .getData("get", URL + "?json=" + params, null, true)
                    .then((response) => {
                        if (response.code === "0") {
                            throw response;
                        }

                        if (response.code === "1") {
                            let mainData = JSON.parse(response.payload);

                            let tempEstabsAndPtosEmision = mainData[0];
                            let estadosDoc = mainData[1];

                            let dataToGroup = {
                                estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                                bodegas: [], // Establecimientos con bodegas
                            };
                            let estabs = fS.groupingEstab(dataToGroup);
                            return {
                                estabs,
                                estadosDoc,
                            };
                        }
                    });
            }

            service.get = (params) => {
                return mS
                    .getData("get", URL + "?json=" + JSON.stringify(params), null, true)
                    .then((response) => {
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
                                    codDoc: "04",
                                }));
                                return notasCredito;
                            }

                            if (params.tipo === 3) {
                                let tempEstabsAndPtosEmision = mainData[0];
                                let estadosDoc = mainData[1];

                                let dataToGroup = {
                                    estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                                    bodegas: [], // Establecimientos con bodegas
                                };
                                let estabs = fS.groupingEstab(dataToGroup);
                                return {
                                    estabs,
                                    estadosDoc,
                                };
                            }
                        }
                    });
            };

            service.getAll = function (params) {
                return mS
                    .getData(
                        "get",
                        URL + "?json=" + JSON.stringify({ ...params, tipo: 1 }),
                        null,
                        true
                    )
                    .then((response) => {
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
                                codDoc: "04",
                                identificacionComprador: item.identificacionComprador,
                            }));
                            return notasCredito;
                        }
                    });
            };

            service.post = function (data) {
                return mS.getData("post", URL, { data }, true);
            };

            service.put = function (id, data) {
                return mS.getData("put", `${URL}${id}`, { data }, true);
            };

            service.delete = function (id) {
                return mS.getData("delete", `${URL}${id}`, null, true);
            };

            service.generateSerieComprobante = function (query) {
                return mS
                    .getData(
                        "get",
                        URL + "?json=" + JSON.stringify(Object.assign(query, { tipo: 6 })),
                        null,
                        true
                    )
                    .then((response) => {
                        if (response.code === "0") {
                            console.warn(response);
                            tS.toastr({
                                type: 'warning',
                                message: response.message
                            })
                            throw null;
                        }
                        if (response.code === "1") {
                            let mainData = JSON.parse(response.payload);
                            let data = mainData[0][0];

                            if (!data) {
                                tS.toastr({
                                    type: 'warning',
                                    message: "No se ha configurado secuencial doc."
                                })
                                throw null;
                            }

                            return data.serieComprobante;
                        }
                    });
            };

            service.getIdForInfo = function (id) {
                return mS
                    .getData(
                        "get",
                        URL + "?json=" + JSON.stringify({ tipo: 5, id }),
                        null,
                        true
                    )
                    .then((response) => {
                        if (response.code === "0") {
                            throw response;
                        }
                        if (response.code === "1") {
                            const [
                                mainData,
                                mainDataFactura,
                                mainDataCliente,
                                mainDetalle,
                                mainInfoAdicional,
                                tarifasImpuesto
                            ] = JSON.parse(response.payload);

                            let { fechaEmision, nombreComercial, ...restData } = mainData[0];
                            let comprobante = {
                                ...restData,
                                establecimiento: nombreComercial,
                                fechaEmision: fS.formatDate(fechaEmision),
                                fechaEmisionEscrita: fS.getFechaEscrita(
                                    fS.formatDate(fechaEmision)
                                ),
                            };

                            let resultsItems = mainDetalle.map((item) => {
                                let precioConIva = pricingUtils.calcularPrecioConIva(
                                    item.precioUnitario,
                                    item.tarifa
                                );
                                return {
                                    ...item,
                                    precioConIva,
                                };
                            });

                            return {
                                data: comprobante,
                                factura: mainDataFactura.length > 0 ? mainDataFactura[0] : {},
                                cliente: mainDataCliente[0],
                                items: resultsItems,
                                infoAdicionalDocumento: mainInfoAdicional,
                                tarifasImpuesto
                            };
                        }
                    });
            };

            service.getId = function (id) {
                return mS
                    .getData(
                        "get",
                        URL + "?json=" + JSON.stringify({ tipo: 4, id }),
                        null,
                        true
                    )
                    .then((response) => {
                        if (response.code === "0") {
                            console.log(response);
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

                            let comprobanteTemp = (comprobanteApi && comprobanteApi[0]) || {};

                            let factura = facturaApi.reduce(
                                (acc, previous) => {
                                    acc.idDocumento = previous.idFactura;
                                    acc.serieComprobante = previous.nroFactura;
                                    return acc;
                                },
                                { idDocumento: "", serieComprobante: "" }
                            );

                            let cliente = (clienteTempApi && clienteTempApi[0]) || {};

                            let detalleDocumento = itemsApi.map((itemPrincipal, index) => {
                                const { fraccionado, principal, consolidacion, ...restItem } =
                                    itemPrincipal;

                                let consolidacionesFechaTemp =
                                    (consolidacion && JSON.parse(consolidacion)) || [];
                                let consolidacionesFecha = consolidacionesFechaTemp.map(
                                    (data) => ({
                                        ...data,
                                        fechaConsolidacion:
                                            data.fechaConsolidacion &&
                                            new Date(data.fechaConsolidacion),
                                    })
                                );

                                const medidas = fS.processAndSortMeasures(principal, fraccionado);

                                let dataMedida =
                                    medidas.find((m) => m.idMedida === restItem.idMedida) || {};

                                let precioConIva = pricingUtils.calcularPrecioConIva(
                                    itemPrincipal.precioUnitario,
                                    itemPrincipal.tarifa
                                );
                                let total =
                                    itemPrincipal.precioTotalSinImpuesto +
                                    itemPrincipal.valorImpuesto;

                                let obj = {
                                    n: index + 1,
                                    idNotaCreditoDetalle: itemPrincipal.idNotaCreditoDetalle,
                                    cantidad: itemPrincipal.cantidad,
                                    cantidadOriginal: itemPrincipal.cantidad,
                                    codigo: itemPrincipal.codigo,
                                    codigoPorcentaje: itemPrincipal.codigoPorcentaje, //âœ…
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
                                    precioConIva: precioConIva || 0,
                                    precioCosto: itemPrincipal.precioCosto,
                                    precioUnitario: itemPrincipal.precioUnitario,
                                    tarifa: itemPrincipal.tarifa, //âœ…
                                    valorDescuento: itemPrincipal.valorDescuento,
                                    valorImpuesto: itemPrincipal.valorImpuesto, //âœ…
                                    precioTotalSinImpuesto: itemPrincipal.precioTotalSinImpuesto,
                                    medidas,
                                    conversion: dataMedida.conversion,
                                    precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                                    articuloTarifas: dataMedida.tarifas,
                                    consolidacionesFecha,
                                    estado: 1,
                                    datosAdicionales: restItem.datosAdicionales,
                                    total: fS.roundNumber(total, 5),
                                };

                                return obj;
                            });

                            let infoComprobante = {
                                ...comprobanteTemp,
                                serieComprobante: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}-${comprobanteTemp.secuencial}`,
                                puntoEmision: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}`,
                                fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                                fechaEmisionDocCreado: fS.formatDate(
                                    comprobanteTemp.fechaEmision
                                ),
                                irbpnr: comprobanteTemp.irbpnr || 0,
                            };

                            return {
                                infoComprobante,
                                factura,
                                cliente,
                                detalleDocumento,
                                infoAdicionalDocumento,
                            };
                        }
                    });
            };

            service.paramsMapperToApi = function (params) {
                const { infoComprbante, detalles, detallesDeleted, infoAdicional } =
                    params;

                let resultInfoComprobante =
                    service.infoComprobanteMapperTo(infoComprbante);
                const resultDetalles = service.detalleMapperTo(detalles);
                const resultDetallesDeleted = service.detalleMapperTo(detallesDeleted);
                const impuestos = fS.impuestoTarifaMapperTo(detalles);

                const mergeDetalles = [...resultDetalles, ...resultDetallesDeleted];
                return {
                    infoNotaCredito: resultInfoComprobante,
                    detalles: mergeDetalles,
                    impuestos: impuestos,
                    infoAdicional: infoAdicional || [],
                };
            };

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
                    observacion: data.observacion,
                };
                return comprobante;
            };

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
                        cantidadTransaccion: cantidadTransaccion * -1,
                        conversion: orderItem.conversion,
                        precioCostoFraccionado: orderItem.precioCostoFraccionado,
                        precioCosto: orderItem.precioCosto,
                        valorImpuesto: orderItem.valorImpuesto,
                        estado: orderItem.estado,
                    };
                    return obj;
                });
                return resultMap;
            };

            return service;
        }

        /**
         * Retencion ATS version 2.0.0
         */

        app.factory("retencionAtsService", retencionAtsService);

        retencionAtsService.$inject = ["$injector"];

        function retencionAtsService($injector) {
            let url = "FactElect/RetencionAts/";
            let mS = $injector.get("mainService");
            let fS = $injector.get("formulario");
            return {
                getDataForm,
            };

            function getDataForm() {
                return mS
                    .getData("get", `${url}${JSON.stringify({ tipo: 1 })}`, null, true)
                    .then((response) => {
                        if (response.code === "0") {
                            throw response;
                        }
                        if (response.code === "1") {
                            let tempArray = JSON.parse(response.payload);
                            const [
                                tiposIdentificacion,
                                tiposSujRetenido,
                                documentos,
                                sustentos,
                                tiposPago,
                                tiposRegimenFE,
                                paises,
                                paraisosFiscales,
                                impuestos,
                                tarifasImpuesto,
                                impuestosRet,
                                porcentajesRetIva,
                                codigosRetencion,
                                formasPago,
                                establecimientos,
                                infoAdicional,
                            ] = tempArray;


                            let dataToGroup = {
                                estabs: establecimientos, //Establecimientos con puntos de emision
                            }
                            let estabsGroup = fS.groupingEstab(dataToGroup);


                            return {
                                tiposIdentificacion,
                                tiposSujRetenido,
                                documentos,
                                sustentos,
                                tiposPago,
                                tiposRegimenFE,
                                paises,
                                paraisosFiscales,
                                impuestos,
                                tarifasImpuesto,
                                impuestosRet,
                                porcentajesRetIva,
                                codigosRetencion,
                                formasPago,
                                estabsGroup,
                                infoAdicional: infoAdicional.map((item) => {
                                    return {
                                        ...item,
                                        infoAdicional: JSON.parse(item.infoAdicional),
                                    };
                                }),
                            };
                        }
                    });
            }
        }
    }) (window.angular);
