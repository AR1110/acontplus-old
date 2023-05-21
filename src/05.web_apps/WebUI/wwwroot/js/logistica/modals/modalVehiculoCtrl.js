
export {
    ModalVehiculoCtrl
}

ModalVehiculoCtrl.$inject = ['$scope', '$uibModalInstance', 'vehiculoService', 'toastService',  'params'];

function ModalVehiculoCtrl($scope, $uibModalInstance, vehiculoSvc, tS, params){
    $scope.tipoRegistro      = 1;
    $scope.data              = {};  
    
    console.log(params);
     
    if(params.idVehiculo>0){
        $scope.tipoRegistro=2;
        $scope.data = Object.assign({}, params)
    }

    $scope.saveUpdate = function(){     
        try {
            let tituloToast = $scope.tipoRegistro == 1 ? 'Guardar' : 'Actualizar';
            let posicionToast = "toast-top-right";
            if (!$scope.data.placa) {
            tS.toastr('warning','Ingrese la Placa', tituloToast, posicionToast);
                return
            }
            if (!$scope.data.marca) {
            tS.toastr('warning','Ingrese la Marca', tituloToast, posicionToast);
                return
            }
            if (!$scope.data.modelo) {
            tS.toastr('warning','Ingrese el Modelo', tituloToast, posicionToast);
                return
            }
            showLoader();

            if($scope.data.idVehiculo>0){
                vehiculoSvc.update($scope.data.idVehiculo, $scope.data)
                .then($scope.successResponse).catch(err => {
                    hideLoader();
                    console.log(err)
                })
            }
            else{
                vehiculoSvc.save($scope.data).then($scope.successResponse).catch(err => {
                    hideLoader();
                    console.log(err)
                })
            }     
        } catch (error) {
            console.log(error)
        }           
    }

    $scope.successResponse = function(response) {
        hideLoader();
        console.log(response)
        if (response.code === "0") {
            tS.toastr('warning',response.message);
            return;
        }
        if (response.code === "1") {
            tS.toastr('success', response.message);           
            $uibModalInstance.close(response.payload)
        }
    }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}
