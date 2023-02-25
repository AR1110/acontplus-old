
//Clase base para Retencion 
class ModalBaseCtrl{
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
        this.$scope            = $scope; 
        this._form             = _form;
        this._mS               = _mS;
        this.$timeout          = $timeout;
        this._commonSvc        = _commonSvc;
        this._modalSvc         = _modalSvc;
        this._nombreModal      = _nombreModal
        this.$uibModalInstance = $uibModalInstance;      
        this.uiGridConstants   = uiGridConstants;
        this._toastr           = toastr;  

        this.data = {}
        
      
        
    }


    getValorRetenido(baseImponible, porcentajeRetencion){
        let porcentaje = Number(porcentajeRetencion) / 100;
        let result = porcentaje * baseImponible;
        return this._form.roundNumber(result, 2);                                       
    }

    querySearchInvoice (query) {
        let results = query ? this.facturas.filter(this.createFilterFor(query)) : this.facturas;
        
        return results
    }
     /**
     * Create filter function for a query string
     */
    createFilterFor(query) {
        let lowercaseQuery = query.toLowerCase();
        return function filterFn(state) {
            return (state.nroDocumento.indexOf(lowercaseQuery) === 0);
        }
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
                if(this.TIPO_DOC.codigo==="RC"){
                    this.generateRetencion();
                }
                if(this.TIPO_DOC.codigo==="RV"){
                    this.generarRetencionVenta();
                }
            }
        })
    }

     //Buscar Impuesto
    searchImpuesto(busqueda, tipoImpuesto) {                
        return this._mS.getData('get', '/RetencionCompra/GetTipoImpuesto?busqueda=' + busqueda).then(response=>response.data)

    }


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

    //Eliminar Item Impuesto
    deleteRow(row) {
        let index = this.gridOptions.data.indexOf(row.entity);
        this.gridOptions.data.splice(index, 1);                
    }
      
    async generarNroSecuencial(){
        return this._commonSvc.generarNroDocumento({
            idPuntoEmision: this.data.idPuntoEmision,
            codigoDocumento: this.TIPO_DOC.codigo
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




    async onChangeSucursal(){
        try {

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
              })
              
              let {isConfirmed} = await  swalWithBootstrapButtons.fire({
                title: '<small>Cambiar Establecimiento?</small>',
                html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b>?</small>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, cambiar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })

            if(!isConfirmed){
                this.data.codEstab = this.cloneCodEstab;
                this.$scope.$apply();
                return
            }

            this.cloneCodEstab = this.data.codEstab;

            let dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab);   
            
            //Obtenemos Puntos de Emision y Bodegas 
            let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
           
            this.puntosEmision = resultsDataFormEstab[0];
            this.data.idPuntoEmision = this.puntosEmision.length>0 ? this.puntosEmision[0].idPuntoEmision: 0;
 
            this.$scope.$apply();
        } catch (error) {
            console.trace(error)
        }       
    }
    
    closeModal(){
        this.$uibModalInstance.close();
    }


}



/**
 * ------------------------------------------------------------------------------------------------
 *                                                 START RETENCION COMPRA 
 * ------------------------------------------------------------------------------------------------
 */

class ModalRetencionCompraCtrl extends ModalBaseCtrl{
  
