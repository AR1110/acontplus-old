(function () {
    'use strict'
    app.controller('precioMasivoCtrl', precioMasivoCtrl)
    precioMasivoCtrl.$inject = [
        '$scope',
        'mainService',
        'toastService',
        'commonService',
        'articuloService',
        'pricingUtils',
        'formulario'
    ]

    function precioMasivoCtrl($scope, _mS, _tS, _commonSvc, _articleSvc, _pricingUtils, _form) {
        _mS.detectDevice()

        $scope.catalogs = [
            { code: 1, description: 'Articulo' },
            { code: 3, description: 'Subfamilias' },
            { code: 4, description: 'Proveedor' },
            { code: 5, description: 'N° Documento' }
        ]

        $scope.establecimientos = []
        $scope.familias = []
        $scope.subfamilias = []
        $scope.marcas = []
        $scope.tarifas = []
        $scope.config = {}
        $scope.articles = []

        $scope.mainForm = {}

        $scope.search = ''

        $scope.mainForm.opcion = $scope.catalogs.find(x => x.code == '4').code

        $scope.initialLoad = () => {
            // _commonSvc.getEstabAsign().then(
            //     response => {
            //         $scope.establecimientos = response
            //         $scope.mainForm.codEstab = $scope.establecimientos.find(x => x.predeterminado == true).codEstab
            //         $scope.getFilters()
            //     }
            // )
            showLoader()
            $scope.mainForm.tipo = 1
            _mS.getData('get', 'PrecioMasivo/?json=' + JSON.stringify($scope.mainForm), null, true).then(
                response => {
                    if (response.code == '1') {
                        let temp = JSON.parse(response.payload)
                        $scope.familias = temp[0]
                        $scope.subfamilias = temp[1]
                        $scope.tarifas = temp[2]
                        $scope.config = JSON.parse(temp[3][0].jsonConfig).find(x => x.codTransaccion == 'AL')

                        console.log($scope.config)
                        $scope.mainForm.idTarifa = $scope.tarifas.find(x => x.predeterminada == true).idTarifa
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }
        $scope.initialLoad()

        // $scope.getFilters = () => {
        //     $scope.mainForm.tipo = 1
        //     _mS.getData('get', 'PrecioMasivo/?json=' + JSON.stringify($scope.mainForm), null, true).then(
        //         response => {
        //             if (response.code == '1') {
        //                 let temp = JSON.parse(response.payload)
        //                 $scope.familias = temp[0]
        //                 $scope.subfamilias = temp[0]
        //                 $scope.tarifas = temp[0]
        //             }
        //             console.log(response)
        //         }
        //     ).catch(error => {
        //         console.log(error)
        //     })
        // }

        let isTriggered = false

        $scope.onChangeTarifa = () => {
            if (isTriggered) {
                $scope.getArticles()
            }
        }

        $scope.proveedorSearch = (textSearch) => _commonSvc.proveedorSearch(textSearch);
        $scope.selectProveedorFiltro = (item) => {
            $scope.mainForm.rucProveedor = item.proveedor.numeroIdentificacion
            $scope.getArticles()
        }

        $scope.articuloSearch = (item) => {
            if (item.length >= 3) {
                return _articleSvc.search({ busqueda: item })
            }
        }

        $scope.articleSelected = (item) => {
            $scope.mainForm.idArticulo = item.idArticulo
            $scope.getArticles()
        }

        $scope.getArticles = () => {
            showLoader()
            $scope.search = ''
            isTriggered = false
            $scope.articles = []
            $scope.mainForm.tipo = 2
            _mS.getData('get', 'PrecioMasivo/?json=' + JSON.stringify($scope.mainForm), null, true).then(
                response => {
                    if (response.code == '0') {
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        isTriggered = true
                        let temp = JSON.parse(response.payload)
                        $scope.articles = temp[0]
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }

        $scope.update = (item, option = null) => {
            if (option == 1) {
                item.precioConIva = _form.roundNumber(_pricingUtils.calcularPrecioConIva(item.precioVenta, item.iva), $scope.config.nroPrecio)
                item.porcentajeUtilidad = _form.roundNumber(_pricingUtils.campoPorcentajeUtilidad(item.precioCosto, item.precioVenta), 5)
            }
            if (option == 2) {
                item.precioVenta = _form.roundNumber(_pricingUtils.calcularPrecioVenta(item.precioConIva, item.iva), $scope.config.nroPrecio)
                item.porcentajeUtilidad = _form.roundNumber(_pricingUtils.campoPorcentajeUtilidad(item.precioCosto, item.precioVenta), 5)
            }
            if (option == 3) {
                item.precioVenta = _form.roundNumber(_pricingUtils.calcularPorcentajeUtilidad(item.precioCosto, item.porcentajeUtilidad), $scope.config.nroPrecio)
                item.precioConIva = _form.roundNumber(_pricingUtils.calcularPrecioConIva(item.precioVenta, item.iva), $scope.config.nroPrecio)
            }
            showLoader()
            let method = "PUT"
            if (item.idArticuloPvp == 0) {
                method = "POST"
            }
            _mS.getData(method, "PrecioMasivo/", { data: item }, true).then(
                response => {
                    if (response.code == "0") {
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == "1") {
                        _tS.toastr('success', response.message)
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }

    }

})(window.angular)