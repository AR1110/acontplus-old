

app.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', 'mainService'];


function homeCtrl($scope, mS) {


    $scope.init = ()=>{
        mS.getData('get', '/Home/ReadGestionCantidad').then(function (response) {
            if (response.id == 0) {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }            
            $scope.cantidad = response.data;
        })
    }


    $scope.init();


}