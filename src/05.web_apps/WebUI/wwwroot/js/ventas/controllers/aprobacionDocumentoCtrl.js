(function(){

    'use strict';

    //Variable servicios
    let mS = {};
    let tS = {};
    let commonSvc = {};
    let notaEntregaSvc = {};
    let proformaSvc = {};
    let facturaSvc = {};

    //Variables Constantes
    const URL_TEMPLATE = 'AprobDocument/'


    app.controller('aprobacionDocumentoCtrl', aprobacionDocumentoCtrl);

    aprobacionDocumentoCtrl.$inject = ['$scope', '$injector', 'modalService', 'nombreModalVenta'];

    function aprobacionDocumentoCtrl($scope, $injector, modalSvc, nombreModalVenta) {

        //Injection Services
        mS             = $injector.get('mainService');
        commonSvc      = $injector.get('commonService');
        tS             = $injector.get('toastService');
        notaEntregaSvc = $injector.get('notaEntregaService');
        proformaSvc    = $injector.get('proformaService');
        facturaSvc     = $injector.get('facturaService');


        let OPTION_APROBACION = Object.freeze({
            0:  Object.freeze({
                docOrigen: {
                    codigo: 'NE',
                    descripcion: 'Nota de Entrega'
                },
                docDestino: {
                    codigo: 'FV',
                    descripcion: 'Factura'
                }                
            }),
            1:  Object.freeze({
                docOrigen: {
                    codigo: 'PR',
                    descripcion: 'Proforma'
                },
                docDestino: {
                    codigo: 'FV',
                    descripcion: 'Factura'
                }                
            }),  
            2:  Object.freeze({
                docOrigen: {
                    codigo: 'PR',
                    descripcion: 'Proforma'
                },
                docDestino: {
                    codigo: 'NE',
                    descripcion: 'Nota de Entrega'
                }                
            })          
        });

        $scope.askToOpenModalOption = async function() {
            try {
                  
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger m-l-5'
                    },
                    buttonsStyling: false
                })
        
                swalWithBootstrapButtons.fire({
                    title: 'Opción Aprobación Documento',                    
                    input: 'select',
                    inputOptions: {
                        0: 'NOTA DE ENTREGA A FACTURA',
                        1: 'PROFORMA A FACTURA',
                        2: 'PROFORMA A NOTA DE ENTREGA'
                    },
                    inputPlaceholder: 'Seleccionar...',
                    showCancelButton: true,
                    confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
                    cancelButtonText: '<small>&times; Cerrar</small>',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    focusConfirm: true,
                    inputValidator: (value) => {
                        return !value && 'Seleccione la opción de aprobación'
                    }
                }).then(result => {
                    if(result.isConfirmed){
                       
                        let modalRef = modalSvc.openModalCustom({
                            controller: 'ModalSelectDocCtrl',
                            template: URL_TEMPLATE + '_ModalSelectDocumento.cshtml',
                            size: 'xl',
                            windowClass: 'uibModalFullScreen',
                            params: OPTION_APROBACION[result.value]
                        })

                    }
                })
                
            } catch (error) {
                console.log(error);
            }
        }

    }



    /**
     * 
     * _------------------Modal para seleccionar los documentos 
     * 
     */
    app.controller('ModalSelectDocCtrl', ModalSelectDocCtrl);

    ModalSelectDocCtrl.$inject = [
        '$scope', 
        '$uibModalInstance',
        'uiGridConstants', 
        'clienteService', 
        'params'
    ];

    function ModalSelectDocCtrl($scope, $uibModalInstance, uiGridConstants, clienteSvc, params) {
        
        let {docOrigen, docDestino} = params;
        $scope.docOrigen = docOrigen;
        $scope.docDestino = docDestino;

        $scope.cliente = {};
        $scope.dataSearch = {
            fechaInicio: new Date(),
            fechaFin: new Date(),
        };


        $scope.gridOptionsDetalle = {};

        $scope.selectedDocuments = [];


        $scope.gridOptionsSelectedDocs = {
            enableFiltering: true,
            enableSorting: true,
            enableGridMenu: true,

            enableRowSelection: true,
            enableSelectAll: true,

            showColumnFooter: true,
            showGridFooter: true,
            expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" ui-grid-resize-columns ></div>',
            expandableRowScope: {
                subGridVariable: 'subGridScopeVariable'
            },
            expandableRowHeight: 150,
            isRowSelectable: function (row) {
                if (["AC", "PE"].includes(row.entity.codDoc)) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        $scope.gridOptionsSelectedDocs.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);


            gridApi.selection.on.rowSelectionChanged($scope, (row) => {
                //------
            })


            gridApi.selection.on.rowSelectionChangedBatch($scope, function () {})
        }


        //GridOptions Invoice 
        $scope.gridOptionsDetalle = {
            enableSorting: true,
            suppressMultiSort: true,
        }

        $scope.infoAdicionalDocumento = [];
        $scope.historialVentas = [];
        
        // Step Uno
        $scope.stepUno = function () {
            $scope.footerActionStepUno = true;
            $scope.footerActionStepDos = false;

            $("#step a:first-child").addClass('active');
            $("#step a:last-child").removeClass('active');

            const stepDocOrigen = document.getElementById("stepDocOrigen");
            const stepDocDestino = document.getElementById("stepDocDestino");

            stepDocOrigen.style.display = "block";
            stepDocDestino.style.display = "none";
        }


        $scope.stepDos = function() {
            try {
                if (!$scope.cliente.idCliente > 0) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }

                $scope.selectedDocuments = $scope.gridApi.selection.getSelectedRows() || []
                if ($scope.selectedDocuments.length === 0) {
                    tS.toastr('warning', 'Seleccione al menos un Documento', 'Siguiente', 'toast-bottom-center');
                    return
                }

                showLoader();
                //UNIMOS TODOS LOS DETALLES DEL COMPROBANTE

                let resultJoinDetails = $scope.selectedDocuments.flatMap(item => item.subGridOptions.data);


                //Si la Opcion es Agrupar Articulos del Detalle 
                // if (this.groupByArticle) {
                //     resultJoinDetails = resultJoinDetails.reduce((arrGroup, current) => {
                //         let thatItem = arrGroup.find(item => item.codigo == current.codigo);
                //         if (thatItem == undefined) arrGroup = [...arrGroup, {
                //             ...current
                //         }]
                //         else {
                //             thatItem.cantidad += current.cantidad;

                //             let precioVenta = thatItem.precioVenta += current.precioVenta;
                //             let precioConIva = thatItem.precioConIva += current.precioConIva;
                //             let porcentajeDescuento = thatItem.porcentajeDescuento += current.porcentajeDescuento;
                //             let valorDescuento = thatItem.valorDescuento += current.valorDescuento;
                //             let totalDescuento = thatItem.totalDescuento += current.totalDescuento;
                //             let subTotal = thatItem.subTotal += current.subTotal;
                //             let total = thatItem.total += current.total;

                //             thatItem.precioVenta = this._fS.roundNumber(precioVenta, this.decimal.nroPrecio);
                //             thatItem.precioConIva = this._fS.roundNumber(precioConIva, this.decimal.nroPrecio);
                //             thatItem.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroPorcentaje);
                //             thatItem.valorDescuento = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuento);
                //             thatItem.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle);
                //             thatItem.subTotal = this._fS.roundNumber(subTotal, 5);
                //             thatItem.total = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);
                //         }
                //         return arrGroup
                //     }, [])
                // }

                //Agregamos Bodega e Indice
                let index = 1;
                $scope.gridOptionsDetalle.data = resultJoinDetails.map(item => {
                    item.idBodega = $scope.idBodega;
                    item.n = index++;
                    return item;
                })

                //Creamos objeto GridOptions para calculos de totales y subtotales             
                // this.uiGridInvoice = new UiGridOptions({
                //     $scope: this.$scope,
                //     gridOptions: this.gridOptionsDetailDocument,
                //     _fS: this._fS,
                //     _mS: this._mS,
                //     _tS: this._tS,
                //     tipoIvas: this.tipoIvas
                // })

                // this.uiGridInvoice.setInitiload({
                //     bodegas: this.bodegas,
                //     tipoIvas: this.tipoIvas,
                //     decimal: this.decimal,
                //     actividadTipoIva: this.actividadTipoIva
                // })

                // this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());

                // this.getImporteTotal();

                $scope.footerActionStepUno = false;
                $scope.footerActionStepDos = true;

                $("#step a:first-child").removeClass('active');
                $("#step a:last-child").addClass('active');

                const stepDocOrigen = document.getElementById("stepDocOrigen");
                const stepDocDestino = document.getElementById("stepDocDestino");

                stepDocOrigen.style.display = "none";
                stepDocDestino.style.display = "block";
                hideLoader();
            } catch (error) {
                hideLoader();
                console.trace(error);
            }
        }


        //============================================Filtros==============================
        $scope.resultDateRange = function(item){
            $scope.getDocumentos();
            if($scope.cliente.idCliente>0){
                $scope.getDocumentos();
            }
        }


        $scope.clienteSearch = function(textSearch) {
            let query = {
                textSearch
            }
           
            if(textSearch.length > 2) {
                return clienteSvc.search(query).catch(error=>{
                    console.log(error)
                })
            }
        }

        $scope.selectedClienteSearch = function(item) {
            console.log(item)
            if(!$scope.dataSearch.fechaInicio || !$scope.dataSearch.fechaFin){
                tS.toastr('warning', 'Seleccione rango de fecha')
            }
            if(item.idCliente>0){
                $scope.dataSearch.byCliente = item.idCliente;
                $scope.getDocumentos();
            }           
        }


        $scope.getDocumentos = function(){
            try {
                $scope.documentos = [];
                if ($scope.docOrigen.codigo === 'NE') {
                    $scope.getNotaEntregas();
                }
    
                if ($scope.docOrigen.codigo === 'PR') {
                    $scope.getProformas();
                }

            } catch (error) {
                console.log(error)
            }
        }

        $scope.getNotaEntregas = function() {
            try {              
                $scope.documentos = [];
                notaEntregaSvc.getAll($scope.dataSearch).then(async response=>{
                    $scope.gridOptions.columnDefs = [{
                        name: 'Nro. Doc',
                        field: 'nroDocumento'
                    },
                    {
                        name: 'F. Emisión',
                        field: 'fechaEmision'
                    },
                    {
                        name: 'F. Vcto',
                        field: 'fechaVencimiento'
                    },
                    {
                        name: 'Cliente',
                        field: 'nombreFiscal',
                        cellTemplate: `<div class="grid-tooltip"  tooltip-placement="left" uib-tooltip="{{row.entity.nombreFiscal }}">
                            <div class="ui-grid-cell-contents">
                            {{ COL_FIELD }}
                            </div>
                        </div>`
                    },
                    {
                        name: 'Total',
                        field: 'total',
                        cellTemplate: ` <div class="grid-tooltip"><div class="ui-grid-cell-contents">$ {{ COL_FIELD }}</div></div>`,
                        aggregationType: self.uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationLabel: "Total: ",
                        aggregationHideLabel: true,
                        footerCellFilter: 'number:2',
                    },
                    {
                        name: 'Estado',
                        field: 'estadoFinanciero'
                    },
                    {
                        name: 'Usuario',
                        field: 'usuario'
                    },
                ];
    
                $scope.documentos = response;
                await $scope.setDataGridOptionsChildren();
    
                }).catch(error => {
                    console.log(error);
                })                    
            } catch (error) {
                console.log(error);
            }       
        }
    
    
        $scope.getProformas = function() {
            try {                
                proformaSvc.getAll($scope.dataSearch).then(async response => {             
                    $scope.gridOptions.columnDefs = [{
                            name: 'Nro. Doc',
                            field: 'nroDocumento'
                        },
                        {
                            name: 'F. Emisión',
                            field: 'fechaEmision'
                        },
                        {
                            name: 'F. Vcto',
                            field: 'fechaVencimiento',
                            visible: false
                        },
                        {
                            name: 'Cliente',
                            field: 'nombreFiscal',
                            cellTemplate: `<div class="grid-tooltip"  tooltip-placement="left" uib-tooltip="{{row.entity.nombreFiscal }}">
                        <div class="ui-grid-cell-contents">
                          {{ COL_FIELD }}
                        </div>
                      </div>`
                        },
                        {
                            name: 'Total',
                            field: 'total',
                            cellTemplate: ` <div class="grid-tooltip"><div class="ui-grid-cell-contents">$ {{ COL_FIELD }}</div></div>`,
                            aggregationType: self.uiGridConstants.aggregationTypes.sum,
                            customTreeAggregationFinalizerFn: function (aggregation) {
                                aggregation.rendered = aggregation.value;
                            },
                            aggregationLabel: "Total: ",
                            aggregationHideLabel: true,
                            footerCellFilter: 'number:2',
                        },
                        {
                            name: 'Estado',
                            field: 'estadoDoc',
                            visible: true
                        },
                        {
                            name: 'Usuario',
                            field: 'usuario'
                        },
                    ];
        
                    this.documentos = response;
                    await this.setDataGridOptionsChildren();
        
                    Swal.close();
                }).catch(error => {
                    Swal.close();
                    console.log(error)
                })       
            } catch (error) {
                Swal.close();
                console.log(error);        
            }
        }
    
    
        $scope.setDataGridOptionsChildren = async function() {
            let tempHistorialInfoAdicional = []; //Datos Adicionales de NotaEntrega
            let tempInfoAdicionalDocumento = []; //
    
            for (let item of $scope.documentos) {
               
                item.subGridOptions = $scope.columnDefsSubGridOptions();    
    
                //Obtenemos detalle de Nota de Entrega || Porforma
                let {detalleDocumento, datosAdicionalesArticulo, infoAdicionalDocumento} = await self.commonSvc.getDataTipoDocVenta({
                    id: item.idDocumento,
                    codigoDocumento: $scope.docOrigen.codigo
                })
                item.subGridOptions.data = detalleDocumento;
    
                //Historial Ventas de Nota Entrega 
                tempHistorialInfoAdicional.push(datosAdicionalesArticulo);
                tempInfoAdicionalDocumento.push(infoAdicionalDocumento)
            }
    
            $scope.gridOptions.data = $scope.documentos;
            $scope.historialVentas = tempHistorialInfoAdicional.flat();
            $scope.infoAdicionalDocumento = tempInfoAdicionalDocumento.flat();
          
            if ($scope.documentos.length === 0) {
                tS.toastr('info', 'No se encontraron los Documentos');
            }
    
        }
    
        $scope.columnDefsSubGridOptions = function () {            
            return {
                showColumnFooter: true,
                columnDefs: [{
                        name: 'Cód.',
                        field: 'codigo',
                        width: '8%',
                        minWidth: '100'
                    },
                    {
                        name: 'Descripción',
                        field: 'descripcion',
                        cellTooltip: (row) => row.entity.descripcion,
                        width: '25%',
                        minWidth: '100'
                    },
                    {
                        name: 'Cant.',
                        field: 'cantidad',
                        width: '6%',
                        minWidth: '50',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationHideLabel: true,
                        footerCellFilter: `number:${$scope.decimal.nroCantidad}`,
                    },
                    {
                        name: 'Medida',
                        field: 'idMedida',
                        cellFilter: 'mapMedida:row.entity.medidas',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
                        enableCellEdit: true,
                        enableCellEditOnFocus: true,
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
                        name: 'IVA',
                        field: 'tipoIva',
                        width: '8%',
                        minWidth: '100'
                    },
                    {
                        name: 'Tarifa',
                        field: 'idTarifa',
                        width: '12%',
                        minWidth: '100',
                        cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
                        editDropdownOptionsFunction: function (rowEntity, colDef) {
                            return rowEntity.articuloTarifas.map(val => ({
                                id: val.idTarifa,
                                value: val.tarifa + ' - $' + val.precioConIva
                            }))
                        }
                    },
                    {
                        name: 'Precio U.',
                        field: 'precioUnitario',
                        width: '8%',
                        minWidth: '100',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationHideLabel: true,
                        footerCellFilter: `number:${$scope.decimal.nroPrecio}`,
                    },
                    {
                        name: 'P. Iva',
                        field: 'precioConIva',
                        width: '7%',
                        minWidth: '100',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationHideLabel: true,
                        footerCellFilter: `number:${$scope.decimal.nroPrecio}`,
                    },
                    {
                        name: '%',
                        field: 'porcentajeDescuento',
                        width: '6%',
                        minWidth: '100',
                    },
                    {
                        name: 'dsto.',
                        field: 'valorDescuento',
                        width: '6%',
                        minWidth: '100',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationHideLabel: true,
                        footerCellFilter: `number:${$scope.decimal.nroDescuento}`,
                    },
                    {
                        name: 'T. Dsto.',
                        field: 'totalDescuento',
                        width: '7%',
                        minWidth: '100',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationHideLabel: true,
                        footerCellFilter: `number:${$scope.decimal.nroDescuentoDetalle}`
                    },
                    {
                        name: 'Total',
                        field: 'total',
                        width: '5%',
                        minWidth: '100',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationHideLabel: true,
                        footerCellFilter: `number:${$scope.decimal.nroTotalDetalle}`
                    },
                ]
            }
        }


        $scope.columnDefsInvoice = function() {
            // let defaultPermission = Object.freeze({
            //     tarifa: {
            //         update: true
            //     },
            //     medida: {
            //         update: true
            //     },
            //     tipoIva: {
            //         update: true
            //     },
            //     porcentajeDescuento: {
            //         update: true
            //     },
            //     descuento: {
            //         update: true
            //     },
            //     precioUnitario: {
            //         update: true
            //     },
            //     precioConIva: {
            //         update: true
            //     },
            // })
    
            // const ventaDetailPermission = this.ventaDetailPermission || defaultPermission;
            
            $scope.gridOptionsDetalle.columnDefs = [{
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
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
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
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
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
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
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
                    type: 'number',
                    width: '8%',
                    minWidth: '100',
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
                    // cellFilter: "currency:'$'",
                },
                {
                    name: '%',
                    field: 'porcentajeDescuento',
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
                    min: 0,
                    width: '6%',
                    minWidth: '100',
                    // cellFilter: "currency:'%'",
                    visible: this.configDetalle.porcentajeDescuento || false,
                    type: 'number',
                    /*cellFilter: "limitTo:3",*/
                },
                {
                    name: 'dsto.',
                    field: 'valorDescuento',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    min: 0,
                    type: 'number',
                    width: '6%',
                    minWidth: '100',
                    // cellFilter: "currency:'$'",
                    visible: this.configDetalle.descuento || false
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
                    visible: this.configDetalle.totalDescuento || false
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
                    visible: this.configDetalle.ice || false
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
    
            let indexTipoIva = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idBodega');
            this.gridOptionsDetailDocument.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
            this.gridOptionsDetailDocument.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;
        }



        $scope.closeModal = function() {
            $uibModalInstance.close();
        }
    }


})(window.angular)