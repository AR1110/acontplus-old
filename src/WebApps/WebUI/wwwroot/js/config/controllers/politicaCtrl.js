(function () {
    'use strict';

    app.controller('politicaCtrl', politicaCtrl);

    politicaCtrl.$inject = [
        '$scope', 
        'politicaService',
        'toastService',
        'formulario'
    ];

    function politicaCtrl($scope, politicaSvc, tS, form) {

        $scope.data = {}
        $scope.politica = {}
        $scope.politicas = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]


        $scope.getPoliticas = function () {
            const params = {
                tipo: 1,
                pageIndex: $scope.pageIndex,
                pageSize: $scope.pageSize
            }
            showLoader();
            politicaSvc.get(params).then(response => {
                $scope.politicas = response;
                $scope.totalRecords = $scope.politicas.length > 0 ? $scope.politicas[0].totalRecords : 0;
            }).finally(() => hideLoader())

        }
        $scope.getPoliticas();

        $scope.pagechanged = function () {
            $scope.getPoliticas()
        }

        $scope.changePageSize = function () {
            $scope.pageIndex = 1;
            $scope.getPoliticas();
        }

        //Abrir Modal Politica y Acceso
        $scope.abrirModal = function (data, type) {
            $scope.type = type;
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.iconoModal = type == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? ' Nuevo' : 'Editar';
            $scope.icono = type == 1 ? 'ti-save' : 'fa fa-edit';
            $scope.btnModal = type == 1 ? ' Guardar' : ' Actualizar';
            $scope.data = type == 1 ? {} : { ...data };
            $('#agregar').modal('show');
            return;
        }

        $scope.$watch('data.descripcion', function (des) {
            if (!form.campo(des) && $scope.type == 1) {
                $scope.data.codigo = form.obtenerTresLetras(des);
            }
        })

        $scope.saveUpdate = function () {
            if (form.campo($scope.data.descripcion)) {
                tS.toastr('warning', 'Por favor, ingrese la descripcion', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                tS.toastr('warning', 'Por favor, ingrese el código', $scope.tituloModal);
                return;
            }

            showLoader();

            if ($scope.data.idPolitica > 0) {
                politicaSvc.update($scope.data.idPolitica, $scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            } else if (!($scope.data.idPolitica > 0)) {
                politicaSvc.save($scope.data).then($scope.successReponse)
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
                $("#agregar").modal('hide');
            }
        }

        $scope.delete = async function (data) {
            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar esta Politica?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            });
            if (isConfirmed) {
                showLoader();
                politicaSvc.delete(data.idPolitica).then(response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getPoliticas();
                    }
                }).finally(() => hideLoader())
            }
        };

        $('#agregar').on('hide.bs.modal', () => {
            $scope.data = {};
            $scope.getPoliticas();
        });

        /**----------------------------------------------------ASIGNACION DE ACCESOS ----------------- */
        $scope.openModalAcceso = function (item) {
            $scope.nombrePolitica = item.descripcion;
            showLoader();
            politicaSvc.getAcceso({
                tipo: 1,
                idPolitica: item.idPolitica
            }).then(response => {
                $scope.accesos = response[0]
            }).finally(()=>hideLoader())
            $("#modalAcceso").modal('show');
        };


        $scope.guardarAcceso = async function () {
            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                //title: 'Insumos',
                html: `<small>Esta seguro/a de guardar los accesos asignados a la Politica <strong>${$scope.nombrePolitica}</strong></small>`,
                showDenyButton: true,
                confirmButtonText: `Si, guardar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            });

            if (isConfirmed) {
                showLoader();
                politicaSvc.updateAcceso($scope.accesos).then(response => {
                    if (response.code === "0") {
                        form.sweetAlert('warning', response.message, response.titleSms); 
                    }
                    if (response.code === "1") {
                        form.sweetAlert('success', response.message, response.titleSms, 1000);
                        $("#modalAcceso").modal('hide'); 
                    }
                }).finally(()=>hideLoader()) 
            }
        };

        $("#modalAcceso").on('hide.bs.modal', () => {
            $scope.searchAcceso = '';
            $scope.accesos = [];
        }) 

    }


})(window.angular)