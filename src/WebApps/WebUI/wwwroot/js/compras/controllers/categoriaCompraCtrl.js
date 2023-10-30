
(function () {
    'use strict';

    app.controller('categoriaCompraCtrl', categoriaCompraCtrl);

    categoriaCompraCtrl.$inject = ['$scope', 'categoriaCompraService', 'toastService'];

    function categoriaCompraCtrl($scope, categoriaCompraSvc, tS) {

        $scope.data = {};
        $scope.categoriaCompras = [];
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.getCategorias = function () {
            try {
                showLoader();
                $scope.categoriaCompras = [];
                const params = {
                    tipo: 1,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSize,
                }
                categoriaCompraSvc.get(params).then(response => {
                    $scope.categoriaCompras = response
                    $scope.totalRecords = $scope.categoriaCompras.length > 0 ? $scope.categoriaCompras[0].totalRecords : 0
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                $scope.categoriaCompras = [];
                console.log(error);
            }
        }
        $scope.getCategorias();

        $scope.pagechanged = function () {
            $scope.getCategorias();
        }

        $scope.changePageSize = function () {
            $scope.pageIndex = 1;
            $scope.getCategorias();
        }

        $scope.resultModal = (result) => {
            if (typeof result === 'object') {
                $scope.getCategorias();
            }
        }
        //Eliminar categoria
        $scope.delete = function (params) {
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
                    showLoader();
                    categoriaCompraSvc.delete(params.idCategoriaCompra).then(response => {
                        if (response.code == "0") {
                            tS.toastr('warning', response.message, response.titleSms);
                        }
                        if (response.code == "1") {
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.getCategorias();
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                }
            })
        }
    }
})(window.angular);