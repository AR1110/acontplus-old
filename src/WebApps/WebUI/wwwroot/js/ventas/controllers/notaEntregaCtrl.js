(function () {

    'use strict';

    const TEMPLATE_URL = '~/Pages/NotaEntrega/';
    let mainDataForm = {};
    let notaEntregaSvc = {};
    let commonSvc = {};
    let tS = {};
    let fS = {};
    let modalSvc = {};
    let TIPO_DOC_NE = {}

    app.controller('notaEntregaCtrl', notaEntregaCtrl);

    notaEntregaCtrl.$inject = [
        '$scope',
        '$filter',
        '$injector',
        'nombreModal',
        'nombreModalContabilidad',
        'decodeToken'
    ];

    function notaEntregaCtrl($scope, $filter, $injector, nombreModalConst, nombreModalContabilidad, decodeToken) {
        notaEntregaSvc = $injector.get('notaEntregaService');
        commonSvc = $injector.get('commonService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');
        modalSvc = $injector.get('modalService');

        TIPO_DOC_NE = commonSvc.tipoDoc['NE'];
        const PERMISSION_KEY_ACTIONS = {
            E: 'E',
            A: 'A',
        }

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

        $scope.typeSend = 'GenericFile';

        $scope.jsonPermission = {}

        $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento 
        $scope.parametersPrint = {};


        $scope.cliente = {}
        $scope.notaEntregas = [];

        let idUsuarioRol = Number(decodeToken.idUsuarioRol)

        // removed focus new NE
        let btnNewDocument = document.getElementById("btnNewDocument");
        btnNewDocument.addEventListener("click", () => {
            btnNewDocument.blur();
        })

        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getNotaEntregas();
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
            $scope.getNotaEntregas();
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



        $scope.getTotales = function () {
            let { total, totalAbono, totalSaldo } = notaEntregaSvc.getTotales($scope.notaEntregas)
            $scope.total = fS.roundNumber(total, 5);
            $scope.totalAbono = fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = fS.roundNumber(totalSaldo, 5);

        }


        $scope.getNotaEntregas = async () => {
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

                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    byUsuario: $scope.dataSearch.byUsuario,
                    codEstado: $scope.dataSearch.codEstado,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                }

                showLoader();
                $scope.notaEntregas = [];
                $scope.cloneNotaEntregas = [];
                $scope.getTotales();

                notaEntregaSvc.getAll(dataSearch).then(response => {
                    hideLoader();
                    let { notaEntregas, dataTotals } = response;
                    $scope.notaEntregas = notaEntregas;
                    $scope.cloneNotaEntregas = JSON.parse(JSON.stringify($scope.notaEntregas));

                    //Totals 
                    $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                    $scope.total = fS.roundNumber(dataTotals.totalDocument, 5);
                    $scope.totalAbono = fS.roundNumber(dataTotals.totalAbono, 5);
                    $scope.totalSaldo = fS.roundNumber(dataTotals.totalSaldo, 5);

                }).catch(error => {
                    $scope.dataSearch.totalRecords = 0;
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                $scope.dataSearch.totalRecords = 0;
                console.log(error)
            }
        }


        $scope.initiload = async function () {
            showLoader();
            notaEntregaSvc.get({ tipo: 3 }).then(response => {
                hideLoader();
                $scope.establecimientos = response.estabs;
                $scope.estadoDocumentos = response.estadosDoc;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getNotaEntregas();
                }
            }).catch(() => {
                hideLoader();
            })

            notaEntregaSvc.getDataForm().then(response => {
                mainDataForm = response;
                // $scope.jsonPermission = response.permisos;
            })

        }
        $scope.initiload();


        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
            $scope.getNotaEntregas();
        }

        $scope.pagechanged = function () {
            $scope.getNotaEntregas();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getNotaEntregas();
        };
        //Filtro de Nota de Entregas localmente 
        $scope.searchFilterLocal = function () {
            let notaEntregas = JSON.parse(JSON.stringify($scope.cloneNotaEntregas));
            $scope.notaEntregas = $filter("filter")(notaEntregas, $scope.dataSearch.bySearch);
            $scope.getTotales();
        }



        $scope.validateOperationPrintAndPayment = (result) => {

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
                    $scope.openModalRapido(result)
                } else {
                    $scope.openModalCobroDocumento(result)
                }
                return
            }

            if (data.printerAutomatic) {
                commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
            }

            $scope.getNotaEntregas();
            btnNewDocument.focus();
        }


        $scope.openModalNew = async () => {
            try {
                let { MODAL_FILE_CTRL, MODAL_NUEVO } = nombreModalConst.nota_entrega;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
                let template = MODAL_NUEVO['template'];
                let params = {
                    TIPO_REGISTRO: 'NUEVO'
                }

                modalSvc.openModalCustom({
                    controller: 'modalNotaEntregaCtrl',
                    template: `${TEMPLATE_URL}_ModalNuevo.cshtml`,
                    size: 'xl',
                    params: {},
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }).result.then(result => {

                    if (typeof result !== 'object') return

                    $scope.validateOperationPrintAndPayment(result)
                })

                // let { MODAL_FILE_CTRL, MODAL_NUEVO } = nombreModalConst.nota_entrega;
                // let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
                // let template = MODAL_NUEVO['template'];
                // let params = {
                //     TIPO_REGISTRO: 'NUEVO'
                // }

                // modalSvc.openModalCustom({
                //     controller,
                //     template,
                //     size: 'xl',
                //     params,
                //     windowClass: 'uibModalFullScreen'
                // }).result.then(result => {

                //     if (typeof result !== 'object') return

                //     $scope.validateOperationPrintAndPayment(result)
                // })
            } catch (error) {
                console.log(error)
            }
        }


        /**
         * 
         * @param {*} id 
         * @returns 
         */

        $scope.getDataDocumento = (id) => {
            return commonSvc.getDataTipoDocVenta({
                id,
                codigoDocumento: TIPO_DOC_NE.codigo
            })
        }

        $scope.openModalDetalle = async (item) => {
            let { MODAL_FILE_CTRL, MODAL_DETALLE } = nombreModalConst.nota_entrega;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
            let template = MODAL_DETALLE['template'];
            let response = await commonSvc.getDataTipoDocVenta({
                id: item.idDocumento,
                codigoDocumento: TIPO_DOC_NE.codigo
            })

            if (!response.isComplete) return

            let params = {
                TIPO_REGISTRO: 'DETALLE',
                data: response
            }

            $scope.openModalInvoiceParam({
                controller,
                template,
                params
            })
        }

        $scope.openModalEdit = async (item) => {
            try {

                if (item.anulada) {
                    fS.sweetAlert('warning', 'El documento ya se encuentra anulada');
                    return
                }


                let result = await commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.E);
                if (result.code === "2") {
                    commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.E);
                    return
                }

                showLoader();


                let { MODAL_FILE_CTRL, MODAL_EDITAR } = nombreModalConst.nota_entrega;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
                let template = MODAL_EDITAR['template'];

                let response = await commonSvc.getDataTipoDocVenta({
                    id: item.idDocumento,
                    codigoDocumento: TIPO_DOC_NE.codigo
                })


                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'EDITAR',
                    data: response
                }

                modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params,
                    windowClass: 'uibModalFullScreen'
                }).result.then(response => {
                    if (typeof response === 'object') {

                        //Una vez actualizado el documento  
                        if (typeof $scope.jsonPermission === 'object' && $scope.jsonPermission.requestKey) {
                            commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.E);
                        }

                        $scope.getNotaEntregas();
                    }
                })
            } catch (error) {

                console.log(error)
            } finally {
                hideLoader();
            }
        }



        $scope.openModalDuplicate = async (item) => {
            try {
                showLoader();
                let { MODAL_FILE_CTRL, MODAL_DUPLICAR } = nombreModalConst.nota_entrega;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DUPLICAR['controller']];
                let template = MODAL_DUPLICAR['template'];

                let response = await commonSvc.getDataTipoDocVenta({
                    id: item.idDocumento,
                    codigoDocumento: TIPO_DOC_NE.codigo
                })

                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'DUPLICAR',
                    data: response
                }

                modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params,
                    windowClass: 'uibModalFullScreen'
                }).result.then(result => {

                    if (typeof result !== 'object') return

                    $scope.validateOperationPrintAndPayment(result)

                })

            } catch (error) {

                console.log(error)
            } finally {
                hideLoader();
            }

        }

        $scope.openModalInvoiceParam = ({ controller, template, size = 'xl', params }) => {

            modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                windowClass: 'uibModalFullScreen'
            }).result.then(result => {

                if (typeof result === 'object') {
                    $scope.getNotaEntregas();
                }
            })
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

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: '<small>Anular Nota de Entrega?</small>',
                    html: `<small>Esta Ud. seguro/a de anular este Documento <b>N° ${item.nroDocumento
                        }</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    showLoader();
                    notaEntregaSvc.delete(item.idDocumento).then(response => {
                        hideLoader();
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            hideLoader();
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);

                            //Una vez actualizado el documento  
                            if (typeof $scope.jsonPermission === 'object' && $scope.jsonPermission.requestKey) {
                                commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.A);
                            }
                            $scope.getNotaEntregas();
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error);
                    })

                }
            } catch (error) {
                console.log(error)
            } finally {
                console.log(error)
            }
        }



        //--------------------------------------------------COBROS----------

        $scope.opcionCobro = (item) => {

            if (item.estadoFinanciero === "Cobrada") {
                fS.sweetAlert('warning', '<small>Este documento ya se encuentra cobrada!</small>')
                return
            }

            let params = {
                data: item
            }

            if (item.tiempoCredito) {
                $scope.openModalRapido(params);
            } else {
                $scope.openModalCobroDocumento(params)
            }
        }




        $scope.openModalCobroDocumento = async (params) => {
            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CL'];
                let template = nombreModalContabilidad.COBRO.templates['CL'];
                let controller = (await import(fileCtrl))[ctrl];

                $scope.openModalCobro({
                    controller,
                    template,
                    params,
                    size: 'xl',
                    //   windowClass: 'uibModalFullScreen'
                })
            } catch (error) {
                console.log(error)
            }
        }



        /**
         * 
         * @param {object} params 
         */
        $scope.openModalRapido = async (params) => {

            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CR'];
                let template = nombreModalContabilidad.COBRO.templates['CR'];
                let controller = (await import(fileCtrl))[ctrl];

                $scope.openModalCobro({
                    controller,
                    template,
                    params,
                })
            } catch (error) {
                console.log(error)
            }

        }

        /**
         * 
         * @param {object} param0 
         */

        $scope.openModalCobro = ({ controller, template, size = 'lg', params }) => {
            let $modalRef = modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                isRenderRazorPartial: true
            })

            $modalRef.result.then(result => {
                if (typeof result == 'object' || $scope.isRegister) {
                    $scope.getNotaEntregas();
                }

                //Cuando el documento es Nuevo o Duplicado 
                if ($scope.isPrintDocument == 1) {
                    $scope.getNotaEntregas();
                    commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
                    $scope.isPrintDocument = null;
                }

                btnNewDocument.focus();
                $scope.isPrintDocument = null;
                $scope.isRegister = null;
                $scope.parametersPrint = {}
            })
        }


        $scope.openModalCuota = async (item) => {

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





        $scope.openModalHistorialCobro = async (ev, item) => {
            try {
                if (['PE'].includes(item.codEstado)) return

                // showLoader();
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CD'];
                let templateUrl = nombreModalContabilidad.COBRO.templates['CD'];
                let controller = (await import(fileCtrl))[ctrl];

                let config = {
                    controller,
                    templateUrl,
                    // Appending dialog to document.body to cover sidenav in docs app
                    // Modal dialogs should fully cover application to prevent interaction outside of dialog
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    params: Object.assign({}, item)
                }

                modalSvc.openMdDialog(config)
            } catch (error) {
                hideLoader();
                console.log(error)
            }

        }




        $scope.print = function (item) {
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
        $scope.getParamToSendMail = function (item) {
            return {
                TYPE_NOTIFICATION: 'N',
                serieComprobante: item.serieComprobante,
                correo: item.correo,
                subject: 'Documento Nota Entrega - Acontplus N°: ' + item.serieComprobante,
                json: {
                    hasFile: true,
                    isReport: "SI",
                    reportParams: {
                        hasParams: true,
                        codEstab: item.codEstab,
                        codigo: "RNE",
                        format: "pdf"
                    },
                    spParams: {
                        id: item.idDocumento
                    }
                }
            }
        }


        $scope.getReport = function (item) {
            let format = 'pdf';
            let dataParms = {
                id: item.idDocumento
            }

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: 'RNE',
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
        'ventaService',
        'clienteService',
        'gridOptionsService',
        'params'
    ];
    function modalNotaEntregaCtrl($scope, $uibModalInstance, $timeout, ventaSvc, clienteSvc, gridOptionsSvc, params) {
        $scope.tipoDoc = TIPO_DOC_NE;
        $scope.data = {
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

        $scope.cliente = {};
        $scope.newCustomer = false;

        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.bodegas = [];
        $scope.tarifasImpuesto = [];

        $scope.datosAdicionalesArticulo = []
        $scope.historyDatosAdicionales = []

        console.log(mainDataForm)

        $scope.indexRow = null;
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

                setCalculoTotales(colDef.field, rowEntity, oldValue);
            })
        }



        initiload();
        setColumnDefs();
        function initiload() {
            let {
                estabs,
                tarifaImpuestoVigente,
                tarifasImpuesto,
                tiemposCredito,
                tarifas,
                permisoVenta,
                notificacionVenta,
                decimal,
                config,
                vendedores
            } = mainDataForm;
            $scope.establecimientos = estabs;
            let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
            $scope.data.codEstab = dataEstab.codEstab;
            $scope.dataClone.codEstab = dataEstab.codEstab;

            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.bodegas = dataEstab.bodegas;
            $scope.tarifas = tarifas;
            $scope.tiemposCredito = tiemposCredito;
            $scope.vendedores = vendedores;

            if ($scope.puntosEmision.length > 0) {
                let dataPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi));
                $scope.data.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
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
            if ($scope.tiemposCredito.length > 0) {
                $scope.data.idTiempoCredito = $scope.tiemposCredito[0].idTiempoCredito;
                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
            }

            if ($scope.vendedores.length > 0) {
                $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
            } else {
                $scope.data.idUsuario = 0;
            }

            $scope.tarifasImpuesto = tarifasImpuesto;
            $scope.tarifaImpuestoVigente = tarifaImpuestoVigente;
            $scope.permisoComprobanteVenta = permisoVenta.comprobante;
            $scope.permisoDetalleVenta = permisoVenta.detalle;
            $scope.notificacionVenta = notificacionVenta;
            $scope.decimal = decimal;
            $scope.config = config;

            getFechaVencimiento();

            $uibModalInstance.rendered.then(() => {
                if ($scope.config.searchCode) {
                    $("#inputBarcode").focus();
                } else {
                    $("#custom-template-md-autocomplete-articulo").focus();
                }
            })
        }
        function getFechaVencimiento() {
            if ($scope.data.fechaEmision && $scope.tiemposCredito.length > 0) {

                let dataTiempoCredito = $scope.tiemposCredito.find(item => item.idTiempoCredito === $scope.data.idTiempoCredito);
                let diasCredito = typeof dataTiempoCredito === 'object' ? dataTiempoCredito.diasCredito : 0;

                let {
                    fechaVencimiento,
                    fechaEmisionEscrita,
                    fechaVencimientoEscrita
                } = fS.sumarDiasAFecha($scope.data.fechaEmision, diasCredito);

                let formattedDateTime = fS.formatDateMoment(fechaVencimiento)

                $scope.data.fechaVencimiento = new Date(formattedDateTime);
                $scope.data.fechaEmisionEscrita = fechaEmisionEscrita;
                $scope.data.fechaVencimientoEscrita = fechaVencimientoEscrita;

                //Variables temporales
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;
                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
            }
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

        <a update-article ng-click="grid.appScope.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >

        <view-kardex params="row.entity"></view-kardex>

        <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.$ctrl.historyDatosAdicionales" result-modal-adicional="grid.appScope.$ctrl.resultModalAdicional(result)" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`;

            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '12%',
                minWidth: '100',
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
                width: '12%',
                minWidth: '100',
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
                minWidth: '100',
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
                minWidth: '100',
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
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'%'",
                visible: ventaDetailPermission.porcentajeDescuento || false,
                type: 'number',
                /*cellFilter: "limitTo:3",*/
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento,
                enableCellEditOnFocus: ventaDetailPermission.descuento,
                allowCellFocus: ventaDetailPermission.descuento,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: ventaDetailPermission.descuento || false
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                min: 0,
                type: 'number',
                width: '7%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: false
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
                $scope.indexRow = null;
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptions.data.indexOf(rowEntity);
                    $scope.gridOptions.data.splice(index, 1);
                    //Recalculamos los totales 
                    setCalculoTotales("cantidad", rowEntity, 0);
                    $scope.$apply();
                }

                if (isConfirmed && rowEntity.datosAdicionales) {
                    $scope.datosAdicionalesArticulo = $scope.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.idArticulo);
                    $scope.historyDatosAdicionales = $scope.historyDatosAdicionales.filter(val => val.idArticulo !== rowEntity.idArticulo);
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
                console.log(dataEstab)
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


        $scope.onChangeTiempoCredito = function () {
            if (!$scope.permisoComprobanteVenta.tiempoCredito) {
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                return
            }
            getFechaVencimiento();
        }

        $scope.onChangeFechaEmision = function () {
            if (!$scope.permisoComprobanteVenta.fechaEmision) {
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                return
            }
            getFechaVencimiento();
        }

        //==============================START CUSTOMER===========================
        $scope.onSelectedClienteChange = async function (item) {
            try {

                if (!item.validationSri && ['R', 'C'].includes(item.tipoIdentificacion)) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Datos Incorrectos',
                        html: 'Número de identificación no validado!',
                        showConfirmButton: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar'
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
            $scope.data.idTiempoCredito = $scope.cliente.idTiempoCredito || 0;
            $scope.data.fechaEmision = new Date();
            getFechaVencimiento();
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
                    $scope.gridOptionsDetalle,
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
                idNotaEntregaDetalle: 0,
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
                nota: "S/N",
                llevaInventario: false,
                datosAdicionales: false
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

                let index = 0;

                if ([null, undefined].includes($scope.indexRow)) {
                    addRow();
                    index = $scope.gridOptions.data.findIndex(value => value.idArticulo === 0);
                } else {
                    index = $scope.indexRow;
                }

                let entity = $scope.gridOptions.data[index];
                let dataMedida = medidas.find(medida => (medida.defaultMedida));


                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;

                //Aplica a establecimiento que llevan actividad de Tipo Alojamiento
                if ($scope.tarifaImpuestoVigente.codigoPorcentaje === '8' && articulo.codigoPorcentaje === '2') {
                    let dataImpuestoTarifa = $scope.tarifasImpuesto.find(item => item.codigoPorcentaje === $scope.tarifaImpuestoVigente.codigoPorcentaje);
                    entity.idTipoIva = dataImpuestoTarifa.idTipoIva;
                    entity.codigoPorcentaje = dataImpuestoTarifa.codigoPorcentaje;
                    entity.tarifa = dataImpuestoTarifa.tarifa;

                } else {
                    entity.idTipoIva = articulo.idTipoIva;
                    entity.codigoPorcentaje = articulo.codigoPorcentaje;
                    entity.tarifa = articulo.tarifa;
                }

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
                entity.precioUnitario = fS.roundNumber(tarifa.precioVenta, $scope.decimal.nroPrecio);
                entity.precioConIva = fS.roundNumber(tarifa.precioConIva, $scope.decimal.nroPrecio);
                entity.cantMinimaVentaPorMayor = articulo.cantMinimaVentaPorMayor;
                $scope.indexRow = index;
                setCalculoTotales('precioUnitario', entity, 0);
                focusColumnCantidad();
                setCantidadStock(entity)
            } catch (error) {
                console.log(error)
            }
        }

        function setCantidadStock(rowEntity) {
            let dataConsolidacionFecha = rowEntity.consolidacionesFecha.find(
                cdataFecha => cdataFecha.idBodega === rowEntity.idBodega
            )
            if (dataConsolidacionFecha && fS.isDateValid(dataConsolidacionFecha.fechaConsolidacion)) {
                if (dataConsolidacionFecha.fechaConsolidacion >= $scope.data.fechaEmision) {
                    rowEntity.cantidadStock = 0;
                    return
                }
            }
            rowEntity.cantidadStock = rowEntity.cantidad * rowEntity.conversion;
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

            $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                items: $scope.gridOptions.data,
                decimal: $scope.decimal,
                dataTarifaImpuesto: $scope.tarifaImpuestoVigente
            }))

            $scope.dataClone.porcentajeDescuento = $scope.data.porcentajeDescuento;
            $scope.dataClone.totalDescuento = $scope.data.totalDescuento;
        }


        $scope.calcularPorcentajeDescuento = function () {
            if (!$scope.permisoComprobanteVenta.porcentajeDescuento) {
                $scope.data.porcentajeDescuento = 0;
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                return
            }
            if (typeof $scope.data.porcentajeDescuento !== 'number' || isNaN($scope.data.porcentajeDescuento)) {
                tS.toastr('warning', 'Ingrese un Número Válido');
                return
            }

            if ($scope.data.porcentajeDescuento <= 100) {
                //redondeo del numero porcentaje 
                $scope.data.porcentajeDescuento = fS.roundNumber($scope.data.porcentajeDescuento, $scope.decimal.nroTotalSubTotal)
                setPorcentajeDescuentoAll($scope.data.porcentajeDescuento);
            } else {
                tS.toastr('warning', 'El Porcentaje de Descuento tiene que ser menor o igual a 100');
            }
        }

        function setPorcentajeDescuentoAll(porcentajeDescuento) {
            for (let rowEntity of $scope.gridOptions.data) {
                rowEntity.porcentajeDescuento = porcentajeDescuento;

                //calculoColDef recibbe params obj: {rowEntity, oldValue, decimal, idTarifa, columnDefs}
                let objCalculo = gridOptionsSvc.calculoColDef({
                    rowEntity,
                    oldValue: null,
                    decimal: $scope.decimal,
                    idTarifa: $scope.data.idTarifa,
                    columnDefs: $scope.gridOptions.columnDefs
                });

                objCalculo["porcentajeDescuento"] && objCalculo["porcentajeDescuento"]();
                objCalculo["calculoTotalDetalle"]();
            }

            recalculateTotalsSimple();
        }

        //Calcular Porcentaje  Descuento 
        $scope.calcularDescuento = function () {
            try {
                if (!$scope.permisoComprobanteVenta.descuento) {
                    $scope.data.descuento = 0;
                    tS.toastr('warning', 'No tienes permiso para realizar esta acción');
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
                    setPorcentajeDescuentoAll($scope.data.porcentajeDescuento)
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
            if (!($scope.data.idTiempoCredito > 0)) {
                tS.toastr('warning', 'Seleccione el Tiempo Credito');
                return
            }
            if (!(fS.isDateValid($scope.data.fechaEmision))) {
                tS.toastr('warning', 'Ingrese la Fecha de emisión');
                return
            }
            if (!(fS.isDateValid($scope.data.fechaVencimiento))) {
                tS.toastr('warning', 'Seleccione la Fecha de vencimiento');
                return
            }
            if ($scope.cliente.idCliente === 0 && ("razonSocialComprador" in $scope.cliente) && ("nombreComercial")) {
                if (!$scope.cliente.razonSocialComprador || !$scope.cliente.nombreComercial) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }
            } else if (!($scope.data.idCliente > 0)) {
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

        $scope.save = async function () {
            try {
                if (!isValidForm()) {
                    throw "Invalid form!";
                }

                showLoader();
                this.nroDocumentoSecuencial = await notaEntregaSvc.get({
                    idPuntoEmision: this.data.idPuntoEmision,
                    codigoDocumento: this.TIPO_DOC_NE.codigo,
                })
                hideLoader();

                if (!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"


            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        $scope.closeModal = () => {
            $uibModalInstance.close();
        }
    }

})(window.angular)

