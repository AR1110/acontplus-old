
import './modalCompraBaseCtrl.min.js?v=0.3'

class ModalCompraNoHabitualCtrl extends window.modalCompraBaseCtrl {
    
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

        this.TIPO_DOC = this._commonSvc.tipoDoc['IB']
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
        let index = 1
        return this.gridOptions.data.map(item=>{
            let data = {
                index : index++,
                idCompraNoHabitualDetalle: item.idCompraNoHabitualDetalle || 0,
                idBodega: item.idBodega,
                idArticulo: item.idArticulo,
                idMedida: item.idMedida,

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
        let total = Number(this.data.total)
        // let transporte   = Number(this.data.transporte);
        // let recargo      = Number(this.data.recargo);
        // let importeTotal = total + transporte + recargo;
        // this.data.total  = importeTotal;
        
        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
    }


    deleteColumnIce(){
        let indexColumn = this.gridOptions.columnDefs.findIndex(item=>item.field==="ice");
        this.gridOptions.columnDefs.splice(indexColumn, 1);
    }



    changeEstablecimiento(){
        try {
            
            if(this.establecimientos.length>0){
           
                
                this.puntosEmision = this.puntosEmisionTemporal.filter(item=>item.codEstab===this.data.codEstab)
                this.data.idPuntoEmision = this.puntosEmision.find(item=>(item.predeterminado)).idPuntoEmision;

                console.log(this.data.codEstab, this.bodegasTemporal)
                this.bodegas = this.bodegasTemporal.filter(item=>item.codEstab === this.data.codEstab);
                this.idBodega = this.bodegas.find(item=>(item.predeterminado)).idBodega;

                //Actividad Tipo iVA 
                this.actividadTipoIva = this.actividadTipoIvaTemporal.find(item=>item.codEstab===this.data.codEstab)
            }     
            

        } catch (error) {
            console.log(error)
        }
    }


    closeModal(){
        this.$uibModalInstance.close();
    }
}


export class ModalAddCtrl extends ModalCompraNoHabitualCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance',  'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario']
    
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
    
        this.CAMPOS = ["codEstab",  "idProveedor", "idPuntoEmision",  "fechaEmision", "gridOptions", "gridOptionsBodega"];
    }

    async $onInit(){

        try {
            showLoader();            
         
            let {UiGridOptionsCompra} = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());
            this._mS.getData('get',  'CompraNoHabitual/' + JSON.stringify({typeList: 2}), null, true).then(response=>{
                if(response.code=="0"){
                    hideLoader();
                    console.log(response)
                }

                if(response.code==="1"){

                    let mainData = JSON.parse(response.payload);                    
                    
                    this.establecimientos = mainData[0]; 
                    this.data.codEstab = this.establecimientos.find(item=>(item.predeterminado)).codEstab;               
                    
                    this.puntosEmisionTemporal = mainData[1];
                    this.bodegasTemporal       = mainData[2];
                    this.actividadTipoIvaTemporal = mainData[5]

                    this.decimal = mainData[3][0];
                    this.tipoIvas = mainData[4];   
                                        
                    this.changeEstablecimiento();


                    this.setColumnDefs();

                    //Eliminar Mas Adelante 

                    this.gridOptions.columnDefs[7] =  {
                        name: 'I.V.A',
                        field: 'codigoPorcentaje',                    
                        width: '8%',
                        minWidth:'100',
                        type: 'text',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
                        cellFilter: 'cellFilterTipoIva:this',
                        editDropdownValueLabel: 'descripcion',
                        editDropdownIdLabel: 'codigoPorcentaje',
                        enableCellEdit: true,
                        enableCellEditOnFocus:true,
                    //    visible: config.porcentajeIva
                    }

                    let indexTipoIva = this.gridOptions.columnDefs.findIndex(item=>item.field==='codigoPorcentaje');                    
                    this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;

                    console.log(this.tipoIvas)
                    this.uiGridInvoice =  new UiGridOptionsCompra({
                        $scope: this.$scope,
                        gridOptions: this.gridOptions,
                        _fS: this._fS,                
                        _tS: this._tS,
                        tipoIvas: this.tipoIvas,
                        decimal: this.decimal,
                        actividadTipoIva: this.actividadTipoIva
                    })
                  
                    hideLoader() ;
                
                }
            })
            // this.establecimientos = resultsDataForm[0];

            // if(this.establecimientos.length>0){
                                             
            //     let dataEstab = this.establecimientos[0];             
            //     let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                
            //     this.puntosEmision = resultsDataFormEstab[0];
                
            //     if(this.puntosEmision.length>0){
            //         this.data.idPuntoEmision = this.puntosEmision[0].idPuntoEmision
            //     }else{
            //         this._tS.toastr('warning', 'No tienes asignado ningún Punto de Emisión')
            //     }
                
            //     this.data.codEstab   = dataEstab.codEstab;
            //     this.cloneCodEstab   = dataEstab.codEstab;
                               
            //     this.bodegas       = resultsDataFormEstab[1];                
            //     this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
            //     this.cloneIdBodega = this.idBodega;

            //     this.actividadTipoIva = resultsDataFormEstab[2][0]               
            // }else{
            //     this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            // }

            // this.decimal = resultsDataForm[1][0]
            // this.tipoIvas = resultsDataForm[2];
            // this.tiempoCreditos = resultsDataForm[3];
            
            // this.data.idTiempoCredito = this.tiempoCreditos.length>0?this.tiempoCreditos[0].idTiempoCredito: 0;

            // this.categoriaCompras = resultsDataForm[4];
            // this.sustentoTributarios = resultsDataForm[5];

           
                                    

         

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
                idPuntoEmision: this.data.idPuntoEmision,                
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
                title: '<small>Guardar Ingreso Bodega</small>',
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
                ingresoBodega: this.data,
                detalle: this.trimDetail(),
                manejoArticuloDetalle: this.datosAdicionalesArticulo
            }

            this._mS.getData('post', '/IngresoBodega/Post', data).then(response=>{
                
                if(response.id==='0'){  
                    hideLoader();                  
                    this._fS.sweetAlert('warning', response.message, response.titleSms);   
                }

                if (response.id == "1") {
                    hideLoader();
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);   
                    
                    this.$uibModalInstance.close(response)
                }     
            })                        
        } catch (error) {
            console.log(error)
        }
    }


    selectedItemProveedor(item){
        try {
            this.proveedor = item;
            this.searchProveedorOptions.showBtnEdit = true;                                   
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }
    }


    async closeModal(){
        if(this.gridOptions.data.length===0){
            this.$uibModalInstance.close();
            return
        }

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              denyButton:'btn btn-info ml-2',
              cancelButton: 'btn btn-danger ml-2'
            },
            buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
            title: 'Salir ?',
            html: "<small>Tienes un documento en proceso, desea salir ahora?</small>",
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton:true,
            showDenyButton:true,
            confirmButtonText: 'Apartar',
            denyButtonText: 'Si, salir',
            cancelButtonText: 'No, cancelar!',
            focusDeny:true,
            reverseButtons: false
        }).then(result=>{

            if(result.isConfirmed){
                this.askToSaveStorage();
            }

            if(result.isDenied){
                this.$uibModalInstance.close();
            }
            
        })        
    }


    async askToSaveStorage(){
        try {
            await this._storageSvc.askToSaveDetailDoc("IngresoBodegaDetalle", this.gridOptions.data);
            this.$uibModalInstance.close(); 
        } catch (error) {
            console.log(error)
        }             
    }



}




