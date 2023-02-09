(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('categoriaCompraCtrl', categoriaCompraCtrl);

    categoriaCompraCtrl.$inject = ['$scope', 'mainService', 'formulario', 'toastService'];

    function categoriaCompraCtrl($scope, mS, form, toast) {
        $scope.data = {};
        $scope.categoriaCompras = [];


        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.getCategorias = function() {
            mS.getData('get', '/CategoriaCompra/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr("warning", response.message, response.titleSms);
                    return
                }                
                $scope.categoriaCompras = response.data;                
                if (response.data.length > 0) $scope.totalRecords = response.data[0].totalRecords;
            }, error => console.log(error))
        }
        $scope.getCategorias();

        $scope.pagechanged = function() {
            $scope.getCategorias();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.getCategorias();
        }
        $scope.abrirModal = function(data, type) {
            $scope.type = type;
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.iconoModal = type == 1 ? ' fa fa-plus-circle' : ' fa fa-edit';
            $scope.tituloModal = type == 1 ? ' Nuevo Categoria Compra' : ' Actualizar Categoria Compra';
            $scope.btnModal = type == 1 ? ' Guardar' : ' Actualizar';
            $scope.icono = type == 1 ? 'ti-save' : 'fa fa-edit 5x';
            $scope.data = type == 1 ? {} : data.categoria;
            $("#agregar").modal('show');
            return
        }
        $scope.obtenerTresLetras = function(data) {
            if (data.descripcion !== undefined && $scope.type == 1) {
                $scope.data.codigo = form.obtenerTresLetras(data.descripcion);
            }
        }

        $scope.saveUpdate = function(type) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la Descripción', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
                return;
            }
            let url = type == 1 ? '/CategoriaCompra/Post' : '/CategoriaCompra/Put';
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                if (response.id == 1) {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getCategorias();
                    $("#agregar").modal('hide');
                    return
                }
            })
        }

        //Eliminar categoria
        $scope.delete = function({ idCategoriaCompra }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar esta Categoria de Compra ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: `Sí, eliminar!`,
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    mS.getData('post', '/CategoriaCompra/Delete?idCategoriaCompra=' + idCategoriaCompra).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getCategorias();
                            return
                        }
                    }, error => console.log(error))
                }
            })
        }



        $("#agregar").on('hide.bs.modal', e => {
            $scope.data = {};
            $scope.getCategorias();
        })
    }
})();