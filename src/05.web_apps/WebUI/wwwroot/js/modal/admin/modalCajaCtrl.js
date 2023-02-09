export class ModalCajaCtrl{
    static $inject=['mainService', '$uibModalInstance', 'formulario', 'params'];
    constructor(_mS, $uibModalInstance, _form, _params){
        this._mS               = _mS;        
        this.$uibModalInstance = $uibModalInstance;
        this._form             = _form;
        this._params           = _params;
        this.tipoRegistro      = 1;
        this.data              = {};        
    }
     
    $onInit(){        
        if(this._params){            
            this.tipoRegistro = 2;
            this.data = this._params.caja;            
        }
    }

    saveAndUpdate() {
        let tituloToast = this.tipoRegistro===1?'Guardar': 'Actualizar';

        if (this._form.campo(this.data.descripcion)) {
            toastr.warning('Ingrese la Descripción', tituloToast);
            return;
        }

        const url = this.tipoRegistro === 1 ? '/Caja/Post' : '/Caja/Put?idCaja=' + this.data.idCaja;
        let method = this.tipoRegistro===1?'post':'put';

        this._mS.getData(method, url, this.data).then(response=>{
            if (response.id === "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            if (response.id === "1") {
                this.$uibModalInstance.close(response);
                toastr.success(response.message, response.titleSms);              
                return
            }

        })       
    }
    
    closeModal(){
        this.$uibModalInstance.close();
    }    
    
}






/**
 * 
 * ---------------------------------------Start Modal Apertura Caja 
 */

export class ModalAperturaCtrl{
    static $inject = ['mainService', '$uibModalInstance', 'formulario', 'params'];
  
    constructor(_mS, $uibModalInstance, _form, _params){
        this._mS   = _mS;        
        this.$uibModalInstance = $uibModalInstance;
        this._form   = _form;
        this._params           = _params;
        this.data = {};        

        this.entidadesFinancieras = [];                
    }

    $onInit(){
        try {
            this._mS.getData('get','/EntidadFinanciera/OptionEntidadFinanciera').then(response=>{
                if (response.id == "0") {
                    toastr.warning(response.message, response.titleSms);
                    return;
                }
                this.entidadesFinancieras = response.data;
                this.data.idEntidadFinanciera = this.entidadesFinancieras.find(e => e.codigo == 'EFE').idEntidadFinanciera
            }); 
        } catch (error) {
            toastr.error(error)            
        }    
    }

    aperturaCaja() {
        let tituloToast = 'Guardar';
        if (this._form.campo(this.data.idEntidadFinanciera)) {
            toastr.warning('Seleccione la Entidad Financiera', tituloToast);
            return;
        }
        if (this._form.campo(this.data.concepto)) {
            toastr.warning('Ingrese el Campo Concepto', tituloToast);
            return;
        }
        if (this._form.campo(this.data.entrada) || isNaN(this.data.entrada)) {
            toastr.warning('Ingrese el Campo Valor', tituloToast);
            return;
        }
        
        this.data.idCaja = this._params.caja.idCaja;

        this._mS.getData('post','/ControlCaja/Insert', this.data).then(response => {
            if (response.code === "0") {
                toastr.warning(response.message, response.titleSms);                
            }
            if (response.code === "1") {
                this.$uibModalInstance.close(response);
                toastr.success(response.message, response.titleSms);                                
            }
        })
    }


    closeModal(){
        this.$uibModalInstance.close();
    }

}





/**
 * Class Modal Asignacion Usuario/Turno
 */

export class ModalAsignacionUsuarioTurnoCtrl{
    static $inject = ['mainService', 'commonService', '$uibModalInstance', 'formulario', 'params'];
    
    constructor(_mS, _comonSvc, $uibModalInstance, _form, _params){
        this._mS = _mS;        
        this._comonSvc         = _comonSvc;
        this.$uibModalInstance = $uibModalInstance;
        this._form             = _form;
        this._params           = _params;

        this.data              = {};
        this.usuarioSearch     = {};

        this.data.idCaja       = this._params.caja.idCaja; 
        this.turnos            = [];
        this.horarios          = [];
    }

