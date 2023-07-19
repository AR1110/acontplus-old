
export{
    ModalMarcaCtrl
}

ModalMarcaCtrl.$inject = ['$scope', '$uibModalInstance', 'marcaService', 'toastService', 'params'];

function ModalMarcaCtrl($scope, $uibModalInstance, marcaSvc, tS, params){
    $scope.tipoRegistro = 1;
    $scope.data = {};

    if (params && params.idMarca>0) {
        $scope.tipoRegistro = 2;
        $scope.data = Object.assign({}, params)
        $scope.showStatus = !params.estado;
    }


    $scope.saveAndUpdate = function() {
        try {
            const tituloModal = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar'
            
            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Ingrese la Descripción', tituloModal);
                return;
            }

            showLoader();

            if($scope.data.idMarca > 0){
                marcaSvc.update($scope.data.idMarca, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }else{
                marcaSvc.save($scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }
        } catch (error) {
           hideLoader() ;
           console.log(error)
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
