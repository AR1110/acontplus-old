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
        'formulario',
        '$interval',
        '$log'
    ]

    function precioMasivoCtrl($scope, _mS, _tS, _commonSvc, _articleSvc, _pricingUtils, _form, $interval, $log) {
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

        $scope.scroll = {
            top: 0,
            left: 0
        };

        $scope.gridOptions = {}

        $scope.getColumnDefs = () => {
            return [{
                name: 'idTarifa',
                field: 'idTarifa',
                visible: false,
            },
            {
                name: 'tarifa',
                field: 'tarifa',
                enableCellEdit: false,
                width: '15%',
                minWidth: 100
            },
            {
                name: 'Tipo Iva',
                field: 'porcentajeIva',
                type: 'number',
                enableCellEdit: false,
                width: '5%',
                minWidth: 100
            },
            {
                name: 'precioCosto',
                field: 'precioCosto',
                enableCellEditOnFocus: false,
                enableCellEdit: false,
                allowCellFocus: true,
                type: 'number',
                width: '15%',
                minWidth: 100
            },
            {
                name: 'precioVenta',
                field: 'precioVenta',
                enableCellEditOnFocus: true,
                enableCellEdit: true,
                allowCellFocus: true,
                type: 'number',
                width: '15%',
                minWidth: 100
            },
            {
                name: 'precioConIva',
                field: 'precioConIva',
                enableCellEditOnFocus: true,
                enableCellEdit: true,
                allowCellFocus: true,
                type: 'number',
                width: '15%',
                minWidth: 100
            },
            {
                name: 'porcentajeUtilidad',
                field: 'porcentajeUtilidad',
                type: 'number',
                enableCellEditOnFocus: true,
                enableCellEdit: true,
                allowCellFocus: true,
                width: '18%',
                minWidth: 100
            },

            {
                name: 'Utilidad',
                field: 'ganancia',
                type: 'number',
                enableCellEditOnFocus: true,
                width: '10%',
                minWidth: 100
            },
            {
                name: 'P. precioPredeterminado',
                field: 'precioPredeterminado',
                visible: false
            },
            {
                name: 'Estado',
                field: 'predeterminadaVal',
                enableCellEdit: false,
                type: 'checkbox',
                //cellTemplate: '<div class="text-center"><input type="checkbox"' +
                //    'name="radio" value="radio" ng-click="grid.appScope.updateDefault(row.entity)"/></div>', //'<md-switch style="display:inline" title="Actualizar estado" aria-label="Predeterminado" ng-click="grid.appScope.updateDefault(row)"></md-switch>',

                width: '15%',
                minWidth: 100,
                cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (row.entity.estado) {
                        row.entity.predeterminadaVal = 'activo'
                        return 'blue'
                    }
                }
            }
            ]
        }

        $scope.gridOptions = {
            customScroller: function myScrolling(uiGridViewport, scrollHandler) {
                uiGridViewport.on('scroll', function myScrollingOverride(event) {
                    $scope.scroll.top = uiGridViewport[0].scrollTop;
                    $scope.scroll.left = uiGridViewport[0].scrollLeft;

                    // You should always pass the event to the callback since ui-grid needs it
                    scrollHandler(event);
                });
            },
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            enableCellEdit: false,
            onRegisterApi: registerGridApi,
            columnDefs: $scope.getColumnDefs()
        }

        function registerGridApi(gridApi) {
            if (gridApi) {
                $interval(() => {
                    gridApi.core.handleWindowResize()
                    gridApi.grid.refresh()
                }, 5)
            }
            console.log("on register api")
            gridApi.edit.on.afterCellEdit($scope, afterCellEdit)
        }
        function afterCellEdit(rowEntity, colDef, newValue, oldValue) {
            let msg = 'after cell edit ready '
            $log.info(msg)

            const index = $scope.gridOptions.data.indexOf(rowEntity) //Obtenemos indice 

            let precioConIva = 0
            let precioVenta = 0
            let porcentajeUtilidad = 0
            let ganancia = 0

            //Validacion de Campos 
            // if ([null, undefined, "", 0].includes(rowEntity.precioCosto) || isNaN($scope.precioCosto)) {
            //     toastr.warning('Ingrese el Precio de Costo')
            //     return
            // }


            if (colDef.field === "precioVenta") {
                if ([null, undefined].includes(newValue)) {
                    rowEntity.precioVenta = oldValue
                }
                if (rowEntity.precioVenta > 0) {

                    if (rowEntity.precioVenta < rowEntity.precioCosto) {
                        rowEntity[colDef.field] = oldValue
                    }
                }
            }


            if (colDef.field === "precioConIva") {
                if ([null, undefined].includes(newValue)) {
                    rowEntity.precioConIva = oldValue
                }

                if (rowEntity.precioConIva > 0) {
                    if (rowEntity.precioConIva < $scope.precioCosto) {
                        rowEntity.precioConIva = oldValue
                    }
                }
            }

            if (colDef.field === "porcentajeUtilidad" && newValue === undefined || newValue === null) {
                rowEntity.porcentajeUtilidad = oldValue
            }

            //Calculos 
            switch (colDef.field) {
                case "precioVenta":
                    precioConIva = _pricingUtils.calcularPrecioConIva(rowEntity.precioVenta, rowEntity.porcentajeIva)
                    porcentajeUtilidad = _pricingUtils.campoPorcentajeUtilidad(rowEntity.precioCosto, rowEntity.precioVenta)

                    $scope.gridOptions.data[index].precioVenta = _form.roundNumber(rowEntity.precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioConIva = _form.roundNumber(precioConIva, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].porcentajeUtilidad = _form.roundNumber(porcentajeUtilidad, 5)

                    break

                case "precioConIva":
                    precioVenta = _pricingUtils.calcularPrecioVenta(rowEntity.precioConIva, rowEntity.porcentajeIva)
                    porcentajeUtilidad = _pricingUtils.campoPorcentajeUtilidad(rowEntity.precioCosto, precioVenta)

                    $scope.gridOptions.data[index].precioConIva = _form.roundNumber(rowEntity.precioConIva, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioVenta = _form.roundNumber(precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].porcentajeUtilidad = _form.roundNumber(porcentajeUtilidad, 5)

                    break
                case "porcentajeUtilidad":
                    precioVenta = _pricingUtils.calcularPorcentajeUtilidad(rowEntity.precioCosto, rowEntity.porcentajeUtilidad)
                    precioConIva = _pricingUtils.calcularPrecioConIva(precioVenta, rowEntity.porcentajeIva)

                    $scope.gridOptions.data[index].precioVenta = _form.roundNumber(precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioConIva = _form.roundNumber(precioConIva, $scope.config.nroPrecio)
                    break
            }
            ganancia = rowEntity.precioVenta - rowEntity.precioCosto
            //$scope.update(rowEntity)
            $scope.gridOptions.data[index].ganancia = _form.roundNumber(ganancia, 5)
        }




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

                        //console.log($scope.tarifas)
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

        let isTriggered = false

        $scope.onChangeTarifa = () => {
            if (isTriggered) {
                $scope.getArticles()
            }
        }

        $scope.proveedorSearch = (textSearch) => _commonSvc.proveedorSearch(textSearch)
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
                        $scope.gridOptions.data = $scope.articles.map(item => {
                            item.tarifa = item.descripcion
                            item.precioCosto = item.precioCosto
                            item.precioVenta = item.precioVenta
                            item.precioConIva = item.precioConIva
                            item.porcentajeUtilidad = item.porcentajeUtilidad
                            item.porcentajeIva = item.iva
                            item.ganancia = _form.roundNumber((Number(item.precioVenta) - item.precioCosto), $scope.config.nroPrecio)
                            item.estado = item.estadoTarifa
                            return item
                        })
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }

        $scope.update = (item, option = null) => {
            // if (option == 1) {
            //     item.precioConIva = _form.roundNumber(_pricingUtils.calcularPrecioConIva(item.precioVenta, item.iva), $scope.config.nroPrecio)
            //     item.porcentajeUtilidad = _form.roundNumber(_pricingUtils.campoPorcentajeUtilidad(item.precioCosto, item.precioVenta), 5)
            // }
            // if (option == 2) {
            //     item.precioVenta = _form.roundNumber(_pricingUtils.calcularPrecioVenta(item.precioConIva, item.iva), $scope.config.nroPrecio)
            //     item.porcentajeUtilidad = _form.roundNumber(_pricingUtils.campoPorcentajeUtilidad(item.precioCosto, item.precioVenta), 5)
            // }
            // if (option == 3) {
            //     item.precioVenta = _form.roundNumber(_pricingUtils.calcularPorcentajeUtilidad(item.precioCosto, item.porcentajeUtilidad), $scope.config.nroPrecio)
            //     item.precioConIva = _form.roundNumber(_pricingUtils.calcularPrecioConIva(item.precioVenta, item.iva), $scope.config.nroPrecio)
            // }
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

        $scope.saveAll = () => {
            showLoader()
            _mS.getData('PUT', 'PrecioMasivo/', {data: { tipo: 2, articles: $scope.gridOptions.data } }, true).then(
                response => {
                    if (response.code == "0") {
                        _tS.toastr("warning", response.message)
                    }
                    if (response.code == "1") {
                        _tS.toastr("info", response.message)
                    }
                }
            ).catch(error => {
                hideLoader()
            })
        }

    }

})(window.angular)