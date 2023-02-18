

import { ModalBaseCtrl } from "./modalBaseCtrl.js?v=0.28";

class ModalFacturaCtrl extends ModalBaseCtrl{
    constructor({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS}){
        super({_mS, _commonSvc, _modalSvc, _nombreModalConst,  _tS,})
        const self = this;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this._fS = _fS;

        this.TIPO_DOC_FV = _commonSvc.tipoDoc['FV']
        this.CAMPOS = ["idSucursal", "idCliente", "idPuntoEmision", "fechaEmision", "fechaVencimiento", "validFechaVcto", "gridOptions", "gridOptionsBodega"];  

        this.datosAdicionalesArticulo = [];
        this.infoAdicionalDocumento = [];
        this.cliente = {};
        
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
                
            })
        }
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

        this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
        this.$scope.$apply();        
    }



    trimDetailDoc(){
        let tempDetails = [];
        							 						
        for(let item of this.gridOptions.data){
            tempDetails.push({
                idFacturaDetalle: item.idFacturaDetalle || 0,
                idArticulo: item.idArticulo,
                idTarifa: item.idTarifa,
                idBodega: item.idBodega,
                idMedida: item.idMedida,
                idPresentacion: item.idPresentacion || 0,
                idTipoIva: item.idTipoIva,
                tarifa: item.tarifa,
                codigoPorcentaje: item.codigoPorcentaje,
                ice: item.ice,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precioCostoNeto: item.precioCostoNeto,
                precioUnitario: item.precioUnitario,
                precioVenta: item.precioUnitario,
                precioConIva: item.precioConIva,
                valorDescuento: item.valorDescuento,
                precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                porcentajeDescuento: item.porcentajeDescuento,
                total: item.total,
                nota: item.nota,
            })
        }
        return tempDetails;
    }


    async setItemArticuloEnDetalle(dataArticulo){        
        try {
            const self = this;
            const columnDefs = this.gridOptions.columnDefs;
                 
            this.dataArticulo = dataArticulo;

            self.addRow();        
            
            const {articulo, medidas, datosAdicionales} = self.dataArticulo;        
            let index  = self.gridOptions.data.findIndex(value => value.idArticulo === 0); 
            let entity = self.gridOptions.data[index]; 
        
            let dataMedida = medidas[0];
         
                
            entity.idArticulo           = articulo.idArticulo;
            entity.codigo               = articulo.codigoArticulo;                
            entity.descripcion          = articulo.descripcion;  
            entity.idTipoIva            = articulo.idTipoIva;                          
            entity.codigoPorcentaje     = articulo.codigoPorcentaje;
            entity.tarifa               = articulo.tarifa;
            // entity.nombreTipoIva        = articulo.nombreTipoIva;
            entity.ice                  = articulo.valorIce;
            entity.idBodega             = self.idBodega ? self.idBodega : 0;
            entity.llevaInventario      = articulo.llevaInventario;
            entity.datosAdicionales     = articulo.datosAdicionales;
            entity.productoFraccionable = articulo.productoFraccionable;
            entity.medidas              = medidas; //Lista Medida 
            entity.idMedida             = dataMedida.idMedida; //Medida por defecto 
            entity.adicional            = datosAdicionales; //

            console.log(JSON.parse(dataMedida.tarifas))
            console.log(self)
            entity.articuloTarifas      = JSON.parse(dataMedida.tarifas);
            let tarifa                  = entity.articuloTarifas.find(item=>item.idTarifa===self.idTarifa);                                      
            entity.idTarifa             = self.idTarifa;  
            entity.precioUnitario       = self._fS.roundNumber(tarifa.precioVenta, self.decimal.nroPrecio);                
            entity.precioConIva         = self._fS.roundNumber(tarifa.precioConIva, self.decimal.nroPrecio);
            
            
            const objCalculo            = self.uiGridInvoice.calculoColDef(entity, 0);             
            
            objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();
            
            objCalculo["calculoTotalDetalle"]();
            
            self.data = Object.assign(self.data, self.uiGridInvoice.getTotales()); 

            this.focusColumnCantidad();


            this.indexRow = this.gridOptions.data.findIndex(val => val.idArticulo === this.dataArticulo.articulo.idArticulo);           

          
        } catch (error) {
            console.log(error)            
        }
    }

    addItem(){
        const self = this;
        self.addRow();        
        
        const {articulo, medidas, datosAdicionales} = self.dataArticulo;        
        let index  = self.gridOptions.data.findIndex(value => value.idArticulo === 0); 
        let entity = self.gridOptions.data[index]; 
    
        let dataMedida = medidas[0];

        console.log(entity)
        console.log(this.actividadTipoIva)
            
        entity.idArticulo           = articulo.idArticulo;
        entity.codigo               = articulo.codigoArticulo;                
        entity.descripcion          = articulo.descripcion;  
        entity.idTipoIva            = articulo.idTipoIva;  

        entity.codigoPorcentaje     = articulo.codigoPorcentaje;
        entity.tarifa               = articulo.tarifa;
        // entity.nombreTipoIva        = articulo.nombreTipoIva;
        entity.ice                  = articulo.valorIce;
        entity.idBodega             = self.idBodega ? self.idBodega : 0;
        entity.llevaInventario      = articulo.llevaInventario;
        entity.datosAdicionales     = articulo.datosAdicionales;
        entity.productoFraccionable = articulo.productoFraccionable;
        entity.medidas              = medidas; //Lista Medida 
        entity.idMedida             = dataMedida.idMedida; //Medida por defecto 
        entity.adicional            = datosAdicionales; //

        console.log(JSON.parse(dataMedida.tarifas))
        console.log(self)
        entity.articuloTarifas      = JSON.parse(dataMedida.tarifas);
        let tarifa                  = entity.articuloTarifas.find(item=>item.idTarifa===self.idTarifa);                                      
        entity.idTarifa             = self.idTarifa;  
        entity.precioUnitario       = self._fS.roundNumber(tarifa.precioVenta, self.decimal.nroPrecio);                
        entity.precioConIva         = self._fS.roundNumber(tarifa.precioConIva, self.decimal.nroPrecio);
        
        
        const objCalculo            = self.uiGridInvoice.calculoColDef(entity, 0);             
        
        objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();
        
        objCalculo["calculoTotalDetalle"]();
        
        self.data = Object.assign(self.data, self.uiGridInvoice.getTotales()); 

        this.focusColumnCantidad();
        
       
    }


    openModalDatoAdicionalArticulo(rowEntity, isView){
        let params = {
            rowEntity,
            isView,
            tipoDoc: this.TIPO_DOC_FV,
            idComprobante: this.data.idFactura,
            articuloManejos: this.datosAdicionalesArticulo
        }    
        this.openModalDatoAdicionalArticuloParam(params)
    }


    calcularPorcentajeDescuento() {
        let valor = this.data.porcentajeDescuento || 0;
        this.data.porcentajeDescuento = Number(valor);
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
            let valor = this.data.totalDescuento || 0;
            this.data.totalDescuento = Number(valor)
            
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


    async closeModal(){
        if(this.TIPO_REGISTRO==='NUEVO' && this.gridOptions.data.length>0){
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
                    this.saveLocalStorage();
                }

                if(result.isDenied){
                    this.$uibModalInstance.close();
                }

                

                if(result.isDismissed){
                }
                console.log(result)
            })
            return 
        }
        this.$uibModalInstance.close();        
    }

    async saveLocalStorage(){
        let {isConfirmed, value} = await Swal.fire({
            title: '<small>Apartar Documento</small>',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Apartar',
            cancelButtonText: 'No, cancelar',
            showLoaderOnConfirm: true,
            inputValidator: (value) => {
                if (!value) {                    
                    return 'Ingrese la descripción!'
                }   
                if(localStorage.getItem('detailInvoice')){
                    let getStorageDocDetalle = JSON.parse(localStorage.getItem('detailInvoice'));
                    if(getStorageDocDetalle[value]){
                        return 'Ya existe Documento Apartado con esta descripción';
                    }
                }                        
            },           
        })

        if(isConfirmed){
            if(!localStorage.getItem('detailInvoice')){
                let objSave = {}
                objSave[value] = JSON.stringify(this.gridOptions.data);
                localStorage.setItem('detailInvoice', JSON.stringify(objSave));  
                this._tS.toastr('success', 'Documento Apartado Correctamente');                            
            }

            if(localStorage.getItem('detailInvoice')){
                let getStorageDocDetalle = JSON.parse(localStorage.getItem('detailInvoice'));
                getStorageDocDetalle[value] = JSON.stringify(this.gridOptions.data);
                localStorage.setItem('detailInvoice', JSON.stringify(getStorageDocDetalle)); 
                this._tS.toastr('success', 'Documento Apartado Correctamente')                
            }
            
            this.$uibModalInstance.close();
        }
    }

    async restoreDetailStorage(){
        let docsDetalle = JSON.parse(localStorage.getItem('detailInvoice'));
        let inputOptions = {};
        for(let item of Object.keys(docsDetalle)){
            inputOptions[item] = item;
        }
        const { isConfirmed, value } = await Swal.fire({
            title: '<small>Recuperar Detalle del Documento</small>',
            input: 'select',
            inputOptions,
            inputPlaceholder: 'Seleccionar la Factura',
            showCancelButton: true,
            confirmButtonText: 'Recuperar detalle',
            cancelButtonText: 'No, cancelar',
            allowEscapeKey:false,
            allowOutsideClick:false,
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value) {
                    resolve()
                } else {
                    resolve('Seleccione la opción :)')
                }
              })
            }
        })

        if(isConfirmed){           
            this.gridOptions.data = JSON.parse(docsDetalle[value]);
            delete docsDetalle[value];
            console.log(docsDetalle)
            if(Object.entries(docsDetalle).length !== 0){

                localStorage.setItem('detailInvoice', JSON.stringify(docsDetalle));               
            }else{
                localStorage.removeItem('detailInvoice')
            }
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());  
        }


    }

}


