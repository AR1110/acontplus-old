(function () {

    'use strict';

    app.controller('articuloFraccionableCtrl', articuloFraccionableCtrl);

    articuloFraccionableCtrl.$inject = [
        '$scope',
        'mainService',
        'articuloFraccionadoService',
        'modalService',
        'nombreModalInventario',
        'toastService'
    ];

    function articuloFraccionableCtrl($scope, mS, articuloFraccionadoSvc, modalSvc, nombreModalInventario, tS) {

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            tipo: 1,
            pageSize: 50,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
        };


        $scope.openModal = async function (item) {
            try {
                const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO
                let ctrl = (await import(fileCtrl))[controllers['AF']]
                let template = templates['AF']
                const modalRef = modalSvc.openModalCustom({
                    controller: ctrl,
                    template,
                    size: 'xl',
                    params: item,
                    isRenderRazorPartial: true
                })
                modalRef.result.then(res => {
                    if (typeof res === 'object') {
                        $scope.getAllArticuloFraccionado();
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }




        $scope.getAllArticuloFraccionado = function () {
            try {
                $scope.articuloFraccionados = [];
                showLoader();
                articuloFraccionadoSvc.get($scope.dataSearch).then(response => {
                    $scope.articuloFraccionados = response;
                    $scope.dataSearch.totalRecords = $scope.articuloFraccionados.length > 0 ? $scope.articuloFraccionados[0].totalRecords : 0
                    console.log(response)
                }).finally(() => hideLoader())
            } catch (error) {
                console.log(error);
            }

        }

        $scope.getAllArticuloFraccionado();

        $scope.pagechanged = function () {
            $scope.getAllArticuloFraccionado();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getAllArticuloFraccionado();
        };


        $scope.askToDelete = async function (item) {

            try {
                let {
                    isConfirmed
                } = await Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro/a de eliminar este registro ahora</small>`,
                    confirmButtonText: 'Si, eliminar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                })

                if (isConfirmed) {
                    mS.getData('delete', '/ArticuloFraccionado/Delete?id=' + item.idArticuloFraccionado).then(response => {
                        if (response.id == "0") {
                            tS.toastr('warning', response.message);
                        }
                        if (response.id == "1") {
                            tS.toastr('success', response.message);
                            $scope.getAllArticuloFraccionado();
                        }
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }


    }
})(window.angular)

