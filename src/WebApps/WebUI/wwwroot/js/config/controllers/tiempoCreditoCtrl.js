(function () {

    'use strict';
  
    const URL_TEMPLATE = '~/Pages/TiempoCredito/'

    //Variable servicios 
    let tS = {}; 
    let tiempoCreditoSvc = {}; 


    app.controller('tiempoCreditoCtrl', tiempoCreditoCtrl);

    tiempoCreditoCtrl.$inject = [
        '$scope',
        '$injector', 
        'modalService', 
    ];

    function tiempoCreditoCtrl($scope, $injector, modalSvc) {

        tS = $injector.get('toastService');
        commonSvc = $injector.get('commonService');
        tiempoCreditoSvc = $injector.get('tiempoCreditoService');
        modalSvc = $injector.get('modalService');

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10000;
        $scope.recordsQuantity = [5, 10, 25, 50];
        $scope.dataSearch = {
            pageIndex: $scope.pageIndex,
            pageSize: $scope.pageSize
        };

        $scope.openModal = async function (params) {
            try {
                modalSvc.openModalCustom({
                    controller: 'modalTiempoCreditoCtrl',
                    template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
                    size: 'md',
                    params: params ?? {},
                    isRenderRazorPartial: true
                }).result.then(response => {
                    if (typeof response === 'object') {
                        $scope.getTiempoCreditos();
                    }
                }) 
            } catch (error) {
                console.log(error)
            }
        }

        $scope.getTiempoCreditos = function () {
            try {
                showLoader();
                tiempoCreditoSvc.get($scope.dataSearch).then(response => {
                    $scope.tiempoCreditos = response;
                    $scope.totalRecords = $scope.tiempoCreditos.length > 0 ? $scope.tiempoCreditos[0].totalRecords : 0;
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }
        $scope.getTiempoCreditos();


        //Eliminar Tiempo Credito
        $scope.askToDelete = function (item) {
            try {
                Swal.fire({
                    html: `<small>Esta seguro/a de eliminar este registro ahora?</small> `,
                    icon: 'warning',
                    confirmButtonText: `Sí, eliminar!`,
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar!',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        showLoader();
                        tiempoCreditoSvc.delete(item.idTiempoCredito).then(response => { 
                            if (response.code == "0") {
                                tS.toastr('warning', response.message, response.titleSms);
                            }
                            if (response.code == "1") {
                                tS.toastr('success', response.message, response.titleSms);
                                $scope.getTiempoCreditos();
                            }
                        })
                        .finally(()=>hideLoader())
                        .catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                    }
                })
            } catch (error) {
                hideLoader();
            }
        }
    }



    app.controller('modalTiempoCreditoCtrl', modalTiempoCreditoCtrl);

    modalTiempoCreditoCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalTiempoCreditoCtrl($scope, $uibModalInstance, params) {
        $scope.tipoRegistro = 1;
        $scope.data = {};
        $scope.data.tipo = true;
        $scope.data.entrada = false;

        $scope.onInit = function () {
            try {
                if (params.idTiempoCredito > 0) {
                    $scope.tipoRegistro = 2;
                    $scope.data = Object.assign({}, params);
                }


            } catch (error) {
                console.log(error);
            }
        }
        $scope.onInit();

        $scope.onChangeTipo = function () {
            if ($scope.data.tipo) {
                $scope.data.diasCredito = 0;
                $scope.data.numeroCuota = 1;
                $scope.data.entrada = false;
            }
        }
        $scope.onChangeTipo();


        $scope.validarCampo = function (campo) {
            return [null, undefined, ""].includes(campo) ? true : false;
        }

        $scope.saveAndUpdate = function () {
            const tituloToastr = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';
            let regex = /^(null|undefined|\s*)$/;

            if (regex.test($scope.data.descripcion)) {
                tS.toastr('warning', 'Ingrese la descripción', tituloToastr);
                return;
            }
            //Si es opcion  Credito 
            if ($scope.data.tipo === false) {
                if (regex.test($scope.data.diasCredito)) {
                    tS.toastr('warning', 'Ingrese el Dias de Crédito', tituloToastr);
                    return;
                }
                if (!($scope.data.diasCredito > 0)) {
                    tS.toastr('warning', 'Dias de Credito tiene que ser mayor a 0 días', tituloToastr);
                    return;
                }
                if (regex.test($scope.data.numeroCuota)) {
                    tS.toastr('warning', 'Por favor, ingrese el Número de Cuota', tituloToastr);
                    return;
                }
                if (!($scope.data.numeroCuota > 0)) {
                    tS.toastr('warning', 'El Número de Cuota tiene que ser mayor a 0', tituloToastr);
                    return;
                }
            }
            if ($scope.data.tipo) {
                if ($scope.data.diasCredito !== 0) {
                    tS.toastr('warning', 'Los Días de Crédito no tiene que ser mayor a 0', tituloToastr);
                    return;
                }
                if ($scope.data.numeroCuota > 1) {
                    tS.toastr('warning', 'Número de Cuota tiene que ser igual a 1', tituloToastr);
                    return;
                }
                if ($scope.data.entrada) {
                    tS.toastr('warning', 'El Contado no lleva la Entrada ', tituloToastr);
                    return;
                }
            }

            //Tipo de Gestion(Compra/Venta)
            if (regex.test($scope.data.gestion)) {
                tS.toastr('warning', 'Marque el Tipo de Gestión', tituloToastr);
                return;
            }

            showLoader();

            if ($scope.data.idTiempoCredito > 0) {
                tiempoCreditoSvc.update($scope.data.idTiempoCredito, $scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            } else if (!($scope.data.idTiempoCredito > 0)) {
                tiempoCreditoSvc.save($scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
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