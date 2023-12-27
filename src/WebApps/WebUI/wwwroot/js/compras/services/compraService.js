(function () {
    "use strict";

    app.factory("proveedorService", function ($injector) {
        const URL = "Compra/Proveedor/";
        const service = {};
        const mS = $injector.get("mainService");

        service.get = function (params) {
            const query = {
                ...params,
                tipo: 1,
            };
            return mS
                .getData("get", `${URL}?json=${JSON.stringify(query)}`, null, true)
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let { proveedores } = JSON.parse(response.payload);

                        return proveedores.map(proveedor => (
                            {
                                idProveedor: proveedor.idProveedor,
                                numeroIdentificacion: proveedor.numeroIdentificacion,
                                razonSocial: proveedor.razonSocial,
                                direccion: proveedor.direccion,
                                telefono: proveedor.telefono,
                                correo: proveedor.correo,
                                estado: proveedor.estado,
                                tipoIdentificacion: proveedor.tipoIdentificacion,
                                descTipoIdentificacion: proveedor.descTipoIdentificacion,
                                subContribuyente: proveedor.subContribuyente,
                                totalRecords: proveedor.totalRecords,
                            }
                        ))
                    }
                });
        };

        service.getDataForm = function () {
            let params = {
                tipo: 3,
            };
            return mS
                .getData("get", `${URL}?json=${JSON.stringify(params)}`, null, true)
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let {
                            tiposIdentificacion,
                            subcontribuyentes,
                            tiemposCredito,
                            tiposEntidad,
                            tiposProveedor,
                            ciudades,
                        } = JSON.parse(response.payload);
                        return {
                            tiposIdentificacion,
                            subcontribuyentes,
                            tiemposCredito,
                            tiposEntidad,
                            tiposProveedor,
                            ciudades,
                        }
                    }
                })
        }

        service.getId = function (id) {
            let params = {
                id,
                tipo: 2,
            };
            return mS
                .getData("get", `${URL}?json=${JSON.stringify(params)}`, null, true)
                .then((response) => {

                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let results = JSON.parse(response.payload)
                        let proveedor = results.proveedor[0];
                        return {
                            ...proveedor,
                            correos: proveedor.correo ? proveedor.correo.split(';') : [],
                            telefonos: proveedor.telefonos ? proveedor.telefonos.split(';') : []
                        }
                    }
                });
        }

        service.search = function (textSearch) {
            let params = {
                textSearch,
                tipo: 5,
            };
            return mS
                .getData("get", `${URL}?json=${JSON.stringify(params)}`, null, true)
                .then((response) => {

                    if (response.code === "0") {
                        console.log(response)
                        return [];
                    }
                    if (response.code === "1") {
                        let results = JSON.parse(response.payload)
                        let proveedores = results.proveedores;
                        return proveedores.map((proveedor) => ({
                            ...proveedor,
                            nombreFiscal: proveedor.razonSocial
                        }))
                    }
                });
        }

        service.checkByID = function (ruc) {
            let params = {
                tipo: 4,
                identificacion: ruc
            };
            return mS.getData("get", `${URL}?json=${JSON.stringify(params)}`, null, true).then(response => {
                if (response.code === "0") {
                    return {
                        idProveedor: 0,
                        idTiempoCredito: 0
                    }
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload)
                    return mainData.proveedor[0]
                }

            })
        }
        service.post = function (data) {
            return mS.getData(
                "post",
                `${URL}`,
                { data },
                true
            );
        };

        service.put = function (id, data) {
            return mS.getData(
                "put",
                `${URL}${id}`,
                { data },
                true
            );
        };

        service.delete = function (id) {
            return mS.getData("delete", URL + id, null, true);
        };

        return service;
    });

    app.factory("categoriaCompraService", function ($injector) {
        const URL = "Compra/CategoriaCompra/";
        const mS = $injector.get("mainService");

        const service = {};

        service.get = (query) => {
            return mS
                .getData("get", URL + "?json=" + JSON.stringify(query), null, true)
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let results = JSON.parse(response.payload);
                        return results;
                    }
                });
        };

        service.post = (data) => {
            return mS.getData(
                "post",
                URL + "?json=" + JSON.stringify(data),
                null,
                true
            );
        };

        service.put = (id, data) => {
            return mS.getData(
                "put",
                URL + id + "?json=" + JSON.stringify(data),
                null,
                true
            );
        };

        service.delete = (id) => {
            return mS.getData("delete", URL + "" + id, null, true);
        };

        return service;
    });



    /**
     * Liquidacion Compra 
     */

    app.factory('liquidacionCompraService', function ($injector) {
        const url = 'Compra/LiquidacionCompra/'
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');

        return {
            getDataForm,
            getDataFilter,
            getAll,
            generateSerieComprobante,
            queryMapper,
            post,
            getId,
            put,
            anular,
            getIdForInfo
        }

        function getDataForm() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ tipo: 2 })}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload) || [];
                    const { configDecimales, estab, impuestos, ptoEmi, tiempoCredito } = results;


                    let dataToGroup = {
                        estabs: ptoEmi, //Establecimientos con puntos de emision
                        bodegas: estab, // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
                    let decimal = configDecimales[0];
                    let tarifasImpuesto = impuestos;

                    return {
                        estabs,
                        decimal,
                        tarifasImpuesto,
                        tiemposCredito: tiempoCredito
                    }
                }
            })
        }

        function getDataFilter() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ tipo: 3 })}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload) || [];
                    const { ptoEmision, estadoDocumento } = results;

                    let dataToGroup = {
                        estabs: ptoEmision, //Establecimientos con puntos de emision 
                    }
                    let estabs = fS.groupingEstab(dataToGroup);

                    return {
                        estabs,
                        estadosDoc: estadoDocumento
                    }

                }
            })
        }

        function getAll(query) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ ...query, tipo: 1 })}`, null, true).then(response => {
                if (typeof response === 'object') {
                    const { liquidaciones } = JSON.parse(response.payload);
                    return liquidaciones.map(item => ({
                        codEstab: item.codEstab,
                        idLiquidacionCompra: item.idLiquidacionCompra,
                        fechaEmision: item.fechaEmision,
                        total: item.total,
                        saldo: item.saldo,
                        abono: item.abono,
                        nroDocumento: item.nroDocumento,
                        serieComprobante: item.nroDocumento,
                        nombreFiscal: item.nombreFiscal,
                        estadoFinanciero: item.estadoFinanciero,
                        style: item.style,
                        usuario: item.usuario,
                        codDoc: "LC",
                        codEstado: item.codEstado,
                        totalRecords: item.totalRecords || 0
                    }))
                }
                return [];
            })
        }

        function generateSerieComprobante(query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 4 })), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let { serieComprobante } = JSON.parse(response.payload);
                    let data = serieComprobante[0];
                    return data.serieComprobante;
                }
            })
        }

        function queryMapper(obj) {
            const { comprobante, detalles, detallesDeleted, infoAdicionalDocumento } = obj;

            const comprobanteMapper = infoComprobanteMapperTo(comprobante);
            const itemsMainMapper = detalleMapperTo(detalles);
            const itemsDeletedMapper = detalleMapperTo(detallesDeleted)

            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]
            return {
                infoLiquidacion: comprobanteMapper,
                detalles: mergeItems,
                impuestos,
                infoAdicional: infoAdicionalDocumento
            }
        }


        function infoComprobanteMapperTo(data) {
            const result = {
                idProveedor: data.idProveedor,
                idTiempoCredito: data.idTiempoCredito,
                idPuntoEmision: data.idPuntoEmision,
                fechaEmision: fS.formatDateTimeZone(data.fechaEmision),
                fechaVencimiento: fS.formatDateTimeZone(data.fechaVencimiento),
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                porcentajeDescuento: data.porcentajeDescuento,
                totalDescuento: data.totalDescuento,
                propina: data.propina || 0,
                recargo: data.recargo || 0,
                transporte: data.transporte || 0,
                total: data.total,
                observacion: data.observacion || null,
            }
            return result;
        }

        function detalleMapperTo(items) {
            let tempDetail = [];
            let orderIndex = 0;
            for (let item of items) {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                const obj = {
                    idLiquidacionCompraDetalle: item.idLiquidacionCompraDetalle,
                    orderIndex: orderIndex + 1,
                    idArticulo: item.idArticulo,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    ice: item.ice,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    valorDescuento: item.valorDescuento,
                    porcentajeDescuento: item.porcentajeDescuento,
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa,
                    valorImpuesto: item.valorImpuesto,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                    nota: item.nota,
                    descripcion: item.descripcion,
                    llevaInventario: item.llevaInventario,
                    cantidadTransaccion: cantidadTransaccion,
                    estado: item.estado
                }

                tempDetail.push(obj);
            }
            return tempDetail;
        }


        function post(data) {
            return mS.getData('post', `${url}Insert`, { data }, true)
        }
        function getId(id) {
            return mS.getData('get', `${url}GetId/${id}`, null, true).then(
                response => {
                    if (response.code == "0") {
                        throw response
                    }
                    if (response.code === "1") {
                        const mainData = JSON.parse(response.payload);
                        const [comprobanteApi, proveedorApi, detalleApi, infoAdicionalDocumento, cuentaPorPagarApi] = mainData;
                        let comprobante = comprobanteApi[0];
                        const proveedor = proveedorApi[0];
                        const cuentaPorPagar = cuentaPorPagarApi[0];

                        comprobante = {
                            idLiquidacionCompra: comprobante.idLiquidacionCompra,
                            codEstab: comprobante.codEstab,
                            idPuntoEmision: comprobante.idPuntoEmision,
                            idTiempoCredito: cuentaPorPagar.idTiempoCredito,
                            fechaEmision: fS.formatDate(comprobante.fechaEmision),
                            fechaEmisionDocCreado: fS.formatDate(comprobante.fechaEmision),
                            fechaVencimiento: fS.formatDate(cuentaPorPagar.fechaVencimiento),
                            subTotalSinImpuestos: comprobante.subTotalSinImpuestos,
                            estab: comprobante.estab,
                            ptoEmi: comprobante.ptoEmi,
                            nroDocumento: comprobante.nroDocumento,
                            totalDescuento: comprobante.totalDescuento,
                            porcentajeDescuento: comprobante.porcentajeDescuento,
                            propina: comprobante.propina,
                            recargo: comprobante.recargo,
                            transporte: comprobante.transporte,
                            total: comprobante.total,
                            observacion: comprobante.observacion,
                            irbpnr: comprobante.irbpnr,
                        }



                        const detalles = detalleApi.map((item, index) => {
                            const { fraccionado, principal, ...restItem } = item;

                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};

                            return {
                                n: index + 1,
                                idLiquidacionCompraDetalle: item.idLiquidacionCompraDetalle,
                                idBodega: item.idBodega,
                                idArticulo: item.idArticulo,
                                idMedida: item.idMedida,
                                idTipoIva: item.idTipoIva,
                                idImpuesto: item.idImpuesto,
                                codigo: item.codigo,
                                descripcion: item.descripcion,
                                cantidad: item.cantidad,
                                precioUnitario: item.precioUnitario,
                                porcentajeDescuento: item.porcentajeDescuento,
                                valorDescuento: item.valorDescuento,
                                precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                                codigoPorcentaje: item.codigoPorcentaje,
                                tarifa: item.tarifa,
                                valorImpuesto: item.valorImpuesto,
                                nota: item.nota,
                                llevaInventario: item.llevaInventario,
                                datosAdicionales: item.datosAdicionales,
                                medidas,
                                conversion: dataMedida.conversion,
                                ice: item.ice,
                                estado: item.estado
                            }

                        })

                        return {
                            comprobante,
                            proveedor,
                            detalles,
                            infoAdicionalDocumento
                        }

                    }
                }
            )
        }

        function put(id, data) {
            return mS.getData('put', `${url}${id}`, { data }, true)
        }

        function anular(id) {
            return mS.getData('delete', `${url}${id}`, null, true)
        }

        function getIdForInfo(id) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ id, tipo: 5 })}`, null, true).then(
                response => {
                    let mainData = JSON.parse(response.payload);
                    let { liquidacion, contabilidad, proveedor, detalles, infoAdicional, impuestos } = mainData;
                    let comprobante = liquidacion[0];
                    contabilidad = contabilidad[0];
                    proveedor = proveedor[0]

                    proveedor = {
                        ...proveedor,
                        nombreProveedor: proveedor.nombreFiscal
                    }

                    let { fechaEmision, fechaVencimiento } = comprobante;
                    fechaEmision = fS.formatDate(comprobante.fechaEmision);
                    fechaVencimiento = fS.formatDate(contabilidad.fechaVencimiento);

                    comprobante = {
                        idLiquidacionCompra: comprobante.idLiquidacionCompra,
                        codEstab: comprobante.codEstab,
                        idPuntoEmision: comprobante.idPuntoEmision,
                        tiempoCredito: contabilidad.tiempoCredito,
                        establecimiento: comprobante.nombreComercial,
                        fechaEmision: fS.formatDate(comprobante.fechaEmision),
                        fechaVencimiento: fS.formatDate(contabilidad.fechaVencimiento),
                        subTotalSinImpuestos: comprobante.subTotalSinImpuestos,
                        estab: comprobante.estab,
                        ptoEmi: comprobante.ptoEmi,
                        nroDocumento: comprobante.nroDocumento,
                        totalDescuento: comprobante.totalDescuento,
                        porcentajeDescuento: comprobante.porcentajeDescuento,
                        propina: comprobante.propina,
                        recargo: comprobante.recargo,
                        transporte: comprobante.transporte,
                        total: comprobante.total,
                        observacion: comprobante.observacion,
                        irbpnr: comprobante.irbpnr,
                        fechaEmisionEscrita: fS.getFechaEscrita(fechaEmision),
                        fechaVencimientoEscrita: fS.getFechaEscrita(fechaVencimiento),
                    }

                    detalles = detalles.map((item, index) => {
                        return {
                            n: index + 1,
                            idLiquidacionCompraDetalle: item.idLiquidacionCompraDetalle,
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            cantidad: item.cantidad,
                            precioUnitario: item.precioUnitario,
                            porcentajeDescuento: item.porcentajeDescuento,
                            valorDescuento: item.valorDescuento,
                            ice: item.ice,
                            precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                            codigoPorcentaje: item.codigoPorcentaje,
                            tarifa: item.tarifa,
                            valorImpuesto: item.valorImpuesto,
                            nota: item.nota,
                            bodega: item.bodega,
                            tipoIva: item.tipoIva,
                            medida: item.medida,
                        }
                    })
                    return {
                        comprobante,
                        proveedor,
                        detalles,
                        infoAdicionalDocumento: infoAdicional,
                        tarifasImpuesto: impuestos
                    }
                }
            )
        }
    })










    /**
     * Factura Compra 
     */

    app.factory('facturaCompraService', function ($injector) {

        let url = 'Compra/FacturaCompra/'
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')

        return {
            getDataForm,
            getDataFilter,
            getAll,
            post,
            put,
            anular,
            findByProveedor,
            getId,
            queryMapper,
            getIdForInfo
        }

        function getDataForm() {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 2 }), null, true).then(
                response => {
                    if (response.code == "1") {
                        const mainData = JSON.parse(response.payload);
                        const { bodegas, configDecimales, impuestos, tiempoCredito, categoriasCompra, sustentosTributario } = mainData;

                        const estabs = fS.groupEstabBodega(bodegas);
                        const decimal = configDecimales[0];
                        const tarifasImpuesto = impuestos;
                        const tiemposCredito = tiempoCredito;
                        return {
                            estabs,
                            decimal,
                            tarifasImpuesto,
                            tiemposCredito,
                            categoriasCompra,
                            sustentosTributario
                        }

                    } else {
                        throw response;
                    }
                }
            )
        }
        function getDataFilter() {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 3 }), null, true).then(
                response => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload);
                        const { ptoEmision, estadoDocumento } = mainData;


                        let dataToGroup = {
                            estabs: ptoEmision, //Establecimientos con puntos de emision 
                        }
                        let estabs = fS.groupingEstab(dataToGroup);

                        return {
                            estabs,
                            estadosDoc: estadoDocumento.map(estado => ({
                                idEstado: estado.idEstadoPago,
                                descripcion: estado.descripcion,
                                codigo: estado.codigo
                            }))
                        }
                    }
                }
            )
        }

        function getAll(query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ ...query, tipo: 1 }), null, true).then(response => {
                if (typeof response === 'object') {
                    let { facturas } = JSON.parse(response.payload);
                    
                    return facturas.map(item => (
                        {
                            codDoc: 'FC',
                            id: item.id,
                            fechaEmision: item.fechaEmision,
                            fechaVencimiento: item.fechaVencimiento,
                            serieComprobante: item.serieComprobante,
                            identificacionProveedor: item.identificacionProveedor,
                            razonSocialProveedor: item.razonSocialProveedor,
                            importeTotal: item.importeTotal,
                            abono: item.abono,
                            saldo: item.saldo,
                            estado: item.estado,
                            usuario: item.usuario,
                            totalRecords: item.totalRecords,
                            style: item.style
                        }
                    ))
                } else {
                    throw response
                }
            })
        }

        function post(data) {
            return mS.getData('post', `${url}Insert`, { data }, true)
        }
        function put(id, data) {
            return mS.getData('put', `${url}${id}`, { data }, true)
        }

        function anular(id) {
            return mS.getData('delete', `${url}${id}`, null, true)
        }

        /**
         * Estte funcion declarada se usa en Nota Credito Proveedor, Retencion Compra
         * @param {*} idProveedor 
         * @returns 
         */
        function findByProveedor(idProveedor) {
            return mS.getData('get', url + 'FindByProveedor/' + idProveedor, null, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    let facturas = JSON.parse(response.payload) || [];
                    return {
                        code: '1',
                        payload: facturas
                    };

                }
            })
        }

        function getId(id) {
            return mS.getData('get', `${url}GetId/${id}`, null, true).then(
                response => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let [comprobanteApi, proveedorApi, detallesApi, datosAdicionalesArticuloApi, cuentaPorPagar] = JSON.parse(response.payload);

                        let comprobante = comprobanteApi[0];
                        let proveedor = proveedorApi[0];
                        cuentaPorPagar = cuentaPorPagar[0];

                        let { fechaEmision, ...restComprobante } = comprobante;
                        comprobante = {
                            idFacturaCompra: restComprobante.idFacturaCompra,
                            idSustentoTributario: restComprobante.idSustentoTributario,
                            codEstab: restComprobante.codEstab,
                            idCategoriaCompra: restComprobante.idCategoriaCompra,
                            idTiempoCredito: cuentaPorPagar.idTiempoCredito,
                            nroDocumento: restComprobante.nroDocumento,
                            nroAutorizacion: restComprobante.nroAutorizacion,
                            fechaEmision: fS.formatDate(fechaEmision),
                            fechaEmisionDocCreado: fS.formatDate(fechaEmision),
                            fechaVencimiento: fS.formatDate(cuentaPorPagar.fechaVencimiento || fechaEmision),
                            subTotalSinImpuestos: restComprobante.subTotalSinImpuestos,
                            totalDescuento: restComprobante.totalDescuento || 0,
                            porcentajeDescuento: restComprobante.porcentajeDescuento || 0,
                            propina: restComprobante.propina || 0,
                            recargo: restComprobante.recargo || 0,
                            transporte: restComprobante.transporte || 0,
                            total: restComprobante.total,
                            observacion: restComprobante.observacion,
                            puntoEmision: restComprobante.puntoEmision,
                        }

                        const detalles = detallesApi.map((item, index) => {
                            const { principal, fraccionado, etiquetas, ...restItem } = item;
                            let medidas = fS.processAndSortMeasures(principal, fraccionado);

                            let dataMedida = medidas.find(medida => medida.idMedida === restItem.idMedida);


                            let etiquetasTemp = etiquetas || [];
                            let etiquetasMapper = etiquetasTemp.map(item => ({
                                idEtiqueta: item.idEtiqueta,
                                descripcion: item.descripcion,
                                etiquetas: item.etiquetas.split(';'),
                            }))

                            return {
                                n: index + 1,
                                idFacturaCompraDetalle: restItem.idFacturaCompraDetalle,
                                idBodega: restItem.idBodega,
                                idArticulo: restItem.idArticulo,
                                idMedida: restItem.idMedida,
                                idTipoIva: restItem.idTipoIva,
                                idImpuesto: restItem.idImpuesto,
                                codigo: restItem.codigo,
                                descripcion: restItem.descripcion,
                                cantidad: restItem.cantidad,
                                precioUnitario: restItem.precioUnitario,
                                porcentajeDescuento: restItem.porcentajeDescuento,
                                valorDescuento: restItem.valorDescuento,
                                ice: restItem.ice,
                                precioTotalSinImpuesto: restItem.precioTotalSinImpuesto,
                                codigoPorcentaje: restItem.codigoPorcentaje,
                                tarifa: restItem.tarifa,
                                valorImpuesto: restItem.valorImpuesto,
                                nota: restItem.nota,
                                datosAdicionales: restItem.datosAdicionales,
                                llevaInventario: restItem.llevaInventario,
                                estado: restItem.estado,
                                conversion: dataMedida.conversion,
                                precioCosto: dataMedida.precioCosto,
                                medidas,
                                etiquetas: etiquetasMapper
                            }


                        })

                        const datosAdicionalesArticulo = datosAdicionalesArticuloApi.map(item => {
                            return {
                                idArticulo: item.idArticulo,
                                idEtiqueta: item.idEtiqueta,
                                idInfoAdicional: item.idInfoAdicional,
                                adicionales: JSON.parse(item.jsonAdicional),
                                estado: item.estado,
                            }
                        })

                        return {
                            comprobante,
                            proveedor,
                            detalles,
                            datosAdicionalesArticulo
                        }
                    }
                }
            )
        }

        /**
         * Mappeo de datos necesarios para la factura 
         * 
         * @param {*} param0 object
         * @returns object
         */
        function queryMapper(obj) {
            const { detallesDeleted, data, detalles, proveedor, datosAdicionalesArticulo } = obj;
            data.idProveedor = proveedor.idProveedor;
            const comprobanteTemp = {
                ...data,
                idProveedor: proveedor.idProveedor
            }


            const comprobanteMapper = infoComprobanteMapperTo(comprobanteTemp);
            const itemsMainMapper = detalleMapperTo(detalles);
            const itemsDeletedMapper = detalleMapperTo(detallesDeleted)

            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]

            let query = {
                infoFactura: comprobanteMapper,
                detalles: mergeItems,
                impuestos,
                artInfoAdicionales: datosAdicionalArticuloMapperTo(datosAdicionalesArticulo)
            }

            return query;
        }

        function infoComprobanteMapperTo(data) {
            const result = {
                codEstab: data.codEstab,
                idSustentoTributario: data.idSustentoTributario,
                idCategoriaCompra: data.idCategoriaCompra,
                idProveedor: data.idProveedor,
                puntoEmision: data.puntoEmision,
                nroDocumento: data.nroDocumento,
                nroAutorizacion: data.nroAutorizacion,
                idTiempoCredito: data.idTiempoCredito,
                fechaEmision: fS.formatDateTimeZone(data.fechaEmision),
                fechaVencimiento: fS.formatDateTimeZone(data.fechaVencimiento),
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                porcentajeDescuento: data.porcentajeDescuento,
                totalDescuento: data.totalDescuento,
                propina: data.propina || 0,
                recargo: data.recargo || 0,
                transporte: data.transporte || 0,
                total: data.total,
                observacion: data.observacion || null,
            }
            return result;
        }

        function detalleMapperTo(detalles) {
            let tempDetail = [];
            let orderIndex = 0;
            for (let item of detalles) {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                const obj = {
                    idFacturaCompraDetalle: item.idFacturaCompraDetalle,
                    orderIndex: orderIndex + 1,
                    idArticulo: item.idArticulo,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    ice: item.ice,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    valorDescuento: item.valorDescuento,
                    porcentajeDescuento: item.porcentajeDescuento,
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa,
                    valorImpuesto: item.valorImpuesto,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                    nota: item.nota,
                    descripcion: item.descripcion,
                    llevaInventario: item.llevaInventario,
                    cantidadTransaccion: cantidadTransaccion,
                    estado: item.estado
                }

                tempDetail.push(obj);
            }
            return tempDetail;
        }

        function datosAdicionalArticuloMapperTo(datosAdicionalesArticulo) {
            let results = datosAdicionalesArticulo.map(obj => {
                return {
                    idInfoAdicional: obj.idInfoAdicional || 0,
                    idArticulo: obj.idArticulo,
                    idEtiqueta: obj.idEtiqueta,
                    jsonAdicional: obj.adicionales
                }
            })
            return results;
        }



        function getIdForInfo(id) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ id, tipo: 5 }), null, true).then(
                response => {
                    const mainData = JSON.parse(response.payload);
                    let { infoFactura, proveedor, tiempoCredito, detalles, impuestos } = mainData;

                    let comprobante = infoFactura[0];
                    let { fechaEmision, ...restComprobante } = comprobante;
                    tiempoCredito = tiempoCredito[0];
                    comprobante = {
                        idFacturaCompra: restComprobante.idFacturaCompra,
                        categoriaCompra: restComprobante.categoriaCompra,
                        sustentoTributario: restComprobante.sustentoTributario,
                        establecimiento: restComprobante.nombreComercial,
                        nroDocumento: restComprobante.nroDocumento,
                        nroAutorizacion: restComprobante.nroAutorizacion,
                        tiempoCredito: tiempoCredito.tiempoCredito,
                        fechaEmision: fS.formatDate(fechaEmision),
                        fechaVencimiento: fS.formatDate(tiempoCredito.fechaVencimiento),
                        subTotalSinImpuestos: restComprobante.subTotalSinImpuestos,
                        totalDescuento: restComprobante.totalDescuento,
                        porcentajeDescuento: restComprobante.porcentajeDescuento,
                        propina: restComprobante.propina,
                        recargo: restComprobante.recargo,
                        transporte: restComprobante.transporte,
                        total: restComprobante.total,
                        observacion: restComprobante.observacion,
                        puntoEmision: restComprobante.puntoEmision,
                    }
                    proveedor = proveedor[0];

                    detalles = detalles.map((item, index) => {
                        return {
                            n: index + 1,
                            idFacturaCompraDetalle: item.idFacturaCompraDetalle,
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            cantidad: item.cantidad,
                            precioUnitario: item.precioUnitario,
                            porcentajeDescuento: item.porcentajeDescuento,
                            valorDescuento: item.valorDescuento,
                            ice: item.ice,
                            precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                            codigoPorcentaje: item.codigoPorcentaje,
                            tarifa: item.tarifa,
                            valorImpuesto: item.valorImpuesto,
                            nota: item.nota,
                            bodega: item.bodega,
                            tipoIva: item.tipoIva,
                            medida: item.medida,
                        }
                    })

                    return {
                        comprobante,
                        proveedor: {
                            ...proveedor,
                            nombreProveedor: proveedor.nombreFiscal
                        },
                        detalles,
                        tarifasImpuesto: impuestos
                    }
                }
            )
        }
    })





    /**
     * 
     * COMPRA NO HABITUAL 
     * 
     */

    app.factory('compraNoHabitualService', function ($injector) {

        let url = 'Compra/CompraNoHabitual/'
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');

        return {
            getDataForm,
            getDataFilter,
            getAll,
            generateSerieComprobante,
            queryMapper,
            post,
            getId,
            put,
            anular,
            getIdForInfo
        }

        function getDataForm() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ typeList: 2 })}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload) || [];
                    
                    const { configDecimales, estab, impuestos, ptoEmi, tiempoCredito } = results;


                    let dataToGroup = {
                        estabs: ptoEmi, //Establecimientos con puntos de emision
                        bodegas: estab, // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
                    let decimal = configDecimales[0];
                    let tarifasImpuesto = impuestos;

                    return {
                        estabs,
                        decimal,
                        tarifasImpuesto,
                        tiemposCredito: tiempoCredito
                    }
                }
            })
        }

        function getDataFilter() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ typeList: 5 })}`, null, true).then(response => {

                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload) || [];
                    const { ptoEmision, estadoDocumento } = results;

                    let dataToGroup = {
                        estabs: ptoEmision, //Establecimientos con puntos de emision 
                    }
                    let estabs = fS.groupingEstab(dataToGroup);

                    return {
                        estabs,
                        estadosDoc: estadoDocumento
                    }

                }
            })
        }

        function getAll(query) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ ...query, typeList: 1 })}`, null, true).then(response => {

                if (typeof response === 'object') {
                    const { documentos } = JSON.parse(response.payload);
                    
                    return documentos.map(item => ({
                        codDoc: 'CNH',
                        id: item.id,
                        serieComprobante: item.serieComprobante,
                        fechaEmision: item.fechaEmision,
                        razonSocialProveedor: item.razonSocialProveedor,
                        importeTotal: item.importeTotal,
                        estado: item.estado,
                        usuario: item.usuario,
                        colorRow: item.colorRow,
                        codEstado: item.codEstado,
                        isUpdate: item.codEstado === 'PE',
                        isDelete: item.codEstado === 'PE',
                        totalRecords: item.totalRecords
                    }))
                }
                return [];
            })
        }

        function generateSerieComprobante(query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ ...query, typeList: 3 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let { serieComprobante } = JSON.parse(response.payload);
                    let data = serieComprobante[0];
                    return data.serieComprobante;
                }
            })
        }

        function queryMapper(obj) {
            const { comprobante, detalles, detallesDeleted, datosAdicionalesArticulo } = obj;

            const comprobanteMapper = infoComprobanteMapperTo(comprobante);
            const itemsMainMapper = detalleMapperTo(detalles);
            const itemsDeletedMapper = detalleMapperTo(detallesDeleted)

            const impuestos = fS.impuestoTarifaMapperTo(detalles);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]
            return {
                comprobante: comprobanteMapper,
                detalles: mergeItems,
                impuestos,
                artInfoAdicionales: dataAdicionalMapTo(datosAdicionalesArticulo)
            }
        }


        function infoComprobanteMapperTo(data) {
            const result = {
                idProveedor: data.idProveedor,
                idPuntoEmision: data.idPuntoEmision,
                fechaEmision: fS.formatDateTimeZone(data.fechaEmision),
                totalSinImpuestos: data.subTotalSinImpuestos,
                porcentajeDescuento: data.porcentajeDescuento,
                descuento: data.totalDescuento,
                importeTotal: data.total,
                observacion: data.observacion || null,
            }
            return result;
        }

        function detalleMapperTo(items) {
            let tempDetail = [];
            let orderIndex = 0;
            for (let item of items) {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                const obj = {
                    idDocumentoIngresoDetail: item.idDocumentoIngresoDetail,
                    orderIndex: orderIndex + 1,
                    idArticulo: item.idArticulo,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    ice: item.ice,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    descuento: item.valorDescuento,
                    porcentajeDescuento: item.porcentajeDescuento,
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa,
                    valorImpuesto: item.valorImpuesto,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                    nota: item.nota,
                    descripcion: item.descripcion,
                    llevaInventario: item.llevaInventario,
                    cantidadTransaccion: cantidadTransaccion,
                    estado: item.estado
                }

                tempDetail.push(obj);
            }
            return tempDetail;
        }


        function post(data) {
            return mS.getData('post', `${url}Insert`, { data }, true)
        }
        function getId(id) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ typeList: 4, id })}`, null, true).then(
                response => {
                    if (response.code == "0") {
                        throw response
                    }
                    if (response.code === "1") {
                        const mainData = JSON.parse(response.payload);
                        
                        let { comprobante, proveedor, detalles, infoAdicional } = mainData;
                        comprobante = comprobante[0];
                        proveedor = proveedor[0];


                        comprobante = {
                            idDocumentoIngreso: comprobante.idDocumentoIngreso,
                            idEstablecimiento: comprobante.idEstablecimiento,
                            idPuntoEmision: comprobante.idPuntoEmision,
                            codEstab: comprobante.codEstab,
                            ptoEmi: comprobante.ptoEmi,
                            nombreComercial: comprobante.nombreComercial,
                            secuencial: comprobante.secuencial,
                            fechaEmision: fS.formatDate(comprobante.fechaEmision),
                            subTotalSinImpuestos: comprobante.subTotalSinImpuestos,
                            totalDescuento: comprobante.descuento,
                            porcentajeDescuento: comprobante.porcentajeDescuento || 0,
                            total: comprobante.total,
                            observacion: comprobante.observacion,
                        }



                        detalles = detalles.map((item, index) => {
                            const { fraccionado, principal, etiqueta, ...restItem } = item;

                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};

                            let etiquetasTemp = JSON.parse(etiqueta) || [];
                            
                            let etiquetasMapper = etiquetasTemp.map(item => ({
                                idEtiqueta: item.idEtiqueta,
                                descripcion: item.descripcion,
                                etiquetas: item.etiquetas.split(';'),
                            }))

                            let porcentaje = restItem.descuento / restItem.precioUnitario;
                            let porcentajeDescuento = porcentaje * 100;
                            return {
                                n: index + 1,
                                idDetalle: restItem.idDetalle,
                                idDocumentoIngresoDetail: restItem.idDocumentoIngresoDetail,
                                idArticulo: restItem.idArticulo,
                                idMedida: restItem.idMedida,
                                idBodega: restItem.idBodega,
                                idImpuesto: restItem.idImpuesto,
                                idTipoIva: restItem.idTipoIva,
                                codigo: restItem.codigo,
                                descripcion: restItem.descripcion,
                                cantidad: restItem.cantidad,
                                precioUnitario: restItem.precioUnitario,
                                valorDescuento: restItem.descuento,
                                precioTotalSinImpuesto: restItem.precioTotalSinImpuesto,
                                codigoPorcentaje: restItem.codigoPorcentaje,
                                porcentajeDescuento: porcentajeDescuento || 0,
                                tarifa: restItem.tarifa,
                                valorImpuesto: restItem.valorImpuesto,
                                datosAdicionales: restItem.datosAdicionales,
                                llevaInventario: restItem.llevaInventario,
                                estado: restItem.estado,
                                ice: restItem.ice || 0,
                                medidas,
                                conversion: dataMedida.conversion | 1,
                                etiquetas: etiquetasMapper,
                            }

                        })

                        return {
                            comprobante,
                            proveedor,
                            detalles,
                            infoAdicionalDocumento: infoAdicional
                        }

                    }
                }
            )
        }

        function put(id, data) {
            return mS.getData('put', `${url}${id}`, { data }, true)
        }

        function anular(id) {
            return mS.getData('delete', `${url}${id}`, null, true)
        }

        function getIdForInfo(id) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ id, typeList: 6 })}`, null, true).then(
                response => {
                    let mainData = JSON.parse(response.payload);
                    
                    let { comprobante, proveedor, detalles, impuestos } = mainData;
                    comprobante = comprobante[0];
                    proveedor = proveedor[0]

                    proveedor = {
                        ...proveedor,
                        nombreProveedor: proveedor.nombreFiscal
                    } 

                    comprobante = {
                        idDocumentoIngreso: comprobante.idDocumentoIngreso,
                        nombreComercial: comprobante.nombreComercial,
                        fechaEmision: fS.formatDate(comprobante.fechaEmision),
                        totalSinImpuestos: comprobante.totalSinImpuestos,
                        establecimiento: comprobante.nombreComercial,
                        estab: comprobante.estab,
                        ptoEmi: comprobante.ptoEmi,
                        secuencial: comprobante.secuencial,
                        descuento: comprobante.descuento,
                        porcentajeDescuento: comprobante.porcentajeDescuento,
                        importeTotal: comprobante.importeTotal,
                        observacion: comprobante.observacion,
                    }

                    detalles = detalles.map((item, index) => {
                        let porcentaje = item.descuento / item.precioUnitario;
                        let porcentajeDescuento = porcentaje * 100;
                        return {
                            n: index + 1,
                            idDocumentoIngresoDetail: item.idDocumentoIngresoDetail,
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            cantidad: item.cantidad,
                            precioUnitario: item.precioUnitario,
                            valorDescuento: item.descuento,
                            precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                            codigoPorcentaje: item.codigoPorcentaje,
                            tarifa: item.tarifa,
                            valorImpuesto: item.valorImpuesto,
                            bodega: item.bodega,
                            tipoIva: item.tipoIva,
                            medida: item.medida,
                            porcentajeDescuento: porcentajeDescuento,
                            ice: item.valorIce || 0
                        }
                    })
                    return {
                        comprobante,
                        proveedor,
                        detalles,
                        tarifasImpuesto: impuestos
                    }
                }
            )
        }

        function dataAdicionalMapTo(datosAdicionales) {

            return datosAdicionales.map(item => {
                return {
                    idArticulo: item.idArticulo,
                    idEtiqueta: item.idEtiqueta,
                    idInfoAdicional: item.idInfoAdicional || 0,
                    jsonAdicional: JSON.stringify(item.adicionales)
                }
            });
        }


    })

})(window.angular);
