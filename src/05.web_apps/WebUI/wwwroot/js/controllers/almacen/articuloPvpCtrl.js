(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('articuloPvpCtrl', articuloPvpCtrl);

    articuloPvpCtrl.$inject = ['$scope', 'commomService', 'articuloService', 'logger', 'formulario'];

    function articuloPvpCtrl($scope, cS, aS, logger, form) {
        $scope.data = {};
        $scope.tarifa = {};
        $scope.tipoIva = {};
        $scope.pvp = {};
        $scope.articulo;
        $scope.pvpArticulos = [];
        $scope.tarifas = [];
        $scope.tipoIvas = []

        $scope.$on('data', function(event, value) {
            $scope.articulo = value.articulo;
            $scope.tipoIva = $scope.tipoIvas.filter(r => r.idTipoIva === value.articulo.idTipoIva)[0];
            $scope.pvp.precioCosto = value.articulo.precioCosto;
            $scope.readPvpArticulo($scope.articulo.idArticulo);

        });



        $scope.readPvpArticulo = function(idArticulo) {
            mS.getData('get', '/PvPArticulo/Get?idArticulo=' + idArticulo).then(function(response) {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.pvpArticulos = response.data;
            }, error => console.log(error))
        }

        $scope.optionTarifa = function() {
            mS.getData('get', '/Tarifa/OptionTarifa').then(function(response) {
                if (response.id == "0") {
                    toast.toastr("warning", response.message, response.titleSms);
                    return
                }
                $scope.tarifas = response.data;
            }, error => console.log(error))
        }
        $scope.optionTarifa();


        $scope.readTipoIva = function() {
            mS.getData('get', '/TipoIva/OptionTipoIva').then(function(response) {
                if (response.id == "0") {
                    toast.toastr("warning", response.message, response.titleSms);
                    return
                }
                $scope.tipoIvas = response.data;
            }, error => console.log(error))
        }
        $scope.readTipoIva();

        $scope.crudArticuloPvP = function(tipoOperacion) {

                if (tipoOperacion == 1) {
                    $scope.titulo = "Agregar PVP";
                    $scope.url = "/PvPArticulo/CreatePvPArticulo"
                }
                if (tipoOperacion == 2) {
                    $scope.titulo = "Agregar PVP";
                    $scope.url = "/PvPArticulo/UpdatePvPArticulo";
                }


                //Validaciones 
                if (form.campo($scope.tipoIva.idTipoIva)) {
                    logger.warning('Por favor, seleccionar Tipo IVA', $scope.titulo);
                    return;
                }
                if (form.campo($scope.tarifa.idTarifa)) {
                    logger.warning('Por favor, seleccionar Tarifa', $scope.titulo);
                    return;
                }

                if (form.campo($scope.pvp.precioVenta)) {
                    logger.warning('Por favor, ingrese campo Precio Venta', $scope.titulo);
                    return;
                }
                if (form.campo($scope.pvp.precioConIva)) {
                    logger.warning('Por favor, ingrese campo Precio con IVA', $scope.titulo);
                    return;
                }
                if (form.campo($scope.pvp.porcentajeUtilidad)) {
                    logger.warning('Por favor, ingrese campo Pocentaje de Utilidad', $scope.titulo);
                    return;
                }

                cS.crud($scope.url, $scope.data, $scope.titulo).then(function(response) {
                    if (response == 1) {
                        $scope.readPvpArticulo($scope.articulo);
                        $scope.tarifa = {};
                        $scope.pvp.precioVenta = '';
                        $scope.pvp.precioConIva = '';
                        $scope.pvp.porcentajeUtilidad = '';
                        $("#btnUp").css('display', 'none');
                        $("#btnAdd").css('display', 'block');
                    }
                })

            }
            //Editar Pvp

        $scope.editarPvpArticulo = function(data, tipoOperacion) {
            $scope.data.tipoOperacion = tipoOperacion;
            $scope.pvp = data.articuloPvP;
            $scope.tarifa = data.tarifa;
            $scope.tipoIva = data.tipoIva;
            $("#btnUp").css('display', 'block');
            $("#btnAdd").css('display', 'none');
        }

        //Eliminar PVP
        $scope.eliminarPvpArticulo = function(data) {
            $scope.data.articuloPvP = data.articuloPvP;

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'mr-2 btn btn-danger'
                },
                buttonsStyling: false,
            })

            swalWithBootstrapButtons.fire({
                title: "Eliminar PVP Articulo",
                text: `Está usted seguro de eliminar la Tarifa ${data.tarifa.descripcion} del Articulo ${$scope.articulo.descripcion} de manera permanente?`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminalo!',
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    cS.crud("/PvPArticulo/DeletePvPArticulo", $scope.data).then(function(response) {
                        $scope.readPvpArticulo($scope.articulo);
                    })
                }
            })
        }

        //calcularPricePvPArticulo        
        $scope.calcularPricePvPArticulo = function(p) {
            var data = {
                idArticulo: $scope.articulo.idArticulo,
                precioCosto: $scope.pvp.precioCosto
            }
            if (form.campo($scope.pvp.precioCosto)) {
                logger.warning("Por favor, ingrese campo precio Costo", "Calcular PVP Articulos");
                return;
            }


            //Map para Cambiar los precios de pvp 
            //let data = $scope.pvpArticulos.map(pvp => {
            //    return {
            //        ...pvp,
            //        articuloPvP: {
            //            ...pvp.articuloPvP,
            //            precioCosto: p.precioCosto
            //        },
            //        articulo: $scope.articulo.idArticulo
            //    }
            //});

            cS.crud("/PvPArticulo/CalculatePricePvPArticulo", data).then(function(response) {
                if (response == 1) {
                    $scope.readPvpArticulo($scope.articulo);
                    return;
                }
            })
        }

        //Calcular Precio Sin Iva
        $scope.calcularPrecioSinIva = function(pvp, porcentaje = 0) {
            console.log($scope.tipoIva)
            let result = aS.calcularPrecioSinIva(pvp, $scope.tipoIva);
            $scope.pvp.precioConIva = form.roundNumber(result.precioConIva, 4);

            if (porcentaje == 0) {
                //No se ejecutara cuando se calcula porcentaje Utilidad
                $scope.pvp.porcentajeUtilidad = aS.campoPorcentajeUtilidad(Number($scope.articulo.precioCosto), result.precioVenta);
            }

        }

        //Calcular Precio Sin Iva
        $scope.calcularPrecioConIva = function(pvp) {
            let result = aS.calcularPrecioConIva(pvp, $scope.tipoIva);

            $scope.pvp.precioVenta = form.roundNumber(result.precioVenta, 4);
            $scope.pvp.porcentajeUtilidad = aS.campoPorcentajeUtilidad(Number($scope.articulo.precioCosto), result.precioVenta);
        }

        //Calcular Porcentaje Utilidad
        $scope.calcularPorcentajeUtilidad = function(pvp) {

            let precioVenta = aS.calcularPorcentajeUtilidad(pvp, $scope.articulo.precioCosto);
            $scope.pvp.precioVenta = form.roundNumber(precioVenta, 4);

            $scope.calcularPrecioSinIva($scope.pvp, 1);
        }

        $("#agregarArticulo").on('hide.bs.modal', function(e) {
            $scope.data = {};
            $scope.pvp = {};
            $scope.articulo = {};
            $scope.pvpArticulos = [];
        })
    }
})();