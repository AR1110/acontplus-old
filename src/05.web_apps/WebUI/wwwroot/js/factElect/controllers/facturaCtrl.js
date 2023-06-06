(function() {

    'use strict';

    let URL_TEMPLATE = '~/Areas/Factura/Pages/Shared/'

    let commonSvc = {};
    let ventaSvc = {};
    let facturaSvc = {};
    let clienteSvc = {};
    let fS = {};
    let tS = {};

    let mainDataForm = {};

    app.controller('facturaCtrl', facturaCtrl);

    facturaCtrl.$inject = ['$scope', '$injector', 'modalService'];

    function facturaCtrl($scope, $injector, modalSvc) {
     
        commonSvc = $injector.get('commonService');
        ventaSvc = $injector.get('ventaService');
        facturaSvc = $injector.get('facturaService');
        clienteSvc = $injector.get('clienteService');
        fS = $injector.get('formulario');
        tS = $injector.get('toastService');
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10
        };

        $scope.openModalNew = function() {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: 'ModalFacturaCtrl',
                    template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
                    params: {},
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })

                modalRef.result.then(result => {
                    if(typeof result === 'object'){
                        $scope.getGuiasRemision();
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }

        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
            $scope.dataSearch.fechaFin = item.endDate
            $scope.getGuiasRemision();
        }

        $scope.clienteSearch = function (textSearch) {
            let query = {
                textSearch
            }

            if (textSearch.length > 2) {
                return clienteSvc.search(query).catch(error => {
                    console.log(error)
                })
            }
        }

        $scope.onKeyupClienteSearchFiltro = function () {
            if (!$scope.modelTextSearch) {
                $scope.dataSearch.byCliente = 0;
            }
        }

        $scope.selectedClienteSearchFiltro = function (item) {
            $scope.dataSearch.byCliente = item.idCliente;
            $scope.getGuiasRemision();
        }

        $scope.usuarioSearch = function (textSearch) {
            try {
                let query = {
                    idRol: idUsuarioRol,
                    busqueda: textSearch
                }
    
                if (query.busqueda.length > 2) {
                    return commonSvc.usuarioSearch(query)
                        .catch(error => {
                            console.log(error);
                            throw error;
                        })
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onKeyupUsuarioSearch = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.searchFilterLocal = function () {
            let guiasRemision = JSON.parse(JSON.stringify($scope.cloneGuiasRemision));
            $scope.guiasRemision = $filter("filter")(guiasRemision, $scope.dataSearch.bySearch);
            
        }

        //=====================Eend Filters=======================

        $scope.getTotales = () => {
            let total = 0,
                totalAbono = 0,
                totalSaldo = 0;
            for (let val of $scope.facturas) {
                if (val.estadoFinanciero !== 'Anulada') {
                    total += val.total;
                    totalAbono += val.abono;
                    totalSaldo += val.saldo;
                }
            };
            $scope.total = fS.roundNumber(total, 5);
            $scope.totalAbono = fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = fS.roundNumber(totalSaldo, 5);
        }
    

        $scope.getFacturas = function() {
            try {
                showLoader();
                $scope.facturas = [];
                $scope.cloneFacturas = [];

                let query = {
                    codEstab: $scope.dataSearch.codEstab,                 
                    checkBoxCustomer: $scope.dataSearch.byCliente > 0,
                    byCustomer: $scope.dataSearch.byCliente,
                    checkBoxDate: true,
                    checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                    byUsuario: $scope.dataSearch.byUsuario,
                    checkBoxStatus: $scope.dataSearch.codEstado ? true : false,
                    codEstado: $scope.dataSearch.codEstado,
                    dateStart: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    dateEnd: fS.formatDateTimeZone($scope.dataSearch.fechaFin)
                }
                // $scope.getTotales();
                // facturaSvc.getAll(query).then(response => {
                //     hideLoader();
                //     $scope.facturas = response;
                
                //     $scope.cloneFacturas = JSON.parse(JSON.stringify($scope.facturas));
                //     $scope.getTotales();
                // }).catch(error => {
                //     hideLoader();
                //     console.log(error)
                // })
                hideLoader();
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }
        
        $scope.initiload  = function () {
            showLoader();
            ventaSvc.getDataForm({ typeList: 1 }).then((response) => {
                mainDataForm = response;
                $scope.establecimientos = mainDataForm.establecimientos;
                
                $scope.dataSearch.codEstab = $scope.establecimientos[0].codEstab;
                $scope.getFacturas();
            }).catch((errorResponse) => {
                hideLoader();
                console.log(errorResponse);
            });

            commonSvc.getEstadoDocByCodDoc('PRE').then(response => {
                $scope.estadoDocumentos = response;
            })
        }
        $scope.initiload();

    }




    app.controller('ModalFacturaCtrl', ModalFacturaCtrl);

    ModalFacturaCtrl.$inject=['$scope', '$uibModalInstance', '$timeout', 'params'];

    function ModalFacturaCtrl($scope, $uibModalInstance, $timeout, params) {

        $scope.data = {
            fechaEmision: new Date(),
            fechaVencimiento: new Date()
        };
        $scope.dataClone = {
            fechaEmision: new Date(),
            fechaVencimiento: new Date()
        };
        $scope.datosAdicionalesArticulo = [];
        $scope.infoAdicionalDocumento = [];

        //Cliente
        $scope.cliente = {};
        $scope.searchClienteOptions = {}
        $scope.searchClienteOptions.showBtnNew = true;
        $scope.searchClienteOptions.showBtnList = true;

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


            gridApi.grid.element.on('keyup', function (ev) {
                if (ev.which == 13 || ev.keyCode == '13') {


                    if (isSearchBarcode == 1) {
                        setFocusInputBarcode();
                    } else {
                        setFocusArticulo();
                    }

                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })

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

                // const objCalculo = self.uiGridInvoice.calculoColDef(rowEntity, oldValue)
                // objCalculo[colDef.field] && objCalculo[colDef.field]();
                // objCalculo["calculoTotalDetalle"]();
                // self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

            })
        }

        $scope.initiload = async function() {
            try {
                showLoader();
                let { establecimientos, ptosEmision, bodegas, configVenta, decimal, configDetalle, tipoIvas, tarifas, tiempoCreditos, articuloPredeterminado, clientePredeterminado, permisoVenta, permisoArticulo } = mainDataForm;

                console.log(mainDataForm)

                /**
                 * Establecimiento - Impuesto Tarifa 
                 */
                let dataEstab = establecimientos.find(item => (item.predeterminado
                    ))
                    console.log(dataEstab)
                $scope.establecimientos = establecimientos;
                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataClone.codEstab = $scope.data.codEstab;

                $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                $scope.dataTarifaImpuesto = $scope.tarifasImpuestos.find(item => item.codigoPorcentaje === $scope.data.codigoPorcentaje)

                //===========Puntos Emisiones==============================================
                $scope.tempPuntosEmision = ptosEmision;
                $scope.ptosEmision = $scope.tempPuntosEmision.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);
                let dataPtoEmi = $scope.ptosEmision.find(item => (item.predeterminado))
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                //============Bodegas=======================================================
                $scope.tempBodegas = bodegas;

                $scope.bodegas = bodegas.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);
                let dataBodega = $scope.bodegas.find(item => (item.predeterminado))
                $scope.data.idBodega = dataBodega.idBodega;

                //Decimal 
                $scope.decimal = decimal;

                //Config. Detalle (Mostrar/Ocultar Columnas de talle)
                $scope.configDetalle = configDetalle;
                
                //Tipo Ivas 
                $scope.tipoIvas = tipoIvas;

                //Tarifas(PVP1, PVP2...)
                $scope.tarifas = tarifas;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;
                
                $scope.tiempoCreditos = tiempoCreditos;
                $scope.data.idTiempoCredito = $scope.tiempoCreditos.length > 0? $scope.tiempoCreditos[0].idTiempoCredito: 0;
                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;

                //Permisos para detalle y documento 
                let { detail, comprobante } = permisoVenta;
                $scope.permisoDetalle = Object.freeze(detail);
                $scope.permisoComprobante = Object.freeze(comprobante);

                setColumnDefs();
                // $scope.gridOptionsDetalle.data = await aprobacionDocSvc.detalleMapperFrom({
                //     detalles,
                //     fS,
                //     decimal,
                //     idBodega: $scope.data.idBodega,
                //     findForSale: articuloSvc.findForSale
                // })

                // $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                //     items: $scope.gridOptionsDetalle.data,
                //     decimal: $scope.decimal,
                //     dataTarifaImpuesto: $scope.dataTarifaImpuesto
                // }))
                getFechaVencimiento();
                hideLoader();
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.initiload();
        
        function setColumnDefs(width = '5%') {
            let defaultPermission = Object.freeze({
                tarifa: {
                    update: true
                },
                medida: {
                    update: true
                },
                tipoIva: {
                    update: true
                },
                porcentajeDescuento: {
                    update: true
                },
                descuento: {
                    update: true
                },
                precioUnitario: {
                    update: true
                },
                precioConIva: {
                    update: true
                },
            })
    
            const ventaDetailPermission = $scope.ventaDetailPermission || defaultPermission;
    
            $scope.gridOptionsDetalle.columnDefs = [{
                    name: 'Op.',
                    enableCellEdit: false,
                    width,
                    minWidth: '100',
                    cellTemplate: `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a> 

                    <a  update-article  ng-click="grid.appScope.$ctrl.openModalArticle(row.entity, 2)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
            
                   <view-kardex params="row.entity"></view-kardex>
            
                    <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.$ctrl.historyDatosAdicionales" result-modal-adicional="grid.appScope.$ctrl.resultModalAdicional(result)" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`,
                },
                {
                    name: 'N°',
                    field: 'n',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    width: '5%',
                    minWidth: '50'
                },
                {
                    name: 'cód.',
                    field: 'codigo',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'idArticulo',
                    field: 'idArticulo',
                    visible: false
                },
                {
                    name: "Descripción",
                    field: "descripcion",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.llevaInventario !== true;
                    },
                    cellTooltip: function (row) {
                        return row.entity.descripcion;
                    },
                    width: '25%',
                    minWidth: '100'
                },
                {
                    name: 'Cant.',
                    field: 'cantidad',
                    enableCellEditOnFocus: true,
                    min: 1,
                    type: 'number',
                    width: '6%',
                    minWidth: '50'
                },
                {
                    name: 'Medida',
                    field: 'idMedida',
                    cellFilter: 'mapMedida:row.entity.medidas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    enableCellEdit: ventaDetailPermission.medida.update,
                    enableCellEditOnFocus: ventaDetailPermission.medida.update,
                    allowCellFocus: ventaDetailPermission.medida.update,
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return rowEntity.medidas.map(function (val) {
                            return {
                                id: val.idMedida,
                                value: val.descripcion
                            }
                        })
    
                    },
                    type: 'number',
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'codigoTipoIva',
                    field: 'codigoTipoIva',
                    enableCellEdit: false,
                    width: '8%',
                    visible: false
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
                    enableCellEdit: ventaDetailPermission.tipoIva.update,
                    allowCellFocus: ventaDetailPermission.tipoIva.update,
                    enableCellEditOnFocus: ventaDetailPermission.tipoIva.update,
                    //    visible: config.porcentajeIva
                },
                {
                    name: 'tarifas',
                    field: 'articuloTarifas',
                    visible: false
                },
                {
                    name: 'Tarifa',
                    field: 'idTarifa',
                    width: '12%',
                    minWidth: '100',
                    cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    enableCellEdit: ventaDetailPermission.tarifa.update,
                    enableCellEditOnFocus: ventaDetailPermission.tarifa.update,
                    allowCellFocus: ventaDetailPermission.tarifa.update,
                    editDropdownOptionsFunction: (rowEntity, colDef) => {
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
                    minWidth: '100',
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario.update : true;
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
                    minWidth: '100',
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva.update : true;
                    },
                    // cellFilter: "currency:'$'",
                },
                {
                    name: '%',
                    field: 'porcentajeDescuento',
                    enableCellEdit: ventaDetailPermission.porcentajeDescuento.update,
                    allowCellFocus: ventaDetailPermission.porcentajeDescuento.update,
                    enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento.update,
                    min: 0,
                    width: '6%',
                    minWidth: '100',
                    // cellFilter: "currency:'%'",
                    visible: $scope.configDetalle.porcentajeDescuento || false,
                    type: 'number',
                    /*cellFilter: "limitTo:3",*/
                },
                {
                    name: 'dsto.',
                    field: 'valorDescuento',
                    enableCellEdit: ventaDetailPermission.descuento.update,
                    enableCellEditOnFocus: ventaDetailPermission.descuento.update,
                    allowCellFocus: ventaDetailPermission.descuento.update,
                    min: 0,
                    type: 'number',
                    width: '6%',
                    minWidth: '100',
                    // cellFilter: "currency:'$'",
                    visible: $scope.configDetalle.descuento || false
                },
                {
                    name: 'T. Dsto.',
                    field: 'totalDescuento',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    min: 0,
                    type: 'number',
                    width: '7%',
                    minWidth: '100',
                    // cellFilter: "currency:'$'",
                    visible: $scope.configDetalle.totalDescuento || false
                },
                {
                    name: 'sub Total',
                    field: 'subTotal',
                    enableCellEdit: false,
                    type: 'number',
                    width: '7%',
                    minWidth: '100',
                    visible: false,
                    // cellFilter: "currency:'$'",
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
                    visible: $scope.configDetalle.ice || false
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
                {
                    name: 'llevaInventario',
                    field: 'llevaInventario',
                    visible: false
                },
                {
                    name: 'datosAdicionales',
                    field: 'datosAdicionales',
                    visible: false
                },
            ]
    
            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
            $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
        }

        $scope.onChangeEstab = async function () {
            try {
                let {isConfirmed} = await Swal.fire({
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

                    if (!$scope.tempPuntosEmision.some(item => item.codEstab_Asig === dataEstab.codEstab_Asig)) {
                        tS.toastr('info', 'No tienes Puntos de Emisión asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }
                    if (!$scope.tempBodegas.some(item => item.codEstab_Asig === dataEstab.codEstab_Asig)) {
                        tS.toastr('info', 'No tienes bodegas asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }

                    //Impuesto Tarifa
                    $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                    $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];

                    //Puntos de Emision 
                    $scope.ptosEmision = $scope.tempPuntosEmision.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);

                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.predeterminado))
                    $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                    //Bodegas 
                    $scope.bodegas = $scope.tempBodegas.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);

                    let dataBodega = $scope.bodegas.find(item => (item.predeterminado));
                    $scope.data.idBodega = dataBodega.idBodega;

                    $scope.dataClone.codEstab = $scope.data.codEstab;

                    setWarehouseAndIVA();
                } else {
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                }
                
            } catch (error) {
                console.log(error);
            }
        }

        function setDataInfoEstab() {
            $scope.infoEstabPtoEmi = {}
            if ($scope.establecimientos.length > 0) {
                this.infoEstabPtoEmi.nombreComercial = establecimientos.find(item => item.codEstab === this.data.codEstab).nombreComercial;
            }
    
            if (ptosEmision.length > 0) {
                this.infoEstabPtoEmi.ptoEmi = ptosEmision.find(item => item.idPuntoEmision === this.data.idPuntoEmision).ptoEmi;
            }
    
        }
    

         /**
         * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
         */
         function setWarehouseAndIVA () {            
            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
            $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
        }

        $scope.onChangeTiempoCredito = function () { 
			if (!$scope.permisoComprobante.tiempoCredito.update) {
				tS.toastr('warning', 'No tienes permiso para realizar esta acción');
				$scope.data.idTiempoCredito = $scope.dataClone.idTiempoCredito
			}
			getFechaVencimiento();
		}


		$scope.onChangeFechaEmision = function () {
			if (!$scope.permisoComprobante.fechaEmision.update) {
				tS.toastr('warning', 'No tienes permiso para realizar esta acción');
				$scope.data.fechaEmision = $scope.dataClone.fechaEmision;
			}
			getFechaVencimiento();
		}


		function getFechaVencimiento () {
			if ($scope.data.fechaEmision && $scope.tiempoCreditos.length > 0) {

				let tiempoCredito = $scope.tiempoCreditos.find(item => item.idTiempoCredito === $scope.data.idTiempoCredito);
				let diasCredito = typeof tiempoCredito === 'object' ? tiempoCredito.diasCredito : 0;

				let {
					fechaVencimiento,
					fechaEmisionEscrita,
					fechaVencimientoEscrita
				} = fS.sumarDiasAFecha($scope.data.fechaEmision, diasCredito);

				$scope.data.fechaVencimiento = fechaVencimiento;
				$scope.data.fechaEmisionEscrita = fechaEmisionEscrita;
				$scope.data.fechaVencimientoEscrita = fechaVencimientoEscrita;

                //Variables temporales
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;
                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
			}
		}


        $scope.onSelectedClienteChange = async function(item) {
            try {
                if (!item.validationSri && ['R', 'C'].includes(item.tipoIdentificacion)) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Datos Incorrectos',
                        html: 'Número de identificación inválido?',
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Editar',
                        cancelButtonText: 'Cancelar'
                    })
                    return
                }
                showLoader();
                let dataCliente = await clienteSvc.findById(item.idCliente);
                $scope.cliente = dataCliente;
                $scope.data.placa = '';
                $scope.data.idTiempoCredito = $scope.cliente.idTiempoCredito;
                getFechaVencimiento();                                
                $scope.$apply();
                hideLoader();
    
            } catch (error) {
                hideLoader();
                $scope.cliente = {};
                console.log('ERROR AL CARGAR DATOS DEL CLIENTE', error)
                $scope.$apply();
            }
        }



        $scope.closeModal = function() {
            $uibModalInstance.close();
        }
    
    }



})(window.angular)