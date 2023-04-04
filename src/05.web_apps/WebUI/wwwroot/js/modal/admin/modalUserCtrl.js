

export class ModalUserCtrl{
    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'params', 'decodeToken']
    constructor($scope, $uibModalInstance, _mS, _commonSvc, _tS, _params, decodeToken){        
        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._tS = _tS;
        this._params = _params;
        this.tipoRegistro = this._params.tipoRegistro;

        this.data = {};

        this.$scope.$watchGroup([()=>this.data.contrasena, ()=>this.data.contrasena1], pass=>{            
            if (pass[1] && this.tipoRegistro ==='N') {
                if (pass[1] === pass[0]) {
                    this.classValidPassword = 'is-valid';                    
                } else {
                    this.classValidPassword = 'is-invalid';                    
                }
            }
        })

        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    
    }

    $onInit(){
        this._mS.getData('get','/Politica/GetAll').then(response=>{
            this.politicas = response.data;            
        })    
        if(this.tipoRegistro==='E')    {
            this.data = this._params.data;
        }
    }

    verPassword(inputPass){
        let input = null;
        if(inputPass===1){
            input = document.getElementById('passwordUno');
        }else{
            input = document.getElementById('passwordDos');
        }
        if(input.type==='password'){
            input.type = 'text';
        }else{
            input.type = 'password';
        }
    }

    onSave(){
        
        this.tituloModal = 'Guardar';
            

        if (!this.data.nroIdentificacion) {
            this._tS.toastr('warning', 'Ingrese el Nro. Identificación', this.tituloModal);
            return;
        }

        if (!this.data.nombres) {
            this._tS.toastr('warning', 'Ingrese el nombre', this.tituloModal);
            return;
        }

        if (!this.data.apellidos) {
            this._tS.toastr('warning', 'Ingrese el apellido', this.tituloModal);
            return;
        }

        if (!this.data.correo) {
            this._tS.toastr('warning', 'Ingrese el correo Electrónico', this.tituloModal);
            return;
        }

        if($(".correo").hasClass('is-invalid')){
            this._tS.toastr('warning', 'Ingrese un Correo válido', this.tituloModal);
            return
        } 
        if (!this.data.contrasena) {
            this._tS.toastr('warning', 'Ingrese la contraseña', this.tituloModal);
            return;
        }
        if (this.data.contrasena !== this.data.contrasena1) {
            this._tS.toastr('warning', 'Las Contraseñas No coinciden', this.tituloModal);
            return;
        }
       
        if (!this.data.idPolitica) {
            this._tS.toastr('warning', 'Seleccione la Politica', this.tituloModal);
            return;
        }

        this.data.nombreCompleto = `${this.data.nombres} ${this.data.apellidos}`
        this.data.idRol =  this.idUsuarioRol,
        this.data.codRol = 'AD'; //REVISAR POSTERIORMENTE
        let data = {
            nroIdentificacion: this.data.nroIdentificacion,
            correo: this.data.correo,
            nombreUsuario: this.data.nombreUsuario,
            contrasena: this.data.contrasena,
            nombreCompleto: this.data.nombreCompleto,
            idPolitica: this.data.idPolitica,
            idRol: this.data.idRol,
            codRol: this.data.codRol
        }
        
        this._commonSvc.getDataApi({
            method: 'post',
            url: `apiCliente/Usuario/Post/${JSON.stringify(data)}`,
            typeUrl: 1,            
        }).then(response=>{                      
            if (response.id == "0") {
                this._tS.toastr('warning', response.message, response.titleSms);                    
            }
            if (response.id == "1") {
                this._tS.toastr('success', response.message, response.titleSms);                                 
                this.$uibModalInstance.close(response)
            }
        })
    }


    onUpdate(){
        try {
            let tituloModal = 'Actualizar';

            if (!this.data.nroIdentificacion) {
                this._tS.toastr('warning', 'Ingrese el usuario', tituloModal);
                return;
            };
            
            if (!this.data.nombreCompleto) {
                this._tS.toastr('warning', 'Ingrese el Nombre Completo', tituloModal);
                return;
            }

            if (!this.data.correo) {
                this._tS.toastr('warning', 'Ingrese el correo Electrónico', tituloModal);
                return;
            }

            if($(".correo").hasClass('is-invalid')){
                this._tS.toastr('warning', 'Ingrese un Correo válido', tituloModal);
                return
            } 

            this._commonSvc.getDataApi({
                method:'put',
                url: `apiCliente/Usuario/Put/${this.data.idUsuario}/${JSON.stringify(this.data)}`,
                typeUrl: 1
            }).then(response => {
                if (response.id == "0") {
                    this._tS.toastr('warning', response.message, response.titleSms);                    
                }
                if (response.id == "1") {
                    this._tS.toastr('success', response.message, response.titleSms);
                    this.$uibModalInstance.close(response)                         
                }
            }).catch(error=>{                
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }


    closeModal(){
        this.$uibModalInstance.close();
    }
}



export class ModalUserCompanyCtrl{
    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'params', 'decodeToken'];
    constructor($scope, $uibModalInstance, _mS, _commonSvc,  _modalSvc, _nombreModalConst, _tS, _params, decodeToken){
        this.$scope          = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._mS             = _mS;
        this._commonSvc      = _commonSvc;        
        this._modalSvc         = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS             = _tS;
        this._params           = _params;       
        this.establecimientos = [];  
        
        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    }

    $onInit(){
        this._commonSvc.getDataApi({
            method:'get',
            url: `apiCliente/UsuarioRol/GetId/${this._params.idUsuario}`,
            typeUrl: 1
        }).then(response=>{
            this.usuarioRoles = JSON.parse(response.data) || [];  
            this.$scope.$apply();
        })               
    }


    /**
     * ----------------------------------------------START ESTAB---------------------------
     * Asignacion de Establecimiento
     * @param {object} item 
     */
    async getEstablecimientos(item){
        try {
            showLoader();
            this.dataEntidadRol = item;
            let json = {
                idUsuarioRol: item.idUsuarioRol,
                typeList: 1,
                idRol: this.idUsuarioRol
            }
            
            await this._mS.getData('get', '/EstabAsig/Get?json=' +JSON.stringify(json)).then(response=>{
                if(response.code==='0'){
                   console.log(response)
                }
                this.establecimientos = JSON.parse(response.payload) || [];                                                
            })            
        } catch (error) {
            console.log(error)
        }finally{            
            hideLoader();
        }        
    }    

    onChangePredeterminada(item){        
        this._mS.getData('put', '/EstabAsig/Update?id=' + item.idEstab_Asig).then(response=>{
            if(response.code==='0'){
                this._tS.toastr('warning',response.message, response.titleSms);
                this.getEstablecimientos(this.dataEntidadRol)
            }
            if(response.code==='1'){
                this._tS.toastr('success',response.message, response.titleSms);
                this.getEstablecimientos(this.dataEntidadRol)
            }            
        }).catch(error=>{
            this.getEstablecimientos(this.dataEntidadRol)
            console.log(error)
        })        


    }
    
    async asignarEstab(item){
        try {
                        
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
            
            let {isConfirmed} = await swalWithBootstrapButtons.fire({           
                html:`<small>Está seguro de ${item.estado?'Asignar':'Quitar'} este Sucursal: <b>${item.nombreComercial}</b> a Usuario: <b>${this._params.nombreCompleto}</b></small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText:`Sí, ${item.estado?'asignar':'quitar'}`,
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })

            
            if(isConfirmed){
                showLoader();
                item.idUsuarioRol = this.dataEntidadRol.idUsuarioRol;                
                await this._mS.getData('post','/EstabAsig/Insert', item).then(response=>{                    
                    if(response.code==='0'){
                        this._tS.toastr('warning', response.message, response.titleSms);
                        this.getEstablecimientos(this.dataEntidadRol)
                    }
                    if(response.code==='1'){
                        this._tS.toastr('success', response.message, response.titleSms);
                        this.getEstablecimientos(this.dataEntidadRol)
                    }
                }).catch(error=>{
                    hideLoader();
                    this.getEstablecimientos(this.dataEntidadRol)               
                    console.log(error)
                })
            }else{
                this.getEstablecimientos(this.dataEntidadRol)
            }
        } catch (error) {
           console.log(error)
        }finally{
            hideLoader();
        }
    }

    //-----------------------------------------------END ESTAB---------------------------------



    /**
     * --------------------------------------------START BDOEGA Y PUNTO DE EMISION--------------
     * Asignacion de Punto de Emision y Bodegas
     * @param {object} item 
     */


    async openModalAsignPtoEmisionAndBodega(item){
        try {
          
            showLoader();                        
            let {MODAL_CTRL, MODAL_ASIGN_PTOEMISION_BODEGA} = this._nombreModalConst.user;
            let controller = (await import('../../' + MODAL_CTRL))[MODAL_ASIGN_PTOEMISION_BODEGA['controller']];
            let template   = MODAL_ASIGN_PTOEMISION_BODEGA['template'];
            let params = {
                sucursal: item,               
            }
            this._modalSvc.openModalCustom({
                controller,
                template,
                size:'lg',
                params
            })                         
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
        
    }

    closeModal(){
        this.$uibModalInstance.close();
    }
}





export class ModalAsignPtoEmisionAndBodegaCtrl{
    static $inject = ['$scope', 'mainService', '$uibModalInstance', 'toastService', 'params']
    constructor($scope, _mS, $uibModalInstance, _tS, _params){        
        this.$scope = $scope;
        this._mS             = _mS;        
        this.$uibModalInstance = $uibModalInstance;        
        this._tS = _tS;
        let{sucursal} = _params;
        this.sucursal          = sucursal;
        this.puntosEmisiones   = []
        this.bodegas           = [];

        let json = {                     
            codEstab_Asig: this.sucursal.codEstab_Asig
        }
        this.URL_PTO_EMISION = '/PtoEmiAsig/Get?json='+ JSON.stringify(json);
        this.URL_BODEGA = '/BodegAsig/Get?json='+ JSON.stringify(json);        
    }

    async $onInit(){
        try {
            showLoader();
            let results = await Promise.all([
                this._mS.getData('get', this.URL_PTO_EMISION),        
                this._mS.getData('get', this.URL_BODEGA),                                        
            ])

            this.puntosEmisiones = JSON.parse(results[0].payload) || [];
            this.bodegas = JSON.parse(results[1].payload) || []; 
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
    }


    async getPuntoEmision(){
        let response = await this._mS.getData('get', this.URL_PTO_EMISION);
        this.puntosEmisiones =  JSON.parse(response.payload) || [];
        this.$scope.$apply(); 
    }

    async onChangePuntoEmisionPredeterminada(item){                  
        try {     
            showLoader();
            await this._mS.getData('put','/PtoEmiAsig/Update?id=' + item.idPtoEmi_Asig).then(response=>{
                if(response.code==='0'){
                    this._tS.toastr('warning', response.message, response.titleSms);
                    this.getPuntoEmision()
                }
                if(response.code==='1'){
                    this._tS.toastr('success', response.message, response.titleSms);
                    this.getPuntoEmision()
                }            
            })  
        } catch (error) {
            console.log(error)            
        }finally{
            hideLoader();
        }
    }

    async asignarPuntoEmision(item){
        try {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                icon:'warning',
                html:`<small>Está seguro de ${item.estado?'Asignar':'Quitar'} este Punto de Emisión: <b>${item.ptoEmi}</b> a Sucursal: <b>${this.sucursal.nombreComercial}</b></small>`,
                showCancelButton: true,
                confirmButtonText:`Sí, ${item.estado?'asignar':'quitar'}`,                
                cancelButtonText: 'No, cancel!',
                reverseButtons: false,
                allowOutsideClick:false
            })

            if(isConfirmed){
                item.codEstab_Asig = this.sucursal.codEstab_Asig
                await this._mS.getData('post','/PtoEmiAsig/Insert', item).then(response=>{                    
                    if(response.code==='0'){
                        this._tS.toastr('warning', response.message, response.titleSms);
                        this.getPuntoEmision()
                    }
                    if(response.code==='1'){
                        this._tS.toastr('success', response.message, response.titleSms);
                        this.getPuntoEmision()
                    }
                })
            }else{
                this.getPuntoEmision()
            }
        } catch (error) {
            console.log(error)            
        }        
    }



    async getAsignacionBodega(){
        let response = await  this._mS.getData('get', this.URL_BODEGA);
        this.bodegas = JSON.parse(response.payload) || [];          
        this.$scope.$apply();
    }

    

    async onChangePredeterminadaBodega(item){             
        try {            
            showLoader();
            await this._mS.getData('put', '/BodegAsig/Update?id=' + item.idBodeg_Asig).then(response=>{
                if(response.code==='0'){
                    this._tS.toastr('warning', response.message, response.titleSms);
                    this.getAsignacionBodega()
                }
                if(response.code==='1'){
                    this._tS.toastr('success', response.message, response.titleSms);
                    this.getAsignacionBodega()
                }            
            })
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }    
    }

    async asignarBodega(item){
        try {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                icon:'warning',
                html:`<small>Está seguro de ${item.estado?'Asignar':'Quitar'} este Bodega: <b>${item.bodega}</b> a Sucursal: <b>${this.sucursal.nombreComercial}</b></small>`,
                showCancelButton: true,
                confirmButtonText:`Sí, ${item.estado?'asignar':'quitar'}`,                
                cancelButtonText: 'No, cancel!',
                reverseButtons: false,
                allowOutsideClick:false,                
            })

            if(isConfirmed){
                showLoader();
                item.codEstab_Asig = this.sucursal.codEstab_Asig
                await this._mS.getData('post', '/BodegAsig/Insert', item).then(response=>{                    
                    if(response.code==='0'){
                        this._tS.toastr('warning', response.message, response.titleSms);
                        this.getAsignacionBodega()
                    }
                    if(response.code==='1'){
                        this._tS.toastr('success', response.message, response.titleSms);
                        this.getAsignacionBodega()
                    }
                })
            }else{
                this.getAsignacionBodega()
            }

        } catch (error) {
            console.error(error)
        } finally{
            hideLoader();
        }
    }




    closeModal(){
        this.$uibModalInstance.close();
    }


}