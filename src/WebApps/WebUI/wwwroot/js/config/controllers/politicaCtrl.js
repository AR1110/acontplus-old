(function() {
    'use strict';

    angular.module('acontPlusApp')
        .controller('politicaCtrl', politicaCtrl);

    politicaCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function politicaCtrl($scope, mS, toast, form) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }
        
        $scope.data = {}
        $scope.politica = {}
        $scope.politicas = [];

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]


        $scope.getPoliticas = function() {
            mS.getData('get', '/Politica/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.politicas = response.data;
                if (response.data.length > 0) $scope.totalRecords = response.data[0].totalRecords;
            }, error => console.log(error))

        }
        $scope.getPoliticas();

        $scope.pagechanged = function() {
            $scope.getPoliticas()
        }

        $scope.changePageSize = function() {
            $scope.pageIndex = 1;
            $scope.getPoliticas();
        }

        //Abrir Modal Politica y Acceso
        $scope.abrirModal = function(data, type) {
            $scope.type = type;
            $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
            $scope.iconoModal = type == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.tituloModal = type == 1 ? ' Nuevo' : 'Editar';
            $scope.icono = type == 1 ? 'ti-save' : 'fa fa-edit';
            $scope.btnModal = type == 1 ? ' Guardar' : ' Actualizar';
            $scope.data = type == 1 ? {} : data;
            $('#agregar').modal('show');
            return;
        }

        $scope.$watch('data.descripcion', function(des) {
            if (!form.campo(des) && $scope.type == 1) {
                $scope.data.codigo = form.obtenerTresLetras(des);
            }
        })

        $scope.saveUpdate = function(type) {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Por favor, ingrese la descripcion', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.data.codigo)) {
                toast.toastr('warning', 'Por favor, ingrese el código', $scope.tituloModal);
                return;
            }
            let url = type == 1 ? '/Politica/Post' : '/Politica/Put';
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

        $scope.delete = async function({ idPolitica }) {
            let {isConfirmed} = Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar esta Politica?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            });
            
            if(isConfirmed){
                mS.getData('post', '/Politica/Delete?idPolitica=' + idPolitica).then(response => {
                    if (response.id == "0") {
                        toast.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    if (response.id == "1") {
                        toast.toastr('success', response.message, response.titleSms);
                        $scope.getPoliticas();
                        return
                    }
                });
            };            
        };

        $('#agregar').on('hide.bs.modal', e => {
            $scope.data = {};
            $scope.getPoliticas();
        });

        /**----------------------------------------------------ASIGNACION DE ACCESOS ----------------- */
        $scope.openModalAcceso = function(item){
            $scope.nombrePolitica = item.descripcion;

            mS.getData('get', '/Acceso/Get?idPolitica=' + item.idPolitica).then(response=>{                
                if(response.id==="0"){
                    form.sweetAlert('warning', response.message, response.titleSms);
                    return
                }
                if(response.id==="1"){  
                                         
                    $scope.accesos = JSON.parse(response.data);                                       
                    return
                }
            })
            $("#modalAcceso").modal('show');
            return
        };


        $scope.guardarAcceso = async function(){
            let {isConfirmed} = await Swal.fire({
                icon: 'warning',
                //title: 'Insumos',
                html: `<small>Esta seguro/a de guardar los accesos asignados a la Politica <strong>${$scope.nombrePolitica}</strong></small>`,
                showDenyButton: true,
                confirmButtonText: `Si, guardar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            });
            
            if(isConfirmed){
                form.showLoaderPost(1);                                
                mS.getData('post', '/Acceso/Put', $scope.accesos).then(response=>{
                    if(response.id==="0"){
                        form.sweetAlert('warning', response.message, response.titleSms);
                        return
                    }
                    if(response.id==="1"){
                        form.sweetAlert('success', response.message, response.titleSms, 1000);
                        $("#modalAcceso").modal('hide');
                        return
                    }
                })
            }
        };

        $("#modalAcceso").on('hide.bs.modal', e=>{
            $scope.searchAcceso = '';
            $scope.accesos = [];
        })






    }


})(window.angular)