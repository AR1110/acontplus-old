

(()=>{
    'use strict';

    angular.module('acontPlusApp')
           .controller('vehiculoCtrl', vehiculoCtrl);

    vehiculoCtrl.$inject=['$scope', '$http', 'modalService', 'nombreModal'];

    function vehiculoCtrl($scope, $http, _modalSvc, _nombreModal){
        $scope.data = {};

        
        $scope.openModal = async(item)=> {            
           const {vehiculo} = _nombreModal;
           const {ModalVehiculoCtrl} = await import('./../../modal/' + vehiculo.MODAL_CTRL);
           const modalRef = _modalSvc.openModalSecond(ModalVehiculoCtrl, 'Vehiculo/'+vehiculo.MODAL_CSHTML, 'md', item);
           modalRef.result.then(result=>{
                if(typeof result==='object'){
                    $scope.getVehiculos();
                }
            })
        }

        $scope.getVehiculos = function () {
            showLoader();
            $http.get('/Vehiculo/Get').then(({data:response}) => {
                if (response.id === "0") {
                    hideLoader();
                    toastr.warning(response.message);
                    return
                }
                $scope.vehiculos = response.data;                
                hideLoader();
            }).catch(error=>{
                hideLoader();
                toastr.error(error)
            });
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