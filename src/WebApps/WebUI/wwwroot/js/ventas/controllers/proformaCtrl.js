(function () {
    'use strict';

    const TEMPLATE_URL = '~/Pages/Proforma/';
    let mainDataForm = {};
    let proformaSvc = {};
    let commonSvc = {};
    let tS = {};
    let fS = {};
    let modalSvc = {};
    let tipoDoc = {}

    app.controller('proformaCtrl', proformaCtrl);

    proformaCtrl.$inject = [
        '$scope',
        '$filter',
        '$injector',
        'clienteService',
    ]

    function proformaCtrl($scope, $filter, $injector, clienteSvc) {
        proformaSvc = $injector.get('proformaService');
        commonSvc = $injector.get('commonService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');
        modalSvc = $injector.get('modalService');
        let nombreModalVenta = $injector.get('nombreModalVenta');
        let DOC_TYPE = $injector.get('DOC_TYPE');
        const CODE_REPORT = $injector.get('CODE_REPORT');
        tipoDoc = {
            codigo: DOC_TYPE['PR']
        }

        $scope.typeSend = 'GenericFile';
        $scope.typeSendToMail = 'N';

        const PERMISSION_KEY_ACTIONS = {
            E: 'E',
            A: 'A',
        }

        $scope.permisoEditarDoc = {}

        $scope.moreSearchOptions = false;
        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            order: '',
            tipo: 1,
            pageSize: 50,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
            nroSecuencial: null,
            checkBoxFecha: true,
            busqueda: "",
            byStock: 0,
        };
        $scope.proformas = [];


        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.checkBoxFecha = true;
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getProformas();
        }

        $scope.clienteSearch = function (textSearch) {
            let query = {
                textSearch
            }

            if (textSearch.length > 2) {
                return clienteSvc.search(query).catch(error => {
                    console.log(error)
                })
            }
        }

        $scope.onKeyupClienteSearchFiltro = function () {
            if (!$scope.modelTextSearch) {
                $scope.dataSearch.idCliente = 0;
                $scope.dataSearch.checkBoxFecha = true;
            }
        }

        $scope.selectedClienteSearchFiltro = function (item) {
            $scope.dataSearch.idCliente = item.idCliente;
            $scope.dataSearch.checkBoxFecha = true;
            $scope.getProformas();
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
            let aprobComprobantes = JSON.parse(JSON.stringify($scope.cloneAproComprobantes));
            $scope.aprobComprobantes = $filter("filter")(aprobComprobantes, $scope.dataSearch.bySearch);
            $scope.calculoColumnTotal();
        }

        //=====================Eend Filters=======================


        $scope.sumarColumnaTotal = function () {
            let total = 0;
            for (let val of $scope.proformas) {
                if (val.codEstado !== 'A') {
                    total += val.total;
                }
            }
            return fS.roundNumber(total, 5);
        }



        $scope.getProformas = async () => {

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
                $scope.proformas = [];
                $scope.total = $scope.sumarColumnaTotal();

                let dataSearch = {
                    tipo: 1,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    byCliente: $scope.dataSearch.idCliente,
                    byUsuario: $scope.dataSearch.byUsuario,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                }

                proformaSvc.getAll(dataSearch).then(response => {
                    let { proformas, dataTotals } = response;
                    $scope.proformas = proformas;
                    $scope.cloneProformas = JSON.parse(JSON.stringify($scope.proformas));
                    $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                    //  $scope.total = fS.roundNumber(dataTotals.totalDocument, 5);
                    $scope.total = $scope.sumarColumnaTotal();

                }).catch(error => {
                    $scope.dataSearch.totalRecords = 0;
                    console.log(error)
                }).finally(() => hideLoader())



            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.initiload = () => {
            showLoader();
            proformaSvc.get({ tipo: 3 }).then(response => {
                $scope.establecimientos = response.estabs;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getProformas();
                }

            }).finally(() => hideLoader())

            proformaSvc.getDataForm().then(response => {
                mainDataForm = response;
                $scope.permisoEditarDoc = response.permisoEditarDoc;
            })

        }
        $scope.initiload();

        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            if ($scope.puntosEmision.length > 0) {
                $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                $scope.getProformas();
            } else {
                fS.sweetAlert('warning', "No posee puntos de emisión asignadas!");
            }
        }


        $scope.pagechanged = function () {
            $scope.getProformas();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getProformas();
        };


        $scope.openModalNew = async () => {
            try {
                modalSvc.openModalCustom({
                    controller: 'modalProformaCtrl',
                    template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                    size: 'xl',
                    params: {
                        action: 'NUEVO'
                    },
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }).result.then(result => {
                    if (typeof result !== 'object') return
                    $scope.getProformas();
                })
            } catch (error) {
                console.log(error)
            }
        }
        $scope.searchLocalProforma = function () {
            let proformas = JSON.parse(JSON.stringify($scope.cloneProformas));
            $scope.proformas = $filter('filter')(proformas, $scope.dataSearch.bySearch);
            $scope.total = $scope.sumarColumnaTotal();
        }


        $scope.openModalDetalle = async (params) => {
            try {
                let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
                let ctrl = (await import(fileCtrl))[controller];
                let template = templates['PR'];
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


        $scope.openModalEdit = async (item) => {
            try {
                let result = await commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.E);
                if (result.code === "2") {
                    commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.E);
                    return
                }

                showLoader();
                proformaSvc.getId(item.idDocumento).then(response => {
                    const modalRef = modalSvc.openModalCustom({
                        controller: 'modalProformaCtrl',
                        template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                        size: 'xl',
                        params: {
                            data: response,
                            action: 'EDITAR'
                        },
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.getProformas();
                            if (typeof $scope.permisoEditarDoc === 'object' && $scope.permisoEditarDoc.requiereClave) {
                                commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.E);
                            }

                        }
                    })
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

        $scope.openModalDuplicate = async (item) => {
            try {
                showLoader();
                proformaSvc.getId(item.idDocumento).then(response => {
                    let modalRef = modalSvc.openModalCustom({
                        controller: 'modalProformaCtrl',
                        template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                        size: 'xl',
                        params: {
                            data: response,
                            action: 'DUPLICAR'
                        },
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })

                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.getProformas();
                        }
                    })
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                console.log(error)
            }

        }


        $scope.askToDelete = async (item) => {
            try {
                if (item.anulada) {
                    fS.sweetAlert('warning', 'El documento ya se encuentra anulada');
                    return
                }
                let result = await commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.A);
                if (result.code === "2") {
                    commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.A);
                    return
                }

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
                    title: '<small>Anular Proforma?</small>',
                    html: `<small>Esta Ud. seguro/a de anular este Documento <b>N° ${item.serieComprobante}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    showLoader();
                    proformaSvc.delete(item.idDocumento).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);


                            //Una vez actualizado el documento  
                            if (typeof $scope.permisoEditarDoc === 'object' && $scope.permisoEditarDoc.requiereClave) {
                                commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.A);
                            }

                            $scope.getProformas();
                        }
                    }).catch(error => {
                        console.log(error);
                    }).finally(() => hideLoader())

                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.getParamToSendMail = (item) => {
            return {
                serieComprobante: item.serieComprobante,
                correo: item.correo,
                subject: 'Documento Proforma - Acontplus N°: ' + item.serieComprobante,
                json: {
                    hasFile: true,
                    isReport: "SI",
                    reportParams: {
                        hasParams: true,
                        codEstab: item.codEstab,
                        codigo: "PR",
                        format: "pdf"
                    },
                    spParams: {
                        id: item.idDocumento
                    }
                }
            }
        }



        //Impresión 

        $scope.print = function (item) {
            let parameters = {
                idDocument: ('idDocumento' in item) ? item.idDocumento : item.idDocument,
                codEstab: item.codEstab,
                codDoc: tipoDoc.codigo,
                codigo: 'RNEPT'
            }

            commonSvc.askToPrint({
                parameters: JSON.stringify(parameters)
            })

        }


        //Reporte 
        $scope.getReport = function (item) {
            let format = 'pdf';
            let dataParms = {
                id: item.idDocumento,
            }
            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: CODE_REPORT.PR,
                    format,
                    codEstab: item.codEstab,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataParms)
            }

            commonSvc.getReport({
                parameters,
                formatType: format
            })
        }

    }


    app.controller('modalProformaCtrl', modalProformaCtrl)
    modalProformaCtrl.$inject = [
        '$scope',
        '$uibModalInstance',
        '$timeout',
        '$injector',
        'params'
    ];
    function modalProformaCtrl($scope, $uibModalInstance, $timeout, $injector, params) {
        let clienteSvc = $injector.get('clienteService');
        let gridOptionsSvc = $injector.get('gridOptionsService');
        let storageSvc = $injector.get('storageService');
        let TAX_RATE_CODE = $injector.get('TAX_RATE_CODE');

        console.log('modal proforma')

        $scope.tipoDoc = tipoDoc;
        $scope.infoEstabPtoEmi = {};

        $scope.data = {
            idProforma: 0,
            idBodega: 0,
            idPuntoEmision: 0,
            idTiempoCredito: 0,
            idTarifa: 0,
            fechaEmision: new Date(),
            totalIce: 0,
            irbpnr: 0,
            propina: 0,

            porcentajeDescuento: 0,
            transporte: 0,
            recargo: 0,
            subTotalSinImpuestos: 0,
            iva: 0,
            totalDescuento: 0,
            total: 0,
        }
        $scope.dataClone = {};

        $scope.cliente = {};
        $scope.newCustomer = false;

        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.bodegas = [];
        $scope.tarifasImpuesto = [];

        $scope.datosAdicionalesArticulo = []
        $scope.historyDatosAdicionales = [];

        //Informacion adicional del documento 
        $scope.infoAdicionalDocumento = [];

        //Habilitar cuando la acción es editar
        $scope.isDisabledFormField = false;

        $scope.indexRow = null; //Indice del items del detalle 

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
                    if ($scope.config.searchCode == 1) {
                        setFocusInputBarcode();
                    } else {
                        setFocusArticulo();
                    }

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

                //Verificacion del stock 
                // if (colDef.field === 'cantidad' && rowEntity.cantidad !== oldValue) {
                //     checkNotificationStock(colDef.field, rowEntity, oldValue);
                //     return
                // }
                // if (colDef.field === 'idBodega' && rowEntity.idBodega !== oldValue) {
                //     checkNotificationStock(colDef.field, rowEntity, oldValue);
                //     return
                // }

                setCalculoTotales(colDef.field, rowEntity, oldValue);
            })
        }

        $scope.gridOptionsItemsDeleted = [];

        $scope.setInfoEstabPtoEmi = function () {
            if ($scope.establecimientos.length > 0) {
                $scope.infoEstabPtoEmi.nombreComercial = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab).nombreComercial;
            }

            if ($scope.puntosEmision.length > 0) {
                $scope.infoEstabPtoEmi.puntoEmision = $scope.puntosEmision.find(item => item.idPuntoEmision === $scope.data.idPuntoEmision).ptoEmi;
            }
        }

        function calculateTotalItems(items) {
            return items.map(item => {
                let precioConIva = item.precioUnitario + item.valorImpuesto;
                let precioTotalSinImpuesto = ((item.precioUnitario * item.cantidad)) - item.valorDescuento;
                let total = precioTotalSinImpuesto + item.valorImpuesto;
                return {
                    ...item,
                    idProformaDetalle: params.action === "DUPLICAR" ? 0 : item.idProformaDetalle,
                    precioConIva: fS.roundNumber(precioConIva, $scope.decimal.nroPrecio),
                    precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, $scope.decimal.nroTotalDetalle),
                    total: fS.roundNumber(total, $scope.decimal.nroTotalDetalle)
                }

            })
        }


        initiload();
        setColumnDefs();
        function initiload() {
            let {
                estabs,
                tarifasImpuesto,
                tiemposCredito,
                tarifas,
                permisoVenta,
                notificacionVenta,
                decimal,
                config,
                vendedores,
            } = mainDataForm;
            $scope.establecimientos = estabs;


            let dataEstab = {};
            if (params && ["EDITAR", "DUPLICAR"].includes(params.action)) {
                const {
                    comprobante,
                } = params.data;
                dataEstab = $scope.establecimientos.find(estab => estab.codEstab === comprobante.codEstab);
            } else {
                dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
            }
            $scope.data.codEstab = dataEstab.codEstab;
            $scope.dataClone.codEstab = dataEstab.codEstab;

            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.bodegas = dataEstab.bodegas;
            $scope.tarifas = tarifas;
            $scope.tiemposCredito = tiemposCredito;
            $scope.vendedores = vendedores;
            $scope.tarifasImpuesto = tarifasImpuesto;
            $scope.permisoComprobanteVenta = permisoVenta.comprobante;
            $scope.permisoDetalleVenta = permisoVenta.detalle;
            $scope.notificacionVenta = notificacionVenta;
            $scope.decimal = decimal;
            $scope.config = config;

            if ($scope.bodegas.length > 0) {
                let dataBodega = $scope.bodegas.find(bodega => (bodega.defaultBodega));
                $scope.data.idBodega = dataBodega.idBodega;
                $scope.dataClone.idBodega = $scope.data.idBodega;
            }
            if ($scope.tarifas.length > 0) {
                $scope.data.idTarifa = $scope.tarifas[0].idTarifa;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;
            }


            if (params && params.action === "NUEVO") {
                if ($scope.puntosEmision.length > 0) {
                    let dataPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi));
                    $scope.data.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                }

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                // //Cliente Predeterminado 
                // if (clienteDefault.idCliente > 0) {
                //     $scope.cliente = clienteDefault;
                // }

                // //Articulo Predeterminado
                // if (articuloDefault.idArticulo > 0) {
                //     articuloSvc.getForSale({
                //         idArticulo: articuloDefault.idArticulo,
                //         idBodega: $scope.data.idBodega
                //     }).then(dataArticuloApi => {
                //         $scope.setItemArticuloEnDetalle(dataArticuloApi)
                //     })
                // } 
            }



            //Cuando el documento es duplicar
            if (params && params.action === 'DUPLICAR') {
                const {
                    comprobante,
                    cliente,
                    items,
                } = params.data;

                $scope.data = {
                    ...$scope.data,
                    ...structuredClone(comprobante)
                }
                $scope.data.fechaEmision = new Date();
                $scope.data.idProforma = 0;

                $scope.dataClone.codEstab = $scope.data.codEstab;
                $scope.gridOptions.data = calculateTotalItems(items);

                $scope.data.fechaEmisionEscrita = fS.getFechaEscrita($scope.data.fechaEmision);

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                $scope.cliente = cliente;
                counterGridOptions();
            }


            //Cuando el documento es editar
            if (params && params.action === 'EDITAR') {
                const {
                    comprobante,
                    cliente,
                    items,
                } = params.data;

                $scope.data = {
                    ...$scope.data,
                    ...structuredClone(comprobante)
                }
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;

                $scope.dataClone.codEstab = $scope.data.codEstab;
                $scope.gridOptions.data = $scope.gridOptions.data = calculateTotalItems(items);

                $scope.data.fechaEmisionEscrita = fS.getFechaEscrita($scope.data.fechaEmision);

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                $scope.cliente = cliente;
                counterGridOptions();
                $scope.isDisabledFormField = true;
            }

            $uibModalInstance.rendered.then(() => {
                drawImpuestoTotales();
                if ($scope.config.searchCode) {
                    $("#inputBarcode").focus();
                } else {
                    $("#custom-template-md-autocomplete-articulo").focus();
                }
            });


            if (params.action === "NUEVO" && !($scope.data.idProforma > 0)) {
                if (Object.keys(storageSvc.getObject("storeProformaDetail")).length > 0) {
                    storageSvc.restoreInvoiceDetail("storeProformaDetail").then(result => {
                        if (result.isConfirmed) {
                            $scope.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value]);
                            delete result.dataInvoiceDetail[result.value];

                            storageSvc.setObject("storeProformaDetail", result.dataInvoiceDetail)

                            recalculateTotalsSimple();
                            $scope.$apply();
                        }

                    })
                }
            }
            $scope.setInfoEstabPtoEmi();

        }

        function setColumnDefs() {
            let defaultPermission = Object.freeze({
                tarifa: true,
                medida: true,
                tipoIva: true,
                porcentajeDescuento: true,
                descuento: true,
                precioUnitario: true,
                precioConIva: true,
            })

            const ventaDetailPermission = $scope.permisoDetalleVenta ? $scope.permisoDetalleVenta : defaultPermission;
            const CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a  update-article ng-click="grid.appScope.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >`;

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
                enableCellEdit: ventaDetailPermission.medida,
                enableCellEditOnFocus: ventaDetailPermission.medida,
                allowCellFocus: ventaDetailPermission.medida,
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
                enableCellEdit: ventaDetailPermission.tipoIva,
                allowCellFocus: ventaDetailPermission.tipoIva,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva,
                //    visible: config.porcentajeIva
            },

            {
                name: 'Tarifa',
                field: 'idTarifa',
                width: '9%',
                minWidth: '80',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: ventaDetailPermission.tarifa,
                enableCellEditOnFocus: ventaDetailPermission.tarifa,
                allowCellFocus: ventaDetailPermission.tarifa,
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
                minWidth: '90',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario : true;
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

        function setFocusInputBarcode() {
            $timeout(function () {
                document.querySelector('#inputBarcode').focus();
            }, 100);
        }

        function setFocusArticulo() {
            $timeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
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

        /**
         * 
         * @param {*} entity Datos del Articulo 
         */
        $scope.deleteRow = async function (rowEntity) {
            try {
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptions.data.indexOf(rowEntity);
                    $scope.gridOptions.data.splice(index, 1);

                    if (rowEntity.idProformaDetalle > 0) {
                        $scope.gridOptionsItemsDeleted.push({
                            ...rowEntity,
                            cantidad: rowEntity.cantidadOriginal,
                            estado: 0
                        });
                    }

                    //Recalculamos los totales 
                    setCalculoTotales("cantidad", rowEntity, 0);
                    counterGridOptions();
                    $scope.$apply();
                }

            } catch (error) {
                console.log(error)
            }

        }

        $scope.openModalArticle = function (item) {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )

            $scope.indexRow = $scope.gridOptions.data.indexOf(item);
            $scope.$broadcast("editArticulo", item)
        }

        function setIdBodegaInDetalle() {
            for (let item of $scope.gridOptions.data) {
                item.idBodega = $scope.data.idBodega;
            }
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

                setIdBodegaInDetalle();
                resetCantidadToZeroAndRecalculateTotals();
                setWarehouseAndIVA();
                $scope.setInfoEstabPtoEmi();
                $scope.$apply();
            } catch (error) {
                console.trace(error)
            }
        }

        $scope.onChangeFechaEmision = function () {
            try {
                if (!$scope.permisoComprobanteVenta.fechaEmision) {
                    $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
                    tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                    return
                }
                $scope.data.fechaEmision = fS.setHoursToDate($scope.data.fechaEmision);
            } catch (error) {
                console.log(error)
                $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
            }
        }

        //==============================START CUSTOMER===========================
        $scope.onKeyupCustomer = function () {
            if (!$scope.cliente.nombreFiscal) {
                $scope.newCustomer = false;
                $scope.cliente = {};
            }

        }
        $scope.onSelectedClienteChange = async function (item) {
            try {
                setCustomerData(item)
            } catch (error) {
                $scope.cliente = {};
                console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
                $scope.$apply();
            }
        }


        async function setCustomerData(item) {
            let dataCliente = await clienteSvc.findById(item.idCliente);
            $scope.cliente = dataCliente;
            $scope.data.fechaEmision = new Date();
            $scope.$apply();
        }


        $scope.receiveDataCustomerSRI = function (result) {
            $scope.newCustomer = result.idCliente === 0 ? true : false
            $scope.cliente = result;
        }

        //=================================END CUSTOMER============================

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

                    setIdBodegaInDetalle();
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

                    let objCalculo = gridOptionsSvc.calculoColDef({
                        rowEntity,
                        oldValue: null,
                        decimal: $scope.decimal,
                        idTarifa: $scope.data.idTarifa,
                        columnDefs: $scope.gridOptions.columnDefs
                    });

                    objCalculo["cantidad"] && objCalculo["cantidad"]();
                    objCalculo["calculoTotalDetalle"]();
                }
                recalculateTotalsSimple();
            } catch (error) {
                console.log(error);
            }

        }


        $scope.onChangeTarifaGeneral = async function () {
            if (!$scope.permisoComprobanteVenta.tarifa) {
                $scope.data.idTarifa = $scope.dataClone.idTarifa;
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                return
            }

            let tarifa = $scope.tarifas.find(item => item.idTarifa === $scope.data.idTarifa);
            let {
                isConfirmed
            } = await Swal.fire({
                html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
            })

            if (isConfirmed) {

                $scope.dataClone.idTarifa = $scope.data.idTarifa;

                if ($scope.gridOptions.data.length === 0) return

                if (gridOptionsSvc.setTarifaInDetail(
                    $scope.gridOptions,
                    $scope.data.idTarifa,
                    $scope.decimal,
                    gridOptionsSvc.calculoColDef
                )
                ) {
                    recalculateTotalsSimple();
                }
                $scope.$apply();

            } else {
                $scope.data.idTarifa = $scope.dataClone.idTarifa;
                $scope.$apply();
            }
        }

        //=================================START PRODUCT=======================================
        function addRow() {
            const obj = {
                idProformaDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 1,
                cantidadStock: 0,
                codigoPorcentaje: "",
                tarifa: 0,
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
                nota: null,
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
                    datosAdicionalesArticulo,
                    consolidacionesFecha
                } = $scope.dataArticulo;

                let index = 0, entity = {}, tarifaImpuesto = {};

                let findIndexById = $scope.gridOptions.data.findIndex(item => item.llevaInventario && item.idArticulo === articulo.idArticulo);

                if (findIndexById === -1) {
                    addRow();
                    index = $scope.gridOptions.data.length - 1;
                    entity = $scope.gridOptions.data[index];
                } else {
                    index = findIndexById;
                    entity = $scope.gridOptions.data[index];
                    entity.cantidad = entity.cantidad + 1;
                }

                let dataMedida = medidas.find(medida => (medida.defaultMedida));



                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;

                //Aplica a establecimiento que llevan actividad de Tipo Alojamiento
                // if (
                //     $scope.tarifaImpuestoVigente.codigoPorcentaje === TAX_RATE_CODE.DIFFERENTIATED_TAX
                //     && articulo.codigoPorcentaje === TAX_RATE_CODE.TWELVE_PERCENT
                // ) {
                //     let dataImpuestoTarifa = $scope.tarifasImpuesto.find(item => item.codigoPorcentaje === $scope.tarifaImpuestoVigente.codigoPorcentaje);
                //     entity.idTipoIva = dataImpuestoTarifa.idTipoIva;
                //     entity.codigoPorcentaje = dataImpuestoTarifa.codigoPorcentaje;
                //     entity.tarifa = dataImpuestoTarifa.tarifa;

                // } else {
                //     entity.idTipoIva = articulo.idTipoIva;
                //     entity.codigoPorcentaje = articulo.codigoPorcentaje;
                //     entity.tarifa = articulo.tarifa;
                // }
                tarifaImpuesto = $scope.tarifasImpuesto.find(ti => ti.codigoPorcentaje === articulo.codigoPorcentaje);

                entity.idImpuesto = tarifaImpuesto.idImpuesto;
                entity.idTipoIva = articulo.idTipoIva;
                entity.codigoPorcentaje = articulo.codigoPorcentaje;
                entity.tarifa = articulo.tarifa;


                entity.ice = articulo.valorIce;
                entity.idBodega = $scope.data.idBodega;
                entity.llevaInventario = articulo.llevaInventario;
                entity.datosAdicionales = articulo.datosAdicionales;
                entity.productoFraccionable = articulo.productoFraccionable;
                entity.medidas = medidas; //Lista Medida 
                entity.idMedida = dataMedida.idMedida; //Medida por defecto 
                entity.conversion = dataMedida.conversion;

                entity.datosAdicionalesArticulo = datosAdicionalesArticulo; //
                entity.consolidacionesFecha = consolidacionesFecha;

                entity.articuloTarifas = dataMedida.tarifas;

                let tarifa = entity.articuloTarifas.find(item => item.idTarifa === $scope.data.idTarifa);
                entity.idTarifa = $scope.data.idTarifa;
                entity.precioSinSubsidio = articulo.precioSinSubsidio;
                entity.precioCosto = articulo.precioCosto;
                entity.precioUnitario = fS.roundNumber(tarifa.precioVenta, $scope.decimal.nroPrecio);
                entity.precioConIva = fS.roundNumber(tarifa.precioConIva, $scope.decimal.nroPrecio);
                entity.cantMinimaVentaPorMayor = articulo.cantMinimaVentaPorMayor;
                $scope.indexRow = index;
                setCalculoTotales('precioUnitario', entity, 0);
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
            }, 30)

            counterGridOptions()
        }

        //=================================END PRODUCT=======================================

        function counterGridOptions() {
            angular.forEach($scope.gridOptions.data, (item, index) => {
                item.n = index + 1;
            })
        }

        /**
        * 
        * @param {*} colField nombre de la columnas 
        * @param {*} rowEntity datos del item 
        * @param {*} oldValue valor anterior de la columna
        */
        function setCalculoTotales(colField, rowEntity, oldValue) {

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
                    TAX_RATE_CODE
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



        $scope.getImporteTotal = function () {
            if (!$scope.decimal) return
            let total = Number($scope.data.total);
            let transporte = Number($scope.data.transporte);
            let recargo = Number($scope.data.recargo);
            let importeTotal = total + transporte + recargo;
            $scope.data.total = importeTotal;
            return fS.roundNumber(importeTotal, $scope.decimal.importeTotal);
        }

        function isValidForm() {
            if (!$scope.data.codEstab) {
                tS.toastr('warning', 'Seleccione el Establecimiento');
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
                console.log('Error al justar la fecha de Emisión', ajusteFechaEmision)
                return
            }


            if ($scope.cliente.idCliente === 0 && ("razonSocialComprador" in $scope.cliente) && ("nombreComercial")) {
                if (!$scope.cliente.razonSocialComprador || !$scope.cliente.nombreComercial) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }
            } else if (!($scope.cliente.idCliente > 0)) {
                tS.toastr('warning', 'Seleccione el Cliente');
                return
            }

            if ($scope.gridOptions.data.length === 0) {
                tS.toastr('warning', 'Ingrese al menon un artículo en el detalle');
                return
            }

            if ($scope.gridOptions.data.some(row => !(row.idBodega > 0))) {
                tS.toastr('warning', 'Seleccione la bodega en el detalle de los artículos');
                return
            }

            if ($scope.gridOptions.data.some(item => item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor))) {
                for (let item of $scope.gridOptions.data) {
                    if (item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor)) {
                        fS.sweetAlert('warning', `Artículo ${item.descripcion}: La cantidad mínima requerida para la venta al por mayor no se ajusta a la cantidad asignada al artículo.`)
                    }
                }
                return
            }

            return true;
        }


        function isRegister() {
            return (params.action === 'NUEVO' || params.action === 'DUPLICAR');
        }

        function isUpdate() {
            return params.action === 'EDITAR';
        }

        $scope.onSave = async function () {
            try {
                let serieComprobante = null, titleSwal = '', htmlSwal = '', confirmButtonText = '';
                let validateForm = isValidForm()

                if (!validateForm) {
                    throw "Invalid form!";
                }

                // if ($scope.cliente.numeroIdentificacion === NUM_CONSUMIDOR_FINAL && $scope.data.total > 50) {
                //     fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>');
                //     return
                // }

                if (isRegister()) {
                    showLoader();
                    serieComprobante = await proformaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    });
                    hideLoader();
                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                    titleSwal = '<small>Guardar Proforma</small>';
                    confirmButtonText = 'Guardar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;

                } else if (isUpdate()) {
                    serieComprobante = $scope.data.serieComprobante;
                    titleSwal = '<small>Actualizar Proforma</small>';
                    confirmButtonText = 'Actualizar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;
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


                let query = proformaSvc.queryMapper({
                    data: $scope.data,
                    cliente: $scope.cliente,
                    detalles: $scope.gridOptions.data,
                    itemsDeleted: $scope.gridOptionsItemsDeleted,
                })

                //Registar Doc 
                if (isRegister()) {
                    showLoader();
                    proformaSvc.save(query).then(response => {
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response)
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    }).finally(() => hideLoader())
                }

                //Update Doc 
                if (isUpdate()) {
                    showLoader()
                    proformaSvc.update($scope.data.idProforma, query).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            hideLoader();
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.isUpdate = true;
                            $uibModalInstance.close(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())

                }

            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.resultModalDatoAdicional = function (result) {
            $scope.infoAdicionalDocumento = result;
        }

        async function askToSaveStorage() {
            try {
                await storageSvc.askToSaveDetailDoc("storeProformaDetail", $scope.gridOptions.data);
                $uibModalInstance.close();
            } catch (error) {
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
                    showDenyButton: true,
                    confirmButtonText: 'Apartar',
                    denyButtonText: 'Si, salir',
                    cancelButtonText: 'No, cancelar!',
                    focusDeny: true,
                    reverseButtons: false
                }).then(result => {

                    if (result.isConfirmed) {
                        askToSaveStorage();
                    }

                    if (result.isDenied) {
                        $uibModalInstance.close();
                    }

                })
                return
            }
            $uibModalInstance.close();
        }
    }

})(window.angular)