

class ModalBaseCtrl{
    constructor({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS}){
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;
        this._fS = _fS;

       
    }

    initiload(){
        return this._mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
            if(response.code==='0'){                
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


    async onChangeEstablecimiento(){
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
                html: "<small>Esta seguro de cambiar el <b>Establecimiento</b> y el <b>Punto de Emisión</b>?</small>",
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

            const dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab);   
            
            //Obtenemos Puntos de Emision y Bodegas 
            let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
           
            this.puntosEmision = resultsDataFormEstab[0];
            this.data.idPuntoEmision = this.puntosEmision.length>0 ? this.puntosEmision[0].idPuntoEmision: 0;
                       
            this.$scope.$apply();
        } catch (error) {
            console.trace(error)
        }       
    }

    setFocusArticulo() {
        setTimeout(function() {
          document.querySelector('#custom-template-md-autocomplete-articulo').focus();
        }, 100);
    }


    openModalArticuloEditar(item){        
        this.$scope.gridApi.cellNav.scrollToFocus(
            this.gridOptions.data[0],
            this.gridOptions.columnDefs[2]
        )
        this.$scope.$broadcast("editArticulo", item)
    }


    async deleteRow(row) {
        let index = this.gridOptions.data.indexOf(row.entity);
        
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>¿Desea eliminar el artículo ${row.entity.descripcion}?</small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        })

        if(isConfirmed){          
            this.gridOptions.data.splice(index, 1);   
            this.enumGridOptions();  
            this.$scope.$apply()          
        }
    }

    enumGridOptions() {
        let index = 0, count = 1;
        for(let item of this.gridOptions.data){
            this.gridOptions.data[index].n = count++;
            index++
        }       
    }


    setItemArticuloEnDetalle(item){
        
        try {

            showLoader();
            let {articulo, medidas} = item;
    
            let entity = {};

            this.indexFind = this.gridOptions.data.findIndex(val => val.idArticulo === articulo.idArticulo);

            
            if (this.indexFind === -1) {
                this.addRow(articulo); //Add Article 
                
                this.indexFind = this.gridOptions.data.findIndex(val => val.idArticulo === articulo.idArticulo);
                entity    = this.gridOptions.data[this.indexFind];

                this.setItem(entity, articulo);

            } else {
                entity = this.gridOptions.data[this.indexFind];
                entity.cantidad = entity.cantidad + 1;
            }
    
            
            this.enumGridOptions();
            this.focusColumnCantidad();
            this.$scope.$apply();
            hideLoader();
        } catch (error) {
            console.log(error)
            hideLoader();
        }
           
    }

    addRow(item) {
        this.gridOptions.data.push({
            idGuiaRemisionDetalle:0,
            idArticulo: item.idArticulo,
            codigo: item.codigoArticulo,
            descripcion: item.descripcion,
            llevaInventario: item.llevaInventario,
            cantidad: 1
        })
    }

    setItem(entity, item) {
        entity.idArticulo = item.idArticulo,
        entity.codigo = item.codigoArticulo,
        entity.descripcion = item.descripcion,
        entity.llevaInventario = item.llevaInventario
    }

    focusColumnCantidad() {
        const self = this;
        let index = self.gridOptions.columnDefs.findIndex(item=>item.field==='cantidad')
        self.$scope.gridApi.cellNav.scrollToFocus(
            self.gridOptions.data[0],
            self.gridOptions.columnDefs[2]
        )

        self.$timeout(() => {
            self.$scope.gridApi.cellNav.scrollToFocus(
                self.gridOptions.data[self.indexFind],
                self.gridOptions.columnDefs[index]
            );
        }, 30)
    }




    //Editar Transportista 
    async openModalTransportistaUpdate(){
        let {MODAL_CTRL, MODAL_EDITAR} = this._nombreModalConst.transportista;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_EDITAR['controller']];
        let template   = MODAL_EDITAR['template'];
                        
        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'md',
            params: Object.assign({}, this.transportista)
        })        

        modalRef.result.then(response=>{
            if(typeof response !=='object') return
            this.transportista = JSON.parse(response.payload)[0]                     
        })
    }



    closeModal(){
        this.$uibModalInstance.close()
    }
}


