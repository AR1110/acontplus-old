


export class SendMailCtrl{
    static $inject = ['$scope', '$localStorage', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params', 'jwtHelper']

    /**
     * 
     * @param {$scope} $scope 
     * @param {$uibModalInstance} $uibModalInstance  
     * @param {service} _mS 
     * @param {service} _commonSvc 
     * @param {service} _tS 
     * @param {service} _form 
     * @param {service} _params 
     */
    constructor($scope, $localStorage, $uibModalInstance, _mS, _commonSvc, _tS, _form, _params, jwtHelper){
        this.$scope = $scope;
       
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._tS = _tS;
        this._form = _form;
        this.data = _params || {};

        this.jwtHelper = jwtHelper;
        let authData = $localStorage.currentUser
        let decodedJwt = jwtHelper.decodeToken(authData.token);
        this.idUsuarioRol = Number(decodedJwt.idUsuarioRol)

        this.correos = [];
        console.log(this.data)
        this.TYPE_NOTIFICATION = this.data.TYPE_NOTIFICATION 

    }

    $onInit(){
        console.log(this)
        if(this.data.hasOwnProperty("correo") && this.data.correo){
            if(this.data.correo.includes(',')){
                this.correos = this.data.correo.split(',');
                return
            }
            if(this.data.correo.includes(';')){
                this.correos = this.data.correo.split(';');
                return
            }
            this.correos = this.data.correo.split(';');            
        }
    }

    onKeyupEmail(item){
        let textChip = item.target.value || "";
        textChip = this._form.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();                
    }
    
    validarEmail(valor) {
        return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
    }

    saveResendEmail(){
        try {
            if(this.correos.length===0){
                this._tS.toastr('warning', 'Ingrese al menos un correo del destinatorio', 'Reenvío de Correo');
                return
            }
    
    
            if(!this.correos.every(item=>this.validarEmail(item))){
                this._tS.toastr('warning', 'Verifique que los correos del destinatario esten ingresado correctamente', 'Reenvío de Correo');
                return
            }
    
            this._form.showLoaderSendEmail();
            let url = '';
            let data = {}
            


            switch (this.TYPE_NOTIFICATION) {
                case "N":
                    url = '/Notificacion/Post?json='                                       
                    data = {
                        subject: this.data.subject,
                        params: this.data.json,                                                
                        idUsuarioRol: this.idUsuarioRol,
                        receptor: this.correos.join(';')
                    }

                    break;
            
                default:
                    url = '/NotificacionTributaria/Post?json='
                    data = {
                        codDoc: this.data.codDoc,
                        codEstado: this.data.codEstado,
                        idDocumento: this.data.idDocumento,
                        idDocumentoElectronico: this.data.idDocumentoElectronico,                            
                        receptor: this.correos.join(';')
                    }
                    break;
            }

            
            
            this._mS.getData('post', url + JSON.stringify(data)).then(response=>{  
                          
                if(response.code==="0"){
                    this._form.sweetAlert('warning', response.message, response.titleSms);                
                }
                if(response.code==="1"){
                    this._form.sweetAlert('success', response.message, response.titleSms, 1000);
                    response.isComplete = true;
                    this.$uibModalInstance.close(response)
                }
                
            }).catch(error=>{
                Swal.close();
                console.log(error)                
            })           
        } catch (error) {
            Swal.close();
            console.log(error)
        }
        
    }

    closeModal(){
        this.$uibModalInstance.close();
    }
}



export class StatusEmail{
    static $inject = ['$scope', '$uibModalInstance', 'modalService', 'nombreModal', 'mainService', 'commonService', 'toastService', 'formulario', 'params']

    /**
     * 
     * @param {$scope} $scope 
     * @param {$uibModalInstance} $uibModalInstance  
     * @param {service} _mS 
     * @param {service} _commonSvc 
     * @param {service} _tS 
     * @param {service} _form 
     * @param {service} _params 
     */
    constructor($scope, $uibModalInstance, _modalSvc, _nombreModalConst, _mS, _commonSvc, _tS, _form, _params){
        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._tS = _tS;
        this._form = _form;
        this.data = _params;      
        this.estadoCorreos = [];

    }

    $onInit(){
        if(this.data.hasOwnProperty('comprobantes')){
            this.showStatusMailMasive = true;
            this.estadoCorreos = this.data.comprobantes.map(item=>{
                const data = {
                    idDocumentoElectronico: item.idDocumentoElectronico
                }
                item.statusEmail = [];
                item.isStatusMail = true;
                this._mS.getData('get', '/NotificacionTributaria/Get?json=' + JSON.stringify(data)).then(
                    response=>{
                        const tempEmails =  JSON.parse(response.payload) || [];
                        item.statusEmail = tempEmails.map(item=>{
                            
                            item.correos = item.receptor?item.receptor.split(','):[]
                            return item;
                        })
                    }
                ) 
                return item;           
            })
            
            return           
        }

        this.showStatusMailByComp = true;
        const data = {
            idDocumentoElectronico: this.data.idDocumentoElectronico
        }
        this._mS.getData('get', '/NotificacionTributaria/Get?json=' + JSON.stringify(data)).then(
            response=>{                
                if(response.code==='0'){
                    this._tS.toastr('warning', response.message)
                }
                if(response.code==='1'){
                    const tempCorreos = JSON.parse(response.payload) || [];
                    this.estadoCorreos = tempCorreos.map(item=>{
                        item.correos = item.receptor?item.receptor.split(','):[]
                        return item;                        
                    })          
                }
            }
        )
    }


    showError(item){
        Swal.fire({
            icon:'info',
            html:`<small>${item.msgError}</small>`,            
        })
    }

    async sendMail(item){
        try {
            
            this.data.correo = item.receptor;
            const {MODAL_SEND_MAIL_CTRL, MODAL_SEND_MAIL_CSHTML} = this._nombreModalConst.common;
            const {SendMailCtrl} = await import('./../../modal/' + MODAL_SEND_MAIL_CTRL);
            this._modalSvc.openModalCustom({
                controller: SendMailCtrl,
                template: 'Shared/' + MODAL_SEND_MAIL_CSHTML,
                size: 'md',
                params: this.data
            })
        } catch (error) {
            console.error(error)
        }      
    }

    closeModal(){
        this.$uibModalInstance.close();
    }
}
