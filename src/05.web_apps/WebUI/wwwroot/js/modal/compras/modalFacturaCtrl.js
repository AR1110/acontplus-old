
import './modalCompraBaseCtrl.js'

class ModalFacturaCtrl extends window.modalCompraBaseCtrl {
    
    constructor({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS}){
        
        super({_mS, _fS })
        
        const self = this;
        
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        
        this._commonSvc = _commonSvc;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;

        this.TIPO_DOC = this._commonSvc.tipoDoc['FC']
        this.proveedor = {}

        this.gridOptions = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,           
        }

        this.gridOptions.onRegisterApi = function (gridApi) {  
            self.$scope.gridApi = gridApi;  
            if (self.$scope.gridApi) {
                self.$timeout(() => {
                    self.$scope.gridApi.core.handleWindowResize();
                    self.$scope.gridApi.grid.refresh();
                }, 5);
            }   
            
            
            gridApi.grid.element.on('keyup', function (ev) {            
                if(ev.which == 13 || ev.keyCode=='13'){
                    self.setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit(self.$scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }       
                
                const objCalculo = self.uiGridInvoice.calculoColDef(rowEntity, oldValue)             
                objCalculo[colDef.field] && objCalculo[colDef.field]();
                objCalculo["calculoTotalDetalle"]();
                self.data = Object.assign(self.data, self.uiGridInvoice.getTotales()); 

                if(rowEntity.datosAdicionales && Number.isInteger(rowEntity.cantidad) && rowEntity.cantidad>0){
                  //  $scope.abrirModalDatoAdicional(rowEntity);                           
                }
                
            })
        }

        this.datosAdicionalesArticulo = [];
    }


    async openModalCategoria(){
        let {MODAL_FILE_CTRL, MODAL_NUEVO} = this._nombreModalConst.categoria_compra;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];

        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'md',            
        })

        modalRef.result.then(async result=>{
            if(typeof result === 'object'){
                let resultsDataForm = await this.initiload();
                this.categoriaCompras = resultsDataForm[4];
                
                this.data.idCategoriaCompra = this.categoriaCompras.at(-1).idCategoriaCompra;
            }
        })          
    }

    selectedItemProveedor(item){
        this.proveedor = item;
        this.searchProveedorOptions.showBtnEdit = true;
        console.log(item)
    }
    


     /**
     * 
     * @param {*} entity Datos del Articulo 
     */
     async deleteRow(entity){

        let isConfirmed = await this.uiGridInvoice.deleteRow(entity);

        if(isConfirmed && entity.datosAdicionales){
          this.datosAdicionalesArticulo = this.datosAdicionalesArticulo.filter(val => val.idArticulo !== entity.idArticulo);            
        }
        
        if(isConfirmed){
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            this.$scope.$apply();        
        }

    }

    trimDetail(){
        return this.gridOptions.data.map(item=>{
            let data = {
                idFacturaCompraDetalle: item.idFacturaCompraDetalle || 0,
                idBodega: item.idBodega,
                idArticulo: item.idArticulo,
                idMedida: item.idMedida,
                idTipoIva: item.idTipoIva,

                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                precioCostoNeto: item.precioCostoNeto,
                porcentajeDescuento: item.porcentajeDescuento,
                valorDescuento: item.valorDescuento,
                ice: item.ice,
                iva: item.iva,

                codigoPorcentaje: item.codigoPorcentaje,
                tarifa: item.tarifa,
                nota: item.nota || null,
                total: item.total,
            }
            return data;
        })
    }


    calcularPorcentajeDescuento() {
        this.data.porcentajeDescuento = this.data.porcentajeDescuento || 0;
        if(typeof this.data.porcentajeDescuento !=="number" || this.data.porcentajeDescuento === ""){
            this._tS.toastr('warning', 'Ingrese un Número Válido');
            return
        }

        if( this.data.porcentajeDescuento <=100 ){
            //redondeo del numero porcentaje 
            this.data.porcentajeDescuento = this._fS.roundNumber(this.data.porcentajeDescuento, this.decimal.nroTotalSubTotal)            
            this.setPorcentajeDescuentoAll(this.data.porcentajeDescuento);              
        }else{
            this.toast.toastr('warning', 'El Porcentaje de Descuento tiene que ser menor o igual a 100');
        }
    }

    //Calcular Porcentaje  Descuento 
    calcularDescuento() {
        try {
            this.data.totalDescuento = this.data.totalDescuento || 0;
            if(typeof this.data.totalDescuento!=='number' || this.data.totalDescuento === ""){
                this._tS.toastr('warning', 'Ingrese un númeto válido', 'Valor Descuento');
                return
            }
    
            if (this.data.totalDescuento <= this.uiGridInvoice.getSubTotalSinImpuesto()) {
                let porcentajeDescuento = (this.data.totalDescuento * 100) / this.uiGridInvoice.getSubTotalSinImpuesto() || 0;               
                this.data.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroDescuentoDetalle);
                this.setPorcentajeDescuentoAll(this.data.porcentajeDescuento)            
            }else{
                this._tS.toastr('warning', 'El Valor Descuento no puede ser mayor al total');
            }  
        } catch (error) {
            console.log("CALCULO DE TOTAL DESCUENTO", error)
        }            
    }

    getImporteTotal(){
        if(!this.decimal) return
        let total = Number(this.data.total) + this.uiGridInvoice.getTotalIce();
        // let transporte   = Number(this.data.transporte);
        // let recargo      = Number(this.data.recargo);
        // let importeTotal = total + transporte + recargo;
        // this.data.total  = importeTotal;
        
        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
    }



    closeModal(){
        this.$uibModalInstance.close();
    }
}


