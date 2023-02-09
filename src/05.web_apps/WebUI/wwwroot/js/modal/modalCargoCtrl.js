export class ModalCargoCtrl{
    static $inject = ['$http', '$uibModalInstance', 'toastService', 'formulario', 'params'];
    constructor($http, $uibModalInstance, _toastr, _form, _params){
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;        
        this._toastr   = _toastr;
        this._form     = _form;   
        this._params   = _params;

        this.tipoRegistro = 1;
        this.data      = {};
    }

    $onInit(){
        if(this._params){
            this.tipoRegistro = 2;
            this.data = this._params;
        }
    }

    obtenerCodigo(){
        if(!this._form.campo(this.data.descripcion) && this.tipoRegistro===1){
            this.data.codigo = this._form.obtenerTresLetras(this.data.descripcion)
        }
    }

    saveAndUpdate(){
        const titulo = this.tipoRegistro === 1? 'Guardar':'Actualizar';
        if(this._form.campo(this.data.descripcion)){
            this._toastr.toastr('warning', 'Ingrese la Descripción', titulo);
            return
        }

        if(this._form.campo(this.data.codigo)){
            this._toastr.toastr('warning', 'Ingrese el Códgio', titulo);
            return
        }

        const URL = this.tipoRegistro ===1?'/Cargo/Post':'/Cargo/Put?id='+this.data.idCargo;

        const response = this.tipoRegistro ===1? this.$http.post(URL, this.data) : this.$http.put(URL, this.data);

        response.then(({data:response})=>{
            if(response.id==="0"){
                this._toastr.toastr('warning', response.message, response.titleSms);
                return
            }

            if(response.id==="1"){
                this._toastr.toastr('success', response.message, response.titleSms);
                this.$uibModalInstance.close(response)
            }

        })


    }

    closeModal(){
        this.$uibModalInstance.close();
    }

}