export {
    ModalSubFamiliaCtrl
}

ModalSubFamiliaCtrl.$inject = ['$scope', '$uibModalInstance', 'articuloService', 'subFamiliaService', 'toastService', 'params', 'subcategoryPhotoService']

function ModalSubFamiliaCtrl($scope, $uibModalInstance, articuloSvc, subFamiliaSvc, tS, params, subcategoryPhotoService) {

    $scope.data = {};
    $scope.data.montoObjetivo = 0;
    $scope.selectedFile = null

    $scope.getFamilias = function () {
        try {
            showLoader();
            articuloSvc.getDataForForm({}).then(response => {
                $scope.familias = response.familias;
            }).finally(() => hideLoader())
        } catch (error) {
            hideLoader();
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
            if ($scope.data.idSubFamilia > 0 && $scope.data.secuencial) {
                if (!$scope.data.secuencial) {
                    tS.toastr('warning', 'Ingrese Nro. Secuencial', tituloModal);
                    return;
                }
                if (isNaN($scope.data.secuencial)) {
                    tS.toastr('warning', 'Nro. Secuencial tiene que ser un número', tituloModal);
                    return;
                }
            }
            showLoader();

            let file = $scope.selectedFile
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

    $scope.uploadFile = () => {
        console.log($scope.data)
        if ($scope.data.subcategoryPhotoId > 0 && $scope.image.selectedFile != null) {
            showLoader();
            subcategoryPhotoService.update({ id: $scope.data.subcategoryPhotoId, data: JSON.stringify({ id: $scope.data.subcategoryPhotoId, s3ObjectKey: $scope.data.s3ObjectKey, s3ObjectUrl: $scope.data.s3ObjectUrl }), file: $scope.selectedFile, }).then(response => {
                if (response.code == "0") {
                    tS.toastr("warning", response.message)
                }
                if (response.code == "1") {
                    let src = URL.createObjectURL($scope.selectedFile)
                    document.getElementById('productImage').src = src
                    tS.toastr("success", response.message)
                }
                hideLoader()
            }).catch(error => {
                hideLoader()
                console.log(error);
            });
        }
        if ($scope.data.idSubFamilia > 0 && $scope.data.subcategoryPhotoId == 0 && $scope.selectedFile != null) {
            showLoader();
            subcategoryPhotoService.post({ subcategoryId: $scope.data.idSubFamilia, file: $scope.selectedFile, }).then(response => {
                if (response.code == "0") {
                    tS.toastr("warning", response.message)
                }
                if (response.code == "1") {
                    let src = URL.createObjectURL($scope.selectedFile)
                    document.getElementById('productImage').src = src
                    tS.toastr("success", response.message)
                }
                hideLoader()
            }).catch(error => {
                hideLoader()
                console.log(error);
            });
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
