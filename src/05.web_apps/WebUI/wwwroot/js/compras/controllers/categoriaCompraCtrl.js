
(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('categoriaCompraCtrl', categoriaCompraCtrl);

    categoriaCompraCtrl.$inject = ['$scope', 'mainService', 'modalService', 'nombreModal', 'formulario', 'toastService'];

    function categoriaCompraCtrl($scope, mS, _modalSvc, _nombreModal, form, toast) {
        
        $scope.data = {};
        $scope.categoriaCompras = [];


        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.getCategorias = function() {
            try {
                showLoader();
                $scope.categoriaCompras = [];
                mS.getData('get', '/CategoriaCompra/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                    hideLoader();
                    if (response.id == "0") {                        
                        $scope.categoriaCompras=[];
                        toast.toastr("warning", response.message, response.titleSms);
                        return
                    }                
                    if(response.id == "1") {                        
                        $scope.categoriaCompras = response.data;  
                                  
                        $scope.totalRecords = $scope.categoriaCompras.length>0?  $scope.categoriaCompras[0].totalRecords: 0
                    }
                }).catch(error => {
                    $scope.categoriaCompras = [];
                    console.log(error)
                    hideLoader();
                })
            } catch (error) {
                hideLoader();
                $scope.categoriaCompras =[];
                console.log(error);
            }
        }
        $scope.getCategorias();

        $scope.pagechanged = function() {
            $scope.getCategorias();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.getCategorias();
        }

       
        $scope.openModalCategoriaCompra= async(data)=>{
            if(data){
                data = data.categoria
            }
            
            let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModal.categoria_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
            let template   = MODAL_NUEVO['template'];

            let modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size:'md',
                params: data
            })
         

            modalRef.result.then(result=>{
                if(typeof result==='object'){
                    $scope.getCategorias();
                }
            })
        }


        //Eliminar categoria
        $scope.delete = function({ idCategoriaCompra }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar esta Categoria de Compra ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: `Sí, eliminar!`,
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    mS.getData('post', '/CategoriaCompra/Delete?idCategoriaCompra=' + idCategoriaCompra).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getCategorias();
                            return
                        }
                    }, error => console.log(error))
                }
            })
        }



        $("#agregar").on('hide.bs.modal', e => {
            $scope.data = {};
            $scope.getCategorias();
        })
    }
})(window.angular);