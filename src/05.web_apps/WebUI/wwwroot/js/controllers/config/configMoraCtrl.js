(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('configMoraCtrl', configMoraCtrl);

    configMoraCtrl.$inject = ['$scope', 'mainService', 'formulario', 'toastService'];

    function configMoraCtrl($scope, mS, form, toast) {
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            $scope.accion = accion[0];
        }
        
        $scope.data = {};
        $scope.configMoras = [];


        $scope.data.tiempoConfiguracion = true;
        $scope.totalRecords = 0;
        $scope.limitOptions = [5, 10, 25, 50];

        $scope.options = {
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            order: 'diasGracia',
            limit: 5,
            page: 1
        };


        $scope.get = function() {
            mS.getData('GET', '/ConfigMora/Get').then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.configMoras = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;
            }, error => console.log(error))
        }
        $scope.get();

        $scope.abrirModal = function(data, tipo) {
            $scope.tipo = tipo;
            $scope.tituloModal = tipo == 1 ? 'Agregar Config. Mora' : 'Actualizar Config. Mora';
            $scope.iconoModal = tipo == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-success';
            $scope.icono = tipo == 1 ? 'fa fa-save' : 'fa fa-edit';
            $scope.btnModal = tipo == 1 ? 'Guardar' : 'Actualizar';
            $scope.data = tipo == 1 ? {} : data.configuracionMora;
            $("#agregar").modal('show');
        }

        $("#porcentajeMora").attr('maxlength', 3);
        $scope.$watch("data.porcentajeMora", (xMora) => {
            if (!form.campo(xMora) && xMora > 100) {
                $scope.data.porcentajeMora = 100;
            }
        })

        $scope.saveUpdate = function(type) {
            if (form.campo($scope.data.diasGracia)) {
                toast.toastr('warning', 'Ingrese los Dias de Gracia', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.porcentajeMora)) {
                toast.toastr('warning', 'Ingrese el Porcenta de Mora', $scope.tituloModal);
                return;
            }
            var url = type == 1 ? '/ConfigMora/Post' : '/ConfigMora/Put';
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

        //Eliminar Config. Mora
        $scope.eliminarConfigMora = function({ configuracionMora: data }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar esta Conf. de Mora ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/ConfigMora/Delete?idConfigMora=' + data.idConfiguracionMora).then(response => {
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
            })
        }

        $("#agregar").on('hide.bs.modal', e => {
            $scope.get();
            $scope.data = {};
        })



    }
})(window.angular);