    constructor({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form}){
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form})

        this.TIPO_DOC = this._commonSvc.tipoDoc['RC'];
        this.TIPO_DOC_FC = this._commonSvc.tipoDoc['FC'];

        this.proveedor = {};
        
        this.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: true,
            enableFiltering: false,
            enableRowHashing: false,
            enableCellEdit: false,         
        }

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

                //Retencion Cpmpra
                if (colDef.field === "baseImponible") {

                    if ([null, "", undefined].includes(rowEntity.baseImponible)) {
                        rowEntity.baseImponible = oldValue;
                    }
                    
                    rowEntity.valorRetenido = this.getValorRetenido(
                        rowEntity.baseImponible,
                        rowEntity.porcentajeRetencion
                    )                                                       
                }  
                              
            })
        }


        this.infoAdicionalDocumento = [];
       
    }

    /**
     * 
     * @param {object} json 
     * @returns  array
     */

    initiload(json){
        return this._mS.getData('get', '/FacturaCompra/GetDataForm?json=' + JSON.stringify(json)).then(response=>{            
            if(response.code==="0"){
                throw response
            }
            return JSON.parse(response.payload)
        })
    }

    getDataFormEstabAsig(json={}){
        return this._mS.getData('get', '/EstabAsig/GetDataForm?json=' + JSON.stringify(json)).then(response=>{
            if(response.code==='0'){                
                throw response
            }
            return JSON.parse(response.payload)
        })
    }

    setColumnDefs(){
        this.gridOptions.columnDefs = [                                
            {
                name: 'Impuesto',
                field: 'tipoImpuesto',                    
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
                field: 'baseImponible',                    
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
                field: 'porcentajeRetencion',                    
                cellFilter: "currency:'%'",
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                type: 'number',
                width: '12%',
                minWidth: 100
            },
            {
                name: 'V. Retenido',
                field: 'valorRetenido',                    
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
        ]
    }

    setColumnDefsView(){
        this.gridOptions.columnDefs = [                                
            {
                name: 'Impuesto',
                field: 'tipoImpuesto',                    
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
                width: '40%',
                minWidth: '100'
            },

            {
                name: 'B. Imponible',
                field: 'baseImponible',                    
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
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                footerCellFilter: 'number:2',
                cellClass: 'body-text-retencion',
                type: 'number',
                width: '12%',
                minWidth: 100
            },
            {
                name: '%. Retención',
                field: 'porcentajeRetencion',                    
                cellFilter: "currency:'%'",
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                type: 'number',
                width: '12%',
                minWidth: 100
            },
            {
                name: 'V. Retenido',
                field: 'valorRetenido',                    
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
                headerCellTemplate: '<button type="button"  class="btn btn-secondary  btn-sm disabled"><i class="fa fa-plus-circle"></i></button>',
                enableCellEdit: false,
                enableColumnMenu: false,
                width: '2%',
                minWidth: '50',
                cellTemplate: '<a class="btn btn-danger btn-xs text-white disabled"  style="cursor:pointer;" title="Eliminar Retencion agregada" ><i class="ti-trash"></i></a>',
            }
        ]
    }


    async selectedItemProveedor(item){
        try {
            this.idComprobante = null;
            this.searchTextInvoice = null;
            this.proveedor = {};
            this.facturas = [];
            this.gridOptions.data = [];

            if(item.idProveedor>0){
                this.facturas = []
                this.proveedor = item;
                this.facturas = await this.getFacturas();
                this.$scope.$apply();
            
            }
        } catch (error) {
            this.idComprobante = null;
            this.searchTextInvoice = null;
            this.proveedor = {};
            this.facturas = [];
            this.gridOptions.data = [];
            this.$scope.$apply();
            console.log(error)
        }finally{

        }
    }

    async getFacturas(){
        let facturas = [];
        await this._mS.getData('get', '/FacturaCompra/GetByProveedor?idProveedor=' + this.proveedor.idProveedor).then(response=>{
            if (response.id === "0") {                    
                Swal.fire({                    
                    icon:'warning',
                    html:`<small>${response.message}</small>`
                })  
            }
            
            if (response.id === "1") {
                facturas = response.data.map(item=>{
                    let obj = {
                        idFacturaCompra: item.factura.idFacturaCompra,                         
                        idTipoDocumento: item.factura.idTipoDocumento,
                        nroDocumento: item.nroDocumento
                    }
                    return obj;
                })               
            }
        })
        return facturas;
    }

    
    async openModalInvoiceFast(){    
        if(!this.proveedor.idProveedor>0){
            this._form.sweetAlert('warning', 'Seleccione el Proveedor')
            return
        }   
        let {MODAL_FILE_CTRL, MODAL_INVOICE_FAST} = this._nombreModal.factura_compra;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_INVOICE_FAST['controller']]
        let template   = MODAL_INVOICE_FAST['template'];

        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size: 'xl',        
            params: {
                establecimiento: this.establecimientos.find(item=>item.codEstab===this.data.codEstab),
                proveedor: this.proveedor
            }         
        })
        modalRef.result.then(
            async response=>{
                if(typeof response!=='object') return

                this.facturas = await this.getFacturas();
                this.factura = this.facturas.find(item=>item.idFacturaCompra===response.id);                
                this.selectedItem = this.factura.nroDocumento;
                this.idComprobante = this.factura.idFacturaCompra;
                this.generateRetencion();
                this.$scope.$apply();
            }
        )
    }

    selectedItemInvoice(item){
        if(item && item.idFacturaCompra>0){
            this.idComprobante = item.idFacturaCompra;
            this.factura = item;
            this.generateRetencion()            
        }
    }

    searchTextChangeInvoice(item){
        this.idComprobante = null;         
        this.gridOptions.data = [];
       
    }

    refreshDetailRetencion(){
        if(!this.idComprobante){
            Swal.fire({
                icon:'warning',
                html:`<small>Seleccione la Factura </small>`
            })
            return
        }
        this.recargarDetalleRetencion();
    }


    async viewDetailInvoice(){

        try {
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = this._nombreModal.factura_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']]
            let template = MODAL_DETALLE['template'];        
                
            //Obtenemos datos de la Factura de Compra 
            let response = await this._commonSvc.getDataTipoDocCompra({
                id: this.factura.idFacturaCompra, 
                codigoDocumento: this.TIPO_DOC_FC.codigo
            })            

            if(!response.isComplete) return

            let params = {
                TIPO_REGISTRO: 'DETALLE',
                data: response
            }
            
            
            this._modalSvc.openModalCustom({
                controller,
                template,
                size:'xl',
                windowClass:'uibModalFullScreen',
                params
            })
        } catch (error) {
            console.log(error)            
        }   
                
    }


    getTotales() {
        
        let totalBaseImponible = 0, totalRenta = 0, totalIva = 0;

        for(let item of this.gridOptions.data){
            if(item.codigoSri===1){
                totalRenta += item.baseImponible;
            }else{
                totalIva += item.baseImponible;
            }
            totalBaseImponible += item.baseImponible;
        }
       
        return {  totalBaseImponible, totalRenta, totalIva };            
    }

   


    addItem() {   
        let obj = {
            num: 1,
            tipoImpuesto: null,
            impuesto: null,            
            idRetencion: 0,
            idImpuesto:0,
            baseImponible: 0,
            porcentajeRetencion:  0,
            valorRetenido: 0
                                                      
        }
                          
        this.gridOptions.data.push(obj);                
    }


     //Seleccionar Impuesto 
     seleccionarImpuesto(entity, item) {            
        if (this._form.campo(item)) return
               
        entity.tipoImpuesto = item.tipoRetencion,
        entity.impuesto = item.impuesto,
        entity.codigoImpuesto = item.codigoImpuesto,
        entity.idRetencion = item.retencionCompraDetalle.idRetencion,
        entity.idImpuesto = item.retencionCompraDetalle.idImpuesto,
        // entity.baseImponible= item.retencionCompraDetalle.baseImponible,
        entity.porcentajeRetencion = item.retencionCompraDetalle.porcentajeRetencion,
        entity.valorRetenido = item.retencionCompraDetalle.valorRetenido    
        

        this.focusBaseImponible(entity);            
    }


    getTotalValorRetenido() {
        let total = this.gridOptions.data.map(val=>val.valorRetenido).reduce((prev, curr)=>prev+curr,0);            
        return this._form.roundNumber(total,5);
    }


    async generateRetencion() {   
        try {            
            showLoader();
            this.gridOptions.data = [];
            await this._mS.getData('get', `/GenerateRetencion/GetGenerateRetencionCompra?idFacturaCompra=${this.idComprobante}`).then(response=>{
                
                console.log(response)
                if (response.id === "0") {                      
                    this._form.sweetAlert('warning', response.message, response.titleSms);                    
                }

                if (response.id === "1") {     
                    // this.gridOptions.data = response.data;    
                    
                    for(let item of response.data){
                        let obj = {
                            ...item,
                            ...item.retencionCompraDetalle,
                            tipoImpuesto: item.tipoRetencion

                        }                        
                        this.gridOptions.data.push(obj);
                    }

                    
                    const { totalBaseImponible, totalRenta, totalIva } = this.getTotales();
                    
                    this.data.total = this._form.roundNumber(totalBaseImponible,5);
                    this.data.totalRenta = this._form.roundNumber(totalRenta,5);
                    this.data.totalIva = this._form.roundNumber(totalIva,5);                                                            
                }

                if(response.id=="2"){                
                    const data={
                        tipoRetencion: this.TIPO_DOC.codigo,
                        idProveedor: this.proveedor.idProveedor,
                        idSubContribuyente: response.gestion,
                        idFactura: this.idComprobante,
                        idConfigContribuyente: response.lastId
                    }
                    this.openModalArticuloImpuesto(data)                    
                }
            })                
        } catch (error) {            
            console.error(error)
        }finally{
            hideLoader();
        }             
    }


}



