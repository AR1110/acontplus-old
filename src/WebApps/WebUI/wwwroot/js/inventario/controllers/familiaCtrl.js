(function(){

    'use strict';

    
    app.controller('familiaCtrl', familiaCtrl);

    familiaCtrl.$inject = ['$filter', '$scope', 'familiaService', 'toastService'];

    function familiaCtrl($filter, $scope, familiaSvc, tS) {
       
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10
        }
        $scope.familias = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;  
        $scope.recordsQuantity = [5, 10, 25, 50, 100, 500, 1000];

        $scope.getFamilias = function() {
            try {
                showLoader();
                $scope.familias = [];
                familiaSvc.getAll($scope.dataSearch).then(response => {
                    $scope.familias = response;
                    $scope.totalRecords = $scope.familias.length > 0 ? $scope.familias[0].totalRecords : 0; 
                    hideLoader();
                }).catch(error => {
                    hideLoader();
                    console.error(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }        

        $scope.getFamilias();

        $scope.pagechanged = function(){
            $scope.getFamilias();
        } 
        
        $scope.changePageSize = function() {
            $scope.dataSearch.pageIndex = 1;
            $scope.getFamilias();
        }

        $scope.resultModal = function(item) {
            $scope.getFamilias();
        }

        $scope.onKeyupSearch = ()=>{
            if(["", null, undefined].includes($scope.dataSearch.bySearch)){
                $scope.changePageSize();
                return
            }
            $scope.familias = $filter('filter')($scope.familias, $scope.dataSearch.bySearch);
            $scope.totalRecords = 0;  
        }
        


        $scope.delete = async function(item){
            try {
                let {isConfirmed} = await Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro/a de eliminar esta Familia ahora?</small>`,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, eliminar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                });
                
                if(isConfirmed){
                    showLoader();
                    familiaSvc.delete(item.idFamilia).then(response => {
                        hideLoader();
                        if (response.code == "0") {
                            tS.toastr('warning', response.message, response.titleSms);                    
                        }
                        if (response.code == "1") {
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.getFamilias();                    
                        }
                    }).catch(error=>{
                        console.log(error);
                        hideLoader();
                    })
                }
                
            } catch (error) {
                hideLoader();
                console.log(error)
            }
                               
        }

    }


})(window.angular)