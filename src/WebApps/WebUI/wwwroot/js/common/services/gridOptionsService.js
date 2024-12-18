//@ts-check
(function () {

    'use strict';
    /**
     * Para documentos de ventas
     */

    app.factory('gridOptionsService', gridOptionsService);

    gridOptionsService.$inject = [
        'formulario',
        'pricingUtils',
        'toastService'
    ];

    function gridOptionsService(fS, pricingUtils, tS) {

        let service = {}

        /**
         * 
         * @param {*} param0 
         * @returns 
         */
        service.calculoColDef = function ({ rowEntity, oldValue, decimal, idTarifa, columnDefs }) {

            let tarifaImpuesto = columnDefs.find(item => item.field === 'idTipoIva').editDropdownOptionsArray
                .find(item => item.idTipoIva === rowEntity.idTipoIva);

            const calculoColumnas = {
                'cantidad': function () {

                    if (rowEntity.cantidad === oldValue) return


                    rowEntity.cantidad = fS.truncateNumber(rowEntity.cantidad, decimal.nroCantidad);
                    calculoColumnas["porcentajeDescuento"]();

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
                    rowEntity.precioCosto = dataMedida.precioCosto;
                    rowEntity.precioCostoFraccionado = dataMedida.precioCostoFraccionado;
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
                        tS.toastr({
                            type: 'error',
                            message: `CALCULO TIPO IVA: ${error}`
                        })
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
                        tS.toastr({
                            type: 'warning',
                            message: `CALCULO TIPO IVA: ${error}`
                        })
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

                        tS.toastr({
                            type: 'warning',
                            message: `CAMBIO DE TARIFA: ${error}`
                        })
                    }
                },
                'precioUnitario': function () {
                    try {

                        if (rowEntity.precioUnitario === oldValue) return;

                        let precioConIva = pricingUtils.calcularPrecioConIva(rowEntity.precioUnitario, tarifaImpuesto.tarifa);

                        let valorDescuento = pricingUtils.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);

                        rowEntity.precioUnitario = fS.roundNumber(rowEntity.precioUnitario, decimal.nroPrecio);
                        rowEntity.precioConIva = fS.roundNumber(precioConIva, decimal.nroPrecio);
                        rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuentoDetalle);
                        // this.setTotalRow(entity, index)

                    } catch (error) {
                        tS.toastr({
                            type: 'warning',
                            message: `CÁLCULO DE PRECIO UNITARIO: ${error}`
                        })
                    }
                },
                'precioConIva': function () {
                    try {

                        if (rowEntity.precioConIva === oldValue) return;

                        let precioUnitario = pricingUtils.calcularPrecioVenta(rowEntity.precioConIva, tarifaImpuesto.tarifa);

                        rowEntity.precioConIva = fS.roundNumber(rowEntity.precioConIva, decimal.nroPrecio);
                        rowEntity.precioUnitario = fS.roundNumber(precioUnitario, decimal.nroPrecio);

                    } catch (error) {
                        tS.toastr({
                            type: 'warning',
                            message: `CÁLCULO DE PRECIO CON IVA: ${error}`
                        })
                    }
                },
                'porcentajeDescuento': function () {
                    try {

                        if (rowEntity.porcentajeDescuento === oldValue) return

                        //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
                        if (rowEntity.porcentajeDescuento <= 100) {
                            let valorDescuento = pricingUtils.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);
                            let totalDescuento = pricingUtils.calcularValorTotalDescuento(rowEntity.cantidad, valorDescuento)

                            rowEntity.porcentajeDescuento = fS.roundNumber(rowEntity.porcentajeDescuento, decimal.nroPorcentaje);
                            rowEntity.valorDescuento = fS.roundNumber(totalDescuento, decimal.nroDescuentoDetalle);

                        } else {
                            rowEntity.porcentajeDescuento = oldValue;

                            tS.toastr({
                                type: 'warning',
                                message: 'El Porcentaje tiene que ser menor o igual a 100'
                            })
                        }

                        rowEntity.porcentajeDescuento = fS.roundNumber(rowEntity.porcentajeDescuento, decimal.nroPorcentaje);

                    } catch (error) {
                        tS.toastr({
                            type: 'warning',
                            message: `CÁLCULO DE PORCENTAJE DE DESCUENTO: ${error}`
                        })
                    }
                },
                'valorDescuento': function () {
                    try {

                        if (rowEntity.valorDescuento === oldValue) return

                        let totalAntesDescuento = pricingUtils.calcularTotalAntesDescuento(rowEntity.precioUnitario, rowEntity.cantidad);

                        if (rowEntity.valorDescuento <= totalAntesDescuento) {

                            let porcentajeDescuento = pricingUtils.getPorcentajeDescuento(totalAntesDescuento, rowEntity.valorDescuento);


                            rowEntity.valorDescuento = fS.roundNumber(rowEntity.valorDescuento, decimal.nroDescuentoDetalle);
                            rowEntity.porcentajeDescuento = fS.roundNumber(porcentajeDescuento, decimal.nroPorcentaje);

                        } else {
                            rowEntity.valorDescuento = oldValue;
                            tS.toastr({
                                type: 'warning',
                                message: 'El descuento no puede ser mayor al subtotal'
                            })
                        }

                        rowEntity.valorDescuento = fS.roundNumber(rowEntity.valorDescuento, decimal.nroDescuentoDetalle);

                    } catch (error) {
                        tS.toastr({
                            type: 'warning',
                            message: `CÁLCULO DE VALOR DE DESCUENTO: ${error}`
                        })
                    }
                },
                "calculoTotalDetalle": function () {
                    try {

                        let subtotalSinImpuesto = pricingUtils.calcularSubtotalSinImpuesto(rowEntity.precioUnitario, rowEntity.cantidad, rowEntity.valorDescuento);

                        let valorImpuesto = pricingUtils.calculateTaxValue(subtotalSinImpuesto, rowEntity.tarifa);
                        let total = pricingUtils.calcularTotalConImpuesto(subtotalSinImpuesto, valorImpuesto);
                        let totalIce = rowEntity.cantidad * rowEntity.ice;

                        // rowEntity.precioTotalSinImpuesto = fS.roundNumber(subtotalSinImpuesto, decimal.nroPrecio);
                        rowEntity.precioTotalSinImpuesto = subtotalSinImpuesto;
                        // rowEntity.valorImpuesto = fS.roundNumber(valorImpuesto, 5)
                        rowEntity.valorImpuesto = valorImpuesto;
                        // rowEntity.total = fS.roundNumber(total, decimal.nroTotalDetalle);
                        rowEntity.total = total;
                        rowEntity.totalIce = fS.roundNumber(totalIce, decimal.nroIce)
                    } catch (error) {
                        tS.toastr({
                            type: 'warning',
                            message: `CÁLCULO DE TOTAL: ${error}`
                        })
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
            const { items, decimal = { nroTotalSubTotal: 2, nroIva: 2, importeTotal: 2 }, tarifasImpuesto } = obj;

            const totalizadores = {
                totalPrecioTotalSinImpuesto: 0,
                totalIce: 0,
                totalDescuento: 0,
                totalSinImpuesto: 0,
                sumTotalIva: 0,
                totalPorcentajeDescuento: 0,
            };

            function calcularTotalesGenerales() {
                return items.reduce((acc, item) => {
                    const totalSinImpuesto = pricingUtils.calcularTotalAntesDescuento(item.precioUnitario, item.cantidad);
                    const totalIce = item.cantidad * item.ice;

                    acc.totalIce += totalIce;
                    acc.totalPrecioTotalSinImpuesto = pricingUtils.decPlus(acc.totalPrecioTotalSinImpuesto, fS.roundNumber(item.precioTotalSinImpuesto, pricingUtils.max_dos), pricingUtils.precisionMaxima);

                    acc.totalDescuento = pricingUtils.decPlus(acc.totalDescuento, item.valorDescuento, pricingUtils.precisionMaxima);

                    acc.totalSinImpuesto = pricingUtils.decPlus(acc.totalSinImpuesto, fS.roundNumber(totalSinImpuesto, pricingUtils.max_dos), pricingUtils.precisionMaxima);

                    return acc;
                }, { ...totalizadores });
            }

            function calcularTotalesPorTarifa(codigoPorcentaje) {
                const filteredItems = items.filter(item => item.codigoPorcentaje === codigoPorcentaje);
                return filteredItems.reduce((acc, item) => {
                    acc.totalNetoIva = pricingUtils.decPlus(acc.totalNetoIva, fS.roundNumber(item.precioTotalSinImpuesto, pricingUtils.max_dos), pricingUtils.precisionMaxima);
                    return acc;
                }, { totalNetoIva: 0 });
            }

            function calcularTotalIvaPorTarifa(codigoPorcentaje, tarifa) {
                const filteredItems = items.filter(item => item.codigoPorcentaje === codigoPorcentaje);
                return filteredItems.reduce((acc, item) => {
                    const totalIva = item.valorImpuesto || pricingUtils.calculateTaxValue(item.precioTotalSinImpuesto, tarifa);
                    acc.totalIva = pricingUtils.decPlus(acc.totalIva, fS.roundNumber(totalIva, pricingUtils.max_dos), pricingUtils.max_dos);
                    return acc;
                }, { totalIva: 0 });
            }


 

            function construirHtmlTotales(totales) {
                return {
                    htmlSubtotalImpuesto: `
                <tr>
                    <td class="left">
                        <span class="text-dark">Subtotal sin Impuestos</span>
                    </td>
                    <td class="right">
                        $${fS.roundNumber(totales.totalPrecioTotalSinImpuesto, pricingUtils.max_dos)}
                    </td>
                </tr>`,
                    htmlTotal: `
                <tr>
                    <td class="left">
                        <strong class="font-weight-bold">Valor Total</strong>
                    </td>
                    <td class="right font-weight-bold">
                        $${fS.roundNumber(totales.importeTotal, pricingUtils.max_dos)}
                    </td>
                </tr>`
                };
            }

            const totalesGenerales = calcularTotalesGenerales();
            let htmlImpuestoTotal = '';
            let htmlIvaTotal = '';

            tarifasImpuesto.forEach(tarifa => {
                const dataTotalNetoIva = calcularTotalesPorTarifa(tarifa.codigoPorcentaje);

                if (dataTotalNetoIva.totalNetoIva > 0) {
                    htmlImpuestoTotal += `
                <tr>
                    <td class="left">
                        <span class="text-dark">Subtotal ${tarifa.descripcion}</span>
                    </td>
                    <td class="right">
                        $${fS.roundNumber(dataTotalNetoIva.totalNetoIva, pricingUtils.max_dos)}
                    </td>
                </tr>`;
                }

                if (tarifa.tarifa > 0) {

                    let valorImpuesto = pricingUtils.calculateTaxValue(dataTotalNetoIva.totalNetoIva, tarifa.tarifa);

                  //  const dataTotalIva = calcularTotalIvaPorTarifa(tarifa.codigoPorcentaje, tarifa.tarifa);

                    //totalizadores.sumTotalIva = pricingUtils.decPlus(totalizadores.sumTotalIva, dataTotalIva.totalIva, pricingUtils.max_dos)
                    totalizadores.sumTotalIva = pricingUtils.decPlus(totalizadores.sumTotalIva, valorImpuesto, pricingUtils.max_dos);

                    if (valorImpuesto > 0) {
                        htmlIvaTotal += `
                    <tr>
                        <td class="left">
                            <span class="text-dark">${tarifa.descripcion}</span>
                        </td>
                        <td class="right">$${fS.roundNumber(valorImpuesto, pricingUtils.max_dos)}</td>
                    </tr>`;
                    }
                }
            });

            const importeTotal = totalesGenerales.totalPrecioTotalSinImpuesto + totalizadores.sumTotalIva;
           
            if (totalesGenerales.totalDescuento > 0) { 
                totalizadores.totalPorcentajeDescuento = pricingUtils.getPorcentajeDescuento(totalesGenerales.totalSinImpuesto, totalesGenerales.totalDescuento)
                
               // ((totalesGenerales.totalSinImpuesto - totalesGenerales.totalPrecioTotalSinImpuesto) * 100) / totalesGenerales.totalSinImpuesto;
            } 

            const { htmlSubtotalImpuesto, htmlTotal } = construirHtmlTotales({ ...totalesGenerales, importeTotal });

            return {
                subTotalSinImpuestos: fS.roundNumber(totalesGenerales.totalPrecioTotalSinImpuesto, pricingUtils.max_dos),
                totalIce: totalesGenerales.totalIce,
                irbpnr: 0,
                propina: 0,
                totalDescuento: fS.roundNumber(totalesGenerales.totalDescuento, decimal.nroTotalSubTotal),
                porcentajeDescuento: fS.roundNumber(totalizadores.totalPorcentajeDescuento, 1),
                htmlSubtotalImpuesto,
                htmlImpuestoTotal,
                htmlIvaTotal,
                htmlTotal,
                importeTotal: fS.roundNumber(importeTotal, pricingUtils.max_dos)
            };
        };



        service.impuestoTotalesHtml = function (obj) {
            let {
                htmlSubtotalImpuesto,
                htmlImpuestoTotal,
                totalDescuento,
                totalIce,
                irbpnr,
                htmlIvaTotal,
                htmlTotal
            } = obj;
            // Crear la estructura HTML con un template literal
            const htmlTemplate = `<div class="table-responsive">
                                        <table class="table table-clear table-sm">
                                            <tbody>
                                                ${htmlSubtotalImpuesto}
                                                ${htmlImpuestoTotal}
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Total descuento</span>
                                                    </td>
                                                    <td class="right">$${totalDescuento}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor ICE</span>
                                                    </td>
                                                    <td class="right">$${totalIce}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor irbpnr</span>
                                                    </td>
                                                    <td class="right">$${irbpnr}</td>
                                                </tr>
                                                ${htmlIvaTotal}
                                               ${htmlTotal}            
                                            </tbody>
                                        </table>
                                    </div>
                                `;


            return htmlTemplate;
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


        /**
         * 
         * @param {*} gridOptions 
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


        service.mostrarErrorCalculosProducto = function (errores) {
            // Agrupar errores por uniqueRow
            const erroresPorUniqueRow = errores.reduce((acc, error) => {
                if (!acc[error.uniqueRow]) {
                    acc[error.uniqueRow] = {
                        productoNombre: error.productoNombre,
                        errores: []
                    };
                }
                acc[error.uniqueRow].errores.push(error.errorMensaje);
                return acc;
            }, {});

            // Crear el HTML para la tabla en SweetAlert2
            const htmlContenido = Object.values(erroresPorUniqueRow).map(({ productoNombre, errores }) => {
                const filasErrores = errores.map((mensaje, index) => `
                    <tr>
                    ${index === 0 ? `<td rowspan="${errores.length}" style="border: 1px solid #ddd; padding: 8px;">${productoNombre}</td>` : ''}
                    <td style="border: 1px solid #ddd; padding: 8px;">${mensaje}</td>
                    </tr>
                `).join('');
                return filasErrores;
            }).join('');

            // Mostrar en SweetAlert2
            Swal.fire({
                title: '<small>Errores en los cálculos</small>',
                html: `
                    <table style="width:100%; border-collapse: collapse;" class="small">
                        <thead>
                            <tr>
                            <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Errores</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlContenido}
                        </tbody>
                    </table>
                `,
                icon: 'error',
                confirmButtonText: 'Aceptar',
                width: 850
            });
        }

        service.validarCalculosPorProducto = function (productos) {

            function calcularSubtotalProducto(producto) {
                //   const descuentoPorcentaje = (producto.valorDescuento || producto.descuento || 0) / 100;
                const descuentoProducto = (producto.valorDescuento || producto.descuento || 0)
                const subtotalProducto = producto.cantidad * producto.precioUnitario;
                // const descuento = subtotalProducto * descuentoPorcentaje;
                return subtotalProducto - descuentoProducto;
            }

            function calcularIVAProducto(subtotal, tasaIVA) {
                let valorImpuesto = pricingUtils.calculateTaxValue(subtotal, tasaIVA);
                return valorImpuesto;
            }

            function calcularTotalProducto(subtotal, iva) {
                return fS.plus(subtotal, iva, 5)
            }
            function getMaxDecimal(input) {
                const partes = input.toString().split(".");
                return partes.length > 1 ? partes[1].length : 1;
            }

            function validarProducto(productos) {
                const errores = [];

                for (let producto of productos) {
                    if (!producto.llevaInventario) continue;

                    const uniqueRow = fS.generateUuidv4();
                    const productoNombre = producto.descripcion;
                    const cantidadTransaccion = producto.cantidad * producto.conversion;

                    // Calcular valores esperados
                    let subtotalEsperado = calcularSubtotalProducto(producto);
                    let ivaEsperado = calcularIVAProducto(subtotalEsperado, producto.tarifa);
                    let totalEsperado = calcularTotalProducto(subtotalEsperado, ivaEsperado);

                    // Redondear valores esperados con base en los decimales del producto
                    subtotalEsperado = fS.roundNumber(subtotalEsperado, pricingUtils.max_dos);
                    ivaEsperado = fS.roundNumber(ivaEsperado, pricingUtils.max_dos);
                    totalEsperado = fS.roundNumber(totalEsperado, pricingUtils.max_dos);

                    let subtotalCalculado = fS.roundNumber(producto.precioTotalSinImpuesto, pricingUtils.max_dos);
                    let valorImpuestoCalculado = fS.roundNumber(producto.valorImpuesto, pricingUtils.max_dos);
                    let totalCalculado = fS.roundNumber(producto.total, pricingUtils.max_dos);

                    // Validar Subtotal
                    if (subtotalEsperado !==subtotalCalculado ) {
                        errores.push({
                            uniqueRow,
                            errorMensaje: `Error en Subtotal: Calculado ${subtotalCalculado}, Esperado ${subtotalEsperado}`,
                            productoNombre
                        });
                    }

                    // Validar IVA
                    if (ivaEsperado !== valorImpuestoCalculado) {
                        errores.push({
                            uniqueRow,
                            errorMensaje: `Error en IVA: Calculado ${valorImpuestoCalculado}, Esperado ${ivaEsperado}`,
                            productoNombre
                        });
                    }

                    // Validar Total
                    if (totalEsperado !== totalCalculado) {
                        errores.push({
                            uniqueRow,
                            errorMensaje: `Error en Total: Calculado <b>${totalCalculado}</b>, Esperado <b>${totalEsperado}</b>`,
                            productoNombre
                        });
                    }

                    // Validar cantidad de transacción
                    if (typeof cantidadTransaccion !== 'number') {
                        errores.push({
                            uniqueRow,
                            errorMensaje: `No se ha podido recuperar la medida correctamente. Es posible que la medida principal del artículo haya sido actualizada, y que el documento esté utilizando una medida distinta a las asignadas al artículo.`,
                            productoNombre
                        });
                    }

                }

                return {
                    esValido: errores.length === 0,
                    errores
                };
            }

            let dataValid = validarProducto(productos);
            console.log(dataValid)

            if (!dataValid.esValido) {
                service.mostrarErrorCalculosProducto(dataValid.errores)
                throw new Error(`Error en cálculos: ${JSON.stringify(dataValid)}`)
            }

            return dataValid;

        }

        return service;

    }

    /**
     * Para documentos de compras 
     */

    app.factory('gridOptionsCompraService', gridOptionsCompraService);

    gridOptionsCompraService.$inject = [
        'formulario',
        'pricingUtils'
    ];

    function gridOptionsCompraService(fS, pricingUtils) {

        let service = {}

        /**
         * 
         *  
         * @param {object} rowEntity valores de uiGridOptions
         * @param {string || number} oldValue valor numero o string 
         * @returns object 
         */



        service.calculoColDef = function ({ rowEntity, oldValue, decimal, columnDefs }) {

            let tarifaImpuesto = columnDefs.find(item => item.field === 'idTipoIva').editDropdownOptionsArray
                .find(item => item.idTipoIva === rowEntity.idTipoIva);

            const calculoColumnas = {
                'descripcion': () => {
                    let descripcion = rowEntity.descripcion || '';
                    rowEntity.descripcion = descripcion.toUpperCase();
                },
                'cantidad': function () {

                    if (rowEntity.cantidad === oldValue) return
                    rowEntity.cantidad = fS.roundNumber(rowEntity.cantidad, decimal.nroCantidad);
                    calculoColumnas["porcentajeDescuento"]();

                },
                'idMedida': function () {
                    if (rowEntity.idMedida === oldValue) return

                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);
                    rowEntity.conversion = dataMedida.conversion;
                    rowEntity.precioUnitario = fS.roundNumber(dataMedida.precioUnitario, decimal.nroPrecio)
                    rowEntity.precioCosto = fS.roundNumber(dataMedida.precioCosto, decimal.nroPrecio)
                    rowEntity.precioCostoFraccionado = fS.roundNumber(dataMedida.precioCostoFraccionado, decimal.nroPrecio)
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
                'precioUnitario': function () {
                    try {

                        if (rowEntity.precioUnitario === oldValue) return;

                        let valorDescuento = pricingUtils.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);

                        rowEntity.precioUnitario = fS.roundNumber(rowEntity.precioUnitario, decimal.nroPrecio);
                        rowEntity.valorDescuento = fS.roundNumber(valorDescuento, decimal.nroDescuentoDetalle);
                        // this.setTotalRow(entity, index)

                    } catch (error) {
                        toastr.error(`CÁLCULO DE PRECIO UNITARIO: ${error}`)
                    }
                },
                'porcentajeDescuento': function () {
                    try {

                        if (rowEntity.porcentajeDescuento === oldValue) return

                        //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
                        if (rowEntity.porcentajeDescuento <= 100) {
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

                // "totalDescuento": () => {

                //     if (rowEntity.totalDescuento === oldValue) return

                //     let result = (rowEntity.totalDescuento / rowEntity.cantidad);

                //     rowEntity.valorDescuento = fS.roundNumber(result, decimal.nroDescuentoDetalle);

                //     calculoColumnas["valorDescuento"]();

                // },
                "calculoTotalDetalle": function () {
                    try {
                        let totalDescuento = rowEntity.cantidad * rowEntity.valorDescuento;
                        let precioTotalSinImpuesto = ((rowEntity.precioUnitario * rowEntity.cantidad)) - rowEntity.valorDescuento;
                        let valorImpuesto = pricingUtils.calculateTaxValue(precioTotalSinImpuesto, rowEntity.tarifa);
                        let total = precioTotalSinImpuesto + valorImpuesto;
                        let totalIce = rowEntity.cantidad * rowEntity.ice;

                        rowEntity.totalDescuento = fS.roundNumber(totalDescuento, decimal.nroDescuentoDetalle)
                        rowEntity.precioTotalSinImpuesto = fS.roundNumber(precioTotalSinImpuesto, decimal.nroTotalDetalle);
                        rowEntity.valorImpuesto = fS.roundNumber(valorImpuesto, decimal.nroIva)
                        rowEntity.total = fS.roundNumber(total, decimal.nroTotalDetalle);
                        rowEntity.totalIce = fS.roundNumber(totalIce, decimal.nroIce)
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
            let { items, decimal, tarifasImpuesto } = obj;

            if (!decimal) {
                decimal = {
                    nroTotalSubTotal: 2,
                    nroIva: 2,
                    importeTotal: 2
                }
            }

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
                let filteredItems = items.filter(item => item.codigoPorcentaje === dataTarifaImpuesto.codigoPorcentaje);

                let { totalNetoIva } = filteredItems.reduce((acc, prev) => {
                    // Calcular el total neto con descuentos 
                    let precioTotalSinImpuesto = (prev.precioUnitario * prev.cantidad) - prev.valorDescuento;
                    acc.totalNetoIva += precioTotalSinImpuesto;

                    return acc;
                }, {
                    totalNetoIva: 0
                });

                // Construir el HTML para la tabla de impuestos
                if (totalNetoIva > 0) {

                    htmlImpuestoTotal += `<tr>
                                    <td class="left">
                                        <span class="text-dark">Subtotal ${dataTarifaImpuesto.descripcion}</span>
                                    </td>
                                    <td class="right">$${fS.roundNumber(totalNetoIva, decimal.nroTotalSubTotal)}</td>
                                </tr>`;
                }

                if (dataTarifaImpuesto.tarifa > 0) {
                    let { totalIva } = filteredItems.reduce((acc, prev) => {
                        // Calcular el total neto con descuentos 
                        let precioTotalSinImpuesto = (prev.precioUnitario * prev.cantidad) - prev.valorDescuento;
                        acc.totalIva += pricingUtils.calculateTaxValue(precioTotalSinImpuesto, prev.tarifa);
                        return acc;
                    }, {
                        totalIva: 0,
                    });

                    sumTotalIva += totalIva;

                    if (totalIva > 0) {
                        htmlIvaTotal += `
                                    <tr>
                                        <td class="left">
                                            <span class="text-dark">${dataTarifaImpuesto.descripcion}</span>
                                        </td>
                                        <td class="right">$${fS.roundNumber(totalIva, decimal.nroIva)}</td>
                                    </tr>`

                    }
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