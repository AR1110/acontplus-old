(function(){

    'use strict';

    //Variables Constantes
    const URL_TEMPLATE = 'AprobDocument/'
    
    //Variable servicios
    let mS = {};
    let tS = {};
    let commonSvc = {};
    let notaEntregaSvc = {};
    let proformaSvc = {};
    let facturaSvc = {};
    let ventaSvc = {} ;
    let gridOptionsSvc = {} ;

   
	let mainDataForm = {};

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })


    


    app.controller('aprobacionDocumentoCtrl', aprobacionDocumentoCtrl);

    aprobacionDocumentoCtrl.$inject = ['$scope', '$injector', 'modalService', 'nombreModalVenta'];

    function aprobacionDocumentoCtrl($scope, $injector, modalSvc, nombreModalVenta) {

        //Injection Services
        mS             = $injector.get('mainService');
        commonSvc      = $injector.get('commonService');
        ventaSvc       = $injector.get('ventaService');
        notaEntregaSvc = $injector.get('notaEntregaService');
        proformaSvc    = $injector.get('proformaService');
        facturaSvc     = $injector.get('facturaService');
        tS             = $injector.get('toastService');
        gridOptionsSvc = $injector.get('gridOptionsService');


        let OPTION_APROBACION = Object.freeze({
            0:  Object.freeze({
                docOrigen: {
                    codigo: 'NE',
                    descripcion: 'Nota de Entrega',
                    codDoc: '',
                },
                docDestino: {
                    codigo: 'FV',
                    descripcion: 'Factura',
                    codDoc: '01',
                }                
            }),
            1:  Object.freeze({
                docOrigen: {
                    codigo: 'PR',
                    descripcion: 'Proforma'
                },
                docDestino: {
                    codigo: 'FV',
                    descripcion: 'Factura',
                    codDoc: '01',
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

        $scope.initiload = function () {
			try {
				ventaSvc
					.getDataForm({typeList: 1})
					.then((response) => {
                        console.log(response);
						mainDataForm = response;
						
					})
					.catch((errorResponse) => {
						console.log(errorResponse);
					});
			} catch (error) {
				console.log(error);
			}
		};

		$scope.initiload();


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

        //-----------------Filters----------------------
        $scope.dataSearch = {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            checkBoxDefault: false,
            checkBoxCliente: true,
            checkBoxEstado: true
        };

        $scope.selectedDocuments = [];


        $scope.gridOptionsSelectedDocs = {
            enableColumnMenus: false,
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
                return ["AC", "PE"].includes(row.entity.codEstado);
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

        //------------------Documento Destino----------------------------------------------------
        /**
		 * Define los datos generales del comprobante
		 */
        $scope.establecimientos = [];
        $scope.impuestosTarifas = []
        $scope.ptosEmision = [];

		$scope.data = {
			codEstab: 0,
			idTiempoCredito: 0,
			fechaEmision: new Date(),
			fechaVencimiento: new Date(),
			subTotalSinImpuestos: 0,
			iva: 0,
			subTotalIva: 0,
			subTotalIvaCero: 0,
			subTotalExentoIva: 0,
			subTotalNoObjetoIva: 0,
			subTotalNetoIva: 0,
			subTotalNetoExentoIva: 0,
			subTotalNetoNoObjetoIva: 0,
			totalIce: 0,
			irbpnr: 0,
			propina: 0,
			transporte: 0,
			recargo: 0,
			porcentajeDescuento: 0,
			totalDescuento: 0,
			total: 0
		};

		$scope.cliente = {
			idCliente: 0,
			nombreComercial: null,
			nombreFiscal: null,
			numeroIndentificacion: null,
		};


		$scope.dataClone = {};
		$scope.dataClone.fechaEmision = new Date();
		$scope.dataClone.porcentajeDescuento = 0;
		$scope.dataClone.totalDescuento = 0;



        //Detalle de los documentos seleccionados
        $scope.gridOptionsDetalle = {
            enableColumnMenus: false,
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

            $uibModalInstance.rendered.then(()=>{
                const stepDocOrigen = document.getElementById("stepDocOrigen");
                const stepDocDestino = document.getElementById("stepDocDestino");
                stepDocOrigen.style.display = "block";
                stepDocDestino.style.display = "none";

            })
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

                $scope.columnDefsInvoice();

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

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
					items: $scope.gridOptionsDetalle.data,
					decimal: $scope.decimal,
					dataTarifaImpuesto: $scope.dataTarifaImpuesto
				}))

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

        // $scope.getDataImpuestoTarifa = function () {
		// 	let actividadEstabImpuesto = $scope.impuestosTarifas.find(item => item.codigoPorcentaje === $scope.data.impuestoTarifa.codigoPorcentaje);
		// 	$scope.data.impuestoTarifa.codigoPorcentaje = actividadEstabImpuesto.codigoPorcentaje;
		// 	$scope.data.impuestoTarifa.tarifa = actividadEstabImpuesto.tarifa;
		// 	return actividadEstabImpuesto;
		// }

        //Inicio 
        $scope.initiload = function() {
            try {
                let  {establecimientos,ptosEmision, bodegas, configVenta, decimal, configDetalle, tipoIvas, tarifas, tiempoCreditos, articuloPredeterminado, clientePredeterminado, permisonVenta, permisoArticulo }= mainDataForm;

                /**
                 * Establecimiento 
                 * Impuesto Tarifa 
                 */
                
                let dataEstab = establecimientos.find(item=>(item.predeterminado))

                $scope.establecimientos = establecimientos;
                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataSearch.codEstab = $scope.data.codEstab; //Filtro
                $scope.dataClone.codEstab =$scope.data.codEstab;

                 
                $scope.tarifasImpuestos  = dataEstab.tarifasImpuestos;
                $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];
                
                console.log($scope.dataTarifaImpuesto)

                //===========Puntos Emisiones================================================
                $scope.tempPuntosEmision = ptosEmision;
                $scope.ptosEmision = $scope.tempPuntosEmision.filter(item=>item.codEstab_Asig===dataEstab.codEstab_Asig);
                let dataPtoEmi = $scope.ptosEmision.find(item=>(item.predeterminado))
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                //============Bodegas============================================================
                $scope.tempBodegas = bodegas;
                
                $scope.bodegas = $scope.tempBodegas.filter(item=>item.codEstab_Asig===dataEstab.codEstab_Asig);
                let dataBodega = $scope.bodegas.find(item=>(item.predeterminado))
                $scope.idBodega = dataBodega.idBodega;
                $scope.dataClone.idBodega = $scope.idBodega;
               
                //Decimal 
                $scope.decimal = decimal;

                //Config. Detalle (Mostrar/Ocultar Columnas)
                $scope.configDetalle = configDetalle;
                $scope.tipoIvas = tipoIvas;
                $scope.stepUno()
            } catch (error) {
                console.log(error);
            }
        }

        $scope.initiload();


        //============================================ Filtros==============================
        $scope.isValidFilter = function() {
            if(!$scope.dataSearch.codEstab){
                tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }
            if(!$scope.cliente.idCliente>0){
                tS.toastr('warning', 'Seleccione el cliente');
                return
            }
            if(!$scope.dataSearch.fechaInicio || !$scope.dataSearch.fechaFin){
                tS.toastr('warning', 'Seleccione rango de fecha')
                return
            }
            return true;
        }

        $scope.askToChangeEstabFilter = function(){
            try {
                Swal.fire({
                    title: 'Cambiar Establecimiento?',
                    text: "Se revertiran los documentos seleccionados en caso de existir!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.gridOptionsDetalle.data = [];   
                        $scope.gridOptionsSelectedDocs.data = [];

                        let dataEstab = $scope.establecimientos.find(item=>item.codEstab===$scope.dataSearch.codEstab);

                        $scope.ptosEmision = $scope.tempPuntosEmision.filter(item=>item.codEstab_Asig===dataEstab.codEstab_Asig);

                        let dataPtoEmi = $scope.ptosEmision.find(item=>(item.predeterminado))
                        $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                        if($scope.isValidFilter()){
                            $scope.getDocumentos();
                        }
                        $scope.dataClone.codEstab = $scope.dataSearch.codEstab;
                    }else{
                        $scope.dataSearch.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                    }
                  })
            } catch (error) {
                console.log(error);
            }
        }

        $scope.resultDateRange = function(item){
            if($scope.isValidFilter()){
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
            $scope.cliente = item;
            if($scope.isValidFilter()){
                $scope.getDocumentos();
            }          
        }

        $scope.refresh = function(){
            let selectedDocuments = $scope.gridApi.selection.getSelectedRows() || []
            if(selectedDocuments.length>0){
                tS.toastr('warning', 'Tienes documentos seleccionados')
                return
            }
            $scope.getDocumentos();
        }


        $scope.getDocumentos = function(){
            try {
                $scope.documentos = [];
                $scope.dataSearch.byCliente = $scope.cliente.idCliente;
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
                showLoader();           
                $scope.documentos = [];
                $scope.dataSearch.typeList = 2;
                notaEntregaSvc.getAll($scope.dataSearch).then(async response=>{
                    $scope.gridOptionsSelectedDocs.columnDefs = [{
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
                        aggregationType: uiGridConstants.aggregationTypes.sum,
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
                    hideLoader();
                    console.log(error);
                })                    
            } catch (error) {
                hideLoader();
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
                let {detalleDocumento, datosAdicionalesArticulo, infoAdicionalDocumento} = await commonSvc.getDataTipoDocVenta({
                    id: item.idDocumento,
                    codigoDocumento: $scope.docOrigen.codigo
                })
                item.subGridOptions.data = detalleDocumento;
    
                //Historial Ventas de Nota Entrega 
                tempHistorialInfoAdicional.push(datosAdicionalesArticulo);
                tempInfoAdicionalDocumento.push(infoAdicionalDocumento)
            }
    
            $scope.gridOptionsSelectedDocs.data = $scope.documentos;
            $scope.historialVentas = tempHistorialInfoAdicional.flat();
            $scope.infoAdicionalDocumento = tempInfoAdicionalDocumento.flat();
            
            hideLoader();
            if ($scope.documentos.length === 0) {
                tS.toastr('info', 'No se encontraron los Documentos');
            }
    
        }
    
        $scope.columnDefsSubGridOptions = function () {            
            return {
                enableColumnMenus: false,
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
                    enableCellEdit: false,
                    enableCellEditOnFocus: false,
                    cellTooltip: function (row) {
                        return row.entity.descripcion;
                    },
                    width: '25%',
                    minWidth: '100'
                },
                {
                    name: 'Cant.',
                    field: 'cantidad',
                    enableCellEditOnFocus: false,
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
                    enableCellEdit: false,
                    enableCellEditOnFocus: false,
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
                    visible: $scope.configDetalle.porcentajeDescuento || false,
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
    
            $scope.setWarehouseAndIVA();
        }



        /**
         * ==========================DOCUMENTO DESTINO===================================== 
         * 
         */
        /**
		 * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
		 */
		$scope.setWarehouseAndIVA = function () {
			let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
			let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');

			$scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
			$scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
		}
        
        $scope.onChangeEstab = function() {
            try {
                Swal.fire({
                    title: 'Cambiar Establecimiento?',
                    text: "Se cambiará puntos de Emisión y la bodega en el detalle!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      
                        let dataEstab = $scope.establecimientos.find(item=>item.codEstab===$scope.data.codEstab);

                        if(!$scope.tempPuntosEmision.some(item=>item.codEstab_Asig===dataEstab.codEstab_Asig)){
                            tS.toastr('info', 'No tienes Puntos de Emisión asignado a este establecimiento');
                            $scope.data.codEstab = $scope.dataClone.codEstab;
                            $scope.$apply();
                            return
                        }
                        if(!$scope.tempBodegas.some(item=>item.codEstab_Asig===dataEstab.codEstab_Asig)){
                            tS.toastr('info', 'No tienes bodegas asignado a este establecimiento');
                            $scope.data.codEstab = $scope.dataClone.codEstab;
                            $scope.$apply();
                            return
                        }

                        //Impuesto Tarifa
                        $scope.tarifasImpuestos  = dataEstab.tarifasImpuestos;
                        $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];

                        //Puntos de Emision 
                        $scope.ptosEmision = $scope.tempPuntosEmision.filter(item=>item.codEstab_Asig===dataEstab.codEstab_Asig);

                        let dataPtoEmi = $scope.ptosEmision.find(item=>(item.predeterminado))
                        $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                        //Bodegas 
                        $scope.bodegas = $scope.tempBodegas.filter(item=>item.codEstab_Asig===dataEstab.codEstab_Asig);
                      
                        let dataBodega = $scope.bodegas.find(item=>(item.predeterminado));
                        $scope.idBodega = dataBodega.idBodega;

                        $scope.dataClone.codEstab = $scope.data.codEstab;
                    }else{
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                    }
                  })
            } catch (error) {
                console.log(error);
            }
        }


        $scope.askToSaveDoc = async function(){
            try {
                if(!$scope.data.codEstab){
                    tS.taostr('warning', 'Seleccione el establecimiento')
                    return
                }
                if(!$scope.data.idPuntoEmision){
                    tS.taostr('warning', 'Seleccione el establecimiento')
                    return
                }

                let {isConfirmed} = await Swal.fire({
                    //title: 'Are you sure?',
                    text: "Está seguro de guardar el Documento de Aprobación Documnento!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar!'
                })

                if(isConfirmed){
                    
                    let comprobante = {
                        ...$scope.data,
                        codDoc: $scope.docDestino,
                        idCliente: $scope.cliente.idCliente,
                        fechaEmision: fS.formatDateTimeZone(this.data.fechaEmision),
                        docOrigen: $scope.codigo,
                        total: $scope.selectedDocuments.map(item => item.total).reduce((prev, acc) => prev + acc, 0)
                    }

                    //Tarifa Aplicada al Documento
                    //jsonHeader.tarifa = this.actividadTipoIva.tarifa;

                    let tempDetail = [];
                    let orderIndex = 1;
                    for (let item of $scope.gridOptionsDetalle.data) {

                        let precioTotalSinImpuesto = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                        let obj = {
                            orderIndex: orderIndex ++,
                            idAprob_Document_Detailt: 0,
                            idTarifa: item.idTarifa,
                            idArticulo: item.idArticulo,
                            idTipoIva: item.idTipoIva,
                            idMedida: item.idMedida,
                            cantidad: item.cantidad,
                            descripcion: item.descripcion,
                            precioUnitario: item.precioUnitario,
                            precioConIva: item.precioConIva,
                            valorDescuento: item.valorDescuento,
                            descuento: item.valorDescuento,
                            precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, $scope.decimal.nroTotalDetalle),
                            baseImponible:  fS.roundNumber(precioTotalSinImpuesto, $scope.decimal.nroTotalDetalle),
                            codigoPorcentaje: item.codigoPorcentaje,
                            tarifa: item.tarifa
                        }
                        tempDetail.push(obj);
                    }

                    let infoAdicional = $scope.infoAdicionalDocumento.filter(item => {
                        if(item){
                            return $scope.selectedDocuments.some(docs => docs.idComprobante===item.idDocumento)
                        }else{
                            return false;
                        }
                    })

                    let historialVenta = $scope.historialVentas.filter(item => {
                        if(item){
                            return $scope.selectedDocuments.some(docs => docs.idNotaEntrega===item.idDocumento)
                        }else{
                            return false;
                        }
                    })

                

                    const data = {
                        comprobante: JSON.stringify(comprobante),
                        detalle: JSON.stringify(tempDetail),
                        historial: JSON.stringify($scope.selectedDocuments.map(item => ({
                            idDocumento: item.idNotaEntrega || item.idProforma,
                            serie: item.nroDocumento,
                        }))),
                        infoAdicional: JSON.stringify(infoAdicional),
                        historialVenta: JSON.stringify(historialVenta),
                    }

                    aprobacionDocSvc.save(data).then(response => {
                        hideLoader();
                        if (response.code === "0") {
                            Swa
                            fS.sweetAlert('warning', response.message);
                        }
                        if (response.code === '1') {
                            hideLoader();
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response);
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    })
                }
                
            } catch (error) {
                console.log(error);
            }
        }

        $scope.closeModal = function() {
            $uibModalInstance.close();
        }
    }


})(window.angular)