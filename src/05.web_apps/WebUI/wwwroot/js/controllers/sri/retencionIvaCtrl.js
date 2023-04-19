(function() {

    'use strict';

    angular.module('acontPlusApp')
        .controller('retencionIvaCtrl', retencionIvaCtrl);

    retencionIvaCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function retencionIvaCtrl($scope, mS, toast, form) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }
        
        $scope.data = {};
        $scope.retencionesIva = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]

        $scope.get = function() {
            mS.getData('GET', '/RetencionIva/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.retencionesIva = response.data;
                if (response.data.length > 0) $scope.totalRecords = response.data[0].totalRecords;
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
            $scope.icono = type == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? ' Agregar R. IVA' : ' Actualizar R. IVA';
            $scope.btnModal = type == 1 ? ' Guardar' : 'Actualizar';
            $scope.data = type == 1 ? {} : data;
            $("#agregar").modal('show');
            return;
        }
        $scope.obtenerTresLetras = function({ descripcion }) {
            if (!form.campo(descripcion)) {
                $scope.data.codigo = form.obtenerTresLetras(descripcion);
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
            if (form.campo($scope.data.porcentaje)) {
                toast.toastr('warning', 'Por favor, ingrese el Porcentaje', $scope.tituloModal);
                return;
            }
            let url = type == 1 ? '/RetencionIva/Post' : '/RetencionIva/Put';
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregar").modal('hide');
                    return
                }
            })
        }

        $scope.delete = function({ idRetencionIva }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Retencion de IVA ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/RetencionIva/Delete?idRetencionIva=' + idRetencionIva).then(response => {
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

        $("#agregar").on("hide.bs.modal", e => {
            $scope.data = {};
            $scope.get();
        })
    }





})(window.angular)