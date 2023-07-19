export { 
    ModalMedidaCtrl
}

ModalMedidaCtrl.$inject = ['$scope', '$uibModalInstance', 'medidaService', 'toastService', 'params'];

function ModalMedidaCtrl($scope, $uibModalInstance, medidaSvc, tS, params) {
    $scope.tipoRegistro = 1;
    $scope.data = {};

    if (params && params.idMedida > 0) {
        $scope.tipoRegistro = 2;
        $scope.data = Object.assign({}, params);
        $scope.showStatus = !params.estado;
    }

    $scope.saveAndUpdate = function() {
        try {
            const tituloToast = $scope.tipoRegistro == 1 ? 'Guardar' : 'Actualizar';
       
            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Ingrese la Descripción', tituloToast);
                return;
            }

            showLoader();

            if($scope.data.idMedida > 0){
                medidaSvc.update($scope.data.idMedida, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }else{
                medidaSvc.save($scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }
        } catch (error) {
            console.log(error);
            hideLoader();
        }
       
    }

    $scope.successReponse = function(response) {
        hideLoader();
        if (response.code==='0') {
            tS.toastr('warning', response.message, response.titleSms);            
        }
        if (response.code==='1') {
            tS.toastr('success', response.message, response.titleSms);                            
            $uibModalInstance.close(response)
        }
    }


    $scope.closeModal = function() {
        $uibModalInstance.close();
    }
}
