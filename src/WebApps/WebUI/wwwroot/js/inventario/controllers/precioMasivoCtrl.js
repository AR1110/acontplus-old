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
        '$log',
        '$window',
        'modalService',
        'uiGridConstants',
        'proveedorService'
    ]

    function precioMasivoCtrl($scope, _mS, _tS, _commonSvc, _articleSvc, _pricingUtils, _form, $interval, $log, $window, _modalSvc, uiGridConstants, proveedorSvc) {
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

        $scope.articlesToSave = []

        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            showGridFooter: true,
            enableCellEdit: false,
            enableFiltering: true,
        }
        $scope.setColumnDefs = () => {
            $scope.gridOptions.columnDefs = [
                {
                    name: 'Op',
                    enableCellEdit: false,
                    enableFiltering: false,
                    width: '5%',
                    minWidth: '10',
                    cellTemplate: `<button type="button" class="btn btn-warning btn-sm" btn-article-add-update params="row.entity" result-modal="grid.appScope.resultModalArticleEdit(result)"><i class="ti-pencil"><i></button>`,
                },
                {
                    name: 'Articulo',
                    field: 'descripcion',
                    visible: true,
                    width: '20%',
                    minWidth: 100,
                },
                {
                    name: 'idTarifa',
                    field: 'idTarifa',
                    visible: false,
                },
                {
                    name: 'tarifa',
                    field: 'tarifa',
                    enableCellEdit: false,
                    enableFiltering: false,
                    width: '8%',
                    minWidth: 100
                },
                {
                    name: 'Tipo Iva',
                    field: 'porcentajeIva',
                    type: 'number',
                    enableCellEdit: false,
                    enableFiltering: false,
                    width: '3%',
                    minWidth: 100
                },
                {
                    name: 'precioCosto',
                    field: 'precioCosto',
                    enableCellEditOnFocus: false,
                    enableCellEdit: false,
                    allowCellFocus: true,
                    enableFiltering: false,
                    type: 'number',
                    width: '10%',
                    minWidth: 100
                },
                {
                    name: 'precioVenta',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return "";
                    },
                    field: 'precioVenta',
                    enableCellEditOnFocus: true,
                    enableFiltering: false,
                    enableCellEdit: true,
                    allowCellFocus: true,
                    type: 'number',
                    width: '12%',
                    minWidth: 100
                },
                {
                    name: 'precioConIva',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return "";
                    },
                    field: 'precioConIva',
                    enableCellEditOnFocus: true,
                    enableFiltering: false,
                    enableCellEdit: true,
                    allowCellFocus: true,
                    type: 'number',
                    width: '12%',
                    minWidth: 100
                },
                {
                    name: '% utilidad',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return "";
                    },
                    field: 'porcentajeUtilidad',
                    type: 'number',
                    enableCellEditOnFocus: true,
                    enableFiltering: false,
                    enableCellEdit: true,
                    allowCellFocus: true,
                    width: '10%',
                    minWidth: 100
                },

                {
                    name: 'Utilidad',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return "";
                    },
                    field: 'ganancia',
                    type: 'number',
                    enableCellEditOnFocus: true,
                    enableFiltering: false,
                    width: '8%',
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
                    enableFiltering: false,
                    type: 'checkbox',
                    //cellTemplate: '<div class="text-center"><input type="checkbox"' +
                    //    'name="radio" value="radio" ng-click="grid.appScope.updateDefault(row.entity)"/></div>', //'<md-switch style="display:inline" title="Actualizar estado" aria-label="Predeterminado" ng-click="grid.appScope.updateDefault(row)"></md-switch>',

                    width: '10%',
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

        $scope.gridOptions.onRegisterApi = (gridApi) => {
            $scope.gridApi = gridApi
            if (gridApi) {
                $interval(() => {
                    gridApi.core.handleWindowResize()
                    gridApi.grid.refresh()
                }, 5)
            }
            gridApi.edit.on.afterCellEdit($scope, afterCellEdit)
        }
        function afterCellEdit(rowEntity, colDef, newValue, oldValue) {
            let msg = 'after cell edit ready '
            $log.info(msg)
            colDef.cellClass = function (grid, row, col, rowRenderIndex, colRenderIndex) {
                row.entity.dirty = row.entity.dirty || {}
                if (rowEntity.id === row.entity.id && newValue !== oldValue) {
                    rowEntity.dirty[col.displayName] = true;
                }
                if (row.entity.dirty[col.displayName])
                    return "modifiedCell";
                return "";
            };

            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);

            const index = $scope.gridOptions.data.indexOf(rowEntity) //Obtenemos indice 

            let precioConIva = 0
            let precioVenta = 0
            let porcentajeUtilidad = 0
            let ganancia = 0

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
                    if (rowEntity.precioVenta != oldValue) {
                        $scope.gridOptions.data[index].modified = true
                    }

                    break

                case "precioConIva":
                    precioVenta = _pricingUtils.calcularPrecioVenta(rowEntity.precioConIva, rowEntity.porcentajeIva)
                    porcentajeUtilidad = _pricingUtils.campoPorcentajeUtilidad(rowEntity.precioCosto, precioVenta)

                    $scope.gridOptions.data[index].precioConIva = _form.roundNumber(rowEntity.precioConIva, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioVenta = _form.roundNumber(precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].porcentajeUtilidad = _form.roundNumber(porcentajeUtilidad, 5)
                    if (rowEntity.precioConIva != oldValue) {
                        $scope.gridOptions.data[index].modified = true
                    }
                    break
                case "porcentajeUtilidad":
                    precioVenta = _pricingUtils.calcularPorcentajeUtilidad(rowEntity.precioCosto, rowEntity.porcentajeUtilidad)
                    precioConIva = _pricingUtils.calcularPrecioConIva(precioVenta, rowEntity.porcentajeIva)

                    $scope.gridOptions.data[index].precioVenta = _form.roundNumber(precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioConIva = _form.roundNumber(precioConIva, $scope.config.nroPrecio)
                    if (rowEntity.porcentajeUtilidad != oldValue) {
                        $scope.gridOptions.data[index].modified = true
                    }
                    break
            }
            ganancia = rowEntity.precioVenta - rowEntity.precioCosto
            //$scope.update(rowEntity)
            $scope.gridOptions.data[index].ganancia = _form.roundNumber(ganancia, 5)

            for (const d of $scope.gridOptions.data) {
                if (d.modified) {
                    if (!$scope.articlesToSave.some(x => x.idArticulo == d.idArticulo)) {
                        $scope.articlesToSave.push(d)
                    } else {
                        let articleFounded = $scope.articlesToSave.find(x => x.idArticulo == d.idArticulo)
                        articleFounded.precioVenta = d.precioVenta
                        articleFounded.precioConIva = d.precioConIva
                        articleFounded.porcentajeUtilidad = d.porcentajeUtilidad
                    }
                }
            }
            if ($scope.articlesToSave.length > 50) {
                _tS.toastr("info", "Existen más de 50 articulos modificados, le recomendamos guardar los cambios")
            }
           
        }
        $scope.setColumnDefs()

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

        $scope.resultModalArticleEdit = (result) => {
            console.log(result)
        }

        let isTriggered = false

        $scope.onChangeTarifa = () => {
            if (isTriggered) {
                $scope.getArticles()
            }
        }

        $scope.proveedorSearch = (textSearch) => proveedorSvc.search(textSearch)
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
        $scope.articlesBackup = []

        $scope.fillGrid = (articles) => {
            $scope.gridOptions.data = articles.map(item => {
                return {
                    ...item,
                porcentajeIva: item.iva,
                ganancia: _form.roundNumber((Number(item.precioVenta) - item.precioCosto), $scope.config.nroPrecio),
                estado: item.estadoTarifa,
                modified: false
            } 
            })
        }

        $scope.getArticles = () => {
            showLoader()
            $scope.search = ''
            isTriggered = false
            $scope.articles = []
            $scope.articlesBackup = []
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
                        $scope.articlesBackup = JSON.parse(JSON.stringify(temp[0]))
                        $scope.fillGrid(temp[0])
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }
        $scope.rollbackChanges = async () => {
            let { isConfirmed } = await Swal.fire({
                html: `<small>Esta seguro de revertir los cambios!</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, proceder!',
                cancelButtonText: 'No, cancelar'
            })
            if (isConfirmed) {
                $scope.articlesToSave = []
                $scope.articles = []
                $scope.articles = JSON.parse(JSON.stringify($scope.articlesBackup))
                $scope.gridOptions.data = []
                $scope.gridApi.core.refresh();

                $scope.setColumnDefs()
                $scope.fillGrid($scope.articles)
            } 
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

        $scope.save = async () => {
            if ($scope.articlesToSave.length == 0) {
                _tS.toastr("warning", "Usted no poseen ningun articulo modificado")
                return
            }
            let message
            message = `<table class="table table-bordered">
                            <thead>
                                <tr class="small">
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>P. Venta</th>
                                    <th>P. Con Iva</th>
                                </tr>
                            </thead>
                            <tbody>`
            for (const art of $scope.articlesToSave) {
                message += `<tr class="small">
                                <td>${art.codigo}</td>
                                <td>${art.descripcion}</td>
                                <td>${art.precioVenta}</td>
                                <td>${art.precioConIva}</td>
                            </tr>`
            }
            message += `</tbody></table>`
            let { isConfirmed } = await Swal.fire({
                title: 'Esta seguro de actualizar el precio de los siguientes articulos?',
                html:message,
                //html: `Esta seguro de actualizar los <b>${$scope.articlesToSave.length}</b> articulos modificados?, esto no se podra revertir!`,
                width: '800px',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Proceder',
                cancelButtonText: 'No, Cancelar',
                allowOutsideClick: false
            })
            if (isConfirmed) {
                showLoader()
                let data = {
                    tipo: 2,
                    articles: JSON.stringify($scope.articlesToSave)
                }
                _mS.getData('PUT', 'PrecioMasivo/', { data: data }, true).then(
                    response => {
                        if (response.code == "0") {
                            _tS.toastr("warning", response.message)
                        }
                        if (response.code == "1") {
                            $scope.articlesToSave = []
                            _tS.toastr("info", response.message)
                        }
                        hideLoader()
                    }
                ).catch(error => {
                    hideLoader()
                    $log.error(error)
                })
            }
        }

        $scope.refresh = () => {
            $window.location.href = '/PrecioMasivo/Index';
        }

    }

})(window.angular)