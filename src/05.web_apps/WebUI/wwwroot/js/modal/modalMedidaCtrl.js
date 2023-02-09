export class ModalMedidaCtrl {
    static get $inject() {
        return ['mainService', '$uibModalInstance', 'formulario', 'params'];
    }
    constructor(_mS, $uibModalInstance, _form, _params) {
        this._mS = _mS;
        this.$uibModalInstance = $uibModalInstance;
        this._form = _form;
        this._params = _params;
        this.tipoRegistro = 1;
        this.data = {};
    }

    $onInit() {
        if (this._params) {
            this.tipoRegistro = 2;
            this.data = this._params;
            this.showStatus = !this._params.estado;
        }

    }

    saveAndUpdate() {
        const tituloToast = this.tipoRegistro == 1 ? 'Guardar' : 'Actualizar';
        const url = this.tipoRegistro == 1 ? '/Medida/Post' : '/Medida/Put?id=' + this.data.idMedida;
        const method = this.tipoRegistro == 1 ? 'post' : 'put';

        if (["", null, undefined].includes(this.data.descripcion)) {
            toastr.warning('Por favor, ingrese la Descripción', tituloToast);
            return;
        }
        this._mS.getData(method, url, this.data).then((response) => {
            if (response.code == "0") {
                toastr.warning(response.message, response.titleSms);
            }
            if (response.code == "1") {
                this.$uibModalInstance.close(response);
                toastr.success(response.message, response.titleSms);
            }
        })
    }

    closeModal() {
        this.$uibModalInstance.close();
    }


}