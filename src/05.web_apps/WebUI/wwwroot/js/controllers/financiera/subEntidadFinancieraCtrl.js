(function() {
    'use strict';

    angular.module('acontPlusApp')
        .controller('subEntidadFinancieraCtrl', subEntidadFinancieraCtrl);

    subEntidadFinancieraCtrl.$inject = ['$scope', 'mainService', 'toastService'];

    function subEntidadFinancieraCtrl($scope, mS, toast) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }

        $scope.data = {};
        $scope.data.controlCaja = true;
        $scope.subFinancieras = [];

        $scope.entidadFinanciera = {};
        $scope.pageIndex = 1;
        $scope.pageSize = 1000;
        $scope.totalRecords = 0;

        $scope.openModal = function(data = null, type) {
            $scope.type = type;
            $scope.titleModal = type == 1 ? ' Nuevo Sub Entidad Financiera' : ' Actualizar Sub Entidad Financiera';
            $scope.iconModal = type == 1 ? ' fa fa-plus-circle' : ' fa fa-edit';
            $scope.icon = type == 1 ? 'ti-save' : 'ti-pencil';
            $scope.btnModal = type == 1 ? ' Guardar' : ' Actualizar';

            if (type == 2) {
                $scope.entidadFinanciera = data.subEntidadFinanciera;
                $scope.data = data.subEntidadFinanciera;
            }
            $("#agregar").modal('show');
            return;
        }

        $scope.get = function() {
            mS.getData('get', '/SubEntidadFinanciera/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.subFinancieras = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;
            })
        }
        $scope.get();

        $scope.getEntidadFinanciera = function() {
            mS.getData('get', '/EntidadFinanciera/OptionEntidadFinanciera').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.entidadesFinancieras = response.data;
            })
        }
        $scope.getEntidadFinanciera();


        $scope.save = function(type) {
            if ($scope.isNoValid($scope.entidadFinanciera.idEntidadFinanciera)) {
                toast.toastr('warning', 'Seleccione la Entidad Financiera', $scope.titleModal);
                return
            }
            if ($scope.isNoValid($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripcion', $scope.titleModal);
                return
            }
            if ($scope.isNoValid($scope.data.codigo)) {
                toast.toastr('warning', 'Ingrese el Código', $scope.titleModal);
                return
            }

            $scope.data.idEntidadFinanciera = $scope.entidadFinanciera.idEntidadFinanciera;

            let url = type == 1 ? '/SubEntidadFinanciera/Post' : '/SubEntidadFinanciera/Put?idSubEntidadFinanciera=' + $scope.data.idSubEntidadFinanciera;
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id === "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "2") {
                    toast.toastr('info', response.message, response.titleSms);
                    return
                }
                if (response.id === "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.get();
                    $("#agregar").modal('hide');
                }
            }, error => console.log(error));
        }

        $scope.$watch("data.descripcion", newValue => {
            if (!$scope.isNoValid(newValue)) {
                $scope.data.codigo = getCodeAsSubString(newValue);
            }
        });

        $scope.isNoValid = val => ["", null, undefined].includes(val) ? true : false;

        function getCodeAsSubString(val) {
            if (val.length >= 3 && val !== undefined) {
                return val.substring(0, 3).replace(/[^-A-Za-z0-9]+/g, '').toUpperCase();
            }
        };

        $scope.askToDelete = function(data){
            Swal.fire({
                icon: 'warning',
                html:'<small>Esta seguro/a de eliminar este registro ahora?</small>',
                showDenyButton: true,
                confirmButtonText: `Si, eliminar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    $scope.delete(data);
                    return;
                };
            });
        }

        $scope.delete = function(data) {
            const url = '/SubEntidadFinanciera/Delete?idSubEntidadFinanciera=' + data.subEntidadFinanciera.idSubEntidadFinanciera;
            mS.getData('get', url).then(response => {
                if (response.id == "2") {
                    toast.toastr('info', response.message, response.titleSms);
                    return
                }
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
        }

        $("#agregar").on('hide.bs.modal', () => {
            $scope.data = {};
            $scope.data.controlCaja = true;
            $scope.entidadFinanciera = {};
        })

    }
})(window.angular)