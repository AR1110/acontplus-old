(function(){

    'use strict';

    app.controller('clienteCtrl', clienteCtrl);
    
    clienteCtrl.$inject=['$scope', 'clienteService', 'toastService',];

    function clienteCtrl($scope, clienteSvc, tS){
        'use strict';
        
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 1000;
        $scope.recordsQuantity = [10, 25, 50, 100, 500, 1000];
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 100    
        }

        $scope.onKeyupSearchCliente = function(){                        
            $scope.getClientes();
        }

        $scope.resetList = function(){
            $scope.dataSearch.bySearch = null;
            $scope.getClientes();
        }

        
        $scope.getClientes = function() {       
            try {  
                showLoader();
                $scope.dataSearch.bySearch || null;
                $scope.clientes = [];
                clienteSvc.getAll($scope.dataSearch).then(response=>{
                    hideLoader();                    
                    $scope.clientes = response;
                    $scope.totalRecords = $scope.clientes.length > 0? $scope.clientes[0].totalRecords:0                                                            
                }).catch(error => {
                    console.log(error);
                    hideLoader();
                })                        
            } catch (error) {            
                console.log(error)   
                hideLoader();
            }
            
        }
        $scope.getClientes();
        
        $scope.resultModal = function(item){
            try {                
                if(typeof item==='object'){
                    $scope.getClientes();
                }
            } catch (err) {
                console.log(err)
            }            
        }

        $scope.askToDelete = async function (item) {
            try {
                let { isConfirmed } = await Swal.fire({
                    html: `<small>Esta Ud. seguro de Inactivar al Cliente <b>${data.nombreFiscal}</b></small>?`,
                    icon: 'warning',
                    showConfirmButton: true,
                    confirmButtonText: 'Sí, Inactivar!',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar!',
                    allowOutsideClick: false,
                })


                if (isConfirmed) {
                    showLoader();
                    clienteSvc.delete(item.idCliente).then(response => {
                        hideLoader();
                        if (response.code === "0") {
                            tS.toastr('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.getClientes();
                        }
                    }).catch(error => {
                        hideLoader()
                        console.log(error)
                    })                   
                }  
            } catch (e) {
                console.log(e)
            }
        }
    }




})(window.angular)