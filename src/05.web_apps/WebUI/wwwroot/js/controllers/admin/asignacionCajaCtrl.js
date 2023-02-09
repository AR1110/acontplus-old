(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('asignacionCajaCtrl', asignacionCajaCtrl);

    asignacionCajaCtrl.$inject = ['$scope', 'mainService', 'formulario', 'logger'];

    function asignacionCajaCtrl($scope, mS, form, logger) {
        $scope.turnos = [];


        $scope.$on('dataCaja', function(e, data) {
            $scope.tipoOperation = 2;
            $scope.readAsignacionCaja(data.caja.idCaja);
        })

        $scope.readAsignacionCaja = function(idCaja) {
            mS.getData('GET', '/AsignacionCaja/ReadAsignacionCaja?idCaja=' + idCaja).then(response => {
                if (response.id == 0) {
                    logger.warning(response.message, response.titleSms);
                    return;
                }

                if (response.id == 1) {
                    $scope.dataAsignacionCaja = response.data[0];
                    $scope.idTurno = $scope.dataAsignacionCaja.asignacionCaja.idTurno;
                    $scope.idUsuario = $scope.dataAsignacionCaja.asignacionCaja.idUsuario;
                    $scope.idAsignacionCaja = $scope.dataAsignacionCaja.asignacionCaja.idAsignacionCaja;

                }

            }, function(response) {
                logger.error('Error:', response.status);
                return;
            })
        }

        $scope.viewPopoverTurno = {
            content: 'Turno',
            templateUrl: 'viewPopoverTurno.html',
            title: 'Turno'
        };



        $scope.viewHorarioPoper = function(data) {            
            mS.getData('get', '/Horario/ReadHorario?idTurno=' + data.idTurno).then(response=>{
                if(response.id=="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if(response.id=="1"){
                    $scope.horarios = response.data;
                }
            });            
        }

        //$scope.selectUsuario = function ($item) {
        //    $scope.usuario = $item.usuario;
        //}
        $scope.selectTurno = function(idTurno) {
            $scope.idTurno = idTurno;
        }

        $scope.crudAsignacionCaja = function(tipoOperation = 1) {
            let tituloModal = tipoOperation==1?'Guardar':'Actualizar';
            if (form.campo($("#user").val())) {
                logger.warning('Seleccione el Usuario', tituloModal);
                return;
            }
            if (form.campo($scope.idTurno)) {
                logger.warning('Seleccione el Turno', tituloModal);
                return;
            }

            if (tipoOperation == 1) {
                $scope.data.idUsuario = $scope.user.usuario.idUsuario;
            }
            if (tipoOperation == 2) {
                $scope.data.idUsuario = $scope.idUsuario;
                $scope.data.idAsignacionCaja = $scope.idAsignacionCaja;
            }
            $scope.data.idTurno = $scope.idTurno;
            $scope.data.idCaja = $("#idCaja").val();

            let url = tipoOperation==1?'/AsignacionCaja/CreateAsignacionCaja':'/AsignacionCaja/UpdateAsignacionCaja';
            mS.getData('post', url, $scope.data).then(response=>{
                if(response.id=="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if(response.id=="1"){
                    toast.toastr('warning', response.message, response.titleSms);
                    $("#asignacionCaja").modal('hide');
                    return
                }
            });           

        }


        $("#asignacionCaja").on('hide.bs.modal', function() {

            $scope.user = '';
            $scope.listTurno();
            $scope.idTurno = ''
            $scope.idUsuario = ''
            $scope.idAsignacionCaja = '';
            $scope.dataAsignacionCaja = {}
        })

    }
})(window.angular);