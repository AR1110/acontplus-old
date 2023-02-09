(function() {

    'use strict';

    angular.module('acontPlusApp')
        .controller('configTributariaCtrl', configTributariaCtrl);

    configTributariaCtrl.$inject = ['$scope', 'mainService', 'toastService'];

    function configTributariaCtrl($scope, mS, toast) {
        $scope.data = {};
        $scope.configTributarios = [];

        $scope.limitOptions = [5, 10, 25, 50];

        $scope.options = {
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            order: 'tipoIva',
            limit: 5,
            page: 1
        };

        $scope.init = () => {
            mS.getData('get', '/ConfigTributaria/Get').then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms, 'toast-top-center');
                    return
                }
                $scope.configTributarios = response.data;
            }, error => console.log(error));

            mS.getData('get', '/TipoIva/OptionTipoIva').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.tipoIvas = response.data;
            }, error => console.log(error))
        }
        $scope.init();


        //Abrir Modal 
        $scope.abrirModal = (data, tipo) => {
            $scope.tipo = tipo;
            $scope.iconoModal = tipo == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.tituloModal = tipo == 1 ? ' Agregar Config. Tributario' : 'Actualizar Config. Tributario';
            $scope.colorHeader = tipo == 1 ? 'bg-success' : 'bg-info';
            $scope.data = tipo == 1 ? {} : data.configuracionTributaria;
            $scope.idTipoIva = tipo == 1 ? '' : data.configuracionTributaria.idTipoIva;
            $("#agregar").modal('show');
            return;
        }

        //Crud
        $scope.saveUpdate = tipo => {
            if ([null, "", undefined].includes($scope.idTipoIva)) {
                toast.toastr('warning', 'Seleccione Tipo I.V.A', 'Config. Tributario', 'toast-top-right');
                return
            }
            $scope.data.idTipoIva = $scope.idTipoIva;
            var url = tipo == 1 ? '/ConfigTributaria/Post' : '/ConfigTributaria/Put?idConfiguracionTributaria=' + $scope.data.idConfiguracionTributaria;
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms, 'toast-bottom-right');
                    $scope.init();
                    $("#agregar").modal('hide');
                    return
                }
            })
        }


        $("#agregar").on('hide.bs.modal', e => {
            $scope.data = {};
            $scope.init();
        })
    }





})(window.angular)