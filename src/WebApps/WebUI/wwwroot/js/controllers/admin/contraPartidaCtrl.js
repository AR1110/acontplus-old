

(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('contraPartidaCtrl', contraPartidaCtrl);

    contraPartidaCtrl.$inject = ['$scope', '$timeout', 'mainService', 'formulario', 'toastService'];

    function contraPartidaCtrl($scope, $timeout, mS, form, toast) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }

        $scope.data = {};

        $scope.contraPartidas = [];
        $scope.cajas = [];
        $scope.entidades = [];
        $scope.selectedCaja = [];
        $scope.selectedEntidad = [];


        $scope.allCheck = false; //Check All para Entidad Financiera   por defecto Desmarcado 
        $scope.allCheckCaja = false; //check all para Caja por defecto Desmarcado 

        $scope.totalRecords = 0;
        $scope.limitOptions = [5, 10, 25, 50];

        $scope.options = {
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            order: 'contraPartida.descripcion',
            limit: 5,
            page: 1
        };


        $scope.initiload = function () {
            //Listar Contra Partida
            mS.getData('get', '/ContraPartida/Get').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.contraPartidas = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;
            }, error => console.log(error));


            //Listar Caja
            mS.getData('get', '/Caja/ListCaja').then(response => {
                $scope.cajas = response.data;
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
            }, error => console.log(error));

            //Listar Entidad Financiera 
            mS.getData('get', '/EntidadFinanciera/ListEntidadFinanciera').then(response => {
                $scope.entidades = response.data;
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
            }, error => console.log(error))
        }
        $scope.initiload();

        //Listar ContraPartidas Cajas al momento de Actualizar
        $scope.readContraPartidaCaja = function (idContraPartida) {
            mS.getData('get', '/ContraPartidaCaja/ReadContraPartidaCaja?idContraPartida=' + idContraPartida).then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                
                $scope.cajas = response.data;
                if ($scope.cajas.every(value => value.contraPartidaCaja.estado==true)){
                    $scope.allCheckCaja = true; //Si vienen todos marcados, marcamos <<Seleccionador Todo>>            
                } 

            }, error => console.log(error))
        }


        //Listar ContraPartida Entidad Financiera al momento de Actualizar
        $scope.readContraPartidaEntidadFinanciera = function (idContraPartida) {
            mS.getData('get', '/ContraPartidaEntidadFinanciera/ReadContraPartidaEntidadFinanciera?idContraPartida=' + idContraPartida).then(response => {
                $scope.entidades = response.data;

                //Si vienen todos marcados, marcamos <<Seleccionador Todo>>
                if (response.data.every(value => value.contraPartidaEntidadFinanciera.estado == true)){
                    $scope.allCheck = true;

                } 

                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
            }, error => console.log(error))
        }

        //Open Modal
        $scope.abrirModal = function (data, tipo) {            
            $scope.tipo = tipo;
            $scope.tituloModal = tipo == 1 ? 'Agregar Contrapartida' : 'Actualizar Contrapartida';
            $scope.iconoModal = tipo == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-success';
            $scope.icono = tipo == 1 ? 'fa fa-save' : 'fa fa-edit';
            $scope.btnModal = tipo == 1 ? 'Guardar' : 'Actualizar';
            if (tipo == 2) {
                $scope.data = data.contraPartida;
                $scope.readContraPartidaCaja(data.contraPartida.idContraPartida);
                $scope.readContraPartidaEntidadFinanciera(data.contraPartida.idContraPartida);
            }
            $("#descripcion").trigger('focus');
            $("#agregar").modal('show');
        }

        //Obtener tres primeras letras de la Descripcion para el Código
        $scope.$watch('data.descripcion', function (des) {
            if (!form.campo(des) && $scope.tipo == 1) {
                $scope.data.codigo = form.obtenerTresLetras(des);
            }
        });

        $scope.isCheckedCaja = function (allCheckCaja) {
            $timeout(() => {
                //Si todos estan marcados los check tambien marcamos el All(Seleccionar Todos) Check
                if ($scope.cajas.every(value => value.contraPartidaCaja.estado == true)) {
                    $scope.allCheckCaja = true;
                } else {
                    //Si esta marcado el All Check lo desmarcamos 
                    allCheckCaja ? $scope.allCheckCaja = !allCheckCaja : $scope.allCheckCaja = allCheckCaja;
                }
            }, 100);
        };

        $scope.isCheckedEntidad = function (check) {
            $timeout(() => {
                //Si todos estan marcados los check tambien marcamos el All Check
                if ($scope.entidades.every(value => value.contraPartidaEntidadFinanciera.estado == true)) {
                    $scope.allCheck = true;
                } else {
                    //Si esta marcado el All Check en Entidad Financiera lo desmarcamos 
                    check ? $scope.allCheck = !check : $scope.allCheck = check;
                }
            })
        }


        $scope.toggleAll = function (tipo) {
            //si es Caja
            if (tipo == 'C') {
                for (var i in $scope.cajas) {
                    $scope.cajas[i].contraPartidaCaja.estado = !$scope.allCheckCaja;
                }
            } else {
                for (var i in $scope.entidades) {
                    $scope.entidades[i].contraPartidaEntidadFinanciera.estado = !$scope.allCheck;
                }
            }
        };

      


        $scope.saveUpdate = function (tipo) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Ingrese el Código', $scope.tituloModal);
                return;
            }

            if ($scope.cajas.every(value => value.contraPartidaCaja.estado == false)) {
                toast.toastr('warning', 'Seleccione al menos una Caja', $scope.tituloModal);
                return
            }

            if ($scope.entidades.every(value => value.contraPartidaEntidadFinanciera.estado == false)) {
                toast.toastr('warning', 'Seleccione al menos una Entidad Financiera', $scope.tituloModal);
                return
            }

            $scope.data.dataCaja = $scope.cajas;
            $scope.data.dataEntidadFinanciera = $scope.entidades
            var url = tipo == 1 ? '/ContraPartida/Post' : '/ContraPartida/Put';

            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregar").modal('hide');
                    return;
                }
            }, error => console.log(error))
        }

        //Eliminar ContraPartida
        $scope.eliminarContraPartida = function (data) {
            Swal.fire({
                icon: 'warning',
                html: '<html>Esta seguro/a de eliminar este registro ahora?',
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No,cancelar',
                allowOutsideClick: false,
            }).then(result => {
                if (result.value) {
                    mS.getData('get', '/ContraPartida/Delete?idContraPartida=' + data.contraPartida.idContraPartida).then(response => {
                        if (response.id == "0") {
                            toast.tostr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.initiload();
                        }
                    }, error => console.log(error))
                }
            })
        }

        $scope.viewDetalle = function (data) {            
                $scope.readContraPartidaCaja(data.contraPartida.idContraPartida);
                $scope.readContraPartidaEntidadFinanciera(data.contraPartida.idContraPartida);
                $("#detalle").modal('show');
                return            
        }

        $(".modal").on('hide.bs.modal', function (e) {
            $scope.allCheck = false;
            $scope.allCheckCaja = false;
            $scope.initiload();
            $scope.data = {};
        })
    }
})(window.angular);
