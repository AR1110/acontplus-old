//@ts-check
(function () {

    'use strict';

    const TEMPLATE_URL = '~/Pages/NotaEntrega/';
    let mainDataForm = {};
    let notaEntregaSvc = {};
    let commonSvc = {};
    let tS = {};
    let fS = {};
    let modalSvc = {};
    let TIPO_DOC_NE = {};
    let nombreModalVenta = {}

    app.controller('notaEntregaCtrl', notaEntregaCtrl);

    notaEntregaCtrl.$inject = [
        '$scope',
        '$filter',
        '$injector',
    ];

    function notaEntregaCtrl($scope, $filter, $injector) {
        notaEntregaSvc = $injector.get('notaEntregaService');
        commonSvc = $injector.get('commonService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');
        modalSvc = $injector.get('modalService');
        let nombreModalContabilidad = $injector.get('nombreModalContabilidad');
        nombreModalVenta = $injector.get('nombreModalVenta');

        const nombreModalCommon = $injector.get('nombreModalCommon');
        const $solicitudAutorizacionSvc = $injector.get('solicitudAutorizacionService')

        $scope.dataUserSearch = {
            name: ''
        }

        const CODE_REPORT = $injector.get('CODE_REPORT');

        let DOC_TYPE = $injector.get('DOC_TYPE');
        TIPO_DOC_NE = {
            codigo: DOC_TYPE['NE']
        }


        $scope.codDoc = DOC_TYPE['NE'];

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            order: '',
            tipo: 1,
            pageSize: 10,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
            nroSecuencial: null,
            checkBoxFecha: true,
            busqueda: "",
            byStock: 0,
            convertToDoc: false
        };

        $scope.typeSend = 'GenericFile';

        $scope.permisoEditarDoc = {}

        $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento
        $scope.parametersPrint = {};


        $scope.cliente = {}
        $scope.notaEntregas = [];

        // removed focus new NE
        let btnNewDocument = document.getElementById("btnNewDocument");
        if (btnNewDocument) {
            btnNewDocument.addEventListener("click", () => {
                btnNewDocument.blur();
            })

        }

        $scope.resultRangeFilter = resultRangeFilter;
        $scope.onKeyupCliente = onKeyupCliente;
        $scope.onSelectCliente = onSelectCliente;
        $scope.onKeyupUsuarioSearch = onKeyupUsuarioSearch;
        $scope.selectedUsuarioSearch = selectedUsuarioSearch;
        $scope.onClickBtnMore = onClickBtnMore;
        $scope.searchFilterLocal = searchFilterLocal;
        $scope.getTotales = getTotales;
        $scope.getNotaEntregas = getNotaEntregas;
        $scope.refresh = refresh;
        $scope.initiload = initiload;
        $scope.pageChanged = pageChanged;
        $scope.changePageSize = changePageSize;
        $scope.estabFilter = estabFilter;
        $scope.opcionCobro = opcionCobro;

        $scope.openModalNew = openModalNew;
        $scope.openModalDetalle = openModalDetalle;
        $scope.openModalEdit = openModalEdit;
        $scope.openModalDuplicate = openModalDuplicate;
        $scope.askToDelete = askToDelete;
        $scope.openModalCuota = openModalCuota;
        $scope.print = print;
        $scope.getParamToSendMail = getParamToSendMail;
        $scope.getReport = getReport;

        //========================Start Filters=================

        function resultRangeFilter(item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate
            $scope.getNotaEntregas();
        }



        function onKeyupCliente() {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.idCliente = 0;
                $scope.dataSearch.checkBoxFecha = true;
            }
        }
        function onSelectCliente(item) {
            $scope.dataSearch.idCliente = item.idCliente;
            $scope.dataSearch.checkBoxFecha = true;
            $scope.getNotaEntregas();
        }


        function onKeyupUsuarioSearch() {
            if (!$scope.dataUserSearch.name) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        function selectedUsuarioSearch(item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            $scope.getNotaEntregas()
        }

        function onClickBtnMore() {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }


        function searchFilterLocal() {
            let notaEntregas = JSON.parse(JSON.stringify($scope.cloneNotaEntregas));
            $scope.notaEntregas = $filter("filter")(notaEntregas, $scope.dataSearch.bySearch);
            getTotales();
        }

        //=====================Eend Filters=======================

        function getTotales() {
            let { total, totalAbono, totalSaldo } = notaEntregaSvc.getTotales($scope.notaEntregas)
            $scope.total = fS.roundNumber(total, 5);
            $scope.totalAbono = fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = fS.roundNumber(totalSaldo, 5);

        }


        async function getNotaEntregas() {
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

                if ($scope.dataSearch.infoAdicional) {
                    $scope.dataSearch.checkBoxFecha = false;
                }

                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    byUsuario: $scope.dataSearch.byUsuario,
                    idEstadoPago: $scope.dataSearch.idEstadoPago > 0 ? $scope.dataSearch.idEstadoPago : null,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
                    infoAdicional: $scope.dataSearch.infoAdicional ? $scope.dataSearch.infoAdicional : null,
                    convertToDoc: $scope.dataSearch.convertToDoc
                }


                $scope.notaEntregas = [];
                $scope.cloneNotaEntregas = [];
                getTotales();

                notaEntregaSvc.getAll(dataSearch).then(response => {

                    let { notaEntregas, dataTotals } = response;
                    $scope.notaEntregas = notaEntregas;
                    $scope.cloneNotaEntregas = structuredClone($scope.notaEntregas);

                    $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                    getTotales();

                }).catch(error => {
                    $scope.dataSearch.totalRecords = 0;
                    console.log(error)
                })
            } catch (error) {
                $scope.dataSearch.totalRecords = 0;
                console.log(error)
            }
        }

        function refresh() {
            getNotaEntregas();
        }


        initiload();
        function initiload() {

            notaEntregaSvc.getDataFilter().then(response => {

                $scope.establecimientos = response.estabs;
                $scope.estadoDocumentos = response.estadosDoc;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    getNotaEntregas();
                } else {
                    tS.toastr('warning', 'No tienes asignado Establecimiento!')
                }
            })


            notaEntregaSvc.getDataForm().then(response => {
                mainDataForm = structuredClone(response);
                $scope.permisoEditarDoc = response.permisoEditarDoc;
            })

        }


        function estabFilter() {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
            getNotaEntregas();
        }

        function pageChanged() {
            getNotaEntregas();
        }

        function changePageSize() {
            $scope.dataSearch.pageIndex = 1;
            getNotaEntregas();
        };
        //Filtro de Nota de Entregas localmente


        function validateOperationPrintAndPayment(result) {

            let { isRegister, data } = result;

            $scope.isRegister = isRegister;
            $scope.isPrintDocument = data.printerAutomatic;

            $scope.parametersPrint = {
                ...data,
                codDoc: data.codDoc === '01' ? 'FV' : 'NE',
                idDocument: data.idDocumento,
                codigo: data.codDoc === "01" ? 'RFPT' : 'RNEPT',
            }

            if (data.payAutomatic) {
                if (data.esContado) {
                    cobroRapido(result)
                } else {
                    cobroPorLote(result)
                }
                return
            }

            if (data.printerAutomatic) {
                commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
            }

            getNotaEntregas();
            if (btnNewDocument) {
                btnNewDocument.focus();
            }
        }


        async function openModalNew() {
            try {
                modalSvc.open({
                    controller: 'modalNotaEntregaCtrl',
                    template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                    size: 'xl',
                    params: {
                        action: 'NUEVO'
                    },
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }).result.then(result => {

                    if (typeof result !== 'object') return

                    //Pendiednte ⭕
                    validateOperationPrintAndPayment(result)
                })
            } catch (error) {
                console.log(error)
            }
        }

        async function openModalDetalle(params) {
            try {
                let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
                let ctrl = (await import(fileCtrl))[controller];
                let template = templates['NE'];
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


        function getParamsPermission(item, codigoAccion) {
            return {
                idDocumento: item.idDocumento,
                codigoModulo: item.codDoc,
                codigoAccion,
                infoExtraJson: {
                    serieComprobante: item.serieComprobante,
                    codEstab: item.codEstab,
                    idPuntoEmision: item.idPuntoEmision,
                    nombreModulo: 'Nota Entrega'
                }
            };
        }

        async function openModalRegistrarSolicitudAuth(data) {
            let fileCtrl = nombreModalCommon.SOLICITUD_AUTORIZACION.fileCtrl;
            let ctrl = nombreModalCommon.SOLICITUD_AUTORIZACION.controller;
            let template = nombreModalCommon.SOLICITUD_AUTORIZACION.template;
            let controller = (await import(fileCtrl))[ctrl];

            const { vendedores, config } = mainDataForm;

            let modalRef = modalSvc.open({
                controller,
                template,
                size: 'lg',
                params: {
                    vendedores,
                    esMultipleVendedor: config.multipleVendedor,
                    data,
                },
            })

        }


        async function openModalEdit(item) {
            try {
                if (item.disabledUpdate) {
                    fS.sweetAlert('warning', 'Este documento ya no se puede editar!');
                    return
                }

                // let paramsPermission = getParamsPermission(item, 'E');
                // let response = await userCustomerPermissionSvc.checkHasPermissionToEdit(paramsPermission);

                // if (!response) return

                // if (response && response.code === "2") {
                //     userCustomerPermissionSvc.requestAuthorizationKey(paramsPermission);
                //     return
                // }


                let paramsPermission = getParamsPermission(item, "E");

                const responseCheck = await $solicitudAutorizacionSvc.verifyUserPermission(paramsPermission);

                // let response = await userCustomerPermissionSvc.checkHasPermissionToEdit(
                //     paramsPermission
                // );

                if (responseCheck && responseCheck.code === "2") {
                    openModalRegistrarSolicitudAuth(paramsPermission)
                    // userCustomerPermissionSvc.requestAuthorizationKey(paramsPermission);
                    return;
                }


                notaEntregaSvc.getId(item.idDocumento).then(response => {
                    const modalRef = modalSvc.openModalCustom({
                        controller: 'modalNotaEntregaCtrl',
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
                            getNotaEntregas();
                            if (typeof $scope.permisoEditarDoc === 'object' && $scope.permisoEditarDoc.requiereClave) {
                                // userCustomerPermissionSvc.updateRequestKey(paramsPermission)
                                console.log('update')
                                $solicitudAutorizacionSvc.update(paramsPermission)

                            }

                        }
                    })
                })
                    .catch(error => {
                        console.log(error)
                    })
            } catch (error) {
                console.log(error)
            }
        }



        async function openModalDuplicate(item) {
            try {
                notaEntregaSvc.getId(item.idDocumento).then(response => {
                    let modalRef = modalSvc.openModalCustom({
                        controller: 'modalNotaEntregaCtrl',
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
                            validateOperationPrintAndPayment(result)
                        }
                    })
                })
                    .catch(error => {
                        console.log(error)
                    })
            } catch (error) {
                console.log(error)
            }
        }


        async function askToDelete(item) {
            try {
                if (item.esAnulado) {
                    tS.toastr({
                        type: 'warning',
                        message: 'El documento ya esta anulado!'
                    })
                    return
                }
                if (item.enabledHistorialCobro) {
                    tS.toastr({
                        type: 'warning',
                        message: 'El documento ya se encuentra cobrado!'
                    })
                    return
                }
                if (item.disabledAnular) {
                    tS.toastr({
                        type: 'warning',
                        message: 'El documento ya se encuentra transferida!'
                    })
                    return
                }

                // let paramsPermission = getParamsPermission(item, 'A');
                // let response = await userCustomerPermissionSvc.checkHasPermissionToDelete(paramsPermission);

                // if (!response) return

                // if (response && response.code === "2") {
                //     userCustomerPermissionSvc.requestAuthorizationKey(paramsPermission);
                //     return
                // }


                let paramsPermission = getParamsPermission(item, "A");
                const responseCheck = await $solicitudAutorizacionSvc.verifyUserPermission(paramsPermission);

                if (responseCheck && responseCheck.code === "2") {
                    openModalRegistrarSolicitudAuth(paramsPermission)
                    return;
                }


                let modalRef = modalSvc.openWithComponent({
                    component: 'modalEliminarComponent',
                    size: 'md',
                    params: {
                        id: item.idDocumento,
                        codDoc: 'NE'
                    }
                })
                modalRef.result.then(result => {
                    if (result && typeof result === 'object' && result.esAnulado) {

                        if (typeof $scope.permisoEditarDoc === "object" && $scope.permisoEditarDoc.requiereClave) {
                            // userCustomerPermissionSvc.updateRequestKey(paramsPermission);
                            $solicitudAutorizacionSvc.update(paramsPermission)
                        }
                        getNotaEntregas();
                    }
                })


            } catch (error) {
                console.log(error)
            }
        }

        /**
         *
         * @param {*} result
         */
        function limpiarDatoCobro(result) {
            if (typeof result == 'object' || $scope.isRegister) {
                getNotaEntregas();
            }

            //Cuando el documento es Nuevo o Duplicado
            if ($scope.isPrintDocument == 1) {
                getNotaEntregas();
                commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
                $scope.isPrintDocument = null;
            }

            $scope.isPrintDocument = null;
            $scope.isRegister = null;
            $scope.parametersPrint = {};
            if (btnNewDocument) {
                btnNewDocument.focus();
            }
        }

        /**
         *
         * @param {*} params
         */
        async function cobroRapido(params) {
            try {
                let { fileCtrl, ctrl, template } = nombreModalContabilidad.COBRO_RAPIDO;
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.open({
                    controller,
                    template,
                    params,
                    size: 'lg'
                })

                modalRef.result.then(result => {
                    limpiarDatoCobro(result)
                })
            } catch (error) {

            }
        }

        /**
         *
         * @param {*} params
         */
        async function cobroPorLote(params) {
            try {

                const { fileCtrl, ctrl, template } = nombreModalContabilidad.COBRO_LOTE;
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.open({
                    controller,
                    template,
                    params,
                    size: 'xl'
                })

                modalRef.result.then(result => {
                    limpiarDatoCobro(result)
                })
            } catch (error) {
                console.log(error)
            }
        }


        //--------------------------------------------------COBROS----------

        function opcionCobro(data) {
            if (!data.enabledPayment) {
                tS.toastr({
                    type: 'warning',
                    message: 'Este documento ya se encuentra cobrada!'
                })
                return
            }

            let params = {
                data: structuredClone(data)
            }

            if (data.tiempoCredito) {
                cobroRapido(params)
            } else {
                cobroPorLote(params)
            }
        }


        async function openModalCuota(item) {

            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCuotaCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['MC'];
                let template = nombreModalContabilidad.COBRO.templates['MC'];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params: item,
                    isRenderRazorPartial: true
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object' && result.isReload) {
                        $scope.getNotaEntregas();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }




        function print(item) {
            let parameters = {
                isPrint: 1,
                idDocument: item.idDocumento,
                idTipoDocumento: item.idTipoDocumento,
                codEstab: item.codEstab,
                codDoc: TIPO_DOC_NE.codigo,
                nroIdentificacion: item.nroIdentificacion,
                codigo: 'RNEPT'
            }

            commonSvc.askToPrint({
                parameters: JSON.stringify(parameters)
            })

        }


        $scope.typeSendToMail = 'N'
        function getParamToSendMail(item) {
            return {
                TYPE_NOTIFICATION: 'N',
                codDoc: item.codDoc,
                idDocumento: item.idDocumento,
                serieComprobante: item.serieComprobante,
                correo: item.correo,
                subject: 'Documento Nota Entrega - Acontplus N°: ' + item.serieComprobante,
                json: {
                    hasFile: true,
                    isReport: "SI",
                    reportParams: {
                        hasParams: true,
                        codEstab: item.codEstab,
                        codigo: CODE_REPORT.RNE,
                        format: "pdf"
                    },
                    spParams: {
                        id: item.idDocumento
                    }
                }
            }
        }


        function getReport(item) {
            let format = 'pdf';
            let dataParms = {
                id: item.idDocumento,
                tipo: 1
            }

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: CODE_REPORT.RNE,
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


    app.controller('modalNotaEntregaCtrl', modalNotaEntregaCtrl)
    modalNotaEntregaCtrl.$inject = [
        '$scope',
        '$uibModalInstance',
        '$timeout',
        '$injector',
        'params'
    ];
    function modalNotaEntregaCtrl($scope, $uibModalInstance, $timeout, $injector, params) {
        const docElectSvc = $injector.get('docElectService');
        let ventaSvc = $injector.get('ventaService');
        let clienteSvc = $injector.get('clienteService');
        let gridOptionsSvc = $injector.get('gridOptionsService');
        let storageSvc = $injector.get('storageService');
        let facturaSvc = $injector.get('facturaService');
        let userCustomerPermissionSvc = $injector.get('userCustomerPermissionService');
        let productUtil = $injector.get('productUtil');
        const policyService = $injector.get('PolicyService');


        let infoAdicionalConfig = [];
        let isSetInfoAdicionalConfig = true;

        $scope.tipoDoc = TIPO_DOC_NE;
        $scope.cuotas = [];
        $scope.infoEstabPtoEmi = {};

        $scope.data = {
            idNotaEntrega: 0,
            idBodega: 0,
            idPuntoEmision: 0,
            idTiempoCredito: 0,
            idTarifa: 0,
            fechaEmision: new Date(),
            subTotalIva: 0,
            subTotalIvaCero: 0,
            subTotalExentoIva: 0,
            subTotalNoObjetoIva: 0,
            subTotalNetoIva: 0,
            subTotalNetoIvaCero: 0,
            subTotalNetoExentoIva: 0,
            subTotalNetoNoObjetoIva: 0,
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

        $scope.dataFormaPago = {
            idFormaPagoSri: 0,
            idTiempoCredito: 0,
            plazo: 1,
            total: 0
        }

        $scope.cliente = {};
        $scope.newCustomer = false;

        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.bodegas = [];
        $scope.tarifasImpuesto = [];
        $scope.formasPago = [];
        $scope.tiposIdentificacion = [];

        $scope.cuotas = [];
        $scope.datosAdicionalesArticulo = [];

        //Informacion adicional del documento
        $scope.infoAdicionalDocumento = [];

        //Habilitar cuando la acción es editar
        $scope.isDisabledFormField = false;


        $scope.indexRow = null; //Indice del items del detalle

        $scope.refProductoVenta = new productUtil.ProductoVenta({}, onCallbackDataArticulo, editColCantidad)

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

                if (colDef.field === "idMedida" && rowEntity.idMedida == oldValue) return
                if (colDef.field === "cantidad" && rowEntity.cantidad == oldValue) return

                //Verificacion del stock
                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }
                if (colDef.field === 'cantidad' && rowEntity.cantidad !== oldValue && rowEntity.cantidad > oldValue) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }
                if (colDef.field === 'idBodega' && rowEntity.idBodega !== oldValue) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }

                setCalculoTotales(colDef.field, rowEntity, oldValue);
                updateRefProductoVenta()

            })
        }

        $scope.gridOptionsItemsDeleted = [];
        /**
         * Comprueba la notificación de stock al modificar un campo en una fila de la cuadrícula.
         * @param {string} field - Campo modificado.
         * @param {*} rowEntity - Objeto de fila actual.
         * @param {*} oldValue - Valor anterior del campo modificado.
         */

        function checkNotificationStock(field, rowEntity, oldValue) {
            try {

                // Si la fila no lleva inventario, realiza cálculos totales y termina la función.
                if (!rowEntity.llevaInventario) {
                    setCalculoTotales(field, rowEntity, oldValue);
                    return;
                }

                $scope.refProductoVenta.onCantidadEdit({
                    items: $scope.gridOptions.data,
                    row: rowEntity,
                    oldValue,
                    field
                })

            } catch (error) {
                console.log(error);
            }
        }

        $scope.refreshUserPermission = function () {
            userCustomerPermissionSvc.fetchUserPermission().then(response => {
                const { porcentajeDescuento, descuento } = response.detalle;

                for (let item of $scope.gridOptions.columnDefs) {
                    if (["porcentajeDescuento"].includes(item.field)) {
                        item.visible = porcentajeDescuento;
                    }
                    if (item.field === "valorDescuento") {
                        item.visible = descuento;


                    }
                }
                $scope.gridApi.core.refresh();
            }).catch(error => {
                console.log(error)
            })
        }

        $scope.setInfoEstabPtoEmi = function () {
            if ($scope.establecimientos.length > 0) {
                $scope.infoEstabPtoEmi.nombreComercial = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab).nombreComercial;
            }

            if ($scope.puntosEmision.length > 0) {
                $scope.infoEstabPtoEmi.puntoEmision = $scope.puntosEmision.find(item => item.idPuntoEmision === $scope.data.idPuntoEmision).ptoEmi;
            }
            setInfoAdicional();
        }

        function setInfoAdicional() {
            if (isSetInfoAdicionalConfig) {
                $scope.infoAdicionalDocumento = $scope.infoAdicionalDocumento.filter(
                    (d) => !(d.idPuntoEmision > 0)
                );

                let dataInfoAdicional = infoAdicionalConfig.find(
                    (i) => i.idPuntoEmision === $scope.data.idPuntoEmision
                );
                if (!dataInfoAdicional) return;
                let infoAdicionPtoEmi = dataInfoAdicional.infoAdicional.map((i) => {
                    return {
                        ...i,
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    };
                });
                $scope.infoAdicionalDocumento = [
                    ...infoAdicionPtoEmi,
                    ...$scope.infoAdicionalDocumento,
                ];
            }
            isSetInfoAdicionalConfig = true;
        }

        function calculateTotalItems(items) {
            return items.map(item => {
                return {
                    ...item,
                    idNotaEntregaDetalle: params.action === "DUPLICAR" ? 0 : item.idNotaEntregaDetalle,
                    precioConIva: fS.roundNumber(item.precioConIva, $scope.decimal.nroPrecio),
                }

            })
        }


        function getIndexRow(row) {
            return $scope.gridOptions.data.findIndex(item => item.uniqueRowDetalle === row.uniqueRowDetalle)
        }
        /**
         *
         * @param {*} nuevaFilaAgregada
         */
        function addItem(nuevaFilaAgregada) {
            $scope.gridOptions.data.push(nuevaFilaAgregada)
            setCalculoTotales('precioUnitario', nuevaFilaAgregada, 0);
            focusColumnCantidad(getIndexRow(nuevaFilaAgregada), nuevaFilaAgregada.llevaInventario);
            updateRefProductoVenta();
        }

        function updateItem(nuevaFilaAgregada) {

            // Actualizar el elemento en los datos de gridOptions basado en uniqueRowDetalle
            $scope.gridOptions.data = $scope.gridOptions.data.map(item =>
                item.uniqueRowDetalle === nuevaFilaAgregada.uniqueRowDetalle
                    ? { ...item, ...nuevaFilaAgregada }  // Actualiza la fila si coincide el uniqueRowDetalle
                    : item  // Mantiene el item sin cambios si no coincide
            );

            // Buscar la fila actualizada
            const dataActualizarFile = $scope.gridOptions.data.find(item =>
                item.uniqueRowDetalle === nuevaFilaAgregada.uniqueRowDetalle
            );

            if (dataActualizarFile) {
                // Realiza el cálculo de los totales basándose en 'precioUnitario'
                setCalculoTotales('precioUnitario', dataActualizarFile, 0);
                focusColumnCantidad(getIndexRow(nuevaFilaAgregada), nuevaFilaAgregada.llevaInventario);
            }

            // Actualiza la referencia del producto vendido
            updateRefProductoVenta();

            // Muestra una notificación de éxito
            tS.toastr({
                type: 'success',
                message: 'Fila actualizada correctamente'
            });
        }


        // Función para manejar la confirmación del usuario y el código de respuesta
        /**
         * @param {string} code
         * @param {any} nuevaFilaAgregada
         * @param {any} agregarFila
         * @param {undefined} [focusSearch]
         */
        function handleConfirmation(code, nuevaFilaAgregada, agregarFila, focusSearch) {
            if (code === "0" && focusSearch) {
                setFocusArticulo();
            }
            if (code === "2") {
                if (agregarFila) {
                    addItem(nuevaFilaAgregada);
                } else {
                    updateItem(nuevaFilaAgregada);
                }
            }
        };


        async function onCallbackDataArticulo(data) {

            const { nuevaFilaAgregada, verificarStockResponse, agregarFila, focusSearch } = data;

            if (!nuevaFilaAgregada.llevaInventario && agregarFila) {
                addItem(nuevaFilaAgregada)
                return;
            }


            const { code, message, titleSms } = verificarStockResponse;
            // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
            if (code === "1") {
                if (agregarFila) {
                    addItem(nuevaFilaAgregada)
                } else {
                    updateItem(nuevaFilaAgregada);
                }
                return;
            }

            // Muestra un mensaje de advertencia y espera la confirmación del usuario.
            Swal.fire({
                title: `<small>${titleSms}</small>`,
                icon: 'warning',
                html: `<small>${message}</small>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(r => {
                if (r.isConfirmed) {
                    handleConfirmation(code, nuevaFilaAgregada, agregarFila, focusSearch);
                }
            })
        }

        function editColCantidad(data) {
            const {
                row,
                verificarStockResponse,
                oldValue,
                field
            } = data;

            const { code, message, titleSms } = verificarStockResponse;

            if (code === "1") {
                setCalculoTotales(field, row, oldValue);
                updateRefProductoVenta()
                return
            }

            Swal.fire({
                title: `<small>${titleSms}</small>`,
                icon: 'warning',
                html: `<small>${message}</small>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(result => {
                if (result.isConfirmed) {
                    if (code === "0") {
                        row[field] = oldValue;
                        setCalculoTotales(field, row, oldValue);
                        let el = document.getElementById("#custom-template-md-autocomplete-articulo")
                        if (el) {
                            el.focus();
                        }
                    }
                    if (code === "2") {
                        setCalculoTotales(field, row, oldValue);
                    }
                    updateRefProductoVenta()
                    $scope.$apply()
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
                clienteDefault,
                formasPago,
                tiposIdentificacion,
                infoAdicional
            } = structuredClone(mainDataForm);
            let dataEstab = {};

            $scope.establecimientos = estabs;
            $scope.formasPago = formasPago;
            $scope.tiposIdentificacion = tiposIdentificacion;

            if (params && ["EDITAR", "DUPLICAR"].includes(params.action)) {
                const { comprobante } = params.data;
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
            infoAdicionalConfig = infoAdicional;

            if (params && params.action === "NUEVO") {
                if ($scope.puntosEmision.length > 0) {
                    let dataPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi));
                    $scope.data.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                }
                if ($scope.tiemposCredito.length > 0) {
                    let dataTiempoCredito = $scope.tiemposCredito[0];

                    $scope.data.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;

                    //Formas Pago
                    $scope.dataFormaPago.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.dataFormaPago.plazo = dataTiempoCredito.diasCredito;
                }

                //Por defecto tomamos SIN UTILIZACION DEL SISTEMA FINANCIERO
                setDefaultFormPagoSri()


                if ($scope.vendedores.length > 0 && !$scope.config.multipleVendedor) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }
                //Cliente Predeterminado
                if (clienteDefault.idCliente > 0) {
                    $scope.cliente = clienteDefault;

                }

                getFechaVencimiento();
            }

            //Cuando el documento es duplicar
            if (params && params.action === 'DUPLICAR') {
                const {
                    comprobante,
                    cliente,
                    items,
                    infoAdicionalDocumento,
                } = params.data;

                $scope.data = structuredClone(comprobante);
                $scope.data.fechaEmision = new Date();
                $scope.data.idNotaEntrega = 0;
                getFechaVencimiento();

                $scope.dataClone.codEstab = $scope.data.codEstab;
                $scope.gridOptions.data = calculateTotalItems(items);

                $scope.data.fechaEmisionEscrita = fS.getFechaEscrita($scope.data.fechaEmision);
                $scope.data.fechaVencimientoEscrita = fS.getFechaEscrita($scope.data.fechaVencimiento);

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                $scope.cliente = cliente;
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;


                if ($scope.data.idTiempoCredito > 0) {
                    let dataTiempoCredito = $scope.tiemposCredito.find(tc => tc.idTiempoCredito === $scope.data.idTiempoCredito);
                    if (dataTiempoCredito) {
                        //Formas Pago
                        $scope.dataFormaPago.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                        $scope.dataFormaPago.plazo = dataTiempoCredito.diasCredito;
                    }
                }
                setDefaultFormPagoSri()
                isSetInfoAdicionalConfig = false;
                counterGridOptions();
            }


            //Cuando el documento es editar
            if (params && params.action === 'EDITAR') {
                const {
                    comprobante,
                    cliente,
                    items,
                    infoAdicionalDocumento,
                    cuotas
                } = params.data;

                $scope.data = structuredClone(comprobante);
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;
                // getFechaVencimiento();

                $scope.dataClone.codEstab = $scope.data.codEstab;
                $scope.gridOptions.data = calculateTotalItems(items);

                $scope.data.fechaEmisionEscrita = fS.getFechaEscrita($scope.data.fechaEmision);
                $scope.data.fechaVencimientoEscrita = fS.getFechaEscrita($scope.data.fechaVencimiento);

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                $scope.cliente = cliente;
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;
                counterGridOptions();
                $scope.isDisabledFormField = true;
                isSetInfoAdicionalConfig = false;
                // Cuotas
                $scope.cuotas = cuotas;
            }


            if ($scope.bodegas.length > 0) {
                let dataBodega = $scope.bodegas.find(bodega => (bodega.defaultBodega));
                $scope.data.idBodega = dataBodega.idBodega;
                $scope.dataClone.idBodega = $scope.data.idBodega;
            }
            if ($scope.tarifas.length > 0) {
                $scope.data.idTarifa = $scope.tarifas[0].idTarifa;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;
            }



            updateRefProductoVenta();


            $uibModalInstance.rendered.then(() => {
                let inputBarcodeEle = document.getElementById("inputBarcode");
                let customTempArticuloSearch = document.getElementById("custom-template-md-autocomplete-articulo");
                if ($scope.config.searchCode && inputBarcodeEle) {
                    inputBarcodeEle.focus();

                } else if (customTempArticuloSearch) {
                    customTempArticuloSearch.focus();
                }
            });

            if (params.action === "NUEVO" && !($scope.data.idNotaEntrega > 0)) {
                if (Object.keys(storageSvc.getObject("notaEntregaDetail")).length > 0) {
                    storageSvc.restoreInvoiceDetail("notaEntregaDetail").then(result => {
                        if (result.isConfirmed) {
                            $scope.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value]);
                            delete result.dataInvoiceDetail[result.value];

                            storageSvc.setObject("notaEntregaDetail", result.dataInvoiceDetail)

                            updateRefProductoVenta();

                            drawInfoGeneralNotaEntrega();
                            $scope.$apply();
                        }

                    })
                }
            }




            $scope.setInfoEstabPtoEmi();

            $uibModalInstance.rendered.then(() => {
                drawInfoGeneralNotaEntrega();
            });
        }

        function setDefaultFormPagoSri() {
            if ($scope.formasPago.length > 0) {
                let dataFormaPago = $scope.formasPago.find(item => {
                    if ($scope.config.idFormaPagoSri > 0) {
                        return (item.idFormaPagoSri === $scope.config.idFormaPagoSri);
                    } else {
                        return (item.codigo === '01');
                    }
                });
                if (dataFormaPago) {
                    $scope.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
                }
            }

        }



        function updateRefProductoVenta() {
            $scope.refProductoVenta.setOptions({
                items: $scope.gridOptions.data,
                nroPrecio: $scope.decimal.nroPrecio,
                idTarifa: $scope.data.idTarifa,
                idBodega: $scope.data.idBodega,
                tiposIva: $scope.tarifasImpuesto,
                fechaEmision: $scope.data.fechaEmision,
                duplicarItem: $scope.config.detailDuplicate,
                addRow,
                updateItem
            })
        }

        $scope.getAllTiempoCredito = function () {
            notaEntregaSvc.getDataForm().then(response => {
                $scope.tiemposCredito = response.tiemposCredito;
            })
        }



        function getFechaVencimiento() {
            if ($scope.data.fechaEmision && $scope.tiemposCredito.length > 0) {
                let fechaEmision = fS.setHoursToDate($scope.data.fechaEmision)

                let dataTiempoCredito = $scope.tiemposCredito.find(item => item.idTiempoCredito === $scope.data.idTiempoCredito);
                let diasCredito = typeof dataTiempoCredito === 'object' ? dataTiempoCredito.diasCredito : 0;

                let {
                    fechaVencimiento,
                    fechaEmisionEscrita,
                    fechaVencimientoEscrita
                } = fS.sumarDiasAFecha(fechaEmision, diasCredito);

                // let formattedDateTime = fS.formatDateMoment(fechaVencimiento)

                $scope.data.fechaVencimiento = new Date(fechaVencimiento);
                $scope.data.fechaEmisionEscrita = fechaEmisionEscrita;
                $scope.data.fechaVencimientoEscrita = fechaVencimientoEscrita;

                //Variables temporales
                $scope.dataClone.fechaEmision = fechaEmision;
                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;

                //Formas pago
                $scope.dataFormaPago.idTiempoCredito = $scope.data.idTiempoCredito;
                $scope.dataFormaPago.plazo = diasCredito;
            }
        }

        $scope.resultModalAdicional = function (result) {
            let { infoAdicionalDoc } = result;
            $scope.infoAdicionalDocumento = infoAdicionalDoc;
        }

        function setColumnDefs() {

            const ventaDetailPermission = $scope.permisoDetalleVenta
            const CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a update-article ng-click="grid.appScope.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >

        <view-kardex params="row.entity"></view-kardex>

        <a action-info-adicional-articulo-venta
            entity="row.entity"
            style="cursor:pointer;"
            ng-if='row.entity.datosAdicionales'
            result-modal-adicional="grid.appScope.resultModalAdicional(result)"
            info-adicional-doc="grid.appScope.infoAdicionalDocumento"
            class="btn btn-warning btn-xs text-white"
            title = "Agregar dato Adicional">
            <i class="fas fa-tags"></i>
        </a>`;

            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '12%',
                minWidth: '100',
                cellTemplate: isRegister() ? CELL_TEMPLATE_OPTION : '',
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
                enableCellEdit: isRegister(),
                enableCellEditOnFocus: isRegister(),
                cellEditableCondition: function (scope) {
                    if (isRegister()) {
                        return scope.row.entity.llevaInventario !== true;
                    }
                    return false;
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
                enableCellEdit: isRegister(),
                enableCellEditOnFocus: isRegister(),
                type: 'number',
                width: '6%',
                minWidth: '50'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: isRegister() && ventaDetailPermission.medida,
                enableCellEditOnFocus: isRegister() && ventaDetailPermission.medida,
                allowCellFocus: isRegister() && ventaDetailPermission.medida,
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
                name: 'I.V.A',
                field: 'idTipoIva',
                width: '8%',
                minWidth: '100',
                type: 'number',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: isRegister() && ventaDetailPermission.tipoIva,
                allowCellFocus: isRegister() && ventaDetailPermission.tipoIva,
                enableCellEditOnFocus: isRegister() && ventaDetailPermission.tipoIva,
                //    visible: config.porcentajeIva
            },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                width: '9%',
                minWidth: '80',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: isRegister() && ventaDetailPermission.tarifa,
                enableCellEditOnFocus: isRegister() && ventaDetailPermission.tarifa,
                allowCellFocus: isRegister() && ventaDetailPermission.tarifa,
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
                enableCellEditOnFocus: isRegister(),
                enableColumnMenu: false,
                allowCellFocus: isRegister(),
                type: 'number',
                width: '8%',
                minWidth: '90',
                cellEditableCondition: function (scope) {
                    if (isRegister()) {
                        return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario : true;
                    }
                    return false;
                },
                // cellFilter: "currency:'$'",
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                min: 0,
                type: 'number',
                enableCellEdit: isRegister(),
                allowCellFocus: isRegister(),
                enableCellEditOnFocus: isRegister(),
                width: '7%',
                minWidth: '90',
                cellEditableCondition: function (scope) {
                    if (isRegister()) {
                        return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva : true;
                    }
                    return false;
                },
                // cellFilter: "currency:'$'",
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                // enableCellEdit: ventaDetailPermission.porcentajeDescuento,
                // allowCellFocus: ventaDetailPermission.porcentajeDescuento,
                // enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento,
                enableCellEdit: isRegister(),
                allowCellFocus: isRegister(),
                enableCellEditOnFocus: isRegister(),

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
                // enableCellEdit: ventaDetailPermission.descuento,
                // enableCellEditOnFocus: ventaDetailPermission.descuento,
                // allowCellFocus: ventaDetailPermission.descuento,
                enableCellEdit: isRegister(),
                enableCellEditOnFocus: isRegister(),
                allowCellFocus: isRegister(),
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
                cellFilter: fS.cellFilterRoundToNumber(),
                cellTooltip: function (row, col) {
                    return fS.cellTooltipGrid(row.entity, col.field)
                },
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
                cellFilter: fS.cellFilterRoundToNumber(),
                cellTooltip: function (row, col) {
                    return fS.cellTooltipGrid(row.entity, col.field)
                },
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
                cellFilter: fS.cellFilterRoundToNumber(),
                cellTooltip: function (row, col) {
                    return fS.cellTooltipGrid(row.entity, col.field)
                },
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
                enableCellEdit: isRegister(),
                enableCellEditOnFocus: isRegister(),
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
                enableCellEdit: isRegister(),
                enableCellEditOnFocus: isRegister(),
                type: 'number',
                width: '11%',
                minWidth: '100'
            },
            ]

            setWarehouseAndIVA();
        }

        function setFocusInputBarcode() {
            $timeout(function () {
                let el = document.getElementById('inputBarcode')
                if (el) {
                    el.focus();
                }
            }, 100);
        }

        function setFocusArticulo() {
            $timeout(function () {
                let el = document.getElementById('custom-template-md-autocomplete-articulo')
                if (el) {
                    el.focus();
                }
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

            updateRefProductoVenta()
        }

        /**
         *
         * @param {*} rowEntity
         */
        $scope.deleteRow = async function (rowEntity) {
            try {
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptions.data.indexOf(rowEntity);
                    $scope.gridOptions.data.splice(index, 1);
                    updateStatusDatosAdicionalesArticulo(rowEntity);

                    if (rowEntity.idNotaEntregaDetalle > 0) {
                        $scope.gridOptionsItemsDeleted.push({
                            ...rowEntity,
                            cantidad: rowEntity.cantidadOriginal,
                            estado: 0
                        });
                    }

                    //Recalculamos los totales
                    setCalculoTotales("cantidad", rowEntity, 0);
                    counterGridOptions();
                    updateRefProductoVenta()
                    $scope.$apply();
                }

                if (isConfirmed && rowEntity.datosAdicionales) {
                    $scope.infoAdicionalDocumento = $scope.infoAdicionalDocumento.filter(ia => {
                        return !(rowEntity.datosAdicionalesArticulo.some(iaa => iaa.idInfoAdicional === ia.idInfoAdicional))
                    });
                }
            } catch (error) {
                console.log(error)
            }

        }

        function updateStatusDatosAdicionalesArticulo(rowEntity) {
            for (let item of rowEntity.datosAdicionalesArticulo) {
                item.selected = false;
            }
        }


        $scope.openModalArticle = function (item) {
            // if ($scope.config.detailDuplicate) {
            //     fS.sweetAlert('warning', 'No disponible para editar el artículo cuando se ha seleccionado <b>Duplicar Artículo</b>.');
            //     return
            // }
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )

            $scope.refProductoVenta.openModalArticulo(item);
        }

        function setIdBodegaInDetalle() {
            for (let item of $scope.gridOptions.data) {
                item.idBodega = $scope.data.idBodega;
            }

            updateRefProductoVenta()
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
                if (!($scope.bodegas.length > 0)) {
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



        $scope.onChangeTiempoCredito = function () {
            if (!$scope.permisoComprobanteVenta.tiempoCredito) {
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                return
            }
            getFechaVencimiento();
        }

        $scope.onChangeFechaEmision = function () {
            try {
                if (!$scope.permisoComprobanteVenta.fechaEmision) {
                    $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
                    tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                    return
                }
                getFechaVencimiento();
            } catch (error) {
                console.log(error)
                $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
            }

            updateRefProductoVenta()
        }

        //==============================START CUSTOMER===========================
        $scope.onKeyupCustomer = function () {
            if (!$scope.cliente.nombreFiscal) {
                $scope.cliente = {};
            }

        }
        $scope.onSelectedClienteChange = async function (item) {
            try {

                if (!item.validationSri && ['R', 'C'].includes(item.tipoIdentificacion)) {
                    Swal.fire({
                        icon: 'warning',
                        html: 'Datos Incorrectos!',
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Actualizar con el SRI!.',
                        cancelButtonText: 'Cancelar'
                    }).then(async result => {
                        if (result.isConfirmed) {
                            let { fileCtrl, controllers, templates } = nombreModalVenta.CLIENTE;
                            let ctrl = (await import(fileCtrl))[controllers['M']];
                            let template = templates['M'];

                            let modalRef = modalSvc.openModalCustom({
                                controller: ctrl,
                                template,
                                size: 'xl',
                                params: {
                                    ...item,
                                    isUpdateDataCustomerFromSRI: true
                                },
                                isRenderRazorPartial: true
                            })

                            modalRef.result.then(result => {
                                if (typeof result === 'object') {
                                    setCustomerData(item)
                                }
                            })
                        }
                    })
                    return
                }

                if (['R', 'C', 'P'].includes(item.tipoIdentificacion) && $scope.notificacionVenta.notificacionVenta) {
                    let isPendientAccount = await ventaSvc.verifyPendientAccount({
                        idCliente: item.idCliente
                    });
                    if (isPendientAccount) {
                        setCustomerData(item);
                    } else {
                        setCustomerData(item);
                    }
                } else {
                    setCustomerData(item)
                }
            } catch (error) {
                $scope.cliente = {};
                console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
                $scope.$apply();
            }
        }


        async function setCustomerData(item) {
            let dataCliente = await clienteSvc.findById(item.idCliente);
            $scope.cliente = dataCliente;
            if (!($scope.data.idNotaEntrega > 0)) {
                if (($scope.cliente.idTiempoCredito > 0)) {
                    $scope.data.idTiempoCredito = $scope.cliente.idTiempoCredito || 0;
                }
                $scope.data.fechaEmision = new Date();
                getFechaVencimiento();
            }
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

                    if ($scope.gridOptions.data.length > 0) {
                        setIdBodegaInDetalle();
                        resetCantidadToZeroAndRecalculateTotals();
                    }

                    $scope.$apply();
                } else {
                    $scope.data.idBodega = $scope.dataClone.idBodega;
                    $scope.$apply();
                }

                updateRefProductoVenta()
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
                drawInfoGeneralNotaEntrega();
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
                    drawInfoGeneralNotaEntrega();
                }
                updateRefProductoVenta()

                $scope.$apply();

            } else {
                $scope.data.idTarifa = $scope.dataClone.idTarifa;
                updateRefProductoVenta()
                $scope.$apply();
            }
        }

        //=================================START PRODUCT=======================================
        function addRow() {
            const obj = {
                uniqueRowDetalle: fS.generateUuidv4(),
                idNotaEntregaDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 0,
                cantidadStock: 0,
                codigoPorcentaje: "",
                tarifa: 0,
                articuloTarifas: [],
                idTarifa: 0,
                precioUnitario: 0,
                precioConIva: 0,
                porcentajeDescuento: 0,
                precioCostoFraccionado: 0,
                valorDescuento: 0,
                totalDescuento: 0,
                ice: 0,
                idBodega: 0,
                total: 0,
                nota: null,
                llevaInventario: false,
                datosAdicionales: false,
                estado: 1
            }
            return structuredClone(obj);
        }


        function focusColumnCantidad(index, llevaInventario) {
            let indexCol = 0;

            if (($scope.config.searchCode == 1)) {
                setFocusInputBarcode();
                return
            }

            if (llevaInventario) {
                indexCol = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'cantidad')
            } else {
                indexCol = $scope.gridOptions.columnDefs.findIndex(item => item.field === 'descripcion')
            }
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )
            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[index],
                    $scope.gridOptions.columnDefs[indexCol]
                );
            }, 30)

            counterGridOptions()
        }

        //=================================END PRODUCT=======================================

        function counterGridOptions() {
            $scope.gridOptions.data.forEach((item, index) => {
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
            drawInfoGeneralNotaEntrega();
            return rowEntity;
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
                drawInfoGeneralNotaEntrega();
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
                    drawInfoGeneralNotaEntrega();
                } else {
                    tS.toastr('warning', 'El Valor Descuento no puede ser mayor al total');
                }
            } catch (error) {
                console.log("CALCULO DE TOTAL DESCUENTO", error)
            }
        }

        // * Add by Ignacio Manchu.
        function drawInfoGeneralNotaEntrega() {
            try {
                let dataImpuestoTotales = gridOptionsSvc.getImpuestoTotales({
                    items: $scope.gridOptions.data,
                    decimal: $scope.decimal,
                    tarifasImpuesto: $scope.tarifasImpuesto.slice(),
                });
                let {
                    subTotalSinImpuestos,
                    irbpnr,
                    importeTotal,
                    totalDescuento,
                    porcentajeDescuento,
                    propina,
                } = dataImpuestoTotales;

                const htmlTemplate = gridOptionsSvc.impuestoTotalesHtml(dataImpuestoTotales);
                const element = document.getElementById('draw-dynamic-subtotal');
                if (element) {
                    element.innerHTML = htmlTemplate;
                }

                $scope.data.subTotalSinImpuestos = subTotalSinImpuestos;
                $scope.data.total = importeTotal;
                $scope.data.totalDescuento = totalDescuento;
                $scope.data.porcentajeDescuento = porcentajeDescuento;
                $scope.data.irbpnr = irbpnr
                $scope.data.propina = propina;

                //Forma Pago
                $scope.dataFormaPago.total = importeTotal;

                updateRefProductoVenta()

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
            $scope.dataFormaPago.total = fS.roundNumber(importeTotal, $scope.decimal.importeTotal)
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
            if (!($scope.data.idTiempoCredito > 0)) {
                tS.toastr('warning', 'Seleccione el Tiempo Credito');
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


            if (!(fS.isDateValid($scope.data.fechaVencimiento))) {
                tS.toastr('warning', 'Seleccione la Fecha de vencimiento');
                return
            }
            if ($scope.cliente.idCliente === 0 && ("razonSocialComprador" in $scope.cliente) && ("nombreComercial")) {
                if (!($scope.cliente.idTipoIdentificacion > 0)) {
                    tS.toastr('warning', `idTipoIdentificacion no proporcionada: ${$scope.cliente.idTipoIdentificacion} `);
                    return
                }
                if (!$scope.cliente.razonSocialComprador || !$scope.cliente.nombreComercial) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }
            } else if (!($scope.cliente.idCliente > 0)) {
                tS.toastr('warning', 'Seleccione el Cliente');
                return
            }

            if (!($scope.data.idUsuario > 0)) {
                tS.toastr('warning', 'Seleccione el Vendedor');
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

            if ($scope.gridOptions.data.some(item => item.articuloTarifas.some(
                ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor)
            )) {
                for (let item of $scope.gridOptions.data) {
                    if (item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor)) {
                        fS.sweetAlert('warning', `Artículo ${item.descripcion}: La cantidad mínima requerida para la venta al por mayor no se ajusta a la cantidad asignada al artículo.`)
                    }
                }
                return
            }

            if ($scope.data.total === 0 || $scope.data.total < 0) {
                tS.toastr('warning', 'No se puede generar el documento con valor total 0!');
                return
            }

            if ($scope.infoAdicionalDocumento.length > 0) {
                if ($scope.infoAdicionalDocumento.some(item => !fS.isValidField(item.nombre) || !fS.isValidField(item.valor))) {
                    tS.toastr(
                        "warning",
                        "En información adicional del documento algunos campos estan vaciós"
                    );
                    return;
                }
            }

            return true;
        }

        $scope.isRegister = isRegister;
        $scope.isUpdate = isUpdate;

        function isRegister() {
            return (params.action === 'NUEVO' || params.action === 'DUPLICAR');
        }

        function isUpdate() {
            return params.action === 'EDITAR';
        }

        const validateCuota = function () {
            let objParamsCuota = {
                fechaEmision: $scope.data.fechaEmision,
                tiemposCredito: $scope.tiemposCredito,
                idTiempoCredito: $scope.data.idTiempoCredito,
                montoTotal: $scope.data.total,
                cuotas: $scope.cuotas
            }
            let cuotas = [];
            let montoTotalCuota = 0;

            if (isRegister()) {
                let dataCuota = fS.calcularCuotas(objParamsCuota);
                cuotas = dataCuota.cuotas;
                montoTotalCuota = dataCuota.montoTotalCuota;

            }
            if (isUpdate()) {
                let dataCuota = fS.updateCuotas(objParamsCuota)
                cuotas = dataCuota.cuotas;
                montoTotalCuota = dataCuota.montoTotalCuota;
            }

            if (fS.roundNumber(montoTotalCuota, 2) !== fS.roundNumber($scope.data.total, 2)) {
                tS.toastr('warning', 'No coincide el total de la cuota con el importe total del documento.');
                return [];
            }

            return cuotas;
        }


        function isValidTotals() {
            let {
                subTotalSinImpuestos,
                importeTotal,
                totalDescuento,
            } = gridOptionsSvc.getImpuestoTotales({
                items: $scope.gridOptions.data,
                decimal: $scope.decimal,
                tarifasImpuesto: $scope.tarifasImpuesto.slice(),
            });

            if ($scope.data.subTotalSinImpuestos !== subTotalSinImpuestos) {
                tS.toastr('warning', `El valor del Subtotal sin impuestos: ${$scope.data.subTotalSinImpuestos} difiere del valor del Subtotal sin impuestos en el detalle: ${subTotalSinImpuestos}`);
                return;
            }

            if ($scope.data.totalDescuento !== totalDescuento) {
                tS.toastr('warning', `El valor total del descuento: ${$scope.data.totalDescuento} no coincide con el descuento total calculado en el detalle: ${totalDescuento}`);
                return;
            }

            if ($scope.data.total !== importeTotal) {
                tS.toastr('warning', `El valor del importe total: ${$scope.data.total} difiere del importe total calculado en el detalle: ${importeTotal}`);
                return;
            }

            return true;
        }



        // Función para registrar el documento
        const registerAndUpdateNotaEntrega = async (query) => {

            if (isRegister()) {
                return await notaEntregaSvc.save(query);
            }

            if (isUpdate()) {
                return await notaEntregaSvc.update($scope.data.idNotaEntrega, query);
            }
        };





        $scope.onSave = async function () {
            try {
                let serieComprobante = null, titleSwal = '', htmlSwal = '', confirmButtonText = '';
                let validateForm = isValidForm()

                if (!validateForm) {
                    throw "Invalid form!";
                }

                if (!isValidTotals()) return

                let cuotas = validateCuota();

                if (cuotas && cuotas.length === 0) return

                if (isRegister()) {
                    serieComprobante = await notaEntregaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    })
                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                    titleSwal = '<small>Guardar Nota de Entrega</small>';
                    confirmButtonText = 'Guardar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;

                } else if (isUpdate()) {
                    serieComprobante = $scope.data.serieComprobante;
                    titleSwal = '<small>Actualizar Nota de Entrega</small>';
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

                let query = notaEntregaSvc.queryMapper({
                    data: $scope.data,
                    cliente: $scope.cliente,
                    detalles: $scope.gridOptions.data,
                    itemsDeleted: $scope.gridOptionsItemsDeleted,
                    infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                    cuotas
                })


                //Registar Doc
                if (isRegister()) {

                    const managedRegister = fS.fetchManager(registerAndUpdateNotaEntrega);

                    // Llamar a la función gestionada para registrar
                    managedRegister(query).then(response => {
                        if (response) { // Verificar si hay respuesta
                            if (response.code === '0') {
                                fS.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.code === "1") {
                                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                let mainData = {
                                    isRegister: true,
                                    data: response.dataResponse,
                                };
                                $uibModalInstance.close(mainData);
                            }
                        }
                    }).catch(error => {
                        console.log(error); // Manejo de errores
                    })
                }

                //Update Doc
                if (isUpdate()) {

                    const managedUpdate = fS.fetchManager(registerAndUpdateNotaEntrega);
                    // Llamar a la función gestionada para actualizar
                    managedUpdate(query).then(response => {
                        if (response) { // Verificar si hay respuesta
                            if (response.code === '0') {
                                fS.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.code === "1") {
                                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                $uibModalInstance.close(response);
                            }
                        }
                    }).catch(error => {
                        console.log(error); // Manejo de errores
                    })


                }
            } catch (error) {
                console.log(error)
            }
        }


        function setDataChangeFormaPago() {
            let dataFormaPago = $scope.formasPago.find(item => item.idFormaPagoSri === $scope.dataFormaPago.idFormaPagoSri);
            let el = document.getElementById('infoReferenciaFormaPago')
            if (el) {
                el.innerHTML = dataFormaPago.infoReferencia;
            }
        }
        $scope.onSaveInvoice = async function () {
            try {
                let serieComprobante = null, titleSwal = '', htmlSwal = '', confirmButtonText = '';
                let validateForm = isValidForm()

                if (!validateForm) {
                    throw "Invalid form!";
                }

                let cuotas = validateCuota();

                if (cuotas && cuotas.length === 0) return

                await policyService.sendMaxDocuments();


                Swal.fire({
                    title: '<small>Seleccionar forma de pago: </small>',
                    html: `
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Forma de Pago</th>
                                        <th>Plazo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <select ng-model="dataFormaPago.idFormaPagoSri" id="formaDePago" class="form-control border-select" name="formaDePago">
                                                ${$scope.formasPago.map((item) => `<option value="${item.idFormaPagoSri}">
                                                    ${item.descripcion}
                                                </option>`)}

                                            </select>
                                            <span class="d-flex justify-content-center text-info" id="infoReferenciaFormaPago"></span>
                                        </td>
                                        <td width="100px">
                                            ${$scope.dataFormaPago.plazo} ${$scope.dataFormaPago.plazo > 1 ? 'Días' : 'Día'}
                                        </td>
                                        <td width="100px">
                                            $${$scope.dataFormaPago.total}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `,
                    didOpen: () => {
                        let el = document.getElementById('formaDePago');
                        if ($scope.cliente.idFormaPagoSri > 0) {
                            $scope.dataFormaPago.idFormaPagoSri = $scope.cliente.idFormaPagoSri;
                        }
                        if (el) {
                            el.value = $scope.dataFormaPago.idFormaPagoSri;
                            setDataChangeFormaPago();

                            el.addEventListener('change', () => {
                                $scope.dataFormaPago.idFormaPagoSri = Number(el.value);
                                setDataChangeFormaPago();
                            })
                        }

                    },
                    preConfirm: () => {
                        let idFormaPagoSri = document.getElementById('formaDePago').value;
                        if (!(idFormaPagoSri > 0)) {
                            tS.toastr('warning', 'Seleccione la forma de pago!')
                            return false;
                        }
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Continuar!',
                    cancelButtonText: 'Cancelar!'
                }).then(async result => {
                    if (result.isConfirmed) {

                        try {

                            const responseValidateNormativeSri = await docElectSvc.validateNormativeSri({
                                accion: 'guardar',
                                identificacion: $scope.cliente.numeroIdentificacion,
                                importeTotal: $scope.data.total,
                                idFormaPago: $scope.dataFormaPago.idFormaPagoSri,
                                codDoc: '01',

                            })

                            if (isRegister()) {
                                serieComprobante = await facturaSvc.generateSerieComprobante({
                                    idPuntoEmision: $scope.data.idPuntoEmision,
                                });
                                if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                                titleSwal = '<small>Guardar Factura</small>';
                                confirmButtonText = 'Guardar';
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

                            //Mappeamos todo el objecto necesario para guardar factura.
                            let params = facturaSvc.queryMapper({
                                data: $scope.data,
                                cliente: $scope.cliente,
                                detalles: $scope.gridOptions.data,
                                dataFormaPago: $scope.dataFormaPago,
                                itemsDeleted: $scope.gridOptionsItemsDeleted,
                                infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                                cuotas
                            })


                            //Registar Doc
                            if (isRegister()) {

                                const managedRegister = fS.fetchManager(facturaSvc.save);

                                managedRegister(params).then(response => {
                                    if (response.code === '0') {
                                        fS.sweetAlert('warning', response.message, response.titleSms);
                                    }
                                    if (response.code === "1") {
                                        fS.sweetAlert('success', 'Registrado Correctamente', response.titleSms, 1000);
                                        let mainData = {
                                            isRegister: true,
                                            data: response.dataResponse
                                        }
                                        $uibModalInstance.close(mainData)
                                    }
                                }).catch(error => {
                                    console.error(error);
                                })
                            }

                        } catch (error) {
                            console.log(error)
                        }

                    }
                })
            } catch (error) {
                console.warn(error)
            }
        }

        $scope.resultModalDatoAdicional = function (result) {
            $scope.infoAdicionalDocumento = result;
        }

        async function askToSaveStorage() {
            try {
                await storageSvc.askToSaveDetailDoc("notaEntregaDetail", $scope.gridOptions.data);
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

