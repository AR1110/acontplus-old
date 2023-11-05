export { 
    ModalEmpleadoCtrl
}

ModalEmpleadoCtrl.$inject = [
    '$scope', 
    'mainService',
    'empleadoService', 
    '$uibModalInstance', 
    'toastService', 
    'params'
];

function ModalEmpleadoCtrl($scope, mS, empleadoSvc, $uibModalInstance, tS, params) {
        
    $scope.tipoRegistro = 1;
    $scope.data = {};

    

    onInit();
    function onInit() {
        showLoader();
        empleadoSvc.getDataForm().then(response=>{
            $scope.tipoIdentificaciones = response.tiposIdentificacion;
            let dataID = $scope.tipoIdentificaciones.find(dd => dd.codigo==='R')
            $scope.data.idTipoIdentificacion =dataID.idTipoIdentificacion;
            $scope.data.identificacion = dataID.descripcion;  
        })
        .catch(error=>{
            console.log(error)
        })
        .finally(()=>hideLoader()) 
        
        if (params && params.idEmpleado > 0) {
            $scope.tipoRegistro = 2;
            $scope.data = Object.assign({}, params);
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
            
            let { codigoSri: codigoIdentificacion} = $scope.tipoIdentificaciones.find(item=>item.idTipoIdentificacion===$scope.data.idTipoIdentificacion)

            if (!$scope.data.nroIdentificacion) {
                tS.toastr('warning', 'Ingrese Nro. de Identificación', titulo);
                return
            }
            if(codigoIdentificacion ==='04' && $scope.data.nroIdentificacion.length!==13){
                tS.toastr('warning', 'Numero de ruc debe tener 13 digítos', titulo);
                return
            } 

            if (codigoIdentificacion==='04' && $scope.data.nroIdentificacion.slice($scope.data.nroIdentificacion.length - 3) !== '001') {                
                tS.toastr('warning', 'Número de RUC tiene que contener (001) en últimos dígitos');
                return
            }

            if(codigoIdentificacion==='05' && $scope.data.nroIdentificacion.length!==10){
                tS.toastr('warning', 'Numero de cedula debe tener 10 digítos', titulo);
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

            const data = {
                idEmpleado: $scope.data.idEmpleado,
                idTipoIdentificacion: $scope.data.idTipoIdentificacion,
                nroIdentificacion: $scope.data.nroIdentificacion,
                nombreCompleto: $scope.data.nombreCompleto,
                estado: $scope.data.estado                
            }
            showLoader();
            if(data.idEmpleado>0){
                empleadoSvc.update($scope.data.idEmpleado, data)
                .then($scope.successResponse)
                .catch(error=>{
                    hideLoader();
                    console.log(error);
                })
            }else{
                empleadoSvc.save(data)
                .then($scope.successResponse)
                .catch(error=>{
                    hideLoader();
                    console.log(error);
                })
            } 

        } catch (error) {
            hideLoader();
            toastr.error(error)
        }

 
    }

    $scope.successResponse = function(response) {
        hideLoader();
        if (response.code == "0") {
            tS.toastr('warning', response.message, response.titleSms);
            return
        }
        if (response.code == "1") {                    
            tS.toastr('success', response.message, response.titleSms);
            $uibModalInstance.close(response);
        }
    }
    $scope.closeModal = function() {
        $uibModalInstance.close();
    }



}