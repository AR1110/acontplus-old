(function () {
    'use strict'
    app.controller('precioMasivoCtrl', precioMasivoCtrl)
    precioMasivoCtrl.$inject = [
        '$scope',
        '$injector',
        '$interval',
        'uiGridConstants',
    ]

    function precioMasivoCtrl($scope, $injector, $interval, uiGridConstants) {

        const precioMasivoSvc = $injector.get('precioMasivoService');
        const fS = $injector.get('formulario')
        const tS = $injector.get('toastService')
        const pricingUtils = $injector.get('pricingUtils');
        const modalSvc = $injector.get('modalService');

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
        $scope.articles = [];
        $scope.decimal = {}
        $scope.tarifasImpuesto = [];
        $scope.tarifasImpuestoDestino = [];

        $scope.mainForm = {
            idTarifa: 0,
            idSubFamilia: 0,
            idTipoIva: 0,
            idTipoIvaDestino: 0
        };

        //Product 
        $scope.dataSearchProduct = {
            name: ''
        }
        //Proveedor 
        $scope.dataSearchProveedor = {
            name: ''
        }

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
            enableFiltering: false,
        }


        function setColumnDefs() {
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
                    minWidth: 100,
                    cellClass: function (grid, row) {
                        return row.entity.idTipoOriginal !== row.entity.idTipoIva ? 'modifiedCell' : '';
                    }
                },
                // {
                //     name: 'I.V.A',
                //     field: 'idTipoIva',
                //     width: '8%',
                //     minWidth: '100',
                //     type: 'number',
                //     editableCellTemplate: 'ui-grid/dropdownEditor',
                //     cellFilter: 'cellFilterTipoIva:this',
                //     editDropdownValueLabel: 'descripcion',
                //     editDropdownIdLabel: 'idTipoIva',
                //     enableCellEdit: true,
                //     allowCellFocus: true,
                //     enableCellEditOnFocus: true, 
                // },
                {
                    name: 'precioCosto',
                    field: 'precioCosto',
                    enableCellEditOnFocus: false,
                    enableCellEdit: false,
                    allowCellFocus: true,
                    enableFiltering: false,
                    type: 'number',
                    width: '10%',
                    minWidth: 110
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


            // let indexTipoIva = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idTipoIva');
            // $scope.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
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

            if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                rowEntity[colDef.field] = oldValue;
                return
            }
            //Validacion de numeros negativos
            if (['precioVenta', 'precioConIva', "porcentajeUtilidad"].includes(colDef.field) && newValue < 0) {
                rowEntity[colDef.field] = oldValue;
                return
            }
            if (oldValue === newValue) return


            const index = $scope.gridOptions.data.indexOf(rowEntity) //Obtenemos indice 

            let precioConIva = 0
            let precioVenta = 0
            let porcentajeUtilidad = 0
            let ganancia = 0

            if (colDef.field === "precioVenta") {
                if (rowEntity.precioVenta < rowEntity.precioCosto) {
                    rowEntity[colDef.field] = oldValue
                    tS.toastr('warning', 'El precio de venta no puede ser menor a precio costo!');
                    return
                }
            }

            if (colDef.field === "precioConIva") {
                if (rowEntity.precioConIva < $scope.precioCosto) {
                    rowEntity.precioConIva = oldValue;
                    tS.toastr('warning', 'El precio con IVA no puede ser menor a precio costo!');
                    return
                }
            }

            //Calculos 
            switch (colDef.field) {
                case "precioVenta":
                    precioConIva = pricingUtils.calcularPrecioConIva(rowEntity.precioVenta, rowEntity.porcentajeIva)
                    porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(rowEntity.precioCosto, rowEntity.precioVenta)

                    $scope.gridOptions.data[index].precioVenta = fS.roundNumber(rowEntity.precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioConIva = fS.roundNumber(precioConIva, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(porcentajeUtilidad, 5)
                    if (rowEntity.precioVenta != oldValue) {
                        $scope.gridOptions.data[index].modified = true
                    }
                    break

                case "precioConIva":
                    precioVenta = pricingUtils.calcularPrecioVenta(rowEntity.precioConIva, rowEntity.porcentajeIva)
                    porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(rowEntity.precioCosto, precioVenta)

                    $scope.gridOptions.data[index].precioConIva = fS.roundNumber(rowEntity.precioConIva, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioVenta = fS.roundNumber(precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(porcentajeUtilidad, 5)
                    if (rowEntity.precioConIva != oldValue) {
                        $scope.gridOptions.data[index].modified = true
                    }
                    break
                case "porcentajeUtilidad":
                    precioVenta = pricingUtils.calcularPorcentajeUtilidad(rowEntity.precioCosto, rowEntity.porcentajeUtilidad)
                    precioConIva = pricingUtils.calcularPrecioConIva(precioVenta, rowEntity.porcentajeIva)

                    $scope.gridOptions.data[index].precioVenta = fS.roundNumber(precioVenta, $scope.config.nroPrecio)
                    $scope.gridOptions.data[index].precioConIva = fS.roundNumber(precioConIva, $scope.config.nroPrecio)
                    if (rowEntity.porcentajeUtilidad != oldValue) {
                        $scope.gridOptions.data[index].modified = true
                    }
                    break
            }

            ganancia = rowEntity.precioVenta - rowEntity.precioCosto
            //$scope.update(rowEntity)
            $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, 5)

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


            //Notificacion de celdas modificadas
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

            if ($scope.articlesToSave.length > 50) {
                tS.toastr("info", "Existen más de 50 articulos modificados, le recomendamos guardar los cambios")
            }

        }
        setColumnDefs();

        initLoad();

        function initLoad() {
            try {
                showLoader();
                precioMasivoSvc.getDataForm().then(response => {
                    const {
                        familias,
                        decimal,
                        tarifasImpuesto,
                        tarifas,
                        subFamilias
                    } = response;

                    $scope.familias = familias;
                    $scope.subfamilias = subFamilias;
                    $scope.tarifas = tarifas;
                    $scope.decimal = decimal;

                    $scope.tarifasImpuesto = tarifasImpuesto;
                    $scope.mainForm.idTarifa = $scope.tarifas.find(x => x.predeterminada).idTarifa;
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())

            } catch (error) {
                console.log(error)
            }
        }

        $scope.resultModalArticleEdit = (result) => {
            console.log(result)
        }


        $scope.onChangeTarifa = () => {
            $scope.getArticles()
        }

        $scope.onKeyupProduct = function () {
            console.log('search product')
        }
        $scope.onSelectProduct = function (result) {
            $scope.mainForm.idArticulo = result.idArticulo
            $scope.getArticles()
        }

        $scope.onKeyupProveedor = function () {

        }
        $scope.onSelectProveedor = function (result) {
            $scope.mainForm.rucProveedor = result.numeroIdentificacion
            $scope.getArticles()
        }

        $scope.articlesBackup = []

        function fillGrid() {
            $scope.gridOptions.data = $scope.articles.map(item => {
                let dataTarifaImpuesto = $scope.tarifasImpuesto.find(ti => ti.idTipoIva === item.idTipoIva);
                return {
                    ...item,
                    porcentajeIva: dataTarifaImpuesto.porcentaje,
                    ganancia: fS.roundNumber((Number(item.precioVenta) - item.precioCosto), 5),
                    estado: item.estadoTarifa,
                    modified: false
                }
            })
        }

        $scope.onChangeSubFamilia = () => {
            $scope.mainForm.idTipoOriginal = 0;
            $scope.mainForm.idTipoIva = 0;
            $scope.getArticles();
        }
        $scope.onChangeOpciones = function () {
            $scope.mainForm.idTipoOriginal = 0;
            $scope.mainForm.idTipoIva = 0;
        }

        $scope.getArticles = () => {
            $scope.articles = []
            $scope.articlesBackup = []
            $scope.articlesToSave = [];
            $scope.mainForm.tipo = 2;


            showLoader();
            let dataSearch = {
                opcion: $scope.mainForm.option,
                idTarifa: $scope.mainForm.idTarifa,
                rucProveedor: $scope.mainForm.rucProveedor,
                idSubFamilia: $scope.mainForm.idSubFamilia
            }
            precioMasivoSvc.getProducts(dataSearch).then(response => {
                $scope.articles = response;
                $scope.articlesBackup = structuredClone($scope.articles);

                fillGrid($scope.articles)
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader());
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
                $scope.articles = [];
                $scope.mainForm.idTipoOriginal = 0;
                $scope.mainForm.idTipoIva = 0;
                $scope.articles = structuredClone($scope.articlesBackup)
                $scope.gridOptions.data = []
                $scope.gridApi.core.refresh();

                setColumnDefs()
                fillGrid($scope.articles)
            }
        }
        $scope.update = (item, option = null) => {
            // if (option == 1) {
            //     item.precioConIva = fS.roundNumber(pricingUtils.calcularPrecioConIva(item.precioVenta, item.iva), $scope.config.nroPrecio)
            //     item.porcentajeUtilidad = fS.roundNumber(pricingUtils.campoPorcentajeUtilidad(item.precioCosto, item.precioVenta), 5)
            // }
            // if (option == 2) {
            //     item.precioVenta = fS.roundNumber(pricingUtils.calcularPrecioVenta(item.precioConIva, item.iva), $scope.config.nroPrecio)
            //     item.porcentajeUtilidad = fS.roundNumber(pricingUtils.campoPorcentajeUtilidad(item.precioCosto, item.precioVenta), 5)
            // }
            // if (option == 3) {
            //     item.precioVenta = fS.roundNumber(pricingUtils.calcularPorcentajeUtilidad(item.precioCosto, item.porcentajeUtilidad), $scope.config.nroPrecio)
            //     item.precioConIva = fS.roundNumber(pricingUtils.calcularPrecioConIva(item.precioVenta, item.iva), $scope.config.nroPrecio)
            // }
            showLoader()
            let method = "PUT"
            if (item.idArticuloPvP == 0) {
                method = "POST"
            }
            mS.getData(method, "Inventario/PrecioMasivo/", { data: item }, true).then(
                response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message)
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }

        $scope.onChangeTipoIvaInicial = function () {
            if (!$scope.articles.some(d => d.idTipoIva === $scope.mainForm.idTipoIva)) {
                Swal.fire({
                    icon: 'warning',
                    html: '<small>No hay ningún artículo que posee este tipo Iva</small>'
                })
                $scope.mainForm.idTipoIvaDestino = 0;
                $scope.tarifasImpuestoDestino = [];
                return
            }

            $scope.tarifasImpuestoDestino = $scope.tarifasImpuesto.filter(ti => ti.idTipoIva !== $scope.mainForm.idTipoIva)
        }

        $scope.onChangeTipoIvaDestino = function () {
            try {
            //    let tarifaImpuestoInicialDesc = $scope.tarifasImpuesto.find(ti => ti.idTipoIva === $scope.mainForm.idTipoIva);
                let { descripcion: tarifaImpuestoDestinoDesc } = $scope.tarifasImpuestoDestino.find(ti => ti.idTipoIva === $scope.mainForm.idTipoIvaDestino);

                Swal.fire({
                    title: "Modificar los precios",
                    html: `Se realizará cálculo de los precios, teniendo en cuenta el tipo de IVA: <b>${tarifaImpuestoDestinoDesc}</b> como factor determinante.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Continuar!",
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        applyTarifaImpuestoDestino();
                    }
                });


            } catch (error) {
                console.log(error)
            }
        }

        function applyTarifaImpuestoDestino() {
            let { porcentaje } = $scope.tarifasImpuestoDestino.find(ti => ti.idTipoIva === $scope.mainForm.idTipoIvaDestino);
            $scope.articlesToSave = [];

            for (let item of $scope.articles) {
                if (item.idTipoOriginal === $scope.mainForm.idTipoIva) {
                    let precioVenta = pricingUtils.calcularPrecioVenta(item.precioConIva, porcentaje);
                    item.precioVenta = fS.roundNumber(precioVenta, $scope.decimal.nroPrecio);

                    let precioConIva = pricingUtils.calcularPrecioConIva(item.precioVenta, porcentaje);

                    item.precioConIva = fS.roundNumber(precioConIva, $scope.decimal.nroPrecio);

                    let porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(item.precioCosto, precioVenta);

                    item.porcentajeUtilidad = fS.roundNumber(porcentajeUtilidad, 5);

                    // let ganancia = item.precioVenta - item.precioCosto;

                    // item.ganancia = fS.roundNumber(ganancia, 5);
                    // console.log('teststst')
                    item.idTipoIva = $scope.mainForm.idTipoIvaDestino;
                    $scope.articlesToSave.push(item)
                }

            }
            fillGrid();
            tS.toastr('success', 'Aplicado correctamente');

        }

        $scope.save = async () => {
            if ($scope.articlesToSave.length == 0) {
                tS.toastr("warning", "Usted no poseen ningun articulo modificado")
                return
            }

            if ($scope.articlesToSave.length > 50) {
                tS.toastr("warning", "La cantidad de artículos permitidos es 50")
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
                //    html: message,
                html: `Esta seguro de actualizar los <b>${$scope.articlesToSave.length}</b> articulos modificados?, esto no se podra revertir!`,
               // width: '400px',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Proceder',
                cancelButtonText: 'No, Cancelar',
                allowOutsideClick: false
            })
            if (isConfirmed) {
                let results = $scope.articlesToSave.map(item => {

                    return {
                        idTipoIva: item.idTipoIva,
                        idArticuloPvP: item.idArticuloPvP,
                        idArticulo: item.idArticulo,
                        idTarifa: item.idTarifa,
                        precioVenta: item.precioVenta,
                        precioConIva: item.precioConIva,
                        porcentajeUtilidad: item.porcentajeUtilidad,
                    }
                })

                let data = {
                    tipo: 2,
                    articles: results
                }
                showLoader()
                precioMasivoSvc.put(data).then(response => {
                    if (response.code == "0") {
                        tS.toastr("warning", response.message)
                    }
                    if (response.code == "1") {
                        $scope.articlesToSave = []
                        tS.toastr("success", response.message)
                    }
                }
                ).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            }
        }

        $scope.refresh = () => {
            window.location.href = '/PrecioMasivo/Index';
        }

    }

})(window.angular)