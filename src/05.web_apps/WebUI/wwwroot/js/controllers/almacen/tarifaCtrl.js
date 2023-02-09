(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('tarifaCtrl', tarifaCtrl);

    tarifaCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function tarifaCtrl($scope, mS, toast, form) {
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            $scope.accion = accion[0];
        }
        
        
        $scope.data = {};
        $scope.tarifas = [];

        //Paginacion
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 5;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.get = function() {
            mS.getData('get', '/Tarifa/get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then((response) => {
                console.log(response)
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms)
                }
                $scope.tarifas = response.data
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
        $scope.abrirModal = function(data, type) {
            $scope.type = type;
            $scope.tituloModal = type == 1 ? 'Agregar Tarifa' : 'Actualizar Tarifa';
            $scope.iconoModal = type == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.icono = type == 1 ? 'ti-save' : ' fa fa-edit';
            $scope.btnModal = type == 1 ? 'Guardar' : 'Actualizar';
            $scope.data = type == 1 ? {} : data;
            $("#agregar").modal('show');
            return;
        }
        $scope.$watch("data.descripcion", function(des) {
            if (!form.campo(des) && $scope.type == 1) {
                $scope.data.codigo = form.obtenerTresLetras(des);
            }
        })

        $scope.saveUpdate = function(type) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la Descripción', $scope.tituloModal);
                return;
            }
            //if (form.campo($scope.data.codigo)) {
            //    toast.toastr('warning','Por favor, ingrese el Código', $scope.tituloModal);
            //    return;
            //}
            let url = type == 1 ? '/Tarifa/Post' : '/Tarifa/Put';
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

        $scope.delete = function({ idTarifa }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Tarifa ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, eliminar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/Tarifa/Delete?idTarifa=' + idTarifa).then(response => {
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



        $(".modal").on('hide.bs.modal', function(e) {
            $scope.get();
            $scope.data = {};
        })
    }
})(window.angular);