(function() {

    'use strict';

    const URL_TEMPLATE = '~/Pages/Banco/_ModalAddUpdate.cshtml'

    //Variable servicios 
    let tS = {};  
    let bancoSvc = {};
    let modalSvc = {}

    app.controller('bancoCtrl', bancoCtrl);

    bancoCtrl.$inject = ['$scope', '$injector'];

    function bancoCtrl($scope, $injector) { 
        tS = $injector.get('toastService'); 
        bancoSvc = $injector.get('bancoService');
        modalSvc = $injector.get('modalService');

        
        $scope.data = {};
        $scope.bancos = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 100;
        $scope.recordsQuantity = [5, 10, 25, 50];
        $scope.options = {
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.query = {
            order: 'descripcion',
            limit: 10,
            page: 1
        };

        $scope.initiload  =  function() {
            let params = {
                pageIndex: $scope.pageIndex,
                pageSize: $scope.pageSize
            }
            showLoader();
            bancoSvc.get(params).then(response=>{ 
                $scope.bancos = response;
                $scope.totalRecords = $scope.bancos.length>0? $scope.bancos[0].totalRecords:0
            }).finally(()=>hideLoader()) 
        }
        $scope.initiload();

        $scope.pagechanged = function() {
            $scope.initiload();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.initiload();
        }

        $scope.openModalNew = () => { 
            modalSvc.openModalCustom({
                controller: 'modalBancoCtrl',
                template: URL_TEMPLATE ,
                size: 'md', 
                params: {},
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') {
                    $scope.initiload();
                }
            })
        }

        $scope.openModalUpdate = async (item) => {
            console.log(item)
            modalSvc.openModalCustom({
                controller: 'modalBancoCtrl',
                template: URL_TEMPLATE,
                size: 'md', 
                params: item,
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') {
                    $scope.initiload();
                }
            })
        } 
        $scope.askToDelete = function(data) {
            Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de eliminar esta Banco ahora?</small>',
                showConfirmButton: true,
                confirmButtonText: 'Si,eliminar!',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then((response) => {
                if (response.isConfirmed) {
                    showLoader();
                    bancoSvc.delete(data.idBanco).then(response => {
                        if (response.code == "0") {
                            tS.toastr('warning', response.message, response.titleSms); 
                        }
                        if (response.code == "1") {
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.initiload(); 
                        }
                    }).finally(()=>hideLoader())
                }
            });
        }
 
    }


    app.controller('modalBancoCtrl', modalBancoCtrl);

    modalBancoCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalBancoCtrl($scope, $uibModalInstance, params) {  
    
        if (params.idBanco > 0) {
            $scope.tipoRegistro = 2;
            $scope.titleModal = 'Editar';
            $scope.btnTextSave = 'Actualizar';
            $scope.data = Object.assign({}, params);
        } else {
            $scope.tipoRegistro = 1;
            $scope.titleModal = 'Nuevo';
            $scope.btnTextSave = 'Guardar';
            $scope.data = {}
        }
    
        $scope.obtenerTresLetras = function () {
            if ($scope.data.descripcion && $scope.tipoRegistro == 1) {
                $scope.data.codigo = $scope.data.descripcion.slice(0, 3)
            }
        } 

        $scope.save = function() {
            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Por favor, ingrese la descripción', $scope.tituloModal);
                return;
            }
            if (!$scope.data.codigo) {
                tS.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
                return;
            }

            showLoader();
            if($scope.data.idBanco > 0){
                bancoSvc.put($scope.data.idBanco, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }else if(!($scope.data.idBanco>0)){
                bancoSvc.post($scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }
             
        } 
        $scope.successReponse = function(response) {
            hideLoader();
            if (response.code==='0') {
                tS.toastr('warning', response.message, response.titleSms);            
            }
            if (response.code==='1') {
                tS.toastr('success', response.message, response.titleSms);                            
                $uibModalInstance.close(response)
            }
        } 
        $scope.closeModal = function() {
            $uibModalInstance.close();
        }

    } 



})(window.angular)