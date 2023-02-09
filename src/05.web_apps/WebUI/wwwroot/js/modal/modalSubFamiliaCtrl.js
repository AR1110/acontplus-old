export class ModalSubFamiliaCtrl {
    static get $inject() {
        return ['mainService', '$uibModalInstance', 'modalService', 'nombreModal', 'formulario', 'params']
    }

    constructor(_mS, $uibModalInstance, _modalSvc, _nombreModal, _form, _params) {
        this._mS = _mS;
        this.$uibModalInstance = $uibModalInstance;
        this._modalSvc = _modalSvc
        this._nombreModal = _nombreModal;
        this._form = _form;
        this._params = _params;
        this.tipoRegistro = 1;
        this.familia = {};
        this.data = {};
    }

    $onInit() {
        this.getSubFamilias();

        if (this._params) {
            this.tipoRegistro = 2;
            this.familia = this._params;
            this.data = this._params;
            this.showStatus = !this._params.estado;
        }
    }

    getSubFamilias() {
        this._mS.getData('get', '/Familia/GetAll').then((response) => {
            if (response.id == "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            this.familias = response.data;
        });
    }

    async openModalFamilia() {
        const { familia } = this._nombreModal;
        const { ModalFamiliaCtrl } = await import(`./../modal/${familia.MODAL_FAMILIA_CTRL}`);
        const modalDialogRef = this._modalSvc.openModalSecond(ModalFamiliaCtrl, `Familia/${familia.MODAL_FAMILIA_CSHTML}`, 'md');
        modalDialogRef.result.then(result => {
            if (typeof result === 'object') {
                this.getSubFamilias();
            }
        });
    }

    generateCodigo() {
        if (!this._form.campo(this.data.descripcion) && this.tipoRegistro === 1) {
            this.data.siglas = this._form.obtenerTresLetras(this.data.descripcion)
        }
    }

    saveAndUpdate() {
        const tituloModal = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar'
        const url = this.tipoRegistro == 1 ? '/SubFamilia/Post' : '/SubFamilia/Put?id=' + this.data.idSubFamilia;
        const method = this.tipoRegistro == 1 ? 'post' : 'put';

        if (this._form.campo(this.data.descripcion)) {
            toastr.warning('Por favor, ingrese la Descripción', tituloModal);
            return;
        }
        if ([null, undefined, ""].includes(this.data.montoObjetivo)) {
            toastr.warning('Por favor, ingrese el Monto Objetivo', tituloModal);
            return;
        }

        if (this._form.campo(this.data.siglas)) {
            toastr.warning('Por favor, ingrese la Sigla', tituloModal);
            return;
        }

        if (this.familia == null) this.familia = { idFamilia: 0 };
        this.data.idFamilia = this.familia.idFamilia

        this._mS.getData(method, url, this.data).then((response) => {
            if (response.code == "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            if (response.code == "1") {
                this.$uibModalInstance.close(response)
                toastr.success(response.message, response.titleSms);
            }
        })
    }

    closeModal() {
        this.$uibModalInstance.close();
    }
}