
(function(){

    'use strict';

    let etiquetaSvc = {};
    let tS = {};

    
    app.controller('etiquetaCtrl', etiquetaCtrl);
    
    etiquetaCtrl.$inject = ['$scope', '$injector', 'modalService'];

    function etiquetaCtrl($scope, $injector, modalSvc) {
      
        etiquetaSvc = $injector.get('etiquetaService');
        tS = $injector.get('toastService');
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 100
        };

        $scope.openModalNew = function() {
            $scope.openModal();
        }
        

        $scope.getAll = function() {
            try {
                
                showLoader();
                
                $scope.etiquetas = [];

                etiquetaSvc.getAll($scope.dataSearch).then(etiquetas => {
                    $scope.etiquetas = etiquetas;
                    hideLoader();                    
                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.getAll();


        $scope.openModal = function(params={}) {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: modalEtiquetaCtrl,
                    template: 'Etiqueta/_ModalAddUpdate.cshtml',
                    size:'md',
                    params
                });

                modalRef.result.then(result => {
                    if(typeof result === 'object'){
                        $scope.getAll();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

        

        $scope.openModalEdit = function(params) {
            $scope.openModal(params);
        }

        $scope.onDelete = function(item) {
            try {
                Swal.fire({
                    title: 'Eliminar Etiqueta?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si!',
                    cancelButtonText: 'No!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        showLoader();
                        etiquetaSvc.delete(item.idEtiqueta).then(response => {
                            if(response.code==="0"){
                                hideLoader();
                                tS.toastr('warning', response.message);
                            }
                            if(response.code==="1"){
                                hideLoader();
                                $scope.getAll();
                                tS.toastr('sucess', response.message);
                            }
                        }).catch(error =>{
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


    app.controller('modalEtiquetaCtrl', modalEtiquetaCtrl);

    modalEtiquetaCtrl.$inject=['$scope', '$uibModalInstance', 'params'];

    function modalEtiquetaCtrl($scope, $uibModalInstance, params) {
        
        $scope.data = {};

        $scope.dataLabel = {
            etiquetas:[],
            readonly:false,
            removable:false,
            edit: true,       
        }
        $scope.etiquetas = []

        if(params.idEtiqueta>0){
            $scope.data = Object.assign({}, params);
            $scope.dataLabel.etiquetas =  $scope.data.etiquetas.split(';');
            $scope.modalTitle = 'Editar';
            $scope.txtSave = 'Actualizar';
            $scope.iconSave = 'ti-pencil';
            $scope.showEstado = true;            
        }else{            
            $scope.modalTitle = 'Nuevo';
            $scope.txtSave = 'Guardar';
            $scope.iconSave = 'ti-save';
        }
       
        $scope.removeRow = function(item) {
            
            if(!($scope.data.idEtiqueta > 0)) return 

            console.log('onChipRemove', $chip, $index);
            Swal.fire({
                title: 'Eliminar Etiqueta',
                icon:'warning',
                html: 'Recuerde no haber usado este etiqueta en algún documento de compras!',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then(result => {
                if(!result.isConfirmed) {                    
                    $scope.dataLabel.etiquetas.push($chip);
                    $scope.$apply();
                }
            })
        }

    
          
        $scope.save = function() {
            try {
               
                if(!$scope.data.descripcion){
                    tS.toastr('warning', 'Ingrese la descripción');
                    return
                }

                if($scope.dataLabel.etiquetas.length === 0){
                    tS.toastr('warning', 'Ingrese al menos una etiqueta');
                    return
                }

                showLoader();

                const data = {
                    descripcion: $scope.data.descripcion,
                    estado: $scope.data.estado,
                    etiquetas: $scope.dataLabel.etiquetas.join(';'),
                }

                if($scope.data.idEtiqueta > 0){
                    etiquetaSvc.update($scope.data.idEtiqueta, data).then($scope.successResponse)
                    .catch(error => {
                        hideLoader();
                        console.log(error);
                    })
                }else{
                    etiquetaSvc.create(data).then($scope.successResponse)
                    .catch(error => {
                        hideLoader();
                        console.log(error);
                    })
                }
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }


        $scope.successResponse = function(response){
            if(response.code==="0"){
                hideLoader();
                tS.toastr('warning', response.message);
            }
            if(response.code==="1"){
                hideLoader();
                tS.toastr('success', response.message);
                $uibModalInstance.close(response);
            }
        }
          

        $scope.closeModal = function(){
            $uibModalInstance.close();
        }

    }

})(window.angular)



