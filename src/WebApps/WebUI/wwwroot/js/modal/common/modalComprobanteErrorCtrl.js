

export class ComprobanteErrorCtrl {
    static $inject = ['$scope', 'mainService', 'commonService', '$uibModalInstance', 'params', 'toastService'];
    constructor($scope, _mS, _commonSvc, $uibModalInstance, _params, _ts) {
        this.$scope = $scope;
        this._mS = _mS;
        this.$uibModalInstance = $uibModalInstance;
        this._params = _params;
        this._ts = _ts;
        this.formatDate = 'MM/dd/yyyy h:mma';
    }

    $onInit() {
        this._mS.getData('get', 'FactElect/DocumentoElectronicoError/' + this._params.idDocumentoElectronico).then(response => {
            if (response.code === '1') {
                const { errors } = JSON.parse(response.payload) || []
                this.erroresComprobante = errors;
            }
        }).catch(error => {
            if (error.data) {
                this._ts.toastr('error', error.data.message, error.status)
            }
            console.log(error)
        })
    }


    showInfoAdicional(item) {
        if (!item.informacionAdicional) {
            this._ts.toastr('warning', "No existe info adicional", "Aviso!")
            return;
        }
        Swal.fire({
            icon: 'info',
            html: `<small>${item.informacionAdicional}</small>`,
        })
    }


    closeModal() {
        this.$uibModalInstance.close();
    }
}