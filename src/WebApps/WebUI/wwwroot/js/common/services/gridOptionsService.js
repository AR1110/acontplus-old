

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

            let tarifaImpuesto = columnDefs.find(item => item.field === 'idTipoIva').editDropdownOptionsArray
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


                        rowEntity.idImpuesto = tarifaImpuesto.idImpuesto;
                        rowEntity.codigoPorcentaje = tarifaImpuesto.codigoPorcentaje;
                        rowEntity.tarifa = tarifaImpuesto.tarifa;
                        calculoColumnas["precioUnitario"]();
                    } catch (error) {
                        toastr.error(`CALCULO TIPO IVA: ${error}`)
                    }
                },

                'codigoPorcentaje': function () {
                    try {
                        if (rowEntity.idTipoIva === oldValue) return

                        rowEntity.idTipoIva = tarifaImpuesto.idTipoIva;
                        rowEntity.tarifa = tarifaImpuesto.tarifa;
                        rowEntity.codigoPorcentaje = tarifaImpuesto.codigoPorcentaje;
                        calculoColumnas["precioUnitario"]();
                    } catch (error) {
                        toastr.error(`CALCULO TIPO IVA: ${error}`)
                    }
                },

                'idTarifa': function () {
                    try {
                        if (rowEntity.idTarifa === oldValue) return
                        let tarifa = rowEntity.articuloTarifas.find(item => item.idTarifa === rowEntity.idTarifa);

                        let precioConIva = pricingUtils.calcularPrecioConIva(tarifa.precioVenta, tarifaImpuesto.tarifa);
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

                        let precioConIva = pricingUtils.calcularPrecioConIva(rowEntity.precioUnitario, tarifaImpuesto.tarifa);
                        // let precioIvaDescuento = pricingUtils.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                        let valorDescuento = pricingUtils.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);

                        rowEntity.precioUnitario = fS.roundNumber(rowEntity.precioUnitario, decimal.nroPrecio);
                        rowEntity.precioConIva = fS.roundNumber(precioConIva, decimal.nroPrecio);
                        rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuentoDetalle);
                        // this.setTotalRow(entity, index)

                    } catch (error) {
                        toastr.error(`CÁLCULO DE PRECIO UNITARIO: ${error}`)
                    }
                },
                'precioConIva': function () {
                    try {

                        if (rowEntity.precioConIva === oldValue) return;

                        let precioUnitario = pricingUtils.calcularPrecioVenta(rowEntity.precioConIva, tarifaImpuesto.tarifa);

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
                            //  let precioConIva = pricingUtils.calcularPrecioConIva(rowEntity.precioUnitario, tarifaImpuesto.tarifa);
                            //  let precioIvaDescuento = pricingUtils.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                            let valorDescuento = pricingUtils.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);

                            rowEntity.porcentajeDescuento = fS.roundNumber(rowEntity.porcentajeDescuento, decimal.nroPorcentaje);
                            // rowEntity.precioConIva = fS.roundNumber(precioIvaDescuento, decimal.nroPrecio);
                            rowEntity.valorDescuento = fS.roundNumber(rowEntity.cantidad * valorDescuento, decimal.nroDescuentoDetalle);

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

                        let subTotal = ((rowEntity.precioUnitario * rowEntity.cantidad))

                        if (rowEntity.valorDescuento <= subTotal) {

                            let porcentajeDescuento = pricingUtils.getPorcentajeDescuento(subTotal, rowEntity.valorDescuento);
                            //  let precioConIva = rowEntity.precioUnitario - rowEntity.valorDescuento;

                            rowEntity.valorDescuento = fS.roundNumber(rowEntity.valorDescuento, decimal.nroDescuentoDetalle);
                            rowEntity.porcentajeDescuento = fS.roundNumber(porcentajeDescuento, decimal.nroPorcentaje);
                            //  rowEntity.precioConIva = fS.roundNumber(precioConIva, decimal.nroPrecio);

                        } else {
                            rowEntity.valorDescuento = oldValue;
                            toastr.warning('El descuento no puede ser mayor al subtotal', 'Ingreso Descuento');
                        }

                        rowEntity.valorDescuento = fS.roundNumber(rowEntity.valorDescuento, decimal.nroDescuentoDetalle);

                    } catch (error) {
                        toastr.error(`CÁLCULO DE VALOR DE DESCUENTO: ${error}`)
                    }
                },
                "calculoTotalDetalle": function () {
                    try {
                        //let total = (rowEntity.precioUnitario - rowEntity.valorDescuento) * rowEntity.cantidad;
                        // let totalDescuento = rowEntity.cantidad * rowEntity.valorDescuento;
                        let precioTotalSinImpuesto = ((rowEntity.precioUnitario * rowEntity.cantidad)) - rowEntity.valorDescuento;
                        let valorImpuesto = pricingUtils.calculateTaxValue(precioTotalSinImpuesto, rowEntity.tarifa);
                        let total = precioTotalSinImpuesto + valorImpuesto;
                        let totalIce = rowEntity.cantidad * rowEntity.ice;

                        //   rowEntity.totalDescuento = fS.roundNumber(totalDescuento, decimal.nroDescuentoDetalle)
                        rowEntity.precioTotalSinImpuesto = fS.roundNumber(precioTotalSinImpuesto, decimal.nroTotalDetalle);
                        rowEntity.valorImpuesto = fS.roundNumber(valorImpuesto, decimal.nroIva)
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
         * Calcula los totales relacionados con impuestos y descuentos.
         * @param {*} obj - Objeto que contiene las propiedades: items, decimal, tarifasImpuesto y TAX_RATE_CODE.
         * @returns {Object} - Objeto con los totales calculados.
         */
        service.getImpuestoTotales = function (obj) {
            // Desestructurar el objeto de entrada
            const { items, decimal, tarifasImpuesto } = obj;

            // Inicializar las variables para almacenar los totales de impuestos
            let htmlImpuestoTotal = '', htmlIvaTotal = '', sumTotalIva = 0, totalPorcentajeDescuento = 0;

            // Calcular totales generales
            let { totalPrecioTotalSinImpuesto, totalIce, totalDescuento, totalSinImpuesto } = items.reduce((acc, prev) => {
                // Calcular el total neto con descuentos y el total de ICE
                let totalSinImpuesto = prev.cantidad * prev.precioUnitario;
                let precioTotalSinImpuesto = (prev.cantidad * prev.precioUnitario) - prev.valorDescuento;
                let totalIce = prev.cantidad * prev.ice;

                // Acumular totales generales
                acc.totalIce += totalIce;
                acc.totalPrecioTotalSinImpuesto += precioTotalSinImpuesto;
                acc.totalDescuento += prev.valorDescuento;
                acc.totalSinImpuesto += totalSinImpuesto;
                return acc;
            }, {
                totalPrecioTotalSinImpuesto: 0,
                totalIce: 0,
                totalDescuento: 0,
                totalSinImpuesto: 0

            });

            // Calcular totales específicos por tarifa de impuesto
            for (let dataTarifaImpuesto of tarifasImpuesto) {
                let filteredItems = items.filter(item => item.idTipoIva === dataTarifaImpuesto.idTipoIva);

                let { totalNetoIva } = filteredItems.reduce((acc, prev) => {
                    // Calcular el total neto con descuentos 
                    let precioTotalSinImpuesto = (prev.precioUnitario * prev.cantidad) - prev.valorDescuento;
                    acc.totalNetoIva += precioTotalSinImpuesto;

                    // Calcular IVA y IVA diferenciado según la tarifa
                    // if (dataTarifaImpuesto.codigoPorcentaje === TAX_RATE_CODE.TWELVE_PERCENT) {
                    //     iva += pricingUtils.calculateTaxValue(precioTotalSinImpuesto, prev.tarifa);
                    // }

                    // if (dataTarifaImpuesto.codigoPorcentaje === TAX_RATE_CODE.DIFFERENTIATED_TAX) {
                    //     ivaDiferenciado += pricingUtils.calculateTaxValue(precioTotalSinImpuesto, prev.tarifa);
                    // }

                    return acc;
                }, {
                    totalNetoIva: 0
                });

                // Construir el HTML para la tabla de impuestos
                htmlImpuestoTotal += `<tr>
                                <td class="left">
                                    <span class="text-dark">Subtotal ${dataTarifaImpuesto.descripcion}</span>
                                </td>
                                <td class="right">$${fS.roundNumber(totalNetoIva, decimal.nroTotalSubTotal)}</td>
                            </tr>`;

                if (dataTarifaImpuesto.tarifa > 0) {
                    let { totalIva } = filteredItems.reduce((acc, prev) => {
                        // Calcular el total neto con descuentos 
                        let precioTotalSinImpuesto = (prev.precioUnitario * prev.cantidad) - prev.valorDescuento;
                        acc.totalIva += pricingUtils.calculateTaxValue(precioTotalSinImpuesto, prev.tarifa);

                        sumTotalIva += acc.totalIva;

                        return acc;
                    }, {
                        totalIva: 0,
                    });
                    htmlIvaTotal += `
                                <tr>
                                    <td class="left">
                                        <span class="text-dark">${dataTarifaImpuesto.descripcion}</span>
                                    </td>
                                    <td class="right">$${fS.roundNumber(totalIva, decimal.nroIva)}</td>
                                </tr>`
                }
            }

            const importeTotal = totalPrecioTotalSinImpuesto + sumTotalIva;
            if (totalSinImpuesto > 0) {
                totalPorcentajeDescuento = ((totalSinImpuesto - totalPrecioTotalSinImpuesto) * 100) / totalSinImpuesto;
            }
            // Retornar los totales calculados
            return {
                subTotalSinImpuestos: fS.roundNumber(totalPrecioTotalSinImpuesto, decimal.nroTotalSubTotal),
                totalIce,
                irbpnr: 0,
                propina: 0,
                totalDescuento: fS.roundNumber(totalDescuento, decimal.nroTotalSubTotal),
                porcentajeDescuento: fS.roundNumber(totalPorcentajeDescuento, 1),
                htmlImpuestoTotal,
                htmlIvaTotal,
                importeTotal: fS.roundNumber(importeTotal, decimal.importeTotal)
            };
        };




        /**
         * no usar, eliminar masl adelante
         */
        /**
         * 
         * @param {*} object 
         * @returns object
         */
        // service.calculoTotales = function (params) {
        //     let { items, decimal, dataTarifaImpuesto, TAX_RATE_CODE } = params;
        //     let {
        //         ZERO_PERCENT,
        //         NOT_SUBJECT_TO_TAX,
        //         TAX_EXEMPT,
        //     } = TAX_RATE_CODE;

        //     const obj = {
        //         getSubTotalSinImpuesto: function () {
        //             let { totalSubSinImpuesto } = items.reduce((total, item) => {
        //                 let totalSubSinImpuesto = item.cantidad * item.precioUnitario;
        //                 total.totalSubSinImpuesto += totalSubSinImpuesto;
        //                 return total;
        //             }, {
        //                 totalSubSinImpuesto: 0
        //             })
        //             return totalSubSinImpuesto;
        //             // let total = items.map(val => val.subTotal).reduce((acc, curr) => acc + curr, 0); 
        //             // return total;
        //         },

        //         getTotalIva: function (codigoPorcentaje) {
        //             let { totalSubSinImpuesto, totalNetoIva } = items.reduce((total, item) => {
        //                 let totalSubSinImpuesto = item.cantidad * item.precioUnitario;
        //                 // let totalNetoIva = (item.precioUnitario - item.valorDescuento) * item.cantidad;
        //                 let totalNetoIva = ((item.precioUnitario * item.cantidad)) - item.valorDescuento;

        //                 if (item.codigoPorcentaje === codigoPorcentaje) {
        //                     total.totalSubSinImpuesto += totalSubSinImpuesto;
        //                     total.totalNetoIva += totalNetoIva;
        //                 }
        //                 return total;
        //             }, {
        //                 totalSubSinImpuesto: 0,
        //                 totalNetoIva: 0
        //             })

        //             // for (let item of items) {
        //             //     if (item.codigoPorcentaje === codigoPorcentaje) {
        //             //         total += item.subTotal
        //             //         totalNetoIva += item.total;
        //             //     }
        //             // }

        //             return [
        //                 totalSubSinImpuesto = fS.roundNumber(totalSubSinImpuesto, decimal.nroTotalSubTotal),
        //                 totalNetoIva = fS.roundNumber(totalNetoIva, decimal.nroTotalSubTotal)
        //             ]
        //         },

        //         //Get Total Ice 
        //         getTotalIce: function () {
        //             let { totalICE } = items.reduce((total, item) => {
        //                 let totalIce = item.cantidad * item.ice;
        //                 total.totalICE += totalIce;
        //                 return total;
        //             }, { totalICE: 0 })
        //             return fS.roundNumber(totalICE, decimal.nroTotalSubTotal)
        //         },

        //         //Suma columna total 
        //         getTotalDetalle: function () {
        //             let { totalNetoIva } = items.reduce((total, item) => {
        //                 //let totalNetoIva = (item.precioUnitario - item.valorDescuento) * item.cantidad;
        //                 let totalNetoIva = ((item.precioUnitario * item.cantidad)) - item.valorDescuento;
        //                 total.totalNetoIva += totalNetoIva;
        //                 return total;
        //             }, {
        //                 totalNetoIva: 0
        //             })
        //             return totalNetoIva;
        //         },

        //         getTotalPorcentajeDescuento: function () {
        //             let totalPorcentajeDescuento = 0;
        //             let subTotalSinImpuesto = obj.getSubTotalSinImpuesto();
        //             let totalDetalleNeto = obj.getTotalDetalle();
        //             // if (items.length > 0 && subTotalSinImpuesto > 0) { 
        //             //     if (totalSumDetalle > subTotalSinImpuesto) {
        //             //         totalDetalle = subTotalSinImpuesto;
        //             //     } else {
        //             //         totalDetalle = totalSumDetalle;
        //             //     }

        //             //     totalPorcentajeDescuento = ((subTotalSinImpuesto - totalDetalle) * 100) / subTotalSinImpuesto; 
        //             // }
        //             if (subTotalSinImpuesto > 0) {
        //                 totalPorcentajeDescuento = ((subTotalSinImpuesto - totalDetalleNeto) * 100) / subTotalSinImpuesto;
        //             }


        //             return fS.roundNumber(totalPorcentajeDescuento, decimal.nroPorcentaje);
        //         },

        //         getTotalDescuento: function () {
        //             let { totalDescuento } = items.reduce((total, item) => {
        //                 let totalDescuento = item.cantidad * item.valorDescuento;
        //                 total.totalDescuento += totalDescuento;
        //                 return total;
        //             }, { totalDescuento: 0 })
        //             return totalDescuento;
        //         }
        //     };


        //     let [subTotalIva, subTotalNetoIva] = obj.getTotalIva(dataTarifaImpuesto.codigoPorcentaje);
        //     let [subTotalIvaCero, subTotalNetoIvaCero] = obj.getTotalIva(ZERO_PERCENT);
        //     let [subTotalExentoIva, subTotalNetoExentoIva] = obj.getTotalIva(TAX_EXEMPT);
        //     let [subTotalNoObjetoIva, subTotalNetoNoObjetoIva] = obj.getTotalIva(NOT_SUBJECT_TO_TAX);

        //     // let iva = subTotalNetoIva * dataTarifaImpuesto.tarifa / 100;                

        //     // let total = iva + obj.getTotalDetalle();

        //     let iva = subTotalNetoIva * dataTarifaImpuesto.tarifa / 100;

        //     let total = obj.getSubTotalSinImpuesto() + iva + obj.getTotalIce();
        //     let importeTotal = total - obj.getTotalDescuento();

        //     return {
        //         subTotalSinImpuestos: fS.roundNumber(obj.getSubTotalSinImpuesto(), decimal.nroTotalSubTotal),
        //         subTotalIva,
        //         subTotalNetoIva,

        //         subTotalIvaCero,
        //         subTotalNetoIvaCero,

        //         subTotalExentoIva,
        //         subTotalNetoExentoIva,

        //         subTotalNoObjetoIva,
        //         subTotalNetoNoObjetoIva,

        //         totalDescuento: fS.roundNumber(obj.getTotalDescuento(), decimal.nroTotalSubTotal),
        //         porcentajeDescuento: fS.roundNumber(obj.getTotalPorcentajeDescuento(), decimal.nroTotalSubTotal),

        //         totalIce: obj.getTotalIce(),
        //         irbpnr: 0,
        //         propina: 0,
        //         iva: fS.roundNumber(iva, decimal.nroIva),
        //         total: fS.roundNumber(importeTotal, decimal.importeTotal)
        //     }

        // }



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
                    let valorDescuento = pricingUtils.getValorDescuento(tarifa.precioVenta, rowEntity.porcentajeDescuento);

                    rowEntity.idTarifa = idTarifa;
                    rowEntity.precioUnitario = fS.roundNumber(tarifa.precioVenta, decimal.nroPrecio);
                    rowEntity.precioConIva = fS.roundNumber(precioConIva, decimal.nroPrecio);
                    rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuentoDetalle);

                    // this.calculoColumnas["calculoTotalDetalle"](); 
                    let objCalculo = callback({
                        rowEntity,
                        oldValue: null,
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


        /**
         * 
         * @param {*} gridOptions 
         * @param {*} data 
         * @param {*} decimal 
         * @param {*} callback calculoDef ({ rowEntity, oldValue, decimal, idTarifa, columnDefs })
         */
        service.setPorcentajeDescuentoAll = function (gridOptions, data, decimal, callback) {
            for (let rowEntity of gridOptions.data) {
                rowEntity.porcentajeDescuento = data.porcentajeDescuento;

                let objCalculo = callback({
                    rowEntity,
                    oldValue: null,
                    decimal,
                    idTarifa: data.idTarifa,
                    columnDefs: gridOptions.columnDefs
                });

                objCalculo["porcentajeDescuento"]();
                objCalculo["calculoTotalDetalle"]();
            }
        }

        /**
         * Se usa para calculo de porcentaje descuento cuando ingresan valor descuento
         * 
         * @param {*} items 
         * @returns 
         */
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
            return { subTotalSinImpuestos };
        }



        return service;

    }

})(window.angular);