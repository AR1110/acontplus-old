(function() {
    'use strict';

    app.controller('subFamiliaCtrl', subFamiliaCtrl);

    subFamiliaCtrl.$inject = ['$scope', 'subFamiliaService', 'commonService', 'toastService'];

    function subFamiliaCtrl($scope, subFamiliaSvc,  commonSvc, ts) {
       
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10,
            maxSize: 5
        }
        
        $scope.totalRecords = 0;
        $scope.recordsQuantity = [5, 10, 25, 50, 100, 200, 500]

        $scope.getSubFamilias = function() {
            try {
                showLoader();
                $scope.subFamilias = [];
                subFamiliaSvc.getAll($scope.dataSearch).then(response => {
                    $scope.subFamilias = response;               
                    $scope.totalRecords = $scope.subFamilias.length > 0 ? $scope.subFamilias[0].totalRecords : 0;   
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

        $scope.getSubFamilias();

        $scope.pagechanged = function() {
            $scope.getSubFamilias();
        }

        $scope.changePageSize = function() {
            $scope.dataSearch.pageIndex = 1;
            $scope.getSubFamilias();
        }
      
        $scope.exportTableToExcel = () => {       
            try {
                showLoader();
                const subFamilias = $scope.subFamilias.map(item=>({
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                }))                          
                commonSvc.exportTableToExcel({
                    arr: subFamilias,
                    fileName: 'SubFamilias'
                })               
            } catch (error) {
                hideLoader();
                console.log(error)
            }
            
        }
       
        $scope.delete = async function({ idSubFamilia }) {
            try {
                let {isConfirmed} = await Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro/a de eliminar esta subfamilia ahora?</small>`,
                    showCinfirmButton: true,
                    confirmButtonText: 'Si, eliminar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                });
                
                if(isConfirmed){
                    showLoader();
                    subFamiliaSvc.delete(idSubFamilia).then(response => {
                        hideLoader();
                        if (response.code == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.code == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getSubFamilias();                        
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error);
                    })
                }
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }          
    }
})(window.angular);