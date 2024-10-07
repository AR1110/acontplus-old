//@ts-check

export {
    posfechadoCobrosModalCtrl
}

posfechadoCobrosModalCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];
function posfechadoCobrosModalCtrl($scope, $uibModalInstance, params){

    $scope.closeModal = closeModal;

    $scope.cheques = params.cheques;

    console.log($scope.cheques)


    function closeModal(){
        $uibModalInstance.close()
    }

}