export class ModalFacturaNuevoCtrl extends ModalFacturaCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario']
    
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS});
        
        this.searchProveedorOptions = {}
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;   
        
        this.data.fechaEmision = new Date();

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                           <a  ng-click="grid.appScope.$ctrl.abrirModalDatoAdicional(row.entity)" style="cursor:pointer;" ng-show='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;
    
        this.CAMPOS = ["codEstab", "idSustentoTributario", "idCategoriaCompra", "idProveedor", "puntoEmision", "nroDoc", "nroAutorizacion", "idTiempoCredito", "fechaEmision", "fechaVencimiento", "validFechaVcto", "gridOptions", "gridOptionsBodega"];
    }

    async $onInit(){

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {UiGridOptionsCompra} = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){
                                             
                let dataEstab = this.establecimientos[0];             
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                
                this.data.codEstab   = dataEstab.codEstab;
                this.cloneCodEstab   = dataEstab.codEstab;
                               
                this.bodegas       = resultsDataFormEstab[1];                
                this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]               
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.decimal = resultsDataForm[1][0]
            this.tipoIvas = resultsDataForm[2];
            this.tiempoCreditos = resultsDataForm[3];
            
            this.data.idTiempoCredito = this.tiempoCreditos.length>0?this.tiempoCreditos[0].idTiempoCredito: 0;

            this.categoriaCompras = resultsDataForm[4];
            this.sustentoTributarios = resultsDataForm[5];

            this.setColumnDefs();

            this.uiGridInvoice =  new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,                
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })
            
            this.data.fechaEmision = new Date();
            this.getFechaVencimiento()
            this.$scope.$apply();

        } catch (error) {
            console.log(error)            
        }finally{
            hideLoader()
        }
    }


    async onSave(){
        try {
            showLoader();
            let textAccion = 'Guardar';  

            if(!this.isValidaForm(textAccion)) return

            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoCompra({
                puntoEmision: this.data.puntoEmision,
                nroDocumento: this.data.nroDocumento,
                codigoDocumento: this.TIPO_DOC.codigo,                
            })       
            
           
            hideLoader();
            if(!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"

             
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Guardar Factura Compra</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento <b> Nro. ${this.nroDocumentoSecuencial}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })       
           
            
            if(!isConfirmed) return

            showLoader();
            this.data.idProveedor = this.proveedor.idProveedor                                          
            
             //Tarifa Aplicada al Documento
            this.data.tarifa = this.actividadTipoIva.tarifa;

            const data = {
                factura: this.data,
                detalle: this.trimDetail(),
                manejoArticuloDetalle: this.datosAdicionalesArticulo
            }

            await this._mS.getData('post', '/FacturaCompra/Post', data).then(response=>{
                if(response.code==='0'){                    
                    this._fS.sweetAlert('warning', response.message, response.titleSms);   
                }

                if (response.code == "1") {                                  
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);   
                    
                    this.$uibModalInstance.close(response)
                }     
            })                        
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }
    }


}