export class ModalFacturaNuevoCtrl extends ModalFacturaCtrl{
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS})
        const self = this;
        let {TIPO_REGISTRO} = _params;        
        this.TIPO_REGISTRO = TIPO_REGISTRO;
        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a  ng-click="grid.appScope.$ctrl.openModalArticle(row.entity, 2)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >

        <a  ng-click="grid.appScope.$ctrl.openModalDatoAdicionalArticulo(row.entity, false)" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`;  

        this.isDefaultArticle = true;
    }
    
    async $onInit(){
        try { 
            showLoader();           
            let resultsDataForm = await this.initiload();            
            
            //6 articulo 
            // if(resultsDataForm[6].length>0){
            //     this.articuloDefault = resultsDataForm[6][0]
            // }

            let {UiGridOptions} = await import('./../factElect/uiGridOptions.js' + CHANGE_VERSION());
            this.establecimientos = resultsDataForm[0];

            if(this.establecimientos.length>0){

                let dataEstab = this.establecimientos[0];             
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                
                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;
                this.puntosEmisiones = resultsDataFormEstab[0];
                this.data.idPuntoEmision = this.puntosEmisiones.length>0?this.puntosEmisiones[0].idPuntoEmision:0;
               
                this.bodegas       = resultsDataFormEstab[1];                
                this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]
                
            }else{
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');            
            }


            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas  = resultsDataForm[4];

            this.idTarifa = this.tarifas.length>0?this.tarifas[0].idTarifa:0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];
            this.data.idTiempoCredito = this.tiempoCreditos.length>0?this.tiempoCreditos[0].idTiempoCredito:0;
           

          
            //7 cliente 
            if(resultsDataForm[7].length>0){
                this.cliente = resultsDataForm[7][0];
            }

            
           
            this.data.fechaEmision = new Date();
            this.getFechaVencimiento();

            this.setColumnDefs();            
           
            this.uiGridInvoice =  new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,                 
                tipoIvas: this.tipoIvas, 
                decimal: this.decimal, 
                actividadTipoIva: this.actividadTipoIva
            })

            this.uiGridInvoice.idTarifa = this.idTarifa;
            

            if(localStorage.getItem('detailInvoice')){
                this.restoreDetailStorage();
            }
            
            this.$scope.$apply();

        } catch (error) {
            
            console.error(error)

        }finally{

            hideLoader();
        }
    }

    

    async onSelectedClienteChange(item){
        try {

            let dataCliente = await this.getClienteById(item);
            this.cliente = dataCliente;

            if (this.TIPO_REGISTRO === 'NUEVO') {
                this.data.placa = '';
                this.data.idTiempoCredito = this.cliente.idTiempoCredito;
                this.getFechaVencimiento(new Date());
            }
            this.$scope.$apply();
            
        } catch (error) {
            this.cliente = {};            
            console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            this.$scope.$apply();
        }
    }

    async onSave(){                        
        try {            
            
            
            if(!this.isValidaForm()) return
        
            if(this.cliente.numeroIdentificacion === this.NUM_CONSUMIDOR_FINAL && this.data.total>50 ){
                this._fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>')           
                return
            }

            this.validarDatosAdicionales("idFacturaDetalle");

            showLoader();
            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoVenta({
                idPuntoEmision: this.data.idPuntoEmision,
                codigoDocumento: this.TIPO_DOC_FV.codigo,                
            })                           
            hideLoader();
            
            if(!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"

            let textAccion = 'Guardar';   
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            swalWithBootstrapButtons.fire({
                title: '<small>Guardar Factura</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este <b> Factura de Venta</b> N° ${this.nroDocumentoSecuencial}</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            }).then(response=>{

                if(response.isConfirmed){

                    showLoader();
                    let factura = Object.assign({}, this.data);
                    factura.idCliente      = this.cliente.idCliente;              
                    factura.fechaEmision   = this._fS.formatDateTimeZone(this.data.fechaEmision);
                    factura.fechaVencimiento = this._fS.formatDateTimeZone(this.data.fechaVencimiento);

                    //Tarifa Aplicada al Documento
                    factura.tarifa = this.actividadTipoIva.tarifa;
                
                    

                    const data = {
                        factura: JSON.stringify(factura),
                        detalle: JSON.stringify(this.trimDetailDoc()),
                        adicional: JSON.stringify(this.infoAdicionalDocumento || []),
                        manejoArticulo: JSON.stringify(this.datosAdicionalesArticulo)
                    }
                

                    this._mS.getData('post', '/FacturaVenta/Insert', data).then(response=>{
                        if(response.code==='0'){    
                            hideLoader();                
                            this._fS.sweetAlert('warning', response.message, response.titleSms);                    
                        }
                        if(response.code==="1"){
                            hideLoader();
                            this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            
                            let data = JSON.parse(response.payload)[0];
                            
                            let mainData = {
                                isRegister: true,
                                data: {
                                    ...data,
                                    nroDocumento: data.estab + data.ptoEmi + data.secuencial,
                                    esContado: data.gestion, 
                                },
                                TIPO_DOC: this.TIPO_DOC_FV                                             
                            }

                            if(mainData.data.esContado){
                                this.openModalRapido(mainData)
                            }else{
                                this.openModalCobroDocumento(mainData)
                            }                                  
                        }
                    })
                }

            }) 
            
                                                
        } catch (error) {            
            console.log(error)
        }finally{
            
        }     
    }
}


export class ModalFacturaEditarCtrl extends ModalFacturaCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS})
        const self = this;

                
        let {TIPO_REGISTRO, data} = _params;        
        this.TIPO_REGISTRO = TIPO_REGISTRO;
        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a  ng-click="grid.appScope.$ctrl.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >

        <a  ng-click="grid.appScope.$ctrl.openModalDatoAdicionalArticulo(row.entity, false)" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`;

        let {dataDocumento, cliente, detalleDocumento, infoAdicionalDocumento, actividadTipoIva } = data;
        this.dataDocumento          = dataDocumento;
        this.cliente                = cliente;
        this.detalleDocumento       = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;
        this.actividadTipoIva       = actividadTipoIva;
        
    }

    async $onInit(){
        try {
            showLoader();
            let resultsDataForm = await this.initiload();            
            let {UiGridOptions} = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());
           
            this.establecimientos = resultsDataForm[0];
            
            if(this.establecimientos.length>0){

                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.dataDocumento.codEstab)             

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);               
                this.puntosEmisiones = resultsDataFormEstab[0];                

                this.bodegas       = resultsDataFormEstab[1];                
                this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
                this.cloneIdBodega = this.idBodega;

                // this.actividadTipoIva = resultsDataFormEstab[2][0]

            }else{
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');            
            }


            this.decimal = resultsDataForm[1][0];
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas  = resultsDataForm[4];

            this.idTarifa = this.tarifas.length>0?this.tarifas[0].idTarifa:0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];
           
            this.setColumnDefs();            
           
            this.uiGridInvoice =  new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,                 
                tipoIvas: this.tipoIvas, 
                decimal: this.decimal, 
                actividadTipoIva: this.actividadTipoIva
            })

            this.uiGridInvoice.idTarifa = this.idTarifa;
            
            //Cargamos los Datos 
            this.data = this.dataDocumento;
            this.nroDocSecuencial = this.data.nroDocSecuencial;
            this.gridOptions.data = this.detalleDocumento;            

            this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);
            this.fechaVencimientoEscrita = this._fS.getFechaEscrita(this.data.fechaVencimiento);
            
            this.$scope.$apply();            

        } catch (error) {
            
            console.log(error)

        }finally{

            hideLoader();
        }
    }

    async onSelectedClienteChange(item){
        try {

            let dataCliente = await this.getClienteById(item);
            this.cliente = dataCliente;           
            this.$scope.$apply();
            
        } catch (error) {
            this.cliente = {};            
            console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            this.$scope.$apply();
        }
    }

    async onSave(){                        
        try {                        
            if(!this.isValidaForm()) return
        
            if(this.cliente.numeroIdentificacion === this.NUM_CONSUMIDOR_FINAL && this.data.total>50 ){
                this._fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>')           
                return
            }

            this.validarDatosAdicionales("idFacturaDetalle");                    

            let textAccion = 'Actualizar';   
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Actualizar Factura</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este <b> Factura de Venta</b> N° ${this.nroDocSecuencial}</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, actualizar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })       
           
            
            if(!isConfirmed) return

            showLoader();
            let factura = Object.assign({}, this.data);
            factura.idCliente      = this.cliente.idCliente;              
            factura.fechaEmision   = this._fS.formatDateTimeZone(this.data.fechaEmision);
            factura.fechaVencimiento = this._fS.formatDateTimeZone(this.data.fechaVencimiento);
        
            let data = {
                factura: JSON.stringify(factura),
                detalle: JSON.stringify(this.trimDetailDoc()),
                adicional: JSON.stringify(this.infoAdicionalDocumento || []),
                manejoArticulo: JSON.stringify(this.datosAdicionalesArticulo)
            }

            await this._mS.getData('put', '/FacturaVenta/Update?id=' + this.data.idFactura, data).then(response=>{
                if(response.code==='0'){                    
                    this._fS.sweetAlert('warning', response.message, response.titleSms);                    
                }
                if(response.code==="1"){
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                    // let data = JSON.parse(response.payload)[0];                   
                    // this.$uibModalInstance.close(data) 
                    this.isUpdate = true;                                      
                }
            })
                                                
        } catch (error) {            
            console.log(error)
        }finally{
            hideLoader();
        }     
    }

    closeModal(){
        let obj = {
            isUpdate: this.isUpdate
        }
      
        this.$uibModalInstance.close(obj);
    }
}




