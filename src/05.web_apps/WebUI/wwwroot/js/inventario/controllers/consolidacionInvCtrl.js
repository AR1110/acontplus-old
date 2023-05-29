
(function () {
    'use strict'
    let establecimientos = []
    let puntosEmision = []
    let bodegas = []
    let subfamilias = []
    let config = {}

    app.controller('consolidacionInvCtrl', consolidacionInvCtrl);

    consolidacionInvCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario']

    function consolidacionInvCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form) {

        // let accion = JSON.parse(localStorage.getItem("accion"));  
        // if(accion===null){
        //     location.href ="/Home/Index";
        //     return
        // }else{
        //     $scope.accion = accion[0];
        // }


        $scope.btnEditDisabled = false;

        const TIPO_DOC = _commonSvc.tipoDoc['CIV'];

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000
        }

        $scope.getConsolidaciones = async () => {
            try {
                showLoader();
                $scope.consolidaciones = []

                $scope.dataSearch.tipo = 2

                _mS.getData('get', 'Consolidacion/?json=' + JSON.stringify($scope.dataSearch), null, true).then(response => {
                    if (response.code === "0") {
                        console.warn(response)
                    }
                    if (response.code === "1") {
                        let tempArray = JSON.parse(response.payload) || []
                        $scope.consolidaciones = tempArray[0]
                        $scope.cloneConsolidaciones = tempArray[0]
                        let total = $scope.consolidaciones.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
                        $scope.total = _form.roundNumber(total, 5);
                    }
                }).catch(error => {
                    console.error(error)
                })
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }

        $scope.initiload = () => {
            _mS.getData('GET', 'Consolidacion/?json=' + JSON.stringify({ tipo: 1 }), null, true).then(
                response => {
                    if (response.code == "1") {
                        let tempArray = JSON.parse(response.payload) || []
                        if (tempArray.length > 0) {
                            establecimientos = tempArray[0]
                            puntosEmision = tempArray[0]
                            bodegas = tempArray[1]
                            subfamilias = tempArray[2]
                            config = JSON.parse(tempArray[3][0].jsonConfig).find(x => x.codTransaccion == 'AL')

                            let codEstab = establecimientos.length > 0 ? establecimientos[0].codEstab : 0
                            $scope.dataSearch.codEstab = codEstab
                            $scope.getConsolidaciones()
                        }
                    }
                }
            ).catch(error => {
                console.error(error)
            })
        }
        $scope.initiload();


        $scope.getListaFilter = () => {
            let consolidaciones = JSON.parse(JSON.stringify($scope.cloneConsolidaciones))
            $scope.consolidaciones = $filter("filter")(consolidaciones, $scope.dataSearch.bySearch);
            let total = $scope.consolidaciones.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
            $scope.total = _form.roundNumber(total, 5);
        }

        $scope.openModalNew = async () => {

            let { MODAL_FILE_CTRL, MODAL_NUEVO } = _nombreModalConst.consolidacion_inv;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
            let template = MODAL_NUEVO['template'];

            let params = {
                TIPO_REGISTRO: 'NUEVO'
            }

            $scope.openModalParam({
                controller: 'ModalConsolidacionNuevoCtrl',
                template,
                params
            })
        }


        $scope.openModalFiltro = async () => {
            let { MODAL_FILE_CTRL, MODAL_FILTRO } = _nombreModalConst.consolidacion_inv;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_FILTRO['controller']];
            let template = MODAL_FILTRO['template'];

            let params = {

            }

            let modalRef = _modalSvc.openModalCustom({
                controller,
                isRenderRazorPartial: true,
                template
            })
        }

        $scope.openModalDetalle = async (item) => {
            try {
                showLoader();
                let { MODAL_FILE_CTRL, MODAL_DETALLE } = _nombreModalConst.consolidacion_inv;
                let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
                let template = MODAL_DETALLE['template'];

                const response = await _commonSvc.getDataConsolidacionInventario(item.idConsolidacionInventario)

                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'DETALLE',
                    data: response
                }

                $scope.openModalParam({
                    controller: "ModalConsolidacionDetalleCtrl",
                    template,
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
                let { MODAL_FILE_CTRL, MODAL_EDITAR } = _nombreModalConst.consolidacion_inv;
                let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
                let template = MODAL_EDITAR['template'];

                const response = await _commonSvc.getDataConsolidacionInventario(item.idConsolidacionInventario)

                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'EDITAR',
                    data: response
                }

                $scope.openModalParam({
                    controller: "ModalConsolidacionEditarCtrl",
                    template,
                    isRenderRazorPartial: true,
                    params
                })
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }

        $scope.openModalParam = async ({ controller, template, size = 'xl', params }) => {
            _modalSvc.openModalCustom({
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
                _mS.getData('delete', '/ConsolidacionInventario/Delete?id=' + item.idConsolidacionInventario).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        _form.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        hideLoader();
                        _form.sweetAlert('success', response.message, response.titleSms, 1000);
                        $scope.getConsolidaciones();
                    }
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

            _commonSvc.getReport({
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
        'storageService',
        'uiGridConstants',
        'mainService',
        'commonService',
        'modalService',
        'nombreModal',
        'toastService',
        'formulario',
        'params'
    ]
    function ModalConsolidacionNuevoCtrl($scope, $timeout, $uibModalInstance, _storageSvc, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {
        console.log("inside new modal")
        $scope.TIPO_REGISTRO = _params
        $scope.data = {}
        $scope.data.fechaEmision = new Date()
        $scope.data.total = 0
        $scope.uiGridConstants = uiGridConstants;

        $scope.TIPO_DOC = _commonSvc.tipoDoc['CIV'];

        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            //enableGridMenu: true,
            // enableFiltering: false,
            // enableRowHashing: false,
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
                editDropdownOptionsFunction: function (rowEntity, colDef) {
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                aggregationType: _fS.roundNumber($scope.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                    $scope.establecimientos = establecimientos
                    $scope.data.codEstab = establecimientos.length > 0 ? establecimientos[0].codEstab : 0
                    $scope.cloneCodEstab = $scope.data.codEstab
                    $scope.puntosEmision = puntosEmision

                    if ($scope.puntosEmision.length > 0) {
                        $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => x.defaultPtoEmi == true).idPuntoEmision
                    }

                    $scope.bodegas = bodegas
                    $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => x.defaultBodega == true).idBodega : 0
                    $scope.cloneIdBodega = $scope.idBodega

                } else {
                    _tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
                }

                $scope.decimal = config


                $scope.setColumnDefs();


                if (Object.keys(_storageSvc.getObject("consolidacionDetail")).length > 0) {
                    _storageSvc.restoreInvoiceDetail("consolidacionDetail").then(result => {
                        if (result.isConfirmed) {
                            $scope.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value])
                            delete result.dataInvoiceDetail[result.value];

                            _storageSvc.setObject("consolidacionDetail", result.dataInvoiceDetail)
                        }

                    })
                }

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
                    rowEntity.precioCosto = _fS.roundNumber(rowEntity.precioCosto, $scope.decimal.nroPrecio)
                    rowEntity.precioActual = _fS.roundNumber(rowEntity.precioActual, $scope.decimal.nroPrecio)
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);

                    rowEntity.precioCosto = _fS.roundNumber(dataMedida.precioCosto, $scope.decimal.nroPrecio)
                    rowEntity.precioActual = _fS.roundNumber(dataMedida.precioCosto, $scope.decimal.nroPrecio)
                }

                $scope.setTotalColumn(rowEntity);
                $scope.setTotalDetalle();

            })
        }

        $scope.setTotalColumn = (rowEntity) => {
            let total = rowEntity.cantidad * rowEntity.precioActual;
            rowEntity.total = _fS.roundNumber(total, $scope.decimal.nroTotalDetalle); //Total Precio Venta
        }

        $scope.setTotalDetalle = () => {
            let total = $scope.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);

            $scope.data.total = _fS.roundNumber(total, $scope.decimal.nroTotalSubTotal)
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

                $scope.cloneCodEstab = $scope.data.codEstab;

                const dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);

                //Obtenemos Puntos de Emision y Bodegas 
                let resultsDataFormEstab = await $scope.getDataFormEstabAsig(dataEstab);

                $scope.puntosEmision = resultsDataFormEstab[0];
                $scope.data.idPuntoEmision = $scope.puntosEmision.length > 0 ? $scope.puntosEmision[0].idPuntoEmision : 0;

                $scope.bodegas = resultsDataFormEstab[1];
                $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas[0].idBodega : 0;
                $scope.cloneIdBodega = $scope.idBodega;

                let indexColumn = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');

                $scope.gridOptions.columnDefs[indexColumn].editDropdownOptionsArray = $scope.bodegas;

                for (let item of $scope.gridOptions.data) {
                    item.idBodega = $scope.idBodega;
                }
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

        $scope.setItemArticuloEnDetalle = (item) => {
            try {
                let tempArray = JSON.parse(item.payload) || []
                let articulo = tempArray[0][0]
                let medidas = tempArray[5]
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
                    entity.cantidad = entity.cantidad + 1;

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
            entity.codigo = articulo.codigoArticulo;
            entity.idArticulo = articulo.idArticulo;
            entity.descripcion = articulo.descripcion;
            entity.codigoTipoIva = articulo.codigoTipoIva;
            entity.porcentajeTipoIva = articulo.porcentajeTipoIva;
            entity.nombreTipoIva = articulo.nombreTipoIva;
            entity.stock = articulo.stock;
            entity.precioCosto = _fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.precioActual = _fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.total = _fS.roundNumber(medidas[0].precioCosto, $scope.decimal.nroPrecio)
            entity.idBodega = $scope.idBodega ? $scope.idBodega : 0;
            entity.llevaInventario = articulo.llevaInventario;
            entity.medidas = medidas; //Lista Medida 
            entity.idMedida = medidas[0].idMedida; //Medida por defecto                                                                    
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
            $scope.$broadcast("editArticulo", item)
        }

        $scope.consolidacionArticuloImport = async () => {
            try {

                let {
                    MODAL_FILE_CTRL,
                    MODAL_CONSOL_IMPORT
                } = _nombreConst.consolidacion_inv;
                let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_CONSOL_IMPORT['controller']]
                let template = MODAL_CONSOL_IMPORT['template'];


                let modalRef = _modalSvc.openModalCustom({
                    controller: 'ModalConsolidacionImportacionCtrl',
                    template,
                    isRenderRazorPartial: true,
                    size: 'xl',
                    windowClass: 'uibModalFullScreen'
                })

                // modalRef.rendered.then(()=>{
                //     $uibModalInstance.close();
                // })

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
                    _tS.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
                    return
                }

                if (!($scope.data.idPuntoEmision)) {
                    _tS.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                    return
                }

                if (!($scope.data.fechaEmision)) {
                    _tS.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                    return
                }

                if ($scope.gridOptions.data.length === 0) {
                    _tS.toastr('warning', 'Al menos ingrese un Articulo en el Detalle', tituloModal);
                    return
                }

                if ($scope.gridOptions.data.some(item => (!(item.idBodega > 0)))) {
                    _tS.toastr('warning', 'Agregue  bodega a los artículos');
                    return
                }

                showLoader();
                $scope.nroDocumentoSecuencial = await _commonSvc.generarNroDocumentoCompra({
                    idPuntoEmision: $scope.data.idPuntoEmision,
                    codigoDocumento: $scope.TIPO_DOC.codigo
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
                    consolidacion.fechaEmision = _fS.formatDateTimeZone($scope.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                    let data = {
                        consolidacion,
                        detalle: $scope.gridOptions.data
                    }

                    await _mS.getData('post', 'Consolidacion/', { data: data }, true).then(response => {
                        if (response.code === '0') {
                            _fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            _fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response);
                        }
                    })


                }

            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
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
                    showDenyButton: true,
                    confirmButtonText: 'Apartar',
                    denyButtonText: 'Si, salir',
                    cancelButtonText: 'No, cancelar!',
                    focusDeny: true,
                    reverseButtons: false
                }).then(result => {

                    if (result.isConfirmed) {
                        $scope.askToSaveStorage();
                    }

                    if (result.isDenied) {
                        $uibModalInstance.close();
                    }

                })
                return
            }
            $uibModalInstance.close();
        }


        $scope.askToSaveStorage = async () => {
            try {
                await _storageSvc.askToSaveDetailDoc("consolidacionDetail", $scope.gridOptions.data);
                $uibModalInstance.close();
            } catch (error) {
                console.log(error)
            }
        }
    }
    let tipoIvas = []
    app.controller("ModalConsolidacionImportacionCtrl", ModalConsolidacionImportacionCtrl)
    ModalConsolidacionImportacionCtrl.$inject = [
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'uiGridConstants',
        'mainService',
        'commonService',
        'modalService',
        'nombreModal',
        'toastService',
        'formulario',
        'params'
    ]
    function ModalConsolidacionImportacionCtrl($scope, $timeout, $uibModalInstance, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {
        $scope.TIPO_DOC = _commonSvc.tipoDoc['CIV']
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
            cellFilter: 'mapBodega:grid.appScope.bodegas',
            editDropdownValueLabel: 'descripcion',
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
            $scope.data.codEstab = establecimientos.length > 0 ? establecimientos[0].codEstab : 0
            $scope.cloneCodEstab = $scope.data.codEstab
            $scope.puntosEmision = puntosEmision

            if ($scope.puntosEmision.length > 0) {
                $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => x.defaultPtoEmi == true).idPuntoEmision
            }

            $scope.bodegas = bodegas
            $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => x.defaultBodega == true).idBodega : 0
            $scope.cloneIdBodega = $scope.idBodega

        } else {
            _tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
        }

        $scope.decimal = config

        console.log("Inside Importacion Modal")
        $scope.initialLoad = () => {
            _mS.getData("GET", '/Articulo/Get?json=' + JSON.stringify({ checkBoxConsolidar: true })).then(
                response => {
                    if (response.code == "0") {
                        _tS.toastr("warning", response.message)
                    }
                    if (response.code == "1") {
                        console.log(response)
                        $scope.articulosImportados = JSON.parse(response.payload) || [];
                        let num = 1;
                        $scope.gridOptions.data = $scope.articulosImportados.map(item => ({
                            ...item,
                            idBodega: $scope.idBodega,
                            cantidad: item.stock,
                            total: item.stock * item.precioCosto,
                            num: num++
                        }))
                    }
                }
            ).catch(error => {
                console.log(error)
            })
        }
        $scope.initialLoad()

        $scope.askToSave = async () => {
            try {

                if (!$scope.data.codEstab || $scope.data.codEstab === 0) {
                    _tS.toastr('warning', 'Seleccione el Establecimiento');
                    return
                }

                if (!$scope.data.idPuntoEmision || $scope.data.idPuntoEmision === 0) {
                    _tS.toastr('warning', 'Seleccione el Punto de Emisión');
                    return
                }

                if (!$scope.data.fechaEmision) {
                    _tS.toastr('warning', 'Seleccione la Fecha de Emisión');
                    return
                }

                if ($scope.gridOptions.data.length === 0) {
                    _tS.toastr('warning', 'No hay articulos a Consolidar');
                    return
                }

                if ($scope.gridOptions.data.some(item => ["", null, undefined, 0].includes(item.idBodega))) {
                    _tS.toastr('warning', 'La bodega en el detalle es requerido');
                    return
                }

                let nroDocumentoSecuencial = await $scope._commonSvc.generarNroDocumentoCompra({
                    idPuntoEmision: $scope.data.idPuntoEmision,
                    codigoDocumento: $scope.TIPO_DOC.codigo
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
                consolidacion.fechaEmision = _fS.formatDateTimeZone($scope.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                let data = {
                    consolidacion,
                    detalle: $scope.gridOptions.data
                }

                _mS.getData('post', '/Consolidacion/Insert', { data: data }, true).then(response => {
                    if (response.code === '0') {
                        hideLoader();
                        _fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        hideLoader();
                        _fS.sweetAlert('success', response.message, response.titleSms, 1000);

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
        'mainService',
        'commonService',
        'modalService',
        'nombreModal',
        'toastService',
        'formulario',
        'params'
    ]
    function ModalConsolidacionEditarCtrl($scope, $timeout, $uibModalInstance, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {
        let {
            TIPO_REGISTRO,
            data
        } = _params;
        let {
            dataDocumento,
            detalleDocumento
        } = data;

        $scope.TIPO_REGISTRO = TIPO_REGISTRO;
        $scope.data = dataDocumento;
        $scope.detalleDocumento = detalleDocumento;


        $scope.disabledInputFechaEmision = true;


        if (establecimientos.length > 0) {
            $scope.establecimientos = establecimientos
            $scope.data.codEstab = establecimientos.length > 0 ? establecimientos[0].codEstab : 0
            $scope.cloneCodEstab = $scope.data.codEstab
            $scope.puntosEmision = puntosEmision

            if ($scope.puntosEmision.length > 0) {
                $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => x.defaultPtoEmi == true).idPuntoEmision
            }

            $scope.bodegas = bodegas
            $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => x.defaultBodega == true).idBodega : 0
            $scope.cloneIdBodega = $scope.idBodega

        } else {
            _tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
        }

        $scope.decimal = config


        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            //enableGridMenu: true,
            // enableFiltering: false,
            // enableRowHashing: false,
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
                editDropdownOptionsFunction: function (rowEntity, colDef) {
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                aggregationType: _fS.roundNumber($scope.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                editDropdownValueLabel: 'descripcion',
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

        $scope.gridOptions.data = $scope.detalleDocumento

        $scope.validForm = (tituloModal) => {
            if (!$scope.data.codEstab) {
                _tS.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
                return
            }

            if (!($scope.data.idPuntoEmision)) {
                _tS.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                return
            }

            if (!($scope.data.fechaEmision)) {
                _tS.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                return
            }

            if ($scope.gridOptions.data.length === 0) {
                _tS.toastr('warning', 'Al menos ingrese un Articulo en el Detalle', tituloModal);
                return
            }

            if ($scope.gridOptions.data.some(item => (!(item.idBodega > 0)))) {
                _tS.toastr('warning', 'Agregue  bodega a los artículos');
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
                    consolidacion.fechaEmision = _fS.formatDateTimeZone($scope.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                    let data = {
                        consolidacion,
                        detalle: $scope.gridOptions.data
                    }

                    _mS.getData('put', 'Consolidacion/?id=' + $scope.data.idConsolidacionInventario, { data: data }, true).then(response => {
                        if (response.code === '0') {
                            _fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            _fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response);
                        }
                    })


                }

            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
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
        'mainService',
        'commonService',
        'modalService',
        'nombreModal',
        'toastService',
        'formulario',
        'params'
    ]

    function ModalConsolidacionDetalleCtrl($scope, $timeout, $uibModalInstance, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {

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

        if (establecimientos.length > 0) {
            $scope.establecimientos = establecimientos
            $scope.data.codEstab = establecimientos.length > 0 ? establecimientos[0].codEstab : 0
            $scope.cloneCodEstab = $scope.data.codEstab
            $scope.puntosEmision = puntosEmision

            if ($scope.puntosEmision.length > 0) {
                $scope.data.idPuntoEmision = $scope.puntosEmision.find(x => x.defaultPtoEmi == true).idPuntoEmision
            }

            $scope.bodegas = bodegas
            $scope.idBodega = $scope.bodegas.length > 0 ? $scope.bodegas.find(x => x.defaultBodega == true).idBodega : 0
            $scope.cloneIdBodega = $scope.idBodega

        } else {
            _tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO')
        }

        $scope.decimal = config

        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            //enableGridMenu: true,
            // enableFiltering: false,
            // enableRowHashing: false,
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
                editDropdownOptionsFunction: function (rowEntity, colDef) {
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
                aggregationType: _fS.roundNumber($scope.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = _fS.roundNumber(aggregation.value, 2)
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
        }

        $scope.setColumnDefsView()

        $scope.gridOptions.data = $scope.detalleDocumento



        $scope.closeModal = () => {
            $uibModalInstance.close();
        }

    }

})(window.angular)
