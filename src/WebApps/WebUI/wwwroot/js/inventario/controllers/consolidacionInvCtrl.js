
(function () {
    'use strict'

    const COD_DOC = 'CIV', URL_TEMPLATE = '~/Areas/Consolidacion/Pages/Shared/'

    let modalSvc = {};
    let commonSvc = {};
    let mS = {};
    let tS = {};
    let fS = {}

    let establecimientos = [];
    let bodegas = [];
    let subfamilias = [];
    let config = {};

    let consolidacionInvSvc = {};

    app.controller('consolidacionInvCtrl', consolidacionInvCtrl);
    consolidacionInvCtrl.$inject = [
        '$scope',
        '$injector',
        '$filter',
    ]
    function consolidacionInvCtrl(
        $scope,
        $injector,
        $filter
    ) {

        modalSvc = $injector.get("modalService");
        commonSvc = $injector.get("commonService");
        mS = $injector.get("mainService");
        tS = $injector.get("toastService");
        fS = $injector.get("formulario");
        consolidacionInvSvc = $injector.get("consolidacionInvService");

        $scope.btnEditDisabled = false;
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000
        }
        $scope.getConsolidaciones = async () => {
            try {
                $scope.consolidaciones = []

                $scope.dataSearch.tipo = 2;

                showLoader();
                consolidacionInvSvc.get($scope.dataSearch).then(response => {
                    $scope.consolidaciones = response;
                    $scope.cloneConsolidaciones = JSON.parse(JSON.stringify($scope.consolidaciones))
                    let total = $scope.consolidaciones.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
                    $scope.total = fS.roundNumber(total, 5);
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader());
            } catch (error) {
                console.log(error)
            }
        }

        $scope.initiload = () => {
            showLoader();
            consolidacionInvSvc.get({ tipo: 1 }).then(response => {
                let { estabs } = response;
                establecimientos = estabs;
                subfamilias = response.subFamilias;
                config = response.config;

                if (establecimientos.length > 0) {
                    let dataEstab = establecimientos.find(estab => (estab.defaultEstab));
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                }
                $scope.getConsolidaciones();
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader());

            // mS.getData('GET', 'Consolidacion/?json=' + JSON.stringify({ tipo: 1 }), null, true).then(
            //     response => {
            //         if (response.code == "1") {
            //             let tempArray = JSON.parse(response.payload) || []
            //             if (tempArray.length > 0) {
            //                 establecimientos = tempArray[0]
            //                 let codEstab = establecimientos.length > 0 ? establecimientos[0].codEstab : 0
            //                 $scope.dataSearch.codEstab = codEstab
            //                 allPuntosEmision = tempArray[0]
            //                 allBodegas = tempArray[1]
            //                 if (codEstab) {
            //                     for (const e of allPuntosEmision) {
            //                         if (e.codEstab == codEstab) {
            //                             puntosEmision.push(e)
            //                         }
            //                     }
            //                     for (const e of allBodegas) {
            //                         if (e.codEstab == codEstab) {
            //                             bodegas.push(e)
            //                         }
            //                     }
            //                 } else {
            //                     puntosEmision = allPuntosEmision
            //                     bodegas = allBodegas
            //                 }
            //                 subfamilias = tempArray[2]
            //                 config = JSON.parse(tempArray[3][0].jsonConfig).find(x => x.codTransaccion == 'AL')
            //                 $scope.getConsolidaciones()
            //             }
            //         }
            //     }
            // ).catch(error => {
            //     console.error(error)
            // })
        }
        $scope.initiload();

        $scope.getListaFilter = () => {
            let consolidaciones = JSON.parse(JSON.stringify($scope.cloneConsolidaciones))
            $scope.consolidaciones = $filter("filter")(consolidaciones, $scope.dataSearch.bySearch);
            let total = $scope.consolidaciones.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
            $scope.total = fS.roundNumber(total, 5);
        }

        $scope.openModalParam = async ({ controller, template, size = 'xl', params }) => {
            modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                isRenderRazorPartial: true,
                windowClass: 'uibModalFullScreen'
            }).result.then(result => {
                console.log('test')
                if (typeof result === 'object') {
                    $scope.getConsolidaciones()
                }
            })
        }

        $scope.openModalNew = () => {
            $scope.openModalParam({
                controller: 'ModalConsolidacionNuevoCtrl',
                template: URL_TEMPLATE + '_ModalNuevo.cshtml',
                params: {
                    TIPO_REGISTRO: 'NUEVO'
                }
            })
        }
        $scope.openModalFiltro = async () => {
            console.log('test')
        }

        $scope.openModalDetalle = async (item) => {
            try {
                showLoader();
                const response = await commonSvc.getDataConsolidacionInventario(item.idConsolidacionInventario)
                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'DETALLE',
                    data: response
                }

                $scope.openModalParam({
                    controller: "ModalConsolidacionDetalleCtrl",
                    template: URL_TEMPLATE + '_ModalDetalle.cshtml',
                    isRenderRazorPartial: true,
                    params
                })
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }

        $scope.openModalEditar = async (item) => {
            try {
                showLoader();

                const response = await commonSvc.getDataConsolidacionInventario(item.idConsolidacionInventario)
                hideLoader();
                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'EDITAR',
                    data: response
                }

                $scope.openModalParam({
                    controller: "ModalConsolidacionEditarCtrl",
                    template: URL_TEMPLATE + '_ModalEditar.cshtml',
                    isRenderRazorPartial: true,
                    params
                })
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }



        $scope.askToDelete = async (item) => {

            let { isConfirmed } = await Swal.fire({
                title: '<small>Anular Documento?</small>',
                html: `<small>Este proceso no se puede revertir!</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar'
            })

            if (isConfirmed) {
                showLoader();
                consolidacionInvSvc.delete(item.idConsolidacionInventario).then(response => {
                    if (response.code === "0") {
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        $scope.getConsolidaciones();
                    }
                    hideLoader();
                }).catch(error => {
                    hideLoader
                    console.log(error)
                })
            }
        }

        //Reporte 
        $scope.getReport = function (item) {
            let dataParms = {
                idConsolidacionInventario: item.idConsolidacionInventario,
            }
            const parameters = {
                reportParams: JSON.stringify({
                    codigo: 'RCI',
                    format: 'pdf',
                    codEstab: item.codEstab,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataParms),
                sendEmail: false
            }

            commonSvc.getReport({
                parameters,
                formatType: 'pdf'
            })
        }
    }


    app.controller("ModalConsolidacionNuevoCtrl", ModalConsolidacionNuevoCtrl);
    ModalConsolidacionNuevoCtrl.$inject = [
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'uiGridConstants',
        'params'
    ]
    function ModalConsolidacionNuevoCtrl($scope, $timeout, $uibModalInstance, uiGridConstants, _params) {
        console.log("inside new modal")
        $scope.TIPO_REGISTRO = _params
        $scope.data = {}
        $scope.data.fechaEmision = new Date()
        $scope.data.total = 0
        $scope.uiGridConstants = uiGridConstants;
        $scope.TIPO_DOC = commonSvc.tipoDoc['CIV'];

        $scope.articlesSelected = []
        $scope.advancedSearch = () => {
            modalSvc.openModalCustom({
                controller: 'AdvancedSearchCtrl',
                template: URL_TEMPLATE + '_AdvancedSearch.cshtml',
                isRenderRazorPartial: true,
                size: 'xl',
                windowClass: 'uibModalFullScreen'
            }).result.then(
                response => {
                    if (response) {
                        for (const a of response) {
                            if (!$scope.articlesSelected.some(x => x.idArticulo == a.idArticulo)) {
                                $scope.setItemArticuloEnDetalle(a, true)
                                //$scope.articlesSelected.push(a)
                            }
                        }
                        //console.log($scope.articlesSelected)
                    }
                }
            )
        }

        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            showGridFooter: true,
            enableCellEdit: false,
        }

        $scope.setColumnDefs = () => {
            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                            <a  ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                            <a  ng-click="grid.appScope.openModalArticuloEditar(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
                            `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario !== true;
                },
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: function (rowEntity) {
                    return rowEntity.medidas.map(function (val) {
                        //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                        //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                        //}
                        return {
                            id: val.idMedida,
                            value: val.descripcion
                        }
                    })

                },
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'codigoTipoIva',
                field: 'codigoTipoIva',
                allowCellFocus: false,
                type: 'string',
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                enableColumnMenu: false,
                visible: false
            },
            {
                name: 'Iva',
                field: 'nombreTipoIva',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'string',
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'Stock',
                field: 'stock',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '5%',
                minWidth: '65',
                type: 'number',
                enableColumnMenu: false,
                visible: true,
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo Actual',
                field: 'precioActual',
                min: 0,
                type: 'number',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                width: '12%',
                minWidth: '100',
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                aggregationType: fS.roundNumber($scope.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableFiltering: false,
                enableColumnMenu: false,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'bodega',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '11%',
                minWidth: '100'
            }
            ];
            let indexBodega = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
        }

        $scope.initiload = () => {
            try {
                showLoader();
                if (establecimientos.length > 0) {
                    $scope.establecimientos = establecimientos;
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.data.codEstab = dataEstab.codEstab;
                    $scope.cloneCodEstab = $scope.data.codEstab
                    $scope.puntosEmision = dataEstab.puntosEmision

                    if ($scope.puntosEmision.length > 0) {
                        $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => (x.defaultPtoEmi)).idPuntoEmision
                    }

                    $scope.bodegas = dataEstab.bodegas
                    $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => (x.defaultBodega)).idBodega : 0
                    $scope.cloneIdBodega = $scope.idBodega

                } else {
                    tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
                }

                $scope.decimal = config


                $scope.setColumnDefs();
            } catch (error) {

                console.log(error)

            } finally {
                hideLoader()
            }
        }
        $scope.initiload()

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }
            gridApi.grid.element.on('keyup', function (ev) {
                if (ev.which == 13 || ev.keyCode == '13') {
                    $scope.setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })
            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos                 
                if (rowEntity[colDef.field] === "" || rowEntity[colDef.field] === undefined || rowEntity[colDef.field] === null) {
                    rowEntity[colDef.field] = oldValue;
                    return
                }

                if (colDef.field === "precioActual") {
                    rowEntity.precioCosto = fS.roundNumber(rowEntity.precioCosto, $scope.decimal.nroPrecio)
                    rowEntity.precioActual = fS.roundNumber(rowEntity.precioActual, $scope.decimal.nroPrecio)
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);

                    rowEntity.precioCosto = fS.roundNumber(dataMedida.precioCosto, $scope.decimal.nroPrecio)
                    rowEntity.precioActual = fS.roundNumber(dataMedida.precioCosto, $scope.decimal.nroPrecio)
                }

                $scope.setTotalColumn(rowEntity);
                $scope.setTotalDetalle();

            })
        }

        $scope.setTotalColumn = (rowEntity) => {
            let total = rowEntity.cantidad * rowEntity.precioActual;
            rowEntity.total = fS.roundNumber(total, $scope.decimal.nroTotalDetalle); //Total Precio Venta
        }

        $scope.setTotalDetalle = () => {
            let total = $scope.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);

            $scope.data.total = fS.roundNumber(total, $scope.decimal.nroTotalSubTotal)
        }

        $scope.setFocusArticulo = () => {
            setTimeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
        }

        $scope.onChangeEstablecimiento = async () => {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })
                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    title: '<small>Cambiar Establecimiento?</small>',
                    html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (!isConfirmed) {
                    $scope.data.codEstab = $scope.cloneCodEstab;
                    $scope.$apply();
                    return
                }
                $scope.puntosEmision = []
                $scope.bodegas = []
                $scope.cloneCodEstab = $scope.data.codEstab;
                const dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);
                $scope.puntosEmision = dataEstab.puntosEmision;
                $scope.bodegas = dataEstab.bodegas || [];

                if ($scope.puntosEmision.length > 0) {
                    $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                } else {
                    tS.toastr('warning', 'No tienes asignados puntos de emisón');
                    $scope.data.idPuntoEmision = 0;
                }

                if ($scope.bodegas.length > 0) {
                    $scope.idBodega = $scope.bodegas.find(bodega => (bodega.defaultBodega)).idBodega;
                    $scope.cloneIdBodega = $scope.idBodega;
                } else {
                    $scope.idBodega = 0;
                }

                let indexColumn = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
                $scope.gridOptions.columnDefs[indexColumn].editDropdownOptionsArray = $scope.bodegas;
                for (let item of $scope.gridOptions.data) {
                    item.idBodega = $scope.idBodega;
                }
                $scope.$apply()
            } catch (error) {
                console.trace(error)
            }
        }

        $scope.askToChangeBodega = async () => {
            let {
                isConfirmed
            } = await Swal.fire({
                html: `<small>Esta seguro de cambiar la bodega en todo el Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                reverseButtons: false,
            })

            if (isConfirmed) {
                $scope.cloneIdBodega = $scope.idBodega;
                for (let item of $scope.gridOptions.data) {
                    item.idBodega = $scope.idBodega;
                }
                $scope.$apply()
            } else {
                $scope.idBodega = $scope.cloneIdBodega;
                $scope.$apply()
            }
        }

        $scope.setItemArticuloEnDetalle = async (item, isAdvanced = null) => {
            try {

                let articulo = {}
                let medidas = []
                if (!isAdvanced) {
                    let tempArray = JSON.parse(item.payload) || []
                    articulo = tempArray[0][0]
                    medidas = tempArray[5]
                } else {
                    articulo = item
                    medidas.push({ idMedida: articulo.idMedida, descripcion: articulo.medida, precioCosto: articulo.precioCosto })
                    if (articulo.fraccionado) {
                        let medidasTemp = articulo.medidas && JSON.parse(articulo.medidas) || [];
                        for (const m of medidasTemp) {
                            medidas.push(m)
                        }
                    }
                }


                if (!articulo.llevaInventario) {
                    Swal.fire({
                        icon: 'warning',
                        html: 'Este articulo no esta configurado para llevar inventario'
                    })
                    return
                }


                let entity = {};
                $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === articulo.idArticulo);
                if ($scope.indexRow !== -1) {
                    entity = $scope.gridOptions.data[$scope.indexRow];
                    if (!item.isUpdateProduct) {

                        let { isConfirmed } = await Swal.fire({
                            text: "Desea sumar la cantidad del producto en el detalle?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Si!',
                            cancelButtonText: 'No'
                        })
                        if (isConfirmed) {
                            entity.cantidad = entity.cantidad + 1;
                        }
                    }


                } else {
                    $scope.addRow();
                    $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === 0);
                    entity = $scope.gridOptions.data[$scope.indexRow];
                    $scope.addItem(entity, articulo, medidas); // item row
                }
                $scope.countEnum();
                $scope.setTotalColumn(entity);
                $scope.setTotalDetalle();

                $scope.focusColumnaCantidad();
            } catch (error) {
                console.error(error)
            }
        }

        $scope.addRow = () => {
            $scope.gridOptions.data.push({
                num: 1,
                idArticulo: 0,
                codigo: "",
                descripcion: "",
                cantidad: 1,
                nombreMedida: "",
                codigoTipoIva: "",
                nombreTipoIva: "",
                stock: 0,
                precioCosto: 0,
                idBodega: 0,
                nota: "S/N"
            })
        }

        $scope.addItem = (entity, articulo, medidas) => {
            entity.codigo = articulo.codigo;
            entity.idArticulo = articulo.idArticulo;
            entity.descripcion = articulo.descripcion;
            entity.codigoTipoIva = articulo.codigoTipoIva;
            entity.porcentajeTipoIva = articulo.porcentajeTipoIva;
            entity.nombreTipoIva = articulo.nombreTipoIva;
            entity.stock = articulo.stock;
            entity.precioCosto = fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.precioActual = fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.total = fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.idBodega = $scope.idBodega ? $scope.idBodega : 0;
            entity.llevaInventario = articulo.llevaInventario;
            entity.medidas = medidas; //Lista Medida 
            entity.idMedida = articulo.idMedida; //Medida por defecto                                                                    
        }

        $scope.countEnum = () => {
            let counter = 1;
            for (let item of $scope.gridOptions.data) {
                item.num = counter++;
            }
        }

        $scope.focusColumnaCantidad = () => {
            let indexColumn = $scope.gridOptions.columnDefs.findIndex(item => item.field === "cantidad");
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            );

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[$scope.indexRow],
                    $scope.gridOptions.columnDefs[indexColumn]
                );
            }, 10)
        }

        $scope.deleteRow = async (row) => {
            let {
                isConfirmed
            } = await Swal.fire({
                html: `<small>Esta Ud. seguro/a de eliminar este Articulo <b>${row.entity.descripcion}</b></small>?`,
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: `Sí, eliminar!`,
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                let index = $scope.gridOptions.data.indexOf(row.entity);
                $scope.gridOptions.data.splice(index, 1);

                $scope.setTotalDetalle();
                $scope.countEnum();
                $scope.$apply();
            }
        }

        $scope.openModalArticuloEditar = (item) => {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )
            item.isUpdate = true;
            let params = Object.assign(item, { isUpdate: true })
            $scope.$broadcast("editArticulo", params);
        }

        $scope.consolidacionArticuloImport = async () => {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: 'ModalConsolidacionImportacionCtrl',
                    template: URL_TEMPLATE + '_ModalConsolidacionImportacion.cshtml',
                    isRenderRazorPartial: true,
                    size: 'xl',
                    windowClass: 'uibModalFullScreen'
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $uibModalInstance.close(response);
                    }
                })
            } catch (error) {
                console.trace(error)
            }
        }

        $scope.onSave = async () => {
            try {
                if (!$scope.data.codEstab) {
                    tS.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
                    return
                }

                if (!($scope.data.idPuntoEmision)) {
                    tS.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                    return
                }

                if (!($scope.data.fechaEmision)) {
                    tS.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                    return
                }

                if ($scope.gridOptions.data.length === 0) {
                    tS.toastr('warning', 'Al menos ingrese un Articulo en el Detalle', tituloModal);
                    return
                }

                if ($scope.gridOptions.data.some(item => (!(item.idBodega > 0)))) {
                    tS.toastr('warning', 'Agregue  bodega a los artículos');
                    return
                }

                showLoader();
                $scope.nroDocumentoSecuencial = await commonSvc.generarNroDocumentoCompra({
                    idPuntoEmision: $scope.data.idPuntoEmision,
                    codigoDocumento: COD_DOC
                })
                hideLoader();

                if (!$scope.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    title: '<small>Guardar Documento</small>',
                    html: `<small>Esta seguro de guardar este Consolidación Nro. <b>${$scope.nroDocumentoSecuencial}</b>?</small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false
                })

                if (isConfirmed) {

                    showLoader();

                    let consolidacion = Object.assign({}, $scope.data);
                    consolidacion.fechaEmision = fS.formatDateTimeZone($scope.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                    let data = {
                        consolidacion,
                        detalle: $scope.gridOptions.data
                    }

                    consolidacionInvSvc.post(data).then(response => {
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response);
                        }
                    }).finally(() => hideLoader())
                }

            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }

        $scope.closeModal = () => {
            if ($scope.gridOptions.data.length > 0) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        denyButton: 'btn btn-info ml-2',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                    title: 'Salir ?',
                    html: "<small>Tienes un documento en proceso, desea salir ahora?</small>",
                    icon: 'warning',
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, salir',
                    cancelButtonText: 'No, cancelar!',
                    focusDeny: true,
                    reverseButtons: false
                }).then(result => {

                    if (result.isConfirmed) {
                        $uibModalInstance.close();
                    }

                })
                return
            }
            $uibModalInstance.close();
        }
    }

    app.controller("AdvancedSearchCtrl", AdvancedSearchCtrl)
    AdvancedSearchCtrl.$inject = [
        "$scope",
        "$uibModalInstance",
        "articuloService",
        'proveedorService'
    ]
    function AdvancedSearchCtrl($scope, $uibModalInstance, articleSvc, proveedorSvc) {
        $scope.catalogs = [
            { code: 1, description: 'Articulo' },
            { code: 3, description: 'Subfamilias' },
            { code: 4, description: 'Proveedor' },
            { code: 5, description: 'N° Documento' }
        ]
        $scope.subfamilias = subfamilias

        $scope.mainForm = {}
        $scope.mainForm.tipo = 4
        $scope.mainForm.opcion = $scope.catalogs.find(x => x.code == '4').code

        $scope.proveedorSearch = (textSearch) => proveedorSvc.search(textSearch)
        $scope.selectProveedorFiltro = (item) => {
            $scope.mainForm.rucProveedor = item.proveedor.numeroIdentificacion
            $scope.getArticles()
        }

        $scope.articuloSearch = (item) => {
            if (item.length >= 3) {
                return articleSvc.search({ busqueda: item })
            }
        }

        $scope.articleSelected = (item) => {
            $scope.mainForm.idArticulo = item.idArticulo
            $scope.getArticles()
        }
        $scope.articlesSelected = []
        $scope.articlesFounded = []
        $scope.getArticles = () => {
            showLoader();
            consolidacionInvSvc.get($scope.mainForm).then(response => {
                $scope.articlesFounded = response;
                if ($scope.articlesFounded.length > 50) {
                    Swal.fire({ title: "Aviso", text: "Le recomendamos realizar consolidaciones por cada 50 articulos", icon: "info" })
                }
            }).catch(error => {
                hideLoader()
                console.log(error)
            }).finally(() => hideLoader())
        }

        $scope.setArticlesSelected = () => {
            $uibModalInstance.close($scope.articlesSelected)
        }

        $scope.closeAdvancedSearch = () => {
            $uibModalInstance.close()
        }
    }

    app.controller("ModalConsolidacionImportacionCtrl", ModalConsolidacionImportacionCtrl)
    ModalConsolidacionImportacionCtrl.$inject = [
        '$scope',
        '$uibModalInstance',
        'uiGridConstants',
        'articuloService',
    ]
    function ModalConsolidacionImportacionCtrl($scope, $uibModalInstance, uiGridConstants, articleSvc) {
        $scope.TIPO_DOC = commonSvc.tipoDoc['CIV']
        $scope.uiGridConstants = uiGridConstants
        $scope.data = {};
        $scope.data.fechaEmision = new Date();

        $scope.gridOptions = {
            showColumnFooter: true,

            enableRowSelection: true,
            enableRowHeaderSelection: false,
            showGridFooter: true
        }

        $scope.gridOptions.columnDefs = [{
            name: 'N°',
            field: 'num',
            width: '2%',
            minWidth: '50',
        },
        {
            name: 'Código',
            field: 'codigo',
            width: '10%',
            minWidth: '100',
        },
        {
            name: 'Descripción',
            field: 'descripcion',
            allowCellFocus: false,
            width: '30%',
            minWidth: '100',
            cellTooltip: function (row) {
                return row.entity.descripcion;
            },
        },
        // { name: 'Tipo Articulo', field:'tipoArticulo', allowCellFocus : false },
        // { name: 'Sub Familia', field:'subFamilia', allowCellFocus : false },
        {
            name: 'Cantidad',
            field: 'cantidad',
            width: '3%',
            minWidth: '100',
        },
        {
            name: 'P. Costo',
            field: 'precioCosto',
            width: '8%',
            minWidth: '100',
        },
        {
            name: 'Medida',
            field: 'medida',
            width: '8%',
            minWidth: '100',
        },
        {
            name: 'Iva',
            field: 'tipoIva',
            width: '8%',
            minWidth: '100',
        },
        {
            name: 'Bodega',
            field: 'idBodega',
            width: '15%',
            minWidth: '100',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: bodegas,
            cellFilter: 'cellFilterBodega:this',
            editDropdownValueLabel: 'bodega',
            editDropdownIdLabel: 'idBodega',
        },
        {
            name: 'Total',
            field: 'total',
            width: '8%',
            minWidth: '100',
            aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
            customTreeAggregationFinalizerFn: function (aggregation) {
                aggregation.rendered = aggregation.value;
            },
            aggregationLabel: "Total: ",
            footerCellFilter: 'number:2',
        },
        ]

        if (establecimientos.length > 0) {
            $scope.establecimientos = establecimientos
            let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
            $scope.cloneCodEstab = dataEstab.codEstab
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.bodegas = dataEstab.bodegas;

            if ($scope.puntosEmision.length > 0) {
                $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => (x.defaultPtoEmi)).idPuntoEmision
            }

            $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => (x.defaultBodega)).idBodega : 0
            $scope.cloneIdBodega = $scope.idBodega;



        } else {
            tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
        }

        $scope.decimal = config

        $scope.setTotalDetalle = () => {
            let total = $scope.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);

            $scope.data.total = fS.roundNumber(total, $scope.decimal.nroTotalSubTotal)
        }

        $scope.initialLoad = () => {
            try {

                showLoader();
                const query = {
                    tipo: 9,
                }
                articleSvc.getForImportation(query).then(response => {
                    hideLoader();
                    $scope.articulosImportados = response;
                    let num = 1;
                    $scope.gridOptions.data = $scope.articulosImportados.map(item => ({
                        ...item,
                        idBodega: $scope.idBodega,
                        precioActual: item.precioCosto,
                        cantidad: item.stock,
                        total: item.stock * item.precioCosto,
                        num: num++
                    }))
                    $scope.setTotalDetalle();

                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }
        $scope.initialLoad()

        $scope.onChangeEstablecimiento = async () => {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })
                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    title: '<small>Cambiar Establecimiento?</small>',
                    html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (!isConfirmed) {
                    $scope.data.codEstab = $scope.cloneCodEstab;
                    $scope.$apply();
                    return
                }
                $scope.puntosEmision = []
                $scope.bodegas = []
                $scope.cloneCodEstab = $scope.data.codEstab;
                const dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);
                $scope.puntosEmision = dataEstab.puntosEmision;
                $scope.bodegas = dataEstab.bodegas;

                if ($scope.puntosEmision.length > 0) {
                    $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                }
                if ($scope.bodegas.length > 0) {
                    $scope.idBodega = $scope.bodegas.find(bodega => (bodega.defaultBodega)).idBodega;
                    $scope.cloneIdBodega = $scope.idBodega;
                }
                else {
                    $scope.idBodega = 0;
                    tS.toastr('No tienes asignado las bodegas!')
                }
                let indexColumn = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
                $scope.gridOptions.columnDefs[indexColumn].editDropdownOptionsArray = $scope.bodegas;
                for (let item of $scope.gridOptions.data) {
                    item.idBodega = $scope.idBodega;
                }
                $scope.$apply()
            } catch (error) {
                console.trace(error)
            }
        }

        $scope.askToSave = async () => {
            try {

                if (!$scope.data.codEstab || $scope.data.codEstab === 0) {
                    tS.toastr('warning', 'Seleccione el Establecimiento');
                    return
                }

                if (!$scope.data.idPuntoEmision || $scope.data.idPuntoEmision === 0) {
                    tS.toastr('warning', 'Seleccione el Punto de Emisión');
                    return
                }

                if (!$scope.data.fechaEmision) {
                    tS.toastr('warning', 'Seleccione la Fecha de Emisión');
                    return
                }

                if ($scope.gridOptions.data.length === 0) {
                    tS.toastr('warning', 'No hay articulos a Consolidar');
                    return
                }

                if ($scope.gridOptions.data.some(item => ["", null, undefined, 0].includes(item.idBodega))) {
                    tS.toastr('warning', 'La bodega en el detalle es requerido');
                    return
                }

                let nroDocumentoSecuencial = await commonSvc.generarNroDocumentoCompra({
                    idPuntoEmision: $scope.data.idPuntoEmision,
                    codigoDocumento: COD_DOC
                })

                if (!nroDocumentoSecuencial) throw "NO SE GENERÓ CORRECTAMENTE EL NÚMERO SECUENCIAL"

                let textAccion = 'Guardar';

                let {
                    isConfirmed
                } = await Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro de ${textAccion} este <strong>Consolidación de Inventario</strong> Nro. <b>${nroDocumentoSecuencial}</b> ahora?</small>`,
                    showConfirmButton: true,
                    confirmButtonText: `Si, ${textAccion}`,
                    showCancelButton: true,
                    cancelButtonText: 'No, Cancelar',
                    allowOutsideClick: false
                })

                if (!isConfirmed) return


                showLoader();
                let consolidacion = Object.assign({}, $scope.data);
                consolidacion.fechaEmision = fS.formatDateTimeZone($scope.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                let data = {
                    consolidacion,
                    detalle: $scope.gridOptions.data
                }

                consolidacionInvSvc.post(data).then(response => {
                    if (response.code === '0') {
                        hideLoader();
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        hideLoader();
                        fS.sweetAlert('success', response.message, response.titleSms, 1000);

                        if (!$scope.isCloseModal) {
                            $scope.$uibModalInstance.close(response);
                            return
                        }

                        $scope.initialLoad();
                    }
                })
            } catch (error) {
                console.trace(error)
            }
        }

        $scope.closeModal = () => {
            $uibModalInstance.close();
        }
    }

    app.controller("ModalConsolidacionEditarCtrl", ModalConsolidacionEditarCtrl)
    ModalConsolidacionEditarCtrl.$inject = [
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'uiGridConstants',
        'params'
    ]
    function ModalConsolidacionEditarCtrl($scope, $timeout, $uibModalInstance, uiGridConstants, _params) {
        let {
            TIPO_REGISTRO,
            data
        } = _params;
        let {
            dataDocumento,
            detalleDocumento,
            medidasTemp
        } = data;
        $scope.uiGridConstants = uiGridConstants
        $scope.TIPO_REGISTRO = TIPO_REGISTRO;
        $scope.TIPO_DOC = commonSvc.tipoDoc['CIV'];
        $scope.data = dataDocumento;
        $scope.detalleDocumento = detalleDocumento;
        $scope.detalleDocumento.num = 0
        $scope.detalleDocumento.medidas = []
        let index = 1
        for (const dc of $scope.detalleDocumento) {
            dc.num = index
            let tempMedidas = [];

            //Medidas principales 
            tempMedidas.push({
                idConsolidacionInventarioDetalle: dc.idConsolidacionInventarioDetalle,
                idMedida: dc.idMedida,
                descripcion: dc.medida,
                precioCosto: dc.precioCosto
            })

            let tempArrayMedidas = medidasTemp.filter(mTemp => mTemp.idConsolidacionInventarioDetalle === dc.idConsolidacionInventarioDetalle).map(resM => {
                let tempArray = resM.medidasTemp && JSON.parse(resM.medidasTemp) || []
                tempMedidas.push({
                    idConsolidacionInventarioDetalle: resM.idConsolidacionInventarioDetalle,
                    idMedida: resM.idMedida,
                    descripcion: resM.medida,
                    precioCosto: resM.precioCosto
                })
                let resultArr = tempMedidas.concat(tempArray);
                return resultArr;
            })

            tempArrayMedidas = tempArrayMedidas[0]
            // if (dc.fraccionado) {
            //     for(let mm of tempArrayMedidas){
            //         tempMedidas.push({
            //             idMedida: mm.idMedida,
            //             descripcion: mm.medida,
            //             precioCosto: mm.precioCosto
            //         })
            //         let tempArray =  mm.medidasTemp && JSON.parse(mm.medidasTemp) || []

            //     }
            //     // for (const tm of tempArray) {
            //     //     tempMedidas.push(tm)
            //     // }
            // }
            let uniquesMedidas = tempArrayMedidas.filter((obj, i) => {
                return tempArrayMedidas.findIndex((obj2) => obj2.idMedida === obj.idMedida) === i;
            });
            console.log(uniquesMedidas)
            dc.medidas = uniquesMedidas;
            index++
        }

        $scope.disabledInputFechaEmision = true;

        if (establecimientos.length > 0) {
            $scope.establecimientos = establecimientos
            let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
            $scope.data.codEstab = dataEstab.codEstab;
            $scope.cloneCodEstab = $scope.data.codEstab
            $scope.puntosEmision = dataEstab.puntosEmision
            $scope.bodegas = dataEstab.bodegas;

            if ($scope.puntosEmision.length > 0) {
                $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => (x.defaultPtoEmi)).idPuntoEmision
            }

            $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => (x.defaultBodega)).idBodega : 0
            $scope.cloneIdBodega = $scope.idBodega

        } else {
            tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
        }
        $scope.decimal = config

        $scope.articlesSelected = []
        $scope.advancedSearch = () => {
            modalSvc.openModalCustom({
                controller: 'AdvancedSearchCtrl',
                template: '~/Areas/Consolidacion/Pages/Shared/_AdvancedSearch.cshtml',
                isRenderRazorPartial: true,
                size: 'xl',
                windowClass: 'uibModalFullScreen'
            }).result.then(
                response => {
                    if (response) {
                        for (const a of response) {
                            if (!$scope.articlesSelected.some(x => x.idArticulo == a.idArticulo)) {
                                $scope.setItemArticuloEnDetalle(a, true)
                                //$scope.articlesSelected.push(a)
                            }
                        }
                        //console.log($scope.articlesSelected)
                    }
                }
            )
        }

        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            showGridFooter: true,
            enableCellEdit: false,
        }
        $scope.setColumnDefs = () => {
            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                            <a  ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                            <a  ng-click="grid.appScope.openModalArticuloEditar(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
                            `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario !== true;
                },
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: function (rowEntity) {
                    return rowEntity.medidas.map(function (val) {
                        return {
                            id: val.idMedida,
                            value: val.descripcion
                        }
                    })

                },
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'codigoTipoIva',
                field: 'codigoTipoIva',
                allowCellFocus: false,
                type: 'string',
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                enableColumnMenu: false,
                visible: false
            },
            {
                name: 'Iva',
                field: 'nombreTipoIva',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'string',
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'Stock',
                field: 'stock',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '5%',
                minWidth: '65',
                type: 'number',
                enableColumnMenu: false,
                visible: true,
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo Actual',
                field: 'precioActual',
                min: 0,
                type: 'number',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                width: '12%',
                minWidth: '100',
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                aggregationType: fS.roundNumber($scope.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableFiltering: false,
                enableColumnMenu: false,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'bodega',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '11%',
                minWidth: '100'
            }
            ];
            let indexBodega = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas
        }

        $scope.setColumnDefs()
        $scope.gridOptions.data = $scope.detalleDocumento

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }
            gridApi.grid.element.on('keyup', function (ev) {
                if (ev.which == 13 || ev.keyCode == '13') {
                    $scope.setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })
            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos                 
                if (rowEntity[colDef.field] === "" || rowEntity[colDef.field] === undefined || rowEntity[colDef.field] === null) {
                    rowEntity[colDef.field] = oldValue;
                    return
                }

                if (colDef.field === "precioActual") {
                    rowEntity.precioCosto = fS.roundNumber(rowEntity.precioCosto, $scope.decimal.nroPrecio)
                    rowEntity.precioActual = fS.roundNumber(rowEntity.precioActual, $scope.decimal.nroPrecio)
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);

                    rowEntity.precioCosto = fS.roundNumber(dataMedida.precioCosto, $scope.decimal.nroPrecio)
                    rowEntity.precioActual = fS.roundNumber(dataMedida.precioCosto, $scope.decimal.nroPrecio)
                }

                $scope.setTotalColumn(rowEntity);
                $scope.setTotalDetalle();

            })
        }

        $scope.setTotalColumn = (rowEntity) => {
            let total = rowEntity.cantidad * rowEntity.precioActual;
            rowEntity.total = fS.roundNumber(total, $scope.decimal.nroTotalDetalle); //Total Precio Venta
        }

        $scope.setTotalDetalle = () => {
            let total = $scope.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);

            $scope.data.total = fS.roundNumber(total, $scope.decimal.nroTotalSubTotal)
        }

        $scope.setFocusArticulo = () => {
            setTimeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
        }

        $scope.askToChangeBodega = async () => {
            let {
                isConfirmed
            } = await Swal.fire({
                html: `<small>Esta seguro de cambiar la bodega en todo el Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                reverseButtons: false,
            })

            if (isConfirmed) {
                $scope.cloneIdBodega = $scope.idBodega;
                for (let item of $scope.gridOptions.data) {
                    item.idBodega = $scope.idBodega;
                }
                $scope.$apply()
            } else {
                $scope.idBodega = $scope.cloneIdBodega;
                $scope.$apply()
            }
        }

        $scope.setItemArticuloEnDetalle = async (item, isAdvanced = null) => {
            try {
                let articulo = {}
                let medidas = []
                if (!isAdvanced) {
                    let tempArray = JSON.parse(item.payload) || []
                    articulo = tempArray[0][0]
                    medidas = tempArray[5]
                } else {
                    articulo = item
                    medidas.push({ idMedida: articulo.idMedida, descripcion: articulo.medida, precioCosto: articulo.precioCosto })
                    if (articulo.fraccionado) {
                        let medidasTemp = articulo.medidas && JSON.parse(articulo.medidas) || [];
                        for (const m of medidasTemp) {
                            medidas.push(m)
                        }
                    }
                    console.log(articulo)
                }

                console.log(medidas)

                if (!articulo.llevaInventario) {
                    Swal.fire({
                        icon: 'warning',
                        html: 'Este articulo no esta configurado para llevar inventario'
                    })
                    return
                }

                let entity = {}
                $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === articulo.idArticulo);
                if ($scope.indexRow !== -1) {

                    entity = $scope.gridOptions.data[$scope.indexRow];

                    if (!item.isUpdateProduct) {

                        let { isConfirmed } = await Swal.fire({
                            text: "Desea sumar la cantidad del producto en el detalle?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Si!',
                            cancelButtonText: 'No'
                        })
                        if (isConfirmed) {
                            entity.cantidad = entity.cantidad + 1;
                        }
                    }

                    $scope.addItem(entity, articulo, medidas);
                } else {
                    $scope.addRow();
                    $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === 0);
                    entity = $scope.gridOptions.data[$scope.indexRow];
                    $scope.addItem(entity, articulo, medidas); // item row
                }
                $scope.countEnum();
                $scope.setTotalColumn(entity);
                $scope.setTotalDetalle();

                $scope.focusColumnaCantidad();
            } catch (error) {
                console.error(error)
            }
        }

        $scope.addRow = () => {
            $scope.gridOptions.data.push({
                idConsolidacionInventarioDetalle: 0,
                num: 1,
                idArticulo: 0,
                codigo: "",
                descripcion: "",
                cantidad: 1,
                nombreMedida: "",
                codigoTipoIva: "",
                nombreTipoIva: "",
                stock: 0,
                precioCosto: 0,
                idBodega: 0,
                nota: "S/N"
            })
        }

        $scope.addItem = (entity, articulo, medidas) => {
            entity.idConsolidacionInventarioDetalle = articulo.idConsolidacionInventarioDetalle ? articulo.idConsolidacionInventarioDetalle : 0
            entity.codigo = articulo.codigo;
            entity.idArticulo = articulo.idArticulo;
            entity.descripcion = articulo.descripcion;
            entity.codigoTipoIva = articulo.codigoTipoIva;
            entity.porcentajeTipoIva = articulo.porcentajeTipoIva;
            entity.nombreTipoIva = articulo.nombreTipoIva;
            entity.stock = articulo.stock;
            entity.precioCosto = fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.precioActual = fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.total = fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.idBodega = $scope.idBodega ? $scope.idBodega : 0;
            entity.llevaInventario = articulo.llevaInventario;
            entity.medidas = medidas; //Lista Medida 
            entity.idMedida = articulo.idMedida; //Medida por defecto                                                                    
        }

        $scope.countEnum = () => {
            let counter = 1;
            for (let item of $scope.gridOptions.data) {
                item.num = counter++;
            }
        }

        $scope.focusColumnaCantidad = () => {
            let indexColumn = $scope.gridOptions.columnDefs.findIndex(item => item.field === "cantidad");
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            );

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[$scope.indexRow],
                    $scope.gridOptions.columnDefs[indexColumn]
                );
            }, 10)
        }

        $scope.deleteRow = async (row) => {
            let {
                isConfirmed
            } = await Swal.fire({
                html: `<small>Esta Ud. seguro/a de eliminar este Articulo <b>${row.entity.descripcion}</b></small>?`,
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: `Sí, eliminar!`,
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                let index = $scope.gridOptions.data.indexOf(row.entity);
                $scope.gridOptions.data.splice(index, 1);

                $scope.setTotalDetalle();
                $scope.countEnum();
                $scope.$apply();
            }
        }

        $scope.openModalArticuloEditar = (item) => {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )
            item.isUpdate = true;
            let params = Object.assign(item, { isUpdate: true })
            $scope.$broadcast("editArticulo", params);
        }

        $scope.validForm = (tituloModal) => {
            if (!$scope.data.codEstab) {
                tS.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
                return
            }

            if (!($scope.data.idPuntoEmision)) {
                tS.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                return
            }

            if (!($scope.data.fechaEmision)) {
                tS.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                return
            }

            if ($scope.gridOptions.data.length === 0) {
                tS.toastr('warning', 'Al menos ingrese un Articulo en el Detalle', tituloModal);
                return
            }

            if ($scope.gridOptions.data.some(item => (!(item.idBodega > 0)))) {
                tS.toastr('warning', 'Agregue  bodega a los artículos');
                return
            }
            return true
        }


        $scope.onSave = async () => {
            try {
                let tituloModal = "Actualizar";

                if (!await $scope.validForm(tituloModal)) return

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    title: '<small>Actualizar Documento</small>',
                    html: `<small>Esta seguro de actualizar la Consolidación?</small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, actualizar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false
                })

                if (isConfirmed) {

                    showLoader();

                    let consolidacion = Object.assign({}, $scope.data);
                    consolidacion.fechaEmision = fS.formatDateTimeZone($scope.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                    let data = {
                        consolidacion,
                        detalle: $scope.gridOptions.data
                    }

                    mS.getData('put', 'Consolidacion/?id=' + $scope.data.idConsolidacionInventario, { data: data }, true).then(response => {
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response);
                        }
                        hideLoader()
                    })
                }

            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }
        $scope.closeModal = () => {
            $uibModalInstance.close();
        }
    }

    app.controller("ModalConsolidacionDetalleCtrl", ModalConsolidacionDetalleCtrl)
    ModalConsolidacionDetalleCtrl.$inject = [
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'uiGridConstants',
        'params'
    ]
    function ModalConsolidacionDetalleCtrl($scope, $timeout, $uibModalInstance, uiGridConstants, _params) {

        let {
            TIPO_REGISTRO,
            data
        } = _params;
        let {
            dataDocumento,
            detalleDocumento
        } = data;

        $scope.TIPO_REGISTRO = TIPO_REGISTRO;
        $scope.uiGridConstants = uiGridConstants
        $scope.data = dataDocumento;
        $scope.detalleDocumento = detalleDocumento;
        $scope.detalleDocumento.num = 0
        let index = 1
        angular.forEach($scope.detalleDocumento, (value) => {
            value.num = index
            index++
        })

        if (establecimientos.length > 0) {
            $scope.establecimientos = establecimientos;
            let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
            $scope.data.codEstab = dataEstab;
            $scope.cloneCodEstab = $scope.data.codEstab
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.bodegas = dataEstab.bodegas;

            if ($scope.puntosEmision.length > 0) {
                $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => (x.defaultPtoEmi)).idPuntoEmision
            }

            $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => (x.defaultBodega)).idBodega : 0
            $scope.cloneIdBodega = $scope.idBodega

        } else {
            tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
        }

        $scope.decimal = config

        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            showGridFooter: true,
            enableCellEdit: false,
        }

        $scope.setColumnDefsView = () => {

            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                    <a  style="cursor:pointer;" class="btn btn-danger btn-xs text-white disabled" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                    <a style="cursor:pointer;" class= "btn btn-success btn-xs text-white disabled" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
                    `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                min: 1,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                editDropdownOptionsFunction: function (rowEntity) {
                    return rowEntity.medidas.map(function (val) {
                        //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                        //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                        //}
                        return {
                            id: val.idMedida,
                            value: val.descripcion
                        }
                    })

                },
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'Iva',
                field: 'nombreTipoIva',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'string',
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'Stock',
                field: 'stock',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '5%',
                minWidth: '65',
                type: 'number',
                enableColumnMenu: false,
                visible: true,
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEditOnFocus: false,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                cellFilter: "currency:'$'",
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo Actual',
                field: 'precioActual',
                min: 0,
                type: 'number',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                width: '12%',
                minWidth: '100',
                cellFilter: "currency:'$'",
                aggregationType: $scope.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                aggregationType: fS.roundNumber($scope.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableFiltering: false,
                enableColumnMenu: false,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'mapBodega:grid.appScope.bodegas',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '11%',
                minWidth: '100'
            }
            ];
            let indexBodega = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
        }

        $scope.setColumnDefsView()

        $scope.gridOptions.data = $scope.detalleDocumento


        $scope.getReport = () => {
            try {
                // let format = 'excel';
                // let dataParms = {
                //     id: $scope.data.idConsolidacionInventario,
                //     codEstab: $scope.data.codEstab,
                //     codigo: 'RCD',
                //     codDoc: 'CI',
                //     format,
                // }

                // const parameters = {
                //     dataParams: JSON.stringify(dataParms)
                // }

                let format = 'excel';

                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: 'RCD',
                        codEstab: $scope.data.codEstab,
                        format,
                        aditionalParams: [

                        ]
                    }),
                    dataParams: JSON.stringify({
                        codDoc: 'CI',
                        id: $scope.data.idConsolidacionInventario,
                    })
                }


                commonSvc.getReport({
                    parameters,
                    formatType: format
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.closeModal = () => {
            $uibModalInstance.close();
        }

    }

})(window.angular)
