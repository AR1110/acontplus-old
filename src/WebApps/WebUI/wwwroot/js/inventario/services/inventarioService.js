//@ts-check
(function () {
    "use strict";

    app.factory("familiaService", function ($injector) {
        let url = "Inventario/Familia/";
        let mS = $injector.get("mainService");
        let service = {};

        service.getAll = function (query) {
            return mS
                .getData("get", url + "Get?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let familias = JSON.parse(response.payload) || [];
                        return familias.map((item) => ({
                            idFamilia: item.idFamilia,
                            descripcion: item.descripcion,
                            siglas: item.siglas,
                            estado: item.estado,
                            totalRecords: item.totalRecords,
                        }));
                    }
                });
        };

        service.save = function (data) {
            return mS.getData("post", url + "Insert", { data }, true);
        };

        service.update = function (id, data) {
            return mS.getData("put", url + "Update/" + id, { data }, true);
        };

        service.delete = function (id) {
            return mS.getData("delete", url + "Delete/" + id, null, true);
        };

        return service;
    });

    /**
     * SubFamilias
     */
    app.factory("subFamiliaService", function ($injector) {
        let url = "Inventario/SubFamilia/";
        let mS = $injector.get("mainService");
        let service = {};

        service.getAll = function (query) {
            return mS
                .getData("get", url + "?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let subFamilias = JSON.parse(response.payload) || [];

                        return subFamilias.map((item) => ({
                            idSubFamilia: item.idSubFamilia,
                            idFamilia: item.idFamilia,
                            descripcion: item.descripcion,
                            estado: item.estado,
                            siglas: item.siglas,
                            codigo: item.codigo,
                            subcategoryPhotoId: item.subcategoryPhotoId,
                            s3ObjectUrl: item.s3ObjectUrl,
                            s3ObjectKey: item.s3ObjectKey,
                            montoObjetivo: item.montoObjetivo,
                            nombreFamilia: item.nombreFamilia,
                            totalRecords: item.totalRecords,
                            ultimoSecuencial: item.ultimoSecuencial,
                        }));
                    }
                });
        };

        service.save = function (file, data) {
            const spParams = {
                idFamilia: data.idFamilia,
                descripcion: data.descripcion,
                montoObjetivo: data.montoObjetivo,
                siglas: data.siglas,
            };
            return mS.getDataFile(
                url + "?json=" + JSON.stringify(spParams),
                file,
                null,
                true
            );
        };

        service.update = function (id, data) {
            let spParams = {
                idFamilia: data.idFamilia,
                descripcion: data.descripcion,
                montoObjetivo: data.montoObjetivo,
                estado: data.estado,
                secuencial: data.ultimoSecuencial || 0,
            };
            return mS.getData(
                "PUT",
                url + `${id}/?json=${JSON.stringify(spParams)}`,
                null,
                true
            );
        };

        service.delete = function (id) {
            return mS.getData("delete", url + id, null, true);
        };

        service.listForSelect = function (query) {
            return mS
                .getData("get", url + "ListForSelect?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let subFamilias = JSON.parse(response.payload) || [];
                        return subFamilias.map((item) => ({
                            idFamilia: item.idFamilia,
                            descripcion: item.descripcion,
                        }));
                    }
                });
        };

        return service;
    });

    /**
     * Marcas
     */
    app.factory("marcaService", function ($injector) {
        let url = "Inventario/Marca/";
        let mS = $injector.get("mainService");
        let service = {};

        service.getAll = function (query) {
            return mS
                .getData("get", url + "?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let marcas = JSON.parse(response.payload) || [];

                        return marcas.map((item) => ({
                            idMarca: item.idMarca,
                            descripcion: item.descripcion,
                            estado: item.estado,
                            codigo: item.codigo,
                            totalRecords: item.totalRecords,
                        }));
                    }
                });
        };

        service.save = function (data) {
            return mS.getData("post", url, { data }, true);
        };

        service.update = function (id, data) {
            return mS.getData("put", url + id, { data }, true);
        };

        service.delete = function (id) {
            return mS.getData("delete", url + id, null, true);
        };

        service.listForSelect = function (query) {
            return mS
                .getData("get", url + "ListForSelect?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let marcas = JSON.parse(response.payload) || [];

                        return marcas.map((item) => ({
                            idMarca: item.idMarca,
                            descripcion: item.descripcion,
                        }));
                    }
                });
        };

        return service;
    });

    /**
     * Modelos
     */
    app.factory("modeloService", function ($injector) {
        let url = "Inventario/Modelo/";
        let mS = $injector.get("mainService");
        let service = {};

        service.getAll = function (query) {
            return mS
                .getData("get", url + "?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let modelos = JSON.parse(response.payload) || [];

                        return modelos.map((item) => ({
                            idModelo: item.idModelo,
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            estado: item.estado,
                            idMarca: item.idMarca,
                            marca: item.marca,
                            totalRecords: item.totalRecords,
                        }));
                    }
                });
        };

        service.save = function (data) {
            return mS.getData("post", url, { data }, true);
        };

        service.update = function (id, data) {
            return mS.getData("put", url + id, { data }, true);
        };

        service.delete = function (id) {
            return mS.getData("delete", url + id, null, true);
        };

        return service;
    });

    /**
     * Modelos
     */
    app.factory("medidaService", function ($injector) {
        let url = "Inventario/Measure/";
        let mS = $injector.get("mainService");
        let service = {};

        service.getAll = function (query) {
            return mS
                .getData("get", url + "?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let medidas = JSON.parse(response.payload) || [];

                        return medidas.map((item) => ({
                            idMedida: item.idMedida,
                            descripcion: item.descripcion,
                            estado: item.estado,
                            codigo: item.codigo,
                            totalRecords: item.totalRecords,
                        }));
                    }
                });
        };

        service.save = function (data) {
            return mS.getData("post", url, { data }, true);
        };

        service.update = function (id, data) {
            return mS.getData("put", url + id, { data }, true);
        };

        service.delete = function (id) {
            return mS.getData("delete", url + id, null, true);
        };

        return service;
    });

    /**
     * Modelos
     */
    app.factory("tarifaService", function ($injector) {
        let url = "Inventario/Tarifa/";
        let mS = $injector.get("mainService");
        let service = {};

        service.getAll = function (query) {
            return mS
                .getData("get", url + "?json=" + JSON.stringify(query))
                .then((response) => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let tarifas = JSON.parse(response.payload) || [];

                        return tarifas.map((item) => ({
                            idTarifa: item.idTarifa,
                            descripcion: item.descripcion,
                            codigo: item.codigo,
                            predeterminada: item.predeterminada,
                            estado: item.estado,
                            ventaPorMayor: item.ventaPorMayor,
                            totalRecords: item.totalRecords,
                        }));
                    }
                });
        };

        service.save = function (data) {
            return mS.getData("post", url + "Insert", data, true);
        };

        service.update = function (id, data) {
            return mS.getData(
                "put",
                url + id + "?json=" + JSON.stringify(data),
                null,
                true
            );
        };

        service.delete = function (id) {
            return mS.getData("delete", url + "Delete/" + id, null, true);
        };

        return service;
    });

    app.factory("TransaccionService", function ($injector) {
        let mS = $injector.get("mainService");
        let fS = $injector.get("formulario");
        let URL = "Inventario/Transaccion/";
        let service = {};

        service.get = (params) => {
            let json = JSON.stringify({ ...params, tipo: 2 });
            return mS.getData("get", URL + "?json=" + json).then((response) => {
                return {
                    dataArticulo: response.dataArticulo[0],
                    kardex: response.kardex,
                };
            });
        };

        service.getDataFilters = () => {
            return mS
                .getData("get", URL + "?json=" + JSON.stringify({ tipo: 3 }))
                .then((response) => {
                    return {
                        estabs: fS.groupEstabBodega(response.bodegas),
                        tiposTransaccion: response.tipoTransaccion,
                    };
                });
        };
        return service;
    });

    app.factory("subcategoryPhotoService", subcategoryPhotoService);

    subcategoryPhotoService.$inject = ["mainService"];

    function subcategoryPhotoService(mS) {
        let service = {};
        let url = "Inventario/SubcategoryPhoto/";
        function _get() { }
        function _post({ subcategoryId, file }) {
            return mS.uploadFile({ url: `${url}${subcategoryId}`, file });
        }
        function _update({ id, data = null, file }) {
            return mS.uploadFile({ url: `${url}Put/${id}?json=${data}`, file });
        }
        function _delete(id) { }
        service.get = _get;
        service.post = _post;
        service.update = _update;
        service.delete = _delete;
        return service;
    }
})(window.angular);

