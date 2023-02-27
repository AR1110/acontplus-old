

export class ModalVehiculoCtrl{
    static $inject = ['$http', '$uibModalInstance', 'formulario', 'params'];

    constructor($http, $uibModalInstance, _form, _params){
        this.$http             = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._form             = _form;
        this._params           = _params;

        this.tipoRegistro      = 1;
        this.data              = {};        
    }

    $onInit(){
        
        if(this._params){
            this.tipoRegistro=2;
            this.data = this._params;
        }

    }

    saveUpdate() {        
        let tituloToast = this.tipoRegistro == 1 ? 'Guardar' : 'Actualizar';
        let posicionToast = "toast-top-right";
        if (this._form.campo(this.data.placa)) {
           toastr.warning('Ingrese la Placa', tituloToast, posicionToast);
            return
        }
        if (this._form.campo(this.data.marca)) {
           toastr.warning('Ingrese la Marca', tituloToast, posicionToast);
            return
        }
        if (this._form.campo(this.data.modelo)) {
           toastr.warning('Ingrese el Modelo', tituloToast, posicionToast);
            return
        }

        const url = this.tipoRegistro == 1 ? '/Vehiculo/Post' : '/Vehiculo/Put?id=' + this.data.idVehiculo;
        this.$http.post(url, this.data).then(({data:response}) => {
            if (response.id === "0" || response.code === "0") {
               toastr.warning(response.message, response.titleSms, posicionToast);
                return
            }
            if (response.id === "1" || response.code === "1") {
                toastr.success(response.message, response.titleSms, posicionToast);                   
                this.$uibModalInstance.close(response)                
            }
        });
    }

    closeModal(){
        this.$uibModalInstance.close();
    }



}