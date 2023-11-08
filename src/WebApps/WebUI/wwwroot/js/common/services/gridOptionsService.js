

(function () {

    'use strict';

    app.factory('gridOptionsService', gridOptionsService);

    gridOptionsService.$inject = [
        'formulario',
        'pricingUtils'
    ];

    function gridOptionsService(fS, pricingUtils) {

        let service = {}

        /**
         * 
         *  
         * @param {object} rowEntity valores de uiGridOptions
         * @param {string || number} oldValue valor numero o string 
         * @returns object 
         */
        service.calculoColDef = function ({ rowEntity, oldValue, decimal, idTarifa, columnDefs }) {

            let dataTipoIva = columnDefs.find(item => item.field === 'idTipoIva').editDropdownOptionsArray
                .find(item => item.idTipoIva === rowEntity.idTipoIva);

            const calculoColumnas = {
                'cantidad': function () {

                    if (rowEntity.cantidad === oldValue) return


                    rowEntity.cantidad = fS.roundNumber(rowEntity.cantidad, decimal.nroCantidad);

                },
                'idMedida': function () {
                    if (rowEntity.idMedida === oldValue) return

                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);
                    let articuloTarifas = [];
                    if (typeof dataMedida.tarifas === 'string') {
                        articuloTarifas = JSON.parse(dataMedida.tarifas);
                    } else {
                        articuloTarifas = dataMedida.tarifas;
                    }
                    let tarifa = articuloTarifas.find(item => item.idTarifa === idTarifa);


                    rowEntity.articuloTarifas = articuloTarifas;
                    rowEntity.idTarifa = idTarifa
                    rowEntity.precioUnitario = fS.roundNumber(tarifa.precioVenta, decimal.nroPrecio);
                    rowEntity.precioConIva = fS.roundNumber(tarifa.precioConIva, decimal.nroPrecio);
                    rowEntity.porcentajeDescuento = 0;
                    rowEntity.valorDescuento = 0;
                    rowEntity.conversion = dataMedida.conversion;
                    //  this.setTotalRow(rowEntity, index);                                  

                },
                'idTipoIva': function () {
                    try {

                        if (rowEntity.idTipoIva === oldValue) return

                        rowEntity.tarifa = dataTipoIva.tarifa;
                        rowEntity.codigoPorcentaje = dataTipoIva.codigoPorcentaje;
                        calculoColumnas["precioUnitario"]();
                    } catch (error) {
                        toastr.error(`CALCULO TIPO IVA: ${error}`)
                    }
                },

                'codigoPorcentaje': function () {
                    try {
                        if (rowEntity.idTipoIva === oldValue) return

                        rowEntity.tarifa = dataTipoIva.tarifa;
                        rowEntity.codigoPorcentaje = dataTipoIva.codigoPorcentaje;
                        calculoColumnas["precioUnitario"]();
                    } catch (error) {
                        toastr.error(`CALCULO TIPO IVA: ${error}`)
                    }
                },

                'idTarifa': function () {
                    try {
                        if (rowEntity.idTarifa === oldValue) return
                        let tarifa = rowEntity.articuloTarifas.find(item => item.idTarifa === rowEntity.idTarifa);

                        let precioConIva = pricingUtils.calcularPrecioConIva(tarifa.precioVenta, dataTipoIva.tarifa);
                        let precioConIvaConDesuento = pricingUtils.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                        let valorDescuento = pricingUtils.getValorDescuento(tarifa.precioVenta, rowEntity.porcentajeDescuento);

                        rowEntity.precioUnitario = fS.roundNumber(tarifa.precioVenta, decimal.nroPrecio);
                        rowEntity.precioConIva = fS.roundNumber(precioConIvaConDesuento, decimal.nroPrecio);
                        rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuentoDetalle);

                    } catch (error) {
                        toastr.error(`CAMBIO DE TARIFA: ${error}`)
                    }
                },
                'precioUnitario': function () {
                    try {

                        if (rowEntity.precioUnitario === oldValue) return;

                        let precioConIva = pricingUtils.calcularPrecioConIva(rowEntity.precioUnitario, dataTipoIva.tarifa);
                        let precioIvaDescuento = pricingUtils.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                        let valorDescuento = pricingUtils.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);

                        rowEntity.precioUnitario = fS.roundNumber(rowEntity.precioUnitario, decimal.nroPrecio);
                        rowEntity.precioConIva = fS.roundNumber(precioIvaDescuento, decimal.nroPrecio);
                        rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuentoDetalle);
                        // this.setTotalRow(entity, index)

                    } catch (error) {
                        toastr.error(`CÁLCULO DE PRECIO UNITARIO: ${error}`)
                    }
                },
                'precioConIva': function () {
                    try {

                        if (rowEntity.precioConIva === oldValue) return;

                        let precioUnitario = pricingUtils.calcularPrecioVenta(rowEntity.precioConIva, dataTipoIva.tarifa);

                        rowEntity.precioConIva = fS.roundNumber(rowEntity.precioConIva, decimal.nroPrecio);
                        rowEntity.precioUnitario = fS.roundNumber(precioUnitario, decimal.nroPrecio);

                    } catch (error) {
                        toastr.error(`CÁLCULO DE PRECIO CON IVA: ${error}`)
                    }
                },
                'porcentajeDescuento': function () {
                    try {

                        if (rowEntity.porcentajeDescuento === oldValue) return



                        //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
                        if (rowEntity.porcentajeDescuento <= 100) {

                            let precioConIva = pricingUtils.calcularPrecioConIva(rowEntity.precioUnitario, dataTipoIva.tarifa);
                            let precioIvaDescuento = pricingUtils.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                            let valorDescuento = pricingUtils.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);

                            rowEntity.porcentajeDescuento = fS.roundNumber(rowEntity.porcentajeDescuento, decimal.nroPorcentaje);
                            rowEntity.precioConIva = fS.roundNumber(precioIvaDescuento, decimal.nroPrecio);
                            rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuento);

                        } else {
                            rowEntity.porcentajeDescuento = oldValue;
                            toastr.warning('El Porcentaje tiene que ser menor o igual a 100', 'Cálculo de Porcentaje Descuento');
                        }

                        rowEntity.porcentajeDescuento = fS.roundNumber(rowEntity.porcentajeDescuento, decimal.nroPorcentaje);

                    } catch (error) {
                        toastr.error(`CÁLCULO DE PORCENTAJE DE DESCUENTO: ${error}`)
                    }
                },
                'valorDescuento': function () {
                    try {

                        if (rowEntity.valorDescuento === oldValue) return

                        if (rowEntity.valorDescuento <= rowEntity.precioUnitario) {

                            let porcentajeDescuento = pricingUtils.getPorcentajeDescuento(rowEntity.precioUnitario, rowEntity.valorDescuento);
                            let precioConIva = rowEntity.precioUnitario - rowEntity.valorDescuento;

                            rowEntity.valorDescuento = fS.roundNumber(rowEntity.valorDescuento, decimal.nroDescuento);
                            rowEntity.porcentajeDescuento = fS.roundNumber(porcentajeDescuento, decimal.nroPorcentaje);
                            rowEntity.precioConIva = fS.roundNumber(precioConIva, decimal.nroPrecio);

                        } else {
                            rowEntity.valorDescuento = oldValue;
                            toastr.warning('El valor Descuento tiene que ser menor o igual a Precio Venta', 'Ingreso Descuento');
                        }

                        rowEntity.valorDescuento = fS.roundNumber(rowEntity.valorDescuento, decimal.nroDescuento);

                    } catch (error) {
                        toastr.error(`CÁLCULO DE VALOR DE DESCUENTO: ${error}`)
                    }
                },
                "calculoTotalDetalle": function () {
                    try {
                        let total = (rowEntity.precioUnitario - rowEntity.valorDescuento) * rowEntity.cantidad;
                        let totalDescuento = rowEntity.cantidad * rowEntity.valorDescuento;
                        let subTotal = rowEntity.cantidad * rowEntity.precioUnitario;
                        let totalIce = rowEntity.cantidad * rowEntity.ice;

                        rowEntity.totalDescuento = fS.roundNumber(totalDescuento, decimal.nroDescuentoDetalle)
                        rowEntity.subTotal = fS.roundNumber(subTotal, 5);
                        rowEntity.total = fS.roundNumber(total, decimal.nroTotalDetalle);
                        rowEntity.totalIce = fS.roundNumber(totalIce, decimal.nroIce)
                        // this.getTotales();
                    } catch (error) {
                        toastr.error(`CÁLCULO DE TOTAL: ${error}`)
                    }
                },
            }

            return calculoColumnas;
        }


        /**
         * 
         * @param {*} object 
         * @returns object
         */
        service.calculoTotales = function ({ items, decimal, dataTarifaImpuesto }) {

            let CODIGO_PORCENTAJE_IVA_CERO = '0', CODIGO_PORCENTAJE_IVA_EXENTO = '7', CODIGO_PORCENTAJE_IVA_NO_OBJETO = '6';

            const obj = {
                getSubTotalSinImpuesto: function () {
                    let total = items.map(val => val.subTotal).reduce((acc, curr) => acc + curr, 0);
                    // return fS.roundNumber(total, decimal.nroTotalSubTotal);
                    return total;
                },

                getTotalIva: function (codigoPorcentaje) {
                    let total = 0, totalNetoIva = 0;

                    for (let item of items) {
                        if (item.codigoPorcentaje === codigoPorcentaje) {
                            total += item.subTotal
                            totalNetoIva += item.total;
                        }
                    }

                    return [
                        total = fS.roundNumber(total, decimal.nroTotalSubTotal),
                        totalNetoIva = fS.roundNumber(totalNetoIva, decimal.nroTotalSubTotal)
                    ]
                },

                //Get Total Ice 
                getTotalIce: function () {

                    let total = items.map(val => val.ice).reduce((acc, curr) => acc + curr, 0);
                    return fS.roundNumber(total, decimal.nroTotalSubTotal)
                },

                //Suma columna total 
                getTotalDetalle: function () {
                    let totalDetalle = items.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
                    let obj = fS.roundNumber(totalDetalle, decimal.nroTotalSubTotal);
                    return obj;
                },

                getTotalPorcentajeDescuento: function () {
                    let totalPorcentajeDescuento = 0, totalDetalle = 0;

                    if (items.length > 0 && obj.getSubTotalSinImpuesto() > 0) {

                        //Total Detalle No tiene que ser mayor al total sin impuesto
                        if (obj.getTotalDetalle() > obj.getSubTotalSinImpuesto()) {
                            totalDetalle = obj.getSubTotalSinImpuesto();
                        } else {
                            totalDetalle = obj.getTotalDetalle();
                        }

                        totalPorcentajeDescuento = ((obj.getSubTotalSinImpuesto() - totalDetalle) * 100) / obj.getSubTotalSinImpuesto();

                    }

                    return fS.roundNumber(totalPorcentajeDescuento, decimal.nroPorcentaje);
                },

                getTotalDescuento: function () {
                    let total = items.map(val => val.totalDescuento).reduce((acc, curr) => acc + curr, 0);
                    return fS.roundNumber(total, decimal.nroTotalSubTotal);
                }
            };


            let [subTotalIva, subTotalNetoIva] = obj.getTotalIva(dataTarifaImpuesto.codigoPorcentaje);
            let [subTotalIvaCero, subTotalNetoIvaCero] = obj.getTotalIva(CODIGO_PORCENTAJE_IVA_CERO);
            let [subTotalExentoIva, subTotalNetoExentoIva] = obj.getTotalIva(CODIGO_PORCENTAJE_IVA_EXENTO);
            let [subTotalNoObjetoIva, subTotalNetoNoObjetoIva] = obj.getTotalIva(CODIGO_PORCENTAJE_IVA_NO_OBJETO);

            // let iva = subTotalNetoIva * dataTarifaImpuesto.tarifa / 100;                

            // let total = iva + obj.getTotalDetalle();

            //--------------------------
            let iva = subTotalNetoIva * dataTarifaImpuesto.tarifa / 100;

            let total = obj.getSubTotalSinImpuesto() + iva + obj.getTotalIce();
            let importeTotal = total - obj.getTotalDescuento();

            return {
                subTotalSinImpuestos: fS.roundNumber(obj.getSubTotalSinImpuesto(), decimal.nroTotalSubTotal),
                subTotalIva,
                subTotalNetoIva,

                subTotalIvaCero,
                subTotalNetoIvaCero,

                subTotalExentoIva,
                subTotalNetoExentoIva,

                subTotalNoObjetoIva,
                subTotalNetoNoObjetoIva,

                totalDescuento: fS.roundNumber(obj.getTotalDescuento(), decimal.nroTotalSubTotal),
                porcentajeDescuento: fS.roundNumber(obj.getTotalPorcentajeDescuento(), decimal.nroTotalSubTotal),

                totalIce: obj.getTotalIce(),
                irbpnr: 0,
                propina: 0,
                iva: fS.roundNumber(iva, decimal.nroIva),
                total: fS.roundNumber(importeTotal, decimal.importeTotal)
            }

        }



        service.askToDeleteItem = async function (rowEntity) {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger m-l-5'
                    },
                    buttonsStyling: false
                })

                const { isConfirmed } = await swalWithBootstrapButtons.fire({
                    html: `<small>Esta Ud. seguro de eliminar este Artículo <b>${rowEntity.descripcion}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: `Si!</small>`,
                    cancelButtonText: 'No!</small>',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    focusConfirm: true
                })
                return isConfirmed;

            } catch (error) {
                console.log(error)
            }

        }



        /**
         * 
         * 
         */
        service.askToChangeEstablecimiento = async function () {

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            let { isConfirmed } = await swalWithBootstrapButtons.fire({
                title: '<small>Cambiar Establecimiento?</small>',
                html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, cambiar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            return isConfirmed;

        }


        service.askToa


        /**
         * 
         * @param {*} items 
         * @param {*} idTarifa 
         * @param {*} decimal 
         */
        service.setTarifaInDetail = function (gridOptions, idTarifa, decimal, callback) {

            try {
                for (let rowEntity of gridOptions.data) {

                    let tarifa = rowEntity.articuloTarifas.find(item => item.idTarifa === idTarifa);


                    let precioConIva = pricingUtils.calcularPrecioConIva(tarifa.precioVenta, rowEntity.tarifa);
                    let precioConIvaConDescuento = pricingUtils.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                    let valorDescuento = pricingUtils.getValorDescuento(tarifa.precioVenta, rowEntity.porcentajeDescuento);

                    rowEntity.idTarifa = idTarifa;
                    rowEntity.precioUnitario = fS.roundNumber(tarifa.precioVenta, decimal.nroPrecio);
                    rowEntity.precioConIva = fS.roundNumber(precioConIvaConDescuento, decimal.nroPrecio);
                    rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuentoDetalle);

                    // this.calculoColumnas["calculoTotalDetalle"](); 
                    let objCalculo = callback({
                        rowEntity,
                        oldValue: 0,
                        decimal,
                        idTarifa,
                        columnDefs: gridOptions.columnDefs
                    });

                    objCalculo["calculoTotalDetalle"]();
                }

                return true;

            } catch (error) {
                toastr.error(`APLICACIÓN DE TARIFA EN TODO EL DOCUMENTO: ${error}`)
            }
        }


        service.setPorcentajeDescuentoAll = function (gridOptions, data, decimal, callback) {
            for (let rowEntity of gridOptions.data) {
                rowEntity.porcentajeDescuento = data.porcentajeDescuento;

                let objCalculo = callback({
                    rowEntity,
                    oldValue: 0,
                    decimal,
                    data,
                    columnDefs: gridOptions.columnDefs
                });

                objCalculo["porcentajeDescuento"]();
                objCalculo["calculoTotalDetalle"]();
            }
        }

        service.getSubTotalSinImpuesto = function (items) {
            const { subTotalSinImpuestos } = items.reduce((total, rowEntity) => {
                // Calcular el precio del ítem teniendo en cuenta el descuento
                const totalSinImpuesto = rowEntity.cantidad * rowEntity.precioUnitario;
                // Agregar el total del ítem al subtotal sin impuestos
                total.subTotalSinImpuestos += totalSinImpuesto;
                return total;
            }, {
                subTotalSinImpuestos: 0
            })
            console.log(subTotalSinImpuestos)
            return { subTotalSinImpuestos };
        }


        return service;

    }

})(window.angular);