export class ModalCategoriaCompraCtrl{
    static $inject = ['$http', '$uibModalInstance', 'nombreModal', 'formulario', 'toastService', 'params'];
    constructor($http, $uibModalInstance, _nombreModal, _form, _toastr, _params){
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._nombreModal = _nombreModal;
        this._form = _form;
        this._toastr  = _toastr;
        this._params = _params;
        this.tipoRegistro = 1;
        this.data = {};
    }

    $onInit(){
        if(this._params)        {
            this.tipoRegistro=2;
            this.data = Object.assign({}, this._params)
        }
    }

    obtenerTresLetras() {
        if (this.data.descripcion !== undefined && this.tipoRegistro == 1) {            
            this.data.codigo = this._form.obtenerTresLetras(this.data.descripcion);
        }
    }

    saveUpdate() {
        if (this._form.campo(this.data.descripcion)) {
            this._toastr.toastr('warning', 'Ingrese la Descripción');
            return;
        }
        if (this._form.campo(this.data.codigo)) {
            this._toastr.toastr('warning', 'Ingrese el Código');
            return;
        }
        let url = this.tipoRegistro == 1 ? '/CategoriaCompra/Post' : '/CategoriaCompra/Put';
        
        this.$http.post(url, this.data).then(({data:response}) => {            
            if (response.id == "0") {
                this._toastr.toastr('warning', response.message, response.titleSms);
                return;
            }
            if (response.id == 1) {
                this._toastr.toastr('success', response.message, response.titleSms);
                this.$uibModalInstance.close(response);
                return
            }
        })
    }

    closeModal(){
        this.$uibModalInstance.close();
    }


}