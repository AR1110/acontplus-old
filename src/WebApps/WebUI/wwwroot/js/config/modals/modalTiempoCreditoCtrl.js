
export {
    ModalTiempoCreditoCtrl
}
ModalTiempoCreditoCtrl.$inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'params'];
function ModalTiempoCreditoCtrl($scope, $uibModalInstance, mS, tS, params){
    const PATH_NAME = 'TiempoCredito/'
    $scope.tipoRegistro = 1;
    $scope.data = {};
    $scope.data.tipo = true;
    $scope.data.entrada = false;
    
    $scope.onInit = function(){
        try {
            if(params.idTiempoCredito>0){
                $scope.tipoRegistro=2;
                $scope.data = params;
            }
    
            
        } catch (error) {
            console.log(error);
        }
    }
    $scope.onInit();

    $scope.onChangeTipo = function(){
        if($scope.data.tipo){
            $scope.data.diasCredito = 0;
            $scope.data.numeroCuota = 1;
            $scope.data.entrada = false;            
        }
    }   
    $scope.onChangeTipo(); 


    $scope.validarCampo = function(campo){
        return [null, undefined, ""].includes(campo) ? true : false;
    }

    $scope.saveAndUpdate = function() {
        const tituloToastr = $scope.tipoRegistro === 1 ? 'Guardar':'Actualizar';
        let regex = /^(null|undefined|\s*)$/;

        if (regex.test($scope.data.descripcion)) {
            tS.toastr('warning', 'Ingrese la descripción', tituloToastr);
            return;
        }
        //Si es opcion  Credito 
        if ($scope.data.tipo === false) {
            if (regex.test($scope.data.diasCredito)) {
                tS.toastr('warning', 'Ingrese el Dias de Crédito', tituloToastr);
                return;
            }
            if (!($scope.data.diasCredito >0)) {
                tS.toastr('warning', 'Dias de Credito tiene que ser mayor a 0 días', tituloToastr);
                return;
            }
            if (regex.test($scope.data.numeroCuota)) {
                tS.toastr('warning', 'Por favor, ingrese el Número de Cuota', tituloToastr);
                return;
            }
            if (!($scope.data.numeroCuota > 0)) {
                tS.toastr('warning', 'El Número de Cuota tiene que ser mayor a 0', tituloToastr);
                return;
            }
        }
        if ($scope.data.tipo) {
            if ($scope.data.diasCredito !== 0) {
                tS.toastr('warning', 'Los Días de Crédito no tiene que ser mayor a 0', tituloToastr);
                return;
            }
            if ($scope.data.numeroCuota > 1) {
                tS.toastr('warning', 'Número de Cuota tiene que ser igual a 1', tituloToastr);
                return;
            }
            if ($scope.data.entrada) {
                tS.toastr('warning', 'El Contado no lleva la Entrada ', tituloToastr);
                return;
            }
        }
        
        //Tipo de Gestion(Compra/Venta)
        if (regex.test($scope.data.gestion)) {
            tS.toastr('warning', 'Marque el Tipo de Gestión', tituloToastr);
            return;
        }

        let url = $scope.tipoRegistro == 1 ? PATH_NAME + 'Insert' : PATH_NAME + 'Update/' + $scope.data.idTiempoCredito;
        let method = $scope.tipoRegistro == 1 ? 'post': 'put';
        showLoader();
        mS.getData(method, url + '?json=' + JSON.stringify($scope.data), null, true).then(response=>{
            hideLoader();
            if (response.code === "0") {
                tS.toastr('warning',  response.message, response.titleSms);                
            }
            if (response.code === '1') {
                tS.toastr('success',  response.message, response.titleSms);
                $uibModalInstance.close(response);                
            }
        }).catch(error=>{
            hideLoader();
            console.log(error)
        })
    }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}