/**
 * CONSOLIDACION INVENTARIO
 *
 */

(function () {
    "use strict";
    app.factory("consolidacionInvService", [
        "$injector",
        function ($injector) {
            const mS = $injector.get("mainService");
            const fS = $injector.get("formulario");
            const url = "Inventario/Consolidacion/";

            return {
                getDataForm,
                getAll,
                getByIdForEditOrderProduction,
                getDetailByIdForCancel,
                getProducts,
                getProductsValidateImport,
                generateSerieComprobante,
                mapTo,
                post,
                getId,
                getInfoById,
                put,
                anular,
            };

            function getDataForm() {
                const json = JSON.stringify({ tipo: 2 });
                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    const data = {
                        estabs: [],
                        subFamilias: [],
                        config: {},
                        tipoDocumento: [],
                        tiposMovimiento: [],
                    };
                    if (response !== null && typeof response === "object") {
                        const {
                            ptoEmision,
                            bodegas,
                            subFamilia,
                            decimales,
                            tipoMovimientos,
                            tipoDocumento,
                        } = response;
                        const dataToGroup = {
                            estabs: ptoEmision,
                            bodegas: bodegas,
                            isGroupBodega: true,
                        };
                        data.estabs = fS.groupingEstab(dataToGroup);
                        data.subFamilias = subFamilia;
                        data.decimal = decimales[0];
                        data.tipoDocumento = tipoDocumento;
                        data.tiposMovimiento = tipoMovimientos;
                    }
                    return data;
                });
            }

            function getAll(obj) {
                const json = JSON.stringify({
                    ...obj,
                    tipo: 1,
                });
                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    let consolidaciones = [];
                    const results = {
                        data: [],
                        totalRecords: 0,
                        total: 0,
                    };
                    if (response !== null && typeof response === "object") {
                        consolidaciones = response.consolidaciones;
                    }
                    results.data = consolidaciones.map((item) => {
                        return {
                            id: item.idConsolidacionInventario,
                            fechaEmision: item.fechaEmision,
                            observacion: item.observacion,
                            total: item.total,
                            nroDoc: item.nroDoc,
                            nombreEstado: item.estadoDoc,
                            codEstado: item.codEstado,
                            nombreUsuario: item.usuario,
                            rowStyle: item.style,
                            nombreTipoDoc: item.tipoDocumento,
                            codDoc: item.codDoc,
                            totalRecords: item.totalRecords,
                        };
                    });

                    const total = consolidaciones
                        .map((val) => val.total)
                        .reduce((acc, curr) => acc + curr, 0);

                    results.totalRecords =
                        consolidaciones.length > 0 ? consolidaciones[0].totalRecords : 0;
                    results.total = fS.roundNumber(total, 5);
                    return results;
                });
            }

            function getByIdForEditOrderProduction(id) {
                const json = JSON.stringify({
                    id,
                    tipo: 7,
                });

                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    const results = {
                        comprobante: {},
                        detalles: [],
                    };
                    if (response !== null && typeof response === "object") {
                        const {
                            fechaEmision,
                            idConsolidacionInventario: id,
                            idTipoDocumento,
                            observacion,
                            total,
                            idPuntoEmision,
                            codEstab,
                        } = response.comprobante[0];



                        results.comprobante = {
                            id,
                            idTipoDocumento,
                            fechaEmision: fS.formatDate(fechaEmision),
                            fechaEmisionDocCreado: fS.formatDate(fechaEmision),
                            observacion,
                            total,
                            idPuntoEmision,
                            codEstab,
                        };

                        const components = response.components.map(item => {
                            const {
                                fraccionado,
                                principal,
                                idConsolidacionInventarioDetalle: id,
                                idBodega,
                                idArticulo,
                                idMedida,
                                descripcion,
                                cantidad,
                                precioCosto,

                                precioUnitario,
                                codigo,
                                stock,
                                estado,
                                menuId,
                                uniqueId
                            } = item;
                            const total = fS.roundNumber(cantidad * precioUnitario, 5);

                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            const dataMedida = medidas.find(
                                (m) => m.idMedida === idMedida
                            );
                            let precioCostoFraccionado = 0,
                                conversion = 1,
                                nombreMedida;
                            if (dataMedida) {
                                precioCostoFraccionado = dataMedida.precioCostoFraccionado;
                                conversion = dataMedida.conversion;
                                nombreMedida = dataMedida.descripcion
                            }
                            return {
                                id,
                                idBodega,
                                idArticulo,
                                idMedida,
                                descripcion,
                                cantidad,
                                precioCosto,
                                precioUnitario,
                                precioCostoFraccionado,
                                codigo,
                                stock,
                                estado,
                                conversion,
                                medidas,
                                menuId,
                                total,
                                nombreMedida,
                                uniqueId
                            };


                        })

                        results.detalles = response.menus.map((item) => {

                            const {
                                fraccionado,
                                principal,
                                idConsolidacionInventarioDetalle: id,
                                idBodega,
                                idArticulo,
                                idMedida,
                                descripcion,
                                cantidad,
                                precioCosto,

                                precioUnitario,
                                codigo,
                                stock,
                                estado,
                                menuId,
                                uniqueId
                            } = item;
                            const total = fS.roundNumber(cantidad * precioUnitario, 5);

                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            const dataMedida = medidas.find(
                                (m) => m.idMedida === idMedida
                            );
                            let precioCostoFraccionado = 0,
                                conversion = 1,
                                nombreMedida;
                            if (dataMedida) {
                                precioCostoFraccionado = dataMedida.precioCostoFraccionado;
                                conversion = dataMedida.conversion;
                                nombreMedida = dataMedida.descripcion;
                            }
                            return {
                                id,
                                idBodega,
                                idArticulo,
                                idMedida,
                                descripcion,
                                cantidad,
                                precioCosto,
                                precioUnitario,
                                precioCostoFraccionado,
                                codigo,
                                stock,
                                estado,
                                conversion,
                                medidas,
                                menuId,
                                total,
                                nombreMedida,
                                components: components.filter(c => c.uniqueId === uniqueId)
                            };
                        });
                    }
                    return results;
                });
            }

            function getDetailByIdForCancel(id) {
                const json = JSON.stringify({
                    id,
                    tipo: 8,
                });
                return mS.getData("get", `${url}?json=${json}`).then(response => {
                    const results = {
                        detalles: []
                    };
                    if (response !== null && typeof response === "object") {
                        results.detalles = (response.detalles).map((d, index) => {
                            return {
                                orderIndex: index + 1,
                                "idArticulo": d.idArticulo,
                                "idBodega": d.idBodega,
                                "idMedida": d.idMedida,
                                "cantidad": d.cantidad,
                                "precioUnitario": d.precioUnitario,
                                "precioCosto": d.precioCosto,
                                "total": d.total,
                                "estado": d.estado,
                                "cantidadTransaccion": d.cantidadTransaccion * (-1),
                                "conversion": d.conversion,
                                "precioCostoFraccionado": d.precioCostoFraccionado,
                                "idTransaccion": d.idTransaccion,
                                "movementTypeId": d.movementTypeId,
                            }

                        })
                        return results;
                    }

                    throw new Error("Error get detail by id for cancel")


                })
            }

            function mappedProductImportacion(products) {
                return products.map((item) => {
                    const { principal, fraccionado, ...restItem } = item;
                    const medidas = fS.processAndSortMeasures(principal, fraccionado);

                    const dataMedida = medidas.find(
                        (m) => m.idMedida === restItem.idMedida
                    );

                    return {
                        idArticulo: restItem.idArticulo,
                        codigo: restItem.codigo,
                        codigoAuxiliar: restItem.codigoAuxiliar,
                        codigoBarra: restItem.codigoBarra,
                        descripcion: restItem.descripcion,
                        stock: restItem.stock,
                        precioCosto: restItem.precioCosto,
                        // precioUnitario: restItem.precioUnitario,

                        // precioCosto: dataMedida.precioCosto,
                        precioUnitario: dataMedida.precioUnitario,
                        precioActual: dataMedida.precioActual,
                        precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                        estado: restItem.estado,
                        iva: restItem.iva,
                        cantidad: restItem.cantidad,
                        llevaInventario: restItem.llevaInventario,
                        idMedida: restItem.idMedida,
                        medida: restItem.medida,
                        nombreTipoIva: restItem.nombreTipoIva,
                        medidas,
                        conversion: dataMedida.conversion,
                        totalRecords: restItem.totalRecords,
                    };
                });
            }

            function getProducts(obj) {
                const json = JSON.stringify({
                    ...obj,
                    tipo: 4,
                });
                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    let articulos = [];
                    if (response !== null && typeof response === "object") {
                        let mainData = response.articulos;

                        articulos = mappedProductImportacion(mainData);
                    }
                    return { articulos };
                });
            }

            function getProductsValidateImport(obj) {
                // let data = {
                //     ...obj,
                //     tipo: 6
                // }

                // return mS.getData('post', `${url}Importacion`, {data}, true).then(response=>{
                //     let articulos = [];
                //     let noVinculados=[]

                //     if (response !== null && typeof response === 'object') {
                //         let mainData = response.articulos;

                //         articulos = mappedProductImportacion(mainData);

                //         noVinculados = response.noVinculados || [];

                //     }
                //     return {
                //         articulos,
                //         noVinculados
                //      };
                // })

                const data = {
                    jsonParams: JSON.stringify(obj),
                };

                return mS
                    .getData("post", "Config/Importacion/GetValidation/EX", data)
                    .then((response) => {
                        let resultData = {
                            noVinculados: [],
                            articulos: [],
                        };
                        if (response.code === "1") {
                            let mainData = JSON.parse(response.payload);
                            let { articulos, noVinculados } = mainData[0];
                            resultData.noVinculados = noVinculados;
                            resultData.articulos = mappedProductImportacion(articulos);
                        }
                        return resultData;
                    });
            }

            function generateSerieComprobante(obj) {
                const json = JSON.stringify({
                    ...obj,
                    tipo: 5,
                });
                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    let serieComprobante = null;
                    if (response !== null && typeof response === "object") {
                        serieComprobante = response.serieComprobante[0].serieComprobante;
                    }
                    return serieComprobante;
                });
            }

            function mapTo(obj) {
                const {
                    data,
                    detalles,
                    itemsDeleted,
                    withNegative
                } = obj;

                const consolidacion = headerTo(data);
                const resultsItemsDeleted = detalleTo(
                    itemsDeleted,
                    withNegative
                );
                const resultsDetalle = detalleTo(
                    detalles,
                    withNegative
                );
                const components = detalles.map((item) => (item.components || [])).flat();
                const componentsMapped = componenteDetalleTo(
                    components,
                );
                let mergeDetalles = [
                    ...resultsDetalle,
                    ...componentsMapped,
                    ...resultsItemsDeleted,
                ];
                return {
                    consolidacion,
                    detalles: mergeDetalles,
                };
            }

            function headerTo(data) {
                return {
                    idPuntoEmision: data.idPuntoEmision,
                    idTipoDocumento: data.idTipoDocumento,
                    idTipoTransaccion: data.idTipoTransaccion,
                    fechaEmision: fS.formatDateMoment(data.fechaEmision),
                    total: fS.roundNumber(data.total, 5),
                    observacion: fS.isValidField(data.observacion),
                };
            }

            function detalleTo(detalles, withNegative) {
                let results = detalles.map((item, index) => {
                    let conversion = item.conversion || 1;
                    let cantidadTransaccion = fS.roundNumber(
                        item.cantidad * conversion,
                        5
                    );
                    cantidadTransaccion = withNegative ? (cantidadTransaccion) : (+cantidadTransaccion);

                    return {
                        idConsolidacionInventarioDetalle: item.id,
                        orderIndex: index + 1,
                        idArticulo: item.idArticulo,
                        idBodega: item.idBodega,
                        idMedida: item.idMedida,
                        cantidad: item.cantidad,
                        conversion,
                        cantidadTransaccion,
                        precioUnitario: item.precioUnitario,
                        precioCosto: item.precioCosto,
                        precioCostoFraccionado: item.precioCostoFraccionado,
                        total: fS.roundNumber(item.total, 5),
                        nota: fS.isValidField(item.nota),
                        descripcion: item.descripcion,
                        estado: item.estado,
                        movementTypeId: item.movementTypeId,
                        uniqueId: item.uniqueId
                    };
                });
                return results;
            }

            function componenteDetalleTo(components) {
                return components.map((item, index) => {
                    let cantidadTransaccion = fS.roundNumber(
                        item.cantidad * item.conversion,
                        5
                    );
                    let total = fS.roundNumber(item.cantidad * item.precioUnitario, 5);

                    return {
                        idConsolidacionInventarioDetalle: item.id,
                        orderIndex: index + 1,
                        idArticulo: item.idArticulo,
                        idBodega: item.idBodega,
                        idMedida: item.idMedida,
                        cantidad: cantidadTransaccion,
                        conversion: item.conversion,
                        cantidadTransaccion: (-cantidadTransaccion),
                        precioUnitario: item.precioUnitario,
                        precioCosto: item.precioCosto,
                        precioCostoFraccionado: item.precioCostoFraccionado,
                        total,
                        nota: fS.isValidField(item.nota),
                        descripcion: item.descripcion,
                        estado: item.estado,
                        movementTypeId: item.movementTypeId,
                        uniqueId: item.uniqueId

                    };
                });
            }

            function post(data) {
                return mS.getData("post", `${url}`, { data }, true);
            }

            function getId(id) {
                return mS.getData("get", `${url}GetId/${id}`).then((response) => {
                    const data = {
                        comprobante: {},
                        detalles: [],
                    };
                    if (response !== null && typeof response === "object") {
                        const comprobanteTemp = response.comprobante[0];
                        const detallesTemp = response.detalles;

                        data.comprobante = {
                            ...comprobanteTemp,
                            id: comprobanteTemp.idConsolidacionInventario,
                            fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                            fechaEmisionDocCreado: fS.formatDate(
                                comprobanteTemp.fechaEmision
                            ),
                        };

                        data.detalles = detallesTemp.map((item) => {
                            const { fraccionado, principal, ...restItem } = item;

                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            const dataMedida = medidas.find(
                                (m) => m.idMedida === restItem.idMedida
                            );
                            let precioCostoFraccionado = 0,
                                conversion = 1;
                            if (dataMedida) {
                                restItem.conversion = dataMedida.conversion;
                                restItem.medidas = medidas;
                                precioCostoFraccionado = dataMedida.precioCostoFraccionado;
                                conversion = dataMedida.conversion;
                            }
                            return {
                                id: restItem.idConsolidacionInventarioDetalle,
                                idBodega: restItem.idBodega,
                                idArticulo: restItem.idArticulo,
                                idMedida: restItem.idMedida,
                                descripcion: restItem.descripcion,
                                cantidad: restItem.cantidad,
                                precioCosto: restItem.precioCosto,
                                precioUnitario: restItem.precioUnitario,
                                precioCostoFraccionado,
                                codigo: restItem.codigo,
                                stock: restItem.stock,
                                estado: restItem.estado,
                                conversion,
                                medidas,
                                total: fS.roundNumber(
                                    restItem.cantidad * restItem.precioUnitario,
                                    5
                                ),
                            };
                        });
                    }
                    return data;
                });
            }

            function getInfoById(id) {
                const json = JSON.stringify({
                    id,
                    tipo: 3,
                });
                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    let { comprobante, detalles } = response;
                    let tempComprobante = comprobante[0];

                    comprobante = {
                        establecimiento: tempComprobante.nombreComercial,
                        ptoEmi: tempComprobante.ptoEmi,
                        idConsolidacionInventario: tempComprobante.idConsolidacionInventario,
                        fechaEmision: fS.formatDate(tempComprobante.fechaEmision),
                        observacion: tempComprobante.observacion,
                        total: tempComprobante.total,
                        tipoDocumento: tempComprobante.tipoDocumento,
                        movimiento: tempComprobante.movimiento,
                    };
                    detalles = detalles.map((item, index) => {
                        return {
                            index: index + 1,
                            idConsolidacionInventarioDetalle:
                                item.idConsolidacionInventarioDetalle,
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            cantidad: item.cantidad,
                            medida: item.medida,
                            bodega: item.bodega,
                            stock: item.stock,
                            precioUnitario: item.precioUnitario,
                            precioCosto: item.precioCosto,
                            total: item.total,
                        };
                    });
                    return {
                        comprobante,
                        detalles,
                    };
                });
            }
            function put(id, data) {
                return mS.getData("put", `${url}${id}`, { data }, true);
            }

            function anular(id) {
                return mS.getData("delete", `${url}${id}`, null, true);
            }

            // return service;
        },
    ]);
})(window.angular);

