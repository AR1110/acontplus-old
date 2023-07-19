(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('entidadFinancieraCtrl', entidadFinancieraCtrl);

    entidadFinancieraCtrl.$inject = ['$scope', 'mainService', 'formulario', 'toastService'];

    function entidadFinancieraCtrl($scope, mS, form, toast) {

        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }
        
        $scope.data = {};
        $scope.formaPagoSri = {};
        $scope.entidadesFinancieras = [];
        //Paginacion
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 1000;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.options = {
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.query = {
            order: 'descripcion',
            limit: 5,
            page: 1
        };


        $scope.get = function() {
            mS.getData('get', '/EntidadFinanciera/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(function(response) {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.entidadesFinancieras = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;
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

        //Forma de Pago S.R.I
        $scope.optionFormaPagoSri = function() {
            mS.getData('get', '/FormaPagoSri/OptionFormaPagoSri').then((response) => {
                $scope.formaPagos = response.data;
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
            }, error => console.log(error))
        }

        $scope.optionFormaPagoSri();

        $scope.abrirModal = function(data, type) {
            $scope.type = type;
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.tituloModal = type == 1 ? 'Agregar Entidad Financiera' : ' Actualizar Entidad Financiera';
            $scope.iconoModal = type == 1 ? 'fa fa-plus-circle' : 'ti-pencil-alt';
            $scope.icono = type == 1 ? 'fa fa-save' : 'fa fa-edit';
            $scope.btnModal = type == 1 ? 'Guardar' : 'Actualizar';
            if (type == 2) {
                $scope.data = data;
                $scope.formaPagoSri = data;
            }
            $("#agregar").modal('show');
            return;
        }

        $scope.$watch('data.descripcion', function(des) {
            if (!form.campo(des) && $scope.type == 1) {
                $scope.data.codigo = form.obtenerTresLetras(des);
            }
        })

        $scope.saveUpdate = function(type) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Campo Descripción requerido', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Campo Código requerido', $scope.tituloModal);
                return;
            }
            $scope.data.idFormaPagoSri = $scope.formaPagoSri.idFormaPagoSri;
            var url = type == 1 ? '/EntidadFinanciera/Post' : '/EntidadFinanciera/Put';
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregar").modal('hide');
                    $scope.get();
                }
            });
        }


        $scope.delete = function(data) {
            Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de eliminar esta Entidad Finaciera ahora?</small>',
                showDenyButton: true,
                confirmButtonText: 'Si,eliminar!',
                denyButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then((response) => {
                if (response.value) {
                    mS.getData('post', '/EntidadFinanciera/Delete?idEntidadFinanciera=' + data.idEntidadFinanciera).then(response => {
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
                };
            });
        }

        $(".modal").on('hide.bs.modal', function() {
            $scope.data = {};
            $scope.formaPagoSri = {};
            $scope.get();
        })
    }
})(window.angular);