(function() {
    "use strict";

    app.controller("transportistaCtrl", transportistaCtrl);

    transportistaCtrl.$inject = ["$scope", 'transportistaService', 'toastService'];

    function transportistaCtrl($scope, transportistaSvc, tS) {        
        $scope.json = {
            typeList:0
        }
        $scope.resultModal = function(result) {                     
            if(typeof result==='object'){
                $scope.getAll();
            }                          
        }

        $scope.getAll = function () {
            try {
                showLoader();
                $scope.transportistas = [];
                transportistaSvc.getAll($scope.json).then(response => {                  
                    $scope.transportistas = response;     
                    hideLoader();                
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                console.log(response);
                hideLoader();
            }
        }
        $scope.getAll();

        $scope.askToDelete = async(item)=> {
            try {
                let { isConfirmed } = await Swal.fire({
                    icon: "warning",
                    html: `<small>Esta seguro/a de eliminar este registro ahora?</small>`,
                    showConfirmButton: true,
                    confirmButtonText: "Sí, eliminar",
                    showCancelButton: true,
                    cancelButtonText: "No, cancelar",
                    allowOutsideClick: false,
                })
    
                if (isConfirmed) {
                    showLoader();
                    transportistaSvc.delete(item.idTransportista).then(response => {
                        hideLoader();
                        if (response.code == "0") {
                            tS.toastr('warning', response.message);
                        
                        }
                        if (response.code == "1") {
                            tS.toastr('success',response.message);
                            $scope.getAll();
                        
                        }
                    }).catch(error => {
                        console.log(error)
                        hideLoader();
                    })
                }
            } catch (error) {
                console.log(error);
            }
            
        }





    }
})(window.angular);
