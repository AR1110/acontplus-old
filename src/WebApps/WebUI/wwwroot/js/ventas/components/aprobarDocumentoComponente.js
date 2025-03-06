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
            const gridOptionsSvc = $injector.get('gridOptionsService');



            $scope.docOrigenDesc = "";
            $scope.docDestinoDesc = "";

            $scope.data = {};

            $scope.mostrarFormasPago = false;

            $scope.cliente = {};

            $scope.dataClone = {};


            $scope.tipoDoc = {
                codigo: DOC_TYPE.NE
            }

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
            $scope.gridOptionsDetalle = {
                enableColumnMenus: false,
                enableColumnReordering: true,
                showGridFooter: false,
            }

            $scope.gridOptionsDetalle.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
                if ($scope.gridApi) {
                    $timeout(() => {
                        $scope.gridApi.core.handleWindowResize();
                        $scope.gridApi.grid.refresh();
                    }, 5);
                }

                gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                    //Validar campos
                    if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                        rowEntity[colDef.field] = oldValue;
                    }


                    //Validacion de numeros negativos
                    if (['cantidad', 'precioUnitario', 'precioConIva', 'valorDescuento', 'porcentajeDescuento'].includes(colDef.field) && newValue < 0) {

                        rowEntity[colDef.field] = oldValue;
                    }

                    if (colDef.field === 'cantidad' && rowEntity[colDef.field] === 0) {
                        rowEntity[colDef.field] = 1;
                    }

                    if (colDef.field === "idMedida" && rowEntity.idMedida == oldValue) return
                    if (colDef.field === "cantidad" && rowEntity.cantidad == oldValue) return

                    //Verificacion del stock
                    if (["idMedida", "cantidad"].includes(colDef.field)) {
                        checkNotificationStock(colDef.field, rowEntity, oldValue);
                        return
                    }
                    // if (colDef.field === 'cantidad' && rowEntity.cantidad !== oldValue) {
                    //     checkNotificationStock(colDef.field, rowEntity, oldValue);
                    //     return
                    // }
                    if (colDef.field === 'idBodega' && rowEntity.idBodega !== oldValue) {
                        checkNotificationStock(colDef.field, rowEntity, oldValue);
                        return
                    }

                    $scope.setCalculoTotales(colDef.field, rowEntity, oldValue);

                })
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
                        $scope.setCalculoTotales(field, rowEntity, oldValue);
                        return;
                    }

                    // Clona el objeto de la fila y la lista de artículos para evitar modificaciones directas.
                    let rowItemClone = structuredClone(rowEntity);
                    let gridOptionsClone = structuredClone($scope.gridOptionsDetalle.data);

                    // Realiza la fusión de elementos en la lista de artículos clonada.
                    let dataItemMerge = fS.mergeItemStock(gridOptionsClone, rowItemClone);

                    // Si la cantidad no ha cambiado, no realizar más acciones.
                    if (dataItemMerge.cantidad == oldValue) return;



                    // Llama a un servicio para verificar la notificación de stock.

                    let cantidadStock = fS.getCantidadStock(dataItemMerge, $scope.data.fechaEmision);
                    if (cantidadStock === 0) {
                        $scope.setCalculoTotales(field, rowEntity, oldValue);
                        return;
                    }

                    showLoader();
                    articuloSvc.checkNotificationStock({
                        idArticulo: rowEntity.idArticulo,
                        cantidad: cantidadStock,
                        idBodega: rowEntity.idBodega,
                        idMedida: rowEntity.idMedida
                    }).then(async responseApi => {
                        hideLoader();
                        let { code, message, titleSms } = responseApi;
                        if (code === "1") {

                            $scope.setCalculoTotales(field, rowEntity, oldValue);
                            return
                        }

                        let { isConfirmed } = await Swal.fire({
                            title: `<small>${titleSms}</small>`,
                            icon: 'warning',
                            html: `<small>${message}</small>`,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        })

                        if (isConfirmed) {
                            if (code === "0") {
                                rowEntity[field] = oldValue;
                                $scope.setCalculoTotales(field, rowEntity, oldValue);
                                $("#custom-template-md-autocomplete-articulo").focus();
                            }
                            if (code === "2") {
                                $scope.setCalculoTotales(field, rowEntity, oldValue);
                            }
                        }

                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    })

                } catch (error) {
                    hideLoader();
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

                let { docOrigenDesc, docDestinoDesc, data, mainDataForm } = params
                let { comprobante, cliente, detalles, datosAdicionalesArticulo, formasPago, config } = data;

                $scope.data = comprobante;
                $scope.data.docDestino === DOC_TYPE.FV_SRI;

                $scope.docOrigenDesc = docOrigenDesc;
                $scope.docDestinoDesc = docDestinoDesc;

                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;

                $scope.cliente = cliente;



                $scope.formasPago = formasPago;
                $scope.config = config;



                $scope.datosAdicionalesArticulo = datosAdicionalesArticulo || [];
                $scope.historyDatosAdicionales = datosAdicionalesArticulo.map(item => ({
                    idArticulo: item.idArticulo,
                    idInfoAdicional: item.idInfoAdicional,
                    selected: true,
                }))


                loadFormData(mainDataForm, detalles)


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

                    //Permisos para detalle y documento    
                    $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                    $scope.permisoDetalleVenta = permisoVenta.detalle;

                    //Vendedores-usuarios
                    $scope.vendedores = vendedores;
                    $scope.config = config;



                    setColumnDefs();
                    $scope.gridOptionsDetalle.data = calculateTotalItems(detalles);
                    getFechaVencimiento();


                    drawImpuestoTotales();


                } catch (error) {
                    console.log(error);
                }

            }


            function setColumnDefs() {

                const ventaDetailPermission = $scope.permisoDetalleVenta

                $scope.gridOptionsDetalle.columnDefs = [{
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
                let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
                let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');
                $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
                $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
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
                        items: $scope.gridOptionsDetalle.data,
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

            $scope.closeModal = function () {
                $ctrl.close()
            }



        }]

    })

})()