/**
 * TRANSFERENCIA BODEGA
 *
 */

(function () {
    "use strict";

    app.factory("transferenciaBodegaService", [
        "$injector",
        function ($injector) {
            let mS = $injector.get("mainService");
            let fS = $injector.get("formulario");
            let url = "Inventario/TransferenciaBodega/";

            return {
                getDataFilter,
                getDataForm,
                getProductsTransferenciaMasiva,
                generateSerieComprobante,
                getAll,
                mapTo,
                insert,
                update,
                anular,
                getId,
                getIdDetalle,
            };

            function getDataFilter() {
                return mS
                    .getData("get", `${url}?json=${JSON.stringify({ tipo: 2 })}`)
                    .then((response) => {
                        const data = {
                            estabs: [],
                        };
                        if (response !== null && typeof response === "object") {
                            let dataToGroup = {
                                estabs: response.establecimientos,
                            };
                            data.estabs = fS.groupingEstab(dataToGroup);
                        }
                        return data;
                    });
            }

            function getDataForm() {
                return mS
                    .getData("get", `${url}?json=${JSON.stringify({ tipo: 3 })}`)
                    .then((response) => {
                        const data = {
                            estabs: [],
                            tiposTransaccion: [],
                            tipoDocumento: [],
                            subFamilias: [],
                        };
                        if (response !== null && typeof response === "object") {
                            const { ptoEmision, bodega, tipoTransaccion, tipoDocumento } =
                                response;
                            const dataToGroup = {
                                estabs: ptoEmision,
                                bodegas: bodega,
                                isGroupBodega: true,
                            };
                            data.estabs = fS.groupingEstab(dataToGroup);
                            data.tiposTransaccion = tipoTransaccion;
                            data.tipoDocumento = tipoDocumento;
                            data.subFamilias = response.subFamilias.reduce(function (
                                acc,
                                obj
                            ) {
                                let key = obj.nomFamilia;
                                let existingGroup = acc.find(function (group) {
                                    return group.nomFamilia === key;
                                });

                                if (existingGroup) {
                                    existingGroup.subFamilias.push({
                                        idSubFamilia: obj.idSubFamilia,
                                        nomSubFamilia: obj.nomSubFamilia,
                                    });
                                } else {
                                    acc.push({
                                        nomFamilia: key,
                                        subFamilias: [
                                            {
                                                idSubFamilia: obj.idSubFamilia,
                                                nomSubFamilia: obj.nomSubFamilia,
                                            },
                                        ],
                                    });
                                }

                                return acc;
                            },
                                []);
                        }

                        return data;
                    });
            }

            function getProductsTransferenciaMasiva(obj) {
                let json = JSON.stringify({
                    tipo: 6,
                    subFamilias: obj.subFamilias,
                    bodegaId: obj.bodegaId,
                });
                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    let result = {
                        articulos: [],
                    };
                    if (response && typeof response === "object") {
                        const { articulos = [] } = response;
                        result.articulos = articulos.map((item) => {
                            const { principal, fraccionado, ...restItem } = item;
                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            const dataMedida = medidas.find(
                                (m) => m.idMedida === restItem.idMedida
                            );

                            return {
                                idArticulo: restItem.idArticulo,
                                codigo: restItem.codigo,
                                descripcion: restItem.descripcion,
                                cantidad: restItem.cantidad,
                                precioCosto: restItem.precioCosto,
                                precioUnitario: dataMedida.precioUnitario,
                                precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                                idMedida: restItem.idMedida,
                                nomMedida: restItem.nomMedida,
                                medidas,
                                conversion: dataMedida.conversion,
                                total: fS.roundNumber(
                                    restItem.cantidad * restItem.precioCosto,
                                    4
                                ),
                                totalRecords: item.totalRecords,
                            };
                        });
                    }

                    return result;
                });
            }

            function generateSerieComprobante(query) {
                return mS
                    .getData(
                        "get",
                        url + "?json=" + JSON.stringify(Object.assign(query, { tipo: 4 }))
                    )
                    .then((response) => {
                        let value = null;
                        if (response !== null && typeof response === "object") {
                            const { serieComprobante } = response;
                            value = serieComprobante[0].serieComprobante;
                        }
                        return value;
                    });
            }
            function getAll(obj) {
                let json = JSON.stringify({
                    ...obj,
                    tipo: 1,
                });
                return mS.getData("get", `${url}?json=${json}`).then((response) => {
                    let transferenciasBodega = [];
                    if (response !== null && typeof response === "object") {
                        const tempData = response.tranferencias;
                        transferenciasBodega = tempData.map((item) => {
                            return {
                                idTransferenciaBodega: item.idTransferenciaBodega,
                                idTipoDocumento: item.idTipoDocumento,
                                codEstab: item.codEstab,
                                nroDoc: item.nroDoc,
                                fechaEmision: item.fechaEmision,
                                estadoDesc: item.estadoDesc,
                                estadoCodigo: item.estadoCodigo,
                                total: item.total,
                                bodegaOrigen: item.bodegaOrigen,
                                bodegaDestino: item.bodegaDestino,
                                rowColor: item.rowColor,
                                totalRecords: item.totalRecords,
                                observacion: item.observacion,
                            };
                        });
                    }

                    return transferenciasBodega;
                });
            }

            function mapTo(obj) {
                const {
                    data,
                    detalles,
                    tiposTransaccion,
                    tipoDocumento,
                    itemsDeleted,
                } = obj;

                const idTipoTransaccionOrigen = tiposTransaccion.find(
                    (item) => item.codigo === "S"
                ).idTipoTransaccion;
                const idTipoTransaccionDestino = tiposTransaccion.find(
                    (item) => item.codigo === "E"
                ).idTipoTransaccion;
                const idTipoDocumento = tipoDocumento.find(
                    (item) => item.codigo === "TB"
                ).idTipoDocumento;

                data.total = detalles.reduce((acc, curr) => acc + curr.total, 0);

                const comprobante = mapComprobanteTo(data);
                const resultsDetalleOrigen = mapDetalleOrigen(
                    detalles,
                    idTipoTransaccionOrigen,
                    idTipoDocumento,
                    data.idBodegaOrigen
                );
                const resultsDetalleDestino = mapDetalleDestino(
                    detalles,
                    idTipoTransaccionDestino,
                    idTipoDocumento,
                    data.idBodegaDestino
                );
                const mergeDetalle = [
                    ...resultsDetalleOrigen,
                    ...resultsDetalleDestino,
                ].map((item, index) => ({ ...item, orderIndex: index + 1 }));

                const tempItemsDeleted = itemsDeleted.map((item, index) => ({
                    ...item,
                    orderIndex: index + 1,
                }));
                const mergeDetalleOrigen = [
                    ...resultsDetalleOrigen,
                    ...tempItemsDeleted,
                ];

                return {
                    comprobante,
                    detalles: mergeDetalleOrigen,
                    transaccion: [
                        {
                            idTipoTransaccion: idTipoTransaccionOrigen,
                            idTipoDocumento,
                            fechaEmision: comprobante.fechaEmision,
                        },
                        {
                            idTipoTransaccion: idTipoTransaccionDestino,
                            idTipoDocumento,
                            fechaEmision: comprobante.fechaEmision,
                        },
                    ],
                    transaccionDetalle: mergeDetalle,
                };
            }
            function mapComprobanteTo(data) {
                return {
                    idPuntoEmision: data.idPuntoEmision,
                    idBodegaOrigen: data.idBodegaOrigen,
                    idBodegaDestino: data.idBodegaDestino,
                    fechaEmision: fS.formatDateMoment(data.fechaEmision),
                    observacion: data.observacion,
                    total: data.total,
                };
            }

            function mapDetalleOrigen(
                detalles,
                idTipoTransaccionOrigen,
                idTipoDocumento,
                idBodega
            ) {
                let results = detalles.map((item, index) => {
                    return {
                        orderIndex: index + 1,
                        idTransferenciaBodegaDetalle: item.idTransferenciaBodegaDetalle,
                        idTipoTransaccion: idTipoTransaccionOrigen,
                        idTipoDocumento,
                        idArticulo: item.idArticulo,
                        idBodega: idBodega,
                        idMedida: item.idMedida,
                        descripcion: item.descripcion,
                        cantidad: item.cantidad,
                        conversion: item.conversion,
                        cantidadTransaccion: fS.roundNumber(
                            item.cantidad * item.conversion
                        ),
                        precioUnitario: item.precioUnitario,
                        precioCosto: item.precioCosto,
                        precioCostoFraccionado: item.precioCostoFraccionado,
                        total: item.total,
                        estado: item.estado,
                    };
                });
                return results;
            }
            function mapDetalleDestino(
                detalles,
                idTipoTransaccionDestino,
                idTipoDocumento,
                idBodega
            ) {
                let results = detalles.map((item, index) => {
                    return {
                        orderIndex: index + 1,
                        idTransferenciaBodegaDetalle: item.idTransferenciaBodegaDetalle,
                        idTipoTransaccion: idTipoTransaccionDestino,
                        idTipoDocumento,
                        idArticulo: item.idArticulo,
                        idBodega: idBodega,
                        idMedida: item.idMedida,
                        cantidad: item.cantidad,
                        conversion: item.conversion,
                        cantidadTransaccion: fS.roundNumber(
                            item.cantidad * item.conversion
                        ),
                        precioUnitario: item.precioUnitario,
                        precioCosto: item.precioCosto,
                        precioCostoFraccionado: item.precioCostoFraccionado,
                        total: item.total,
                        descripcion: item.descripcion,
                        estado: item.estado,
                    };
                });
                return results;
            }

            function insert(data) {
                return mS.getData("post", `${url}`, { data }, true);
            }

            function update(id, data) {
                return mS.getData("put", `${url}${id}`, { data }, true);
            }

            function anular(id) {
                return mS.getData("delete", `${url}${id}`, null, true);
            }

            function getId(id) {
                return mS.getData("get", `${url}GetId/${id}`).then((response) => {
                    const data = {
                        comprobante: {},
                        detalles: [],
                    };
                    if (response !== null && typeof response === "object") {
                        const { detalles: detallesTemp } = response;

                        const comprobante = response.comprobante[0];
                        data.comprobante = {
                            ...comprobante,
                            fechaEmision: fS.formatDate(comprobante.fechaEmision),
                            fechaEmisionDocCreado: fS.formatDate(comprobante.fechaEmision),
                        };

                        data.detalles = detallesTemp.map((item) => {
                            const { fraccionado, principal, ...restItem } = item;

                            const medidas = fS.processAndSortMeasures(principal, fraccionado);

                            const dataMedida = medidas.find(
                                (m) => m.idMedida === restItem.idMedida
                            );
                            restItem.conversion = dataMedida.conversion;
                            restItem.medidas = medidas;
                            restItem.precioCosto = dataMedida.precioCosto;
                            restItem.precioUnitario = restItem.precioUnitario;
                            restItem.precioCostoFraccionado =
                                dataMedida.precioCostoFraccionado;
                            return restItem;
                        });
                    }
                    return data;
                });
            }

            function getIdDetalle(id) {
                return mS
                    .getData(
                        "get",
                        url + "?json=" + JSON.stringify(Object.assign({ id }, { tipo: 5 }))
                    )
                    .then((response) => {
                        const data = {
                            dataDocumento: {},
                            detalleDocumento: [],
                        };
                        if (response !== null && typeof response === "object") {
                            const { detalles } = response;

                            const comprobante = response.comprobante[0];
                            data.dataDocumento = {
                                ...comprobante,
                                fechaEmision: fS.formatDate(comprobante.fechaEmision),
                            };
                            data.detalleDocumento = detalles;
                        }
                        return data;
                    });
            }
        },
    ]);
})(window.angular);