export class ModalFacturaDetalleCtrl extends ModalFacturaCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS})
        const self = this;

        this.CELL_TEMPLATE_OPTION = `
        <a  ng-click="grid.appScope.$ctrl.openModalDatoAdicionalArticle(row.entity)" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`;

         
        this.gridOptions = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,           
        }

        let {dataDocumento, cliente, detalleDocumento, infoAdicionalDocumento, actividadTipoIva } = _params.data;
        this.dataDocumento          = dataDocumento;
        this.cliente                = cliente;
        this.detalleDocumento       = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;
        this.actividadTipoIva = actividadTipoIva;

    }

    async $onInit(){
        try {
            showLoader();
            let resultsDataForm = await this.initiload();            
            let {UiGridOptions} = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());
           
            this.establecimientos = resultsDataForm[0];
            
            if(this.establecimientos.length>0){

                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.dataDocumento.codEstab)             

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);               
                this.puntosEmisiones = resultsDataFormEstab[0];                

                this.bodegas       = resultsDataFormEstab[1];                
                this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
                this.cloneIdBodega = this.idBodega;                
            }else{
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');            
            }


            this.decimal = resultsDataForm[1];
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas  = resultsDataForm[4];

            this.idTarifa = this.tarifas.length>0?this.tarifas[0].idTarifa:0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];
           
            this.setColumnDefsVista();            
           
            this.uiGridInvoice =  new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,                 
                tipoIvas: this.tipoIvas, 
                decimal: this.decimal, 
                actividadTipoIva: this.actividadTipoIva
            })

            this.uiGridInvoice.idTarifa = this.idTarifa;
            
            //Cargamos los Datos 
            this.data = this.dataDocumento;
            this.nroDocSecuencial = this.data.nroDocSecuencial;
            this.gridOptions.data = this.detalleDocumento;            

            this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);
            this.fechaVencimientoEscrita = this._fS.getFechaEscrita(this.data.fechaVencimiento);
            
            this.$scope.$apply();            

        } catch (error) {
            
            console.log(error)

        }finally{

            hideLoader();
        }
    }
}



