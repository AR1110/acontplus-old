//@ts-check
(function () {

    let mainPath = `/Home/Index?name=~/Pages/AprobacionDocumento/`;
    app.component('aprobarDocumentoComponente', {
        templateUrl: `${mainPath}_ModalAprobacionDocumento.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',
        },

        controller: ['$scope', '$rootScope', '$injector', '$timeout', function ($scope, $rootScope, $injector, $timeout) {

            const $ctrl = this;
            const DOC_TYPE = $injector.get('DOC_TYPE');
            const aprobacionDocSvc = $injector.get('aprobacionDocService');
            const fS = $injector.get('formulario')
            const articuloSvc = $injector.get('articuloService')

            const notaEntregaSvc = $injector.get('notaEntregaService');
            const proformaSvc = $injector.get('proformaService');
            const facturaSvc = $injector.get('facturaService');

            const gridOptionsSvc = $injector.get('gridOptionsService');
            const tS = $injector.get('toastService')
            const SRI_IDENTIFITION_CODE = $injector.get('SRI_IDENTIFITION_CODE');
            let productUtil = $injector.get('productUtil');


            let docDestino;
            $scope.docOrigenDesc = "";
            $scope.docDestinoDesc = "";

            $scope.data = {};

            $scope.mostrarFormasPago = false;

            $scope.cliente = {};

            $scope.dataClone = {};


            $scope.dataDisabled = {
                isDisabledSucursal: true,
                isDisabledPuntoEmision: true
            }

            $scope.datosAdicionalesArticulo = [];
            $scope.historyDatosAdicionales = []

            $scope.config = {};
            $scope.vendedores = [];

            $scope.infoAdicionalDocumento = [];

            $scope.formasPago = [];
            $scope.config = [];

            $scope.dataFormaPago = {
                idFormaPagoSri: 0,
                idTiempoCredito: 0,
                plazo: 1,
                total: 0
            }

            //GridOptions Invoice 
            $scope.gridOptions = {
                enableColumnMenus: false,
                enableColumnReordering: true,
                showGridFooter: false,
            }

            let detallesDeleted = [];

            $scope.refProductoVenta = new productUtil.ProductoVenta({}, onCallbackDataArticulo, editColCantidad)

            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
                if ($scope.gridApi) {
                    $timeout(() => {
                        $scope.gridApi.core.handleWindowResize();
                        $scope.gridApi.grid.refresh();
                    }, 5);
                }

                gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                    const isEmpty = (value) => [null, "", undefined].includes(value);
                    const negativeFields = [
                        "cantidad",
                        "precioUnitario",
                        "precioConIva",
                        "valorDescuento",
                        "porcentajeDescuento"
                    ];
                    const stockFields = ["idMedida", "cantidad", "idBodega"];

                    // Validar campos vacíos
                    if (isEmpty(rowEntity[colDef.field])) {
                        rowEntity[colDef.field] = oldValue;
                    }

                    // Validación de números negativos
                    if (negativeFields.includes(colDef.field) && newValue < 0) {
                        rowEntity[colDef.field] = oldValue;
                    }

                    // Validación de cantidad igual a 0
                    if (colDef.field === "cantidad" && Number(rowEntity[colDef.field]) === 0) {
                        rowEntity[colDef.field] = 1;
                    }

                    // Evitar la validación redundante de 'idMedida' y 'cantidad' si no cambian
                    if (colDef.field === "idMedida" && rowEntity.idMedida === oldValue) return;
                    if (colDef.field === "cantidad" && rowEntity.cantidad === oldValue) return;

                    // Verificación del stock
                    if (stockFields.includes(colDef.field) && rowEntity[colDef.field] !== oldValue) {
                        if (colDef.field === "cantidad" && rowEntity.cantidad > oldValue) {
                            checkNotificationStock(colDef.field, rowEntity, oldValue);
                        } else {
                            checkNotificationStock(colDef.field, rowEntity, oldValue);
                        }
                        return;
                    }

                    // Cálculos y actualización del producto
                    setCalculoTotales(colDef.field, rowEntity, oldValue);
                    updateRefProductoVenta();

                })
            }

            $scope.onChangeEstab = onChangeEstab;
            $scope.onChangeTiempoCredito = onChangeTiempoCredito;
            $scope.onChangeFechaEmision = onChangeFechaEmision;
            $scope.onChangeTarifaGeneral = onChangeTarifaGeneral;
            $scope.askToDeleteRow = askToDeleteRow;
            $scope.openModalArticulo = openModalArticulo;

            async function onChangeEstab() {
                try {
                    let { isConfirmed } = await Swal.fire({
                        title: 'Cambiar Establecimiento?',
                        text: "Se cambiará puntos de Emisión y la bodega en el detalle!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, cambiar!',
                        cancelButtonText: 'No, cancelar!',
                    })

                    if (isConfirmed) {

                        let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);

                        if (dataEstab.puntosEmision.length === 0) {
                            tS.toastr('info', 'No tienes Puntos de Emisión asignado a este establecimiento');
                            $scope.data.codEstab = $scope.dataClone.codEstab;
                            $scope.$apply();
                            return
                        }
                        if (dataEstab.bodegas.length === 0) {
                            tS.toastr('info', 'No tienes bodegas asignado a este establecimiento');
                            $scope.data.codEstab = $scope.dataClone.codEstab;
                            $scope.$apply();
                            return
                        }

                        //Impuesto Tarifa
                        // $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                        // $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];

                        //Puntos de Emision 
                        $scope.ptosEmision = dataEstab.puntosEmision;

                        let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                        $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                        //Bodegas 
                        $scope.bodegas = dataEstab.bodegas;

                        let dataBodega = $scope.bodegas.find(item => (item.defaultBodega));
                        $scope.data.idBodega = dataBodega.idBodega;

                        $scope.dataClone.codEstab = $scope.data.codEstab;

                        setIdBodegaInDetalle();
                        resetCantidadToZeroAndRecalculateTotals();
                        setWarehouseAndIVA();
                    } else {
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                    }

                } catch (error) {
                    console.log(error);
                }
            }


            function onChangeTiempoCredito() {
                if (!$scope.permisoComprobanteVenta.tiempoCredito) {
                    tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                    $scope.data.idTiempoCredito = $scope.dataClone.idTiempoCredito
                }
                getFechaVencimiento();
            }

            function onChangeFechaEmision() {
                if (!$scope.permisoComprobante.fechaEmision) {
                    tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                    $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
                }
                getFechaVencimiento();
                updateRefProductoVenta()
            }


            function onChangeTarifaGeneral() {
                if (!$scope.permisoComprobanteVenta.tarifa) {
                    $scope.data.idTarifa = $scope.dataClone.idTarifa;
                    tS.toastr("warning", "No tienes permiso para realizar esta acción");
                    return;
                }

                let tarifa = $scope.tarifas.find(
                    (item) => item.idTarifa === $scope.data.idTarifa
                );
                Swal.fire({
                    html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: `Sí, cambiar!`,
                    cancelButtonText: "No, cancelar!",
                    allowOutsideClick: false,
                }).then(result => {


                    if (result.isConfirmed) {
                        $scope.dataClone.idTarifa = $scope.data.idTarifa;

                        if ($scope.gridOptions.data.length > 0 &&
                            gridOptionsSvc.setTarifaInDetail(
                                $scope.gridOptions,
                                $scope.data.idTarifa,
                                $scope.decimal,
                                gridOptionsSvc.calculoColDef
                            )
                        ) {
                            drawImpuestoTotales();
                        }
                        $scope.$apply();
                    } else {
                        $scope.data.idTarifa = $scope.dataClone.idTarifa;
                        $scope.$apply();
                    }

                    updateRefProductoVenta()
                })


            };



            async function askToDeleteRow(rowEntity) {
                try {
                    $scope.indexRowDetalle = null;
                    let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                    if (isConfirmed) {
                        let index = $scope.gridOptions.data.indexOf(rowEntity);
                        $scope.gridOptions.data.splice(index, 1);

                        if (rowEntity.idAprob_Document_Detailt > 0) {
                            detallesDeleted.push({
                                ...rowEntity,
                                cantidad: rowEntity.cantidadOriginal,
                                estado: 0
                            });
                        }

                        //Recalculamos los totales 
                        $scope.setCalculoTotales("cantidad", rowEntity, 0);
                        setCountDetalle()
                        updateRefProductoVenta()
                        $scope.$apply();
                    }

                    if (isConfirmed && rowEntity.datosAdicionales) {
                        $scope.datosAdicionalesArticulo = $scope.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.idArticulo);
                        $scope.historyDatosAdicionales = $scope.historyDatosAdicionales.filter(val => val.idArticulo !== rowEntity.idArticulo);
                    }
                } catch (error) {
                    console.log(error);
                }
            }


            function openModalArticulo(item) {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[0],
                    $scope.gridOptions.columnDefs[2]
                )

                $scope.refProductoVenta.openModalArticulo(item);
            };

            function setIdBodegaInDetalle() {
                for (let item of $scope.gridOptions.data) {
                    item.idBodega = $scope.data.idBodega;
                }
                updateRefProductoVenta()
            }

            function resetCantidadToZeroAndRecalculateTotals() {
                try {
                    for (let rowEntity of $scope.gridOptions.data) {
                        if (!rowEntity.llevaInventario) continue;

                        rowEntity.cantidad = 0;

                        let objCalculo = gridOptionsSvc.calculoColDef({
                            rowEntity,
                            oldValue: null,
                            decimal: $scope.decimal,
                            idTarifa: $scope.data.idTarifa,
                            columnDefs: $scope.gridOptions.columnDefs,
                        });

                        objCalculo["cantidad"] && objCalculo["cantidad"]();
                        objCalculo["calculoTotalDetalle"]();
                    }
                    drawImpuestoTotales()
                } catch (error) {
                    console.log(error);
                }
            }



            async function onCallbackDataArticulo(data) {

                const { nuevaFilaAgregada, verificarStockResponse, agregarFila, focusSearch } = data;

                if (!nuevaFilaAgregada.llevaInventario && agregarFila) {
                    addItem(nuevaFilaAgregada)
                    return;
                }


                const { code, message, titleSms } = verificarStockResponse;
                // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
                if (code === "1") {
                    if (agregarFila) {
                        addItem(nuevaFilaAgregada)
                    } else {
                        updateItem(nuevaFilaAgregada);
                    }
                    return;
                }

                // Muestra un mensaje de advertencia y espera la confirmación del usuario.
                Swal.fire({
                    title: `<small>${titleSms}</small>`,
                    icon: 'warning',
                    html: `<small>${message}</small>`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(r => {
                    if (r.isConfirmed) {
                        handleConfirmation(code, nuevaFilaAgregada, agregarFila, focusSearch);
                    }
                })
            }

            // Función para manejar la confirmación del usuario y el código de respuesta
            /**
             * @param {string} code
             * @param {any} nuevaFilaAgregada
             * @param {any} agregarFila
             * @param {undefined} [focusSearch]
             */
            function handleConfirmation(code, nuevaFilaAgregada, agregarFila, focusSearch) {
                if (code === "0" && focusSearch) {
                    setFocusArticulo();
                }
                if (code === "2") {
                    if (agregarFila) {
                        addItem(nuevaFilaAgregada);
                    } else {
                        updateItem(nuevaFilaAgregada);
                    }
                }
            };

            function setFocusArticulo() {
                $timeout(function () {
                    let el = document.getElementById(
                        "custom-template-md-autocomplete-articulo"
                    );
                    if (el) {
                        el.focus();
                    }
                }, 100);
            }

            function editColCantidad(data) {
                const {
                    row,
                    verificarStockResponse,
                    oldValue,
                    field
                } = data;

                const { code, message, titleSms } = verificarStockResponse;

                if (code === "1") {
                    setCalculoTotales(field, row, oldValue);
                    updateRefProductoVenta()
                    return
                }

                Swal.fire({
                    title: `<small>${titleSms}</small>`,
                    icon: 'warning',
                    html: `<small>${message}</small>`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(result => {
                    if (result.isConfirmed) {
                        if (code === "0") {
                            row[field] = oldValue;
                            setCalculoTotales(field, row, oldValue);
                            let el = document.getElementById("#custom-template-md-autocomplete-articulo")
                            if (el) {
                                el.focus();
                            }
                        }
                        if (code === "2") {
                            setCalculoTotales(field, row, oldValue);
                        }
                        updateRefProductoVenta()
                        $scope.$apply()
                    }
                })

            }

            function updateRefProductoVenta() {
                $scope.refProductoVenta.setOptions({
                    items: $scope.gridOptions.data,
                    nroPrecio: $scope.decimal.nroPrecio,
                    idTarifa: $scope.data.idTarifa,
                    idBodega: $scope.data.idBodega,
                    tiposIva: $scope.tarifasImpuesto,
                    fechaEmision: $scope.data.fechaEmision,
                    duplicarItem: $scope.config.detailDuplicate,
                    addRow,
                    updateItem
                })
            }

            function addRow() {
                const obj = {
                    uniqueRowDetalle: fS.generateUuidv4(),
                    idFacturaDetalle: 0,
                    idAprob_Document_Detailt: 0,
                    n: 1,
                    codigo: "",
                    idArticulo: 0,
                    descripcion: "",
                    cantidad: 0,
                    cantidadStock: 0,
                    codigoPorcentaje: "",
                    tarifa: 0,
                    articuloTarifas: [],
                    idTarifa: 0,
                    precioUnitario: 0,
                    precioConIva: 0,
                    porcentajeDescuento: 0,
                    valorDescuento: 0,
                    totalDescuento: 0,
                    ice: 0,
                    idBodega: 0,
                    subTotal: 0,
                    total: 0,
                    nota: null,
                    llevaInventario: false,
                    datosAdicionales: false,
                    estado: 1,
                };
                return structuredClone(obj)
            }

            function getIndexRow(row) {
                return $scope.gridOptions.data.findIndex(item => item.uniqueRowDetalle === row.uniqueRowDetalle)
            }
            /**
             * 
             * @param {*} nuevaFilaAgregada 
             */
            function addItem(nuevaFilaAgregada) {
                $scope.gridOptions.data.push(nuevaFilaAgregada)
                setCalculoTotales('precioUnitario', nuevaFilaAgregada, 0);
                focusColumnCantidad(getIndexRow(nuevaFilaAgregada), nuevaFilaAgregada.llevaInventario);
                updateRefProductoVenta()
            }

            function focusColumnCantidad(index, llevaInventario) {
                let indexCol = 0;

                if (($scope.config.searchCode == 1)) {
                    //  setFocusInputBarcode();
                    return
                }

                if (llevaInventario) {
                    indexCol = $scope.gridOptions.columnDefs.findIndex(
                        (item) => item.field === "cantidad"
                    );
                } else {
                    indexCol = $scope.gridOptions.columnDefs.findIndex(
                        (item) => item.field === "descripcion"
                    );
                }
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[0],
                    $scope.gridOptions.columnDefs[2]
                );
                $timeout(() => {
                    $scope.gridApi.cellNav.scrollToFocus(
                        $scope.gridOptions.data[index],
                        $scope.gridOptions.columnDefs[indexCol]
                    );
                    $scope.indexRow = null;
                }, 30);

                setCountDetalle();
            }

            function setCountDetalle() {
                $scope.gridOptions.data.forEach((item, index) => {
                    item.n = index + 1;
                })
            }


            function updateItem(nuevaFilaAgregada) {

                // Actualizar el elemento en los datos de gridOptions basado en uniqueRowDetalle
                $scope.gridOptions.data = $scope.gridOptions.data.map(item =>
                    item.uniqueRowDetalle === nuevaFilaAgregada.uniqueRowDetalle
                        ? { ...item, ...nuevaFilaAgregada }  // Actualiza la fila si coincide el uniqueRowDetalle
                        : item  // Mantiene el item sin cambios si no coincide
                );

                // Buscar la fila actualizada
                const dataActualizarFile = $scope.gridOptions.data.find(item =>
                    item.uniqueRowDetalle === nuevaFilaAgregada.uniqueRowDetalle
                );

                if (dataActualizarFile) {
                    // Realiza el cálculo de los totales basándose en 'precioUnitario'
                    setCalculoTotales('precioUnitario', dataActualizarFile, 0);
                    focusColumnCantidad(getIndexRow(nuevaFilaAgregada), nuevaFilaAgregada.llevaInventario);
                }

                // Actualiza la referencia del producto vendido
                updateRefProductoVenta();

                // Muestra una notificación de éxito

            }


            /**
                 *
                 * @param {*} colField nombre de la columnas
                 * @param {*} rowEntity datos del item
                 * @param {*} oldValue valor anterior de la columna
                 */
            function setCalculoTotales(colField, rowEntity, oldValue) {
                //calculoColDef recibbe params obj: {rowEntity, oldValue, decimal, idTarifa, columnDefs}
                let objCalculo = gridOptionsSvc.calculoColDef({
                    rowEntity,
                    oldValue,
                    decimal: $scope.decimal,
                    idTarifa: $scope.data.idTarifa,
                    columnDefs: $scope.gridOptions.columnDefs,
                });

                objCalculo[colField] && objCalculo[colField]();

                objCalculo["calculoTotalDetalle"]();
                drawImpuestoTotales();
            }

            /**
            * Comprueba la notificación de stock al modificar un campo en una fila de la cuadrícula.
            * @param {string} field - Campo modificado.
            * @param {*} rowEntity - Objeto de fila actual.
            * @param {*} oldValue - Valor anterior del campo modificado.
            */

            function checkNotificationStock(field, rowEntity, oldValue) {
                try {
                    // Si la fila no lleva inventario, realiza cálculos totales y termina la función.
                    if (!rowEntity.llevaInventario) {
                        setCalculoTotales(field, rowEntity, oldValue);
                        return;
                    }

                    $scope.refProductoVenta.onCantidadEdit({
                        items: $scope.gridOptions.data,
                        row: rowEntity,
                        oldValue,
                        field
                    })
                } catch (error) {
                    console.log(error);
                }
            }




            function calculateTotalItems(items) {
                return items.map(item => {
                    let porcentajeDescuento = item.precioUnitario === 0 ? 0 : (item.valorDescuento / item.precioUnitario) * 100;
                    let total = item.precioTotalSinImpuesto + item.valorImpuesto;
                    return {
                        ...item,
                        precioConIva: fS.roundNumber(item.precioConIva, $scope.decimal.nroPrecio),
                        total: fS.roundNumber(total, 5),
                        porcentajeDescuento: fS.roundNumber(porcentajeDescuento, $scope.decimal.nroPorcentaje)
                    }

                })
            }

            $ctrl.$onInit = function () {
                const { params } = $ctrl.resolve;
                console.log($ctrl)
                console.log(params)

                let { docOrigenDesc, docDestinoDesc, data, mainDataForm, formasPagoSri } = params
                let { comprobante, cliente, detalles, items, datosAdicionalesArticulo, config } = data;

                docDestino = params.docDestino;
                $scope.mostrarFormasPago = docDestino === DOC_TYPE.FV_SRI;

                $scope.data = comprobante;

                $scope.docOrigenDesc = docOrigenDesc;
                $scope.docDestinoDesc = docDestinoDesc;

                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;

                $scope.cliente = cliente;



                $scope.formasPago = formasPagoSri;
                $scope.config = config;



                $scope.datosAdicionalesArticulo = datosAdicionalesArticulo || [];
                $scope.historyDatosAdicionales = $scope.datosAdicionalesArticulo.map(item => ({
                    idArticulo: item.idArticulo,
                    idInfoAdicional: item.idInfoAdicional,
                    selected: true,
                }))


                loadFormData(mainDataForm, detalles || items)


            }

            function loadFormData(mainDataForm, detalles) {
                try {

                    let {
                        estabs,

                        tarifasImpuesto,
                        tiemposCredito,
                        tarifas,
                        permisoVenta,
                        decimal,
                        vendedores,
                        config
                    } = mainDataForm;
                    console.log(mainDataForm)

                    /**
                     * Establecimiento - Impuesto Tarifa 
                     */
                    $scope.establecimientos = estabs;
                    console.log(estabs)
                    const codEstab = $scope.establecimientos.flatMap((dt) => dt.puntosEmision).find((dt) => dt.idPuntoEmision === $scope.data.idPuntoEmision).codEstab;

                    let dataEstab = $scope.establecimientos.find(item => (item.codEstab === codEstab))

                    $scope.data.codEstab = dataEstab.codEstab;
                    $scope.dataClone.codEstab = $scope.data.codEstab;


                    //===========Puntos Emisiones============================================== 
                    $scope.ptosEmision = dataEstab.puntosEmision;
                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                    $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                    //============Bodegas======================================================= 
                    $scope.bodegas = dataEstab.bodegas;
                    let dataBodega = $scope.bodegas.find(item => (item.defaultBodega))
                    $scope.data.idBodega = dataBodega.idBodega;

                    //Decimal 
                    $scope.decimal = decimal;

                    //Tipo Ivas 
                    $scope.tarifasImpuesto = tarifasImpuesto;

                    //Tarifas(PVP1, PVP2)
                    $scope.tarifas = tarifas;
                    $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                    $scope.dataClone.idTarifa = $scope.data.idTarifa;

                    $scope.tiempoCreditos = tiemposCredito;
                    //Permisos para detalle y documento    
                    $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                    $scope.permisoDetalleVenta = permisoVenta.detalle;

                    //Vendedores-usuarios
                    $scope.vendedores = vendedores;
                    $scope.config = config;

                    if ($scope.tiempoCreditos.length > 0) {
                        let dataTiempoCredito = $scope.tiempoCreditos[0];
                        $scope.data.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                        $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;

                        //Formas Pago 
                        $scope.dataFormaPago.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                        $scope.dataFormaPago.plazo = dataTiempoCredito.diasCredito;
                    }

                    //Por defecto tomamos SIN UTILIZACION DEL SISTEMA FINANCIERO 
                    if ($scope.formasPago.length > 0) {
                        setDataFormaPagoSri();
                    }





                    setColumnDefs();
                    $scope.gridOptions.data = calculateTotalItems(detalles);
                    getFechaVencimiento();


                    drawImpuestoTotales();


                } catch (error) {
                    console.log(error);
                }

            }


            function setColumnDefs() {

                const ventaDetailPermission = $scope.permisoDetalleVenta

                $scope.gridOptions.columnDefs = [{
                    name: 'Op.',
                    enableCellEdit: false,
                    width: '5%',
                    minWidth: '100',
                    cellTemplate: `
                        <button type="button" ng-click="grid.appScope.askToDeleteRow(row.entity)" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                            <i class="fa fa-trash"></i>
                        </button>
    
                        <button type="button"  update-article class= "btn btn-success btn-xs text-white" ng-click="grid.appScope.openModalArticulo(row.entity)" title = "Editar Articulo" >
                            <i class="fa fa-edit"></i>
                        </button > 
    
                        <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.historyDatosAdicionales" result-modal-adicional="grid.appScope.resultModalAdicional(result)" datos-adicionales="grid.appScope.datosAdicionalesArticulo" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`
                },
                {
                    name: 'Cód.',
                    field: 'codigo',
                    width: '8%',
                    minWidth: '100',
                    enableCellEdit: false,
                },
                {
                    name: 'Descripción',
                    field: 'descripcion',
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
                    cellEditableCondition: (scope) => scope.row.entity.llevaInventario !== true,
                    cellTooltip: (row) => row.entity.descripcion,
                    width: '25%',
                    minWidth: '100'
                },
                {
                    name: 'Cant.',
                    field: 'cantidad',
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
                    type: 'number',
                    width: '6%',
                    minWidth: '50',
                },
                {
                    name: 'Medida',
                    field: 'idMedida',
                    enableCellEdit: ventaDetailPermission.medida,
                    enableCellEditOnFocus: ventaDetailPermission.medida,
                    allowCellFocus: ventaDetailPermission.medida,
                    cellFilter: 'mapMedida:row.entity.medidas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsFunction: (rowEntity) => rowEntity.medidas.map(val => ({
                        id: val.idMedida,
                        value: val.descripcion
                    })),
                    type: 'number',
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'I.V.A',
                    field: 'idTipoIva',
                    width: '8%',
                    minWidth: '100',
                    type: 'number',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'cellFilterTipoIva:this',
                    editDropdownValueLabel: 'descripcion',
                    editDropdownIdLabel: 'idTipoIva',
                    enableCellEdit: ventaDetailPermission.tipoIva,
                    allowCellFocus: ventaDetailPermission.tipoIva,
                    enableCellEditOnFocus: ventaDetailPermission.tipoIva,
                    //    visible: config.porcentajeIva
                },

                {
                    name: 'Tarifa',
                    field: 'idTarifa',
                    width: '9%',
                    minWidth: '80',
                    cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    enableCellEdit: ventaDetailPermission.tarifa,
                    enableCellEditOnFocus: ventaDetailPermission.tarifa,
                    allowCellFocus: ventaDetailPermission.tarifa,
                    editDropdownOptionsFunction: (rowEntity) => {
                        return rowEntity.articuloTarifas.map(val => ({
                            id: val.idTarifa,
                            value: val.tarifa + ' - $' + val.precioConIva
                        }))
                    },
                },
                {
                    name: 'Precio U.',
                    field: 'precioUnitario',
                    enableCellEditOnFocus: true,
                    enableColumnMenu: false,
                    allowCellFocus: true,
                    type: 'number',
                    width: '8%',
                    minWidth: '90',
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario : true;
                    },
                    // cellFilter: "currency:'$'",
                },
                {
                    name: 'P. Iva',
                    field: 'precioConIva',
                    min: 0,
                    type: 'number',
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
                    width: '7%',
                    minWidth: '90',
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva : true;
                    },
                    // cellFilter: "currency:'$'",
                },
                {
                    name: '%',
                    field: 'porcentajeDescuento',
                    enableCellEdit: ventaDetailPermission.porcentajeDescuento,
                    allowCellFocus: ventaDetailPermission.porcentajeDescuento,
                    enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento,
                    min: 0,
                    width: '4%',
                    minWidth: '60',
                    // cellFilter: "currency:'%'",
                    visible: ventaDetailPermission.porcentajeDescuento || false,
                    type: 'number',
                    /*cellFilter: "limitTo:3",*/
                },
                {
                    name: 'Desc.',
                    field: 'valorDescuento',
                    enableCellEdit: ventaDetailPermission.descuento,
                    enableCellEditOnFocus: ventaDetailPermission.descuento,
                    allowCellFocus: ventaDetailPermission.descuento,
                    min: 0,
                    type: 'number',
                    width: '4%',
                    minWidth: '65',
                    // cellFilter: "currency:'$'",
                    visible: ventaDetailPermission.descuento || false
                },
                {
                    name: 'SubTotal',
                    field: 'precioTotalSinImpuesto',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: 'number',
                    width: '7%',
                    minWidth: '50',
                    visible: true,
                    cellFilter: fS.cellFilterRoundToNumber(),
                    cellTooltip: function (row, col) {
                        return fS.cellTooltipGrid(row.entity, col.field)
                    },
                },
                {
                    name: 'IVA',
                    field: 'valorImpuesto',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: 'number',
                    width: '5%',
                    minWidth: '50',
                    visible: true,
                    cellFilter: fS.cellFilterRoundToNumber(),
                    cellTooltip: function (row, col) {
                        return fS.cellTooltipGrid(row.entity, col.field)
                    },
                },
                {
                    name: 'Total',
                    field: 'total',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: 'number',
                    width: '5%',
                    minWidth: '100',
                    visible: true,
                    cellFilter: fS.cellFilterRoundToNumber(),
                    cellTooltip: function (row, col) {
                        return fS.cellTooltipGrid(row.entity, col.field)
                    },
                },
                {
                    name: 'Ice',
                    field: 'ice',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: 'number',
                    width: '6%',
                    minWidth: '100',
                    // cellFilter: "currency:'$'",
                    visible: false
                },
                {
                    name: 'Nota',
                    field: 'nota',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: 'string',
                    width: '15%',
                    minWidth: '100'
                },
                {
                    name: 'bodega',
                    field: 'idBodega',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'cellFilterBodega:this',
                    editDropdownValueLabel: 'descripcion',
                    editDropdownIdLabel: 'idBodega',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: 'number',
                    width: '11%',
                    minWidth: '100'
                },
                ]

                setWarehouseAndIVA();
            }

            /**
     * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
     */
            function setWarehouseAndIVA() {
                let indexTipoIva = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idTipoIva');
                let indexBodega = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
                $scope.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
                $scope.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
            }


            function getFechaVencimiento() {
                if ($scope.data.fechaEmision && $scope.tiempoCreditos.length > 0) {

                    let tiempoCredito = $scope.tiempoCreditos.find(item => item.idTiempoCredito === $scope.data.idTiempoCredito);
                    let diasCredito = typeof tiempoCredito === 'object' ? tiempoCredito.diasCredito : 0;
                    let fechaEmision = fS.setHoursToDate($scope.data.fechaEmision)

                    let {
                        fechaVencimiento,
                        fechaEmisionEscrita,
                        fechaVencimientoEscrita
                    } = fS.sumarDiasAFecha(fechaEmision, diasCredito);

                    // var formattedDateTime = moment(fechaVencimiento).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss");

                    $scope.data.fechaVencimiento = new Date(fechaVencimiento);
                    $scope.data.fechaEmisionEscrita = fechaEmisionEscrita;
                    $scope.data.fechaVencimientoEscrita = fechaVencimientoEscrita;

                    //Variables temporales
                    $scope.dataClone.fechaEmision = fechaEmision;
                    $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;

                    //Formas pago
                    $scope.dataFormaPago.idTiempoCredito = $scope.data.idTiempoCredito;
                    $scope.dataFormaPago.plazo = diasCredito;
                }
            }



            function setDataFormaPagoSri() {
                let dataFormaPago = {};
                if ($scope.cliente.idFormaPagoSri > 0) {
                    dataFormaPago = findFormaPagoById($scope.cliente.idFormaPagoSri);
                }
                else if ($scope.dataFormaPago.idFormaPagoSri > 0) {
                    dataFormaPago = findFormaPagoById($scope.dataFormaPago.idFormaPagoSri);
                } else {
                    dataFormaPago = $scope.formasPago.find(item => {
                        if ($scope.config.idFormaPagoSri > 0) {
                            return (item.idFormaPagoSri === $scope.config.idFormaPagoSri);
                        } else {
                            return (item.codigo === '01');
                        }
                    }) || {};
                }
                $scope.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
                $scope.dataFormaPago.infoReferencia = dataFormaPago.infoReferencia;

                function findFormaPagoById(idFormaPagoSri) {
                    return $scope.formasPago.find(item => item.idFormaPagoSri === idFormaPagoSri) || {};
                }

            }

            $scope.onChangeFormaPago = function () {
                $scope.cliente.idFormaPagoSri = 0;
                setDataFormaPagoSri();
            }

            function drawImpuestoTotales() {
                try {
                    const getTotals = gridOptionsSvc.getImpuestoTotales({
                        items: $scope.gridOptions.data,
                        decimal: $scope.decimal,
                        tarifasImpuesto: $scope.tarifasImpuesto.slice(),
                    });
                    let {
                        subTotalSinImpuestos,
                        irbpnr,
                        importeTotal,
                        totalDescuento,
                        porcentajeDescuento,
                        propina,
                    } = getTotals;
                    const htmlTemplate = gridOptionsSvc.impuestoTotalesHtml(getTotals);

                    drawElementHTMLTotals(htmlTemplate)

                    $scope.data.subTotalSinImpuestos = subTotalSinImpuestos;
                    $scope.data.total = importeTotal;
                    $scope.data.totalDescuento = totalDescuento;
                    $scope.data.porcentajeDescuento = porcentajeDescuento;
                    $scope.data.irbpnr = irbpnr
                    $scope.data.propina = propina;

                    //Formas pago 
                    $scope.dataFormaPago.total = importeTotal;
                } catch (error) {
                    console.log(error);
                }
            }



            /**
             *  
             * @param {*} htmlTemplate 
             */

            function drawElementHTMLTotals(htmlTemplate) {



                const element = document.getElementById('drawImpuestoTotales');
                if (element) {
                    element.innerHTML = htmlTemplate;
                }
            }














            function isValidForm() {
                if (!$scope.data.codEstab) {
                    tS.toastr('warning', 'Seleccione el Establecimiento')
                    return
                }

                if (!($scope.cliente.idCliente > 0)) {
                    tS.toastr('warning', 'Seleccione el Cliente')
                    return
                }

                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.toastr('warning', 'Seleccione el Punto de Emisión')
                    return
                }

                if (!($scope.data.idTiempoCredito > 0)) {
                    tS.toastr('warning', 'Seleccione el Tiempo de Crédito')
                    return
                }

                if (!$scope.data.fechaEmision) {
                    tS.toastr('warning', 'Ingrese la Fecha de Emisión')
                    return
                }

                if (!fS.isValidDate($scope.data.fechaEmision)) {
                    tS.toastr('warning', 'Ingrese la fecha de emisióm correctamente')
                    return
                }

                if (!$scope.data.fechaVencimiento) {
                    tS.toastr('warning', 'Ingrese la Fecha de Vencimiento')
                    return
                }
                if (!fS.isValidDate($scope.data.fechaVencimiento)) {
                    tS.toastr('warning', 'Fecha de Vencimiento Inválido')
                    return
                }


                if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
                    tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
                    return
                }

                let ajusteFechaEmision = fS.ajustarFechaEmision(null, $scope.data.fechaEmision);

                if (ajusteFechaEmision) {
                    $scope.data.fechaEmision = ajusteFechaEmision;
                } else {
                    console.log('Error al justar la fecha de Emisión')
                    return
                }

                if ($scope.gridOptions.data.some(row => !(row.idBodega > 0))) {
                    tS.toastr('warning', 'Seleccione la bodega en el detalle de los artículos');
                    return
                }

                if ($scope.data.total <= 0) {
                    tS.toastr('warning', 'No se puede generar el documento en el importe total con un valor 0')
                    return
                }

                //    let dataUsuario = $scope.vendedores.find(vendedor => (vendedor.predeterminado));
                if (!($scope.data.idUsuario > 0)) {
                    tS.toastr('warning', 'No se encontró los datos del usuario');
                    return
                }

                if (
                    $scope.data.docDestino === DOC_TYPE.FV_SRI &&
                    $scope.cliente.tipoIdentificacion === SRI_IDENTIFITION_CODE.CONSUMIR_FINAL &&
                    $scope.data.total > 50
                ) {
                    Swal.fire({
                        icon: 'warning',
                        html: `<small>La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b></small>`,
                        confirmButtonText: 'Aceptar'
                    })
                    return
                }

                return true;
            }


            const validateCuota = function () {
                let objParamsCuota = {
                    fechaEmision: $scope.data.fechaEmision,
                    tiemposCredito: $scope.tiempoCreditos,
                    idTiempoCredito: $scope.data.idTiempoCredito,
                    montoTotal: $scope.data.total,
                    cuotas: []
                }
                let cuotas = [];
                let montoTotalCuota = 0;


                let dataCuota = fS.calcularCuotas(objParamsCuota);
                cuotas = dataCuota.cuotas;
                montoTotalCuota = dataCuota.montoTotalCuota;




                if (fS.roundNumber(montoTotalCuota, 2) !== fS.roundNumber($scope.data.total, 2)) {
                    tS.toastr('warning', 'No coincide el total de la cuota con el importe total del documento.');
                    return [];
                }

                return cuotas;
            }

            function isValidTotals() {
                const getTotals = gridOptionsSvc.getImpuestoTotales({
                    items: $scope.gridOptions.data,
                    decimal: $scope.decimal,
                    tarifasImpuesto: $scope.tarifasImpuesto.slice(),
                });
                let {
                    subTotalSinImpuestos,
                    importeTotal,
                    totalDescuento,
                } = getTotals;



                if ($scope.data.subTotalSinImpuestos !== subTotalSinImpuestos) {
                    tS.toastr('warning', `El valor del Subtotal sin impuestos: ${$scope.data.subTotalSinImpuestos} difiere del valor del Subtotal sin impuestos en el detalle: ${subTotalSinImpuestos}`);
                    return;
                }

                if ($scope.data.totalDescuento !== totalDescuento) {
                    tS.toastr('warning', `El valor total del descuento: ${$scope.data.totalDescuento} no coincide con el descuento total calculado en el detalle: ${totalDescuento}`);
                    return;
                }

                if ($scope.data.total !== importeTotal) {
                    tS.toastr('warning', `El valor del importe total: ${$scope.data.total} difiere del importe total calculado en el detalle: ${importeTotal}`);
                    return;
                }

                return true;
            }



            $scope.askToSaveDocDestino = async function () {
                try {

                    if (!isValidForm()) return;
                    if (!isValidTotals()) return;

                    let cuotas = validateCuota();

                    if (cuotas && cuotas.length === 0) return

                    let serieComprobante = null;
                    let codDocDestino = null;
                    let codDoc = null;
                    if ($scope.data.docDestino === DOC_TYPE.FV_SRI) {
                        codDocDestino = DOC_TYPE.FE;
                        codDoc = DOC_TYPE.FV_SRI;

                        showLoader();
                        serieComprobante = await facturaSvc.generateSerieComprobante({
                            idPuntoEmision: $scope.data.idPuntoEmision,
                        });
                        hideLoader();
                    }
                    if ($scope.data.docDestino === DOC_TYPE.NE) {
                        codDocDestino = DOC_TYPE.NE;
                        codDoc = DOC_TYPE.NE;

                        showLoader();
                        serieComprobante = await notaEntregaSvc.generateSerieComprobante({
                            idPuntoEmision: $scope.data.idPuntoEmision,
                        })
                        hideLoader();
                    }

                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                    let { isConfirmed } = await Swal.fire({
                        // title: 'Are you sure?',
                        html: `<small>Esta Ud. seguro de <b>guardar</b> este Aprobación Documento de: ${$scope.docOrigenDesc} -> ${$scope.docDestinoDesc} con <b>N° ${$scope.data.serieComprobante}</b></small>?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, guardar!',
                        cancelButtonText: 'No, cancelar'
                    })

                    if (isConfirmed) {
                        showLoader();

                        let query = aprobacionDocSvc.queryMapperConvertToDoc({
                            id: $scope.data.idAprob_Document,
                            codDocDestino,
                            codDoc,
                            comprobante: $scope.data,
                            detalles: $scope.gridOptions.data,
                            infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                            cuotas,
                            dataFormaPago: $scope.dataFormaPago,
                            historyDatosAdicionales: $scope.historyDatosAdicionales,
                        })

                        showLoader();
                        aprobacionDocSvc.convertToDoc(query).then(response => {
                            if (response.code === '0') {
                                fS.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.code === "1") {
                                fS.sweetAlert('success', response.message, response.titleSms, 1000);

                                $ctrl.close({ $value: response })
                            }
                        }).catch(error => {
                            console.log(error)
                        }).finally(() => hideLoader())



                    }

                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            }





            $scope.closeModal = function () {
                $ctrl.close()
            }



        }]

    })

})()