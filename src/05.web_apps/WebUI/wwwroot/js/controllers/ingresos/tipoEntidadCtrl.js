(function() {

    'use strict';

    angular.module('acontPlusApp')
        .controller('tipoEntidadCtrl', tipoEntidadCtrl);

    tipoEntidadCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function tipoEntidadCtrl($scope, mS, toast, form) {
        $scope.data = {};
        $scope.tipoEntidades = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50] 

        $scope.get = function() {
            mS.getData('get', '/TipoEntidad/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.tipoEntidades = response.data;
                $scope.totalRecords = response.data[0].totalRecords;
            }, error => console.log(error))
        }
        $scope.get();

        $scope.pagechanged = function() {
            $scope.get();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.get();
        }

        $scope.abrirModal = (data, tipo) => {
            $scope.tipo = tipo;
            $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-success';
            $scope.iconoModal = tipo == 1 ? 'fa fa-plus-circle' : ' fa fa-edit';
            $scope.tituloModal = tipo == 1 ? 'Agregar Tipo Entidad' : ' Actualizar Tipo Entidad';
            $scope.btnModal = tipo == 1 ? 'Guardar' : ' Actualizar';
            $scope.icono = tipo == 1 ? 'fa fa-save 5x' : 'fa fa-edit 5x';
            $scope.data = tipo == 1 ? {} : data;
            $("#agregar").modal('show');
            return;
        }

        $scope.$watch("data.descripcion", des => {
            if (!form.campo(des) && $scope.tipo == 1) {
                $scope.data.codigo = form.obtenerTresLetras(des);
            }
        });

        $scope.saveUpdate = tipo => {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la descripción', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
                return;
            }
            let url = tipo == 1 ? '/TipoEntidad/Post' : '/TipoEntidad/Put';
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('warning', response.message, response.titleSms);
                    $("#agregar").modal('hide');
                    return
                }
            })
        }

        $scope.delete = idTipoEntidad => {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este T. Entidad ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/TipoEntidad/Delete?idEntidad=' + idTipoEntidad).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('warning', response.message, response.titleSms);
                            $scope.get();
                            return
                        }
                    })
                }
            })
        }


        $("#agregar").on('hide.bs.modal', e => {
            $scope.get();
            $scope.data = {};
        })
    }






})(window.angular)