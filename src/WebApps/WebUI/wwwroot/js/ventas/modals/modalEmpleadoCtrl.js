export { 
    ModalEmpleadoCtrl
}

ModalEmpleadoCtrl.$inject = ['$scope', 'mainService', '$uibModalInstance', 'toastService', 'params'];

function ModalEmpleadoCtrl($scope, mS, $uibModalInstance, tS, params) {
        
    $scope.tipoRegistro = 1;
    $scope.data = {};

    

    onInit();
    function onInit() {
        mS.getData('post', '/TipoIdentificacion/ReadTipoIdentificacion', {
            tipoValidacion: 'V'
        }).then(response => {
            $scope.tipoIdentificaciones = response.data;
            $scope.data.idTipoIdentificacion = $scope.tipoIdentificaciones[0].idTipoIdentificacion;
            $scope.data.identificacion = $scope.tipoIdentificaciones[0].identificacion;

        });

        
        if (params && params.idEmpleado > 0) {
            $scope.tipoRegistro = 2;
            $scope.data = params;
        }
    }

    $scope.onChangeTipoIdentificacion = function() {
        $scope.data.identificacion = $scope.tipoIdentificaciones.find(item => item.idTipoIdentificacion === $scope.data.idTipoIdentificacion).identificacion;
    }

    $scope.saveAndUpdate = function() {
        try {

            const titulo = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';

            if (!($scope.data.idTipoIdentificacion>0)) {
                tS.toastr('warning', 'Seleccione el Tipo Identificación', titulo);
                return
            }

            if (!$scope.data.nroIdentificacion) {
                tS.toastr('warning', 'Ingrese Nro. de Identificación', titulo);
                return
            }

            if ($scope.tipoRegistro === 1) {
                if (!$scope.data.nombre) {
                    tS.toastr('warning', 'Ingrese el Nombre', titulo);
                    return
                }
                if (!$scope.data.apellido) {
                    tS.toastr('warning', 'Ingrese el Apellido', titulo);
                    return
                }
                $scope.data.nombreCompleto = $scope.data.nombre + " " + $scope.data.apellido
            }

            if ($scope.tipoRegistro === 2) {
                if (!$scope.data.nombreCompleto) {
                    tS.toastr('warning', 'Ingrese el Nombre Completo', titulo);
                    return
                }
            }

            const url = $scope.tipoRegistro === 1 ? '/Empleado/Post' : '/Empleado/Put?idEmpleado=' + $scope.data.idEmpleado;
            showLoader();
            mS.getData('post', url, $scope.data).then(response => {
                hideLoader();
                if (response.id == "0") {
                    tS.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {                    
                    tS.toastr('success', response.message, response.titleSms);
                    $uibModalInstance.close(response);
                }
            })

        } catch (error) {
            hideLoader();
            toastr.error(error)
        }


    }

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }



}