(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('controlCajaCtrl', controlCajaCtrl);

    controlCajaCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function controlCajaCtrl($scope, mS, toast, form) {
        $scope.data = {};

        if (localStorage.getItem('dataCaja') !== null) {
            $scope.dataCaja = JSON.parse(localStorage.getItem('dataCaja'));
            console.log($scope.dataCaja)
            
        }
        

        $scope.readControlCaja = function () {            
            mS.getData('get', '/ControlCaja/MovimientosControlCaja?idCaja=' + $scope.dataCaja.idCaja).then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                if (response.id == 1) {                     
                    $scope.movimientosCaja = response.data;
                }

            }, error=>console.log(error));
        }
        $scope.readControlCaja();





        $scope.listDetalleArqueoCaja = function () {
            mS.getData('get', '/DetalleArqueoCaja/ListDetalleArqueoCaja').then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                if (response.id == 1) {
                    $scope.arqueos = response.data;
                }

            }, error=>console.log(error));
        }
        $scope.listDetalleArqueoCaja();


        $scope.totalArqueo = 0;
        $scope.calcularCantidadMoneda = function ($data) {
            let acumulador = 0;

            $scope.arqueos.map((data, index) => {
                $scope.totalArqueo = 0;
                acumulador = data.valorMoneda * Number(data.detalleArqueoCaja.cantidad);
                return { ...data, acumulador };

            }).forEach(v => {
                $scope.totalArqueo = $scope.totalArqueo + v.acumulador;

            })
        }




        $scope.crudControlCaja = function (tipo) {        
            $scope.data.idControlCaja = $scope.idControlCaja;
            $scope.data.totalArqueo = $scope.totalArqueo;
            $scope.data.detalleArqueoCaja = $scope.arqueos;

            let url = tipo==1? '/ControlCaja/CierreCaja': '/ControlCaja/CierreCaja';
            mS.getData('post', url, $scope.data).then(response=>{
                if(response.id=="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if(response.id=="1"){
                    toast.toastr('success', response.message, response.titleSms);
                    $("#myModal").modal('hide');
                    return
                }
            });           

        }



        $scope.abrirModal = function (data, tipo) {
            if (tipo == 1) {
                $scope.tipo = tipo;
                $scope.idControlCaja = data.controlCaja.idControlCaja;
                $scope.tituloModal = ' Arqueo Caja';
                $("#myModal").modal('show');
            }
        }

        $scope.atras = function () {
            localStorage.removeItem('dataCaja');
            location.href = '/Caja/Index';
        }

        $("#myModal").on('hide.bs.modal', function () {
            $scope.data = {};
            $scope.listDetalleArqueoCaja();
            $scope.readControlCaja();
        })

    }
})();
