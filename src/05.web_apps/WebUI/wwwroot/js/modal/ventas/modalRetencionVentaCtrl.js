export class ModalBaseCtrl{
    cellTemplateImpuesto= `<div style="height:100%">
                                <input  type="text" ng-class="'colt' + col.uid" id="idAutocompleteImpuesto{{row.entity.num}}" class="form-control" ng-model="row.entity.impuesto"
                                ng-required="true"
                                uib-typeahead="ti as ti.impuesto for ti in grid.appScope.$ctrl.searchImpuesto($viewValue, row.entity.tipoImpuesto)"
                                autocomplete="off"
                                typeahead-editable="false"
                                typeahead-append-to-body="true"           
                                typeahead-template-url="autoCompleteTipoImpuesto.html"
                                typeahead-on-select="grid.appScope.$ctrl.seleccionarImpuesto(row.entity, $item)">          
                            </div>
                            </script>
                            <script type="text/ng-template" id="autoCompleteTipoImpuesto.html">
                                <div class="autocomplete-suggestion-uib-typeahead">
                                    <span class="item-title">
                                        <small>{{match.model.impuesto}}</small><br/>
                                        <i class="{{match.model.icono}}"></i> <small><b>Tipo Impuesto: </b> {{match.model.tipoRetencion}}</small>                
                                    </span>
                                </div>
                            </script>` ; 
    
    constructor({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form}){                 
        this.scopeParent = this;
        this.$scope            = $scope; 
        this._form             = _form;
        this._mS               = _mS;
        this.$timeout          = $timeout;
        this._commonSvc        = _commonSvc;
        this._modalSvc         = _modalSvc;
        this._nombreModal      = _nombreModal
        this.$uibModalInstance = $uibModalInstance;      
        this.uiGridConstants   = uiGridConstants;
        this._tS           = toastr;  

        this.sucursal    = {};
        this.asignacionesData = {}; //(data sucursal, puntos emisiones y bodegas)

        this.data        = {};
        this.tipoDoc     = Object.freeze(this._commonSvc.tipoDoc['RV']); 
    
        this.gridOptions = this.getGridOptions();
        this.gridOptions.onRegisterApi =(grid)=> {            
            $scope.gridApi = grid;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 10);
            }

            grid.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue)=> {
                
                let index = this.gridOptions.data.indexOf(rowEntity);

                if (colDef.field === "retencionCompraDetalle.baseImponible") {

                    if ([null, "", undefined].includes(rowEntity.retencionCompraDetalle.baseImponible)) {
                        rowEntity.retencionCompraDetalle.baseImponible = oldValue;
                    }
                    
                    let baseImponible = rowEntity.retencionCompraDetalle.baseImponible || 0;
                    let porcentajeRetencion = Number(rowEntity.retencionCompraDetalle.porcentajeRetencion);                    
                    
                    let porcentaje = Number(porcentajeRetencion) / 100;
                    let result = porcentaje * baseImponible;
                    this.gridOptions.data[index].retencionCompraDetalle.valorRetenido = this._form.roundNumber(result, 2);                                       
                }                
            })
        }
    }

    async initiload(){
        return await Promise.all([
            this._commonSvc.getAsignacionByRol().then(response=>JSON.parse(response)),
            this._commonSvc.getAllTiempoCredito(true).then(response=>response),
            this._commonSvc.getConfigDecimal().then(response=>response),
            this._commonSvc.getConfigVentaDetalle().then(response=>response),
            this._commonSvc.getAllTipoIva().then(response=>response),
            this._commonSvc.getAllTarifa().then(response=>response),
            this._commonSvc.getEstadoDocByCodDoc(this.tipoDoc.codigo).then(response=>response)
        ])
    }

    async recargarDetalleRetencion(){
        let {isConfirmed} = await Swal.fire({
            icon:'warning',
            html:`<small>Está seguro de recargar el detalle de la Retención</small>`,
            showConfirmButton: true,
            confirmButtonText:'Sí, guardar',
            showCancelButton:true,
            cancelButtonText:'No, cancelar',
            allowOutsideClick:false                
        })

        if(!isConfirmed) return

        this.generateRetencion();
    }

    async generateRetencion() {   
        try {            
                        
            this._mS.getData('get', `/GenerateRetencion/GetGenerateRetencionCompra?idFacturaCompra=${this.idComprobante}`, null, true).then(
                response=>{
                    if (response.id === "0") {                                   
                        this._form.sweetAlert('warning', response.message, response.titleSms);                    
                    }
    
                    if (response.id === "1") {     
                        this.gridOptions.data = response.data;                                        
                        const { totalBaseImponible, totalRenta, totalIva } = this.getTotal();
                        
                        this.data.total = this._form.roundNumber(totalBaseImponible,5);
                        this.data.totalRenta = this._form.roundNumber(totalRenta,5);
                        this.data.totalIva = this._form.roundNumber(totalIva,5);                                        
                                                                   
                    }

                    if(response.id=="2"){                
                        const data={
                            tipoRetencion: 'RC',
                            idProveedor: this.proveedor.idProveedor,
                            idSubContribuyente: response.gestion,
                            idFactura: this.idComprobante,
                            idConfigContribuyente: response.lastId
                        }
                        this.openModalArticuloImpuesto(data)
                                                                                                              
                    }
                }
            ).catch(error=>{
                hideLoader();
            })      
            
        } catch (error) {
            hideLoader();
            console.error(error)
        }             
    }

    //Get Total de Retencion Compra
    getTotal() {
        let totalBaseImponible = 0, totalRenta = 0, totalIva = 0;
        angular.forEach(this.gridOptions.data, val => {
            if (val.codigoSri===1) {
                totalRenta += val.retencionCompraDetalle.baseImponible;
            } else {
                totalIva += val.retencionCompraDetalle.baseImponible;
            }
            totalBaseImponible += val.retencionCompraDetalle.baseImponible;
        });
        return {  totalBaseImponible, totalRenta, totalIva };            
    }

    async openModalArticuloImpuesto(params){
        const {MODAL_CTRL, MODAL_ARTICULO_IMPUESTO_RETENCION_CSHTML} = this._nombreModal.articulo;
        const {ArticuloImpuestoRetencion} = await import('./../../modal/' + MODAL_CTRL);
        const modalRef = this._modalSvc.openModalCustom({
            controller: ArticuloImpuestoRetencion,
            template: MODAL_ARTICULO_IMPUESTO_RETENCION_CSHTML,
            size:'xl',
            params
        })
        modalRef.result.then(response=>{
            if(typeof response==='object'){
                this.generateRetencion();
            }
        })
    }

     //Buscar Impuesto
    searchImpuesto(busqueda, tipoImpuesto) {                
        return this._mS.getData('get', '/RetencionCompra/GetTipoImpuesto?busqueda=' + busqueda).then(
            response=>response.data
        )

    }

    //Seleccionar Impuesto 
    seleccionarImpuesto(entity, item) {            
        if (!this._form.campo(item)) {                
            entity.impuesto = item.impuesto,
            entity.tipoRetencion = item.tipoRetencion,
            entity.codigoImpuesto = item.codigoImpuesto,
            entity.retencionCompraDetalle.idRetencion = item.retencionCompraDetalle.idRetencion,
            entity.retencionCompraDetalle.idImpuesto = item.retencionCompraDetalle.idImpuesto,
            // entity.retencionCompraDetalle.baseImponible= item.retencionCompraDetalle.baseImponible,
            entity.retencionCompraDetalle.porcentajeRetencion = item.retencionCompraDetalle.porcentajeRetencion,
            entity.retencionCompraDetalle.valorRetenido = item.retencionCompraDetalle.valorRetenido               

            this.focusBaseImponible(entity);            
        }
    };

    focusBaseImponible = function(entity){        
        this.$scope.gridApi.cellNav.scrollToFocus(
            this.gridOptions.data[0],
            this.gridOptions.columnDefs[1]
        );

        this.$timeout(()=>{
            this.$scope.gridApi.cellNav.scrollToFocus(
                this.gridOptions.data[this.gridOptions.data.indexOf(entity)],
                this.gridOptions.columnDefs[3]
            );
        }, 10)        
    }

    addItem() {        
        let data = {
            num: 1,
            impuesto: '',
            // tipoImpuesto: '',
            // codigoImpuesto: '',
            retencionCompraDetalle:{
                 idRetencion: 0,
                 idImpuesto:0,
                 baseImponible: 0,
                 porcentajeRetencion:  0,
                 valorRetenido: 0
            }                                            
        }
        this.gridOptions.data.push(data);                
    }

    //Eliminar Item Impuesto
    deleteRow(row) {
        let index = this.gridOptions.data.indexOf(row.entity);
        this.gridOptions.data.splice(index, 1);                
    }
    

    getGridOptions(){
        return  {
            enableColumnMenus: false,
            showColumnFooter: true,
            enableFiltering: false,
            enableRowHashing: false,
            enableCellEdit: false,
            
            columnDefs: [                                
                {
                    name: 'Impuesto',
                    field: 'tipoRetencion',                    
                    type: 'string',
                    width: '10%',
                    minWidth: 100,
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',
                },
                {
                    name: 'Cod. Imp.',
                    field: 'codigoImpuesto',
                    type: 'string',
                    width: '10%',
                    minWidth: 100,
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',
                },                
                {
                    name: "descripción",
                    field: "impuesto",
                    allowCellFocus: false,
                    cellTemplate: this.cellTemplateImpuesto,
                    editableCellTemplate: this.cellTemplateImpuesto,
                    width: '40%',
                    minWidth: '100'
                },

                {
                    name: 'B. Imponible',
                    field: 'retencionCompraDetalle.baseImponible',                    
                    cellFilter: "currency:'$'",
                    // footerCellTemplate: `<div style="height: auto">
                    //                         <span class="ui-grid-cell-contents">T. Renta: <span class="text-right"> {{grid.appScope.data.totalRenta|currency:'$' }}</span></span>
                    //                         <span class="ui-grid-cell-contents">T. Iva:  <span class="text-right">{{grid.appScope.data.totalIva|currency:'$' }}</span></span>
                    //                         <span class="ui-grid-cell-contents">Total:  <span class="text-right">{{grid.appScope.data.total|currency:'$' }}</span></span>
                    //                     </div>`,
                    aggregationType: this.uiGridConstants.aggregationTypes.sum,customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    }, aggregationLabel: "Total: ",                    
                    footerCellFilter: 'number:2',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    footerCellFilter: 'number:2',
                    cellClass: 'body-text-retencion',
                    type: 'number',
                    width: '12%',
                    minWidth: 100
                },
                {
                    name: '%. Retención',
                    field: 'retencionCompraDetalle.porcentajeRetencion',                    
                    cellFilter: "currency:'%'",
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',
                    type: 'number',
                    width: '12%',
                    minWidth: 100
                },
                {
                    name: 'V. Retenido',
                    field: 'retencionCompraDetalle.valorRetenido',                    
                    cellFilter: "currency:'$'",
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',
                    aggregationType: this.uiGridConstants.aggregationTypes.sum,customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = aggregation.value;
                    }, aggregationLabel: "Total: ",                    
                    footerCellFilter: 'number:2',
                    type: 'number',
                    width: '10%',
                    minWidth: 100
                },
                {
                    name: 'Op',
                    headerCellTemplate: '<button type="button" ng-click="grid.appScope.$ctrl.addItem()" class="btn btn-secondary  btn-sm"><i class="fa fa-plus-circle"></i></button>',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    width: '2%',
                    minWidth: '50',
                    cellTemplate: '<a class="btn btn-danger btn-xs text-white"  style="cursor:pointer;" title="Eliminar Retencion agregada" ng-click="grid.appScope.$ctrl.deleteRow(row)"><i class="ti-trash"></i></a>',
                }
            ],
            onRegisterApi: function(gridApi) {
                this.$scope.gridApi = gridApi;
            }
        }
    }

    async generarNroSecuencial(){
        return this._commonSvc.generarNroDocumento({
            idPuntoEmision: this.puntoEmision.idPuntoEmision,
            codigoDocumento: this.tipoDoc.codigo
        })
    }

    //-------------------------------------------INFOMACIÓN ADICIONAL DEL ARTICULO ----------------------------
    async openModalInfoAdicional(isView=false){
        const data = {
            isView,
            infoAdicionalDocumento: this.infoAdicionalDocumento
        }
        const {MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL, MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML} = this._nombreModal.common;
        const {InfoAdicionalTipoDocCtrl} = await import('./../../modal/' + MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL);
        let modalRef = this._modalSvc.openModalCustom({
            controller: InfoAdicionalTipoDocCtrl,
            template: 'Shared/Common/'+MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML,
            size:'md',
            params: data
        })
        modalRef.result.then(infoAdicionalDocumento=>{
            this.infoAdicionalDocumento = infoAdicionalDocumento
        })
    }

    async viewDetailInvoice(){
        const response = await this._commonSvc.getDataTipoDocCompra({
            item: this.factura,
            codigoDocumento: 'FC'
        });
        if(!response.isComplete) return
        
        const {MODAL_CTRL, MODAL_DETALLE_CSHTML} = this._nombreModal.factura_compra
        const {ModalDetalleCtrl} =  await import('./../../modal/' + MODAL_CTRL);
        this._modalSvc.openModalCustom({
            controller: ModalDetalleCtrl,
            template: 'FacturaCompra/'+ MODAL_DETALLE_CSHTML,
            size:'xl',
            windowClass:'uibModalFullScreen',
            params: response
        })               
    }

    closeModal(){
        this.$uibModalInstance.close();
    }
}




