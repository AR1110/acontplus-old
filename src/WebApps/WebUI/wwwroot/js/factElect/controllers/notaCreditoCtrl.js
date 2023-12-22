(() => {

    'use strict';

    //Variables Constantes
    const URL_TEMPLATE = '~/Pages/NotaCredito/'

    //Variable servicios 
    let notaCreditoSvc = {};
    let commonSvc = {};
    let modalSvc = {};
    let fS = {};
    let tS = {};
    let clienteSvc = {};

    let mainDataForm = {};
    let tipoDoc = {}

    //main Controller Ctrl
    app.controller('notaCreditoClienteCtrl', notaCreditoClienteCtrl);

    notaCreditoClienteCtrl.$inject = [
        '$scope',
        '$injector',
        'decodeToken'
    ]

    function notaCreditoClienteCtrl($scope, $injector, decodeToken) {

        notaCreditoSvc = $injector.get('notaCreditoService');
        commonSvc = $injector.get('commonService');
        modalSvc = $injector.get('modalService');
        fS = $injector.get('formulario');
        tS = $injector.get('toastService');
        clienteSvc = $injector.get('clienteService');
        const nombreModalVenta = $injector.get('nombreModalVenta');
        const CODE_REPORT = $injector.get('CODE_REPORT');
        const DOC_TYPE = $injector.get('DOC_TYPE');
        tipoDoc = {
            codigo: DOC_TYPE.NC
        }
        // const nombreModalFactElect = $injector.get("nombreModalFactElect"); 

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000,
            checkBoxFecha: true
        }

        $scope.cliente = {

        }
        let idUsuarioRol = Number(decodeToken.idUsuarioRol)

        //---------------------------------Busqueda Avanzada ----------------------------------
        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getNotaCreditos();
        }

        $scope.onKeyupCliente = function () {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.idCliente = 0;
                $scope.dataSearch.checkBoxFecha = true;
            }
        }

        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.idCliente = item.idCliente;
            $scope.dataSearch.checkBoxFecha = true;
            $scope.getNotaCreditos();
        }

        $scope.usuarioSearch = function (textSearch) {
            try {
                let query = {
                    idRol: idUsuarioRol,
                    busqueda: textSearch
                }

                if (query.busqueda.length > 2) {
                    return commonSvc.usuarioSearch(query)
                        .catch(error => {
                            console.log(error);
                            throw error;
                        })
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onKeyupUsuarioSearch = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.searchFilterLocal = function () {
            let notaCreditos = JSON.parse(JSON.stringify($scope.cloneNotaCreditos));
            $scope.notaCreditos = $filter("filter")(notaCreditos, $scope.dataSearch.bySearch);
            // $scope.calculoColumnTotal();
        }

        //=====================Eend Filters======================= 
        $scope.getNotaCreditos = function () {
            try {
                if ($scope.dataSearch.nroSecuencial) {
                    if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
                        $scope.dataSearch.checkBoxFecha = true;
                        tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                        return
                    }
                    if (!($scope.dataSearch.idCliente > 0)) {
                        $scope.dataSearch.checkBoxFecha = false;
                    }
                }

                showLoader();
                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    byUsuario: $scope.dataSearch.byUsuario,
                    idEstadoDocumento: $scope.dataSearch.idEstadoDocumento,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                }
                $scope.notaCreditos = [];
                notaCreditoSvc.getAll(dataSearch).then(response => {
                    $scope.notaCreditos = response || [];
                    $scope.cloneNotaCreditos = JSON.parse(JSON.stringify($scope.notaCreditos))
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)

            }
        }

        $scope.initiload = () => {

            showLoader();
            notaCreditoSvc.get({ tipo: 3 }).then(response => {
                hideLoader();
                $scope.establecimientos = response.estabs;
                $scope.estadoDocumentos = response.estadosDoc;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getNotaCreditos();
                }else{
                    tS.toastr('warning', 'No tienes asignado Establecimiento!')
                }
            }).catch(() => {
                hideLoader();
            })

            notaCreditoSvc.getDataForm().then(response => {
                mainDataForm = response;
            })

        }
        $scope.initiload();

        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
            $scope.getNotaCreditos();
        }

        $scope.openModalParam = ({ controller, template, size = 'xl', params }) => {
            modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                windowClass: 'uibModalFullScreen',
                isRenderRazorPartial: true
            }).result.then(result => {

                if (typeof result === 'object') {
                    $scope.getNotaCreditos();
                }
            })
        }


        $scope.openModalNew = async () => {
            $scope.openModalParam({
                controller: 'modalNotaCreditoCtrl',
                template: URL_TEMPLATE + '_ModalNuevo.cshtml',
                params: {}
            })
        }


        $scope.openModalDetalle = async (params) => {
            try {

                let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
                let ctrl = (await import(fileCtrl))[controller];
                let template = templates['NC_SRI'];
                modalSvc.openModalCustom({
                    controller: ctrl,
                    template: template,
                    size: 'xl',
                    params: {
                        codDoc: params.codDoc,
                        id: params.idDocumento
                    },
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.openModalEditar = async (item) => {
            try {
                showLoader();
                notaCreditoSvc.getId(item.idDocumento).then(response => {
                    $scope.openModalParam({
                        controller: 'modalNotaCreditoCtrl',
                        template: URL_TEMPLATE + '_ModalEditar.cshtml',
                        params: response
                    })
                }).finally(() => hideLoader())

            } catch (error) {
                console.log(error)
            }
        }

        $scope.askToDelete = async (item) => {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: '¿Está seguro de anular este comprobante?',
                    html: `<small>Asegurese de haber dado de baja este comprobante en el portal del SRI</small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    showLoader();
                    notaCreditoSvc.delete(item.idNotaCredito).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code == "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.getNotaCreditos();
                        }
                    }).finally(() => hideLoader())
                }
            } catch (error) {
                console.log(error)
            }

        }


        $scope.getReport = (item) => {
            try {
                let format = 'pdf';
                const parameters = {
                    dataParams: JSON.stringify({
                        id: item.idNotaCredito,
                        normalMethod: true,
                    }),
                    reportParams: JSON.stringify({
                        codEstab: item.codEstab,
                        codigo: CODE_REPORT.RNC,
                        format,
                    }),
                    hasService: true,
                }

                commonSvc.getReport({ parameters, format })
            } catch (error) {
                console.log(error)
            }
        }
    }

    app.controller('modalNotaCreditoCtrl', modalNotaCreditoCtrl);

    modalNotaCreditoCtrl.$inject = [
        '$scope',
        '$timeout',
        '$injector',
        '$uibModalInstance',
        'facturaService',
        'params'
    ];

    function modalNotaCreditoCtrl($scope, $timeout, $injector, $uibModalInstance, facturaSvc, params) {
        let gridOptionsSvc = $injector.get('gridOptionsService');
        let DOC_TYPE = $injector.get('DOC_TYPE');
        let nombreModalVenta = $injector.get('nombreModalVenta');

        let { estabs, decimal, tarifasImpuesto, tarifas, config, vendedores, permisoVenta } = mainDataForm;

        $scope.infoAdicionalDocumento = [];

        $scope.establecimientos = estabs;
        $scope.decimal = decimal;
        $scope.tarifasImpuesto = tarifasImpuesto;
        $scope.tarifas = tarifas;
        $scope.config = config;
        $scope.vendedores = vendedores;
        $scope.permisoComprobanteVenta = permisoVenta.comprobante;

        $scope.clienteSearch = {};
        $scope.cliente = {};

        $scope.tipoDoc = tipoDoc
        $scope.dataArticulo = {};



        //let formattedDateTime = moment(new Date()).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss");        
        $scope.data = {
            fechaEmision: new Date()
        };
        $scope.dataClone = {};

        $scope.data.totalIce = 0;
        $scope.data.irbpnr = 0;
        $scope.data.propina = 0;

        $scope.data.porcentajeDescuento = 0;
        $scope.data.transporte = 0;
        $scope.data.recargo = 0;
        $scope.data.subTotalSinImpuestos = 0;
        $scope.data.iva = 0;
        $scope.data.totalDescuento = 0;
        $scope.data.total = 0;


        //Factura 
        $scope.facturas = [];
        $scope.factura = {};
        $scope.textSearchFactura = ''

        function setFocusArticulo() {
            setTimeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
        }

        const detallesDeleted = [];
        //GridOptions Invoice 
        $scope.gridOptions = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
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
                    setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }


                //Validacion de numeros negativos
                if (['cantidad', 'precioUnitario', 'precioConIva', 'valorDescuento', 'porcentajeDescuento'].includes(colDef.field) && newValue < 0) {

                    rowEntity[colDef.field] = oldValue;
                }

                if (colDef.field === 'cantidad' && rowEntity[colDef.field] === 0) {
                    rowEntity[colDef.field] = 1;
                }

                $scope.setCalculoTotales(colDef.field, rowEntity, oldValue);
            })
        }


        function calculateTotalItems(items) {
            return items.map(item => {
                let precioConIva = item.precioUnitario + item.valorImpuesto;
                let precioTotalSinImpuesto = ((item.precioUnitario * item.cantidad)) - item.valorDescuento;
                let total = precioTotalSinImpuesto + item.valorImpuesto;
                return {
                    ...item,
                    precioConIva: fS.roundNumber(precioConIva, $scope.decimal.nroPrecio),
                    precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, $scope.decimal.nroTotalDetalle),
                    total: fS.roundNumber(total, $scope.decimal.nroTotalDetalle)
                }

            })
        }

        initiload();
        setColumnDefs()

        function initiload() {
            try {
                let {
                    infoComprobante,
                    factura,
                    cliente,
                    detalleDocumento,
                    infoAdicionalDocumento,
                } = params;


                if (infoComprobante && infoComprobante.idNotaCredito > 0) {
                    $scope.factura = factura;
                    $scope.cliente = cliente;

                    $scope.infoAdicionalDocumento = infoAdicionalDocumento;
                    //Cargamos los Datos 
                    $scope.data = Object.assign({}, infoComprobante);
                    $scope.gridOptions.data = calculateTotalItems(detalleDocumento);

                    let dataEstab = $scope.establecimientos.find(estab => (estab.codEstab === $scope.data.codEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegas = dataEstab.bodegas;

                    $scope.data.codEstab = dataEstab.codEstab;
                    $scope.dataClone.codEstab = dataEstab.codEstab;

                    if ($scope.bodegas.length > 0) {
                        $scope.data.idBodega = $scope.bodegas.find(ptoEmi => (ptoEmi.defaultBodega)).idBodega;
                        $scope.dataClone.idBodega = $scope.data.idBodega;
                    } else {
                        tS.toastr('warning', 'No tienes asignados bodegas')
                    }

                    $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas.find(tarifa => (tarifa.predeterminada)).idTarifa : 0;
                    $scope.dataClone.idTarifa = $scope.data.idTarifa;
                } else {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));

                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegas = dataEstab.bodegas;

                    $scope.data.codEstab = dataEstab.codEstab;
                    $scope.dataClone.codEstab = dataEstab.codEstab;

                    if ($scope.puntosEmision.length > 0) {
                        $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                    } else {
                        tS.toastr('warning', 'No tienes asignados puntos de emisión')
                    }

                    if ($scope.bodegas.length > 0) {
                        $scope.data.idBodega = $scope.bodegas.find(ptoEmi => (ptoEmi.defaultBodega)).idBodega;
                        $scope.dataClone.idBodega = $scope.data.idBodega;
                    } else {
                        tS.toastr('warning', 'No tienes asignados bodegas')
                    }

                    if ($scope.vendedores.length > 0) {
                        $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                    } else {
                        $scope.data.idUsuario = 0;
                    }

                    $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas.find(tarifa => (tarifa.predeterminada)).idTarifa : 0;
                    $scope.dataClone.idTarifa = $scope.data.idTarifa;

                }

                $uibModalInstance.rendered.then(() => {
                    drawImpuestoTotales();
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }


        function setColumnDefs() {
            let defaultPermission = Object.freeze({
                tarifa: {
                    update: true
                },
                medida: {
                    update: true
                },
                tipoIva: {
                    update: true
                },
                porcentajeDescuento: {
                    update: true
                },
                descuento: {
                    update: true
                },
                precioUnitario: {
                    update: true
                },
                precioConIva: {
                    update: true
                },
            })

            const ventaDetailPermission = defaultPermission;
            const CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.askToDeleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

            <a  ng-click="grid.appScope.openModalArticulo(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >`;

            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '50',
                cellTemplate: CELL_TEMPLATE_OPTION,
            },
            {
                name: 'N°',
                field: 'n',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '5%',
                minWidth: '50'
            },
            {
                name: 'cód.',
                field: 'codigo',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'idArticulo',
                field: 'idArticulo',
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
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '6%',
                minWidth: '50'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: ventaDetailPermission.medida.update,
                enableCellEditOnFocus: ventaDetailPermission.medida.update,
                allowCellFocus: ventaDetailPermission.medida.update,
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
                enableCellEdit: false,
                width: '8%',
                visible: false
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',
                width: '8%',
                minWidth: '100',
                type: 'number',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: ventaDetailPermission.tipoIva.update,
                allowCellFocus: ventaDetailPermission.tipoIva.update,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva.update,
                //    visible: config.porcentajeIva
            }, 
            {
                name: 'Tarifa',
                field: 'idTarifa',
                width: '10%',
                minWidth: '80',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: ventaDetailPermission.tarifa.update,
                enableCellEditOnFocus: ventaDetailPermission.tarifa.update,
                allowCellFocus: ventaDetailPermission.tarifa.update,
                editDropdownOptionsFunction: (rowEntity) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                allowCellFocus: true,
                type: 'number',
                width: '8%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario.update : true;
                },
                // cellFilter: "currency:'$'",
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                min: 0,
                type: 'number',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                width: '7%',
                minWidth: '90',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva : true;
                },
                // cellFilter: "currency:'$'",
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: ventaDetailPermission.porcentajeDescuento,
                allowCellFocus: ventaDetailPermission.porcentajeDescuento,
                enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento,
                min: 0,
                width: '4%',
                minWidth: '60',
                // cellFilter: "currency:'%'",
                visible: ventaDetailPermission.porcentajeDescuento || false,
                type: 'number',
                /*cellFilter: "limitTo:3",*/
            },
            {
                name: 'Desc.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento,
                enableCellEditOnFocus: ventaDetailPermission.descuento,
                allowCellFocus: ventaDetailPermission.descuento,
                min: 0,
                type: 'number',
                width: '4%',
                minWidth: '65',
                // cellFilter: "currency:'$'",
                visible: ventaDetailPermission.descuento || false
            },
            {
                name: 'SubTotal',
                field: 'precioTotalSinImpuesto',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '50',
                visible: true,
            },
            {
                name: 'IVA',
                field: 'valorImpuesto',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '5%',
                minWidth: '50',
                visible: true,
            },
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '5%',
                minWidth: '100',
                visible: true,
            },
            {
                name: 'Ice',
                field: 'ice',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: false
            },
            {
                name: 'Nota',
                field: 'nota',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '15%',
                minWidth: '100'
            },
            {
                name: 'bodega',
                field: 'idBodega',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '11%',
                minWidth: '100'
            },
            ]

            setWarehouseAndIVA();
        }

        $scope.askToDeleteRow = async function (rowEntity) {
            try {
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptions.data.indexOf(rowEntity);
                    $scope.gridOptions.data.splice(index, 1);

                    if (rowEntity.idNotaCreditoDetalle > 0) {
                        detallesDeleted.push({
                            ...rowEntity,
                            cantidad: rowEntity.cantidadOriginal,
                            estado: 0
                        });
                    }

                    //Recalculamos los totales 
                    $scope.setCalculoTotales("cantidad", rowEntity, 0);
                    $scope.$apply();
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.openModalArticulo = function (item) {
            $scope.indexRowDetalle = $scope.gridOptions.data.indexOf(item);
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[1]
            )
            $scope.$broadcast("editArticulo", item)
        }

        /**
         * 
         * @param {*} colField nombre de la columnas 
         * @param {*} rowEntity datos del item 
         * @param {*} oldValue valor anterior de la columna
         */
        $scope.setCalculoTotales = function (colField, rowEntity, oldValue) {

            //calculoColDef recibbe params obj: {rowEntity, oldValue, decimal, idTarifa, columnDefs}
            let objCalculo = gridOptionsSvc.calculoColDef({
                rowEntity,
                oldValue,
                decimal: $scope.decimal,
                idTarifa: $scope.data.idTarifa,
                columnDefs: $scope.gridOptions.columnDefs
            });

            objCalculo[colField] && objCalculo[colField]();

            objCalculo["calculoTotalDetalle"]();
            recalculateTotalsSimple();
        }

        /**
         * Calculamos todos los totales y subtotales del comprobantes 
         */
        function recalculateTotalsSimple() {

            // $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
            //     items: $scope.gridOptions.data,
            //     decimal: $scope.decimal,
            //     dataTarifaImpuesto: $scope.tarifaImpuestoVigente,
            //     TAX_RATE_CODE
            // }))

            // $scope.dataClone.porcentajeDescuento = $scope.data.porcentajeDescuento;
            // $scope.dataClone.totalDescuento = $scope.data.totalDescuento;
            drawImpuestoTotales();
        }

        $scope.onChangeEstablecimiento = async function () {
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
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                    return
                }

                let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);

                $scope.puntosEmision = dataEstab.puntosEmision;
                $scope.bodegas = dataEstab.bodegas;

                if (!($scope.puntosEmision.length > 0)) {
                    tS.toastr('info', 'No tienes Puntos de Emisión asignado a este establecimiento');
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                    return
                }
                if ((!$scope.bodegas.length > 0)) {
                    tS.toastr('info', 'No tienes bodegas asignado a este establecimiento');
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                    return
                }

                let dataPtoEmi = $scope.puntosEmision.find(item => (item.defaultPtoEmi))
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                //Bodegas  
                let dataBodega = $scope.bodegas.find(item => (item.defaultBodega));
                $scope.data.idBodega = dataBodega.idBodega;

                $scope.dataClone.codEstab = $scope.data.codEstab;
                setWarehouseAndIVA();
                $scope.$apply();
            } catch (error) {
                console.trace(error)
            }
        }

        /**
         * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
         */
        function setWarehouseAndIVA() {
            let indexTipoIva = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
            $scope.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
        }


        $scope.onChangeBodega = async function () {
            try {
                let bodega = $scope.bodegas.find(item => item.idBodega === $scope.data.idBodega);
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
                    title: '<small>Cambiar Bodega</small>',
                    html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega.descripcion}</b>  en el detalle del Documento?</small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: `Si, cambiar!`,
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (isConfirmed) {
                    $scope.dataClone.idBodega = $scope.data.idBodega;

                    if ($scope.gridOptions.data.length === 0) return

                    for (let item of $scope.gridOptions.data) {
                        item.idBodega = $scope.data.idBodega;
                    }
                    resetCantidadToZeroAndRecalculateTotals();
                    $scope.$apply();
                } else {
                    $scope.data.idBodega = $scope.dataClone.idBodega;
                    $scope.$apply();
                }
            } catch (error) {
                console.log(error)
            }
        }


        function resetCantidadToZeroAndRecalculateTotals() {
            try {
                for (let rowEntity of $scope.gridOptions.data) {
                    if (!rowEntity.llevaInventario) continue;

                    rowEntity.cantidad = 0;
                    $scope.setCalculoTotales('cantidad', entity, 0);

                }
            } catch (error) {
                console.log(error);
            }

        }


        /**
         * 
         * @param {string} textSearch 
         * @returns 
         */
        $scope.clienteSearchDynamic = async function (textSearch) {
            try {
                if (textSearch.length < 3) return;
                let response = await commonSvc.clienteSearch(textSearch)

                if (response) return response;
            } catch (error) {
                console.log('Error search cliente', error)
            }
        }

        $scope.onKeyupSearchCliente = function () {
            if (!$scope.cliente.nombreFiscal) {
                $scope.cliente = {};
                $scope.factura = {};
                $scope.textSearchFactura = '';
            }
        }


        $scope.onSelectedClienteChange = async function (item) {
            try {
                if (item.tipoIdentificacion == 'CF') {
                    Swal.fire({
                        icon: 'warning',
                        html: '<p>A nombre de consumir final no se puede generar el Documento Nota de Crédito</p>'
                    })
                    return
                }

                let dataCliente = await clienteSvc.findById(item.idCliente)
                $scope.cliente = dataCliente;
                getInvoiceByCustomer();
            } catch (error) {
                $scope.cliente = {};
                console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            }
        }

        function getInvoiceByCustomer() {
            try {
                showLoader();
                $scope.facturas = [];
                $scope.factura = {};
                $scope.gridOptions.data = [];

                let json = {
                    byCliente: $scope.cliente.idCliente,
                    codEstab: $scope.data.codEstab,
                }

                facturaSvc.getForCreditNote(json).then(response => {
                    $scope.facturas = response.facturas || [];
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                console.log(error)
            }
        }

        $scope.onKeyupInvoice = function () {
            if (!$scope.textSearchFactura) {
                $scope.factura = {};
                $scope.gridOptions.data = [];
                recalculateTotalsSimple()
            }
        }

        $scope.selectedInvoiceChange = function (item) {
            $scope.factura = item;
            $scope.getDetalleFactura();
        }

        $scope.getDetalleFactura = function () {
            try {
                showLoader();
                facturaSvc.getDetalleDoc($scope.factura.idDocumento).then(response => { 
                    $scope.gridOptions.data = response.items; 
                    recalculateTotalsSimple();
                }).catch(error => {
                    console.log(error)
                })
                    .finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.getDetalleDoc = async function () {
            try {
                if (!($scope.factura.idDocumento > 0)) return


                let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
                let ctrl = (await import(fileCtrl))[controller];
                let template = templates['FV_SRI'];
                modalSvc.openModalCustom({
                    controller: ctrl,
                    template: template,
                    size: 'xl',
                    params: {
                        codDoc: DOC_TYPE.FV_SRI,
                        id: $scope.factura.idDocumento
                    },
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })


            } catch (error) {
                console.error(error)
            }
        }

        function addRow() {
            const obj = {
                idNotaCreditoDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 1,
                nombreMedida: "",
                codigoPorcentaje: "",
                tarifa: 0,
                nombreTipoIva: "",
                articuloTarifas: [],
                idTarifa: 0,
                precioUnitario: 0,
                precioConIva: 0,
                porcentajeDescuento: 0,
                valorDescuento: 0,
                totalDescuento: 0,
                ice: 0,
                idBodega: 0,
                subTotal: 0,
                total: 0,
                nota: "S/N",
                llevaInventario: false,
                datosAdicionales: false,
                estado: 1
            }
            $scope.gridOptions.data.push(obj)
        }

        $scope.setItemArticuloEnDetalle = function (dataArticulo) {
            try {
                $scope.dataArticulo = dataArticulo;

                const {
                    articulo,
                    medidas,
                    datosAdicionales
                } = $scope.dataArticulo;

                let index = 0, entity = {}, tarifaImpuesto = {};

                //verificar si hay un articulo que lleva inventario mas de uno 
                let itemsDuplicated = $scope.gridOptions.data.filter(item => (
                    item.llevaInventario && item.idArticulo === articulo.idArticulo
                ))
                if (itemsDuplicated.length > 1) {
                    fS.sweetAlert('warning', `El elemento ${articulo.descripcion} aparece más de una vez en el detalle.`);
                    return
                }

                let findIndexById = $scope.gridOptions.data.findIndex(item => item.llevaInventario && item.idArticulo === articulo.idArticulo);

                if (findIndexById === -1) {
                    addRow();
                    index = $scope.gridOptions.data.length - 1;
                    entity = $scope.gridOptions.data[index];
                    entity.cantidad = 1;
                } else {
                    index = findIndexById;
                    entity = $scope.gridOptions.data[index];
                    cantidad = entity.cantidad;
                    entity.cantidad = cantidad + 1;
                }

                let dataMedida = medidas.find(medida => (medida.defaultMedida));

                tarifaImpuesto = $scope.tarifasImpuesto.find(ti => ti.codigoPorcentaje === articulo.codigoPorcentaje);

                entity.idImpuesto = tarifaImpuesto.idImpuesto;
                entity.idTipoIva = articulo.idTipoIva;
                entity.codigoPorcentaje = articulo.codigoPorcentaje;
                entity.tarifa = articulo.tarifa;

                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;
                entity.idTipoIva = articulo.idTipoIva;
                entity.codigoPorcentaje = articulo.codigoPorcentaje;
                entity.tarifa = articulo.tarifa;
                // entity.nombreTipoIva        = articulo.nombreTipoIva;
                entity.ice = articulo.valorIce;
                entity.idBodega = $scope.data.idBodega;
                entity.llevaInventario = articulo.llevaInventario;
                entity.datosAdicionales = articulo.datosAdicionales;
                entity.productoFraccionable = articulo.productoFraccionable;
                entity.medidas = medidas; //Lista Medida 
                entity.idMedida = dataMedida.idMedida; //Medida por defecto 
                entity.conversion = dataMedida.conversion;
                entity.adicional = datosAdicionales; //


                entity.articuloTarifas = dataMedida.tarifas;

                let tarifa = entity.articuloTarifas.find(item => item.idTarifa === $scope.data.idTarifa);

                entity.idTarifa = $scope.data.idTarifa;

                entity.precioCosto = articulo.precioCosto;
                entity.precioUnitario = fS.roundNumber(tarifa.precioVenta, $scope.decimal.nroPrecio);
                entity.precioConIva = fS.roundNumber(tarifa.precioConIva, $scope.decimal.nroPrecio);

                $scope.setCalculoTotales('precioUnitario', entity, 0);
                $scope.indexRow = index;
                focusColumnCantidad();
            } catch (error) {
                console.log(error)
            }
        }

        function focusColumnCantidad() {
            let index = 0;

            if ($scope.dataArticulo.articulo.llevaInventario) {
                index = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'cantidad')
            } else {
                index = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'descripcion')
            }
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[$scope.indexRow],
                    $scope.gridOptions.columnDefs[index]
                );
                $scope.indexRow = null;
            }, 500)
            counterGridOptions()
        }

        function counterGridOptions() {
            let index = 0;
            for (let item of $scope.gridOptions.data) {
                item.n = index + 1;
            }
        }

        $scope.calcularPorcentajeDescuento = function () {
            if (!$scope.permisoComprobanteVenta.porcentajeDescuento) {
                $scope.data.porcentajeDescuento = 0;
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                return
            }
            if ($scope.gridOptions.data.length === 0) {
                return
            }

            if (typeof $scope.data.porcentajeDescuento !== 'number' || isNaN($scope.data.porcentajeDescuento)) {
                tS.toastr('warning', 'Ingrese un Número Válido');
                return
            }

            if ($scope.data.porcentajeDescuento <= 100) {

                gridOptionsSvc.setPorcentajeDescuentoAll(
                    $scope.gridOptions, $scope.data, $scope.decimal, gridOptionsSvc.calculoColDef
                )
                //redondeo del numero porcentaje 
                $scope.data.porcentajeDescuento = fS.roundNumber($scope.data.porcentajeDescuento, $scope.decimal.nroTotalSubTotal)
                recalculateTotalsSimple();
            } else {
                tS.toastr('warning', 'El Porcentaje de Descuento tiene que ser menor o igual a 100');
            }
        }

        //Calcular Porcentaje  Descuento 
        $scope.calcularDescuento = function () {
            try {
                if (!$scope.permisoComprobanteVenta.descuento) {
                    $scope.data.descuento = 0;
                    tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                    return
                }
                if ($scope.gridOptions.data.length === 0) {
                    return
                }
                if (typeof $scope.data.totalDescuento !== 'number' || isNaN($scope.data.totalDescuento)) {
                    tS.toastr('warning', 'Ingrese un númeto válido', 'Valor Descuento');
                    return
                }

                const { subTotalSinImpuestos } = gridOptionsSvc.getSubTotalSinImpuesto($scope.gridOptions.data);
                if ($scope.data.totalDescuento <= subTotalSinImpuestos) {
                    let porcentajeDescuento = ($scope.data.totalDescuento * 100) / subTotalSinImpuestos;
                    $scope.data.porcentajeDescuento = fS.roundNumber(porcentajeDescuento, $scope.decimal.nroDescuentoDetalle);
                    //setPorcentajeDescuentoAll($scope.data.porcentajeDescuento)
                    gridOptionsSvc.setPorcentajeDescuentoAll(
                        $scope.gridOptions, $scope.data, $scope.decimal, gridOptionsSvc.calculoColDef
                    )
                    recalculateTotalsSimple();
                } else {
                    tS.toastr('warning', 'El Valor Descuento no puede ser mayor al total');
                }
            } catch (error) {
                console.log("CALCULO DE TOTAL DESCUENTO", error)
            }
        }


        $scope.getImporteTotal = function () {
            if (!$scope.decimal) return
            let total = Number($scope.data.total);

            $scope.data.total = total;

            return fS.roundNumber($scope.data.total, $scope.decimal.nroTotalSubTotal);
        }

        function drawImpuestoTotales() {
            try {
                let {
                    subTotalSinImpuestos,
                    htmlImpuestoTotal,
                    htmlIvaTotal,
                    irbpnr,
                    totalIce,
                    importeTotal,
                    totalDescuento,
                    porcentajeDescuento,
                    propina,
                } = gridOptionsSvc.getImpuestoTotales({
                    items: $scope.gridOptions.data,
                    decimal: $scope.decimal,
                    tarifasImpuesto: $scope.tarifasImpuesto.slice(),
                })



                // Crear la estructura HTML con un template literal
                const htmlTemplate = `<div class="table-responsive">
                                        <table class="table table-clear table-sm">
                                            <tbody>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Subtotal sin Impuestos</span>
                                                    </td>
                                                    <td class="right">$${subTotalSinImpuestos}</td>
                                                </tr>
                                                ${htmlImpuestoTotal}
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Total descuento</span>
                                                    </td>
                                                    <td class="right">$${totalDescuento}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor ICE</span>
                                                    </td>
                                                    <td class="right">$${totalIce}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor irbpnr</span>
                                                    </td>
                                                    <td class="right">$${irbpnr}</td>
                                                </tr>
                                                ${htmlIvaTotal}
                                               
                                                <tr>
                                                    <td class="left">
                                                        <strong class="font-weight-bold">Valor Total</strong>
                                                    </td>
                                                    <td class="right font-weight-bold">$${importeTotal}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                `;
                let drawImpuestoTotalesElement = document.getElementById("drawImpuestoTotales");
                drawImpuestoTotalesElement.innerHTML = htmlTemplate;


                $scope.data.subTotalSinImpuestos = subTotalSinImpuestos;
                $scope.data.total = importeTotal;
                $scope.data.totalDescuento = totalDescuento;
                $scope.data.porcentajeDescuento = porcentajeDescuento;
                $scope.data.irbpnr = irbpnr
                $scope.data.propina = propina;
                // <tr>
                //     <td class="left">
                //         <div class="custom-control custom-switch">
                //             <input type="checkbox" class="custom-control-input" id="switchPropina">
                //                 <label class="custom-control-label" for="switchPropina">Propina 10%</label>
                //         </div>
                //     </td>
                //     <td class="right">$${importeTotal}</td>
                // </tr>
            } catch (error) {
                console.log(error);
            }
        }

        $scope.getDataAdditionalDocument = function (result) {
            $scope.infoAdicionalDocumento = result;
        }

        function isUpdate() {
            return $scope.data.idNotaCredito > 0;
        }
        function isRegister() {
            return !($scope.data.idNotaCredito > 0)
        }


        function isValidForm() {
            const NUM_CONSUMIDOR_FINAL = "9999999999999";
            if (!$scope.data.codEstab) {
                tS.toastr('warning', 'Seleccione el establecimiento');
                return
            }

            if (!($scope.data.idPuntoEmision)) {
                tS.toastr('warning', 'Seleccione el punto de emisión')
                return
            }

            if (!(fS.isDateValid($scope.data.fechaEmision))) {
                tS.toastr('warning', 'Ingrese fecha de emisión');
                return
            }

            if (!($scope.cliente.idCliente > 0)) {
                tS.toastr('warning', 'Seleccione el cliente');
                return
            }

            if (!($scope.factura.idDocumento > 0)) {
                tS.toastr('warning', 'Seleccione la factura');
                return
            }

            if ($scope.gridOptions.data.length === 0) {
                tS.toastr('warning', 'Ingrese al menos un Articulo en el Detalle');
                return
            }
            if (!($scope.gridOptions.data.some(item => (item.idBodega > 0)))) {
                tS.toastr('warning', 'Agregue  bodega a los artículos')
                return
            }

            if ($scope.cliente.numeroIdentificacion === NUM_CONSUMIDOR_FINAL) {
                tS.toastr('warning', 'Realizar nota de credito a nombre del consumidor final no esta disponible!')
                return
                // fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>')

            }

            if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
                tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
                return
            }

            let ajusteFechaEmision = fS.ajustarFechaEmision(isUpdate(), $scope.data.fechaEmision, $scope.data.fechaEmisionDocCreado);

            if (!ajusteFechaEmision) {
                console.log('Error al justar la fecha de Emisión')
                return
            }
            $scope.data.fechaEmision = ajusteFechaEmision;

            return true;
        }

        $scope.onSave = async function () {
            try {

                let nroDocumentoSecuencial = null;

                if (!isValidForm()) return

                if (isRegister()) {
                    showLoader();
                    nroDocumentoSecuencial = await notaCreditoSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    })
                    hideLoader();
                    if (!nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"
                }



                let textAccion = isUpdate() ? 'Actualizar' : 'Guardar';
                let textHtml = isUpdate() ? (`<small>Esta Ud. seguro de ${textAccion} este documento </small>?`) : (`<small>Esta Ud. seguro de ${textAccion} este documento <b>N° ${nroDocumentoSecuencial}</b></small>?`);
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
                    title: `<small>${textAccion} Nota de Crédito</small>`,
                    html: textHtml,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: `Si, ${textAccion}!`,
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (!isConfirmed) return



                let notaCredito = Object.assign({}, $scope.data);
                notaCredito.idCliente = $scope.cliente.idCliente;
                notaCredito.fechaEmision = fS.formatDateTimeZone($scope.data.fechaEmision);
                notaCredito.idFactura = $scope.factura.idDocumento;

                let params = {
                    infoComprbante: notaCredito,
                    detalles: $scope.gridOptions.data,
                    detallesDeleted: detallesDeleted,
                    infoAdicional: $scope.infoAdicionalDocumento
                }

                let paramsMapper = notaCreditoSvc.paramsMapperToApi(params); 

                if (isUpdate()) {
                    showLoader();
                    notaCreditoSvc.put($scope.data.idNotaCredito, paramsMapper)
                        .then($scope.successResponse)
                        .catch(error => {
                            console.log(error)
                        }).finally(() => hideLoader())
                }


                if (isRegister()) {
                    showLoader();
                    notaCreditoSvc.post(paramsMapper)
                        .then($scope.successResponse)
                        .catch(error => {
                            console.log(error)
                        }).finally(() => hideLoader())
                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.successResponse = function (response) {
            if (response.code === '0') {
                fS.sweetAlert('warning', response.message, response.titleSms);
            }
            if (response.code === "1") {
                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                $uibModalInstance.close(response)
            }
        }

        $scope.closeModal = () => {
            $uibModalInstance.close();
        }
    }

})(window.angular)