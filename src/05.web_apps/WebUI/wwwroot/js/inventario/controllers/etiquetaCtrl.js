
(function(){

    'use strict';

    let etiquetaSvc = {};
    let tS = {};

    app.directive('forceChipEnable', forceChipEnable);
    
    function forceChipEnable() {
        return {
            require: ['?^mdChips', '?^mdChip'],
            link: function(scope, element, attrs, controllers) {
                if (controllers) {
                    console.log(controllers)
                    let chipsCtrl = controllers[0];
                    let chipCtrl = controllers[1];
                    
                    chipsCtrl.enableChipEdit = true;
                    chipCtrl.init(chipsCtrl);
                }
            }
        }
    }
    
    app.controller('etiquetaCtrl', etiquetaCtrl);
    
    etiquetaCtrl.$inject = ['$scope', '$injector', 'modalService', 'decodeToken'];

    function etiquetaCtrl($scope, $injector, modalSvc, decodeToken) {
      
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
        
        $scope.data = {}
        $scope.etiquetas = []

        if(params.idEtiqueta>0){
            $scope.data = Object.assign({}, params);
            
            $scope.etiquetas =$scope.data.etiquetas;
            $scope.modalTitle = 'Editar';
            $scope.txtSave = 'Actualizar';
            $scope.iconSave = 'ti-pencil';
            $scope.isNew = false;
            $scope.showEstado = !$scope.data.estado;
        }else{
            $scope.isNew = true
            $scope.modalTitle = 'Nuevo';
            $scope.txtSave = 'Guardar';
            $scope.iconSave = 'ti-save';
        }

        $scope.addRow = function() {
            $scope.etiquetas.push({
                codigo: null,
                descripcion: null,
            });
        };

        $scope.removeRow = function(item) {
            
            let index = $scope.etiquetas.indexOf(item)

            if(!($scope.data.idEtiqueta > 0)) {
                $scope.etiquetas.splice(index, 1);
            }

            
            Swal.fire({
                title: 'Eliminar Etiqueta',
                icon:'warning',
                html: `Recuerde no haber usado este etiqueta en algún documento de compras!`,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then(result => {
                if(result.isConfirmed) {                    
                    $scope.etiquetas.splice(index, 1);
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

                if($scope.etiquetas.length === 0){
                    tS.toastr('warning', 'Ingrese al menos una etiqueta');
                    return
                }

                const codigos = new Set();

                for (const codigoObjeto of $scope.etiquetas) {
                    if(!codigoObjeto.codigo){
                        tS.toastr('warning', `Los código son obligatorios`);
                        return
                    }

                    if(!codigoObjeto.descripcion){
                        tS.toastr('warning', `Los código son obligatorios`);
                        return
                    }
                    if (codigos.has(codigoObjeto.codigo)) {                     
                        tS.toastr('warning', `El código ${codigoObjeto.codigo} ya ha sido ingresado anteriormente`);
                        return
                    } else {
                        // El código no existe aún, agregarlo al conjunto "codigos"
                        codigos.add(codigoObjeto.codigo);
                        console.log(`El código ${codigoObjeto.codigo} se ha agregado correctamente`);
                    }

                    codigoObjeto.codigo.trim();
                    codigoObjeto.descripcion.trim();
                }

                showLoader();

                const data = {
                    descripcion: $scope.data.descripcion,
                    estado: $scope.data.estado,
                    etiquetas: JSON.stringify($scope.etiquetas),
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



