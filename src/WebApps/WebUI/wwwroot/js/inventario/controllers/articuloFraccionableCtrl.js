(function() {

    'use strict';

    app.controller('articuloFraccionableCtrl', articuloFraccionableCtrl);

    articuloFraccionableCtrl.$inject = ['$scope','mainService', 'modalService', 'nombreModalInventario', 'toastService'];

    function articuloFraccionableCtrl($scope, mS, modalSvc, nombreModalInventario, tS) {

        $scope.datSearch = {
            pageIndex: 1,
            pageSize: 10
        };


        $scope.openModal = async function(item) {
            try {
                const {fileCtrl, controller, template} = nombreModalInventario.ARTICULO_FRACCIONADO
                let ctrl = (await import(fileCtrl))[controller]
                const modalRef = modalSvc.openModalCustom({
                    controller: ctrl,
                    template,
                    size: 'xl',
                    params: item
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




        $scope.getAllArticuloFraccionado = function() {
            try {
                $scope.articuloFraccionados = [];
                showLoader();
                mS.getData('get', '/ArticuloFraccionado/Get?json=' + JSON.stringify($scope.dataSearch)).then(
                    response => {
                        hideLoader();
                        if (response.code == "0") {                            
                            console.log(response)
                        }
                        if (response.code === "1") {
                            $scope.articuloFraccionados = JSON.parse(response.payload) || [];
                            hideLoader();

                        }
                    }
                ).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                console.log(error);
            }

        }

        $scope.getAllArticuloFraccionado();

        $scope.askToDelete = async function(item) {

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
                            tS.toastr('warning',response.message);
                        }
                        if (response.id == "1") {
                            tS.toastr('success',response.message);
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

