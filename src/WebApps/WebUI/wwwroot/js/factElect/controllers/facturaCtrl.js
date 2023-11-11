(function () {
    'use strict';

    const TEMPLATE_URL = '~/Pages/Factura/';
    let mainDataForm = {};
    let facturaSvc = {};
    let commonSvc = {};
    let tS = {};
    let fS = {};
    let modalSvc = {};
    let tipoDoc = {}
    const NUM_CONSUMIDOR_FINAL = "9999999999999";


    app.controller('facturaCtrl', facturaCtrl)

    facturaCtrl.$inject = ['$scope', '$filter', '$injector', 'nombreModal', 'decodeToken']

    function facturaCtrl($scope, $filter, $injector, _nombreModalConst, decodeToken) {

        facturaSvc = $injector.get('facturaService');
        commonSvc = $injector.get('commonService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');
        modalSvc = $injector.get('modalService');
        let nombreModalContabilidad = $injector.get('nombreModalContabilidad');
        let nombreModalVenta = $injector.get('nombreModalVenta');
        let DOC_TYPE = $injector.get('DOC_TYPE');
        tipoDoc = {
            codigo: DOC_TYPE['FV']
        }


        $scope.typeSend = 'SRI';
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
            checkBoxFecha: true,
            busqueda: "",
            byStock: 0,
        };

        $scope.cliente = {
            nombreCliente: ''
        }


        $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento 
        $scope.parametersPrint = {};

        let idUsuarioRol = Number(decodeToken.idUsuarioRol)


        $scope.permisonEditarDoc = {};
        //Remove Focus new invoice 
        let btnNewInvoice = document.getElementById("btnNewInvoice");
        btnNewInvoice.addEventListener("click", () => {
            btnNewInvoice.blur();
        })

        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getFacturas();
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
            $scope.getFacturas();
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
            $scope.getFacturas();
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }


        $scope.searchFilterLocal = function () {
            let facturas = JSON.parse(JSON.stringify($scope.cloneFacturas));
            $scope.facturas = $filter("filter")(facturas, $scope.dataSearch.bySearch);
            $scope.getTotales();
        }

        //=====================Eend Filters======================= 

        $scope.getTotales = () => {
            let { total,
                totalAbono,
                totalSaldo } = $scope.facturas.reduce((total, factura) => {
                    if (factura.codEstado !== 'A') {
                        total.total += factura.total;
                        total.totalAbono += factura.abono;
                        total.totalSaldo += factura.saldo;
                    }
                    return total;
                }, {
                    total: 0,
                    totalAbono: 0,
                    totalSaldo: 0
                })
            $scope.total = fS.roundNumber(total, 5);
            $scope.totalAbono = fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = fS.roundNumber(totalSaldo, 5);
        }



        $scope.getFacturas = function () {

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
                    tipo: 1,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    byUsuario: $scope.dataSearch.byUsuario,
                    byEstado: $scope.dataSearch.byEstado,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                }

                showLoader();
                $scope.facturas = [];
                $scope.getTotales();
                facturaSvc.getAll(dataSearch).then(response => {
                    let { facturas, dataTotals } = response;
                    $scope.facturas = facturas;
                    $scope.cloneFacturas = JSON.parse(JSON.stringify($scope.facturas));

                    //Totales
                    $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                    $scope.total = fS.roundNumber(dataTotals.totalDocument, 5);
                    $scope.totalAbono = fS.roundNumber(dataTotals.totalAbono, 5);
                    $scope.totalSaldo = fS.roundNumber(dataTotals.totalSaldo, 5);
                    hideLoader();
                }).catch(error => {
                    $scope.dataSearch.totalRecords = 0;
                    hideLoader();
                    console.log(error);
                })


            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.initiload = async function () {
            showLoader();
            facturaSvc.getDataFilter().then(response => {
                hideLoader();
                $scope.establecimientos = response.estabs;
                $scope.estadoDocumentos = response.estadosDoc;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getFacturas();
                }
            }).catch(() => {
                hideLoader();
            })

            facturaSvc.getDataForm().then(response => {
                mainDataForm = response;
                $scope.permisonEditarDoc = response.permisonEditarDoc;
            })

        }
        $scope.initiload();

        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
            $scope.getFacturas();
        }


        $scope.pagechanged = function () {
            $scope.getFacturas();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getFacturas();
        };


        $scope.onOrderInvoice = function (item) {
            console.log('test order', item)
            console.log($scope.dataSearch.order)
        }

        $scope.validateOperationPrintAndPayment = (result) => {
            //Verificamos 
            let { isRegister, data } = result;
            $scope.isRegister = isRegister;
            $scope.isPrintDocument = data.printerAutomatic;

            $scope.parametersPrint = {
                ...data,
                codDoc: 'FV',
                idDocument: data.idDocumento,
                codigo: 'RFPT',
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

            $scope.getFacturas();

            //Focus New Invoice
            btnNewInvoice.focus();
        }

        $scope.openModalInvoiceNew = async () => {
            try {
                modalSvc.openModalCustom({
                    controller: 'modalFacturaCtrl',
                    template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                    size: 'xl',
                    params: {
                        action: 'NUEVO'
                    },
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }).result.then(result => {
                    if (typeof result !== 'object') return

                    //Pendiednte 📛
                    $scope.validateOperationPrintAndPayment(result)
                })
            } catch (error) {
                console.log(error)
            }
        }

        /**
         * 
         * @param {*} id 
         * @returns 
         */
        $scope.openModalDetalle = async (params) => {
            try {
                let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
                let ctrl = (await import(fileCtrl))[controller];
                let template = templates['FV_SRI'];
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

        $scope.openModalInvoiceEdit = async (item) => {
            try {
                if (item.codEstado === 'A') {
                    fS.sweetAlert('warning', 'Este documento ya se cuentra anulada');
                    return
                }

                let result = await commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.E);
                if (result.code === "2") {
                    commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.E);
                    return
                }

                showLoader();
                facturaSvc.getId(item.idDocumento).then(response => {
                    const modalRef = modalSvc.openModalCustom({
                        controller: 'modalFacturaCtrl',
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
                        if (typeof result === 'object' && result.isUpdate) {
                            //Actualizar el estado de solicitud en caso de tener 
                            if (typeof $scope.permisonEditarDoc === 'object' && $scope.permisonEditarDoc.requiereClave) {
                                commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.E);
                            }

                            $scope.getFacturas();
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


        $scope.openModalInvoiceDuplicate = async (item) => {
            try {
                showLoader();
                facturaSvc.getId(item.idDocumento).then(response => {
                    let modalRef = modalSvc.openModalCustom({
                        controller: 'modalFacturaCtrl',
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
                            $scope.validateOperationPrintAndPayment(result)
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

        $scope.openModalInvoiceParam = ({
            controller,
            template,
            size = 'xl',
            params
        }) => {

            modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                windowClass: 'uibModalFullScreen'
            }).result.then(result => {

                if (typeof result === 'object') {
                    $scope.getFacturas();
                }
            })

        }


        $scope.askToDelete = async (item) => {
            try {

                if (item.codEstado === 'A') {
                    fS.sweetAlert('warning', 'Este documento ya se cuentra anulada');
                    return
                }

                let result = await commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.A);
                if (result.code === "2") {
                    commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.A);
                    return
                }

                let { isConfirmed } = await Swal.fire({
                    title: '<small>Anular Factura?</small>',
                    html: `<small>Esta Ud. seguro/a de anular este Factura de Venta <b>N° ${item.serieComprobante}</b></small>?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: 'No, cancelar!',
                    confirmButtonText: "Si, anular!"
                })

                if (isConfirmed) {
                    showLoader();
                    facturaSvc.delete(item.idDocumento).then(response => {
                        hideLoader();
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);

                            //Una vez actualizado el documento 
                            if (typeof $scope.permisonEditarDoc === 'object' && $scope.permisonEditarDoc.requiereClave) {
                                commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.A);
                            }
                            $scope.getFacturas();
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    }).finally(() => hideLoader())
                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.getReport = function (item) {
            showLoader();
            let format = 'pdf';
            let dataParms = {
                id: item.idDocumento,
                normalMethod: true,
            }

            let parameters = {
                dataParams: JSON.stringify(dataParms),
                reportParams: JSON.stringify({
                    codigo: 'RF',
                    codEstab: item.codEstab,
                    format,
                }),
                hasService: true
            }

            commonSvc.getReport({
                parameters,
                format
            })
        }


        //--------------------------------------------------COBROS----------

        $scope.opcionCobro = (item) => {
            if (item.codEstado === "CBR") {
                fS.sweetAlert('warning', '<small>Este documento ya se encuentra cobrada!</small>')
                return
            }

            let params = {
                data: {
                    ...item
                }
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

        $scope.openModalCobro = ({
            controller,
            template,
            size = 'lg',
            params,
            windowClass
        }) => {

            let $modalRef = modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                keyboard: true,
                windowClass,
                isRenderRazorPartial: true
            })

            $modalRef.result.then(result => {

                if (typeof result == 'object' || $scope.isRegister) {
                    $scope.getFacturas();
                }

                //Cuando el documento es Nuevo o Duplicado 
                if ($scope.isPrintDocument == 1) {
                    //    $scope.getFacturas();
                    commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
                    $scope.isPrintDocument = null;
                }

                //Focus New Invoice
                btnNewInvoice.focus();
                $scope.isRegister = null;
                $scope.isPrintDocument = null;
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
                        $scope.getFacturas();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }


        //----------------------------Detalle Comprobante Ingreso ---------------------
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
                idDocument: item.idDocumento,
                idTipoDocumento: item.idTipoDocumento,
                codEstab: item.codEstab,
                codDoc: 'FV',
            }

            commonSvc.askToPrint({
                parameters: JSON.stringify(parameters)
            })

        }

    }



    /**
     * 
     * MODAL FACTURA 
     * Registrar
     * Actualizar
     * Duplicar
     */
    app.controller('modalFacturaCtrl', modalFacturaCtrl)
    modalFacturaCtrl.$inject = [
        '$scope',
        '$uibModalInstance',
        '$timeout',
        '$injector',
        'params'
    ];
    function modalFacturaCtrl($scope, $uibModalInstance, $timeout, $injector, params) {
        let ventaSvc = $injector.get('ventaService');
        let clienteSvc = $injector.get('clienteService');
        let gridOptionsSvc = $injector.get('gridOptionsService');
        let storageSvc = $injector.get('storageService');
        let articuloSvc = $injector.get('articuloService');
        let TAX_RATE_CODE = $injector.get('TAX_RATE_CODE');


        $scope.tipoDoc = tipoDoc;
        $scope.infoEstabPtoEmi = {};

        $scope.data = {
            idFactura: 0,
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
                if (colDef.field === 'cantidad' && rowEntity.cantidad !== oldValue) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }
                if (colDef.field === 'idBodega' && rowEntity.idBodega !== oldValue) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }

                setCalculoTotales(colDef.field, rowEntity, oldValue);
            })
        }

        $scope.gridOptionsItemsDeleted = [];

        function checkNotificationStock(field, rowEntity, oldValue) {
            try {
                if (!rowEntity.llevaInventario) return;
                showLoader();
                let { cantidadStock } = facturaSvc.getCantidadStock(rowEntity, $scope.data.fechaEmision)
                articuloSvc.checkNotificationStock({
                    idArticulo: rowEntity.idArticulo,
                    cantidad: cantidadStock,
                    idBodega: rowEntity.idBodega,
                    idMedida: rowEntity.idMedida
                }).then(async responseApi => {
                    hideLoader();
                    let { code, message, titleSms } = responseApi;
                    if (code === "1") {
                        setCalculoTotales(field, rowEntity, oldValue);
                        return
                    }

                    let { isConfirmed } = await Swal.fire({
                        title: `<small>${titleSms}</small>`,
                        icon: 'warning',
                        html: `<small>${message}</small>`,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    })

                    if (isConfirmed) {
                        if (code === "0") {
                            rowEntity[field] = oldValue;
                            setCalculoTotales(field, rowEntity, oldValue);
                            $("#custom-template-md-autocomplete-articulo").focus();
                        }
                        if (code === "2") {
                            setCalculoTotales(field, rowEntity, oldValue);
                        }
                    }

                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.setInfoEstabPtoEmi = function () {
            if ($scope.establecimientos.length > 0) {
                $scope.infoEstabPtoEmi.nombreComercial = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab).nombreComercial;
            }

            if ($scope.puntosEmision.length > 0) {
                $scope.infoEstabPtoEmi.puntoEmision = $scope.puntosEmision.find(item => item.idPuntoEmision === $scope.data.idPuntoEmision).ptoEmi;
            }
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
                vendedores,
                clienteDefault,
                articuloDefault
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
                if ($scope.tiemposCredito.length > 0) {
                    $scope.data.idTiempoCredito = $scope.tiemposCredito[0].idTiempoCredito;
                    $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
                }

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                //Cliente Predeterminado 
                if (clienteDefault.idCliente > 0) {
                    $scope.cliente = clienteDefault;
                }

                //Articulo Predeterminado
                if (articuloDefault.idArticulo > 0) {
                    articuloSvc.getForSale({
                        idArticulo: articuloDefault.idArticulo,
                        idBodega: $scope.data.idBodega
                    }).then(dataArticuloApi => {
                        $scope.setItemArticuloEnDetalle(dataArticuloApi)
                    })
                }

                getFechaVencimiento();
            }
            $scope.tarifaImpuestoVigente = tarifaImpuestoVigente;


            //Cuando el documento es duplicar
            if (params && params.action === 'DUPLICAR') {
                const {
                    comprobante,
                    cliente,
                    items,
                    infoAdicionalDocumento,
                } = params.data;
                console.log(params)
                $scope.data = {
                    ...$scope.data,
                    ...structuredClone(comprobante)
                }
                $scope.data.fechaEmision = new Date();
                $scope.data.idFactura = 0;
                getFechaVencimiento();

                $scope.dataClone.codEstab = $scope.data.codEstab;
                $scope.gridOptions.data = items.map(item => ({
                    ...item,
                    idFacturaDetalle: 0
                }))

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
            }


            //Cuando el documento es editar
            if (params && params.action === 'EDITAR') {
                const {
                    comprobante,
                    cliente,
                    items,
                    infoAdicionalDocumento,
                } = params.data;

                $scope.data = {
                    ...$scope.data,
                    ...structuredClone(comprobante)
                }
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;

                $scope.dataClone.codEstab = $scope.data.codEstab;
                $scope.gridOptions.data = items;

                $scope.data.fechaEmisionEscrita = fS.getFechaEscrita($scope.data.fechaEmision);
                $scope.data.fechaVencimientoEscrita = fS.getFechaEscrita($scope.data.fechaVencimiento);

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                $scope.cliente = cliente;
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;
                $scope.historyDatosAdicionales = $scope.datosAdicionalesArticulo.map(item => ({
                    idArticulo: item.idArticulo,
                    idInfoAdicional: item.idInfoAdicional,
                    selected: true,
                }))
                counterGridOptions();
                $scope.isDisabledFormField = true;
            }

            $uibModalInstance.rendered.then(() => {
                if ($scope.config.searchCode) {
                    $("#inputBarcode").focus();
                } else {
                    $("#custom-template-md-autocomplete-articulo").focus();
                }
            });


            if (params.action === "NUEVO" && !($scope.data.idFactura > 0)) {
                if (Object.keys(storageSvc.getObject("storeFacturaDetail")).length > 0) {
                    storageSvc.restoreInvoiceDetail("storeFacturaDetail").then(result => {
                        if (result.isConfirmed) {
                            $scope.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value]);
                            delete result.dataInvoiceDetail[result.value];

                            storageSvc.setObject("storeFacturaDetail", result.dataInvoiceDetail)

                            recalculateTotalsSimple();
                            $scope.$apply();
                        }

                    })
                }
            }
            $scope.setInfoEstabPtoEmi();

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
            }
        }

        $scope.resultModalAdicional = function (result) {
            let { historyDatosAdicionales } = result;
            $scope.historyDatosAdicionales = historyDatosAdicionales;
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

        <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.historyDatosAdicionales" result-modal-adicional="grid.appScope.resultModalAdicional(result)" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`;

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
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptions.data.indexOf(rowEntity);
                    $scope.gridOptions.data.splice(index, 1);

                    if (rowEntity.idFacturaDetalle > 0) {
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
                idFacturaDetalle: 0,
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
                datosAdicionales: false,
                estado: 1
            }
            $scope.gridOptions.data.push(obj)
        }

        $scope.setItemArticuloEnDetalle = function (dataArticulo) {
            try {
                $scope.dataArticulo = dataArticulo;
                console.log(dataArticulo)
                const {
                    articulo,
                    medidas,
                    datosAdicionalesArticulo,
                    consolidacionesFecha
                } = $scope.dataArticulo;

                let index = 0;

                let findIndexById = $scope.gridOptions.data.findIndex(item => item.llevaInventario && item.idArticulo === articulo.idArticulo);

                if (findIndexById === -1) {
                    addRow();
                    index = $scope.gridOptions.data.findIndex(value => value.idArticulo === 0);
                } else {
                    index = findIndexById;
                }

                let entity = $scope.gridOptions.data[index];
                let dataMedida = medidas.find(medida => (medida.defaultMedida));


                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;

                //Aplica a establecimiento que llevan actividad de Tipo Alojamiento
                if (
                    $scope.tarifaImpuestoVigente.codigoPorcentaje === TAX_RATE_CODE.DIFFERENTIATED_TAX
                    && articulo.codigoPorcentaje === TAX_RATE_CODE.TWELVE_PERCENT
                ) {
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
            $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                items: $scope.gridOptions.data,
                decimal: $scope.decimal,
                dataTarifaImpuesto: $scope.tarifaImpuestoVigente,
                TAX_RATE_CODE
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

            if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
                tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
                return
            }

            if (isUpdate()) {
                let fechaEmisionModificada = $scope.data.fechaEmision;
                let fechaEmisionDocCreado = $scope.data.fechaEmisionDocCreado;
                let fechaActual = new Date();

                // Verificar si la fecha de emisión modificada es diferente de la fecha de creación del documento
                if (fS.getDate(fechaEmisionModificada) !== fS.getDate(fechaEmisionDocCreado)) {

                    //Si son diferentes, comprobar si la fecha de emisión modificada es posterior a la fecha actual
                    if (fS.getDate(fechaEmisionModificada) > fS.getDate(fechaActual)) {
                        fS.sweetAlert('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.');
                        return
                    }

                    if (fS.getDate(fechaEmisionModificada) < fS.getDate(fechaActual)) {
                        $scope.data.fechaEmision.setHours(0, 0, 0, 0);
                    } else {
                        $scope.data.fechaEmision = new Date();
                    }
                }
                // else {
                //     $scope.data.fechaEmision = fechaEmisionDocCreado;
                // }
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

                if ($scope.cliente.numeroIdentificacion === NUM_CONSUMIDOR_FINAL && $scope.data.total > 50) {
                    fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>');
                    return
                }

                if (isRegister()) {
                    showLoader();
                    serieComprobante = await facturaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    });
                    hideLoader();
                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                    titleSwal = '<small>Guardar Factura</small>';
                    confirmButtonText = 'Guardar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;

                } else if (isUpdate()) {
                    serieComprobante = $scope.data.serieComprobante;
                    titleSwal = '<small>Actualizar Factura</small>';
                    confirmButtonText = 'Actualizar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;
                }

                console.log(serieComprobante)

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

                //Tarifa Aplicada al Documento
                $scope.data.tarifa = $scope.tarifaImpuestoVigente.tarifa;

                //Mappeamos todo el objecto necesario para guardar factura.
                let params = facturaSvc.queryMapper({
                    data: $scope.data,
                    cliente: $scope.cliente,
                    detalles: $scope.gridOptions.data,
                    itemsDeleted: $scope.gridOptionsItemsDeleted,
                    infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                    historyDatosAdicionales: $scope.historyDatosAdicionales
                })


                //Registar Doc 
                if (isRegister()) {
                    showLoader();
                    facturaSvc.save(params).then(response => {
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
                await storageSvc.askToSaveDetailDoc("storeFacturaDetail", $scope.gridOptions.data);
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