export class ModalRetencionCtrl extends ModalBaseCtrl{
    static $inject = [
        '$scope',
        '$timeout', 
        'mainService', 
        'commonService', 
        'modalService', 
        'nombreModal', 
        '$uibModalInstance', 
        'uiGridConstants', 
        'toastService',
        'formulario',
        'toastService',
        'params'
    ]
    constructor(
        $scope, 
        $timeout, 
        _mS, 
        _commonSvc, 
        _modalSvc, 
        _nombreModal,  
        $uibModalInstance, 
        uiGridConstants, 
        toastr, 
        _form,
        _tS,
        _params
        ){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form})        
        this._params = _params || {};
        this.cliente = {}        
        this.data.fechaEmision = new Date();

        this.factura  ={};
        this.facturas = [];
        this.infoAdicionalDocumento=[];
        this.tipoRegistro = 1;
    }

    $onInit(){

    }
}





export class ModalDetalleCtrl extends ModalBaseCtrl{
    static $inject = [
        '$scope',
        '$timeout', 
        'mainService', 
        'commonService', 
        'modalService', 
        'nombreModal', 
        '$uibModalInstance', 
        'uiGridConstants', 
        'toastService',
        'formulario',
        'toastService',
        'params'
    ]
    constructor(
        $scope, 
        $timeout, 
        _mS, 
        _commonSvc, 
        _modalSvc, 
        _nombreModal,  
        $uibModalInstance, 
        uiGridConstants, 
        toastr, 
        _form,
        _tS,
        _params
        ){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form})
       
        this._params           = _params;

        this.gridOptionsRetencionVentaDetalle = {
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            enableColumnReordering: true,
            showGridFooter: false, 
            appScopeProvider: this, 
            columnDefs: this.columnDefs()                
        }
    } 

    async $onInit(){
        let {cliente, dataTipoDocumento, dataDocumento, detalleDocumento, infoAdicionalDocumento} = this._params;
        const results        = await this.initiload();
        const asignaciones   = results[0]; 
               
        this.sucursales      = asignaciones[0];
        this.puntosEmisiones = asignaciones[1];
        this.bodegas         = asignaciones[3];
        

        this.tiempoCreditos  = results[1];
        this.decimal         = results[2];
        //configuracion detalle para ocultar las columnas results[3]
        this.tipoIvas        = results[4];
        this.tarifas         = results[5];
        
        this.dataTipoDocumento = dataTipoDocumento;
        this.cliente           = cliente;
        this.data              = dataDocumento;
        
        //En DataDocumento añadir el idSucursal (revisar posteriormente)
        this.data.idSucursal   = this.sucursales[0].idSucursal;

        this.data.fechaEmision       = this._form.formatDate(this.data.fechaEmision);
        this.fechaEmisionEscrita     = this._form.getFechaEscrita(this.data.fechaEmision);        

        this.$timeout(()=>{                      
            this.gridOptionsRetencionVentaDetalle.data = detalleDocumento;
        })

        // this.gridOptionsInfoAdicionalDocumento = infoAdicionalDocumento;        
    }
    
    columnDefs(){
        return [
            {
                name: 'N°', field: 'num', visible: true,
                enableCellEdit: false,
                allowCellFocus:false,
                width: '5%', minWidth: '50',
            },
            {
                name: 'Impuesto',
                field: 'tipoImpuesto',
                type: 'string',
                width: '10%',
                minWidth: '100',
                allowCellFocus:false,
                enableCellEdit:false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: 'Cod. Imp.',
                field: 'codigoImpuesto',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,            
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                allowCellFocus:false,
            },
            {
                name: "descripción",
                field: "impuesto",
                allowCellFocus: false,
                enableCellEdit: false,
                width: '43%',
                minWidth:'100'
            },
            {
                name: 'B. Imponible',
                field: 'detalle.baseImponible',
                enableColumnMenu: false,
                aggregationType: this.uiGridConstants.aggregationTypes.sum,
                min: 0,
                minWidth: 110,
                footerCellFilter: 'number:2',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.impuesto !==''
                },
                cellFilter: "currency:'$'",
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '10%',
                minWidth:'100'
            },
            {
                name: 'porcentaje',
                field: 'detalle.porcentajeRetencion',
                enableColumnMenu: false,
                cellFilter: "currency:'%'",
                enableCellEdit: false,
                allowCellFocus:false,
                minWidth: 110,
                type: 'number',
                width: '10%',
                minWidth:'100'
            },
            {
                name: 'V. Retenido',
                field: 'detalle.valorRetenido',
                aggregationType: this.uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'number:2',
                cellFilter: "currency:'$'",
                enableCellEdit: false,
                allowCellFocus:false,
                enableCellEditOnFocus: false,
                enableColumnMenu: false,
                minWidth: 110,
                type: 'number',
                width: '10%',
                minWidth:'100'
            }           
        ];
    }          
    

    closeModal(){
        this.$uibModalInstance.close();
    }
}