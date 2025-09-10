
//@ts-check
(function () {
    'use strict'

    const URL_TEMPLATE = '~/Pages/Inventario/Consolidacion/Shared/'

    let modalSvc = {};
    let commonSvc = {};
    let mS = {};
    let tS = {};
    let fS = {};

    let establecimientos = [];

    let consolidacionInvSvc = {};
    let mainDataForm = {};

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
        const nombreModalInventario = $injector.get('nombreModalInventario');

        $scope.btnEditDisabled = false;
        $scope.dataSearch = {
            pageSize: 10,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
            ckFecha: true,
            tipoDocId: 0,
            // fechaInicio: fS.formatDateMoment(new Date()),
            // fechaFin: fS.formatDateMoment(new Date()),

        }
        $scope.recordsQuantity = [5, 10, 25, 50, 100];

        $scope.tiposDoc = []

        $scope.refresh = refresh;

        $scope.openModalNew = function () {
            try {
                modalSvc.openModalCustom({
                    controller: modalConsolidacionAddEditCtrl,
                    template: URL_TEMPLATE + '_ModalNuevo.cshtml',
                    size: 'xl',
                    params: {
                        tipoRegistro: 1
                    },
                    isRenderRazorPartial: true,
                    windowClass: 'uibModalFullScreen'
                }).result.then(result => {
                    if (typeof result === 'object') {
                        refresh()
                    }
                })

            } catch (error) {
                console.log(error)
            }
        }

        function refresh() {
            getList()
        }


        function getList() {
            try {

                if ($scope.dataSearch.nroSecuencial) {
                    if (
                        !fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                    ) {
                        $scope.dataSearch.ckFecha = true;
                        tS.toastr({
                            type: "warning",
                            message:
                                "Define correctamente el número de secuencial o el rango de número secuencial!",
                        });
                        return;
                    }
                    $scope.dataSearch.ckFecha = false;
                    tS.toastr({
                        type: "info",
                        message: "Buscando por número secuencial",
                    });
                }


                let params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    ckFecha: $scope.dataSearch.ckFecha,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential(
                        $scope.dataSearch.nroSecuencial
                    ),
                    tipoDocId: fS.getValidId($scope.dataSearch.tipoDocId),
                    textSearch: fS.isValidField($scope.dataSearch.textSearch)
                }

                $scope.consolidaciones = [];
                consolidacionInvSvc.getAll(params).then(response => {
                    $scope.consolidaciones = response;
                    $scope.dataSearch.totalRecords = $scope.consolidaciones.length > 0 ? $scope.consolidaciones[0].totalRecords : 0;
                    $scope.cloneConsolidaciones = structuredClone($scope.consolidaciones);
                    let total = $scope.consolidaciones.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
                    $scope.total = fS.roundNumber(total, 5);
                })
                    .catch(error => {
                        $scope.dataSearch.totalRecords = 0;
                        console.log(error)
                    })
                    .finally(() => hideLoader());
            } catch (error) {
                console.log(error)
            }
        }



        initLoad();
        function initLoad() {
            try {

                consolidacionInvSvc.getDataForm().then(response => {
                    mainDataForm = response;
                    let { estabs } = response;
                    $scope.tiposDoc = response.tipoDocumento;
                    establecimientos = estabs;

                    if (establecimientos.length > 0) {
                        let dataEstab = establecimientos.find(estab => (estab.defaultEstab));
                        $scope.dataSearch.codEstab = dataEstab.codEstab;
                    }
                    getList()
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {

                console.log(error)
            }
        }

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate
            getList()
        }

        $scope.pagechanged = function () {
            getList()
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            getList()
        };

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
                if (typeof result === 'object') {
                    refresh()
                }
            })
        }

        // $scope.openModalNew = () => {
        //     $scope.openModalParam({
        //         controller: 'ModalConsolidacionNuevoCtrl',
        //         template: URL_TEMPLATE + '_ModalNuevo.cshtml',
        //         params: {
        //             TIPO_REGISTRO: 'NUEVO'
        //         }
        //     })
        // }
        $scope.openModalFiltro = async () => {


        }

        $scope.openModalDetalle = async (item) => {
            try {
                let fileCtrl = nombreModalInventario.CONSOLIDACION.fileCtrl;
                let ctrl = nombreModalInventario.CONSOLIDACION.controllers['D'];
                let template = URL_TEMPLATE + '_ModalDetalle.cshtml';

                let controller = (await import(fileCtrl))[ctrl];
                modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params: {
                        id: item.idConsolidacionInventario
                    },
                    isRenderRazorPartial: true,
                    windowClass: 'uibModalFullScreen'
                })

            } catch (error) {
                console.log(error)
            }
        }

        $scope.openModalEditar = async (item) => {
            try {


                consolidacionInvSvc.getId(item.idConsolidacionInventario).then(response => {
                    if (Object.keys(response.comprobante).length > 0 && response.detalles.length > 0) {
                        modalSvc.openModalCustom({
                            controller: modalConsolidacionAddEditCtrl,
                            template: URL_TEMPLATE + '_ModalEditar.cshtml',
                            size: 'xl',
                            params: {
                                data: response,
                                tipoRegistro: 2
                            },
                            isRenderRazorPartial: true,
                            windowClass: 'uibModalFullScreen'
                        }).result.then(result => {

                            if (result !== null && typeof result === 'object') {
                                refresh()
                            }
                        })

                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {

                console.log(error)
            }
        }


        $scope.openModalDuplicar = async (item) => {
            try {


                consolidacionInvSvc.getId(item.idConsolidacionInventario).then(response => {
                    if (Object.keys(response.comprobante).length > 0 && response.detalles.length > 0) {
                        modalSvc.openModalCustom({
                            controller: modalConsolidacionAddEditCtrl,
                            template: URL_TEMPLATE + '_ModalNuevo.cshtml',
                            size: 'xl',
                            params: {
                                data: response,
                                tipoRegistro: 3
                            },
                            isRenderRazorPartial: true,
                            windowClass: 'uibModalFullScreen'
                        }).result.then(result => {

                            if (result !== null && typeof result === 'object') {
                                refresh()
                            }
                        })

                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {

                console.log(error)
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
                try {

                    consolidacionInvSvc.anular(item.idConsolidacionInventario).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            getList()
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                } catch (error) {
                    console.log(error)

                }
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


    /***
     * Modal NUEVO-EDITAR
     */

    app.controller('modalConsolidacionAddEditCtrl', modalConsolidacionAddEditCtrl);
    modalConsolidacionAddEditCtrl.$inject = [
        '$injector',
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'uiGridConstants',
        'itemService',
        'params'
    ];
    function modalConsolidacionAddEditCtrl($injector, $scope, $timeout, $uibModalInstance, uiGridConstants, itemSvc, params) {
        const tS = $injector.get('toastService');
        const fS = $injector.get('formulario');
        const articuloSvc = $injector.get('articuloService');

        $scope.tipoDoc = {
            codigo: 'C'
        }

        $scope.articlesSelected = [];

        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.bodegas = [];
        $scope.tiposMovimiento = [];
        $scope.data = {
            fechaEmision: new Date(),
            total: 0
        };
        $scope.dataClone = {};
        $scope.decimal = {};

        let itemsDeleted = [];
        $scope.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            showGridFooter: true,
            enableCellEdit: false,
        }

        $scope.isEnabledDate = true;

        $scope.isSearchItem = false;

        function getDataTipoDoc() {
            let dataDoc = $scope.tipoDocumento.find(t => t.idTipoDocumento === $scope.data.idTipoDocumento);
            if (dataDoc) {
                return dataDoc;
            }
            return dataDoc;
        }

        function setConfigSubGrid(resetConfigSubGrid = false) {
            if (resetConfigSubGrid) {
                $scope.gridOptions.expandableRowTemplate = null;
                $scope.gridOptions.expandableRowScope = null;
                return;
            }
            $scope.gridOptions.expandableRowTemplate = '<div ui-grid="row.entity.subGridOptions" style="height:140px;" ></div>';
            $scope.gridOptions.expandableRowScope = {
                subGridVariable: 'subGridScopeVariable'

            };
            console.log($scope.gridOptions)
        }

        $scope.onChangeTipoDocumento = async () => {
            let dataDoc = getDataTipoDoc();
            let dataMovimiento = {};
            $scope.isEnabledDate = false;
            $scope.isSearchItem = false;
            setConfigSubGrid(true);
            if (dataDoc.codigo === 'OR') {
                $scope.isSearchItem = true;

                if ($scope.gridOptions.data.length === 0) return setConfigSubGrid();

                const { isConfirmed } = await Swal.fire({
                    icon: 'warning',
                    html: `Al cambiar el tipo de documento se eliminarán los artículos agregados.`,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    cancelButtonText: 'Cancelar'
                });
                if (isConfirmed) {
                    $scope.dataClone.idTipoDocumento = $scope.data.idTipoDocumento;
                    $scope.gridOptions.data = [];
                    setConfigSubGrid();
                } else {
                    $scope.data.idTipoDocumento = $scope.dataClone.idTipoDocumento;
                }
                $scope.$apply();
            }

            if (dataDoc.codigo == 'CI') {
                dataMovimiento = $scope.tiposMovimiento.find(t => t.code === 'A');
                $scope.isEnabledDate = true;

            }

            if (dataDoc.codigo == 'BI') {
                dataMovimiento = $scope.tiposMovimiento.find(t => t.code === 'S');
                resetQuantityZero();
            }

            if (dataDoc.codigo == 'EI') {
                dataMovimiento = $scope.tiposMovimiento.find(t => t.code === 'E')
            }

            if (dataMovimiento) {
                $scope.data.idTipoMovimiento = dataMovimiento.id;
            }
            $scope.dataClone.idTipoDocumento = $scope.data.idTipoDocumento;
            loadValidateDate();


        }

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
                    setFocusSearchArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();
                }
            })
            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                if (["", null, undefined].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                    return
                }
                console.log('afterCellEdit', rowEntity, colDef, newValue, oldValue);

                if (colDef.field === "cantidad" && newValue >= 1 && newValue !== oldValue && getDataTipoDoc().codigo === 'BI') {
                    articuloSvc.checkNotificationStock({
                        idArticulo: rowEntity.idArticulo,
                        cantidad: newValue * rowEntity.conversion,
                        idBodega: rowEntity.idBodega,
                        idMedida: rowEntity.idMedida
                    }).then(async responseApi => {

                        let { code, message, titleSms } = responseApi;

                        // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
                        if (code === "1") {

                            setTotalColumn(rowEntity);
                            setTotalDetalle();
                            return;
                        }

                        // Muestra un mensaje de advertencia y espera la confirmación del usuario.
                        let { isConfirmed } = await Swal.fire({
                            title: `<small>${titleSms}</small>`,
                            icon: 'warning',
                            html: `<small>${message}</small>`,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });

                        // Según la confirmación, realiza acciones adicionales.
                        if (isConfirmed) {
                            if (code === "0") {
                                // Si el código es "0", restaura el valor anterior y realiza cálculos totales.
                                rowEntity[colDef.field] = oldValue;
                                setTotalColumn(rowEntity);
                                setTotalDetalle();
                                $("#custom-template-md-autocomplete-articulo").focus();
                            }
                            if (code === "2") {
                                setTotalColumn(rowEntity);
                                setTotalDetalle();
                            }
                        }
                    })
                    return
                }

                if (colDef.field === "precioUnitario") {
                    rowEntity.precioUnitario = fS.roundNumber(rowEntity.precioUnitario, $scope.decimal.nroPrecio)
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);

                    rowEntity.precioUnitario = fS.roundNumber(dataMedida.precioUnitario, $scope.decimal.nroPrecio);
                    rowEntity.conversion = dataMedida.conversion;
                }

                if (colDef.field === "idBodega" && rowEntity.idBodega !== oldValue) {
                    Swal.fire({
                        icon: 'warning',
                        html: `¿Estas seguro de cambiar la bodega?`,
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Si',
                        cancelButtonText: 'No'
                    }).then(result => {
                        if (!result.isConfirmed) {
                            rowEntity.idBodega = oldValue;
                        }
                        setTotalColumn(rowEntity);
                        setTotalDetalle();
                    })
                    return
                }

                setTotalColumn(rowEntity);
                setTotalDetalle();

            })



            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                if (row.isExpanded) {
                    row.entity.subGridOptions = {
                        columnDefs: [
                            { name: 'Employee Id', field: 'EmployeeID' },
                            { name: 'Territory Description', field: 'TerritoryDescription' }
                        ]
                    };
                    employeeservice.GetTerritories(row.entity.EmployeeID).then(function (data) {
                        row.entity.subGridOptions.data = data.data;
                    });
                }
            });
        }
        function setFocusSearchArticulo() {
            setTimeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
        }

        initiload();
        function initiload() {
            try {
                const {
                    estabs,
                    decimal,
                    tipoDocumento,
                    tiposMovimiento,
                } = mainDataForm;
                console.log(mainDataForm)
                $scope.establecimientos = estabs;
                $scope.decimal = decimal;
                $scope.tipoDocumento = tipoDocumento;
                $scope.tiposMovimiento = tiposMovimiento;

                if (params.tipoRegistro === 1) {
                    let dataEstab = $scope.establecimientos.find(item => item.defaultEstab);
                    if (dataEstab) {
                        $scope.data.codEstab = dataEstab.codEstab;
                        $scope.dataClone.codEstab = $scope.data.codEstab;

                        $scope.puntosEmision = dataEstab.puntosEmision;
                        $scope.bodegas = dataEstab.bodegas;

                        let dataPuntoEmision = $scope.puntosEmision.find(pe => pe.defaultPtoEmi);
                        let dataBodega = $scope.bodegas.find(b => b.defaultBodega);

                        if (dataPuntoEmision) {
                            $scope.data.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                        }
                        if (dataBodega) {
                            $scope.data.idBodega = dataBodega.idBodega;
                            $scope.dataClone.idBodega = $scope.data.idBodega;
                        }
                    }
                    setDefaultTipoDoc()
                }

                if (params.tipoRegistro === 2) {
                    const { comprobante, detalles } = params.data;
                    let dataPuntoEmision = $scope.establecimientos.flatMap(e => e.puntosEmision).find(p => p.idPuntoEmision === comprobante.idPuntoEmision);
                    let dataEstab = $scope.establecimientos.find(e => e.codEstab === dataPuntoEmision.codEstab);

                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegas = dataEstab.bodegas;

                    $scope.data = structuredClone(comprobante);
                    $scope.data.codEstab = dataPuntoEmision.codEstab;
                    $scope.dataClone.codEstab = $scope.data.codEstab;

                    const dataBodega = $scope.bodegas.find(b => b.defaultBodega);
                    if (dataBodega) {
                        $scope.data.idBodega = dataBodega.idBodega;
                        $scope.dataClone.idBodega = $scope.data.idBodega;
                    }
                    $scope.gridOptions.data = detalles;
                    setCountIndex();
                    $scope.onChangeTipoDocumento();
                }

                if (params.tipoRegistro === 3) {
                    const { comprobante, detalles } = params.data;
                    let dataPuntoEmision = $scope.establecimientos.flatMap(e => e.puntosEmision).find(p => p.idPuntoEmision === comprobante.idPuntoEmision);
                    let dataEstab = $scope.establecimientos.find(e => e.codEstab === dataPuntoEmision.codEstab);

                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegas = dataEstab.bodegas;

                    comprobante.idConsolidacionInventario = 0;
                    comprobante.fechaEmisionDocCreado = null;
                    comprobante.fechaEmision = new Date()
                    $scope.data = structuredClone(comprobante);
                    $scope.data.codEstab = dataPuntoEmision.codEstab;
                    $scope.dataClone.codEstab = $scope.data.codEstab;

                    const dataBodega = $scope.bodegas.find(b => b.defaultBodega);
                    if (dataBodega) {
                        $scope.data.idBodega = dataBodega.idBodega;
                        $scope.dataClone.idBodega = $scope.data.idBodega;
                    }
                    $scope.gridOptions.data = detalles;
                    setCountIndex();
                    $scope.onChangeTipoDocumento();
                }

                setColumnDefs();

            } catch (error) {
                console.log(error)
            }
        }

        function loadValidateDate() {
            const hoy = new Date();

            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            $scope.minFecha = `${yyyy}-${mm}-${dd}`;

            const fechaMax = new Date();
            fechaMax.setDate(fechaMax.getDate() + 30);
            const yyyyMax = fechaMax.getFullYear();
            const mmMax = String(fechaMax.getMonth() + 1).padStart(2, '0');
            const ddMax = String(fechaMax.getDate()).padStart(2, '0');
            $scope.maxFecha = `${yyyyMax}-${mmMax}-${ddMax}`;
        }

        function isValidDateRange(fecha) {
            if (!fecha) return false;
            const fechaSeleccionada = new Date(fecha);
            const minDate = new Date($scope.minFecha);
            const maxDate = new Date($scope.maxFecha);

            return fechaSeleccionada >= minDate && fechaSeleccionada <= maxDate;
        }

        function setDefaultTipoDoc() {
            let dataTipoDoc = $scope.tipoDocumento.find(t => t.codigo === 'CI')
            let dataMovimiento = $scope.tiposMovimiento.find(t => t.code === 'A')
            if (dataTipoDoc) {
                $scope.data.idTipoDocumento = dataTipoDoc.idTipoDocumento;
            }

            if (dataMovimiento) {
                $scope.data.idTipoMovimiento = dataMovimiento.id;
            }
            loadValidateDate();
        }

        function setColumnDefs() {
            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                            <a  ng-click="grid.appScope.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                            <a  ng-click="grid.appScope.openModalEditArticulo(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
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
            // {
            //     name: 'Iva',
            //     field: 'nombreTipoIva',
            //     allowCellFocus: false,
            //     enableCellEdit: false,
            //     width: '8%',
            //     minWidth: '100',
            //     type: 'string',
            //     enableColumnMenu: false,
            //     visible: true
            // },
            {
                name: 'Stock',
                field: 'stock',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '5%',
                minWidth: '65',
                type: 'number',
                enableColumnMenu: false,
                visible: false,
                aggregationType: uiGridConstants.aggregationTypes.sum,
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
                visible: false,
                aggregationType: uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo Unitario',
                field: 'precioUnitario',
                min: 0,
                type: 'number',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                width: '12%',
                minWidth: '100',
                aggregationType: uiGridConstants.aggregationTypes.sum,
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
                aggregationType: fS.roundNumber(uiGridConstants.aggregationTypes.sum, 2),
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
            setDataBodega();
        }

        function setDataBodega(isSetBodegaIdAll) {
            let index = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptions.columnDefs[index].editDropdownOptionsArray = $scope.bodegas;

            if (isSetBodegaIdAll) {
                for (let item of $scope.gridOptions.data) {
                    item.idBodega = $scope.data.idBodega;
                }
            }
        }

        //Importacion avanzada
        $scope.openModalAdvanced = function () {
            try {
                modalSvc.openModalCustom({
                    controller: advancedSearchCtrl,
                    template: URL_TEMPLATE + '_AdvancedSearch.cshtml',
                    size: 'xl',
                    params: {
                        idBodega: $scope.data.idBodega,
                        bodegas: $scope.bodegas
                    },
                    isRenderRazorPartial: true,
                    //windowClass: 'uibModalFullScreen'
                }).result.then((result) => {

                    if (result && Array.isArray(result.articlesSelected)) {
                        const {
                            articlesSelected,
                            opcion,
                            importedExcel
                        } = result;
                        for (const a of articlesSelected) {
                            if (!$scope.gridOptions.data.some(x => x.idArticulo == a.idArticulo)) {
                                let obj = structuredClone(a);
                                obj.precioUnitario = obj.precioUnitario;
                                obj.precioCosto = obj.precioCosto;
                                obj.precioCostoFraccionado = obj.precioCostoFraccionado;

                                if (!importedExcel) {
                                    obj.cantidad = opcion && opcion === 6 ? obj.cantidad : 1;
                                }
                                obj.idBodega = $scope.data.idBodega;
                                let total = obj.cantidad * obj.precioUnitario;
                                obj.total = fS.roundNumber(total, $scope.decimal.nroPrecio); //Total Precio Venta
                                $scope.gridOptions.data.push(obj)
                            }
                        }

                        setCountIndex();
                        setTotalDetalle();
                    }
                })

            } catch (error) {
                console.log(error)
            }
        }

        $scope.deleteRow = async (entity) => {
            let {
                isConfirmed
            } = await Swal.fire({
                html: `<small>Esta Ud. seguro/a de eliminar este Articulo <b>${entity.descripcion}</b></small>?`,
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: `Sí, eliminar!`,
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                let index = $scope.gridOptions.data.indexOf(entity);
                $scope.gridOptions.data.splice(index, 1);
                if (entity.idConsolidacionInventarioDetalle > 0) {
                    itemsDeleted.push({
                        ...entity,
                        estado: false
                    })
                }
                setTotalDetalle();
                setCountIndex();
                $scope.$apply();
            }
        }

        $scope.openModalEditArticulo = function (entity) {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )
            entity.isUpdate = true;
            let params = Object.assign(entity, { isUpdate: true })
            $scope.$broadcast("editArticulo", params);
        }

        $scope.onChangeEstablecimiento = async () => {
            try {
                const swalCustom = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })
                let {
                    isConfirmed
                } = await swalCustom.fire({
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
                    $scope.data.codEstab = $scope.dataClone.codEstab;;
                    $scope.$apply();
                    return
                }

                $scope.puntosEmision = []
                $scope.bodegas = []

                $scope.dataClone.codEstab = $scope.data.codEstab;
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
                    $scope.data.idBodega = $scope.bodegas.find(bodega => (bodega.defaultBodega)).idBodega;
                    $scope.dataClone.idBodega = $scope.data.idBodega;
                } else {
                    $scope.idBodega = 0;
                }

                setDataBodega(true);
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
                $scope.dataClone.idBodega = $scope.data.idBodega;
                setDataBodega(true);
                $scope.$apply()
            } else {
                $scope.data.idBodega = $scope.dataClone.idBodega;
                $scope.$apply()
            }
        }

        $scope.resetQuantityZero = function () {
            Swal.fire({
                text: "¿Estás seguro de cambiar la cantidad de los artículos en 0",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No'
            }).then(result => {
                if (result.isConfirmed) {
                    resetQuantityZero();
                }
            })
        }

        function resetQuantityZero() {

            for (let item of $scope.gridOptions.data) {
                item.cantidad = 0;
                setTotalColumn(item);
            }
            setTotalDetalle();
        }

        function addRow() {
            $scope.gridOptions.data.push({
                idConsolidacionInventarioDetalle: 0,
                num: 1,
                idArticulo: 0,
                codigo: null,
                descripcion: null,
                cantidad: 1,
                nombreTipoIva: null,
                stock: 0,
                medidas: [],
                precioCosto: 0,
                idBodega: 0,
                conversion: 0,
                nota: null,
                estado: true
            })
        }


        function setItem(entity, articulo, medidas) {

            const dataMedida = medidas.find(m => m.defaultMedida);

            entity.codigo = articulo.codigoArticulo;
            entity.idArticulo = articulo.idArticulo;
            entity.descripcion = articulo.descripcion;
            entity.porcentajeTipoIva = articulo.tarifa;
            entity.nombreTipoIva = articulo.tarifa;
            entity.stock = articulo.stock;
            entity.idBodega = $scope.data.idBodega;
            entity.llevaInventario = articulo.llevaInventario;

            entity.medidas = medidas; //Lista Medida
            entity.idMedida = dataMedida.idMedida; //Medida por defecto
            entity.conversion = dataMedida.conversion;
            entity.precioCosto = fS.roundNumber(dataMedida.precioCosto, $scope.decimal.nroPrecio)
            entity.precioUnitario = dataMedida.precioUnitario;
            entity.precioCostoFraccionado = dataMedida.precioCostoFraccionado;
            //  entity.precioUnitario = fS.roundNumber(dataMedida.precioUnitario, $scope.decimal.nroPrecio)

            entity.total = fS.roundNumber(entity.cantidad * dataMedida.precioUnitario, $scope.decimal.nroPrecio)


        }


        function setCountIndex() {
            $scope.gridOptions.data = $scope.gridOptions.data.map((item, index) => ({ ...item, num: index + 1 }))
        }

        function setTotalColumn(rowEntity) {
            let total = rowEntity.cantidad * rowEntity.precioUnitario;
            rowEntity.total = fS.roundNumber(total, $scope.decimal.nroPrecio); //Total Precio Venta
        }

        function setTotalDetalle() {
            let total = $scope.gridOptions.data.reduce((acc, curr) => acc + curr.total, 0);
            $scope.data.total = fS.roundNumber(total, 3)
        }

        function focusColumnaCantidad(index) {
            let indexColumn = $scope.gridOptions.columnDefs.findIndex(item => item.field === "cantidad");
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            );

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[index],
                    $scope.gridOptions.columnDefs[indexColumn]
                );
            }, 10)
        }

        $scope.setItemArticuloEnDetalle = async function (item) {
            try {

                const { articulo, medidas } = item;
                if (!articulo.llevaInventario) {
                    Swal.fire({
                        icon: 'warning',
                        html: 'Este articulo no esta configurado para llevar inventario'
                    })
                    return
                }
                let entity = {};
                let index = $scope.gridOptions.data.findIndex(item => item.idArticulo === articulo.idArticulo);
                if (index !== -1) {

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
                        entity = $scope.gridOptions.data[index];
                        entity.cantidad = entity.cantidad + 1;
                    }
                } else {
                    addRow();
                    index = $scope.gridOptions.data.findIndex(value => value.idArticulo === 0);
                    entity = $scope.gridOptions.data[index];
                    setItem(entity, articulo, medidas); // item row
                }


                setCountIndex();
                setTotalColumn(entity);
                setTotalDetalle();

                focusColumnaCantidad(index);

            } catch (error) {
                console.log(error)
            }
        }



        $scope.handleItemSelect = function (item) {
            console.log('handleItemSelect', item)
            itemSvc.getByIdForOrderProduction(item.menuId).then(response => {
                const { menu, components } = response;
                console.log('getByIdForOrderProduction', response)
                $scope.gridOptions.data.push(menu);

            }).catch(error => {
                console.log(error)
            })


        }

        const isUpdate = () => $scope.data.idConsolidacionInventario > 0;
        const isRegister = () => !($scope.data.idConsolidacionInventario > 0)

        const isValidForm = () => {
            if (!fS.isValidField($scope.data.codEstab)) {
                tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }
            if (!($scope.data.idPuntoEmision > 0)) {
                tS.toastr('warning', 'Seleccione el Punto de Emisión');
                return
            }

            if (!($scope.data.idTipoDocumento > 0)) {
                tS.toastr('warning', 'Seleccione el Tipo de Documento');
                return
            }

            if (!($scope.data.idTipoMovimiento > 0)) {
                tS.toastr('warning', 'Seleccione el Tipo de Movimiento');
                return
            }

            if (!(fS.isDateValid($scope.data.fechaEmision))) {
                tS.toastr('warning', 'Ingrese la Fecha de emisión');
                return
            }

            if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
                tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
                return
            }

            let ajusteFechaEmision = fS.ajustarFechaEmisionConsolidacion(isUpdate(), $scope.data.fechaEmision, $scope.data.fechaEmisionDocCreado);

            if (ajusteFechaEmision) {
                $scope.data.fechaEmision = ajusteFechaEmision;
            } else {
                console.log('Error al justar la fecha de Emisión')
                return
            }

            if (!isValidDateRange($scope.data.fechaEmision)) {
                tS.toastr('warning', `La fecha debe estar entre ${$scope.minFecha} y ${$scope.maxFecha}.`);
                return;
            }

            if ($scope.gridOptions.data.length === 0) {
                tS.toastr('warning', 'Ingrese al menos un articulo en el Detalle');
                return
            }
            if ($scope.gridOptions.data.some(i => !(i.idBodega > 0))) {
                tS.toastr('warning', 'Hay algunos ítems en el detalle que no tienen seleccionada la bodega.');
                return
            }
            return true;
        }
        $scope.onSave = async function () {
            try {
                if (!isValidForm()) return

                let documento;

                let serieComprobante = null, titleSwal = '', htmlSwal = '', confirmButtonText = '';

                let dataTipoDoc = $scope.tipoDocumento.find(t => t.idTipoDocumento === $scope.data.idTipoDocumento)

                if (dataTipoDoc) {
                    documento = dataTipoDoc.descripcion;
                }

                if (isRegister()) {

                    serieComprobante = await consolidacionInvSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    })

                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";
                    titleSwal = '<small>Guardar el documento <b>' + documento + '</b> </small>';
                    confirmButtonText = 'Guardar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;
                } else {
                    titleSwal = '<small>Actualizar el documento <b>' + documento + '</b> </small>';
                    confirmButtonText = 'Actualizar';
                    htmlSwal = `<small>Esta Ud. seguro de actualizar este Documento</small>?`;
                }


                let { isConfirmed } = await Swal.fire({
                    title: titleSwal,
                    html: htmlSwal,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText,
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (!isConfirmed) return


                const dataMapeado = consolidacionInvSvc.mapTo({
                    data: $scope.data,
                    detalles: $scope.gridOptions.data,
                    itemsDeleted
                })

                if (isUpdate()) {
                    consolidacionInvSvc.put($scope.data.idConsolidacionInventario, dataMapeado)
                        .then($scope.successResponse)
                        .catch(error => {
                            console.log(error);
                        })
                }

                if (isRegister()) {
                    consolidacionInvSvc.post(dataMapeado)
                        .then($scope.successResponse)
                        .catch(error => {
                            console.log(error);
                        })
                }

            } catch (error) {

                console.log(error)
            }
        }

        $scope.successResponse = function (response) {
            if (response.code === "0") {
                fS.sweetAlert('warning', response.message, response.titleSms);
            }
            if (response.code === "1") {
                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                $uibModalInstance.close(response)
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

    }

    /**
     * IMPORTACION AVANZADA
     *
     */

    //app.controller("advancedSearchCtrl", advancedSearchCtrl)
    advancedSearchCtrl.$inject = [
        "$scope",
        "$uibModalInstance",
        "toastService",
        "params"
    ]
    function advancedSearchCtrl($scope, $uibModalInstance, tS, params) {
        const { idBodega, bodegas } = params;

        $scope.mainForm = {
            idBodega: idBodega,
            descripcionBodega: bodegas.find(b => b.idBodega === idBodega).descripcion,
            selectedFile: []
        };



        $scope.catalogs = [
            { code: 1, description: 'Articulo' },
            { code: 3, description: 'Subfamilias' },
            { code: 4, description: 'Proveedor' },
            { code: 5, description: 'N° Documento' },
            { code: 6, description: 'Artículos Importados' },

        ]
        $scope.subfamilias = mainDataForm.subFamilias;
        $scope.articlesSelected = [];
        $scope.articlesFounded = [];

        $scope.mainForm.opcion = $scope.catalogs.find(x => x.code == '4').code;

        $scope.proveedor = {};
        $scope.articuloSearch = {

        }

        $scope.articulosNotFounded = [];
        let importedExcel = false;


        $scope.onChangeOption = onChangeOption;
        $scope.onKeyupProveedor = onKeyupProveedor;
        $scope.onSelectProveedor = onSelectProveedor;
        $scope.onKeyupArticle = onKeyupArticle;
        $scope.onSelectArticle = onSelectArticle;
        $scope.getArticles = getArticles;
        $scope.setArticlesSelected = setArticlesSelected;
        $scope.closeAdvancedSearch = closeAdvancedSearch;
        $scope.subirArchivo = subirArchivo;
        $scope.showArticuloNoVinculado = showArticuloNoVinculado;

        function onChangeOption() {
            $scope.mainForm.rucProveedor = null;
            $scope.mainForm.idArticulo = 0;
            if ($scope.mainForm.opcion === 6) {
                $scope.getArticles();
            }
        }

        function onKeyupProveedor() {
            if (!$scope.proveedor.nombreProveedor) {
                $scope.mainForm.rucProveedor = null;
            }
        }
        function onSelectProveedor(item) {
            $scope.mainForm.rucProveedor = item.numeroIdentificacion
            $scope.getArticles()
        }

        function onKeyupArticle() {
            if ($scope.articuloSearch.nombreArticulo) {
                $scope.mainForm.idArticulo = 0;
            }
        }
        function onSelectArticle(item) {
            $scope.mainForm.idArticulo = item.idArticulo
            $scope.getArticles()
        }


        //importacion archivo
        function subirArchivo() {
            let formatFile = [{
                "name": "jayanth",
                "data": "scd",
                "abc": "sdef"
            }]
            $scope.articulosNotFounded = [];


            let { files } = document.getElementById('selectedFile');

            if (files.length === 0) {
                tS.toastr({
                    type: 'warning',
                    message: 'Seleccione el archivo de tipo formato excel'
                })
                return
            }

            try {
                XLSX.utils.json_to_sheet(formatFile, 'out.xlsx');
                let fileReader = new FileReader();
                fileReader.readAsBinaryString(files[0]);

                fileReader.onload = (event) => {
                    let data = event.target.result;
                    let workbook = XLSX.read(data, { type: "binary", cellDates: true });


                    workbook.SheetNames.forEach(async sheetName => {

                        let product = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                        getProductsValidateImport({
                            product
                        })

                    })

                }

            } catch (error) {
                console.log(error)
            }

        }

        function getProductsValidateImport(obj) {

            consolidacionInvSvc.getProductsValidateImport(obj).then(response => {
                $scope.articlesFounded = response.articulos;
                $scope.articulosNotFounded = response.noVinculados;
                importedExcel = true;
            })
        }

        function showArticuloNoVinculado() {
            let html = `<div class="table-responsive" style="max-height: 400px;">
                    <table class="table table-hover table-bordered table-sm">
                        <thead>
                            <tr>
                                <th><small>N°</small></th>
                                <th><small>Código</small></th>
                                <th><small>Cantidad</small></th>
                            </tr>
                        </thead>
                        <tbody>`;

            let index = 1;
            for (let item of $scope.articulosNotFounded) {
                html += ` <tr>
                        <td>${index++}</td>
                        <td>${item.codigo}</td>
                        <td>${item.cantidad}</td>
                    </tr>
                `
            }
            html += '</tbody></table></div>'
            Swal.fire({
                title: '<small>Artículo No Vinculados</small>',
                icon: 'info',
                html,
                width: 700
            })

        }

        function getArticles() {
            try {

                $scope.articulosNotFounded = [];
                importedExcel = false;


                let dataSearch = {
                    idArticulo: fS.isValidField($scope.mainForm.idArticulo),
                    rucProveedor: fS.isValidField($scope.mainForm.rucProveedor),
                    opcion: $scope.mainForm.opcion,
                    idFamilia: fS.isValidField($scope.mainForm.idFamilia),
                    idSubFamilia: fS.isValidField($scope.mainForm.idSubFamilia),
                    nroDocumento: fS.isValidField($scope.mainForm.nroDocumento),
                    idBodega: $scope.mainForm.opcion === 6 ? $scope.mainForm.idBodega : null
                }

                consolidacionInvSvc.getProducts(dataSearch).then(response => {
                    $scope.articlesFounded = response.articulos;
                    if ($scope.articlesFounded.length > 50) {
                        // Swal.fire({ title: "Aviso", text: "Le recomendamos realizar consolidaciones por cada 50 articulos", icon: "info" })
                    }
                })
            } catch (error) {

                console.log(error)
            }
        }

        function setArticlesSelected() {
            $uibModalInstance.close({
                articlesSelected: $scope.articlesSelected,
                opcion: $scope.mainForm.opcion,
                importedExcel
            })
        }

        function closeAdvancedSearch() {
            $uibModalInstance.close()
        }
    }

})(window.angular)