    $onInit(){
        this.getAllTurno();        
    }

    getAllTurno(){
        this._mS.getData('get', '/Turno/ListTurno').then(response => {
            if (response.id == "0") {
                toastr.warning(response.message, response.titleSms);
                return;
            }
            this.turnos = response.data;
            if(this._params.usuarioAsignado==="0"){
                this.tipoRegistro = 1;     
            }                
    
            this.getAsignacionCaja();
        });
    }

    getAsignacionCaja(){
        this._mS.getData('get','/AsignacionCaja/GetByIdCaja?idCaja=' + this.data.idCaja).then(response => {
            if (response.id == 0) {
                toastr.warning(response.message, response.titleSms);
                return;
            }
            
            if (response.id == 1) {                
                const { asignacionCaja: data } = response.data[0];                                                                    
                this.tipoRegistro=2;
                
                this.usuarioSearch.nombreCompleto = this._params.usuarioAsignado;
                this.data.idTurno = data.idTurno;
                this.data.idUsuario = data.idUsuario;
                this.data.idAsignacionCaja = data.idAsignacionCaja;

                this.turnos = this.turnos.map(item=>({...item, estado: item.idTurno===data.idTurno}))                                     
            }
        });
    }

    searchUsuario(busqueda){
        return this._comonSvc.usuarioSearch({
            idRol: document.getElementById('idRol').value,
            busqueda
        }).then(response=>response)     
    }

    onKeyupUsuarioSearch(){
        if(this._form.campo(this.usuarioSearch.nombreCompleto)){
            this.usuarioSearch = {};
            this.data.idUsuario = 0;
        }
    }
    
    selectedUsuarioSearch(item) {
        this.data.idUsuario = item.idUsuario
    }

    onChangeTurno(item){
        this.turnos.forEach((val, index)=>{
            val.estado = false;
            if(val.idTurno ===item.idTurno){
                item.estado=true;
                this.data.idTurno = item.idTurno;
            }                
        })           
    }

    detalleHorario(idTurno){  
        this.horarios=[];
        this._mS.getData('get','/Horario/GetByIdTurno?idTurno=' + idTurno).then(response=> {                
            this.horarios = response.data;
        });
    }


    saveUpdateAsigUsuarioTurno() {
        const tituloToast = this.tipoRegistro===1 ?'Guardar':'Actualizar';

        if (this._form.campo(this.data.idUsuario)) {
            toastr.warning('Seleccione el Usuario', tituloToast);
            return;
        }
        if (this._form.campo(this.data.idTurno)) {
            toastr.warning('Seleccione el Turno', tituloToast);
            return;
        }
        
        const url = this.tipoRegistro == 1 ? '/AsignacionCaja/Post' : '/AsignacionCaja/Put';

        this._mS.getData('post',url, this.data).then(response => {            
            if (response.id === "0") {
                toastr.warning(response.message, response.titleSms);                
            }
            if (response.id === "1") {
                this.$uibModalInstance.close(response)
                toastr.success(response.message, response.titleSms);                                
            }
        })
    }



    closeModal(){
        this.$uibModalInstance.close();
    }
}








/**
 * Class Modal Movimiento Caja
 */
export class MovimientoCajaCtrl{
    static $inject=['$filter','mainService', 'commonService', 'modalService', '$uibModalInstance', 'toastService', 'params']
    constructor($filter, _mS, _commonSvc, _modalSvc, $uibModalInstance, _tS, _params){        
        this.$filter = $filter;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._modalSvc = _modalSvc;
        this.$uibModalInstance = $uibModalInstance;
        this._tS = _tS;
        this._params = _params;
        this.totalArqueo = 0;     
        
        //Filtro 
        this.dataSearch = {};
        this.dataSearch.idCaja = this._params.idCaja;
        this.dataSearch.checkBoxDefault = true;
    }