export class ModalRetencionCompraNuevoCtrl extends ModalRetencionCompraCtrl{
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
    constructor($scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, _tS, _params){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form})

        this.searchProveedorOptions = {}
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true; 
        this.data.fechaEmision = new Date();

        this.showBtnCreateInvoiceFast = false;
    }

    async $onInit(){
        try {

            let resultsDataForm = await this.initiload();
            
            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){
                                             
                let dataEstab = this.establecimientos[0];             
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                
                this.puntosEmision = resultsDataFormEstab[0];

                if(this.puntosEmision.length>0){
                    this.data.idPuntoEmision = this.puntosEmision[0].idPuntoEmision;
                }else{
                    this._tS.toastr('info', 'No tienes asignado ningún Punto de Emisión')                    
                }
               
                this.data.codEstab   = dataEstab.codEstab;
                this.cloneCodEstab   = dataEstab.codEstab;                                                
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }
            
            this.setColumnDefs();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }        
    }


     //Guardar Retencion 
     async onSave() {
        
        try {
            let tituloModal = 'Guardar';
        
            if(!this.data.codEstab){
                this._toastr.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
                return; 
            }

            if (!(this.data.idPuntoEmision>0)) {
                this._toastr.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                return;
            }           

            if (!this.data.fechaEmision) {
                this._toastr.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                return;
            }
        

            if (this.gridOptions.data.length===0) {
                this._toastr.toastr('warning', 'No existe detalle de la retención', tituloModal);
                return;
            }

            if (this.gridOptions.data.some(val => [null, undefined, ""].includes(val.impuesto))) {
                this._toastr.toastr('warning', 'Complete los campos en el Detalle', tituloModal);
                return;
            }

            this.nroDocumentoSecuencial = await this.generarNroSecuencial();

            if(!this.nroDocumentoSecuencial) return "NO SE GENERO CORRECTAMENTE EL NÚMERO DE DOCUMENTO"


            let {isConfirmed} = await Swal.fire({
                icon:'warning',
                html:`<small>Esta seguro/a de guardar esta Retención Compra Nro. <b>${this.nroDocumentoSecuencial}</b></small>`, 
                showConfirmButton: true,
                confirmButtonText:'Sí, guardar',
                showCancelButton:true,
                cancelButtonText:'No, cancelar',
                allowOutsideClick:false
            })

            if(isConfirmed){

                let retencionCompra = {
                    idFacturaCompra: this.idComprobante,
                    idProveedor: this.proveedor.idProveedor,
                    idPuntoEmision: this.data.idPuntoEmision,
                    total: this.getTotalValorRetenido(),
                    fechaEmision: this.data.fechaEmision,
                    concepto: this.data.concepto||''
                }
        
                let data = {
                    adicional: this.infoAdicionalDocumento,
                    retencionCompra,
                    dataDetalle: this.gridOptions.data
                }
                    
                this._mS.getData('post', '/RetencionCompra/Insert', data) .then(response=>{
                        if (response.id === "0") {                        
                            this._form.sweetAlert('warning', response.message, response.titleSms);                        
                        }
                        if (response.id == "1") {                        
                            this._form.sweetAlert('success', response.message, response.titleSms, 1000);                                                                   
                            this.$uibModalInstance.close({response:1});                            
                        }
                    }
                )                  
            }
        } catch (error) {
            console.log(error)
        }                                            
    }
}




