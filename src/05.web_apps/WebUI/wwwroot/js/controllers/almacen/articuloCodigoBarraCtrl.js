//  Codigo Barra 
//Cargar el mismo descripcion del articulo en la descripcion del registro cod. barra 
//color no es obligatorio 

(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('articuloCodigoBarraCtrl', articuloCodigoBarraCtrl);

    articuloCodigoBarraCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function articuloCodigoBarraCtrl($scope, mS, toast, form) {
        $scope.data = {};  
        $scope.medida = {};     
        $scope.medidas = []; 

        $scope.$on('sharedDataArticuloCodigoBarra', (event, value)=> {
            $scope.tipo=1;
            $scope.articulo=value;                       
            $scope.data.descripcion = value.descripcion;
            $scope.data.color = "#ffffff";
            $scope.getCodigoBarraArticulo(value.idArticulo);

        });

        $scope.getCodigoBarraArticulo=function(idArticulo){
            mS.getData('get', '/CodigoBarraArticulo/Get?idArticulo=' + idArticulo).then(response=>{                
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.articuloCodigoBarras = response.data;
            }, error=>console.log(error))
        }
            
        $scope.getMedida = function() {
            mS.getData('get', '/Medida/GetByMedida').then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.medidas = response.data;
                $scope.medida = $scope.medidas[0];
            },error=> console.log(error));
        }
        $scope.getMedida();

        //Colores para presentaciones del Articulo 
        $scope.coloresCodigoBarra = function(cba) {
            return { "background-color": cba.articuloCodigoBarra.color, width: 20, height: 20 }
        }


        $scope.saveUpdate = function(tipo) {
            let titulo = tipo == 1 ? 'Agregar' : 'Actualizar';
            if (form.campo($scope.medida.idMedida)) {
                toast.toastr('warning', 'Seleccione una Medida', titulo);
                return;
            }
            if (form.campo($scope.data.codigoBarra)) {
                toast.toastr('warning', 'Ingrese el Codigo de Barra', titulo);
                return;
            }
            if (form.campo($scope.data.descripcion)) {
                 toast.toastr('warning', 'Ingrese la descripción', titulo);
                 return;
            }
            // if (form.campo($scope.articuloCodigoBarra.color)) {
            //     toast.toastr('warning', 'Seleccione el Color', $scope.titulo);
            //     return;
            // }

            $scope.data.idArticulo = $scope.articulo.idArticulo;
            $scope.data.idMedida = $scope.medida.idMedida;
            var url = tipo == 1 ? '/CodigoBarraArticulo/Post' : '/CodigoBarraArticulo/Put?idArticuloCodigoBarra='+$scope.data.idArticuloCodigoBarra

            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getCodigoBarraArticulo($scope.articulo.idArticulo);
                    $scope.data = {};
                    $scope.data.descripcion = $scope.articulo.descripcion;
                    $scope.data.color = "#ffffff";
                    $scope.tipo=1;
                }
            },error=>console.log(error))
        }

        $scope.editarCodigoBarra = function(data) {        
            $scope.tipo=2;
            $scope.data = data.articuloCodigoBarra;
            $scope.medida = data.medida;           
        }
        $scope.reset=function(){
            $scope.data={};
            $scope.tipo=1;
            $scope.getCodigoBarraArticulo($scope.articulo.idArticulo);
        }


        $scope.deleteArtCodeBarra = function({ articuloCodigoBarra: data }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Código de Barra del Articulo ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false,
            }).then(result => {
                if (result.value) {
                    mS.getData('get', '/CodigoBarraArticulo/Delete?idArticuloCodigoBarra=' + data.idArticuloCodigoBarra).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getCodigoBarraArticulo($scope.articulo.idArticulo);
                            $scope.data = {};
                            $scope.tipo=1;
                        }
                    })
                }
            })
        }

        $("#modalAddUpdateProduct").on('hide.bs.modal', function() {
            $scope.data = {};
            $scope.articulo={};
            
        })

    }
})();