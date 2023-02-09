(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('subContribuyenteCtrl', subContribuyenteCtrl);

    subContribuyenteCtrl.$inject = ['$scope', 'commomService', 'logger', 'formulario'];

    function subContribuyenteCtrl($scope, cS, logger, form) {
        $scope.data = {};
        $scope.subContribuyente = {};
        $scope.tipoContribuyente = {};
        $scope.subContribuyentes = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]

        //Recibidos datos de Tipo Contribuyente 
        $scope.$on('data', function(event, value) {
            $scope.tipoContribuyente = value;
            $scope.readSubContribuyente();
        });

        //Listar subtipocontribuyentes
        $scope.readSubContribuyente = function() {
            $scope.data.tipoContribuyente = $scope.tipoContribuyente;
            cS.readSubContribuyente($scope.data).then((data) => {
                $scope.subContribuyentes = data;
            });
        }

        $scope.optionTipoContribuyente = function() {
            cS.optionTipoContribuyente().then(function(data) {
                $scope.tipoContribuyentes = data;

            })
        }
        $scope.optionTipoContribuyente();

        $scope.goBack = function() {
            $("#subContribuyente").css("display", 'none');
            $("#tipoContribuyente").css("display", 'block');
        }

        $scope.crudSubContribuyente = function(tipoOperacion) {

            if (tipoOperacion == 1) $scope.url = '/SubContribuyente/CreateSubContribuyente';
            if (tipoOperacion == 2) $scope.url = '/SubContribuyente/UpdateSubContribuyente';
            if (tipoOperacion == 3) $scope.url = '/SubContribuyente/DeleteSubContribuyente';

            if (tipoOperacion == 1 || tipoOperacion == 2) {
                if (form.campo($scope.tipoContribuyente.idTipoContribuyente)) {
                    logger.warning('Por favor, ingrese la Descripción', $scope.tituloModal);
                    return;
                }
                if (form.campo($scope.subContribuyente.descripcion)) {
                    logger.warning('Por favor, ingrese la Descripción', $scope.tituloModal);
                    return;
                }

                if (form.campo($scope.subContribuyente.codigo)) {
                    logger.warning('Por favor, ingrese el Código', $scope.tituloModal);
                    return;
                }
            }
            $scope.data.tipoContribuyente = $scope.tipoContribuyente;
            $scope.data.subContribuyente = $scope.subContribuyente;

            cS.crud($scope.url, $scope.data, $scope.tituloModal).then((response) => {
                if (response == 1) {
                    $scope.readSubContribuyente();
                    $("#agregarSubContribuyente").modal('hide');
                    $("#eliminarSubContribuyente").modal('hide');
                    return;
                }

            });
        }




        $scope.abrirModal = function(data, tipoOperacion) {
            if (tipoOperacion == 1) {
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.icono = ' fa fa-plus-circle';
                $scope.tituloModal = ' Agregar Sub-Contribuyente';
                $scope.colorHeader = ' bg-info';
                $scope.btnModal = ' Agregar';
                $("#agregarSubContribuyente").modal('show');
                return;
            }

            if (tipoOperacion == 2) {
                $scope.tipoContribuyente = data.tipoContribuyente
                $scope.subContribuyente = data.subContribuyente;

                $scope.data.tipoOperacion = tipoOperacion;
                $scope.icono = ' fa fa-edit';
                $scope.tituloModal = ' Actualizar Sub-Contribuyente';
                $scope.colorHeader = ' bg-success';
                $scope.btnModal = ' Actualizar';
                $("#agregarSubContribuyente").modal('show');
                return;
            }

            //Modal Sub Contribuyente 
            if (tipoOperacion == 3) {
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.tipoContribuyente = data.tipoContribuyente;
                $scope.subContribuyente = data.subContribuyente
                $scope.icono = ' fa fa-plus-circle';
                $scope.tituloModal = ' Eliminar Sub Contribuyente';
                $scope.colorHeader = ' bg-info';
                $scope.btnModal = ' Agregar';
                $("#eliminarSubContribuyente").modal('show');
                return;
            }

        }

        $scope.$watch('subContribuyente.descripcion', function(des) {
            if (!form.campo(des) && $scope.data.tipoOperacion == 1) {
                $scope.subContribuyente.codigo = form.obtenerTresLetras(des);
            }
        })



        $("#eliminarSubContribuyente").on('hide.bs.modal', function(e) {
            $scope.data = {};
            $scope.subContribuyente = {};
        });
        $("#agregarSubContribuyente").on("hide.bs.modal", function(e) {

            $scope.data = {}
            $scope.subContribuyente = {};
            $scope.readSubContribuyente();
        })
    }
})();