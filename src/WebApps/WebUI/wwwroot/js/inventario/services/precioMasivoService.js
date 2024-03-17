(function () {
    'use strict';

    app.factory('precioMasivoService', ['mainService', function (mS) {
        const url = 'Inventario/PrecioMasivo/';

        return {
            getDataForm,
            getProducts,
            put
        }

        function getDataForm() {
            const json = JSON.stringify({
                tipo: 1
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                const data = {
                    decimal: {},
                    tarifasImpuesto: [],
                    tarifas: [],
                    subFamilias: [],
                    familias: []
                }
                if (response !== null && typeof response === 'object') {
                    const { decimales, impuestos, familias, subfamilias: subFamilias, tarifas } = response;
                    console.log(response)
                    const tempDecimal = decimales[0];
                    data.decimal = {
                        nroPrecio: tempDecimal.nroPrecio,
                        nroCantidad: tempDecimal.nroCantidad,
                        nroIva: tempDecimal.nroIva,
                        nroDescuentoDetalle: tempDecimal.nroDescuentoDetalle,
                        nroTotalDetalle: tempDecimal.nroTotalDetalle,
                        nroTotalSubTotal: tempDecimal.nroTotalSubTotal,
                        nroDescuento: tempDecimal.nroDescuento,
                        importeTotal: tempDecimal.importeTotal,
                        nroIce: tempDecimal.nroIce,
                    }
                    data.tarifasImpuesto = impuestos.map(item => {
                        return {
                            idTipoIva: item.idTipoIva,
                            descripcion: item.descripcion,
                            porcentaje: item.porcentaje,
                            // codigoPorcentaje: item.codigoPorcentaje,
                            // idImpuesto: item.idImpuesto,
                            // estado: item.estado,
                            // fechaRegistro: item.fechaRegistro,
                            // idUsuario: item.idUsuario,
                            // codigo: item.codigo,
                        }
                    })

                    data.familias = familias.map(item => {
                        return {
                            idFamilia: item.idFamilia,
                            descripcion: item.descripcion,
                            siglas: item.siglas,
                        }
                    })

                    data.subFamilias = subFamilias.map(item => {
                        return {
                            idSubFamilia: item.idSubFamilia,
                            idFamilia: item.idFamilia,
                            descripcion: item.descripcion,
                            siglas: item.siglas,
                        }
                    })

                    data.tarifas = tarifas.map(item => {
                        return {
                            idTarifa: item.idTarifa,
                            descripcion: item.descripcion,
                            predeterminada: item.predeterminada,
                        }
                    })
                }

                return data;
            })
        }

        function getProducts(obj) {
            const json = JSON.stringify({
                ...obj,
                tipo: 2,
            })
            return mS.getData('get', `${url}?json=${json}`, null, true).then(response => {
                let products = [];
                if (response !== null && typeof response === 'object') {
                    products = response.articulos.map(item => ({
                        idArticulo: item.idArticulo,
                        codigo: item.codigo,
                        codigoAuxiliar: item.codigoAuxiliar,
                        codigoBarra: item.codigoBarra,
                        descripcion: item.descripcion,
                        stock: item.stock,
                        precioCosto: item.precioCosto,
                        estado: item.estado,
                        idTarifa: item.idTarifa,
                        iva: item.iva,
                        idArticuloPvP: item.idArticuloPvp,
                        precioVenta: item.precioVenta,
                        precioConIva: item.precioConIva,
                        porcentajeUtilidad: item.porcentajeUtilidad,
                        estadoTarifa: item.estadoTarifa,
                        tarifa: item.tarifa,
                    }))
                }
                console.log(products)
                return products;
            })
        }

        function put(data){
            return mS.getData('put', `${url}`, { data }, true)
        }












    }])
})(window.angular)