export class ModalFacturaDuplicarCtrl extends ModalFacturaCtrl{
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS})
        const self = this;

                
        let {TIPO_REGISTRO, data} = _params;        
        this.TIPO_REGISTRO = TIPO_REGISTRO;
        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a  ng-click="grid.appScope.$ctrl.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >

        <a  ng-click="grid.appScope.$ctrl.openModalDatoAdicionalArticulo(row.entity, false)" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`;

        let {dataDocumento, cliente, detalleDocumento, infoAdicionalDocumento } = data;
        this.dataDocumento          = dataDocumento;
        this.cliente                = cliente;
        this.detalleDocumento       = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;
    }

    async $onInit(){
        try {
            showLoader();
            let resultsDataForm = await this.initiload();            
            let {UiGridOptions} = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());
           
            this.establecimientos = resultsDataForm[0];
            
            if(this.establecimientos.length>0){

                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.dataDocumento.codEstab)             

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);               
                this.puntosEmisiones = resultsDataFormEstab[0];                

                this.bodegas       = resultsDataFormEstab[1];                
                this.idBodega      = this.bodegas.length>0?this.bodegas[0].idBodega:0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]

            }else{
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');            
            }


            this.decimal = resultsDataForm[1][0];
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas  = resultsDataForm[4];

            this.idTarifa = this.tarifas.length>0?this.tarifas[0].idTarifa:0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];
           
            this.setColumnDefs();            
           
            this.uiGridInvoice =  new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,                 
                tipoIvas: this.tipoIvas, 
                decimal: this.decimal, 
                actividadTipoIva: this.actividadTipoIva
            })

            this.uiGridInvoice.idTarifa = this.idTarifa;
            
            //Cargamos los Datos 
            this.data = this.dataDocumento;
            this.nroDocSecuencial = this.data.nroDocSecuencial;
            this.cloneCodEstab = this.data.codEstab;
            this.gridOptions.data = this.detalleDocumento;            

            this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);
            this.fechaVencimientoEscrita = this._fS.getFechaEscrita(this.data.fechaVencimiento);
            
            this.$scope.$apply();            

        } catch (error) {
            
            console.log(error)

        }finally{

            hideLoader();
        }
    }

    async onSelectedClienteChange(item){
        try {

            let dataCliente = await this.getClienteById(item);
            this.cliente = dataCliente;

            if (this.TIPO_REGISTRO === 'DUPLICAR') {
                this.data.placa = '';
                this.data.idTiempoCredito = this.cliente.idTiempoCredito;
                this.getFechaVencimiento(new Date());
            }
            this.$scope.$apply();
            
        } catch (error) {
            this.cliente = {};            
            console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            this.$scope.$apply();
        }
    }

    async onSave(){                        
        try {                        
            if(!this.isValidaForm()) return
        
            if(this.cliente.numeroIdentificacion === this.NUM_CONSUMIDOR_FINAL && this.data.total>50 ){
                this._fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>')           
                return
            }

            this.validarDatosAdicionales("idFacturaDetalle");                    

            let textAccion = 'Guardar';   
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Guardar Factura</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este <b> Factura de Venta</b> N° ${this.nroDocSecuencial}</small>?`,
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
            let factura = Object.assign({}, this.data);
            factura.idCliente      = this.cliente.idCliente;              
            factura.fechaEmision   = this._fS.formatDateTimeZone(this.data.fechaEmision);
            factura.fechaVencimiento = this._fS.formatDateTimeZone(this.data.fechaVencimiento);
        
            //Tarifa Aplicada al Documento
            factura.tarifa = this.actividadTipoIva.tarifa;

            const data = {
                factura: JSON.stringify(factura),
                detalle: JSON.stringify(this.trimDetailDoc()),
                adicional: JSON.stringify(this.infoAdicionalDocumento || []),
                manejoArticulo: JSON.stringify(this.datosAdicionalesArticulo)
            }

            await this._mS.getData('post', '/FacturaVenta/Insert', data).then(response=>{
                if(response.code==='0'){                    
                    this._fS.sweetAlert('warning', response.message, response.titleSms);                    
                }
                if(response.code==="1"){
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                    
                    let data = JSON.parse(response.payload)[0];
                    
                    let mainData = {                        
                        data: {
                            ...data,
                            nroDocumento: data.estab + data.ptoEmi + data.secuencial,
                            esContado: data.gestion, 
                        },
                        TIPO_DOC: this.TIPO_DOC_FV                                             
                    }
                    if(mainData.data.esContado){
                        this.openModalRapido(mainData)
                    }else{
                        this.openModalCobroDocumento(mainData)
                    }   
                                                                          
                }
            })
                                                
        } catch (error) {            
            console.log(error)
        }finally{
            hideLoader();
        }     
    }
    
}