class ModalGuiaRemisionCtrl extends ModalBaseCtrl{
    constructor({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS}){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS})

        const self = this;

        this.TIPO_DOC = this._commonSvc.tipoDoc['GR'];

        this.gridOptions = {
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            enableCellEdit: true,                                                                            
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
                    self.$scope.gridApi.grid.cellNav.clearFocus();
                // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit(self.$scope, (rowEntity, colDef, newValue, oldValue) => {
                
                const index = self.gridOptions.data.indexOf(rowEntity); //Obtenemos indice         

                if ([undefined, null, ""].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }
                if (colDef.field == "cantidad" && rowEntity.cantidad === 0) {
                    rowEntity.cantidad = oldValue;
                }
                if (colDef.field === "cantidad") {
                    self.gridOptions.data[index].cantidad = self._fS.roundNumber(newValue, 5);            
                }
                
            })
        }

        this.data = {};
        this.cliente = {};
        this.transportista = {};
        this.vehiculo = {};
        this.empleado = {};

        this.infoAdicionalDocumento = [];

    }


    setColumnDefs(){
        this.gridOptions.columnDefs = [
            {
                name: 'N°', field: 'n', type: 'number',
                width: '5%', minWidth: '50', enableCellEdit: false,
                allowCellFocus: false
            },
            {
                name: "Código", field: "codigo", type: 'string',
                width: '8%', minWidth: '50', enableCellEdit: false,
                allowCellFocus: false
            },
            {
                name: 'Descripcion', field: 'descripcion', type: 'string', width: '65%',
                minWidth: '150', enableCellEditOnFocus: true,
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario !== true;

                },
                cellTooltip: function (row) {
                    return row.entity.descripcion
                }
            },
            {
                name: "Cantidad", field: 'cantidad', type: "number", width: '10%',
                minWidth: '100', allowCellFocus: true, enableCellEditOnFocus: true
            },
            {
                name: 'Op',
                enableCellEdit: false,
                enableColumnMenu: false,
                allowCellFocus: false,
                width: '11%',
                minWidth: '100',
                cellTemplate: `<div class="text-center"><button type="button" class="btn btn-success btn-sm text-white" style="cursor:pointer;" title="Editar Item" ng-click="grid.appScope.$ctrl.openModalArticuloEditar(row.entity)"><i class="ti-pencil"></i></button>
                               <button type="button" class="btn btn-danger btn-sm text-white" style="cursor:pointer;" title="Eliminar Item" ng-click="grid.appScope.$ctrl.deleteRow(row)"><i class="ti-trash"></i></button></div>`,
            },
            {
                name: '', field: 'goBackArticulo', enableCellEdit: false, width: '1%'
            },
        ]
    }

    setColumnDefsView(){
        this.gridOptions.columnDefs = [
            {
                name: 'N°', field: 'n', type: 'number',
                width: '5%', minWidth: '50', enableCellEdit: false,
                allowCellFocus: false
            },
            {
                name: "Código", field: "codigo", type: 'string',
                width: '8%', minWidth: '50', enableCellEdit: false,
                allowCellFocus: false
            },
            {
                name: 'Descripcion', field: 'descripcion', type: 'string', width: '65%',
                minWidth: '150', enableCellEditOnFocus: true,
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario !== true;

                },
                cellTooltip: function (row) {
                    return row.entity.descripcion
                }
            },
            {
                name: "Cantidad", field: 'cantidad', type: "number", width: '10%',
                minWidth: '100', allowCellFocus: true, enableCellEditOnFocus: true
            },
            {
                name: 'Op',
                enableCellEdit: false,
                enableColumnMenu: false,
                allowCellFocus: false,
                width: '11%',
                minWidth: '100',
                cellTemplate: `<div class="text-center"><a class="btn btn-success btn-sm text-white disabled" style="cursor:pointer;" title="Editar Item"><i class="ti-pencil"></i></a>
                               <a class="btn btn-danger btn-sm text-white disabled" style="cursor:pointer;" title="Eliminar Item" ><i class="ti-trash"></i></a></div>`,
            },
            {
                name: '', field: 'goBackArticulo', enableCellEdit: false, width: '1%'
            },
        ]
    }


    //Información Adicional del Documento 
    async openModalInfoAdicional(isView){
        let params = {
            isView,
            infoAdicionalDocumento: this.infoAdicionalDocumento
        }
        
        let {MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL, MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML} = this._nombreModalConst.common;
        let {InfoAdicionalTipoDocCtrl} = await import('./../../modal/' + MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL);

        let modalRef = this._modalSvc.openModalCustom({
            controller: InfoAdicionalTipoDocCtrl,
            template: 'Shared/Common/'+MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML,
            size:'md',
            params
        })

        modalRef.result.then(infoAdicionalDocumento=>{
            this.infoAdicionalDocumento = infoAdicionalDocumento
        })
    }


    //----------------------------TRANSPORTISTA----------------------

    onKeyupTransportistaSearch(){
        if(this._fS.campo(this.transportista.nombre)) {
            this.transportista = {};
        }
    }

    transporteSearch(bySearch) {
        const json = {
            typeList:2,
            bySearch
        }

        return this._mS.getData('get', '/Transportista/Get?json=' + JSON.stringify(json)).then(response => {            
            if (response.id === "0") {
                toastr.error(response.message)
                return
            }
            return JSON.parse(response.data) || []
        })
    }

    selectedTransportstaChange(data){
        this.transportista = data;        
    }

    async openModalTransportistaNew(){
        let {MODAL_CTRL, MODAL_NUEVO} = this._nombreModalConst.transportista;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];

        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'md'
        })
    }
    


    async vehiculoSearch(textSearch) {
        return this._mS.getData('get','/Vehiculo/Search?text=' + textSearch).then(response => {            
            if (response.id === "0") {
                console.warn(response)               
                return
            }
            return response.data
        })
    }


    onKeyupVehiculoSearch() {
        if (this._fS.campo(this.vehiculo.placa)) {
            this.vehiculo = {}
        }
    }

    selectedVehiculoChange(item) {
        this.vehiculo = item;              
    }

    async openModalVehiculoNew(){
        let {MODAL_CTRL, MODAL_NUEVO} = this._nombreModalConst.vehiculo;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        
        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'md'
        })
       
    }

    async openModalVehiculoEditar(){
        let {MODAL_CTRL, MODAL_NUEVO} = this._nombreModalConst.vehiculo;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        
        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'md',
            params: Object.assign({}, this.vehiculo)
        })

        modalRef.result.then(response=>{
            if(typeof response !=='object') return
            this.vehiculo = JSON.parse(response.payload)[0]            
        })
    }


    empleadoSearch(textSearch) {
        return this._mS.getData('get','/Empleado/Search?busqueda=' + textSearch).then(response => {
            if (response.id == "0") {
                console.warn(response)
                return
            }
            return response.data
        })
    }

    onKeyupSearchEmpleado(){
        if (this._fS.campo(this.empleado.nombreCompleto)) {
            this.empleado = {};
        }
    }

    selectedEmpleadoChange(item) {
        this.empleado = item;       
    }

    async openModalEmpleadoNew(){
        let {MODAL_CTRL, MODAL_NUEVO} = this._nombreModalConst.empleado;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        
        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'md'
        })
    }

    validForm(tituloModal){
              
        if (!this.data.codEstab) {
            this._tS.toastr('warning','Seleccione el Establecimiento', tituloModal);
            return
        }
        
        if (!(this.data.idPuntoEmision>0)) {
            this._tS.toastr('warning','Seleccione el Pto. Emisión', tituloModal);
            return
        }

        if (!this.data.fechaEmision) {
            this._tS.toastr('warning','Ingrese la Fecha de Emisión', tituloModal);
            return
        }

        if (!(this.cliente.idCliente>0)) {
            this._tS.toastr('warning','Seleccione el Cliente', tituloModal);
            return
        };

        if (!this.data.fechaInicio) {
            this._tS.toastr('warning','Ingrese Fecha de Inicio', tituloModal);
            return
        }
        if (!this.data.fechaFin) {
            this._tS.toastr('warning','Ingrese Fecha de Fin', tituloModal);
            return
        }
        if (!(Date.parse(this.data.fechaFin) <= Date.parse(this.data.fechaInicio))) {
            this._tS.toastr('warning','Fecha Fin no tiene que ser menor al Fecha de Inicio', tituloModal);
            return
        }
        if (!(this.transportista.idTransportista>0)) {
            this._tS.toastr('warning','Seleccione el Transportista', tituloModal);
            return
        }
        if (!(this.vehiculo.idVehiculo>0)) {
            this._tS.toastr('warning','Seleccione el Vehiculo', tituloModal);
            return
        }
        
        if (!this.data.ptoPartida) {
            this._tS.toastr('warning','Ingrese el Punto de Partida', tituloModal);
            return
        }
        if (!this.data.ptoLlegada) {
            this._tS.toastr('warning','Ingrese el Punto de Llegada', tituloModal);
            return
        }

        if (!this.data.estableDestino) {
            this._tS.toastr('warning','Ingrese Est. Destino', tituloModal);
            return
        }

        if (!this.data.ruta) {
            this._tS.toastr('warning', 'Ingrese la Ruta', tituloModal);
            return
        }

        if (!this.data.motivo) {
            this._tS.toastr('warning', 'Ingrese el Motivo de Traslado', tituloModal);
            return
        }

        if (this.gridOptions.data.length === 0) {
            this._tS.toastr('warning','Al menos ingrese un Articulo en el Detalle', tituloModal);
            return
        }

        return true;
    }

    generarNroDocumento(){
        return this._commonSvc.generarNroDocumentoCompra({
            idPuntoEmision: this.data.idPuntoEmision, 
            codigoDocumento: this.TIPO_DOC.codigo
        })
    }

}


