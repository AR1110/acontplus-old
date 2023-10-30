export {
    modalCategoriaCompraCtrl
}

modalCategoriaCompraCtrl.$inject = ['$scope', '$injector', '$uibModalInstance', 'params'];

function modalCategoriaCompraCtrl($scope, $injector, $uibModalInstance, params) {
    let tS = $injector.get('toastService');
    let categoriaSvc = $injector.get('categoriaCompraService');

    if (params.idCategoriaCompra > 0) {
        $scope.tipoRegistro = 2;
        $scope.titleModal = 'Editar';
        $scope.btnTextSave = 'Actualizar';
        $scope.data = Object.assign({}, params);
    } else {
        $scope.tipoRegistro = 1;
        $scope.titleModal = 'Nuevo';
        $scope.btnTextSave = 'Guardar';
        $scope.data = {}
    }

    $scope.obtenerTresLetras = function () {
        if ($scope.data.descripcion && $scope.tipoRegistro == 1) {
            $scope.data.codigo = $scope.data.descripcion.slice(0, 3)
        }
    }
    console.log('modal')

    $scope.save = function () {
        if (!$scope.data.descripcion) {
            tS.toastr('warning', 'Ingrese la Descripción');
            return;
        }
        if (!$scope.data.codigo) {
            tS.toastr('warning', 'Ingrese el Código');
            return;
        }
        showLoader();

        if ($scope.data.idCategoriaCompra > 0) {
            categoriaSvc.put($scope.data.idCategoriaCompra, $scope.data)
                .then($scope.successResponse).catch(err => {
                    hideLoader();
                    console.log(err)
                })
        }
        else if(!($scope.data.idCategoriaCompra>0)) {
            categoriaSvc.post($scope.data).then($scope.successResponse).catch(err => {
                hideLoader();
                console.log(err)
            })
        }
    }

    $scope.successResponse = function (response) {
        hideLoader(); 
        if (response.code === "0") {
            tS.toastr('warning', response.message);
            return;
        }
        if (response.code === "1") {
            tS.toastr('success', response.message);
            $uibModalInstance.close(response.payload)
        }
    }

    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}
