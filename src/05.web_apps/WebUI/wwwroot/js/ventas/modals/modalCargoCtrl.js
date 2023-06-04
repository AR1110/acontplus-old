
export {
    ModalCargoCtrl
}
ModalCargoCtrl.$inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'params'];

function ModalCargoCtrl($scope, $uibModalInstance, mS, tS, params) {
        
        $scope.tipoRegistro = 1;
        $scope.data = {};


    onInit();
    function onInit() {
        if ( params && params.idCargo > 0) {
            $scope.tipoRegistro = 2;
            $scope.data = params;
        }
    }

    $scope.obtenerCodigo = function() {
        if ($scope.data.descripcion && $scope.tipoRegistro === 1) {
            $scope.data.codigo =  $scope.data.descripcion.slice(0,3)
        } 
    }

    $scope.saveAndUpdate = function() {
        const titulo = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';
        if (!$scope.data.descripcion) {
            tS.toastr('warning', 'Ingrese la Descripción', titulo);
            return
        }

        if (!$scope.data.codigo) {
            tS.toastr('warning', 'Ingrese el Códgio', titulo);
            return
        }

        const url = $scope.tipoRegistro === 1 ? '/Cargo/Post' : '/Cargo/Put?id=' + $scope.data.idCargo;
        const method = $scope.tipoRegistro === 1 ? 'post':'put';

        showLoader();
        mS.getData(method, url, $scope.data).then(response => {
            hideLoader();
            if (response.id === "0") {
                tS.toastr('warning', response.message, response.titleSms);                
            }

            if (response.id === "1") {
                tS.toastr('success', response.message, response.titleSms);
                $uibModalInstance.close(response)
            }

        })


    }

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }

}