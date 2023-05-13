export { 
    ModalFamiliaCtrl
}

ModalFamiliaCtrl.$inject = ["$scope", '$uibModalInstance', 'familiaService', 'toastService', 'params']

function ModalFamiliaCtrl($scope, $uibModalInstance, familiaSvc, tS, params) {
    $scope.data = {};

    if(typeof params == 'object' && params.idFamilia > 0){
        $scope.tipoRegistro = 2;
        $scope.data = Object.assign({}, params)
    }else{
        $scope.tipoRegistro = 1;
    }

    $scope.getFamilyCode = function(){
        if ($scope.data.descripcion && $scope.tipoRegistro === 1) {
            this.data.siglas = this.data.descripcion.substring(0, 3);           
        }      
    }

    $scope.saveAndUpdate = function(){
        try {
            const tituloToastr = $scope.tipoRegistro === 1 ? 'Nuevo':'Actualizar';

            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Ingrese la Descripción', tituloToastr);
                return;
            }

            if (!$scope.data.siglas) {
                tS.toastr('warning', 'Ingrese la Sigla', tituloToastr);
                return;
            }

            showLoader();

            if($scope.data.idFamilia > 0){
                familiaSvc.update($scope.data.idFamilia, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }else{
                familiaSvc.save($scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }
        } catch (error) {
            hideLoader();
            console.log(error);
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

    $scope.closeModal = function(){
        $uibModalInstance.close()
    }
}


