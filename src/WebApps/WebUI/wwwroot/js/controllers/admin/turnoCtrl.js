(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('turnoCtrl', turnoCtrl);

    turnoCtrl.$inject = ['$scope', 'mainService', 'formulario', 'toastService'];

    function turnoCtrl($scope, mS, form, toast) {
        $scope.data = {};
        $scope.turnos = [];

        $scope.hstep = 1; //Hora 
        $scope.mstep = 15; //Minuto

        //Paginacion
        $scope.maxSize = 8;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 8;
        $scope.recordsQuantity = [8, 15, 25, 50];
        
        $scope.abrirModalNuevo = function(){
            $scope.tipoRegistro =1;
            $("#modalAddUpdateTurno").modal('show');
            return
        }

        //Read Turno
        $scope.getTurnos = function() {
            mS.getData('get', '/Turno/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.turnos = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;

            }, error => console.log(error))
        }
        $scope.getTurnos();

        $scope.pagechanged = function() {
            $scope.getTurnos();
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.getTurnos()
        };
    

        $scope.getDayAll = function() {
            mS.getData('get', '/Horario/ListDia').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.dias = response.data.map(getDateFromHours);
            })
        }
        $scope.getDayAll();

        function getDateFromHours(val) {
            let fecha = new Date();
            let horaApertura = val.horario.apertura.split(':'); //Transformar la hora de apertura en array 
            let horaCierre = val.horario.cierre.split(':'); //Transformar la hora de cierre en Array 
            let anio = fecha.getFullYear();
            let mes = fecha.getMonth();
            let dia = fecha.getDay();

            val.horario.apertura = new Date(anio, mes, dia, horaApertura[0], horaApertura[1]);
            val.horario.cierre = new Date(anio, mes, dia, horaCierre[0], horaCierre[1]);
            return val;                     
        }            

        //CRUD
        $scope.saveUpdate = function(tipoRegistro) {
            let tituloModal = tipoRegistro==1?'Guardar':'Actualizar';

            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', tituloModal);
                return;
            }
            if ($scope.dias.every(d => d.horario.estado === false)) {
                toast.toastr('warning', 'Ingrese al menos un Horario de Trabajo', tituloModal);
                return;
            }
            
            if($scope.dias.some(dia=>["", null, undefined].includes(dia.horario.apertura))){
                $scope.dias.forEach((dia, index)=>{
                    if(["", null, undefined].includes(dia.horario.apertura)){
                        Swal.fire({
                            title:`<small>${tituloModal}</small>`,
                            icon:'warning', 
                            html:`<small>Ingrese correctamente la Hora de Apertura del dia <b>${dia.diaSemana}</b></small>`
                        });
                        return
                    }
                });
                return                
            }

            if($scope.dias.some(dia=>dia.apertura>dia.cierre)){
                $scope.dias.forEach((dia, index)=>{
                    if(dia.apertura>dia.cierre){
                        Swal.fire({
                            title:`<small>${tituloModal}</small>`,
                            icon:'warning', 
                            html:`<small>La hora de Apertura del dia ${dia.diaSemana} no puede ser mayor a la hora de Cierre</small>`
                        });
                        return
                    }
                }); 
                return              
            }

            if($scope.dias.some(dia=>dia.cierre < dia.apertura)){
                $scope.dias.forEach((dia, index)=>{
                    if(dia.cierre < dia.apertura){
                        Swal.fire({
                            title:`<small>${tituloModal}</small>`,
                            icon:'warning', 
                            html:`<small>La hora de Cierre del dia ${dia.diaSemana} no puede ser menor a la hora de Apertura</small>`
                        });
                        return
                    }
                });  
                return             
            }

            if($scope.dias.some(dia=>["", null, undefined].includes(dia.horario.cierre))){
                $scope.dias.forEach((dia, index)=>{
                    console.log(dia)
                    if(["", null, undefined].includes(dia.horario.cierre)){
                        Swal.fire({
                            title:`<small>${tituloModal}</small>`,
                            icon:'warning', 
                            html:`<small>Ingrese correctamente la Hora de Cierre del dia <b>${dia.diaSemana}</b></small>`
                        });
                        return
                    }
                });  
                return   
            }
                    
            
            let formatTimes  = $scope.dias.map(function({ horario }) {                              
                let apertura =  horario.apertura.getHours() + ':' + horario.apertura.getMinutes(); //Hora Apertura 
                let cierre = horario.cierre.getHours() + ':' + horario.cierre.getMinutes(); //Hora Cierre                                                               
                return {  
                    idHorario: horario.idHorario,                  
                    idDia: horario.idDia,
                    apertura,
                    cierre,
                    estado: horario.estado
                }
            });

            $scope.data.horario = formatTimes;
            let url = tipoRegistro == 1 ? '/Turno/Post' : '/Turno/Put';

            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                     $("#modalAddUpdateTurno").modal('hide');
                    $scope.getTurnos();
                }
            });
        };


        $scope.editarTurno = function(data){           
            mS.getData('get', '/Horario/GetByIdTurno?idTurno=' + data.turno.idTurno).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }

                $scope.tipoRegistro=2;
                $scope.data = data.turno;
                $scope.dias = response.data.map(getDateFromHours);
                $("#modalAddUpdateTurno").modal('show');
                return
            }, error => console.log(error));            
        };

        $scope.viewHorarioPoper = function(data) {
            mS.getData('get', '/Horario/GetByIdTurno?idTurno=' + data.turno.idTurno).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.horarios = response.data;
            })            
        }

        $scope.askToDelete = function(item){
            Swal.fire({
                icon: 'warning',                
                html: `<small>¿Esta Ud. seguro de eliminar el Turno: <b>${item.turno.descripcion}</b> ahora?</small>`,
                showDenyButton: true,
                confirmButtonText: `Si, eliminar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            }).then((response) => {
                if (response.isConfirmed) {
                    $scope.delete(item);
                    return;
                };
            });      
        }


        //Delete Turno 
        $scope.delete = function(item) {
            mS.getData('post', '/Turno/Delete?idTurno=' + item.turno.idTurno).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getTurnos();
                    return
                }
            })
        }



        $("#modalAddUpdateTurno").on('hide.bs.modal', function(e) {
            $scope.data = {};
            $scope.getDayAll();

        })
    }
})(window.angular);