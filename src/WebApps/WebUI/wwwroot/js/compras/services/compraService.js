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
                        console.log(proveedores)
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
                console.log(response)
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
            queryMapper
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
                        console.log(mainData)
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
                if (typeof response === 'object' && "facturas" in response) {
                    let { facturas } = JSON.parse(response.payload)

                    return facturas.map(item => (
                        {
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
            // let query = JSON.stringify({
            //     idDocumentoIngreso: id,
            //     typeList: 4
            // })
            // return mS.getData('get', url + query, null, true).then(response=>{
            //     if(response.code==='0'){
            //         throw response;
            //     }
            //     if(response.code==='1'){
            //         let dataRepository = JSON.parse(response.payload);

            //         let comprobante = dataRepository[0][0];
            //         let proveedor = dataRepository[1][0];
            //         let detalles = dataRepository[2];
            //         let taxes = dataRepository[3];
            //         let bodegas = dataRepository[4];
            //         let decimal = dataRepository[5][0];
            //         let tipoIvas = dataRepository[6];
            //         let inventario = dataRepository[7][0];

            //         console.log(dataRepository)
            //         let datosAdicionales = dataRepository[8].map(item=>{
            //             if(typeof item.info=='string'){
            //                 item.info = JSON.parse(item.info).map(item=>{
            //                     let adicionales = JSON.parse(item.adicionales)
            //                     return {
            //                         ...item,
            //                         adicionales
            //                     }
            //                 })
            //             }
            //             return item;
            //         })

            //        console.log(datosAdicionales)
            //         return {
            //             comprobante,
            //             proveedor,
            //             detalles,
            //             taxes,
            //             bodegas,
            //             decimal,
            //             tipoIvas,
            //             inventario,
            //             datosAdicionales: datosAdicionales[0]
            //         }
            //     }
            // })
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
                factura: comprobanteMapper,
                detalle: mergeItems,
                impuestos,
                artInfoAdicionales: datosAdicionalArticuloMapperTo(datosAdicionalesArticulo)
            }

            return JSON.stringify(query)
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
    })

})(window.angular);
