(function() {

    'use strict';

    angular.module('acontPlusApp')
        .controller('tipoContribuyenteCtrl', tipoContribuyenteCtrl);

    tipoContribuyenteCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function tipoContribuyenteCtrl($scope, mS, toast, form) {
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            $scope.accion = accion[0];
        }
        
        $scope.data = {};
        $scope.tipoContribuyente = {};
        $scope.tipoContribuyentes = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]


        $scope.getTipoContribuyentes = function() {
            mS.getData('get', '/TipoContribuyente/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.tipoContribuyentes = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;
            })
        }
        $scope.getTipoContribuyentes();


        $scope.pagechanged = function() {
            $scope.getTipoContribuyentes();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.getTipoContribuyentes();
        }

        //Tipo Contribuyente
        $scope.getByTipoContribuyente = function() {
            mS.getData('get', '/TipoContribuyente/OptionTipoContribuyente').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.selectTipoContribuyentes = response.data;
            })
        }
        $scope.getByTipoContribuyente();

        $scope.abrirModalTc = function(data, type) {
            $scope.type = type;
            $scope.icono = type == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? 'Agregar Contribuyente' : 'Actualizar Contribuyente';
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.btnModal = type == 1 ? 'Guardar' : 'Actualizar';
            $scope.btnIcono = type == 1 ? 'ti-save' : 'fa fa-edit';
            $scope.data = type == 1 ? {} : data;
            $("#agregarContribuyente").modal('show');
            return;
        }

        $scope.$watch('data.descripcion', function(des) {
            if (!form.campo(des) && $scope.type == 1) {
                $scope.data.codigo = form.obtenerTresLetras(des);
            }
        })

        $scope.saveUpdateTc = function(type) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la Descripción', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
                return;
            }

            let url = type == 1 ? '/TipoContribuyente/Post' : '/TipoContribuyente/Put';
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregarContribuyente").modal('hide');
                    return
                }
            })
        }

        //Expand Sub Contribuyente 
        $scope.expandDetalle = function(tc) {
            tc.expanded = !tc.expanded;
            $scope.rowTc = tc; //Row Tipo Contribuyente
            $scope.getSubContribuyente(tc);
        }
        $scope.getSubContribuyente = function(tc) {
            mS.getData('get', '/SubContribuyente/GetByIdTipoContribuyente?idTipoContribuyente=' + tc.idTipoContribuyente).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                tc.subContribuyentes = response.data;
            });
        }

        $scope.deleteTc = function({ idTipoContribuyente }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Tipo Contribuyente ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/TipoContribuyente/Delete?idTipoContribuyente=' + idTipoContribuyente).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getTipoContribuyentes();
                            return
                        }
                    })
                }
            })
        };

        

        $("#agregarContribuyente").on('hide.bs.modal', e => {
            $scope.data = {};
            $scope.getTipoContribuyentes(); 
        });


        //...........Modulo Sub contribuyente ..........................
        $scope.abrirModalSubC = function(data, type) {
            $scope.type = type;
            $scope.icono = type == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? 'Agregar Sub-Contribuyente' : 'Actualizar Sub-Contribuyente';
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.btnModal = type == 1 ? 'Guardar' : 'Actualizar';
            $scope.btnIcono = type == 1 ? 'ti-save' : 'fa fa-save';
            $scope.tipoContribuyente = type == 1 ? data : data.tipoContribuyente;
            $scope.data = type == 1 ? {} : data.subContribuyente;
            $("#agregarSubContribuyente").modal('show');
            return;
        }

        $scope.saveUpdateSubC = function(type) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la Descripción', $scope.tituloModal);
                return;
            }

            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
                return;
            }

            var data = {
                subContribuyente: $scope.data,
                tipoContribuyente: $scope.tipoContribuyente
            }
            var url = type == 1 ? '/SubContribuyente/Post' : '/SubContribuyente/Put';
            mS.getData('post', url, data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getSubContribuyente($scope.rowTc);
                    $("#agregarSubContribuyente").modal('hide');
                    return
                }
            })
        }

        $scope.deleteSubC = function({ idSubContribuyente }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Sub Contribuyente ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/SubContribuyente/Delete?idSubContribuyente=' + idSubContribuyente).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getSubContribuyente($scope.rowTc);
                            return
                        }
                    })
                }
            })
        }


        $("#agregarSubContribuyente").on('hide.bs.modal', e => {
            $scope.data = {};
            $scope.getSubContribuyente($scope.rowTc);
        })

    }
})(window.angular)