(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('tipoImpuestoCtrl', tipoImpuestoCtrl);

    tipoImpuestoCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function tipoImpuestoCtrl($scope, mS, toast, form) {
        $scope.data = {};
        $scope.tipoImpuesto = {};
        $scope.tipoImpuestos = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]

        $scope.get = function() {
            mS.getData('get', '/TipoImpuesto/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.tipoImpuestos = response.data;
                if (response.data.length > 0) $scope.totalRecords = response.data[0].totalRecords;
            }, error => console.log(error))

        }
        $scope.get();


        $scope.pagechanged = function() {
            $scope.get();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.get();
        };

        $scope.abrirModal = (data, type) => {
            $scope.type = type;
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.iconoModal = type == 1 ? 'fa fa-plus' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? ' Agregar Tipo Impuesto' : 'Actualizar Tipo Impuesto';
            $scope.btnTitulo = type == 1 ? 'Guardar' : 'Actualizar';
            $scope.btnColor = type == 1 ? ' btn-info' : 'btn-success';
            $scope.icono = type == 1 ? 'fa fa-save' : 'fa fa-edit';
            $scope.data = type == 1 ? {} : data;
            $('#agregarTipoImpuesto').modal('show');
            return;
        }
        $scope.obtenerTresLetras = function(data) {
            if (!form.campo(data.descripcion) && $scope.type == 1) {
                $scope.data.codigo = form.obtenerTresLetras(data.descripcion);
            }
        }

        $scope.saveUpdate = type => {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la Descripción', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
                return;
            }
            var url = type == 1 ? '/TipoImpuesto/Post' : '/TipoImpuesto/Put?idTipoImpuestoRenta=' + $scope.data.idTipoImpuestoRenta;
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregarTipoImpuesto").modal('hide');
                    return
                }
            })
        }

        $scope.delete = function({ idTipoImpuestoRenta }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Tipo Impuesto ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/TipoImpuesto/Delete?idTipoImpuestoRenta=' + idTipoImpuestoRenta).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.get();
                            return
                        }
                    })
                }
            })
        }



        $("#agregarTipoImpuesto").on("hide.bs.modal", e => {
            $scope.data = {};
            $scope.get();
        });


    }
})();