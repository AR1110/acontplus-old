export { 
    ModalTransportistaCtrl
}

ModalTransportistaCtrl.$inject =  ['$scope', '$uibModalInstance', 'transportistaService', 'toastService', 'params'];

function ModalTransportistaCtrl($scope, $uibModalInstance, transportistaSvc,  tS, params){
    $scope._params           = Object.assign({}, params)
    $scope.tipoRegistro      = 1;
    $scope.data              = {};

    

    $scope.getTipoIdentificacion = function(){
        showLoader();
        transportistaSvc.getDataForm().then(response => {  
            $scope.tipoIdentificaciones = response;
            // $scope.data.idTipoIdentificacion = $scope.tipoIdentificaciones[0].idTipoIdentificacion;
            
            if($scope._params.idTransportista>0){
                $scope.tipoRegistro=2;
                $scope.data = $scope._params;            
            }
        }).finally(()=>hideLoader())
    }

    $scope.getTipoIdentificacion();

    $scope.validarTipoIdentificacion = function(idTipo) {
        let { codigoIdentificacion } = $scope.tipoIdentificaciones.find(val => val.idTipoIdentificacion === idTipo) || { codigoIdentificacion: 0 };
        return codigoIdentificacion
    }
    
    $scope.saveUpdate = function() {
        let tituloToast = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';

        if (!$scope.data.idTipoIdentificacion) {
            tS.toastr('warning', 'Seleccione el Tipo de Identificación', tituloToast);
            return
        }
        if (!$scope.data.nroIdentificacion) {
            tS.toastr('warning', 'Ingrese N° de Identificación', tituloToast);
            return
        }
        if ($scope.validarTipoIdentificacion($scope.data.idTipoIdentificacion) === "C" && $scope.data.nroIdentificacion.length !== 10) {
            tS.toastr('warning', 'Número de Cédula tiene que tener 10 dígitos', tituloToast);
            return
        }

        if ($scope.validarTipoIdentificacion($scope.data.idTipoIdentificacion) === "R" && $scope.data.nroIdentificacion.length !== 13) {
            tS.toastr('warning', 'Número de RUC tiene que tener 13 dígitos', tituloToast);
            return
        }
        if (!$scope.data.nombre) {
            tS.toastr('warning', 'Ingrese el Nombre', tituloToast);
            return
        }
        showLoader();

        if($scope.data.idTransportista>0){
            transportistaSvc.update($scope.data.idTransportista, $scope.data)
            .then($scope.successResponse).catch(err => {
                hideLoader();
                console.log(err)
            })
        }
        else{
            transportistaSvc.save($scope.data).then($scope.successResponse).catch(err => {
                hideLoader();
                console.log(err)
            })
        }      
    }

    $scope.successResponse = function(response) {
        hideLoader();        
        if (response.code === "0") {
            tS.toastr('warning',response.message);
            return;
        }
        if (response.code === "1") {
            tS.toastr('success', response.message);           
            $uibModalInstance.close(response.payload)
        }
    }

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }

}
