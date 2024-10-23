//@ts-check

app.factory('productUtil', [
    '$q',
    'articuloService',
    'formulario',
    'nombreModalInventario',
    'modalService',
    function ($q, artSvc, fS, nombreModalInventario, modalSvc) {

        let service = {
            mergeStockQty,
            calculateCantidadStock,
            ProductoVenta
        }
        function mergeStockQty(items, dataItem) {
            // Filtra los elementos que tienen las mismas propiedades idArticulo e idBodega que rowEntity.
            let foundItemByArticuloAndBodega = items.filter(item => (
                item.llevaInventario &&
                item.idArticulo === dataItem.idArticulo &&
                item.idBodega === dataItem.idBodega
            ))

            let { totalCantidadFraccionada, totalCantidadPrincipal } = foundItemByArticuloAndBodega.reduce((total, item) => {
                let medidaFraccionado = item.medidas.find(medida => medida.idMedida === item.idMedida && medida.tipo === 'FRACCIONADO')
                let medidaPrincipal = item.medidas.find(medida => medida.idMedida === item.idMedida && medida.tipo === 'PRINCIPAL')
                if (medidaFraccionado) {
                    total.totalCantidadFraccionada += item.cantidad * medidaFraccionado.conversion;
                }
                if (medidaPrincipal) {
                    total.totalCantidadPrincipal += item.cantidad * medidaPrincipal.conversion;
                }
                return total;
            }, {
                totalCantidadFraccionada: 0,
                totalCantidadPrincipal: 0
            });


            // Devuelve el objeto resultante de la fusión. 
            return {
                cantidadStock: totalCantidadPrincipal + totalCantidadFraccionada
            };
        }


        function calculateCantidadStock(data) {
            let fechaEmisionValidate = data.fechaEmision;
            let cantidadStock = data.cantidadStock;

            let dataConsolidacionFecha = data.productoConsolidaciones.find(
                cdataFecha => cdataFecha.idBodega === data.idBodega
            )

            if (dataConsolidacionFecha && dataConsolidacionFecha.fechaConsolidacion) {
                if (dataConsolidacionFecha.fechaConsolidacion >= fechaEmisionValidate) {
                    return 0;
                }
            }

            return cantidadStock < 0 ? cantidadStock : -cantidadStock;

        }


        function ProductoVenta(options, fn, editColCantidad) {

            this.esVenta = true;
            this.duplicarItem = false;
            this.idBodega = 0;
            this.items = [];
            this.tiposIva = [];
            this.idTarifa = 0;
            this.nroPrecio = 5;
            this.fechaEmision = new Date();

            this.callback = function () { };
            this.addRow = function () {
                return {
                    cantidad: 0
                }
            }

            this.editColCantidad = function () { }
            this.updateRowFn = function (params) { }



            if (typeof fn === 'function') {
                this.callback = fn;
            }

            if (typeof editColCantidad === 'function') {
                this.editColCantidad = editColCantidad;
            }


            this.setOptions(options)

        }

        ProductoVenta.prototype = {
            constructor: ProductoVenta,

            setOptions(options) {
                if (options && typeof options === 'object') {

                    if (typeof options.addRow === 'function') {

                        this.addRow = options.addRow;
                    }

                    if (typeof options.updateItem === 'function') {
                        this.updateRowFn = options.updateItem;
                    }

                    if (typeof options.duplicarItem === 'boolean') {
                        this.duplicarItem = options.duplicarItem;
                    }

                    if (options.idBodega > 0) {
                        this.idBodega = options.idBodega;
                    }

                    if (Array.isArray(options.items)) {
                        this.items = structuredClone(options.items);
                    }

                    if (Array.isArray(options.tiposIva)) {
                        this.tiposIva = options.tiposIva;
                    }

                    if (options.idTarifa > 0) {
                        this.idTarifa = options.idTarifa;
                    }

                    if (options.nroPrecio > 0) {
                        this.nroPrecio = options.nroPrecio;
                    }

                    if (options.fechaEmision) {
                        this.fechaEmision = options.fechaEmision;
                    }
                }
            },

            updateProp(key, value) {
                this[key] = value;
            },

            onTest() {
                this.callback({ hahahaha: 'ddd' })
            },
            esArticuloConInventario: function (/** @type {{ llevaInventario: boolean; idArticulo: number; }} */ item, /** @type {{ idArticulo: number; }} */ articulo) {
                return item.llevaInventario && item.idArticulo === articulo.idArticulo;
            },



            /**
             * @param {{ cantidad: number; }} item
             */
            incrementarCantidad(item, cantidad = 1) {
                item.cantidad += cantidad;
            },

            /**
             * @param {{ idArticulo?: any; codigo?: any; descripcion?: any; idImpuesto?: any; idTipoIva?: any; codigoPorcentaje?: any; tarifa?: any; ice?: any; idBodega?: any; llevaInventario?: any; datosAdicionales?: any; productoFraccionable?: any; medidas?: any; idMedida?: any; conversion?: any; precioCosto?: any; precioCostoFraccionado?: any; datosAdicionalesArticulo?: any; uniqueRowDetalle?: any; consolidacionesFecha?: any; articuloTarifas?: any; idTarifa?: any; precioUnitario?: any; precioConIva?: any; cantMinimaVentaPorMayor?: any; }} fila
             * @param {{ codigoPorcentaje: any; idArticulo: any; codigoArticulo: any; descripcion: any; idTipoIva: any; tarifa: any; valorIce: any; llevaInventario: any; datosAdicionales: any; productoFraccionable: any; cantMinimaVentaPorMayor: number; }} articulo
             * @param {any[]} medidas
             * @param {any[]} datosAdicionalesArticulo
             * @param {any} consolidacionesFecha
             */
            asignarDatosFila(fila, articulo, medidas, datosAdicionalesArticulo, consolidacionesFecha) {
                let medidaDefault = medidas.find(medida => medida.defaultMedida);
                let tipoIva = this.tiposIva.find(ti => ti.codigoPorcentaje === articulo.codigoPorcentaje);

                fila.idArticulo = articulo.idArticulo;
                fila.codigo = articulo.codigoArticulo;
                fila.descripcion = articulo.descripcion;

                fila.idImpuesto = tipoIva.idImpuesto;
                fila.idTipoIva = articulo.idTipoIva;
                fila.codigoPorcentaje = articulo.codigoPorcentaje;
                fila.tarifa = articulo.tarifa;

                fila.ice = articulo.valorIce;
                fila.idBodega = this.idBodega;
                fila.llevaInventario = articulo.llevaInventario;
                fila.datosAdicionales = articulo.datosAdicionales;
                fila.productoFraccionable = articulo.productoFraccionable;
                fila.medidas = medidas;
                fila.idMedida = medidaDefault.idMedida;

                fila.conversion = medidaDefault.conversion;
                fila.precioCosto = medidaDefault.precioCosto;

                fila.precioCostoFraccionado = medidaDefault.precioCostoFraccionado;
                
                fila.datosAdicionalesArticulo = datosAdicionalesArticulo.map(daa => ({
                    ...daa,
                    uniqueRowDetalle: fila.uniqueRowDetalle
                }));

                fila.consolidacionesFecha = consolidacionesFecha;
                fila.articuloTarifas = medidaDefault.tarifas;
                fila.idTarifa = this.idTarifa;

                let tarifa = fila.articuloTarifas.find(item => item.idTarifa === fila.idTarifa);

                fila.precioSinSubsidio = articulo.precioSinSubsidio || 0;

                fila.precioUnitario = fS.roundNumber(tarifa.precioVenta, this.nroPrecio);

                fila.precioConIva = fS.roundNumber(tarifa.precioConIva, this.nroPrecio);

                fila.cantMinimaVentaPorMayor = articulo.cantMinimaVentaPorMayor || 0;
            },

            /**
             * @param {{ uniqueRowDetalle: any; }} fila
             * @param {number} idArticulo
             * @param {any} consolidacionesFecha
             * @param {any[]} articulosDuplicados 
             */
            getParamsVerificarInventario(fila, idArticulo, consolidacionesFecha, articulosDuplicados) {
                let duplicadosFiltrados = articulosDuplicados.filter(af => af.uniqueRowDetalle !== fila.uniqueRowDetalle);

                let { cantidadStock } = mergeStockQty(
                    [...duplicadosFiltrados, fila],
                    { idArticulo, idBodega: this.idBodega }
                );

                let cantidad = calculateCantidadStock({
                    cantidadStock,
                    idBodega: this.idBodega,
                    fechaEmision: this.fechaEmision,
                    productoConsolidaciones: consolidacionesFecha
                });

                let paramsStock = {
                    idArticulo,
                    idBodega: this.idBodega,
                    cantidad
                };

                return paramsStock;

            },

            onInventario: function (/** @type {number} */ idArticulo, cantidad) { 

                const managedFetch = fS.fetchManager(artSvc.getForSale);

                managedFetch({
                    idArticulo,
                    idBodega: this.idBodega
                }).then(response => {
                    if (!response) return 
                    const {
                        articulo,
                        medidas,
                        datosAdicionalesArticulo,
                        consolidacionesFecha
                    } = response;

                    let nuevaFilaAgregada = this.addRow(), agregarFila = false;

                    let articulosDuplicadosConInventario = this.items.filter(item => this.esArticuloConInventario(item, articulo));

                    let indiceArticuloEnInventario = articulosDuplicadosConInventario.findIndex(item => this.esArticuloConInventario(item, articulo));
 
                    if (this.duplicarItem) {
                        agregarFila = true;
                        this.incrementarCantidad(nuevaFilaAgregada, cantidad);
                    } else {

                        if (articulosDuplicadosConInventario.length > 1) {
                            Swal.fire({
                                icon: 'warning',
                                html: `<small>El elemento ${articulo.descripcion} aparece más de una vez en el detalle.</small>`,
                            });
                            return
                        }

                        if (indiceArticuloEnInventario === -1) {
                            this.incrementarCantidad(nuevaFilaAgregada, cantidad);
                            agregarFila = true;
                        } else {
                            nuevaFilaAgregada = articulosDuplicadosConInventario[indiceArticuloEnInventario];
                            this.incrementarCantidad(nuevaFilaAgregada, cantidad);
                        }

                    }

 

                    this.asignarDatosFila(nuevaFilaAgregada, articulo, medidas, datosAdicionalesArticulo, consolidacionesFecha);

 
                    if (articulo.llevaInventario) {

                        const managedFetchStock = fS.fetchManager(artSvc.checkNotificationStock);
                        let paramsStock = this.getParamsVerificarInventario(
                            nuevaFilaAgregada,
                            articulo.idArticulo,
                            consolidacionesFecha,
                            articulosDuplicadosConInventario
                        )
                        managedFetchStock(paramsStock).then(verificarStockResponse => {
                            if (verificarStockResponse) {
                                this.callback({
                                    nuevaFilaAgregada,
                                    verificarStockResponse,
                                    agregarFila
                                })

                            }
                        })
                    } else {
                        this.callback({
                            nuevaFilaAgregada,
                            verificarStockResponse: null,
                            agregarFila
                        });
                    }


                })


            },

            onCantidadEdit({ items, row, oldValue, field }) {
                let articulosDuplicadosConInventario = items.filter(item => this.esArticuloConInventario(item, row));


                if (row.llevaInventario && articulosDuplicadosConInventario.length > 0) {

                    const managedFetchStock = fS.fetchManager(artSvc.checkNotificationStock);
                    let paramsStock = this.getParamsVerificarInventario(
                        row,
                        row.idArticulo,
                        row.consolidacionesFecha,
                        articulosDuplicadosConInventario
                    )
                    managedFetchStock(paramsStock).then(verificarStockResponse => {
                        if (verificarStockResponse) {
                            this.editColCantidad({
                                row,
                                verificarStockResponse,
                                oldValue,
                                field
                            })

                        }
                    })
                }

            },
            onRowUpdate(row) {

                const managedFetch = fS.fetchManager(artSvc.getForSale);

                managedFetch({
                    idArticulo: row.idArticulo,
                    idBodega: this.idBodega
                }).then(response => {
                    if (!response) return

                    const {
                        articulo,
                        medidas,
                        datosAdicionalesArticulo,
                        consolidacionesFecha
                    } = response;


                    this.asignarDatosFila(row, articulo, medidas, datosAdicionalesArticulo, consolidacionesFecha);

                    this.updateRowFn(row);



                })

            },
            openModalArticulo

        }



        async function openModalArticulo(item) {
            try {
                const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
                let ctrl = (await import(fileCtrl))[controllers['M']];
                let template = templates['M'];
                const modalDialogRef = modalSvc.open({
                    controller: ctrl,
                    template,
                    size: 'xl',
                    params: item || {},
                    isRenderRazorPartial: true
                })

                modalDialogRef.result.then(response => {
                    if (response && typeof response === 'object') {

                        //cuando es editar desde documentos de venta 
                        if (item && this.esVenta) {
                            this.onRowUpdate(item);
                            return
                        }
                        if (this.esVenta) {
                            this.onInventario(response.idArticulo);
                            return
                        }
                    }
                })
            } catch (error) {
                console.log(error);
            }

        }

        return service;








    }])