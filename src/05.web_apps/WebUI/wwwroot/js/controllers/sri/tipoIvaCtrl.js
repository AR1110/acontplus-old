(function() {
    'use strict';


    angular.module('acontPlusApp')
        .controller('tipoIvaCtrl', tipoIvaCtrl);

    tipoIvaCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function tipoIvaCtrl($scope, mS, toast, form) {
        $scope.data = {};
        $scope.tipoIvas = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]

        $scope.get = function() {
            mS.getData('get', '/TipoIva/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                console.log(response.data)
                $scope.tipoIvas = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;
            }, error => console.log(error));
        }

        $scope.get();

        $scope.pagechanged = function() {
            $scope.get();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.get();
        }

        $scope.abrirModal = function(data, type) {
            $scope.type = type;
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.iconoModal = type == 1 ? 'fa fa-plus' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? 'Agregar' : 'Actualizar'
            $scope.btnTitulo = type == 1 ? 'Guardar' : 'Actualizar';
            $scope.btnColor = type == 1 ? ' btn-info' : 'btn-success';
            $scope.icono = type == 1 ? 'fa fa-save' : 'fa fa-edit';
            if (type == 2) {
                $scope.data = data;
            }
            $('#agregarTipoIva').modal('show');
            return;
        }

        $scope.$watch('data.descripcion', newVal => {
            if (!form.campo(newVal) && $scope.type == 1) {
                $scope.data.codigo = newVal.substring(0, 3).replace(/[^-A-Za-z0-9]+/g, '').toUpperCase();
            } else {
                $scope.data.codigo = '';
            }
        });

        $scope.saveUpdate = function(type) {
            if (form.campo($scope.data.codigoSRI)) {
                toast.toastr('warning', 'Ingrese el Código SRI', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', $scope.tituloModal);
                return;
            }
            if (["null", "undefined", ""].includes($scope.data.porcentaje)) {
                toast.toastr('warning', 'Ingrese el Porcentaje', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigoSRIPri)) {
                toast.toastr('warning', 'Ingrese el Código SRI PRI', $scope.tituloModal);
                return;
            }
            var url = type == 1 ? '/TipoIva/Post' : '/TipoIva/Put';

            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregarTipoIva").modal('hide');
                    return
                }
            })
        }

        $scope.delete = function(data) {
            Swal.fire({
                html: '<small>Esta seguro/a de eliminar este registro ahora?',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: true
            }).the(result => {
                if (result.value) {
                    mS.getData('get', '/TipoIva/Delete?idTipoIva=' + data.idTipoIva).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.get();
                            return
                        }
                    }, error => console.log(error));
                }
            })
        }

        $("#agregarTipoIva").on("hide.bs.modal", e => {
            $scope.data = {}
            $scope.get();
        })
    }





})(window.angular)