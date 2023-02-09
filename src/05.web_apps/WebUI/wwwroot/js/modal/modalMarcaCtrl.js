
export class ModalMarcaCtrl {
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
        const tituloModal = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar'
        const URL = this.tipoRegistro == 1 ? '/Marca/Post' : '/Marca/Put?id=' + this.data.idMarca;
        const method = this.tipoRegistro == 1 ? 'Post' : 'Put';

        if (this._form.campo(this.data.descripcion)) {
            toastr.warning('Ingrese la Descripción', tituloModal);
            return;
        }

        this._mS.getData(method, URL, this.data).then((response) => {
            if (response.code == "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            if (response.code == "1") {
                toastr.success(response.message, response.titleSms);
                this.$uibModalInstance.close(response)
            }
        })
    }

    closeModal() {
        this.$uibModalInstance.close();
    }

}