    $onInit(){
        if(this._params){
            this.getMovimientosCaja();
        }
       
        this.$uibModalInstance.rendered.then(()=>{            
            this.someCondition = true
        })
    }

    getMovimientosCaja(){
        try {
            showLoader();
            this._mS.getData('get', '/ControlCaja/Get?json=' + JSON.stringify(this.dataSearch)).then(response => {               
                if(response.code==="0"){ 
                    hideLoader();
                    this._tS.toastr('warning', response.message, response.titleSms);
                }
                if(response.code==="1"){
                    this.movimientosCaja = JSON.parse(response.payload) || []; 
                    this.cloneMovimientosCaja = JSON.parse(JSON.stringify(this.movimientosCaja));
                    hideLoader();
                }
            })
        } catch (error) {
            hideLoader();
            console.error(error)
        }        
    }

    theURLTableMovimientoCaja(){
        return  '/Home/RenderView?name=' + 'Caja/_mdTableMovimientoCaja.cshtml';        
    }


    openModalFiltro(){
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalFiltroMovimientoCajaCtrl,
            template: 'Caja/_ModalFiltroMovimientoCaja.cshtml',
            size: 'md',
            params: this.dataSearch
        })
        
        modalRef.result.then(response=>{            
            this.dataSearch = response;
            if(typeof response==='object' && response.isSearch){                
               this.getMovimientosCaja();
            }
        })
    }


    async openModalCierreCaja(item){ 
        item.idCaja = this._params.idCaja;    
           
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalCierreCajaCtrl,
            template: 'Caja/_ModalCierreCaja.cshtml',
            size: 'lg',
            params: item
        })
        
        modalRef.result.then(result=>{
            if(typeof result==='object'){
                this.isReloadCaja = true; 
               this.getMovimientosCaja();
            }
        })
    }

    searchFilterLocal(){
        let movimientosCaja = JSON.parse(JSON.stringify(this.cloneMovimientosCaja));
        this.movimientosCaja =  this.$filter("filter")(movimientosCaja, this.dataSearch.bySearch);
    }

    reloadMovimientoCaja(){
        this.dataSearch = {};
        this.dataSearch.idCaja = this._params.idCaja;
        this.getMovimientosCaja();
    }

    
    getReport(idControlCaja) {       
        let dataParms = {
            idControlCaja,            
        }
        const parameters = {
            reportParams: JSON.stringify({
                codigo: 'RCC', 
                format: 'pdf',
                aditionalParams: []
            }),
            dataParams: JSON.stringify(dataParms),
            sendEmail:false
        }

        this._commonSvc.getReport({
            parameters,
            formatType:'pdf'
        })        
    }

    closeModal(){
        this.$uibModalInstance.close(this.isReloadCaja)
    }
}




//-------------------------Filtro de Movimiento Caja-----------------------
export class ModalFiltroMovimientoCajaCtrl{
    static $inject = ["$uibModalInstance", "commonService", "toastService", "formulario", "params"];
    constructor($uibModalInstance, _commonSvc,  _tS, _formS, _params){
        this.$uibModalInstance = $uibModalInstance;
        this._commonSvc = _commonSvc;
        this._tS = _tS;
        this._formS = _formS;
        this._params = Object.assign({}, _params);
        this.dataSearch = _params;
                
        //Filters        
        this.meses = this._formS.meses();
        this.dataSearch.mes = new Date().getMonth() + 1;

        this.estadoMovimientos = [
            {id: "0", descripcion: "CERRADO" },
            {id: "1", descripcion: "ABIERTO" },
        ]
    }

    $onInit(){   
        this._commonSvc.getGestionFinanciera().then(response=>{            
            this.estadoMovimientos = response[4]            
        })     
        if(Object.entries(this._params).length >0){
            this.dataSearch.mes = this._params.mes;
        }
    }