export class ModalFacturaEditarCtrl extends ModalFacturaCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']
    
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS});
        console.log(_params)
        this.searchProveedorOptions = {}
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;   
        
        this.data.fechaEmision = new Date();

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                           <a  ng-click="grid.appScope.$ctrl.abrirModalDatoAdicional(row.entity)" style="cursor:pointer;" ng-show='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;
    
        this.CAMPOS = ["codEstab", "idSustentoTributario", "idCategoriaCompra", "idProveedor", "puntoEmision", "nroDoc", "nroAutorizacion", "idTiempoCredito", "fechaEmision", "fechaVencimiento", "validFechaVcto", "gridOptions", "gridOptionsBodega"];
        let {TIPO_REGISTRO, data} = _params;        
        let {dataDocumento, proveedor, detalleDocumento, datosAdicionalesArticulo} = data;
        this.dataDocumento = dataDocumento;
        this.proveedor = proveedor;
        this.detalleDocumento = detalleDocumento;
        this.datosAdicionalesArticulo = datosAdicionalesArticulo;

        
        this.TIPO_REGISTRO = TIPO_REGISTRO;
    }

    async $onInit(){

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {UiGridOptionsCompra} = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){
                
                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.dataDocumento.codEstab)             

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);                                          

                this.bodegas       = resultsDataFormEstab[1];                
                this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]
                            
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.decimal = resultsDataForm[1][0]
            this.tipoIvas = resultsDataForm[2];
            this.tiempoCreditos = resultsDataForm[3];
            
            this.data.idTiempoCredito = this.tiempoCreditos.length>0?this.tiempoCreditos[0].idTiempoCredito: 0;

            this.categoriaCompras = resultsDataForm[4];
            this.sustentoTributarios = resultsDataForm[5];

            this.setColumnDefs();

            this.uiGridInvoice =  new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,                
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })

            this.data = Object.assign({}, this.dataDocumento);
            // this.nroDocumentoSecuencial = this.data.puntoEmision + '-'+ this.data.nroDocumento.toString()
            this.gridOptions.data = this.detalleDocumento;
            
            console.log(this)
            this.$scope.$apply();

        } catch (error) {
            console.log(error)            
        }finally{
            hideLoader()
        }
    }


    async onSave(){
        try {
            
            let textAccion = 'Actualizar';  

            if(!this.isValidaForm(textAccion)) return


             
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Actualizar Factura Compra</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento ahora</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si, ${textAccion}`,
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })       
           
            
            if(!isConfirmed) return

            showLoader();
            this.data.idProveedor = this.proveedor.idProveedor                                          
    
             //Tarifa Aplicada al Documento
            this.data.tarifa = this.actividadTipoIva.tarifa;
            
            const data = {
                factura: this.data,
                detalle: this.trimDetail(),
                manejoArticuloDetalle: this.datosAdicionalesArticulo
            }

            await this._mS.getData('put', '/FacturaCompra/Put?id=' + this.data.idFacturaCompra, data).then(response=>{
                if(response.code==='0'){                    
                    this._fS.sweetAlert('warning', response.message, response.titleSms);   
                }

                if (response.code == "1") {                                  
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);   
                    
                    this.$uibModalInstance.close(response)
                }     
            })                        
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }
    }


}



export class ModalFacturaDetalleCtrl extends ModalFacturaCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']
    
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS});
   
        this.CELL_TEMPLATE_OPTION = `<a   style="cursor:pointer;" class="btn btn-danger btn-xs text-white disabled" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  style="cursor:pointer;" class="btn btn-success btn-xs text-white disabled" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                           <a  ng-click="grid.appScope.$ctrl.abrirModalDatoAdicional(row.entity)" style="cursor:pointer;" ng-show='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;
    
       
        let {TIPO_REGISTRO, data} = _params;        
        let {dataDocumento, proveedor, detalleDocumento, datosAdicionalesArticulo} = data;
        this.dataDocumento = dataDocumento;
        this.proveedor = proveedor;
        this.detalleDocumento = detalleDocumento;
        this.datosAdicionalesArticulo = datosAdicionalesArticulo;

        
        this.TIPO_REGISTRO = TIPO_REGISTRO;
    }

    async $onInit(){

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {UiGridOptionsCompra} = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){
                
                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.dataDocumento.codEstab)             

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);                                          

                this.bodegas       = resultsDataFormEstab[1];                
                this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]
                            
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.decimal = resultsDataForm[1][0]
            this.tipoIvas = resultsDataForm[2];
            this.tiempoCreditos = resultsDataForm[3];
            
            this.data.idTiempoCredito = this.tiempoCreditos.length>0?this.tiempoCreditos[0].idTiempoCredito: 0;

            this.categoriaCompras = resultsDataForm[4];
            this.sustentoTributarios = resultsDataForm[5];

            this.setColumnDefsView();

            this.uiGridInvoice =  new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,                
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })

            this.data = Object.assign({}, this.dataDocumento);
            // this.nroDocumentoSecuencial = this.data.puntoEmision + '-'+ this.data.nroDocumento.toString()
            this.gridOptions.data = this.detalleDocumento;
            
            console.log(this)
            this.$scope.$apply();

        } catch (error) {
            console.log(error)            
        }finally{
            hideLoader()
        }
    }


    getReport() {                               
        try {
            let format = 'excel';
            let dataParms = {     
                codEstab: this.data.codEstab, 
                id: this.data.idFacturaCompra,                                     
                codigo: 'RCD', 
                codDoc: this.TIPO_DOC.codigo,
                format,            
            }
        
            const parameters = {               
                dataParams: JSON.stringify(dataParms)
            }   
            console.log(parameters)                
            this._commonSvc.getReportDynamic({parameters, format})
        } catch (error) {
            console.log(error)
        }
    }


}



