(function() {

    'use strict';

    angular.module('acontPlusApp')
        .controller('bancoCtrl', BancoCtrl);

    BancoCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function BancoCtrl($scope, mS, toast, form) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }

        
        $scope.data = {};
        $scope.bancos = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 100;
        $scope.recordsQuantity = [5, 10, 25, 50];
        $scope.options = {
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.query = {
            order: 'descripcion',
            limit: 10,
            page: 1
        };

        $scope.get = function() {
            mS.getData('get', '/Banco/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.bancos = response.data;
                $scope.totalRecords = response.data[0].totalRecords;
            })
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
            $scope.iconoModal = type == 1 ? 'fa fa-plus-circle' : ' fa fa-edit';
            $scope.tituloModal = type == 1 ? 'Agregar Banco' : ' Actualizar Banco';
            $scope.btnModal = type == 1 ? ' Guardar' : ' Actualizar';
            $scope.icono = type == 1 ? 'fa fa-save 5x' : 'fa fa-edit 5x';
            $scope.data = type == 1 ? {} : data;
            $("#agregar").modal('show');
            return;
        }

        $scope.obtenerTresLetras = function(data) {
            if (data.descripcion !== undefined) {
                $scope.data.codigo = form.obtenerTresLetras(data.descripcion);
            }
        }

        $scope.saveUpdate = function(type) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la descripción', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
                return;
            }
            var url = type == 1 ? '/Banco/Post' : '/Banco/Put';
            mS.getData('post', url, $scope.data).then(function(response) {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.tilleSms);
                    return
                }
                if (response.id == 1) {
                    toast.toastr('success', response.message, response.tilleSms);
                    $scope.get();
                    $("#agregar").modal('hide');
                }
            })
        }

        $scope.delete = function(data) {
            Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de eliminar esta Banco ahora?</small>',
                showConfirmButton: true,
                confirmButtonText: 'Si,eliminar!',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then((response) => {
                if (response.value) {
                    mS.getData('post', '/Banco/Delete?idBanco=' + data.idBanco).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.get();
                            return
                        }
                    }, error => console.log(error))
                };
            });
        }

        $(".modal").on('hide.bs.modal', function(e) {
            $scope.data = {};
            $scope.get();
        })
    }



})(window.angular)