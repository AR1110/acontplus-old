
export {
    ModalCargoCtrl
}
ModalCargoCtrl.$inject = [
    '$scope',
    '$uibModalInstance', 
    'cargoService',
    'toastService',
    'params'
];

function ModalCargoCtrl($scope, $uibModalInstance, cargoSvc, tS, params) {

    $scope.tipoRegistro = 1;
    $scope.data = {};


    onInit();
    function onInit() {
        if (params && params.idCargo > 0) {
            $scope.tipoRegistro = 2;
            $scope.data = params;
        }
    }

    $scope.obtenerCodigo = function () {
        if ($scope.data.descripcion && $scope.tipoRegistro === 1) {
            $scope.data.codigo = $scope.data.descripcion.slice(0, 3)
        }
    }

    $scope.saveAndUpdate = function () {
        const titulo = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';
        if (!$scope.data.descripcion) {
            tS.toastr('warning', 'Ingrese la Descripción', titulo);
            return
        }

        if (!$scope.data.codigo) {
            tS.toastr('warning', 'Ingrese el Códgio', titulo);
            return
        } 

        showLoader();

        if ($scope.data.idCargo > 0) {
            cargoSvc.put($scope.data.idCargo, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
        } else if(!($scope.data.idCargo>0)) {
            cargoSvc.post($scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
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