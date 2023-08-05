(function(){

    'use strict';

    app.controller('clienteCtrl', clienteCtrl);
    
    clienteCtrl.$inject=['$scope', 'clienteService', 'toastService', 'commonService'];

    function clienteCtrl($scope, clienteSvc, tS, commonSvc){
        'use strict'; 
        $scope.recordsQuantity = [10, 25, 50, 100, 500, 1000];
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 100  ,
            maxSize: 5          
        }

        $scope.onKeyupSearchCliente = function(){                        
            $scope.getClientes();
        }

        $scope.resetList = function(){
            $scope.dataSearch.bySearch = null;
            $scope.getClientes();
        }

        $scope.pagechanged = function () {
            $scope.getClientes();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getClientes();
        };

        
        $scope.getClientes = function() {       
            try {  
                showLoader();
                $scope.dataSearch.bySearch = $scope.dataSearch.bySearch && $scope.dataSearch.bySearch 
                $scope.clientes = [];
                $scope.dataSearch.totalRecords = 0;
                clienteSvc.getAll($scope.dataSearch).then(response=>{
                    hideLoader();                    
                    $scope.clientes = response;
                    $scope.dataSearch.totalRecords = $scope.clientes.length > 0? $scope.clientes[0].totalRecords:0                                                            
                }).catch(error => {
                    $scope.dataSearch.totalRecords = 0;
                    console.log(error);
                    hideLoader();
                })                        
            } catch (error) {    
                $scope.dataSearch.totalRecords = 0;        
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
                    html: `<small>Esta Ud. seguro de Inactivar al Cliente <b>${item.nombreFiscal}</b></small>?`,
                    icon: 'warning',
                    showConfirmButton: true,
                    confirmButtonText: 'Sí, inactivar!',
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
                hideLoader();
                console.log(e)
            }
        }


        $scope.getReport = function (item) {
            let format = 'excel';
            let dataParms = {      
                tipo: 1                        
            }

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: false,
                    codigo: 'RCL',
                    format,
                    aditionalParams: [

                    ]
                }),
                dataParams: JSON.stringify(dataParms)
            }

            commonSvc.getReport({
                parameters,
                formatType: 'excel'
            })
        }

    }




})(window.angular)