export class ModalFacturaDividirCtrl{
    
}



export class ModalFacturaFiltroCtrl extends ModalBaseCtrl{

    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'formulario', 'toastService', 'params']

    constructor($scope, $uibModalInstance, _mS, _commonSvc, _fS, _tS, _params){
        super({_mS, _commonSvc, _tS})

        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._fS = _fS;

        let {dataSearch, clienteFiltro, usuarioSearchFiltro, mes} = _params;

        this.dataSearch = dataSearch || {};
        this.clienteFiltro = clienteFiltro || {}
        this.usuarioSearchFiltro = usuarioSearchFiltro || {};

        this.meses = this._fS.meses();
        this.mes = mes;

    }

    async $onInit(){
        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            this.estadoDocumentos = await this._commonSvc.getEstadoDocByCodDoc('FV');    
            
            this.establecimientos = resultsDataForm[0];
            // this.dataSearch.codEstab = this.establecimientos.length>0? this.establecimientos[0].codEstab: 0;
            
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        } finally{
            hideLoader();
        }
    }

    onKeyupClienteSearchFiltro(){
        if(!this.clienteFiltro.nombreFiscal){
            this.clienteFiltro = {};
            this.dataSearch.byCliente = 0;
        }
    }

    selectedClienteSearchFiltro(item){
        this.clienteFiltro.nombreFiscal = item.nombreFiscal;
        this.dataSearch.byCliente = item.idCliente;
    }

    //---------------Fecha------------
    onChangeFechaFiltro(){
        this.mes = new Date().getMonth() + 1;
        this.dataSearch.tipoFecha = 'FE' //Por Defecto por fecha Emisión de la Factura Venta 
        this.getFechaInicioFinFilter(this.mes)
    }

    getFechaInicioFinFilter(mes){
        let { fechaInicio, fechaFin } = this._fS.getFechaInicioFinFilter(mes);
        this.dataSearch.fechaInicio = fechaInicio;
        this.dataSearch.fechaFin = fechaFin;
    }


    //---------------Usuario--------------------    
    usuarioSearchDynamic(textSearch){
        return this._commonSvc.usuarioSearch({
            idRol: document.getElementById('idRol').value,
            busqueda: textSearch
        })
    }

    onKeyupUsuarioSearchFiltro(){
        if(this.usuarioSearchFiltro.nombreCompleto==='' || this.usuarioSearchFiltro.nombreCompleto===null || this.usuarioSearchFiltro.nombreCompleto===undefined){
            this.usuarioSearchFiltro = {};
            this.dataSearch.byUsuario = 0;
        }
    }

    selectedUsuarioSearchFiltro(item){
        this.usuarioSearchFiltro.nombreCompleto = item.nombreCompleto;
        this.dataSearch.byUsuario = item.idUsuario;        
    }



    getSearch(){
        let titutoToast = "Búsqueda";
        if (!this.dataSearch.codEstab || this.dataSearch.codEstab===0) {
            this._tS.toastr('warning', 'Por favor seleccione una Sucursal', titutoToast);
            return;
        }

        if (this.dataSearch.checkBoxCliente) {
            if (!this.dataSearch.byCliente || this.dataSearch.byCliente === 0) {
                this._tS.toastr('warning', 'Seleccione el Cliente', titutoToast);
                return;
            }
        }

        if (this.dataSearch.checkBoxUsuario) {
            if (!this.dataSearch.byUsuario || this.dataSearch.byUsuario===0) {
                this._tS.toastr('warning', '   Ingrese el Usuario', titutoToast);
                return
            }
        }     


        if (this.dataSearch.checkBoxEstado) {
            if (!this.dataSearch.byEstado || this.dataSearch.byEstado === 0) {
                this._tS.toastr('warning', 'Por favor seleccione el Estado', titutoToast);
                return
            }
        }

        if (this.dataSearch.checkBoxFecha) {
            if (!this.dataSearch.fechaInicio) {
                this._tS.toastr('warning', 'Ingrese la Fecha Inicio', titutoToast);
                return
            }

            if(!this.dataSearch.fechaInicio instanceof Date && !isNaN(this.dataSearch.fechaInicio)){
                this._tS.toastr('warning', 'Ingrese una Fecha Válida');
                return
            }

            if (!this.dataSearch.fechaFin) {
                this._tS.toastr('warning', 'Ingrese la Fecha Fin');
                return
            }

            if(!this.dataSearch.fechaFin instanceof Date && !isNaN(this.dataSearch.fechaFin)){
                this._tS.toastr('warning', 'Ingrese una Fecha Válida');
                return
            }

            if (!(Date.parse(this.dataSearch.fechaInicio) <= Date.parse(this.dataSearch.fechaFin))) {
                this._tS.toastr('warning', 'Fecha Fin no puede se menor a Fecha Inicio');
                return
            }
        }

         
        
        this.$uibModalInstance.close({
            dataSearch: this.dataSearch,
            clienteFiltro: this.clienteFiltro,
            usuarioSearchFiltro: this.usuarioSearchFiltro,
            mes: this.mes,
            isSearch: true
        });
    }

    closeModal(){
        this.$uibModalInstance.close({
            dataSearch: this.dataSearch,
            clienteFiltro: this.clienteFiltro,
            usuarioSearchFiltro: this.usuarioSearchFiltro,
            mes: this.mes,
            isSearch: false
        });       
    }
}