(function () {

    'use strict';

    app.factory('familiaService', function ($injector) {

        let url = 'Inventario/Familia/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let familias = JSON.parse(response.payload) || [];
                    return familias.map(item => ({
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                        siglas: item.siglas,
                        estado: item.estado,
                        totalRecords: item.totalRecords
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        service.listForSelect = function (query) {
            return mS.getData('get', url + 'ListForSelect?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let familias = JSON.parse(response.payload) || [];
                    return familias.map(item => ({
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                    }))
                }
            })
        }

        return service;
    })



    /**
     * SubFamilias 
     */
    app.factory('subFamiliaService', function ($injector) {

        let url = 'Inventario/SubFamilia/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let subFamilias = JSON.parse(response.payload) || [];

                    return subFamilias.map(item => ({
                        idSubFamilia: item.idSubFamilia,
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        siglas: item.siglas,
                        codigo: item.codigo,
                        montoObjetivo: item.montoObjetivo,
                        nombreFamilia: item.nombreFamilia,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        service.listForSelect = function (query) {
            return mS.getData('get', url + 'ListForSelect?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let subFamilias = JSON.parse(response.payload) || [];
                    return subFamilias.map(item => ({
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                    }))
                }
            })
        }

        return service;
    })


    /**
     * Marcas 
     */
    app.factory('marcaService', function ($injector) {

        let url = 'Inventario/Marca/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let marcas = JSON.parse(response.payload) || [];

                    return marcas.map(item => ({
                        idMarca: item.idMarca,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        codigo: item.codigo,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        service.listForSelect = function (query) {
            return mS.getData('get', url + 'ListForSelect?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let marcas = JSON.parse(response.payload) || [];

                    return marcas.map(item => ({
                        idMarca: item.idMarca,
                        descripcion: item.descripcion,
                    }))
                }
            })
        }


        return service;
    })

    /**
     * Modelos 
     */
    app.factory('modeloService', function ($injector) {

        let url = 'Inventario/Modelo/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let modelos = JSON.parse(response.payload) || [];

                    return modelos.map(item => ({
                        idModelo: item.idModelo,
                        codigo: item.codigo,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        idMarca: item.idMarca,
                        marca: item.marca,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }


        return service;
    })




    /**
     * Modelos 
     */
    app.factory('medidaService', function ($injector) {

        let url = 'Inventario/Medida/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let medidas = JSON.parse(response.payload) || [];

                    return medidas.map(item => ({
                        idMedida: item.idMedida,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        codigo: item.codigo,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }


        return service;
    })


    /**
    * Modelos 
    */
    app.factory('tarifaService', function ($injector) {

        let url = 'Inventario/Tarifa/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let tarifas = JSON.parse(response.payload) || [];

                    return tarifas.map(item => ({
                        idTarifa: item.idTarifa,
                        descripcion: item.descripcion,
                        codigo: item.codigo,
                        predeterminada: item.predeterminada,
                        estado: item.estado,
                        ventaPorMayor: item.ventaPorMayor,
                        totalRecords: item.totalRecords,
                    }))
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id + '?json=' + JSON.stringify(data), null, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }


        return service;
    })

    app.factory('pricingUtils', function () {
        let service = {}

        service.calcularPrecioConIva = function (precioVenta, porcentaje) {
            try {
                let resultadoPorcentaje = Number(porcentaje) / 100;
                let result = Number(precioVenta) * Number(resultadoPorcentaje)
                let precioConIva = result + Number(precioVenta);
                return precioConIva;

            } catch (error) {
                console.log('pricingUtils -> CALCULO PRECIO CON IVA', error);
            }
        }

        service.calcularPrecioVenta = function (precioConIva, porcentaje) {
            try {
                let resultadoPorcentaje = Number(porcentaje) / 100 + 1;
                let precioVenta = Number(precioConIva) / Number(resultadoPorcentaje);
                return precioVenta;
            } catch (error) {
                console.log('pricingUtils -> CALCULO PRECIO Unitario', error);
            }
        }
        //cuando edito porcentaje utilidad
        service.calcularPorcentajeUtilidad = function (precioCosto, porcentajeUtilidad) {
            try {
                let resultPorcentajeUtilidad = Number(porcentajeUtilidad) / 100;
                let result = Number(precioCosto) * resultPorcentajeUtilidad;
                let precioVenta = Number(precioCosto) + result;
                return precioVenta

            } catch (error) {
                console.log('pricingUtils -> calcularPorcentajeUtilidad', error);
            }

        }


        //cuando cambio precio venta
        //Get Campo Porcentaje Utilidad
        service.campoPorcentajeUtilidad = function (precioCosto, precioVenta) {
            try {
                let porcentajeUtilidad = (Number(precioVenta) / Number(precioCosto) * 100) - 100;
                return porcentajeUtilidad;

            } catch (error) {
                console.log('pricingUtils -> campoPorcentajeUtilidad', error);
            }
        }


        //EN VENTA 
        service.getPrecioIvaConDescuento = function (precioConIva, porcentajeDescuento) {
            try {
                let porcentaje = Number(porcentajeDescuento) / 100;
                let descuento = Number(porcentaje) * Number(precioConIva);
                let precioIvaConDescuento = Number(precioConIva) - Number(descuento);
                return precioIvaConDescuento;
            } catch (error) {
                console.log('pricingUtils -> getPrecioIvaConDescuento', error);
            }

        }

        service.getValorDescuento = function (precioUnitario, porcentajeDescuento) {
            try {
                let porcentaje = Number(porcentajeDescuento) / 100;
                let descuento = Number(porcentaje) * Number(precioUnitario);
                return descuento;
            } catch (error) {
                console.log('pricingUtils -> getValorDescuento', error);
            }
        }

        service.getPorcentajeDescuento = function (precioUnitario, valorDescuento) {
            try {
                let porcentaje = valorDescuento / precioUnitario;
                let porcentajeDescuento = porcentaje * 100;
                return porcentajeDescuento;

            } catch (error) {
                console.log('pricingUtils -> getPorcentajeDescuento', error);
            }
        }

        return service;

    })


})(window.angular)