export class ModalGuiaRemisionNuevoCtrl extends ModalGuiaRemisionCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario']
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS})
        this.searchClienteOptions = {}
        this.searchClienteOptions.showBtnNew = true;
        this.searchClienteOptions.showBtnList = true;

        this.data.fechaEmision = new Date()
        this.data.fechaInicio  = new Date();
        this.data.fechaFin     = new Date();
    }


    async $onInit(){

        try {
            
            showLoader();

            let resultsDataForm = await this.initiload();                                   
            
            this.establecimientos = resultsDataForm[0];
           
            if(this.establecimientos.length>0){

                let dataEstab = this.establecimientos[0]          

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);               
                                                
                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];
                this.data.idPuntoEmision = this.puntosEmision.length>0?this.puntosEmision[0].idPuntoEmision:0;

                

                // this.actividadTipoIva = resultsDataFormEstab[2][0]

            }else{
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');            
            }

            this.setColumnDefs();

            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }        
    }

    selectedItemCliente(item){        
        this.cliente = item;
        this.$scope.$apply()
    }


    async onSave(){
        try {
            
            let tituloModal = "Guardar";

            if(!this.validForm(tituloModal)) return

            showLoader();
            let nroDocSecuencial = await this.generarNroDocumento();

            if(!nroDocSecuencial){
                hideLoader();
                throw "NO SE GENERÓ CORRECTAMENTE EL NÚMERO SECUENCIAL";
            }
            hideLoader();

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Guardar Guía de Remisión</small>',
                html: `<small>Esta Ud. seguro de ${tituloModal} este <b> Documento</b> N° ${nroDocSecuencial}</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })  
            
            if(isConfirmed){
                hideLoader();

                let guia = Object.assign({}, this.data);

                guia.idCliente       = this.cliente.idCliente;
                guia.idTransportista = this.transportista.idTransportista;
                guia.idVehiculo      = this.vehiculo.idVehiculo;
                guia.idEmpleado      = this.empleado.idEmpleado
                
                guia.fechaEmision = this._fS.formatDateTimeZone(this.data.fechaEmision );
                guia.fechaInicio  = this._fS.formatDateTimeZone(this.data.fechaInicio );
                guia.fechaFin     = this._fS.formatDateTimeZone(this.data.fechaFin );

                let data = {
                    guia,
                    detalle: this.gridOptions.data,
                    adicional: this.infoAdicionalDocumento
                }
                
                await this._mS.getData('post', '/GuiaRemision/Insert', data).then(response=>{                    
                    if (response.id === "0") {                       
                        this._fS.sweetAlert('warning', response.message, response.titleSms);                        
                    }
                    if (response.id === "1") {                        
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);                                               
                        this.$uibModalInstance.close(response);
                    }
                })
            }

        } catch (error) {

            console.log(error)

        }finally{

            hideLoader();

        }
    }


}


export class ModalGuiaRemisionEditarCtrl extends ModalGuiaRemisionCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS})
       
        this.searchClienteOptions = {}
        this.searchClienteOptions.showBtnNew = true;
        this.searchClienteOptions.showBtnList = true;
        this.searchClienteOptions.showBtnEdit = true;

        let {TIPO_REGISTRO, data} = _params;
        let {dataDocumento, cliente, transportista, vehiculo, empleado, detalleDocumento, infoAdicionalDocumento} = data;
       
        this.TIPO_REGISTRO = TIPO_REGISTRO;
        
        this.data = dataDocumento;
        this.cliente = cliente;
        this.transportista = transportista;
        this.vehiculo = vehiculo;
        this.empleado = empleado;
        this.detalleDocumento = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;


    }


    async $onInit(){

        try {
            
            showLoader();

            let resultsDataForm = await this.initiload();                                   
            
            this.establecimientos = resultsDataForm[0];
           
            if(this.establecimientos.length>0){

                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab)          

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);               
                                                
                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];                
            }else{
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');            
            }

            this.setColumnDefs();
            this.gridOptions.data = this.detalleDocumento;
            this.enumGridOptions()
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }
        
    }

    selectedItemCliente(item){        
        this.cliente = item;
        this.$scope.$apply()
    }


    async onSave(){
        try {
            
            let tituloModal = "Actualizar";

            if(!this.validForm(tituloModal)) return

           

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Guardar Guía de Remisión</small>',
                html: `<small>Esta Ud. seguro de ${tituloModal} el Documento</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, actualizar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })  
            
            if(isConfirmed){
                hideLoader();

                let guia = Object.assign({}, this.data);

                guia.idCliente       = this.cliente.idCliente;
                guia.idTransportista = this.transportista.idTransportista;
                guia.idVehiculo      = this.vehiculo.idVehiculo;
                guia.idEmpleado      = this.empleado.idEmpleado
                
                guia.fechaEmision = this._fS.formatDateTimeZone(this.data.fechaEmision );
                guia.fechaInicio  = this._fS.formatDateTimeZone(this.data.fechaInicio );
                guia.fechaFin     = this._fS.formatDateTimeZone(this.data.fechaFin );

                let data = {
                    guia,
                    detalle: this.gridOptions.data,
                    adicional: this.infoAdicionalDocumento
                }
                
                await this._mS.getData('put', '/GuiaRemision/Update?id=' + this.data.idGuiaRemision, data).then(response=>{                    
                    if (response.id === "0") {                       
                        this._fS.sweetAlert('warning', response.message, response.titleSms);                        
                    }
                    if (response.id === "1") {                        
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);                                               
                        this.$uibModalInstance.close(response);
                    }
                })
            }

        } catch (error) {

            console.log(error)

        }finally{

            hideLoader();

        }
    }


}



