

(function(){
    'use strict';

    app.controller('vehiculoCtrl', vehiculoCtrl);

    vehiculoCtrl.$inject=['$scope', '$http', 'vehiculoService', 'modalService', 'nombreModal'];

    function vehiculoCtrl($scope, $http, vehiculoSvc, _modalSvc, _nombreModal){
        
        $scope.resultModal = function(result) {  
            if(typeof result==='object'){
                $scope.getVehiculos();
            }
        }

        $scope.getVehiculos = function () {
            try {
                showLoader();
                $scope.vehiculos = [];
                vehiculoSvc.getAll({}).then(response => {                  
                    $scope.vehiculos = response            
                    hideLoader();
                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                });
            } catch (error) {
                console.log(error)
            }
            
        }
        $scope.getVehiculos();


        //Elimnar 
        $scope.sweetAlertEliminar = async(item)=>{
            let {isConfirmed} = await Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro de eliminar este registro ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            })

            if(isConfirmed){
                $http.post('/Vehiculo/Delete?id=' + item.idVehiculo).then(({data:response}) => {
                    if (response.id === "0") {
                        toastr.warning(response.message);
                        return
                    }
                    if (response.id === "1") {
                        $scope.getVehiculos();
                        toastr.success(response.message);                                                                      
                    }
                })
            }
        };
    }

})(window.angular)