    onChangeFechaFiltro(){
        this.dataSearch.mes = new Date().getMonth() + 1;        
        this.getFechaInicioFinFilter()
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro AVanzado
    getFechaInicioFinFilter(){
        let { fechaInicio, fechaFin } = this._formS.getFechaInicioFinFilter(this.dataSearch.mes);
       this.dataSearch.dateStart = fechaInicio;        
       this.dataSearch.dateEnd = fechaFin;        
    }


    filtrar(){
        if(this.dataSearch.checkBoxDate){
            if(!this.dataSearch.dateStart){
                this._tS.toastr('warning', 'Seleccione la Fecha Inicio');
                return
            }

            if(!this.dataSearch.dateEnd){
                this._tS.toastr('warning', 'Seleccione la Fecha Fin');
                return
            }
        }

        if(this.dataSearch.checkBoxStatus){
            if(this.dataSearch.statusMovement===null || this.dataSearch.statusMovement===undefined || this.dataSearch.statusMovement===""){
                this._tS.toastr('warning', 'Seleccione el Estado');
                return
            }
        }

        if(this.dataSearch.checkBoxDate || this.dataSearch.checkBoxStatus){
            this.dataSearch.checkBoxDefault = false;
        }else{
            this.dataSearch.checkBoxDefault = true;
        }
        this.dataSearch.isSearch = true;
        this.$uibModalInstance.close(this.dataSearch);
    }


    closeModal(){
        this.dataSearch.isSearch = false;
        this.$uibModalInstance.close(this.dataSearch);
    }


}



/**
 * 
 * Modal Cierre Caja
 */

export class ModalCierreCajaCtrl{
    static $inject = ["$uibModalInstance", "mainService", "params"]
    constructor($uibModalInstance, _mS, _params){
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._params = _params;

    }

    $onInit(){
        this._mS.getData('get','/DetalleArqueoCaja/ListDetalleArqueoCaja').then(response => {
            if (response.id ==="0") {
                Swal.fire({                        
                    icon:'warning',
                    title:`<small>${response.titleSms}</small>`,                        
                    html:`<small>${response.message}</small>`
                })                                    
            }
            if (response.id ==="1") {
                this.arqueos = response.data;                                                
            }
        })
    }

    calcularCantidadMoneda() {            
        this.totalArqueo =  this.arqueos.map(val=>val.valorMoneda * Number(val.detalleArqueoCaja.cantidad))
                                            .reduce((acc, curr)=>acc + curr, 0);                                                          
    }

    

    async guardarCierreCaja(){
        if(this.arqueos.some(val=>isNaN(val.detalleArqueoCaja.cantidad))){
            Swal.fire({
                icon:'warning',
                title:'<small>Cierre de Caja</small>',
                html:`<small>Ingrese los valores validos</small>`
            });                
            return
        }

        let {isConfirmed} = await Swal.fire({
            icon: 'warning',                
            text: 'Esta seguro/a de guardar los valores ahora?',
            showDenyButton: true,
            confirmButtonText: `Si, guardar`,
            denyButtonText: `No, cancelar`,
            allowOutsideClick: false
        })
        
        if(isConfirmed){
            const data ={
                totalArqueo: JSON.stringify(this.totalArqueo),
                detalle: JSON.stringify(this.arqueos.map(item=>(item.detalleArqueoCaja))),
                idControlCaja: this._params.idControlCaja
            }                      

            this._mS.getData('put','/ControlCaja/Update?id=' + data.idControlCaja, data).then(response=>{                
                if(response.code==="0"){
                    toastr.warning(response.message, response.titleSms);
                    return
                }
                if(response.code==="1"){
                    toastr.success(response.message, response.titleSms);
                    this.$uibModalInstance.close(response);
                }

            })

        }
    }

    closeModal(){
        this.$uibModalInstance.close();
    }

}

