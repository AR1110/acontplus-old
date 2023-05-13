export { 
    ModalModeloCtrl
}

ModalModeloCtrl.$inject = ['$scope', '$uibModalInstance', 'marcaService', 'modeloService', 'toastService', 'params'];

function ModalModeloCtrl($scope, $uibModalInstance, marcaSvc, modeloSvc, tS, params){

    $scope.tipoRegistro = 1;
    $scope.data = {};
    $scope.modelo = {};
    $scope.marca = {};

    $scope.getAllMarca = function() {
        try {
            marcaSvc.listForSelect({}).then(response => {
                $scope.marcas = response;
            }).catch(error => {
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }       
    }

    $scope.getAllMarca();



    if(typeof params ==='object' && params.idModelo>0){
        $scope.tipoRegistro = 2;        
        $scope.data = Object.assign({}, params);
        $scope.showStatus = !params.estado;        
    }

    $scope.resultModalMarca = function(result) {
        $scope.getAllMarca();
    }

    $scope.saveAndUpdate = function() {
        try {
            const tituloToastr = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar'          

            if (["", null, undefined].includes($scope.data.descripcion)) {
                tS.toastr('warning', 'Ingrese la descripciòn', tituloToastr);
                return;
            }

            if($scope.data.idModelo > 0){
                modeloSvc.update($scope.data.idModelo, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }else{
                modeloSvc.save($scope.data).then($scope.successReponse)
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

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }

}
