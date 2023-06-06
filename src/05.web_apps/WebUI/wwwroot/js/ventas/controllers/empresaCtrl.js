

(function(){

    'use strict';

    app.controller('empresaCtrl', empresaCtrl);

    empresaCtrl.$inject=['$scope', 'mainService', 'toastService'];

    function empresaCtrl($scope, mS, tS){
        
        $scope.initiload = function(){
            try {
                showLoader();
                $scope.empresas = [];
                mS.getData('get', '/Empresa/Get?json=' + JSON.stringify({})).then(response=>{
                    hideLoader();
                    console.log(response);
                    if(response.code==="0"){                        
                        console.log(response)
                        return
                    }
                    if(response.code==="1"){
                        $scope.empresas = JSON.parse(response.payload) || [];            
                    }
                })
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
                mS.getData('post', '/Empresa/Delete?id=' + item.idEmpresa).then(response=>{
                    hideLoader();
                    if(response.id==="0"){
                        tS.toastr('warning',response.message);
                        return
                    }
                    if(response.id==="1"){                        
                        tS.toastr('success',response.message, response.titleSms);
                        $scope.initiload();
                    }
                })
            }
        }
    }

})(window.angular)