(function () {

    'use strict';

    app.controller('articuloFraccionableCtrl', articuloFraccionableCtrl);

    articuloFraccionableCtrl.$inject = [
        '$scope',
        'articuloFraccionadoService',
        'modalService',
        'nombreModalInventario',
        'toastService'
    ];

    function articuloFraccionableCtrl($scope, articuloFraccionadoSvc, modalSvc, nombreModalInventario, tS) {

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
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
                    params: item || {},
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
                const params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    tipo: 1,
                    textSearch: ["", null, undefined].includes($scope.dataSearch.textSearch) ? null : $scope.dataSearch.textSearch
                }
                articuloFraccionadoSvc.get(params).then(response => {
                    $scope.articuloFraccionados = response;
                    $scope.dataSearch.totalRecords = $scope.articuloFraccionados.length > 0 ? $scope.articuloFraccionados[0].totalRecords : 0
                })
                    .catch(error => {
                        $scope.dataSearch.totalRecords = 0;
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                console.log(error);
            }

        }

        $scope.getAllArticuloFraccionado();

        $scope.onChangeTextSearch = function () {
            try {
                $scope.getAllArticuloFraccionado();

            } catch (error) {
                console.log(error)
            }
        }

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
                    showLoader();
                    articuloFraccionadoSvc.delete(item.idArticuloFraccionado).then(response => {
                        if (response.code == "0") {
                            tS.toastr('warning', response.message);
                        }
                        if (response.code == "1") {
                            tS.toastr('success', response.message);
                            $scope.getAllArticuloFraccionado();
                        }
                    }).finally(() => hideLoader())
                }
            } catch (error) {
                console.log(error);
            }
        }


    }
})(window.angular)