export class ModalGuiaRemisionDetalleCtrl extends ModalGuiaRemisionCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS})      

        let {TIPO_REGISTRO, data} = _params;
        let {dataDocumento, cliente, transportista, vehiculo, empleado, detalleDocumento, infoAdicionalDocumento} = data;
       
        this.TIPO_REGISTRO = TIPO_REGISTRO;
        
        this.data = dataDocumento;
        this.cliente = cliente;
        this.transportista = transportista;
        this.vehiculo = vehiculo;
        this.empleado = empleado;
        this.detalleDocumento = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;


    }


    async $onInit(){

        try {
            
            showLoader();

            let resultsDataForm = await this.initiload();                                   
            
            this.establecimientos = resultsDataForm[0];
           
            if(this.establecimientos.length>0){

                let dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab)          

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);               
                                                
                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];                
            }else{
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');            
            }

            this.setColumnDefsView();
            this.gridOptions.data = this.detalleDocumento;
            this.enumGridOptions()
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }
        
    }


}


export class ModalGuiaRemisionFiltroCtrl extends ModalGuiaRemisionCtrl{
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS}) 
        
        let {dataSearch, clienteFiltro, usuarioSearchFiltro, mes} = _params;

        this.dataSearch = dataSearch || {};
        this.clienteFiltro = clienteFiltro || {}
        this.usuarioSearchFiltro = usuarioSearchFiltro || {};

        this.meses = this._fS.meses();
        this.mes = mes;

        this.dataSearch.typeDate = 'FE' //Por Defecto por fecha Emisión de la Factura Venta 

    }

    async $onInit(){

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            this.estadoDocumentos = await this._commonSvc.getEstadoDocByCodDoc('GR');    
            
            this.establecimientos = resultsDataForm[0];
            // this.dataSearch.codEstab = this.establecimientos.length>0? this.establecimientos[0].codEstab: 0;
            
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }        
    }

     /**
     * 
     * @param {string} textSearch 
     * @returns 
     */
     clienteSearchDynamic(textSearch){
        try {            
            return this._commonSvc.clienteSearch(textSearch);   
            
        } catch (error) {
            console.log(error)
        }
    }


    onKeyupSearchCliente(){
        if(!this.cliente.nombreFiscal){
            this.cliente = {};
        }
    }


    onKeyupClienteSearchFiltro(){
        if(!this.clienteFiltro.nombreFiscal){
            this.clienteFiltro = {};
            this.dataSearch.byCustomer = 0;
        }
    }

    selectedClienteSearchFiltro(item){
        this.clienteFiltro.nombreFiscal = item.nombreFiscal;
        this.dataSearch.byCustomer = item.idCliente;
    }

    //---------------Fecha------------
    onChangeFechaFiltro(){
        this.mes = new Date().getMonth() + 1;
       
        this.getFechaInicioFinFilter(this.mes)
    }

    getFechaInicioFinFilter(mes){
        let { fechaInicio, fechaFin } = this._fS.getFechaInicioFinFilter(mes);
        this.dataSearch.dateStart = fechaInicio;
        this.dataSearch.dateEnd = fechaFin;
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
            this.dataSearch.byUser = 0;
        }
    }

    selectedUsuarioSearchFiltro(item){
        this.usuarioSearchFiltro.nombreCompleto = item.nombreCompleto;
        this.dataSearch.byUser = item.idUsuario;        
    }


    getSearch(){
        let titutoToast = "Búsqueda";
        if (!this.dataSearch.codEstab) {
            this._tS.toastr('warning', 'Seleccione el Establecimiento', titutoToast);
            return;
        }

        if (this.dataSearch.checkBoxCustomer) {
            if (!this.dataSearch.byCustomer || this.dataSearch.byCustomer === 0) {
                this._tS.toastr('warning', 'Seleccione el Cliente', titutoToast);
                return;
            }
        }

        if (this.dataSearch.checkBoxStatus) {
            if (!this.dataSearch.byStatus || this.dataSearch.byStatus === 0) {
                this._tS.toastr('warning', 'Por favor seleccione el Estado', titutoToast);
                return
            }
        }

        if (this.dataSearch.checkBoxDate) {
            
            if (!this.dataSearch.dateStart) {
                this._tS.toastr('warning', 'Ingrese la Fecha Inicio', titutoToast);
                return;
            }

            if(!this.dataSearch.dateStart instanceof Date && !isNaN(this.dataSearch.dateStart)){
                this._tS.toastr('warning', 'Ingrese una fecha válida', titutoToast);
                return;
            }

            if (!this.dataSearch.dateEnd) {
                this._tS.toastr('warning', 'Ingrese la Fecha Fin');
                return;
            }

            if(!this.dataSearch.dateEnd instanceof Date && !isNaN(this.dataSearch.dateEnd)){
                this._tS.toastr('warning', 'Ingrese una fecha válida', titutoToast);
                return;
            }

            if (!(Date.parse(this.dataSearch.dateStart) <= Date.parse(this.dataSearch.dateEnd))) {
                this._tS.toastr('warning', 'Fecha Fin no puede se menor a Fecha Inicio');
                return;
            }
        }

        if (this.dataSearch.checkBoxUser) {
            if (!this.dataSearch.byUser) {
                this._tS.toastr('warning', '   Ingrese el Usuario', titutoToast);
                return;
            }
        }

        this.$uibModalInstance.close({
            isSearch: true,
            dataSearch: this.dataSearch, 
            clienteFiltro: this.clienteFiltro, 
            usuarioSearchFiltro: this.usuarioSearchFiltro, 
            mes: this.mes
        })
    }

    closeModal(){
        this.$uibModalInstance.close({
            isSearch: false,
            dataSearch: this.dataSearch, 
            clienteFiltro: this.clienteFiltro, 
            usuarioSearchFiltro: this.usuarioSearchFiltro, 
            mes: this.mes
        })
    }


}

