(function () {
    'use strict';


    angular.module('acontPlusApp')
        .controller('loteCtrl', marcaCtrl);

    marcaCtrl.$inject = ['$scope', 'mainService', 'toastService', '$filter'];

    function marcaCtrl($scope, mS, iN, $filter) {
        $scope.data = {};
        $scope.lotes = [];
        $scope.medidas = [];
     
        $scope.crudLote = function (tipoOperacion) {            
            $scope.data.tipoOperacion = tipoOperacion;
            $scope.method = '';
            $scope.url = '';

            if (tipoOperacion == 1) {
                $scope.method = 'POST';
                $scope.url = '/Lote/CreateLote';
            }
            if (tipoOperacion == 2) {
                $scope.method = 'POST';
                $scope.url = '/Lote/UpdateLote';
            }
            if (tipoOperacion == 3) {
                $scope.method = 'POST';
                $scope.url = '/Lote/DeleteLote';
            }

            //Modelo
            if (tipoOperacion == 4) {
                $scope.method = 'POST';
                $scope.url = '/Medida/CreateMedida';
            }
            if (tipoOperacion == 5) {
                $scope.method = 'POST';
                $scope.url = '/Medida/UpdateMedida';
            }
            if (tipoOperacion == 6) {
                $scope.method = 'POST';
                $scope.url = '/Medida/DeleteMedida';
            }
            
            mS.getData($scope.method, $scope.url, $scope.data).then(response => {
                if (response.id == 0) {
                    iN.toastr('warning', response.message, response.titleSms);
                    $scope.initiload();
                    return;
                }
                if (response.id == 1) {
                    if ($scope.data.tipoOperacion == 1 || $scope.data.tipoOperacion == 2) {
                        iN.toastr('success', response.message, response.titleSms);
                        $("#agregarLote").modal('hide');
                        $scope.initiload();
                        return;
                    }
                    if ($scope.data.tipoOperacion == 3) {
                        iN.toastr('success', response.message, response.titleSms);
                        $("#eliminarLote").modal('hide');
                        $scope.initiload();
                        return;
                    }
                    //Modelos 
                    if ($scope.data.tipoOperacion == 4 || $scope.data.tipoOperacion == 5) {
                        iN.toastr('success', response.message, response.titleSms);
                        $("#agregarMedida").modal('hide');
                        $scope.initiload();
                        return;
                    }
                    if ($scope.data.tipoOperacion == 6) {
                        iN.toastr('success', response.message, response.titleSms);
                        $("#eliminarMedida").modal('hide');
                        $scope.initiload();
                        return;
                    }
                }
            }, response => {
                iN.toastr('error', response.status);
            })
        }
        $scope.abrirModal = function (data, tipoOperacion) {
            if (tipoOperacion == 1) {
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.colorHeader = 'bg-info';
                $scope.icono = 'fa fa-plus';
                $scope.tituloModal = ' Agregar Lote';
                $scope.btnTitulo = 'Guardar';
                $scope.btnColor = ' btn-info';
                $('#agregarLote').modal('show');
                return;
            }
            if (tipoOperacion == 2) {
                $scope.data = data;
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.colorHeader = 'bg-success';
                $scope.icono = 'fa fa-edit';
                $scope.tituloModal = ' Actualizar Lote';
                $scope.btnTitulo = 'Actualizar';
                $scope.btnColor = ' btn-success';
                $('#agregarLote').modal('show');
                return;
            }
            if (tipoOperacion == 3) {
                $scope.data = data;
                $scope.data.tipoOperacion = tipoOperacion;
                $('#eliminarLote').modal('show');
                return;
            }
            //Medidas
            if (tipoOperacion == 4) {
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.colorHeader = 'bg-info';
                $scope.icono = 'fa fa-plus';
                $scope.tituloModal = ' Agregar Medidas';
                $scope.btnTitulo = 'Guardar';
                $scope.btnColor = ' btn-info';
                $('#agregarMedida').modal('show');
                return;
            }
            if (tipoOperacion == 5) {
                $scope.data = data;
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.colorHeader = 'bg-success';
                $scope.icono = 'fa fa-edit';
                $scope.tituloModal = ' Actualizar Medida';
                $scope.btnTitulo = ' Actualizar';
                $scope.btnColor = ' btn-success';
                $('#agregarMedida').modal('show');
                return;
            }
            if (tipoOperacion == 6) {
                $scope.data = data;
                $scope.data.tipoOperacion = tipoOperacion;
                $('#eliminarMedida').modal('show');
                return;
            }

        }
        $scope.readLote = function () {
            mS.getData('GET', '/Lote/ReadLote').then(response => {
                response.id == 0 ? iN.toastr('warning', response.message, response.titleSms) : $scope.lotes = response.data;
                if ($scope.lotes.length == 0) {
                    iN.toastr('info', 'No hay ningún Lote registrado ', 'Listar Lotes');
                    return;
                }
                return;
            }, response => {
                iN.toastr('error', response.status);
                return;
            })

        }
        $scope.readMedida = function () {
            mS.getData('GET', '/Medida/ReadMedida').then(response => {
                response.id == 0 ? iN.toastr('warning', response.message, response.titleSms) : $scope.medidas = response.data;
                if ($scope.medidas.length == 0) {
                    iN.toastr('info', 'No hay ninguna Medida registrada ', 'Listar Medidas');
                    return;
                }
                return;
            }, response => {
                iN.toastr('error', response.status);
                return;
            })
        }

        $("#agregarLote").on("hide.bs.modal", event => {
            $scope.data = {};
        })
        $("#agregarMedida").on("hide.bs.modal", event => {
            $scope.data = {};
        })
        $("#eliminarLote").on("hide.bs.modal", event => {
            $scope.initiload();
            $scope.data = {};
        })
        $("#eliminarMedida").on("hide.bs.modal", event => {
            $scope.initiload();
            $scope.data = {};
        })
        $scope.initiload = function () {
            $scope.readLote();
            $scope.readMedida();
        }
        $scope.initiload();

    }





})(window.angular)