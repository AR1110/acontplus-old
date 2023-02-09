export class ModalEmpresaCtrl{
    static $inject = ['$http', '$uibModalInstance', 'toastService', 'formulario', 'params'];
    constructor($http, $uibModalInstance, _toastr, _form, _params){
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._toastr           = _toastr;
        this._form             = _form;
        this._params           = _params;
        this.tipoRegistro      = 1;

        this.data              = {};
    }

    $onInit(){
        if(this._params){
            this.tipoRegistro = 2;
            this.data = this._params;
            
        }
    }

    validarRuc(){
        if (!!this.data.ruc) {
            this.typeNotify = 'is-invalid';
            this.message = 'Número de RUC debe tener 13 dígitos';
            this.id = 0;

            if (this.data.ruc.length == 13) {
                this.$http.post('/ValidarDatos/VerificarDatos', { tipoValidacion: 'IDENTI', numeroIdentificacion: this.data.ruc }).then(({data:response}) => {
                    this.formValid = response.id;
                    this.typeNotify = response.typeNotify;
                    this.message = response.message;
                })
            }
        };
    }

    copiarRazonSocial(){        
        if(!this._form.campo(this.data.razonSocial)){
            this.data.nombreComercial = this.data.razonSocial;
        }
    }

    saveAndUpdate(){
        if(this._form.campo(this.data.ruc)){
            this._toastr.toastr('warning', 'Ingrese Número de RUC');
            return
        }

        if($("#ruc").hasClass('is-invalid')){
            this._toastr.toastr('warning', 'Ingrese Número de Correctamente');
            return
        }

        if(this.data.ruc.toString().length!==13){
            this._toastr.toastr('warning', 'Número de Ruc tiene que tener 13 dígitos');
            return
        }

        if(this._form.campo(this.data.razonSocial)){
            this._toastr.toastr('warning', 'Ingrese campo Razon Social');
            return
        }

        if(this._form.campo(this.data.nombreComercial)){
            this._toastr.toastr('warning', 'Ingrese campo Nombre Comercia');
            return
        }

        const URL = this.tipoRegistro ===1?'/Empresa/Post':'/Empresa/Put?id=' + this.data.idEmpresa;
        showLoader();
        this.$http.post(URL, this.data).then(({data:response})=>{
            if(response.id==="0"){
                hideLoader();
                this._toastr.toastr('warning', response.message);
                return
            }
            if(response.id==="1"){
                hideLoader();
                this._toastr.toastr('success', response.message, response.titleSms);
                this.$uibModalInstance.close(response);
            }
        })



    }

    closeModal(){
        this.$uibModalInstance.close();
    }
}
