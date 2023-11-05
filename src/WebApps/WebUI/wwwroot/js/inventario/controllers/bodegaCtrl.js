(function () {

    'use strict';


    const URL_TEMPLATE = '~/Pages/Bodega/'

    //Variable servicios 
    let tS = {}; 
    let commonSvc = {};
    let bodegaSvc = {};
    let modalSvc = {}

    app.controller('bodegaCtrl', bodegaCtrl)

    bodegaCtrl.$inject = [
        '$scope',
        '$injector',
        'mainService',
        'bodegaService', 
    ];

    function bodegaCtrl($scope, $injector) {  
        tS = $injector.get('toastService');
        commonSvc = $injector.get('commonService');
        bodegaSvc = $injector.get('bodegaService');
        modalSvc = $injector.get('modalService');

        $scope.bodegas = [];
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10
        }
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.recordsQuantity = [5, 10, 25, 50]

        $scope.getBodegas = async () => {
            try {
                showLoader();
                bodegaSvc.get($scope.dataSearch).then(response => {
                    $scope.bodegas = response;
                    $scope.totalRecords = $scope.bodegas.length > 0 ? $scope.bodegas[0].totalRecords : 0;
                }).finally(()=>hideLoader())

            } catch (error) {
                console.log(error)
            } 
        }
        $scope.getBodegas();

        $scope.pagechanged = () => $scope.getBodegas();


        $scope.changePageSize = () => {
            $scope.dataSearch.pageIndex = 1;
            $scope.getBodegas();
        }

        $scope.openModalNew = () => {

            modalSvc.openModalCustom({
                controller: 'modalBodegaCtrl',
                template: URL_TEMPLATE + '_ModalNuevo.cshtml',
                size: 'md', 
                params: {
                    tipoRegistro: 'N'
                },
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') {
                    $scope.getBodegas();
                }
            })
        }

        $scope.openModalUpdate = async (item) => {
            modalSvc.openModalCustom({
                controller: 'modalBodegaCtrl',
                template: URL_TEMPLATE + '_ModalEditar.cshtml',
                size: 'md', 
                params: {
                    data: item,
                    tipoRegistro: 'E'
                },
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') {
                    $scope.getBodegas();
                }
            })
        }
 
        $scope.askToDelete = async (item) => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            let { isConfirmed } = await swalWithBootstrapButtons.fire({
                title: '<small>Eliminar Bodega</small>',
                html: '<small>Esta seguro de eliminar este bodega ahora?</small>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false
            })

            if (isConfirmed) {
                showLoader();
                bodegaSvc.delete(item.idBodega).then(response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getBodegas();
                    }
                }).finally(()=>hideLoader())
            }

        }
    }


    app.controller('modalBodegaCtrl', modalBodegaCtrl);

    modalBodegaCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalBodegaCtrl($scope, $uibModalInstance, params) {
        let { tipoRegistro, data } = params;
        $scope.tipoRegistro = tipoRegistro;
        $scope.data = Object.assign({}, data) || {};
        $scope.showEstado = !$scope.data.estado;


        initiload();

        function initiload() {
            showLoader();
            commonSvc.getEstabAsign().then(response => {                
                $scope.sucursales = response;
            }).finally(()=>hideLoader())
        }

        $scope.onSave = function() {
            let tituloModal = $scope.tipoRegistro === 'N' ? 'Guardar' : 'Actualizar'

            if (!$scope.data.codEstab) {
                tS.toastr('warning', 'Seleccione la Sucursal', tituloModal);
                return;
            }

            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Ingrese la descripción', tituloModal);
                return;
            }
 

            showLoader();

            if($scope.data.idBodega > 0){
                bodegaSvc.update($scope.data.idBodega, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }else if(!($scope.data.idBodega>0)){
                bodegaSvc.save($scope.data).then($scope.successReponse)
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