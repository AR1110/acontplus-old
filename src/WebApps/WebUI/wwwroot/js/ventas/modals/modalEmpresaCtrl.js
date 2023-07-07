export { 
    ModalEmpresaCtrl
}
ModalEmpresaCtrl.$inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'formulario', 'params'];

function ModalEmpresaCtrl($scope, $uibModalInstance, mS, tS, fS, params) {        
    $scope.tipoRegistro = 1;

    $scope.data = {};


    onInit()
    function onInit() {
        if (params &&  params.idEmpresa > 0) {
            $scope.tipoRegistro = 2;
            $scope.data = params;
        }
    }

    $scope.copiarRazonSocial = function() {
        if (!$scope.data.razonSocial) {
            $scope.data.nombreComercial = $scope.data.razonSocial;
        }
    }

    $scope.saveAndUpdate = function() {
        if (!$scope.data.ruc) {
            tS.toastr('warning', 'Ingrese Número de RUC');
            return
        }

        if ($("#ruc").hasClass('is-invalid')) {
            tS.toastr('warning', 'Ingrese Número de Correctamente');
            return
        }

        if ($scope.data.ruc.toString().length !== 13) {
            tS.toastr('warning', 'Número de Ruc tiene que tener 13 dígitos');
            return
        }

        if (!$scope.data.razonSocial) {
            tS.toastr('warning', 'Ingrese campo Razon Social');
            return
        }

        if (!$scope.data.nombreComercial) {
            tS.toastr('warning', 'Ingrese campo Nombre Comercia');
            return
        }

        const URL = $scope.tipoRegistro === 1 ? '/Empresa/Post' : '/Empresa/Put?id=' + $scope.data.idEmpresa;
        showLoader();
        mS.getData('post',URL, $scope.data).then(response => {
            if (response.id === "0") {
                hideLoader();
                tS.toastr('warning', response.message);
                return
            }
            if (response.id === "1") {
                hideLoader();
                tS.toastr('success', response.message, response.titleSms);
                $uibModalInstance.close(response);
            }
        })



    }

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }
}