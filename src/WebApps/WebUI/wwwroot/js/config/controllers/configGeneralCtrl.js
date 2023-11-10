
(function () {

    'use strict';

    app.controller('configGeneralCtrl', configGeneralCtrl);

    configGeneralCtrl.$inject = [
        '$scope',
        'mainService',
        'commonService',
        'toastService',
        'articuloService'
    ]

    function configGeneralCtrl($scope, mS, commonSvc, tS, articuloSvc) {


        $scope.data = {};
        $scope.decimales = [2, 3, 4, 5];

        $scope.codigo = {
            CV: 'CV',
            CI: 'CI',
            CD: 'CD',
            CS: 'CS'

        }


        $scope.getDataTabs = function (codConfig) {
            try {
                showLoader();
                $scope.codConfig = codConfig;

                mS.getData('get', 'Config/Sistema/Get/' + JSON.stringify({ codConfig }), null, true).then(response => {
                    if (response.code === '0') {
                        hideLoader();
                        console.log(response)
                    }

                    if (response.code === '1') {
                        hideLoader();
                        switch (codConfig) {
                            case 'CV':
                                $scope.gestionSistema = JSON.parse(response.payload)[0][0];
                                $scope.searchText = $scope.gestionSistema.nombreFiscal;
                                $scope.searchTextArticle = $scope.gestionSistema.descripcion;
                                // $scope.gestionSistema.configPorcentaje = 'PI'
                                break;

                            case 'CI':
                                $scope.gestionInventario = JSON.parse(response.payload)[0][0];
                                $scope.valoracionMetodos = JSON.parse(response.payload)[1];
                                break;

                            case 'CD':
                                $scope.response = JSON.parse(response.payload)[0];
                                $scope.decimalAlmacen = $scope.response.find(item => item.codTransaccion === 'AL')
                                $scope.decimalVenta = $scope.response.find(item => item.codTransaccion === 'V')
                                $scope.decimalCompra = $scope.response.find(item => item.codTransaccion === 'C')
                                break;

                            case 'CS':
                                $scope.entidadNotificaciones = JSON.parse(response.payload)[0];
                                console.log($scope.entidadNotificaciones)
                                break;
                            default:
                                break;
                        }

                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.tipoConfigPI = true;
        $scope.tipoConfigPF = false;
        $scope.onChangeConfigPorcentaje = function () {
            if ($scope.gestionSistema.tipoConfig == 'PI') {
                $scope.tipoConfigPI = true;
                $scope.tipoConfigPF = false;
            }
            if ($scope.gestionSistema.tipoConfig == 'PF') {
                $scope.tipoConfigPI = false;
                $scope.tipoConfigPF = true;
            }
        }



        $scope.getDataTabs($scope.codigo.CV);


        //------------------------Cliente-------------------------------------------------
        $scope.searchTextChange = function (textSearch) {
            if (textSearch === null || textSearch === undefined || textSearch === "") {
                $scope.gestionSistema.idCliente = undefined
            }
        }
        $scope.searchCustomer = function (textSearch) {
            if (textSearch === null || textSearch === undefined || textSearch === "") return Promise.resolve([])
            return commonSvc.clienteSearch(textSearch) || Promise.resolve([])
        }

        $scope.selectedItemChangeCliente = function (item) {
            if (!item) return
            $scope.gestionSistema.idCliente = item.idCliente;
        }
        //------------------------Cliente-------------------------------------------------

        //---------------------------------Articulo---------------------------
        $scope.searchTextChangeArticle = (textSearch) => {
            if (textSearch === null || textSearch === undefined || textSearch === "") {
                $scope.gestionSistema.idArticulo = undefined;
            }
        }

        $scope.searchArticle = async (textSearch) => {
            return articuloSvc.search({
                busqueda: textSearch,
                condicion: false
            }) || []

        }

        $scope.selectedItemChangeArticle = (item) => {
            if (!item) return
            $scope.gestionSistema.idArticulo = item.idArticulo;
        }
        //---------------------------------Articulo---------------------------

        $scope.save = function () {
            try {
                let jsonConfig = {}
                let data = {}
                console.log($scope.gestionSistema)
                //---------------------------------Configuracion de Ventas---------------------------
                if ($scope.codConfig === $scope.codigo.CV) {

                    if ($scope.gestionSistema.customerDefault) {
                        if (!($scope.gestionSistema.idCliente > 0)) {
                            tS.toastr('warning', 'Seleccione un Cliente')
                            return
                        } else {
                            jsonConfig.idCliente = $scope.gestionSistema.idCliente;
                        }
                    } else {
                        jsonConfig.idCliente = undefined;
                    }
                    if ($scope.gestionSistema.articleDefault) {
                        if (!($scope.gestionSistema.idArticulo > 0)) {
                            tS.toastr('warning', 'Selecione un Articulo')
                            return
                        } else {
                            jsonConfig.idArticulo = $scope.gestionSistema.idArticulo;
                        }
                    } else {
                        jsonConfig.idArticulo = undefined;
                    }


                    if ($scope.gestionSistema.configDeuda) {
                        if (!$scope.gestionSistema.tipoConfig) {
                            tS.toastr('warning', ' Seleccione El tipo de Configuración de Interes');
                            return
                        }

                        if (!($scope.gestionSistema.interes > 0)) {
                            tS.toastr('warning', ' Ingrese el valor del Interes');
                            return
                        }

                    } else {
                        $scope.gestionSistema.tipoConfig = undefined;
                        $scope.gestionSistema.interes = undefined;
                    }



                    jsonConfig.searchCode = $scope.gestionSistema.searchCode;
                    jsonConfig.printerAutomatic = $scope.gestionSistema.printerAutomatic;
                    jsonConfig.payAutomatic = $scope.gestionSistema.payAutomatic;
                    jsonConfig.configInteres = $scope.gestionSistema.configDeuda;
                    jsonConfig.multipleVendedor = $scope.gestionSistema.multipleVendedor;
                    jsonConfig.infoInteres = {
                        tipoConfig: $scope.gestionSistema.tipoConfig,
                        interes: $scope.gestionSistema.interes,
                    },
                        data = {
                            idSistema: $scope.gestionSistema.idSistema,
                            jsonConfig
                        }
                }

                console.log($scope.codConfig)
                //---------------------------------Configuracion de Inventario---------------------------
                if ($scope.codConfig === $scope.codigo.CI) {
                    if ($scope.gestionInventario.llevaInventario) {
                        if (!($scope.gestionInventario.idMetodoValoracion > 0)) {
                            tS.toastr('warning', 'Seleccione un Metodo de Valoración')
                            return
                        } else {
                            jsonConfig = $scope.valoracionMetodos.find(item => item.idMetodoValoracion === $scope.gestionInventario.idMetodoValoracion)
                        }
                    } else {
                        jsonConfig.idMetodoValoracion = undefined;
                        jsonConfig.codMetodoValoracion = undefined;
                    }

                    jsonConfig.llevaInventario = $scope.gestionInventario.llevaInventario ? 'SI' : 'NO';

                    data = {
                        idSistema: $scope.gestionInventario.idSistema,
                        jsonConfig
                    }
                }


                //---------------------------------Configuracion de Decimales---------------------------
                if ($scope.codConfig === $scope.codigo.CD) {
                    jsonConfig = [$scope.decimalAlmacen, $scope.decimalCompra, $scope.decimalVenta]

                    data = {
                        idSistema: $scope.decimalAlmacen.idSistema,
                        jsonConfig
                    }
                }

                //------------------------------Configuracion de Notificaciones------------------------
                if ($scope.codConfig === $scope.codigo.CS) {
                    data = {
                        idSistema: $scope.entidadNotificaciones[0].idSistema,
                        jsonConfig: $scope.entidadNotificaciones.map(item => ({
                            idNotificacionSistema: item.idNotificacionSistema,
                            estado: item.estado,
                            codigo: item.codigo
                        }))
                    }
                }


                showLoader()
                mS.getData('put', 'Sistema/Put?json= ' + JSON.stringify(data), null, true).then(response => {
                    if (response.code === '0') {
                        hideLoader();
                        tS.toastr('warning', response.message)
                        console.log(response)
                    }

                    if (response.code === '1') {
                        hideLoader();
                        tS.toastr('success', response.message)
                        $scope.getDataTabs($scope.codConfig);
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }

    }

})(window.angular)
