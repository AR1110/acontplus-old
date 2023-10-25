(function () {
    'use strict';

    const URL_TEMPLATE = '~/Pages/TipoEntidad/'
    const URL = 'Config/TipoEntidad/'
    let mS = {};
    let tS = {};
    let tipoEntidadSvc = {};

    class TipoEntidadService {
        constructor(mS) {
            this.mS = mS;
        }

        get(params) {
            return this.mS.getData('get', `${URL}?json=${JSON.stringify(params)}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === "1") { 
                    return JSON.parse(response.payload)
                }
            })
        }

        post(data) {
            return mS.getData('post', `${URL}Insert/?json=${JSON.stringify(data)}`, null, true);
        }

        put(id, data) {
            return mS.getData('put', `${URL}Update/${id}?json=${JSON.stringify(data)}`, null, true);
        }

        delete(id) {
            return mS.getData('delete', URL + 'Delete/' + id, null, true);
        }

    }


    app.controller('tipoEntidadCtrl', tipoEntidadCtrl);

    tipoEntidadCtrl.$inject = ['$scope', '$injector', 'modalService'];

    function tipoEntidadCtrl($scope, $injector, modalSvc) {
        mS = $injector.get('mainService');
        tS = $injector.get('toastService');
        tipoEntidadSvc = new TipoEntidadService(mS);

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 100
        }

        $scope.openModal = function (params) {
            try {
                modalSvc.openModalCustom({
                    controller: 'modalTipoEntidadCtrl',
                    template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
                    size: 'md',
                    params: params || {},
                    isRenderRazorPartial: true
                }).result.then(response => {
                    if (typeof response === 'object') {
                        $scope.initiLoad();
                    }
                }) 
            } catch (error) {
                console.log(error);
            }
        }

        $scope.initiLoad = function () {
            try {
                showLoader();
                tipoEntidadSvc.get($scope.dataSearch).then(response => {
                    $scope.tipoEntidades = response;
                    $scope.totalRecords = $scope.tipoEntidades.lenght > 0 ? $scope.tipoEntidades[0].totalRecords : 0
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
            }
        }

        $scope.initiLoad();


        $scope.askToDelete = function (item) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Tipo Entidad ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    showLoader();
                    tipoEntidadSvc.delete(item.idTipoEntidad).then(response => { 
                        if (response.code == "0") {
                            tS.toastr('warning', response.message, response.titleSms);
                        }
                        if (response.code == "1") {
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.initiLoad();
                        }
                    })
                    .finally(()=>hideLoader())
                    .catch(error => {
                        hideLoader();
                        console.log(error)
                    })
                }
            })
        }

    } 

    app.controller('modalTipoEntidadCtrl', modalTipoEntidadCtrl);

    modalTipoEntidadCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalTipoEntidadCtrl($scope, $uibModalInstance, params) {
        $scope.tipoRegistro = 1;
        $scope.data = Object.assign({}, params);

        if (params.idTipoEntidad > 0) {
            $scope.tipoRegistro = 2;
            $scope.titleModal = 'Editar';
            $scope.btnText = 'Actualizar';
        } else {
            $scope.titleModal = 'Nuevo';
            $scope.btnText = 'Guardar';
        }

        $scope.onKeyupDescripcion = function () {
            if ($scope.tipoRegistro !== 1) return;

            if ($scope.data.descripcion) {
                $scope.data.codigo = $scope.data.descripcion.slice(0, 3);
            } else {
                $scope.data.codigo = null;
            }
        }

        $scope.save = function () {
            try {
                var regex = /^(null|undefined|\s*)$/;

                if (regex.test($scope.data.descripcion)) {
                    tS.toastr('warning', 'Ingrese la descripcion')
                    return
                }
                if (regex.test($scope.data.codigo)) {
                    tS.toastr('warning', 'Ingrese el código')
                    return
                }

                showLoader();

                if ($scope.data.idTipoEntidad > 0) {
                    tipoEntidadSvc.put($scope.data.idTipoEntidad, $scope.data).then($scope.successReponse)
                        .catch(err => {
                            hideLoader();
                            console.log(err);
                        })
                } else if (!($scope.data.idTipoEntidad > 0)) {
                    tipoEntidadSvc.post($scope.data).then($scope.successReponse)
                        .catch(err => {
                            hideLoader();
                            console.log(err);
                        })
                } 
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }

        $scope.successReponse = function (response) {
            hideLoader();
            if (response.code === '0') {
                tS.toastr('warning', response.message, response.titleSms);
            }
            if (response.code === '1') {
                tS.toastr('success', response.message, response.titleSms);
                $uibModalInstance.close(response)
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

    }

})(window.angular)

