(function() {

    'use strict';

    angular.module('acontPlusApp')
        .controller('tiempoCreditoCtrl', tiempoCreditoCtrl);

    tiempoCreditoCtrl.$inject = ['$scope', 'mainService', 'modalService', 'nombreModal', 'formulario', 'toastService'];

    function tiempoCreditoCtrl($scope, mS, _modalSvc, _nombreModal, form, toast) {
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            $scope.accion = accion[0];
        }
        
        $scope.data = {};
        $scope.tiempoCredito = {};
        $scope.tiempoCreditos = [];
        $scope.data.tipo = true;
        $scope.data.entrada = false;

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10000;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.$on("abrirModalTiempoCredito", (e, value)=>{
            $scope.abrirModal(null, value.tipoRegistro);
        });

        $scope.openModalNew = async()=>{
            const {tiempo_credito} = _nombreModal;            
            const {ModalTiempoCreditoCtrl} = await import(`./../../modal/${tiempo_credito.MODAL_CTRL}`);
            const modalRef = _modalSvc.openModalSecond(ModalTiempoCreditoCtrl, `TiempoCredito/${tiempo_credito.MODAL_CSHTML}`, 'md');
            modalRef.result.then(response=>{
                if(typeof response === 'object' && response.id==="1"){
                    $scope.getTiempoCredito();
                }
            })
        }

        $scope.openModalEdit = async(item)=>{
            const {tiempo_credito} = _nombreModal;            
            const {ModalTiempoCreditoCtrl} = await import(`./../../modal/${tiempo_credito.MODAL_CTRL}`);
            const modalRef = _modalSvc.openModalSecond(ModalTiempoCreditoCtrl, `TiempoCredito/${tiempo_credito.MODAL_CSHTML}`, 'md', item);
            modalRef.result.then(response=>{
                if(typeof response === 'object' && response.id==="1"){
                    $scope.getTiempoCredito();
                }
            })            
        }


        $scope.abrirModal = function(data = null, tipo) {
            $scope.tipo = tipo;
            $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-info';
            $scope.iconoModal = tipo == 1 ? 'fa fa-plus-circle' : ' fa fa-edit';
            $scope.tituloModal = tipo == 1 ? ' Agregar Tiempo Credito' : ' Actualizar Tiempo Credito';
            $scope.icono = tipo == 1 ? 'fa fa-save' : 'fa fa-edit';
            $scope.btnModal = tipo == 1 ? ' Guardar' : 'Actualizar';
            $scope.data = tipo == 1 ? {} : data.tiempoCredito;

            $("#agregarTiempoCredito").modal('show');
            return
        };

        //Option Contado || Credito
        $scope.$watch('data.tipo', (newValue) => {
            if (newValue) {
                $scope.data.diasCredito = 0;
                $scope.data.numeroCuota = 1;
                $scope.data.entrada = false;
            }
        })

        $scope.getTiempoCredito = function() {
            mS.getData('get', '/TiempoCredito/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.mesaage, response.titleSms);
                    return
                }
                $scope.tiempoCreditos = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;

            }, error => console.log(error));
        }
        $scope.getTiempoCredito();

        //Validacion de campo 
        $scope.isNoValid = val => [null, undefined, ""].includes(val) ? true : false;

        $scope.guardar = function(tipo) {
            if ($scope.isNoValid($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la descripción', $scope.tituloModal);
                return;
            }
            //Si es opcion  Credito 
            if ($scope.data.tipo === false) {
                if ($scope.isNoValid($scope.data.diasCredito)) {
                    toast.toastr('warning', 'Ingrese el Dias de Crédito', $scope.tituloModal);
                    return;
                }
                if ($scope.data.diasCredito == 0) {
                    toast.toastr('warning', 'Dias de Credito tiene que ser mayor a 0 días', $scope.tituloModal);
                    return;
                }
                if ($scope.isNoValid($scope.data.numeroCuota)) {
                    toast.toastr('warning', 'Por favor, ingrese el Número de Cuota', $scope.tituloModal);
                    return;
                }
                if ($scope.data.numeroCuota == 0) {
                    toast.toastr('warning', 'El Número de Cuota tiene que ser mayor a 0', $scope.tituloModal);
                    return;
                }
            }
            if ($scope.data.tipo) {
                if ($scope.data.diasCredito !== 0) {
                    toast.toastr('warning', 'Los Días de Crédito no tiene que ser mayor a 0', $scope.tituloModal);
                    return;
                }
                if ($scope.data.numeroCuota > 1) {
                    toast.toastr('warning', 'Número de Cuota tiene que ser igual a 1', $scope.tituloModal);
                    return;
                }
                if ($scope.data.entrada) {
                    toast.toastr('warning', 'El Contado no lleva la Entrada ', $scope.tituloModal);
                    return;
                }
            }
            //Tipo de Gestion(Compra/Venta)
            if ($scope.isNoValid($scope.data.gestion)) {
                toast.toastr('warning', 'Marque el Tipo de Gestión', $scope.tituloModal);
                return;
            }

            var url = tipo == 1 ? '/TiempoCredito/Post' : '/TiempoCredito/Put?idTiempoCredito=' + $scope.data.idTiempoCredito;

            mS.getData('post', url, $scope.data).then(function(response) {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == 1) {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getTiempoCredito();
                    $scope.$emit("reloadQueryTiempoCredito");
                    $("#agregarTiempoCredito").modal('hide');
                    return
                }
            })
        }

        //Eliminar Tiempo Credito
        $scope.delete = function(data) {
            Swal.fire({
                html: `<small>Esta seguro/a de eliminar este registro ahora?</small> `,
                icon: 'warning',
                confirmButtonText: `Sí, eliminar!`,
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    mS.getData('get', '/TiempoCredito/Delete?idTiempoCredito=' + data.tiempoCredito.idTiempoCredito).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getTiempoCredito();
                            return
                        }
                    }, error => console.log(error))
                }
            })
        }

        $("#agregarTiempoCredito").on('hide.bs.modal', (e) => {
            $scope.data = {};
            $scope.data.tipo = true;
            $scope.getTiempoCredito();
        })
    }


})(window.angular)