//--------------------------------------------------FACTURA COMPRA RÁPIDA-------------------------
export class ModalFacturaSinDetalleCtrl extends ModalFacturaCtrl{
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']
    
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS});
                            
        this.establecimiento = _params.establecimiento
        this.proveedor       = _params.proveedor;
    }

    async $onInit(){

        try {
            showLoader();
            let resultsDataForm = await this.initiload();

            let resultsDataFormEstab = await this.getDataFormEstabAsig(this.establecimiento);                                          
            
            this.actividadTipoIva = resultsDataFormEstab[2][0]
            
            this.decimal = resultsDataForm[1][0]          
            this.tiempoCreditos = resultsDataForm[3];                    

            this.categoriaCompras = resultsDataForm[4];
            this.sustentoTributarios = resultsDataForm[5];

            this.data.codEstab = this.establecimiento.codEstab;
            this.data.fechaEmision   = new Date();

            if(this.tiempoCreditos.length>0){
                this.data.idTiempoCredito = this.tiempoCreditos[0].idTiempoCredito;
                this.getFechaVencimiento()
            }    
        
            if(sessionStorage.getItem('dataInvoice')!==null){
                let data = JSON.parse(sessionStorage.getItem('dataInvoice'));
                if(data.idProveedor!==this.proveedor.idProveedor){
                    sessionStorage.removeItem('dataInvoice');
                }else{
                    this.data = data;
                    this.data.fechaEmision = this._fS.formatDate(this.data.fechaEmision);
                    this.data.fechaVencimiento = this._fS.formatDate(this.data.fechaVencimiento);
                    this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);
                    this.fechaVencimientoEscrita = this._fS.getFechaEscrita(this.data.fechaVencimiento);
                }
            }    

            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
    }

    async onSave() {
        try {
            showLoader();
            this.CAMPOS = ["codEstab", "idSustentoTributario", "idCategoriaCompra", "idProveedor", "puntoEmision", "nroDoc", "nroAutorizacion", "idTiempoCredito", "fechaEmision", "fechaVencimiento", "validFechaVcto"];
        
            let textAccion = 'Guardar';  

            if(!this.isValidaForm(textAccion)) return

            if (this._fS.campo(this.data.subTotalSinImpuestos)) {
                this._tS.toastr('warning', 'Ingrese el Sub Total Sin Impuesto');
                return
            }

            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoCompra({
                puntoEmision: this.data.puntoEmision,
                nroDocumento: this.data.nroDocumento,
                codigoDocumento: this.TIPO_DOC.codigo,                
            })       
            
           
            hideLoader();
            if(!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"

             
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Guardar Factura Compra</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento <b> Nro. ${this.nroDocumentoSecuencial}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })       
           
            
            if(!isConfirmed) return

            showLoader();
            this.data.idProveedor = this.proveedor.idProveedor                                          
            
             //Tarifa Aplicada al Documento
            this.data.tarifa = this.actividadTipoIva.tarifa;

            const data = {
                factura: this.data,
                detalle: [],
                manejoArticuloDetalle: []
            }

            await this._mS.getData('post', '/FacturaCompra/Post', data).then(response=>{
                if(response.code==='0'){                    
                    this._fS.sweetAlert('warning', response.message, response.titleSms);   
                }

                if (response.code == "1") {                                  
                    this._fS.sweetAlert("success", response.message, response.titleSms, 1000); 
                    sessionStorage.setItem('dataInvoice', JSON.stringify(this.data))  
                    
                    let responseData = JSON.parse(response.payload)[0]
                    
                    this.$uibModalInstance.close({
                        data: this.data,
                        id: responseData.idFacturaCompra
                    })                                                            
                }     
            })       
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
        
    }
    

}
