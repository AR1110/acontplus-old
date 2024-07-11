//@ts-check
export {
    modalSolictudCreditoCtrl
}

modalSolictudCreditoCtrl.$inject = ['$scope', '$injector'];
function modalSolictudCreditoCtrl($scope, $injector){
    let fS = $injector.get('formulario')

    $scope.dataClienteSearch = {
        name:null
    }



    $scope.guarantors = [];

    


    $scope.onKeyupClienteSearch = function(){
        if (!fS.isValidField($scope.dataClienteSearch.name)){

        }
    }

    $scope.onSelectedClienteChange = function(item){
        $scope.dataClienteSearch.name = null;
        $scope.guarantors.push(item)
    }

    $scope.askToDelete = async function(){

        let { isConfirmed } = await Swal.fire({
            title: "Quitar este garante",
            text: "¿Estas seguro de quitar este garante ahora?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
            cancelButtonText: 'No'
        }) 

        if(isConfirmed){




        }


    }

}