export class ModalModeloCtrl {
    static get $inject() {
        return ['mainService', '$uibModalInstance', 'modalService', 'nombreModal', 'params'];
    }

    constructor(_mS, $uibModalInstance, _modalSvc, _nombreModal, _params) {
        this._mS = _mS;
        this.$uibModalInstance = $uibModalInstance;
        this._modalSvc = _modalSvc;
        this._nombreModal = _nombreModal;
        this._params = _params;
        this.tipoRegistro = 1;
        this.data = {};
        this.modelo = {};
        this.marca = {};

    }

    $onInit() {
        this.getAllMarca();

        if (this._params && this._params.idModelo > 0) {
            this.tipoRegistro = 2;
            this.marca = this._params;
            this.data = this._params;
            this.showStatus = !this._params.estado;
        }

    }

    getAllMarca() {
        this._mS.getData('get', '/Marca/ListMarca').then(response => {
            if (response.id == "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            this.marcas = response.data;
        })
    }

    async openModalMarca() {
        const { marca } = this._nombreModal;
        const { ModalMarcaCtrl } = await import(`./../modal/${marca.MODAL_CTRL}`);
        const uibModalRef = this._modalSvc.openModalSecond(ModalMarcaCtrl, `Marca/${marca.MODAL_CSHTML}`, 'md')
        uibModalRef.result.then(result => {
            if (typeof result === 'object' && result.id === '1') {
                this.getAllMarca();
            }
        })
    }

    saveAndUpdate() {
        const tituloToastr = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar'
        const URL = this.tipoRegistro == 1 ? '/Modelo/Post' : '/Modelo/Put?id=' + this.data.idModelo;
        const method = this.tipoRegistro == 1 ? 'post' : 'put';

        if (["", null, undefined].includes(this.data.descripcion)) {
            toastr.warning('Ingrese la descripciòn', tituloToastr);
            return;
        }
        if (this.marca == null) this.marca = { idMarca: 0 };
        this.data.idMarca = this.marca.idMarca

        this._mS.getData(method,URL, this.data).then( response  => {

            if (response.code == "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            if (response.code == "1") {
                toastr.success(response.message, response.titleSms);
                this.$uibModalInstance.close(response);
            }
        })
    }

    closeModal() {
        this.$uibModalInstance.close();
    }

}