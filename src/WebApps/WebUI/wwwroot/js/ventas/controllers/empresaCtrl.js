

(function(){

    'use strict';

    app.controller('empresaCtrl', empresaCtrl);

    empresaCtrl.$inject=['$scope', 'empresaService', 'toastService'];

    function empresaCtrl($scope, empresaSvc, tS){
        
        $scope.initiload = function(){
            try {
                showLoader();
                $scope.empresas = [];
                empresaSvc.get({pageIndex: 1,pageSize: 10}).then(response=>{ 
                    $scope.empresas = response;
                })
                .catch(error=>{
                    hideLoader();
                    console.log(error)
                })
                .finally(()=>hideLoader()) 
            } catch (error) {
                hideLoader();
                console.log(error);                
            }
        }

        $scope.initiload();
    
        
    
        $scope.resultModal = function(result){                      
            if(typeof result ==='object'){
                this.initiload();
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
                    hideLoader();
                    if(response.code==="0"){
                        tS.toastr('warning',response.message);
                        return
                    }
                    if(response.code==="1"){                        
                        tS.toastr('success',response.message, response.titleSms);
                        $scope.initiload();
                    }
                })
            }
        }
    }

})(window.angular)