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
        
        const self = this
        
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


        let thisMoment = moment();
        let endOfMonth = moment(thisMoment).endOf('month');
        let startOfMonth = moment(thisMoment).startOf('month');
        //https://www.daterangepicker.com/
        this.dateRangePicker = {
            date: { startDate: startOfMonth, endDate: endOfMonth },
            picker: null,
            options: {
                pickerClasses: 'custom-display', //angular-daterangepicker extra
                buttonClasses: 'btn',
                applyButtonClasses: 'btn-success',
                cancelButtonClasses: 'btn-danger',
                locale: {
                    applyLabel: "Aplicar",
                    cancelLabel: 'Cancelar',
                    customRangeLabel: 'Rango Personalizado',
                    separator: ' - ',
                    format: "YYYY-MM-DD", //will give you 2017-01-06
                    //format: "D-MMM-YY", //will give you 6-Jan-17
                    //format: "D-MMMM-YY", //will give you 6-January-17
                },
                ranges: {
                    'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                    'Ultimos 30 Días': [moment().subtract(29, 'days'), moment()]
                },
                eventHandlers: {
                    'apply.daterangepicker': function (event, picker) {
                        
                        self.getMovimientosCaja()
                        console.log('applied')
                    }
                }
            }
        }
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
     
            // this.dataSearch.dateStart = this.dateRangePicker.date.startDate
            // this.dataSearch.dateEnd = this.dateRangePicker.date.endDate
            this.movimientosCaja = [];
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
            this.movimientosCaja = [];
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
        this._commonSvc.getGestionFinanciera({gestion:true}).then(response=>{            
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
    static $inject = ["$uibModalInstance", "mainService", "params", 'decodeToken']
    constructor($uibModalInstance, _mS, _params, decodeToken){
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._params = _params;

        this.decodeToken = decodeToken;

        this.totalArqueo = 0;

    }

    $onInit(){
        console.log(this)
        this._mS.getData('get', '/ControlCaja/GetArqueoCaja?json=' + JSON.stringify({idUsuarioRol: 0})).then(resopnse=>{
            console.log(resopnse)
            if(resopnse.code==="0"){
                console.log(resopnse)
            }
            if(resopnse.code==="1"){
                this.arqueos = JSON.parse(resopnse.payload) || []
                console.log(this.arqueos)
            }
        })

        // let tempArqueos = [{"idMoneda":1,"cantidad":0,"valor":100.00,"descripcionMonedad":"Billetes de $100"},{"idMoneda":2,"cantidad":0,"valor":50.00,"descripcionMonedad":"Billetes de $50"},{"idMoneda":3,"cantidad":0,"valor":20.00,"descripcionMonedad":"Billetes de $20"},{"idMoneda":4,"cantidad":0,"valor":10.00,"descripcionMonedad":"Billetes de $10"},{"idMoneda":5,"cantidad":0,"valor":5.00,"descripcionMonedad":"Billetes de $5"},{"idMoneda":6,"cantidad":0,"valor":1.00,"descripcionMonedad":"Billetes de $1"},{"idMoneda":7,"cantidad":0,"valor":1.00,"descripcionMonedad":"Monedas de $1"},{"idMoneda":8,"cantidad":0,"valor":0.50,"descripcionMonedad":"Monedas de ¢0.50"},{"idMoneda":9,"cantidad":0,"valor":0.25,"descripcionMonedad":"Monedas de ¢0.25"},{"idMoneda":10,"cantidad":0,"valor":0.10,"descripcionMonedad":"Monedas de ¢0.10"},{"idMoneda":11,"cantidad":0,"valor":0.05,"descripcionMonedad":"Monedas de ¢0.05"},{"idMoneda":12,"cantidad":0,"valor":0.01,"descripcionMonedad":"Monedas de ¢0.01"}]

        // this.arqueos = tempArqueos.map(item=>{
        //     let obj = {
        //         detalleArqueoCaja: {
        //             idMoneda: item.idMoneda,
        //             cantidad: item.cantidad
        //         },
        //         descripcionMoneda: item.descripcionMonedad,
        //         valorMoneda: item.valor            
        //     }            
        //     return obj;
        // })
        
    }

    calcularCantidadMoneda() {            
        this.totalArqueo =  this.arqueos.map(val=>val.valor * Number(val.cantidad))
                                            .reduce((acc, curr)=>acc + curr, 0);                                                          
    }

    

    async guardarCierreCaja(){
        if(this.arqueos.some(val=>isNaN(val.cantidad))){
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
                spParams: JSON.stringify({
                    totalArqueo: JSON.stringify(this.totalArqueo),
                    detalle: JSON.stringify(this.arqueos),
                    idUsuarioRol: Number(this.decodeToken.idUsuarioRol),          
                })
            }                      

            this._mS.getData('put','/ControlCaja/Update?id=' + this._params.idControlCaja, data).then(response=>{                
                if(response.code==="0"){
                    toastr.warning(response.message, response.titleSms);
                    return
                }
                if(response.code==="1"){
                    let dataMail = JSON.parse(response.payload) || {};
                    toastr.success(response.message, response.titleSms);
                    
                    console.log(!dataMail.receptor)
                    if(dataMail.receptor){
                        this.sendEmail(dataMail)
                    }

                   
                    // this.$uibModalInstance.close(response);
                }

            })

        }
    }


    sendEmail(dataMail){
        const data = {
            subject: 'Movimiento Caja',
            idUsuarioRol: this.decodeToken.idUsuarioRol,
            receptor: dataMail.receptor,  
            params: {                                    
                hasFile: true, 
                isReport: "SI", 
                reportParams: {
                    codEstab: dataMail.codEstab, 
                    codigo: "RCC", 
                    format: "pdf"
                }, 
                spParams: {
                    id: this._params.idControlCaja
                }
            }
        }
        this._mS.getData('post',  '/Notificacion/Post?json='  + JSON.stringify(data)).then(response=>{
            console.log(response);
            // if(response.code==="0"){
            //     this._form.sweetAlert('warning', response.message, response.titleSms);                
            // }
            // if(response.code==="1"){
            //     this._form.sweetAlert('success', response.message, response.titleSms, 1000);
            //     this.$uibModalInstance.close(response)
            // }
        })
    }

    // sendEmail(){
    //     try {
            
    //     } catch (error) {
            
    //     }        
    // }

    closeModal(){
        this.$uibModalInstance.close();
    }

}

