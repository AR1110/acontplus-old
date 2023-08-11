export {
    ModalSubFamiliaCtrl
}

ModalSubFamiliaCtrl.$inject = ['$scope', '$uibModalInstance', 'familiaService', 'subFamiliaService', 'toastService', 'params']

function ModalSubFamiliaCtrl($scope, $uibModalInstance, familiaSvc, subFamiliaSvc, tS, params) {

    $scope.data = {};
    $scope.data.montoObjetivo = 0;
    $scope.selectedFile = null

    $scope.getFamilias = function () {
        try {
            familiaSvc.listForSelect({}).then(response => {
                $scope.familias = response;
            }).catch(error => {
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }
    }

    $scope.getFamilias();

    if (typeof params === 'object' && params.idSubFamilia > 0) {
        $scope.tipoRegistro = 2;
        $scope.data = Object.assign({}, params)
        $scope.showStatus = !params.estado;
    } else {
        $scope.tipoRegistro = 1;
    }

    $scope.reloadFamilia = function () {
        $scope.getFamilias();
    }


    $scope.generateCodigo = function () {
        if ($scope.data.descripcion && $scope.tipoRegistro === 1) {
            $scope.data.siglas = this.data.descripcion.substring(0, 3)
        }
    }

    $scope.saveAndUpdate = function () {
        try {
            const tituloModal = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar'

            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Ingrese la Descripción', tituloModal);
                return;
            }
            if ([null, undefined, ""].includes($scope.data.montoObjetivo)) {
                tS.toastr('warning', 'Ingrese el Monto Objetivo', tituloModal);
                return;
            }

            if (!$scope.data.siglas) {
                tS.toastr('warning', 'Ingrese la Sigla', tituloModal);
                return;
            }

            showLoader();

            console.log($scope.selectedFile)
            let file = $scope.selectedFile
            debugger;
            if ($scope.data.idSubFamilia > 0) {
                subFamiliaSvc.update($scope.data.idSubFamilia, $scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            } else {

                subFamiliaSvc.save(file, $scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }

    $scope.successReponse = function (response) {
        hideLoader();
        if (response.code === '0') {
            tS.toastr('warning', response.message, response.titleSms);
        }
        if (response.code === '1') {
            tS.toastr('success', response.message, response.titleSms);
            $uibModalInstance.close(response)
        }
    }

    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}
