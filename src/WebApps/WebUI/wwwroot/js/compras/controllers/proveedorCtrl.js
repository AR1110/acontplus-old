(function () {
    'use strict';

    app.controller('proveedorCtrl', proveedorCtrl);
    proveedorCtrl.$inject = [
        '$scope',
        'proveedorService',
        'toastService'
    ];

    function proveedorCtrl($scope, proveedorSvc, tS) {
        $scope.proveedores = [];
        $scope.dataSearch = {
            textSearch: null,
            pageIndex: 1,
            pageSize: 10
        }
        $scope.recordsQuantity = [10, 25, 50, 100]
        $scope.totalRecords = 0;
        $scope.maxSize = 5;

        $scope.resultModal = function (result) {            
            if (typeof result === 'object') {
                $scope.getProveedores();
            }
        }

        $scope.getProveedores = () => {
            try {
                showLoader();
                $scope.proveedores = [];
                let params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    textSearch: $scope.dataSearch.textSearch || undefined
                }
                proveedorSvc.get(params).then(response => {                    
                    $scope.proveedores = response || []
                    $scope.totalRecords = $scope.proveedores.length > 0 ? $scope.proveedores[0].totalRecords : 0;
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                $scope.totalRecords = 0;
                console.error(error)
            }
        }

        $scope.getProveedores();

        $scope.pagechanged = function () {
            $scope.getProveedores();
        }

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getProveedores();
        }


        $scope.onKeyupSearchProveedor = () => {
            $scope.getProveedores();
        }

        $scope.reloadProveedores = () => {
            $scope.dataSearch.textSearch = undefined;
            $scope.getProveedores();
        }

        $scope.askToDelete = async (item) => {
            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                html: `<small>Esta Ud. seguro de eliminar el Proveedor <b>${item.razonSocial}</b>?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si',
                showCancelButton: true,
                cancelButtonText: 'No', 
            })

            if (isConfirmed) {
                proveedorSvc.delete(item.idProveedor).then(response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getProveedores();
                    }
                })
            }
        }
    }
})(window.angular)