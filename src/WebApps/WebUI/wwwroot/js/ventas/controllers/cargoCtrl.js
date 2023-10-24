

(function(){

    'use strict';

    app.controller('cargoCtrl', cargoCtrl);
    cargoCtrl.$inject=[
        '$scope',  
        'cargoService',
        'toastService'
    ];

    function cargoCtrl($scope, cargoSvc, tS){
        $scope.cargos    = [];        
   

        $scope.initiload = function(){
            showLoader();
            cargoSvc.get({pageIndex: 1}).then(response=>{ 
                $scope.cargos = response;     
            })
            .catch(error=>{
                console.log(error)
            })
            .finally(()=>hideLoader()) 
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
                cargoSvc.delete(item.idCargo).then(response=>{
                    if(response.code==="0"){
                        tS.toastr('warning', response.message, response.titleSms); 
                    } 
                    if(response.code==="1"){
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.initiload();
                    }
                })
            }
        }
    }
})(window.angular);