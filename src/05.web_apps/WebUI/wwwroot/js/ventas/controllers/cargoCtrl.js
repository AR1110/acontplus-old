

(function(){

    'use strict';

    app.controller('cargoCtrl', cargoCtrl);
    cargoCtrl.$inject=['$scope', 'mainService', 'toastService'];

    function cargoCtrl($scope, mS, tS){
        $scope.cargos    = [];        
   

        $scope.initiload = function(){
            showLoader();
            $scope.cargos = [];
            mS.getData('get','/Cargo/Get?json=' + JSON.stringify({})).then(response=>{
                hideLoader();
                if(response.code==="0"){                
                    console.log(response);                
                }
                if(response.code==="1"){
                    $scope.cargos = JSON.parse(response.data);            
                }
            }).catch(error=>{
                hideLoader();
                console.log(error);
            })
        }
        $scope.initiload();

    
        $scope.resultModal = function(result){
            if(typeof result === 'object'){
                $scope.initiload();
            }
        }

        $scope.askToDelete = async function(item){
            let {isConfirmed} = await Swal.fire({
                icon:'warning',
                html:`<small>Esta seguro de eliminar este Cargo <b>${item.descripcion}</b> ahora?</small>`,
                confirmButtonText:'Sí, eliminar',
                showDenyButton:true,
                denyButtonText:'No, cancelar',
                allowOutsideClick:false
            });

            if(isConfirmed){
                mS.getData('post', '/Cargo/Delete?id='+item.idCargo).then(response=>{
                    if(response.id==="0"){
                        tS.toastr('warning', response.message, response.titleSms);
                        return
                    }
        
                    if(response.id==="1"){
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.initiload();
                    }
                })
            }
        }
    }
})(window.angular);