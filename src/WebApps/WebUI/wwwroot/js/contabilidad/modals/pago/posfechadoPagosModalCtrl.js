//@ts-check

export {
    posfechadoPagosModalCtrl
}

posfechadoPagosModalCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];
function posfechadoPagosModalCtrl($scope, $uibModalInstance, params){

    $scope.cheques = params.cheques;
    $scope.closeModal = closeModal;


    console.log($scope.cheques)


    function closeModal(){
        $uibModalInstance.close()
    }

}