(() => {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('medidaCtrl', medidaCtrl);

    medidaCtrl.$inject = ['$scope', 'medidaService', 'toastService'];

    function medidaCtrl($scope, medidaSvc, tS) {
              
        $scope.medidas = [];
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10
        }
        //Paginacion
        $scope.totalRecords = 0;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.getMedidas = function() {
            try {
                showLoader();
                $scope.medidas=[];
                medidaSvc.getAll($scope.dataSearch).then(response => {          
                    hideLoader();        
                    $scope.medidas = response;          
                    $scope.totalRecords = $scope.medidas.length > 0 ? $scope.medidas[0].totalRecords : 0;                   
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                console.log(error);
                hideLoader();
            }
        }

        $scope.getMedidas();
        $scope.pagechanged = () => {
            $scope.getMedidas();
        }

        $scope.changePageSize = () => {
            $scope.dataSearch.pageIndex = 1;
            $scope.getMedidas();
        }

       
        $scope.exportTableToExcel = () => {       
            try {
                showLoader();
                const medidas = $scope.medidas.map(item=>({
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                }))                          
                _commonSvc.exportTableToExcel({
                    arr: medidas,
                    fileName: 'SubFamilias'
                })   
            } catch (error) {
                hideLoader();
                console.log(error)
            }
            
        }

        $scope.resultModal = function(item) {
            $scope.getMedidas();
        }        

        $scope.delete = function (data) {
            try {
                Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro/a de eliminar esta Medida ahora?</small>`,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, eliminar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then(result => {
                    if (result.isConfirmed) {
                        showLoader();
                        medidaSvc.delete(data.idMedida).then(response => {
                            hideLoader();
                            if (response.code == "0") {
                                tS.toastr('warning', response.message, response.titleSms);                                
                            }
                            if (response.code == "1") {
                                tS.toastr('success', response.message, response.titleSms);
                                $scope.getMedidas();                                
                            }
                        }).catch(error => {
                            hideLoader();
                            console.log(error);
                        })
    
                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }
    }
})(window.angular);