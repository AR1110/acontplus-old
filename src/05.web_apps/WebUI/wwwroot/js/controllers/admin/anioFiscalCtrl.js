(function() {
    'use strict'; 

    angular
        .module('acontPlusApp')
        .controller('anioFiscalCtrl', anioFiscalCtrl);

    anioFiscalCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function anioFiscalCtrl($scope, mS, toast, form) {
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            $scope.accion = accion[0];
        }
        
        $scope.data = {};
        $scope.anios = [];

     //   $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 1000;
        $scope.recordsQuantity = [5, 10, 25, 50]
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
            mS.getData('get', '/AnioFiscal/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }                
                $scope.anios = response.data;
             //   $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;
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
            $scope.icono = type == 1 ? 'fa fa-plus' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? ' Agregar Año Fiscal' : ' Actualizar Año Fiscal';
            $scope.btnTitulo = type == 1 ? 'Guardar' : 'Actualizar';
            $scope.btnColor = type == 1 ? 'btn-info' : 'btn-success';
            if (type == 2) {
                $scope.data = data;
            }
            $('#agregarAnioFiscal').modal('show');
            return;
        }


        $scope.save = function(type) {
            if (form.campo($scope.data.descripcion)) {
                logger.warning('Por favor, ingrese el Año Fiscal', $scope.tituloModal);
                return;
            }
            var url = type == 1 ? '/AnioFiscal/Post' : '/AnioFiscal/Put';
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.get();
                    $("#agregarAnioFiscal").modal('hide');
                    return
                }
            })
        }

        $scope.delete = function(data) {
            Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de eliminar este registro ahora?</small>',
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: true
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/AnioFiscal/Delete', data).then(response => {
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

        $(".modal").on("hide.bs.modal", function(event) {
            $scope.get();
            $scope.data = {}
        })
    }
})();