export class ModalRetencionCompraEditarCtrl extends ModalRetencionCompraCtrl{
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
    constructor($scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, _tS, _params){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form})
        
        let {data, TIPO_REGISTRO} = _params;
        let {dataDocumento, proveedor, detalleDocumento, infoAdicionalDocumento} = data;
        
        this.data = dataDocumento;
        this.proveedor = proveedor;
        this.detalleDocumento = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;

    }

    async $onInit(){
        try {

            let resultsDataForm = await this.initiload();
            
            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){
                                             
                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab)             
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                
                this.puntosEmision = resultsDataFormEstab[0];

                this.cloneCodEstab   = this.data.codEstab;                   
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.factura = {
                idFacturaCompra: this.data.idFacturaCompra,
                nroFactura: this.data.nroFactura
            }
            this.idComprobante = this.data.idFacturaCompra;
            
            this.setColumnDefs();

            this.gridOptions.data = this.detalleDocumento;            

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }        
    }


     //Guardar Retencion 
     async onSave() {
        
        try {
            let tituloModal = 'Guardar';
        
            if(!this.data.codEstab){
                this._toastr.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
                return; 
            }

            if (!(this.data.idPuntoEmision>0)) {
                this._toastr.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                return;
            }           

            if (!this.data.fechaEmision) {
                this._toastr.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                return;
            }
        

            if (this.gridOptions.data.length===0) {
                this._toastr.toastr('warning', 'No existe detalle de la retención', tituloModal);
                return;
            }

            if (this.gridOptions.data.some(val => [null, undefined, ""].includes(val.impuesto))) {
                this._toastr.toastr('warning', 'Complete los campos en el Detalle', tituloModal);
                return;
            }


            let {isConfirmed} = await Swal.fire({
                icon:'warning',
                html:`<small>Esta seguro/a de actualizar esta Retención Compra</small>`, 
                showConfirmButton: true,
                confirmButtonText:'Sí, guardar',
                showCancelButton:true,
                cancelButtonText:'No, cancelar',
                allowOutsideClick:false
            })

            if(isConfirmed){

                let retencionCompra = {
                    idFacturaCompra: this.idComprobante,
                    idProveedor: this.proveedor.idProveedor,
                    idPuntoEmision: this.data.idPuntoEmision,
                    total: this.getTotalValorRetenido(),
                    fechaEmision: this.data.fechaEmision,
                    concepto: this.data.concepto||''
                }
        
                let data = {
                    adicional: this.infoAdicionalDocumento,
                    retencionCompra,
                    dataDetalle: this.gridOptions.data
                }
                    
                this._mS.getData('put', '/RetencionCompra/Update?id='+this.data.idRetencionCompra, data) .then(response=>{
                        if (response.id === "0") {                        
                            this._form.sweetAlert('warning', response.message, response.titleSms);                        
                        }
                        if (response.id == "1") {                        
                            this._form.sweetAlert('success', response.message, response.titleSms, 1000);                                                                   
                            this.$uibModalInstance.close(response);                            
                        }
                    }
                )                  
            }
        } catch (error) {
            console.log(error)
        }                                            
    }

}


