
//@ts-check

(function(){

    'use strict';

    app.controller('empresaCtrl', empresaCtrl);

    empresaCtrl.$inject=['$scope', 'empresaService', 'toastService'];

    function empresaCtrl($scope, empresaSvc, tS){
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            totalRecords: 0,
            maxSize: 5
        }
        $scope.recordsQuantity = [25,50,100];
     


        getEmpresas()
        function getEmpresas(){
            try {
                showLoader();
                let params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize
                }
                $scope.empresas = [];
                empresaSvc.getAll(params).then(response=>{ 
                    $scope.empresas = response; 
                })
                .catch(error=>{ 
                    console.log(error)
                })
                .finally(()=>hideLoader()) ;

            } catch (error) {
                hideLoader();
                console.log(error);                
            }
        } 

        $scope.refresh = function(){
            getEmpresas();
        }

        $scope.pagechanged = function () {
             $scope.refresh();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
             $scope.refresh();
        };
        
    
        
    
        $scope.resultModal = function(result){                      
            if(typeof result ==='object'){
                $scope.refresh()
            }            
        }
    
        $scope.askToDelete = async function(item){
            let {isConfirmed} = await Swal.fire({
                icon:'warning',
                html:`<small>Esta seguro de eliminar esta Empresa: <b>${item.razonSocial}</b></small>`,
                confirmButtonText:'Sí, eliminar',
                showDenyButton:true,
                denyButtonText:'No, cancelar'
            });
            
            if(isConfirmed){
                showLoader();
                empresaSvc.delete(item.idEmpresa).then(response=>{ 
                    if(response.code==="0"){
                        tS.toastr('warning',response.message);
                        return
                    }
                    if(response.code==="1"){                        
                        tS.toastr('success',response.message, response.titleSms);
                        $scope.refresh()
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
                .finally(()=>hideLoader())
            }
        }
    }

})(window.angular)