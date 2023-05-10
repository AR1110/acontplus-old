

export {
    ModalDatoAdicionalArticuloCtrl
}

ModalDatoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance'];

function ModalDatoAdicionalArticuloCtrl($scope, $uibModalInstance){
    console.log('init ')

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}