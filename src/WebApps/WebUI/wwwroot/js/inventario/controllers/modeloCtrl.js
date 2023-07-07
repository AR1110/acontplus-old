(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('modeloCtrl', modeloCtrl);

    modeloCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modeloService', 'toastService'];

    function modeloCtrl($scope, mS, _commonSvc, modeloSvc,tS) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // };
        $scope.data = {};
        $scope.modelo = {};
        $scope.marca = {};
        $scope.modelos = [];
        $scope.marcas = [];
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10
        }
        $scope.totalRecords = 0;
        $scope.recordsQuantity = [5, 10, 25, 50, 100, 500]

        $scope.getModelos = function() {
            try {
                showLoader();
                $scope.modelos = [];

                modeloSvc.getAll($scope.dataSearch).then(response => {                  
                    $scope.modelos = response;
                    $scope.totalRecords = $scope.modelos.length > 0 ? $scope.modelos[0].totalRecords : 0;
                    hideLoader();
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }
        $scope.getModelos();

        $scope.pagechanged = function() {
            $scope.getModelos();
        }

        $scope.changePageSize = function() {
            $scope.dataSearch.pageIndex = 1;
            $scope.getModelos();
        }     
        
        $scope.resultModal = function(item){
            $scope.getModelos();
        }
        $scope.exportTableToExcel = () => {       
            try {
                showLoader();
                const modelos = $scope.modelos.map(item=>({
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                }))                          
                _commonSvc.exportTableToExcel({
                    arr: modelos,
                    fileName: 'Modelos'
                })               
            } catch (error) {
                hideLoader();
                console.log(error)
            }
            
        }


       
        $scope.delete = function( data ) {
            try {
                Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro/a de eliminar este Modelo ahora?</small>`,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, eliminar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then(result => {
                    if (result.isConfirmed) {
                        showLoader();
                        modeloSvc.delete(data.idModelo).then(response => {
                            hideLoader();
                            if (response.code == "0") {
                                tS.toastr('warning', response.message, response.titleSms);                            
                            }
                            if (response.code == "1") {
                                tS.toastr('success', response.message, response.titleSms);
                                $scope.getModelos();                            
                            }
                        }).catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }
        
    }
})(window.angular);