export class ModalRetencionCompraAutomaticaCtrl extends ModalRetencionCompraCtrl{
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
    constructor($scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, _tS, _params){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form})
        
        this._params = _params;
        let {data} = _params;
        this.data = Object.assign({}, data);
        this.data.fechaEmision = new Date();
    }

    async $onInit(){
        try {      
            
            let resultsDataForm = await this.initiload();
            
            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){
                                             
                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab)             
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                
                this.puntosEmision = resultsDataFormEstab[0];
                if(this.puntosEmision.length>0)            {
                    this.data.idPuntoEmision = this.puntosEmision[0].idPuntoEmision;
                }
                this.cloneCodEstab   = this.data.codEstab;                   
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.proveedor.idProveedor = this.data.idProveedor;
            this.proveedor.proveedor = this.data.proveedor,
            this.proveedor.numeroIdentificacion = this.data.nroIdentificacion;
            this.proveedor.direccion = this.data.direccion
                    
            this.factura = {
                idFacturaCompra: this.data.idFacturaCompra,
                nroFactura: this.data.nroDocumento
            }
            this.idComprobante = this.data.idFacturaCompra;   

            this.setColumnDefs();

            this.generateRetencion();
            
        } catch (error) {
            console.log(error)
        }
    }
       

    //Guardar Retencion 
    async guardarRetencionCompra() {
        try {
            const tituloModal = 'Guardar Retencion';        
            if(this._form.campo(this.factura.idFacturaCompra)){
                this._toastr.toastr('warning', 'El id del documento no existe', tituloModal);
                return;               
            }
            if (this._form.campo(this.data.idPuntoEmision)) {
                this._toastr.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                return;
            }           

            if (this._form.campo(this.data.fechaEmision)) {
                this._toastr.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                return;
            };
        

            if (this.gridOptions.data.length===0) {
                this._toastr.toastr('warning', 'No existe detalle de esta retención', tituloModal);
                return;
            };

            if (this.gridOptions.data.some(val => [null, undefined, ""].includes(val.impuesto))) {
                this._toastr.toastr('warning', 'Complete los campos en el Detalle', tituloModal);
                return;
            }

            this.nroDocumentoSecuencial = await this.generarNroSecuencial();

            if(!this.nroDocumentoSecuencial) return "NO SE GENERO CORRECTAMENTE EL NÚMERO DE DOCUMENTO"
            
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
            
            swalWithBootstrapButtons.fire({
                title: '<small>Guardar Retención</small>',
                html:`<small>Esta seguro/a de guardar esta Retención Compra Nro. <b>${this.nroDocumentoSecuencial}</b> de la Factura N°. <b>${this.data.nroDocumento}<b></b></small>`, 
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            }).then(result=>{

                if(result.isConfirmed){
                    showLoader();

                    let retencionCompra = {
                        idFacturaCompra: this.factura.idFacturaCompra,
                        idProveedor: this.proveedor.idProveedor,
                        idPuntoEmision: this.data.idPuntoEmision,
                        total: this.getTotalValorRetenido(),
                        fechaEmision: this.data.fechaEmision,
                        concepto: this.data.concepto||''
                    }
            
                    let data = {
                        adicional: this.infoAdicionalDocumento,
                        retencionCompra,
                        dataDetalle: this.gridOptions.data
                    }
                        
                    this._mS.getData('post', '/RetencionCompra/Insert', data) .then(response=>{
                            if (response.id === "0") {                        
                                this._form.sweetAlert('warning', response.message, response.titleSms);                        
                            }
                            if (response.id == "1") {                        
                                this._form.sweetAlert('success', response.message, response.titleSms, 1000);                                                                   
                                this.$uibModalInstance.close({response:1});                            
                            }
                        }
                    )                                             
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}






export class ModalRetencionCompraDetalleCtrl extends ModalRetencionCompraCtrl{
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
    constructor($scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, _tS, _params){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form})
        
        let {data, TIPO_REGISTRO} = _params;
        let {dataDocumento, proveedor, detalleDocumento, infoAdicionalDocumento} = data;
        
        this.data = dataDocumento;
        this.proveedor = proveedor;
        this.detalleDocumento = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;

    }

    async $onInit(){
        try {

            let resultsDataForm = await this.initiload();
            
            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){
                                             
                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab)             
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                
                this.puntosEmision = resultsDataFormEstab[0];

                this.cloneCodEstab   = this.data.codEstab;                   
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.factura = {
                idFacturaCompra: this.data.idFacturaCompra,
                nroFactura: this.data.nroFactura
            }
            this.idComprobante = this.data.idFacturaCompra;
            
            this.setColumnDefsView();

            this.gridOptions.data = this.detalleDocumento;            

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }        
    }

}


/**
 * ------------------------------------------------------------------------------------------------
 *                                                END RETENCION DE COMPRA
 */








/**
 * ------------------------------------------------------------------------------------------------
 *                                                 START RETENCION VENTA  
 * ------------------------------------------------------------------------------------------------
 */

class ModalRetencionVentaCtrl extends ModalBaseCtrl{
    /**
     * 
     * @param {object} {$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, codigoDocumento}
     */
    constructor({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, codigoDocumento}){
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, codigoDocumento})

        this.TIPO_DOC = this._commonSvc.tipoDoc['RV'];

        this.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: true,
            enableFiltering: false,
            enableRowHashing: false,
            enableCellEdit: false,         
        }

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

                 // Retencion Venta
                 if (colDef.field === "detalle.baseImponible") {
                    if ([null, "", undefined, oldValue].includes(rowEntity.detalle.baseImponible)) {
                        rowEntity.detalle.baseImponible = oldValue;
                    }
                    rowEntity.detalle.valorRetenido = this.getValorRetenido(
                        rowEntity.detalle.baseImponible,
                        rowEntity.detalle.porcentajeRetencion
                    )                    
                } 
                              
            })
        }

    }


    async viewDetailInvoice(){
        try {
            
            this._commonSvc.viewDetailDocument({
                id: this.factura.idFactura,
                codigoDocumento: 'FV',
                size: 'xl',                
            })

        } catch (error) {
            console.log(error)            
        }        
    }


    setColumnDefs(){
        this.gridOptions.columnDefs =  [                    
            {
                name: 'Impuesto',
                field: 'tipoImpuesto',
                type: 'string',
                width: '10%',
                minWidth: '100',
                allowCellFocus:false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: 'Cod. Imp.',
                field: 'codigoImpuesto',
                type: 'string',
                width: '10%',
                minWidth: '100',
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                allowCellFocus:false,
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
                field: 'detalle.baseImponible',                                        
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
                field: 'detalle.porcentajeRetencion',                                           
                cellFilter: "currency:'%'",
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                type: 'number',
                width: '12%',
                minWidth: 100
            },
            {
                name: 'V. Retenido',
                field: 'detalle.valorRetenido',                                        
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
                name: 'estado Impuesto',
                field: 'estadoImpuesto',
                visible: false,
                enableColumnMenu: false,
                type: 'number',
                width: '10%',
                minWidth:'100'
            },
            //{
            //    name: 'Total', field: 'retencionCompraDetalle.total', enableColumnMenu: false,
            //    cellFilter: "currency:'$'",
            //    enableCellEdit: false,
            //    type: 'number', width: '8%'
            //},
            {
                name: 'Op',
                headerCellTemplate: '<button type="button" ng-click="grid.appScope.$ctrl.addItem()" class="btn btn-secondary  btn-sm"><i class="fa fa-plus-circle"></i></button>',
                enableCellEdit: false,
                enableColumnMenu: false,
                width: '2%',
                minWidth: '50',
                cellTemplate: '<a class="btn btn-danger btn-xs text-white"  style="cursor:pointer;" title="Eliminar Retencion agregada" ng-click="grid.appScope.$ctrl.deleteRow(row)"><i class="ti-trash"></i></a>',
            }
        ]
    }

    setColumnDefsView(){
        this.gridOptions.columnDefs =  [                    
            {
                name: 'Impuesto',
                field: 'tipoImpuesto',
                type: 'string',
                width: '10%',
                minWidth: '100',
                allowCellFocus:false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: 'Cod. Imp.',
                field: 'codigoImpuesto',
                type: 'string',
                width: '10%',
                minWidth: '100',
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                allowCellFocus:false,
            },
            {
                name: "descripción",
                field: "impuesto",
                allowCellFocus: false,
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'B. Imponible',
                field: 'detalle.baseImponible',                                        
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
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                footerCellFilter: 'number:2',
                cellClass: 'body-text-retencion',
                type: 'number',
                width: '12%',
                minWidth: 100
            },
            {
                name: '%. Retención',
                field: 'detalle.porcentajeRetencion',                                           
                cellFilter: "currency:'%'",
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                type: 'number',
                width: '12%',
                minWidth: 100
            },
            {
                name: 'V. Retenido',
                field: 'detalle.valorRetenido',                                        
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
                name: 'estado Impuesto',
                field: 'estadoImpuesto',
                visible: false,
                enableColumnMenu: false,
                type: 'number',
                width: '10%',
                minWidth:'100'
            },
            //{
            //    name: 'Total', field: 'retencionCompraDetalle.total', enableColumnMenu: false,
            //    cellFilter: "currency:'$'",
            //    enableCellEdit: false,
            //    type: 'number', width: '8%'
            //},
            {
                name: 'Op',
                headerCellTemplate: '<button type="button" class="btn btn-secondary  btn-sm disabled"><i class="fa fa-plus-circle"></i></button>',
                enableCellEdit: false,
                enableColumnMenu: false,
                width: '2%',
                minWidth: '50',
                cellTemplate: '<a class="btn btn-danger btn-xs text-white disabled"  style="cursor:pointer;" title="Eliminar Retencion agregada"><i class="ti-trash"></i></a>',
            }
        ]
    }


    //Seleccionar Impuesto 
    seleccionarImpuesto(entity, item) {            
        if (this._form.campo(item)) return
        
        entity.impuesto = item.impuesto,
        entity.tipoImpuesto = item.tipoRetencion,
        entity.codigoImpuesto = item.codigoImpuesto,
        entity.detalle.idRetencion = item.retencionCompraDetalle.idRetencion,
        entity.detalle.idImpuesto = item.retencionCompraDetalle.idImpuesto,
        // entity.retencionCompraDetalle.baseImponible= item.retencionCompraDetalle.baseImponible,
        entity.detalle.porcentajeRetencion = item.retencionCompraDetalle.porcentajeRetencion,
        entity.detalle.valorRetenido = item.retencionCompraDetalle.valorRetenido
      
        
        this.focusBaseImponible(entity);            
    
    }

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
        
        
        let detalle = {
            idRetencion: 0,
            idImpuesto: 0,
            porcentajeRetencion: 0,
            valorRetenido: 0,
            baseImponible: 0
        }
        let obj = {
            num: 1,
            impuesto: '',
            tipoImpuesto: '',
            codigoImpuesto: '',
            detalle
        }
       
        this.gridOptions.data.push(obj);                
    }



    saveUpdateVenta() {
        let tituloModal = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';
        let btnText = this.tipoRegistro===1?"Guardar":'Actualizar';
        if (this._form.campo(this.data.codEstab)) {
            this._tS.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
            return;
        }
        
        if (this._form.campo(this.data.ptoEmision)) {
            this._tS.toastr('warning', 'Ingrese el Punto de Emisión', tituloModal);            
            return
        }

        if (this._form.campo(this.data.nroDoc)) {
            this._tS.toastr('warning', 'Ingrese el Número de Documento');            
            return
        }
        
        if (this.data.nroDoc == 0) {
            this._tS.toastr('warning', 'El Numero de Documento tiene que ser mayor a 0 ');            
            return
        }

        if (this._form.campo(this.data.fechaEmision)) {
            this._tS.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
            return;
        }

        if (this._form.campo(this.cliente.idCliente)) {
            this._tS.toastr('warning', 'Seleccione el Cliente', tituloModal);            
            return;
        }

        if(this._form.campo(this.factura.idFactura)){
            this._tS.toastr('warning', 'Seleccione la Factura', tituloModal);            
            return;
        }

        if (this._form.campo(this.data.nroAutho)) {
            this._tS.toastr('warning', 'Ingrese el Número de Autorización', tituloModal);            
            return;
        }
       
             

        if (this.gridOptions.data.length == 0) {
            this._tS.toastr('warning', 'Ingrese al menos un Tipo Impuesto en el Detalle');
            return;
        }

        if (this.gridOptions.data.some(val => val.impuesto === '')) {
            this._tS.toastr('warning', 'Complete los campos en el Detalle', tituloModal);
            return;
        }

        Swal.fire({
            icon: 'warning',
            html: `<small>Desea ${btnText} la Retención de Venta ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: `Si, ${btnText}`,
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) {
                this.postRetencion();                    
            }
        })

    }


    postRetencion(){
        try {
            showLoader();
            this.data.idFactura = this.factura.idFactura;
            this.data.idCliente = this.cliente.idCliente;
            this.data.total = this.gridOptions.data.map(val => val.detalle.valorRetenido).reduce((curr, prev) => curr + prev, 0);            

            let data = {
                retencion: this.data,
                detalle: this.gridOptions.data.map(({ detalle }) => detalle)
            }

            let url = this.tipoRegistro === 1 ? '/RetencionVenta/Post' : '/RetencionVenta/Put?idRetencionVenta=' + this.data.idRetencionVenta;
            let method = this.tipoRegistro===1?'post':'put';

            this._mS.getData(method, url, data).then(response=>{
                if (response.id === "0" || response.code=="0") {
                    hideLoader();
                    this._form.sweetAlert('warning', response.message, response.titleSms);                    
                }
    
                if (response.id === "1" || response.code==="1") {
                    hideLoader();
                    this._form.sweetAlert('success', response.message, response.titleSms, 1000);
                    this.$uibModalInstance.close(response)                               
                }

            })          
        } catch (error) {
            hideLoader();
            console.error(error)
        }            
    }

}


export class ModalRetencionVentaNuevoCtrl extends ModalRetencionVentaCtrl{
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
    constructor($scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, _tS, _params){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form, codigoDocumento: "RV"})        
        this._tS     = _tS;
        this._params = {};       
        this.cliente = {}

        let {TIPO_REGISTRO} = this._params;

        this.TIPO_REGISTRO = TIPO_REGISTRO;

        this.data = {};
        this.data.fechaEmision = new Date();

        this.factura  ={};
        this.facturas = [];
        this.infoAdicionalDocumento=[];
        this.tipoRegistro = 1;

        this.search = {
            isDisabled: false,
            noCache: true,
            showBtnList: true,
            showBtnEdit: false            
        }
       
    }

    async $onInit(){
        try {
           
            this._commonSvc.getEstabAsign().then(response=>{            
                this.establecimientos = response;  
                if(this.establecimientos.length>0){
                    let dataEstab = this.establecimientos[0]
                    this.data.codEstab = dataEstab.codEstab; //Para Filtro avanzado 
                    // this._commonSvc.getDataFormEstabAsig(dataEstab).then(response=>{
                    //     $scope.bodegas = response[1]
                    // })
                }else{
                    toastr.warning('NO TIENES ASIGNADO NINGUNA SUCURSAL')
                }        
            })

            this.setColumnDefs();            
        } catch (error) {
            console.log(error)
        }
    }

    async selectedItemCliente(item){
        this.factura = {}
        this.searchTextInvoice = null;
        this.cliente = {};
        this.facturas = [];
        this.gridOptions.data = [];

        if(item.idCliente>0){
            this.search.showBtnEdit = true;
            this.cliente = item;
            this.facturas = await this.getFacturas();
            this.$scope.$apply();
        }        
    }

    async getFacturas() {
        let facturas = [];  
        let dataSearch = {
            "pageIndex": 1,
            "pageSize": 10000,
            "codEstab": this.data.codEstab,
            "checkBoxDefault": false,
            "checkBoxCliente": true,
            "byCliente": this.cliente.idCliente,
            "checkBoxEstado": false,
            "byEstado": 13,
            "paraNotaCredito": true            
        }      
        await this._mS.getData('get', '/FacturaVenta/Get?json=' + JSON.stringify(dataSearch)).then(response=>{
            if (response.id === "0") {
                Swal.fire({
                    icon: 'warning',
                    html: `<small>${response.message}</small>`
                });                    
            }
            if (response.id === "1") {
                let tempArr = JSON.parse(response.payload) || [];
                facturas = tempArr.map(item=>{
                    let obj = {};
                    obj.idFactura = item.idFactura;
                    obj.idTipoDocumento = item.idTipoDocumento;
                    obj.nroDocumento = item.nroFactura;
                    return obj;
                })                                
            }
        }) 
        return facturas;      
    }

    selectedItemInvoice(item){        
        if(item && item.idFactura>0){
            // this.idComprobante = item.idFactura;
            this.factura = item;
            this.generarRetencionVenta()            
        }
    }


    generarRetencionVenta(){     
        try {
            showLoader();
            let url = 'GetGenerateRetencionVenta?idTipoDoc=' + this.factura.idTipoDocumento + '&idComprobante=' + this.factura.idFactura;

            this._mS.getData('get', '/GenerateRetencion/' + url).then(response => {
                if (response.id === "0") {
                    hideLoader();
                    Swal.fire({
                        title: `<small>${response.titleSms}</small>`,
                        icon: 'warning',
                        html: `<small>${response.message}</small>`
                    })                    
                }
                if (response.id === "1") {
                    this.gridOptions.data = response.data;                    
                    hideLoader();
                }

                //Cuando la Factura en el detalle no tiene Asignado los Impuestos a los articulos
                if (response.id == "2") {
                    const data={
                        tipoRetencion: this.tipoDoc.codigo,
                        idCliente: this.cliente.idCliente,
                        idSubContribuyente: response.gestion,
                        idFactura: this.factura.idFactura,
                        idConfigContribuyente: response.lastId
                    }
                    this.openModalArticuloImpuesto(data)
                    hideLoader();                                 
                }
            })
            
        } catch (error) {
            hideLoader();
            console.error(error)
        }   
        
    }

    refreshDetailRetencionVenta(){
        if(!this.factura.idFactura){
            Swal.fire({
                icon:'warning',
                html:`<small>Seleccione la Factura </small>`
            })
            return
        }
        this.recargarDetalleRetencionVenta();
    }

    selectedItemInvoice(item){        
        if(item && item.idFactura>0){
            // this.idComprobante = item.idFactura;
            this.factura = item;
            this.generarRetencionVenta()            
        }
    }


    generarRetencionVenta(){     
        try {
            showLoader();
            let url = 'GetGenerateRetencionVenta?idTipoDoc=' + this.factura.idTipoDocumento + '&idComprobante=' + this.factura.idFactura;

            this._mS.getData('get', '/GenerateRetencion/' + url).then(response => {
                if (response.id === "0") {
                    hideLoader();
                    Swal.fire({
                        title: `<small>${response.titleSms}</small>`,
                        icon: 'warning',
                        html: `<small>${response.message}</small>`
                    })                    
                }
                if (response.id === "1") {
                    this.gridOptions.data = response.data;                    
                    hideLoader();
                }

                //Cuando la Factura en el detalle no tiene Asignado los Impuestos a los articulos
                if (response.id == "2") {
                    const data={
                        tipoRetencion: this.tipoDoc.codigo,
                        idCliente: this.cliente.idCliente,
                        idSubContribuyente: response.gestion,
                        idFactura: this.factura.idFactura,
                        idConfigContribuyente: response.lastId
                    }
                    this.openModalArticuloImpuesto(data)
                    hideLoader();                                 
                }
            })
            
        } catch (error) {
            hideLoader();
            console.error(error)
        }   
        
    }

    refreshDetailRetencionVenta(){
        if(!this.factura.idFactura){
            Swal.fire({
                icon:'warning',
                html:`<small>Seleccione la Factura </small>`
            })
            return
        }
        this.recargarDetalleRetencionVenta();
    }

    async recargarDetalleRetencionVenta(){
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

        this.generarRetencionVenta();
    }
}


export class ModalRetencionVentaEditarCtrl extends ModalRetencionVentaCtrl{
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
    constructor($scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, _tS, _params){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form, codigoDocumento: "RV"})        
        
        this._tS     = _tS;
        this._params = {};       
        this.cliente = {}
        this.data = {};
        this.tipoRegistro = 2;
        
        let {data, TIPO_REGISTRO} = _params;


        let {dataDocumento, cliente, factura, detalleDocumento} = data;
        this.data = dataDocumento;
        this.cliente = cliente;
        this.factura = factura;
        this.detalleDocumento = detalleDocumento;

    }

    async $onInit(){
        try {
            this._commonSvc.getEstabAsign().then(response=>{            
                this.establecimientos = response;  
                if(this.establecimientos.length===0){
                    toastr.warning('NO TIENES ASIGNADO NINGUNA SUCURSAL')                   
                }                
            })

            this.setColumnDefs();   

            this.gridOptions.data = this.detalleDocumento.map(item=>{
                item.detalle = {
                    idRetencionVentaDetalle: item.idRetencionVentaDetalle,
                    idImpuesto: item.idImpuesto,
                    idRetencion: item.idRetencion,
                    baseImponible: item.baseImponible,
                    porcentajeRetencion: item.porcentajeRetencion,
                    valorRetenido: item.valorRetenido,                    
                }                
                console.log(item)
                return item;
            })
        } catch (error) {
            console.log(error)
        }      
    }    
}

export class ModalRetencionVentaDetalleCtrl extends ModalRetencionVentaCtrl{
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
        'params'
    ]
    constructor($scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal,  $uibModalInstance, uiGridConstants, toastr, _form, _params){                              
        super({$scope, $timeout, _mS, _commonSvc, _modalSvc, _nombreModal, $uibModalInstance, uiGridConstants, toastr, _form, codigoDocumento: "RV"})
        
        this.scopeParent = this;            

        this._tS     = toastr;

        
        let {data, TIPO_REGISTRO} = _params;        
        
        let {dataDocumento, cliente, factura, detalleDocumento} = data;
        this.data = dataDocumento;
        this.cliente = cliente;
        this.factura = factura;
        this.detalleDocumento = detalleDocumento;

    }

    async $onInit(){
        try {
            this._commonSvc.getEstabAsign().then(response=>{            
                this.establecimientos = response;  
                if(this.establecimientos.length===0){
                    toastr.warning('NO TIENES ASIGNADO NINGUNA SUCURSAL')                   
                }                
            })

            this.setColumnDefsView();   

            this.gridOptions.data = this.detalleDocumento.map(item=>{
                item.detalle = {
                    idRetencionVentaDetalle: item.idRetencionVentaDetalle,
                    idImpuesto: item.idImpuesto,
                    idRetencion: item.idRetencion,
                    baseImponible: item.baseImponible,
                    porcentajeRetencion: item.porcentajeRetencion,
                    valorRetenido: item.valorRetenido,                    
                }                
                console.log(item)
                return item;
            })
        } catch (error) {
            console.log(error)
        }      
    } 

    closeModal(){
        this.$uibModalInstance.close();
    }
}


