(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('articuloUbicacionCtrl', articuloUbicacionCtrl);

    articuloUbicacionCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function articuloUbicacionCtrl($scope, mS, toast, form) {
        $scope.data = {};
        $scope.bodega = {};

        $scope.articuloUbicaciones = [];
        $scope.bodegas = [];

        $scope.$on('sharedDataArticuloUbicacion', function(event, value) {
            $scope.tipo=1;
            $scope.articulo = value;
            $scope.getUbicacionArticulo(value.idArticulo);

        });

        $scope.getUbicacionArticulo = function(idArticulo) {
            mS.getData('get', '/UbicacionArticulo/Get?idArticulo=' + idArticulo).then(response=>{
                if(response.id=="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.articuloUbicaciones = response.data;
            })
        }

        $scope.getSucursal = function() {
             mS.getData('get', '/Sucursal/GetSucursalByRol').then(response => {
                 if(response.id=="0"){
                     toast.toastr('warning', response.message, response.titleSms);
                     return
                 }
                $scope.sucursales = response;
                $scope.sucursal = response[0];
                $scope.getBodega();
            }, error => console.log(error));           
        }
        $scope.getSucursal();


        $scope.getBodega = function() {
            mS.getData('get', '/Bodega/GetByIdSucursal?idSucursal=' + $scope.sucursal.idSucursal).then(response => {            
                if (response.id==="0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.bodegas = response.data;
                $scope.bodega = $scope.bodegas[0];
            }, error=>console.log(error))
        };

        $scope.saveUpdate = function(tipo) {
            let titulo = tipo==1?'Agregar':'Actualizar';
            if (form.campo($scope.bodega.idBodega)) {
                toast.toastr('warning', 'Seleccione la Bodega', titulo);
                return;
            }
            if (form.campo($scope.data.ubicacion)) {
                toast.toastr('warning', 'Ingrese la Descripción', titulo);
                return;
            }

            $scope.data.idArticulo = $scope.articulo.idArticulo
            $scope.data.idBodega = $scope.bodega.idBodega
            
            var url = tipo == 1 ? "/UbicacionArticulo/Post" : "/UbicacionArticulo/Put?idArticuloUbicacion="+$scope.data.idArticuloUbicacion
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getUbicacionArticulo($scope.articulo.idArticulo);
                    $scope.data = {};                   
                    $scope.tipo=1;                   
                }
            })

        }


        $scope.editUbicacionArt = function(data) {
            $scope.tipo=2;
            $scope.bodega = data.bodega;
            $scope.data = data.articuloUbicacion;            
        }
        $scope.reset=function(){
            $scope.tipo=1;
            $scope.data={};
            $scope.bodega={};
            $scope.getUbicacionArticulo($scope.articulo.idArticulo);
        }


        $scope.deleteUbicacionArt = function({ articuloUbicacion: data }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Ubicación del Articulo ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.value) {
                    mS.getData('post', "/UbicacionArticulo/Delete?idArticuloUbicacion=" + data.idArticuloUbicacion).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getUbicacionArticulo($scope.articulo.idArticulo);
                            $scope.data = {};
                            $scope.tipo=1;
                            return
                        }
                    }, error => console.log(error))
                }
            })
        }

        $("#modalAddUpdateProduct").on('hide.bs.modal', e => {
            $scope.data = {};          
            $scope.bodega = {};
        })

    }
})();