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

                        return proveedores;
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
        };

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
                    return mainData.proveedor;
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
})(window.angular);
