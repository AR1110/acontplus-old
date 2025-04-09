
(function () {


    'use strict';

    const PATH_HTML = 'Pages/TransferenciaBodega/'

    let transBodegaSvc = {};
    let commonSvc = {};
    let fS = {};
    let tS = {};
    let mainDataForm = {};


    app.controller('transferenciaBodegaCtrl', transferenciaBodegaCtrl);

    transferenciaBodegaCtrl.$inject = ['$scope', '$injector', '$filter', 'modalService', 'nombreModalInventario'];

    function transferenciaBodegaCtrl($scope, $injector, $filter, modalSvc, nombreModalInventario) {

        transBodegaSvc = $injector.get('transferenciaBodegaService');
        commonSvc = $injector.get('commonService');
        fS = $injector.get('formulario');
        tS = $injector.get('toastService');

        $scope.transferenciasBodegas = [];
        $scope.puntosEmision = [];
        let tempTransferenciasBodegas = [];

        $scope.recordsQuantity = [25, 50, 75, 100];

        $scope.dataSearch = {
            ckFecha: true,
            pageIndex: 1,
            pageSize: 25,
            totalRecords: 0,
            maxSize: 5
        }

        $scope.openModalNew = function () {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: 'ModalTransferenciaBodegaCtrl',
                    template: PATH_HTML + 'Shared/_ModalTransferenciaBodega.cshtml',
                    isRenderRazorPartial: true,
                    size: 'xl',
                    params: {}
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        getList()
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }

        $scope.refresh = function(){
            getList()
        }

        $scope.resultDateRange = function (item) {
            $scope.dataSearch.checkBoxFecha = true;
            $scope.dataSearch.startDate = item.startDate;
            $scope.dataSearch.endDate = item.endDate;

            getList()
        }

         function getList () {

            try {

                if ( $scope.dataSearch.nroSecuencial) {
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


                let query = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    ckFecha: $scope.dataSearch.ckFecha,
                    startDate: fS.formatDateMoment($scope.dataSearch.startDate),
                    endDate: fS.formatDateMoment($scope.dataSearch.endDate),
                    nroSecuencial: fS.validAndFormatedRangeSequential(
                        $scope.dataSearch.nroSecuencial
                    ),
                    textSearch: fS.isValidField($scope.dataSearch.textSearch)
                }
                $scope.transferenciasBodegas = [];
                showLoader();

                transBodegaSvc.getAll(query).then(response => {
                    $scope.transferenciasBodegas = response;
                    tempTransferenciasBodegas = structuredClone($scope.transferenciasBodegas);

                    if ($scope.transferenciasBodegas.length > 0) {
                        $scope.dataSearch.totalRecords = $scope.transferenciasBodegas[0].totalRecords;
                    } else {
                        $scope.dataSearch.totalRecords = 0;
                    }
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader());

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        initiload();
        function initiload() {
            try {
                showLoader();
                transBodegaSvc.getDataFilter().then(response => {
                    $scope.establecimientos = response.estabs;
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                        $scope.dataSearch.codEstab = dataEstab.codEstab;

                        $scope.puntosEmision = dataEstab.puntosEmision;
                        const dataPuntoEmision = $scope.puntosEmision.find(item => item.defaultPtoEmi);
                        if (dataPuntoEmision) {
                            $scope.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                        }
                        getList()
                    }
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
                transBodegaSvc.getDataForm().then(response => {
                    mainDataForm = response;
                })


            } catch (error) {
                console.log(error)
            }
        }

        $scope.pagechanged = function () {
            getList()
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            getList()
        };


        $scope.getFilterTransferencia = () => {
            let transferencias = JSON.parse(JSON.stringify(tempTransferenciasBodegas))
            $scope.transferenciasBodegas = $filter("filter")(transferencias, $scope.dataSearch.bySearch);
        }


        $scope.openModalEditar = async (item) => {
            try {
                showLoader();

                transBodegaSvc.getId(item.idTransferenciaBodega).then(response => {
                    let modalRef = modalSvc.openModalCustom({
                        controller: 'ModalTransferenciaBodegaCtrl',
                        template: PATH_HTML + 'Shared/_ModalTransferenciaBodega.cshtml',
                        isRenderRazorPartial: true,
                        size: 'xl',
                        params: {
                            data: response,
                        }
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            getList()
                        }
                    })
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())

            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.openModalDetalle = async (item) => {
            try {
                showLoader(); 
                let fileCtrl = nombreModalInventario.TRANSFERENCIA_BODEGA.fileCtrl;
                let ctrl = nombreModalInventario.TRANSFERENCIA_BODEGA.controllers['D'];
                let template = nombreModalInventario.TRANSFERENCIA_BODEGA.templates['D'];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.open({
                    controller,
                    template,
                    isRenderRazorPartial: true,
                    size: 'xl',
                    params: {
                        id: item.idTransferenciaBodega 
                    }
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        getList()
                    }
                })

               
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }


        $scope.askToDelete = async (item) => {

            let { isConfirmed } = await Swal.fire({
                title: '<small>Anular Transferencia?</small>',
                html: `<small>Esta Ud. seguro de eliminar esta Transferencia <b>N° ${item.nroDoc}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar'
            })

            if (isConfirmed) {
                showLoader();
                transBodegaSvc.anular(item.idTransferenciaBodega).then(response => {
                    hideLoader()
                    if (response.code === "0") {
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {

                        fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        getList()
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }
        }



        //Reporte 
        $scope.getReport = function (item) {

            let format = 'pdf';
            let dataParms = {
                id: item.idTransferenciaBodega
            }

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: 'RTB',
                    codEstab: item.codEstab,
                    format,
                    aditionalParams: [

                    ]
                }),
                dataParams: JSON.stringify(dataParms)
            }

            commonSvc.getReport({
                parameters,
                formatType: format
            })
        }


    }




    app.controller('ModalTransferenciaBodegaCtrl', ModalTransferenciaBodegaCtrl);

    ModalTransferenciaBodegaCtrl.$inject = [
        "$scope", 
        "$timeout", 
        "$uibModalInstance",
        '$injector',
        "params"
    ];

    function ModalTransferenciaBodegaCtrl($scope, $timeout, $uibModalInstance, $injector,   params) {

        const articuloSvc = $injector.get('articuloService');
        const modalSvc = $injector.get('modalService');

        let { data } = params;

        $scope.tipoDoc = {
            codigo: 'C'
        }
        $scope.data = {
            fechaEmision: new Date()
        };

        $scope.puntosEmision = [];
        $scope.tiposTransaccion = [];
        $scope.tipoDocumento = [];

        let subFamilias = [];

        let itemsDeleted = [];

        $scope.gridOptions = {
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }

        $scope.openModalAdvancedSearch = openModalAdvancedSearch;


        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.getList();
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
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida == oldValue) return
                if (colDef.field === "cantidad" && rowEntity.cantidad == oldValue) return

               

                //Verificacion del stock
                if (["idMedida", "cantidad"].includes(colDef.field)) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }

                $scope.setTotal(rowEntity);


            })
        }

        /**
         * Comprueba la notificación de stock al modificar un campo en una fila de la cuadrícula.
         * @param {string} field - Campo modificado.
         * @param {*} rowEntity - Objeto de fila actual.
         * @param {*} oldValue - Valor anterior del campo modificado.
         */
        function checkNotificationStock(field, rowEntity, oldValue) {
            try {
                rowEntity.idBodega = $scope.data.idBodegaOrigen;

                // Clona el objeto de la fila y la lista de artículos para evitar modificaciones directas.
                let rowItemClone = structuredClone(rowEntity);
                let gridOptionsClone = structuredClone($scope.gridOptions.data);

                // Realiza la fusión de elementos en la lista de artículos clonada.
                let dataItemMerge = fS.mergeItemStock(gridOptionsClone, rowItemClone);

                // Si la cantidad no ha cambiado, no realizar más acciones.
                if (dataItemMerge.cantidad == oldValue) return;

 
                showLoader();

                articuloSvc.checkNotificationStock({
                    idArticulo: rowEntity.idArticulo,
                    cantidad: dataItemMerge.cantidadStock,
                    idBodega: rowEntity.idBodega,
                    idMedida: rowEntity.idMedida
                }).then(async responseApi => {
                    // Oculta el indicador de carga después de recibir la respuesta del servicio.
                    hideLoader();

                    let { code, message, titleSms } = responseApi;

                    // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
                    if (code === "1") {
                        if (field === "idMedida" && rowEntity.idMedida !== oldValue) {
                            let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);
                            rowEntity.precioCosto = dataMedida.precioCosto;
                            rowEntity.precioUnitario = dataMedida.precioUnitario;
                            rowEntity.conversion = dataMedida.conversion;
                        }
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
                            rowEntity[field] = oldValue;
                            $scope.setTotal(rowEntity);
                            $("#custom-template-md-autocomplete-articulo").focus();
                        }
                        if (code === "2") {
                            // Si el código es "2", solo realiza cálculos totales.
                            $scope.setTotal(rowEntity);
                        }
                    }
                }).catch(error => {
                    // Maneja errores en la llamada al servicio.
                    hideLoader();
                    console.log(error);
                });
            } catch (error) {
                // Maneja errores generales en el bloque try-catch.
                hideLoader();
                console.log(error);
            }
        }

        $scope.setFocusArticulo = function () {
            setTimeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
        }

        //Set Total Row 
        $scope.setTotal = function (rowEntity) {
            let total = rowEntity.cantidad * rowEntity.precioUnitario;
            rowEntity.total = fS.roundNumber(total, 5); //Total Precio Venta
        }


        $scope.gridOptions.columnDefs = [
            {
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                        <button type="button"  ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></button>
                        <button type="button"  ng-click="grid.appScope.abrirModalArticulo(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></button >
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
                name: 'idArticulo',
                field: 'idArticulo',
                type: 'number',
                width: '10%',
                minWidth: '100',
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                allowCellFocus: false,
                visible: false
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
                width: '39%',
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
            // { 
            //     name: 'codigoTipoIva', field: 'codigoTipoIva', allowCellFocus: false, type:'string',
            //     enableCellEdit: false, width: '8%', minWidth:'100', enableColumnMenu: false, visible: false
            // },
            // { 
            //     name: 'Iva', field: 'nombreTipoIva', allowCellFocus: false, 
            //     enableCellEdit: false, width: '8%', minWidth:'100', type:'string',
            //     enableColumnMenu: false, visible: true 
            // },
            // { 
            //     name: 'Stock', field: 'stock', allowCellFocus: false, 
            //     enableCellEdit: false, width: '5%', minWidth:'65', type:'number',
            //     enableColumnMenu: false, visible: true,  aggregationType: uiGridConstants.aggregationTypes.sum,customTreeAggregationFinalizerFn: function (aggregation) {
            //         aggregation.rendered = form.roundNumber(aggregation.value,2)
            //      }, aggregationLabel: "$",  
            // },
            {
                name: 'P. Costo Unitario',
                field: 'precioUnitario',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '9%',
                minWidth: '100',
                // aggregationType: uiGridConstants.aggregationTypes.sum,
                // footerCellFilter: 'number:2',
                // cellFilter: "currency:'$'",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                // aggregationType: form.roundNumber(uiGridConstants.aggregationTypes.sum, 2),
                // customTreeAggregationFinalizerFn: function (aggregation) {
                //     aggregation.rendered = form.roundNumber(aggregation.value, 2)
                // },
                // aggregationLabel: "$",
            }
        ]


        initiload();
        async function initiload() {
            try {

                $scope.establecimientosOrigen = structuredClone(mainDataForm.estabs);
                $scope.establecimientosDestino = structuredClone(mainDataForm.estabs);
                $scope.tiposTransaccion = mainDataForm.tiposTransaccion;
                $scope.tipoDocumento = mainDataForm.tipoDocumento;

                subFamilias = mainDataForm.subFamilias;

                if ($scope.establecimientosOrigen.length === 0) {
                    tS.toastr('info', 'No tienes asignado ningún Establecimiento');
                    return
                }

                if (typeof data == 'object' && data.comprobante && data.comprobante.idTransferenciaBodega > 0) {
                    let { comprobante, detalles } = params.data;

                    let dataEstabOrigen = $scope.establecimientosOrigen
                        .filter((es) => es.puntosEmision.some((pp) => pp.idPuntoEmision === comprobante.idPuntoEmision))
                        .reduce((acc, curr) => {
                            return curr;
                        }, {});
                    let dataEstabDestino = $scope.establecimientosOrigen
                        .filter((es) => es.bodegas.some((pp) => pp.idBodega === comprobante.idBodegaDestino))
                        .reduce((acc, curr) => {
                            return curr
                        }, {});

                    $scope.data = comprobante;

                    $scope.data.codEstabOrigen = dataEstabOrigen.codEstab;
                    $scope.data.codEstabDestino = dataEstabDestino.codEstab;

                    //Punto de Emision
                    $scope.puntosEmision = dataEstabOrigen.puntosEmision;

                    //Bodega Origen 
                    $scope.bodegasOrigen = dataEstabOrigen.bodegas;


                    //Bodega Destino 
                    $scope.bodegasDestino = dataEstabDestino.bodegas;
                    $scope.gridOptions.data = detalles; 
                    enumGridOptions();
                    $scope.tituloModal = 'Editar';
                    $scope.btnText = 'Actualizar';
                    $scope.iconModal = 'ti-pencil';
                } else {
                    $scope.tituloModal = 'Nueva';
                    $scope.btnText = 'Guardar';
                    $scope.iconModal = 'ti-save';
                    const dataEstab = $scope.establecimientosOrigen.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegasOrigen = dataEstab.bodegas;
                    //Codigo Establecimiento 
                    $scope.data.codEstabOrigen = dataEstab.codEstab;
                    $scope.cloneCodEstabOrigen = dataEstab.codEstab;

                    if ($scope.puntosEmision.length > 0) {
                        $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                    } else {
                        tS.toastr('warning', 'No tienes Puntos de Emisión asignadas!')
                    }
                    if ($scope.bodegasOrigen.length > 0) {
                        $scope.data.idBodegaOrigen = $scope.bodegasOrigen.find(bodega => (bodega.defaultBodega)).idBodega;
                    } else {
                        tS.toastr('info', 'No tienes asignado ninguna Bodega');
                    }
                }

            } catch (error) {
                console.log(error)
            }

        }


        $scope.onChangeEstablecimientoOrigen = async function () {
            try {

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
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

                if (isConfirmed) {
                    let dataEstab = $scope.establecimientosOrigen.find(estab => estab.codEstab === $scope.data.codEstabOrigen);

                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegasOrigen = dataEstab.bodegas;
                    //Codigo Establecimiento 
                    $scope.data.codEstabOrigen = dataEstab.codEstab;
                    $scope.cloneCodEstabOrigen = dataEstab.codEstab;

                    if ($scope.puntosEmision.length > 0) {
                        $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                    } else {
                        tS.toastr('warning', 'No tienes Puntos de Emisión asignadas!')
                    }
                    if ($scope.bodegasOrigen.length > 0) {
                        $scope.data.idBodegaOrigen = $scope.bodegasOrigen.find(bodega => (bodega.defaultBodega)).idBodega;
                    } else {
                        tS.toastr('info', 'No tienes asignado ninguna Bodega');
                    }
                    $scope.data.codEstabDestino = null;
                    $scope.data.idBodegaDestino = 0;
                    for(let item of $scope.gridOptions.data){
                        item.cantidad = 0;
                    }
                    $scope.$apply();
                } else {
                    $scope.data.codEstabOrigen = $scope.cloneCodEstabOrigen;
                    $scope.$apply();
                }


            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.onChangeEstablecimientoDestino = async function () {
            try {
                let dataEstab = $scope.establecimientosDestino.find(item => item.codEstab === $scope.data.codEstabDestino);
                $scope.bodegasDestino = dataEstab.bodegas;
                $scope.data.idBodegaDestino = 0;
                if ($scope.bodegasDestino.length === 0) {
                    tS.toastr('warning', 'No tienes asignado ninguna bodega');
                }

            } catch (error) {
                console.trace(error)
            }
        }

        $scope.onChangeBodegaDestino = function () {
            if ($scope.data.idBodegaOrigen === $scope.data.idBodegaDestino) {
                tS.toastr('warning', 'No puedes transferir los productos a la misma bodega!');
                $scope.data.idBodegaDestino = 0;
            }
        }

        $scope.abrirModalArticulo = function (item) {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )
            $scope.$broadcast("editArticulo", item)
        }

        $scope.setItemArticuloEnDetalle = function (item) {
            try {
                if (!item.articulo.llevaInventario) {
                    Swal.fire({
                        icon: 'warning',
                        html: 'Solo puedes transferir el artículo de tipo servicio'
                    })
                    return
                }
                const { articulo, medidas } = item;

                let entity = {};

                $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === articulo.idArticulo);

                if ($scope.indexRow !== -1) {
                    entity = $scope.gridOptions.data[$scope.indexRow];
                    entity.cantidad = entity.cantidad + 1;

                    $scope.setTotal(entity)

                } else {

                    addRow();

                    $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === 0);
                    entity = $scope.gridOptions.data[$scope.indexRow];
                }

                $scope.addItem(entity, articulo, medidas); // item row
                enumGridOptions();
                focusColumnaCantidad();

            } catch (error) {
                console.log(error)
            }
        }

        function openModalAdvancedSearch(){ 

            let modalRef = modalSvc.openWithComponent({
                 component: 'transferenciaBodegaAdvancedSearch',
                 size: 'xl',
                 params: {
                    bodegasOrigen: structuredClone($scope.bodegasOrigen),
                    bodegaOrigenId: $scope.data.idBodegaOrigen,
                    subFamilias: structuredClone(subFamilias)
                 }
            })

            modalRef.result.then(response=>{ 
                if(response && response.articlesSelected         ){
                    const merge = [...$scope.gridOptions.data, ...response.articlesSelected ].reduce((acc, item) => {
                        acc[item.idArticulo] = item;
                        return acc;
                      }, {});
                      
                      // Convertir el objeto de vuelta a un array
                      const listaUnida = Object.values(merge);
                      $scope.gridOptions.data = structuredClone(listaUnida)

                } 


            }) 
        }

        function addRow() {
            $scope.gridOptions.data.push({
                idTransferenciaBodegaDetalle: 0,
                num: 1,
                idArticulo: 0,
                codigo: "",
                descripcion: "",
                cantidad: 1,
                medidas: [],
                stock: 0,
                precioCosto: 0,
                precioUnitario: 0,
                total: 0,
                estado: true,
                conversion: 1,
            });
        }

        $scope.addItem = function (entity, item, medidas) {
            
            let dataMedida = medidas.find(m=>m.defaultMedida);

            entity.codigo = item.codigoArticulo;
            entity.idArticulo = item.idArticulo;
            entity.descripcion = item.descripcion;
            entity.stock = item.stock;
            entity.precioActual = dataMedida.precioCostoFraccionado;
            entity.total = dataMedida.precioCosto;
            entity.llevaInventario = item.llevaInventario;
            entity.medidas = medidas; //Lista Medida 
            entity.idMedida = dataMedida.idMedida; //Medida por defecto    
            entity.conversion = dataMedida.conversion;
            entity.precioCosto = dataMedida.precioCosto;
            entity.precioUnitario = dataMedida.precioUnitario;
            entity.precioCostoFraccionado = dataMedida.precioCostoFraccionado;
        }


        function enumGridOptions() {
            let num = 1;

            for (let item of $scope.gridOptions.data) {
                item.num = num++;
            }
        }

        function focusColumnaCantidad() {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[$scope.indexRow],
                    $scope.gridOptions.columnDefs[5]
                );
            }, 10)
        }


        $scope.deleteRow = async function (row) {
            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                title: 'Eliminar Articulo',
                html: `<small>Esta seguro de eliminar este articulo ${row.entity.descripcion}</small>`,
                showConfirmButton: true,
                showDenyButton: true,
                allowOutsideClick: false,
                confirmButtonText: 'Si, eliminar',
                denyButtonText: 'No, cancelar'
            })

            if (isConfirmed) {
                let index = $scope.gridOptions.data.indexOf(row.entity);
                $scope.gridOptions.data.splice(index, 1);

                if (row.entity.idTransferenciaBodegaDetalle > 0) {
                    itemsDeleted.push({
                        ...row.entity,
                        estado: false
                    })
                }
                $scope.$apply()
            }
        }


        function isUpdate() {
            return $scope.data.idTransferenciaBodega > 0
        }
        function isRegister() {
            return !($scope.data.idTransferenciaBodega > 0)
        }



        $scope.onSave = async function () {
            try {
                if (!$scope.data.codEstabOrigen) {
                    tS.toastr('warning', 'Seleccione Establecimiento Origen');
                    return
                }

                if (!($scope.data.idBodegaOrigen > 0)) {
                    tS.toastr('warning', 'Seleccione la Bodega Origen');
                    return
                }

                if (!($scope.data.idBodegaDestino > 0)) {
                    tS.toastr('warning', 'Seleccione la Bodega Destino');
                    return
                }
                if ($scope.data.idBodegaOrigen === $scope.data.idBodegaDestino) {
                    tS.toastr('warning', 'No puedes transferir los productos a la misma bodega!');
                    return
                }

                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.toastr('warning', 'Seleccione el Punto de Emisión');
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

                let ajusteFechaEmision = fS.ajustarFechaEmision(isUpdate(), $scope.data.fechaEmision, $scope.data.fechaEmisionDocCreado);

                if (ajusteFechaEmision) {
                    $scope.data.fechaEmision = ajusteFechaEmision;
                } else {
                    console.log('Error al justar la fecha de Emisión')
                    return
                }


                if ($scope.gridOptions.data.length === 0) {
                    tS.toastr('warning', 'Ingrese al menos un articulo en el Detalle');
                    return
                }

                if ($scope.gridOptions.data.length > 200) {
                    tS.toastr('warning', 'Límite máximo de items es 200');
                    return
                }

                let serieComprobante = null, titleSwal = '', htmlSwal = '', confirmButtonText = '';

                if (isRegister()) {
                    showLoader();
                    serieComprobante = await transBodegaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    })
                    hideLoader();
                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";
                    titleSwal = '<small>Guardar Transferencia Bodega</small>';
                    confirmButtonText = 'Guardar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;
                } else {
                    serieComprobante = $scope.data.serieComprobante;
                    titleSwal = '<small>Actualizar Transferencia Bodega</small>';
                    confirmButtonText = 'Actualizar';
                    htmlSwal = `<small>Esta Ud. seguro de actualizar este Documento</small>?`;
                }

                const customSwal = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let { isConfirmed } = await customSwal.fire({
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

                const dataMapeado = transBodegaSvc.mapTo({
                    data: $scope.data,
                    detalles: $scope.gridOptions.data,
                    tiposTransaccion: $scope.tiposTransaccion,
                    tipoDocumento : $scope.tipoDocumento,
                    itemsDeleted
                })
                showLoader();
                if (isUpdate()) {
                    transBodegaSvc.update($scope.data.idTransferenciaBodega, dataMapeado)
                        .then($scope.successResponse)
                        .catch(error => {
                            console.log(error);
                        }).finally(() => hideLoader())
                }

                if (isRegister()) {
                    transBodegaSvc.insert(dataMapeado)
                        .then($scope.successResponse)
                        .catch(error => {
                            console.log(error);
                        }).finally(() => hideLoader())
                }
            } catch (error) {
                hideLoader();
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




})(window.angular)