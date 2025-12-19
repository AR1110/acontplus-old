//@ts-check
(function () {
    "use strict";

    const TEMPLATE_URL = "~/Pages/Factura/";
    let mainDataForm = {};
    let facturaSvc = {};
    let commonSvc = {};
    let tS = {};
    let fS = {};
    let modalSvc = {};
    let tipoDoc = {};
    let nombreModalVenta = {};

    app.controller("facturaCtrl", facturaCtrl);

    facturaCtrl.$inject = ["$scope", "$filter", "$injector", "nombreModal"];

    function facturaCtrl($scope, $filter, $injector, _nombreModalConst) {
        const docElectSvc = $injector.get('docElectService');
        facturaSvc = $injector.get("facturaService");
        commonSvc = $injector.get("commonService");
        tS = $injector.get("toastService");
        fS = $injector.get("formulario");
        modalSvc = $injector.get("modalService");
        let nombreModalContabilidad = $injector.get("nombreModalContabilidad");
        nombreModalVenta = $injector.get("nombreModalVenta");

        const nombreModalCommon = $injector.get('nombreModalCommon');
        const $solicitudAutorizacionSvc = $injector.get('solicitudAutorizacionService');
        const policyService = $injector.get('PolicyService');

        let DOC_TYPE = $injector.get("DOC_TYPE");
        const CODE_REPORT = $injector.get("CODE_REPORT");

        tipoDoc = {
            codigo: DOC_TYPE["FV"],
        };

        $scope.typeSend = "SRI";

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            order: "",
            tipo: 1,
            pageSize: 10,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
            checkBoxFecha: true,
            busqueda: "",
            byStock: 0,
        };

        $scope.cliente = {
            nombreCliente: "",
        };

        $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento
        $scope.parametersPrint = {};

        $scope.permisoEditarDoc = {};
        //Remove Focus new invoice
        let btnNewInvoice = document.getElementById("btnNewInvoice");
        if (btnNewInvoice) {
            btnNewInvoice.addEventListener("click", () => {
                btnNewInvoice.blur();
            });
        }

        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
            $scope.getFacturas();
        };

        $scope.onKeyupCliente = function () {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.idCliente = 0;
                $scope.dataSearch.checkBoxFecha = true;
            }
        };
        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.idCliente = item.idCliente;
            $scope.dataSearch.checkBoxFecha = true;
            $scope.getFacturas();
        };

        $scope.usuarioSearch = function (textSearch) {
            try {
                let query = {
                    busqueda: textSearch,
                };

                if (query.busqueda.length > 2) {
                    return commonSvc.usuarioSearch(query).catch((error) => {
                        console.log(error);
                        throw error;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };

        $scope.onKeyupUsuarioSearch = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        };

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            $scope.getFacturas();
        };

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        };

        $scope.searchFilterLocal = function () {
            let facturas = JSON.parse(JSON.stringify($scope.cloneFacturas));
            $scope.facturas = $filter("filter")(facturas, $scope.dataSearch.bySearch);
            $scope.getTotales();
        };

        //=====================Eend Filters=======================

        $scope.getTotales = () => {
            let { total, totalAbono, totalSaldo } = $scope.facturas.reduce(
                (total, factura) => {
                    if (factura.codEstado !== "A") {
                        total.total += factura.total;
                        total.totalAbono += factura.abono;
                        total.totalSaldo += factura.saldo;
                    }
                    return total;
                },
                {
                    total: 0,
                    totalAbono: 0,
                    totalSaldo: 0,
                }
            );
            $scope.total = fS.roundNumber(total, 5);
            $scope.totalAbono = fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = fS.roundNumber(totalSaldo, 5);
        };

        $scope.refresh = function () {
            $scope.getFacturas();
        };

        $scope.getFacturas = function () {
            try {
                //  $scope.dataSearch.checkBoxFecha = true;
                if ($scope.dataSearch.nroSecuencial) {
                    if (
                        !fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                    ) {
                        $scope.dataSearch.checkBoxFecha = true;
                        tS.toastr({
                            type: "warning",
                            message:
                                "Define correctamente el número de secuencial o el rango de número secuencial!",
                        });
                        return;
                    }
                    if (!($scope.dataSearch.idCliente > 0)) {
                        $scope.dataSearch.checkBoxFecha = false;
                    }
                    tS.toastr({
                        type: "info",
                        message: "Buscando por número secuencial",
                    });
                }
                if ($scope.dataSearch.infoAdicional) {
                    $scope.dataSearch.checkBoxFecha = false;
                }

                let dataSearch = {
                    tipo: 1,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    idUsuario: $scope.dataSearch.byUsuario,
                    byEstado: $scope.dataSearch.byEstado,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential(
                        $scope.dataSearch.nroSecuencial
                    ),
                    infoAdicional: $scope.dataSearch.infoAdicional
                        ? $scope.dataSearch.infoAdicional
                        : null,
                };
                $scope.facturas = [];
                $scope.getTotales();
                facturaSvc
                    .getAll(dataSearch)
                    .then((response) => {
                        let { facturas, dataTotals } = response;
                        $scope.facturas = facturas;
                        $scope.cloneFacturas = structuredClone($scope.facturas);

                        $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                        $scope.getTotales();
                    })
                    .catch((error) => {
                        $scope.dataSearch.totalRecords = 0;
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
            }
        };

        $scope.initiload = async function () {

            facturaSvc
                .getDataFilter()
                .then((response) => {
                    $scope.establecimientos = response.estabs;
                    $scope.estadoDocumentos = response.estadosDoc;

                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(
                            (estab) => estab.defaultEstab
                        );
                        $scope.puntosEmision = dataEstab.puntosEmision;
                        $scope.dataSearch.codEstab = dataEstab.codEstab;
                        $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(
                            (pto) => pto.defaultPtoEmi
                        ).idPuntoEmision;
                        $scope.getFacturas();
                    } else {
                        tS.toastr("warning", "No tienes asignado Establecimiento!");
                    }
                })

            facturaSvc.getDataForm().then((response) => {
                mainDataForm = response;
                $scope.permisoEditarDoc = response.permisoEditarDoc;
            });
        };
        $scope.initiload();

        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(
                (estab) => estab.codEstab === $scope.dataSearch.codEstab
            );
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(
                (pto) => pto.defaultPtoEmi
            ).idPuntoEmision;
            $scope.getFacturas();
        };

        $scope.pagechanged = function () {
            $scope.getFacturas();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getFacturas();
        };

        $scope.onOrderInvoice = function (item) {
            console.log("test order", item);
        };

        $scope.validateOperationPrintAndPayment = (result) => {
            //Verificamos
            let { isRegister, data } = result;
            $scope.isRegister = isRegister;
            $scope.isPrintDocument = mainDataForm.config.printerAutomatic;

            $scope.parametersPrint = {
                ...data,
                codDoc: "FV",
                idDocument: data.idDocumento,
                codigo: "RFPT",
            };

            if (data.payAutomatic) {
                if (data.esContado) {
                    $scope.openModalRapido(result);
                } else {
                    $scope.openModalCobroDocumento(result);
                }
                return;
            }

            if (mainDataForm.config.printerAutomatic) {
                commonSvc.getPrinter(JSON.stringify($scope.parametersPrint));
            }

            $scope.getFacturas();

            //Focus New Invoice
            if (btnNewInvoice) {
                btnNewInvoice.focus();
            }
        };

        $scope.openModalInvoiceNew = async () => {
            try {

                await policyService.sendMaxDocuments();

                modalSvc
                    .openModalCustom({
                        controller: "modalFacturaCtrl",
                        template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                        size: "xl",
                        params: {
                            action: "NUEVO",
                        },
                        windowClass: "uibModalFullScreen",
                        isRenderRazorPartial: true,
                    })
                    .result.then((result) => {
                        if (typeof result !== "object") return;

                        //Pendiednte 📛
                        $scope.validateOperationPrintAndPayment(result);
                    });
            } catch (error) {
                console.log(error);
            }
        };

        /**
         *
         * @param {*} params
         */
        $scope.openModalDetalle = async (params) => {
            try {
                let { fileCtrl, controller, templates } =
                    nombreModalVenta.DOC_VENTA_DETALLE;
                let ctrl = (await import(fileCtrl))[controller];
                let template = templates["FV_SRI"];
                modalSvc.openModalCustom({
                    controller: ctrl,
                    template: template,
                    size: "xl",
                    params: {
                        codDoc: params.codDoc,
                        id: params.idDocumento,
                    },
                    windowClass: "uibModalFullScreen",
                    isRenderRazorPartial: true,
                });
            } catch (error) {
                console.log(error);
            }
        };

        function getParamsPermission(item, codigoAccion) {
            return {
                idDocumento: item.idDocumento,
                codigoModulo: item.codDoc,
                codigoAccion,
                infoExtraJson: {
                    serieComprobante: item.serieComprobante,
                    codEstab: item.codEstab,
                    idPuntoEmision: item.idPuntoEmision,
                    nombreModulo: 'Factura Electrónica'
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

        $scope.openModalInvoiceEdit = async (item) => {
            try {
                if (item.disabledActionUpdate) {
                    fS.sweetAlert("warning", "Este documento ya no se puede editar");
                    return;
                }


                let paramsPermission = getParamsPermission(item, "E");

                const responseCheck = await $solicitudAutorizacionSvc.verifyUserPermission(paramsPermission);

                if (responseCheck && responseCheck.code === "2") {
                    openModalRegistrarSolicitudAuth(paramsPermission)
                    return;
                }

                facturaSvc
                    .getId(item.idDocumento)
                    .then((response) => {
                        const modalRef = modalSvc.openModalCustom({
                            controller: "modalFacturaCtrl",
                            template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                            size: "xl",
                            params: {
                                data: response,
                                action: "EDITAR",
                            },
                            windowClass: "uibModalFullScreen",
                            isRenderRazorPartial: true,
                        });
                        modalRef.result.then((result) => {
                            if (typeof result === "object" && result.isUpdate) {
                                //Actualizar el estado de solicitud en caso de tener
                                if (
                                    typeof $scope.permisoEditarDoc === "object" &&
                                    $scope.permisoEditarDoc.requiereClave
                                ) {
                                    $solicitudAutorizacionSvc.update(paramsPermission)
                                    // userCustomerPermissionSvc.updateRequestKey(paramsPermission);
                                }

                                $scope.getFacturas();
                            }
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    })

            } catch (error) {
                console.log(error);
            }
        };

        $scope.openModalInvoiceDuplicate = async (item) => {
            try {

                await policyService.sendMaxDocuments();

                facturaSvc
                    .getId(item.idDocumento)
                    .then((response) => {
                        let modalRef = modalSvc.openModalCustom({
                            controller: "modalFacturaCtrl",
                            template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                            size: "xl",
                            params: {
                                data: response,
                                action: "DUPLICAR",
                            },
                            windowClass: "uibModalFullScreen",
                            isRenderRazorPartial: true,
                        });

                        modalRef.result.then((result) => {
                            if (typeof result === "object") {
                                $scope.validateOperationPrintAndPayment(result);
                            }
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            } catch (error) {
                console.log(error);
            }
        };

        $scope.openModalInvoiceParam = ({
            controller,
            template,
            size = "xl",
            params,
        }) => {
            modalSvc
                .openModalCustom({
                    controller,
                    template,
                    size,
                    params,
                    windowClass: "uibModalFullScreen",
                })
                .result.then((result) => {
                    if (typeof result === "object") {
                        $scope.getFacturas();
                    }
                });
        };

        $scope.askToDelete = async (item) => {
            try {
                if (item.disabledActionAnular) {
                    fS.sweetAlert("warning", "Este documento ya se cuentra anulada");
                    return;
                }


                const responseValidateNormativeSri = await docElectSvc.validateNormativeSri({
                    accion: 'anular',
                    identificacion: item.identificacionComprador,
                    fechaEmision: item.fechaEmision,
                    codDoc: item.codDoc
                })


                let paramsPermission = getParamsPermission(item, "A");
                const responseCheck = await $solicitudAutorizacionSvc.verifyUserPermission(paramsPermission);

                if (responseCheck && responseCheck.code === "2") {
                    openModalRegistrarSolicitudAuth(paramsPermission)
                    return;
                }


                // let response = await userCustomerPermissionSvc.checkHasPermissionToDelete(
                //     paramsPermission
                // );

                // if (!response) return;

                // if (response && response.code === "2") {
                //     userCustomerPermissionSvc.requestAuthorizationKey(paramsPermission);
                //     return;
                // }

                let modalRef = modalSvc.openWithComponent({
                    component: 'modalEliminarComponent',
                    size: 'md',
                    params: {
                        id: item.idDocumento,
                        isFactElect: true,
                        codDoc: 'FV'
                    }
                })
                modalRef.result.then(result => {
                    if (result && typeof result === 'object' && result.esAnulado) {

                        if (typeof $scope.permisoEditarDoc === "object" && $scope.permisoEditarDoc.requiereClave) {
                            //    userCustomerPermissionSvc.updateRequestKey(paramsPermission);
                            $solicitudAutorizacionSvc.update(paramsPermission)
                        }
                        $scope.getFacturas();
                    }
                })


                // let { isConfirmed } = await Swal.fire({
                //     title: "<small>Anular Factura?</small>",
                //     html: `<small>Esta Ud. seguro/a de anular este Factura de Venta <b>N° ${item.serieComprobante}</b></small>?`,
                //     icon: "warning",
                //     showCancelButton: true,
                //     confirmButtonColor: "#3085d6",
                //     cancelButtonColor: "#d33",
                //     cancelButtonText: "No, cancelar!",
                //     confirmButtonText: "Si, anular!",
                // });

                // if (isConfirmed) {
                //     facturaSvc
                //         .delete(item.idDocumento)
                //         .then((response) => {
                //             if (response.code === "0") {
                //                 fS.sweetAlert("warning", response.message, response.titleSms);
                //             }
                //             if (response.code === "1") {
                //                 fS.sweetAlert(
                //                     "success",
                //                     response.message,
                //                     response.titleSms,
                //                     1000
                //                 );

                //                 //Una vez actualizado el documento
                //                 if (
                //                     typeof $scope.permisoEditarDoc === "object" &&
                //                     $scope.permisoEditarDoc.requiereClave
                //                 ) {
                //                     userCustomerPermissionSvc.updateRequestKey(paramsPermission);
                //                 }
                //                 $scope.getFacturas();
                //             }
                //         })
                //         .catch((error) => {
                //             console.log(error);
                //         })
                // }
            } catch (error) {
                console.log(error);
            }
        };

        $scope.getReport = function (item) {
            let format = "pdf";
            let dataParms = {
                id: item.idDocumento,
                normalMethod: true,
                tipo: 1,
            };

            let parameters = {
                dataParams: JSON.stringify(dataParms),
                reportParams: JSON.stringify({
                    codigo: CODE_REPORT.RF,
                    codEstab: item.codEstab,
                    format,
                }),
                hasService: true,
            };

            commonSvc.getReport({
                parameters,
                format,
            });
        };

        //--------------------------------------------------COBROS----------

        $scope.opcionCobro = (item) => {
            if (item.esCobrado) {
                fS.sweetAlert(
                    "warning",
                    "<small>Este documento ya se encuentra cobrada!</small>"
                );
                return;
            }

            let params = {
                data: {
                    ...item,
                },
            };

            if (item.esContado) {
                $scope.openModalRapido(params);
            } else {
                $scope.openModalCobroDocumento(params);
            }
        };

        $scope.openModalCobroDocumento = async (params) => {
            try {
                const { fileCtrl, ctrl, template } = nombreModalContabilidad.COBRO_LOTE;
                let controller = (await import(fileCtrl))[ctrl];

                $scope.openModalCobro({
                    controller,
                    template,
                    params,
                    size: "xl",
                    //   windowClass: 'uibModalFullScreen'
                });
            } catch (error) {
                console.log(error);
            }
        };

        /**
         *
         * @param {object} params
         */
        $scope.openModalRapido = async (params) => {
            try {
                let { fileCtrl, ctrl, template } = nombreModalContabilidad.COBRO_RAPIDO;
                let controller = (await import(fileCtrl))[ctrl];

                $scope.openModalCobro({
                    controller,
                    template,
                    params,
                });
            } catch (error) {
                console.log(error);
            }
        };

        /**
         *
         * @param {object} param0
         */

        $scope.openModalCobro = ({
            controller,
            template,
            size = "lg",
            params,
            windowClass,
        }) => {
            let $modalRef = modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                keyboard: true,
                windowClass,
                isRenderRazorPartial: true,
            });

            $modalRef.result.then((result) => {
                if (typeof result == "object" || $scope.isRegister) {
                    $scope.getFacturas();
                }

                //Cuando el documento es Nuevo o Duplicado
                if ($scope.isPrintDocument == 1) {
                    //    $scope.getFacturas();
                    commonSvc.getPrinter(JSON.stringify($scope.parametersPrint));
                    $scope.isPrintDocument = null;
                }

                //Focus New Invoice
                if (btnNewInvoice) {
                    btnNewInvoice.focus();
                }
                $scope.isRegister = null;
                $scope.isPrintDocument = null;
            });
        };

        $scope.openModalCuota = async (item) => {
            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCuotaCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers["MC"];
                let template = nombreModalContabilidad.COBRO.templates["MC"];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    size: "xl",
                    params: item,
                    isRenderRazorPartial: true,
                });
                modalRef.result.then((result) => {
                    if (typeof result === "object" && result.isReload) {
                        $scope.getFacturas();
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        $scope.print = function (item) {
            let parameters = {
                idDocument: item.idDocumento,
                idTipoDocumento: item.idTipoDocumento,
                codEstab: item.codEstab,
                codDoc: "FV",
            };

            commonSvc.askToPrint({
                parameters: JSON.stringify(parameters),
            });
        };
    }

    /**
     *
     * MODAL FACTURA
     * Registrar
     * Actualizar
     * Duplicar
     */
    app.controller("modalFacturaCtrl", modalFacturaCtrl);
    modalFacturaCtrl.$inject = [
        "$scope",
        "$uibModalInstance",
        "$timeout",
        "$injector",
        "params",
    ];
    function modalFacturaCtrl(
        $scope,
        $uibModalInstance,
        $timeout,
        $injector,
        params
    ) {
        let ventaSvc = $injector.get("ventaService");
        let clienteSvc = $injector.get("clienteService");
        let gridOptionsSvc = $injector.get("gridOptionsService");
        let storageSvc = $injector.get("storageService");
        const docElectSvc = $injector.get('docElectService');

        let TAX_RATE_CODE = $injector.get("TAX_RATE_CODE");
        let userCustomerPermissionSvc = $injector.get(
            "userCustomerPermissionService"
        );

        let productUtil = $injector.get('productUtil');

        let infoAdicionalConfig = [];
        let isSetInfoAdicionalConfig = true;

        const FORM_PAGO_SRI_ACCION = {
            DEFAULT: "DEFAULT",
            FORMA_PAGO_SRI_CLIENTE: "FORMA_PAGO_SRI_CLIENTE",
            FORMA_PAGO_CHANGE: "FORMA_PAGO_CHANGE",
        };

        $scope.tipoDoc = tipoDoc;
        $scope.cuotas = [];
        $scope.infoEstabPtoEmi = {};

        $scope.data = {
            idFactura: 0,
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
        };

        $scope.dataFormaPago = {
            idFormaPagoSri: 0,
            idTiempoCredito: 0,
            plazo: 1,
            total: 0,
        };

        $scope.dataClone = {};

        $scope.cliente = {};
        $scope.newCustomer = false;

        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.bodegas = [];
        $scope.tarifasImpuesto = [];
        $scope.formasPago = [];
        $scope.tiposIdentificacion = [];

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
        };
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }

            gridApi.grid.element.on("keyup", function (ev) {
                ev.stopPropagation();
                if (ev.which == 13 || ev.keyCode == "13") {
                    if (($scope.config.searchCode == 1)) {
                        setFocusInputBarcode();
                    } else {
                        setFocusArticulo();
                    }

                    $scope.gridApi.grid.cellNav.clearFocus();
                }
            });

            gridApi.edit.on.afterCellEdit(
                $scope,
                (rowEntity, colDef, newValue, oldValue) => {
                    const isEmpty = (value) => [null, "", undefined].includes(value);
                    const negativeFields = [
                        "cantidad",
                        "precioUnitario",
                        "precioConIva",
                        "valorDescuento",
                        "porcentajeDescuento"
                    ];
                    const stockFields = ["idMedida", "cantidad", "idBodega"];

                    // Validar campos vacíos
                    if (isEmpty(rowEntity[colDef.field])) {
                        rowEntity[colDef.field] = oldValue;
                    }

                    // Validación de números negativos
                    if (negativeFields.includes(colDef.field) && newValue < 0) {
                        rowEntity[colDef.field] = oldValue;
                    }

                    // Validación de cantidad igual a 0
                    if (colDef.field === "cantidad" && Number(rowEntity[colDef.field]) === 0) {
                        rowEntity[colDef.field] = 1;
                    }

                    // Evitar la validación redundante de 'idMedida' y 'cantidad' si no cambian
                    if (colDef.field === "idMedida" && rowEntity.idMedida === oldValue) return;
                    if (colDef.field === "cantidad" && rowEntity.cantidad === oldValue) return;

                    // Verificación del stock
                    if (stockFields.includes(colDef.field) && rowEntity[colDef.field] !== oldValue) {
                        if (colDef.field === "cantidad" && rowEntity.cantidad > oldValue) {
                            checkNotificationStock(colDef.field, rowEntity, oldValue);
                        } else {
                            checkNotificationStock(colDef.field, rowEntity, oldValue);
                        }
                        return;
                    }

                    // Cálculos y actualización del producto
                    setCalculoTotales(colDef.field, rowEntity, oldValue);
                    updateRefProductoVenta();

                }
            );
        };

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

                // // Clona el objeto de la fila y la lista de artículos para evitar modificaciones directas.
                // let rowItemClone = structuredClone(rowEntity);
                // let gridOptionsClone = structuredClone($scope.gridOptions.data);

                // // Realiza la fusión de elementos en la lista de artículos clonada.
                // let dataItemMerge = fS.mergeItemStock(gridOptionsClone, rowItemClone);

                // // Si la cantidad no ha cambiado, no realizar más acciones.
                // if (dataItemMerge.cantidad == oldValue) return;

                // // Llama a un servicio para verificar la notificación de stock.
                // let cantidadStock = fS.getCantidadStock(
                //     dataItemMerge,
                //     $scope.data.fechaEmision
                // );
                // if (cantidadStock === 0) {
                //     setCalculoTotales(field, rowEntity, oldValue);
                //     return;
                // }
                // showLoader();

                // articuloSvc
                //     .checkNotificationStock({
                //         idArticulo: rowEntity.idArticulo,
                //         cantidad: cantidadStock,
                //         idBodega: rowEntity.idBodega,
                //         idMedida: rowEntity.idMedida,
                //     })
                //     .then(async (responseApi) => {
                //         // Oculta el indicador de carga después de recibir la respuesta del servicio.
                //         hideLoader();

                //         let { code, message, titleSms } = responseApi;

                //         // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
                //         if (code === "1") {
                //             setCalculoTotales(field, rowEntity, oldValue);
                //             return;
                //         }

                //         // Muestra un mensaje de advertencia y espera la confirmación del usuario.
                //         let { isConfirmed } = await Swal.fire({
                //             title: `<small>${titleSms}</small>`,
                //             icon: "warning",
                //             html: `<small>${message}</small>`,
                //             allowOutsideClick: false,
                //             allowEscapeKey: false,
                //         });

                //         // Según la confirmación, realiza acciones adicionales.
                //         if (isConfirmed) {
                //             if (code === "0") {
                //                 // Si el código es "0", restaura el valor anterior y realiza cálculos totales.
                //                 rowEntity[field] = oldValue;
                //                 setCalculoTotales(field, rowEntity, oldValue);
                //                 $("#custom-template-md-autocomplete-articulo").focus();
                //             }
                //             if (code === "2") {
                //                 // Si el código es "2", solo realiza cálculos totales.
                //                 setCalculoTotales(field, rowEntity, oldValue);
                //             }
                //         }
                //     })
                //     .catch((error) => {
                //         // Maneja errores en la llamada al servicio.
                //         hideLoader();
                //         console.log(error);
                //     });
            } catch (error) {
                console.log(error);
            }
        }

        $scope.setInfoEstabPtoEmi = function () {
            if ($scope.establecimientos.length > 0) {
                $scope.infoEstabPtoEmi.nombreComercial = $scope.establecimientos.find(
                    (item) => item.codEstab === $scope.data.codEstab
                ).nombreComercial;
            }

            if ($scope.puntosEmision.length > 0) {
                $scope.infoEstabPtoEmi.puntoEmision = $scope.puntosEmision.find(
                    (item) => item.idPuntoEmision === $scope.data.idPuntoEmision
                ).ptoEmi;
            }
            setInfoAdicional();
        };

        function calculateTotalItems(items) {
            return items.map((item) => {
                return {
                    ...item,
                    idFacturaDetalle:
                        params.action === "DUPLICAR" ? 0 : item.idFacturaDetalle,
                    precioConIva: fS.roundNumber(
                        item.precioConIva,
                        $scope.decimal.nroPrecio
                    ),
                };
            });
        }

        $scope.refreshUserPermission = function () {
            showLoader();
            userCustomerPermissionSvc
                .fetchUserPermission()
                .then((response) => {
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
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => hideLoader());
        };


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
            updateRefProductoVenta()
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
                articuloDefault,
                formasPago,
                tiposIdentificacion,
                infoAdicional,
            } = structuredClone(mainDataForm);

            $scope.establecimientos = estabs;
            $scope.formasPago = formasPago;
            $scope.tiposIdentificacion = tiposIdentificacion;

            let dataEstab = {};

            if (params && ["EDITAR", "DUPLICAR"].includes(params.action)) {
                const { comprobante } = params.data;
                dataEstab = $scope.establecimientos.find(
                    (estab) => estab.codEstab === comprobante.codEstab
                );
            } else {
                dataEstab = $scope.establecimientos.find((estab) => estab.defaultEstab);
            }

            $scope.data.codEstab = dataEstab.codEstab;
            $scope.dataClone.codEstab = dataEstab.codEstab;
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.bodegas = dataEstab.bodegas;
            infoAdicionalConfig = infoAdicional;

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
                let dataBodega = $scope.bodegas.find((bodega) => bodega.defaultBodega);
                $scope.data.idBodega = dataBodega.idBodega;
                $scope.dataClone.idBodega = $scope.data.idBodega;
            }
            if ($scope.tarifas.length > 0) {
                $scope.data.idTarifa = $scope.tarifas[0].idTarifa;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;
            }

            if (params && params.action === "NUEVO") {
                if ($scope.puntosEmision.length > 0) {
                    let dataPuntoEmision = $scope.puntosEmision.find(
                        (ptoEmi) => ptoEmi.defaultPtoEmi
                    );
                    $scope.data.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                }
                if ($scope.tiemposCredito.length > 0) {
                    let dataTiempoCredito = $scope.tiemposCredito.find(
                        (item) => item.diasCredito === 0 && item.numeroCuota === 1
                    );
                    $scope.data.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;

                    //Formas Pago
                    $scope.dataFormaPago.idTiempoCredito =
                        dataTiempoCredito.idTiempoCredito;
                    $scope.dataFormaPago.plazo = dataTiempoCredito.diasCredito;
                }

                if ($scope.vendedores.length > 0 && !$scope.config.multipleVendedor) {
                    $scope.data.idUsuario = $scope.vendedores.find(
                        (item) => item.predeterminado
                    ).idUsuario;
                } else {
                    $scope.data.idUsuario = 0;
                }

                //Cliente Predeterminado
                if (clienteDefault.idCliente > 0) {
                    $scope.cliente = structuredClone(clienteDefault);
                    if ($scope.cliente.idTiempoCredito > 0) {
                        $scope.data.idTiempoCredito = $scope.cliente.idTiempoCredito;
                    }
                }

                //Forma pago sri
                if ($scope.cliente.idFormaPagoSri > 0) {
                    setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.FORMA_PAGO_SRI_CLIENTE);
                } else {
                    setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.DEFAULT);
                }

                //Articulo Predeterminado
                if (articuloDefault.idArticulo > 0) {
                    updateRefProductoVenta();
                    $scope.refProductoVenta.onInventario({
                        idArticulo: articuloDefault.idArticulo
                    })
                    // articuloSvc
                    //     .getForSale({
                    //         idArticulo: articuloDefault.idArticulo,
                    //         idBodega: $scope.data.idBodega,
                    //     })
                    //     .then((dataArticuloApi) => {
                    //         $scope.setItemArticuloEnDetalle(dataArticuloApi);
                    //     });
                }

                getFechaVencimiento();
            }

            //Cuando el documento es duplicar
            if (params && params.action === "DUPLICAR") {
                const {
                    comprobante,
                    cliente,
                    items,
                    infoAdicionalDocumento,
                    formasPago,
                } = params.data;

                $scope.data = {
                    ...$scope.data,
                    ...structuredClone(comprobante),
                };
                $scope.data.fechaEmision = new Date();
                $scope.data.idFactura = 0;

                $scope.dataClone.codEstab = $scope.data.codEstab;
                $scope.gridOptions.data = calculateTotalItems(items);

                $scope.data.fechaEmisionEscrita = fS.getFechaEscrita(
                    $scope.data.fechaEmision
                );
                $scope.data.fechaVencimientoEscrita = fS.getFechaEscrita(
                    $scope.data.fechaVencimiento
                );

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(
                        (item) => item.predeterminado
                    ).idUsuario;
                } else {
                    $scope.data.idUsuario = 0;
                }

                $scope.cliente = cliente;
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;

                //Formas pagos
                $scope.dataFormaPago = formasPago[0];
                //Forma pago sri
                if ($scope.formasPago.length > 0) {
                    setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.FORMA_PAGO_CHANGE);
                }
                counterGridOptions();
                isSetInfoAdicionalConfig = false;
            }

            //Cuando el documento es editar
            if (params && params.action === "EDITAR") {
                const {
                    comprobante,
                    cliente,
                    items,
                    infoAdicionalDocumento,
                    formasPago,
                    cuotas,
                } = params.data;

                $scope.data = {
                    ...$scope.data,
                    ...structuredClone(comprobante),
                };
                $scope.dataClone.fechaEmision = $scope.data.fechaEmision;

                $scope.dataClone.codEstab = $scope.data.codEstab;

                //Calcular los subtotales del detalle
                $scope.gridOptions.data = calculateTotalItems(items);

                $scope.data.fechaEmisionEscrita = fS.getFechaEscrita(
                    $scope.data.fechaEmision
                );
                $scope.data.fechaVencimientoEscrita = fS.getFechaEscrita(
                    $scope.data.fechaVencimiento
                );

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(
                        (item) => item.predeterminado
                    ).idUsuario;
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

                //Formas pagos
                $scope.dataFormaPago = formasPago[0];

                //Forma pago sri
                if ($scope.formasPago.length > 0) {
                    setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.FORMA_PAGO_CHANGE);
                }
            }

            updateRefProductoVenta();




            $uibModalInstance.rendered.then(() => {
                if ($scope.config.searchCode) {
                    let el = document.getElementById("inputBarcode");
                    if (el) {
                        el.focus();
                    }
                } else {
                    let el = document.getElementById("custom-template-md-autocomplete-articulo");
                    if (el) {
                        el.focus()
                    }
                }
            });

            if (params.action === "NUEVO" && !($scope.data.idFactura > 0)) {
                if (
                    Object.keys(storageSvc.getObject("storeFacturaDetail")).length > 0
                ) {
                    storageSvc
                        .restoreInvoiceDetail("storeFacturaDetail")
                        .then((result) => {
                            if (result.isConfirmed) {
                                $scope.gridOptions.data = JSON.parse(
                                    result.dataInvoiceDetail[result.value]
                                );
                                delete result.dataInvoiceDetail[result.value];

                                storageSvc.setObject(
                                    "storeFacturaDetail",
                                    result.dataInvoiceDetail
                                );

                                updateRefProductoVenta();

                                recalculateTotalsSimple();
                                $scope.$apply();
                            }
                        });
                }
            }
            $scope.setInfoEstabPtoEmi();

            $uibModalInstance.rendered.then(() => {
                drawImpuestoTotales();
            });
        }

        function getFechaVencimiento() {
            if ($scope.data.fechaEmision && $scope.tiemposCredito.length > 0) {
                let fechaEmision = fS.setHoursToDate($scope.data.fechaEmision);
                let dataTiempoCredito = $scope.tiemposCredito.find(
                    (item) => item.idTiempoCredito === $scope.data.idTiempoCredito
                );
                let diasCredito =
                    typeof dataTiempoCredito === "object"
                        ? dataTiempoCredito.diasCredito
                        : 0;

                let { fechaVencimiento, fechaEmisionEscrita, fechaVencimientoEscrita } =
                    fS.sumarDiasAFecha(fechaEmision, diasCredito);

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
        };

        function setColumnDefs() {
            /**<a btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales'   result-modal-adicional="grid.appScope.resultModalAdicional(result)" class="btn btn-warning btn-xs text-white" title="Agregar dato Adicional" > <i class="fas fa-tags"></i></a >**/

            const ventaDetailPermission = $scope.permisoDetalleVenta;
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

            $scope.gridOptions.columnDefs = [
                {
                    name: "Op.",
                    enableCellEdit: false,
                    width: "12%",
                    minWidth: "100",
                    cellTemplate: isRegister() && CELL_TEMPLATE_OPTION,
                },
                {
                    name: "N°",
                    field: "n",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    width: "5%",
                    minWidth: "50",
                },
                {
                    name: "cód.",
                    field: "codigo",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    width: "8%",
                    minWidth: "100",
                },
                {
                    name: "idArticulo",
                    field: "idArticulo",
                    visible: false,
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
                    width: "25%",
                    minWidth: "100",
                },
                {
                    name: "Cant.",
                    field: "cantidad",
                    enableCellEdit: isRegister(),
                    enableCellEditOnFocus: isRegister(),
                    min: 1,
                    type: "number",
                    width: "6%",
                    minWidth: "50",
                },
                {
                    name: "Medida",
                    field: "idMedida",
                    cellFilter: "mapMedida:row.entity.medidas",
                    editableCellTemplate: "ui-grid/dropdownEditor",
                    enableCellEdit: isRegister() && ventaDetailPermission.medida,
                    enableCellEditOnFocus: isRegister() && ventaDetailPermission.medida,
                    allowCellFocus: isRegister() && ventaDetailPermission.medida,
                    editDropdownOptionsFunction: function (rowEntity) {
                        return rowEntity.medidas.map(function (val) {
                            return {
                                id: val.idMedida,
                                value: val.descripcion,
                            };
                        });
                    },
                    type: "number",
                    width: "8%",
                    minWidth: "100",
                },
                {
                    name: "codigoTipoIva",
                    field: "codigoTipoIva",
                    enableCellEdit: false,
                    width: "8%",
                    visible: false,
                },
                {
                    name: "I.V.A",
                    field: "idTipoIva",
                    width: "8%",
                    minWidth: "100",
                    type: "number",
                    editableCellTemplate: "ui-grid/dropdownEditor",
                    cellFilter: "cellFilterTipoIva:this",
                    editDropdownValueLabel: "descripcion",
                    editDropdownIdLabel: "idTipoIva",
                    enableCellEdit: isRegister() && ventaDetailPermission.tipoIva,
                    allowCellFocus: isRegister() && ventaDetailPermission.tipoIva,
                    enableCellEditOnFocus: isRegister() && ventaDetailPermission.tipoIva,
                    //    visible: config.porcentajeIva
                },
                {
                    name: "Tarifa",
                    field: "idTarifa",
                    width: "9%",
                    minWidth: "80",
                    cellFilter: "mapTarifa:row.entity.articuloTarifas",
                    editableCellTemplate: "ui-grid/dropdownEditor",
                    enableCellEdit: isRegister() && ventaDetailPermission.tarifa,
                    enableCellEditOnFocus: isRegister() && ventaDetailPermission.tarifa,
                    allowCellFocus: isRegister() && ventaDetailPermission.tarifa,
                    editDropdownOptionsFunction: (rowEntity) => {
                        return rowEntity.articuloTarifas.map((val) => ({
                            id: val.idTarifa,
                            value: val.tarifa + " - $" + val.precioConIva,
                        }));
                    },
                },
                {
                    name: "Precio U.",
                    field: "precioUnitario",
                    enableCellEditOnFocus: isRegister(),
                    enableColumnMenu: false,
                    allowCellFocus: isRegister(),
                    type: "number",
                    width: "8%",
                    minWidth: "90",
                    cellEditableCondition: function (scope) {

                        if (isRegister()) {
                            return scope.row.entity.llevaInventario
                                ? ventaDetailPermission.precioUnitario
                                : true;

                        }
                        return false;
                    },
                    // cellFilter: "currency:'$'",
                },
                {
                    name: "P. Iva",
                    field: "precioConIva",
                    min: 0,
                    type: "number",
                    enableCellEdit: isRegister(),
                    allowCellFocus: isRegister(),
                    enableCellEditOnFocus: isRegister(),
                    width: "7%",
                    minWidth: "90",
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.llevaInventario
                            ? ventaDetailPermission.precioConIva
                            : true;
                    },
                    // cellFilter: "currency:'$'",
                },
                {
                    name: "%",
                    field: "porcentajeDescuento",
                    // enableCellEdit: ventaDetailPermission.porcentajeDescuento,
                    // allowCellFocus: ventaDetailPermission.porcentajeDescuento,
                    // enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento,
                    enableCellEdit: isRegister(),
                    allowCellFocus: isRegister(),
                    enableCellEditOnFocus: isRegister(),
                    min: 0,
                    width: "4%",
                    minWidth: "60",
                    // cellFilter: "currency:'%'",
                    visible: ventaDetailPermission.porcentajeDescuento || false,
                    type: "number",
                    /*cellFilter: "limitTo:3",*/
                },
                {
                    name: "Desc.",
                    field: "valorDescuento",
                    // enableCellEdit: ventaDetailPermission.descuento,
                    // enableCellEditOnFocus: ventaDetailPermission.descuento,
                    // allowCellFocus: ventaDetailPermission.descuento,
                    enableCellEdit: isRegister(),
                    enableCellEditOnFocus: isRegister(),
                    allowCellFocus: isRegister(),
                    min: 0,
                    type: "number",
                    width: "4%",
                    minWidth: "65",
                    // cellFilter: "currency:'$'",
                    visible: ventaDetailPermission.descuento || false,
                },
                {
                    name: "SubTotal",
                    field: "precioTotalSinImpuesto",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: "number",
                    width: "7%",
                    minWidth: "50",
                    visible: true,
                    cellFilter: fS.cellFilterRoundToNumber(),
                    cellTooltip: function (row, col) {
                        return fS.cellTooltipGrid(row.entity, col.field);
                    },
                },
                {
                    name: "IVA",
                    field: "valorImpuesto",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: "number",
                    width: "5%",
                    minWidth: "50",
                    visible: true,
                    cellFilter: fS.cellFilterRoundToNumber(),
                    cellTooltip: function (row, col) {
                        return fS.cellTooltipGrid(row.entity, col.field);
                    },
                },
                {
                    name: "Total",
                    field: "total",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: "number",
                    width: "5%",
                    minWidth: "100",
                    visible: true,
                    cellFilter: fS.cellFilterRoundToNumber(),
                    cellTooltip: function (row, col) {
                        return fS.cellTooltipGrid(row.entity, col.field);
                    },
                },
                {
                    name: "Ice",
                    field: "ice",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: "number",
                    width: "6%",
                    minWidth: "100",
                    // cellFilter: "currency:'$'",
                    visible: false,
                },
                {
                    name: "Nota",
                    field: "nota",
                    enableCellEdit: isRegister(),
                    enableCellEditOnFocus: isRegister(),
                    type: "string",
                    width: "15%",
                    minWidth: "100",
                },
                {
                    name: "bodega",
                    field: "idBodega",
                    editableCellTemplate: "ui-grid/dropdownEditor",
                    cellFilter: "cellFilterBodega:this",
                    editDropdownValueLabel: "descripcion",
                    editDropdownIdLabel: "idBodega",
                    enableCellEdit: isRegister(),
                    enableCellEditOnFocus: isRegister(),
                    type: "number",
                    width: "11%",
                    minWidth: "100",
                },
            ];

            setWarehouseAndIVA();
        }

        function setFocusInputBarcode() {
            $timeout(function () {
                let inputBarcode = document.getElementById("inputBarcode");
                if (inputBarcode) {
                    inputBarcode.focus();
                }
            }, 100);
        }

        function setFocusArticulo() {
            $timeout(function () {
                let el = document.getElementById(
                    "custom-template-md-autocomplete-articulo"
                );
                if (el) {
                    el.focus();
                }
            }, 100);
        }

        /**
         * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
         */
        function setWarehouseAndIVA() {
            let indexTipoIva = $scope.gridOptions.columnDefs.findIndex(
                (item) => item.field === "idTipoIva"
            );
            let indexBodega = $scope.gridOptions.columnDefs.findIndex(
                (item) => item.field === "idBodega"
            );
            $scope.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray =
                $scope.tarifasImpuesto;
            $scope.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray =
                $scope.bodegas;

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

                    if (rowEntity.idFacturaDetalle > 0) {
                        $scope.gridOptionsItemsDeleted.push({
                            ...rowEntity,
                            cantidad: rowEntity.cantidadOriginal,
                            estado: 0,
                        });
                    }

                    //Recalculamos los totales
                    setCalculoTotales("cantidad", rowEntity, 0);
                    counterGridOptions();
                    updateRefProductoVenta()
                    $scope.$apply();
                }

                if (isConfirmed && rowEntity.datosAdicionales) {
                    $scope.infoAdicionalDocumento = $scope.infoAdicionalDocumento.filter(
                        (ia) => {
                            return !rowEntity.datosAdicionalesArticulo.some(
                                (iaa) => iaa.idInfoAdicional === ia.idInfoAdicional
                            );
                        }
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };

        function updateStatusDatosAdicionalesArticulo(rowEntity) {
            for (let item of rowEntity.datosAdicionalesArticulo) {
                item.selected = false;
            }
        }

        $scope.openModalArticle = function (item) {
            // if ($scope.config.detailDuplicate) {
            //     fS.sweetAlert(
            //         "warning",
            //         "No disponible para editar el artículo cuando se ha seleccionado <b>Duplicar Artículo</b>."
            //     );
            //     return;
            // }
            // $scope.gridApi.cellNav.scrollToFocus(
            //     $scope.gridOptions.data[0],
            //     $scope.gridOptions.columnDefs[2]
            // );

            // $scope.indexRow = $scope.gridOptions.data.indexOf(item);
            // $scope.$broadcast("editArticulo", item);
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )

            $scope.refProductoVenta.openModalArticulo(item);
        };

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
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger ml-2",
                    },
                    buttonsStyling: false,
                });

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: "<small>Cambiar Establecimiento?</small>",
                    html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Si, cambiar!",
                    cancelButtonText: "No, cancelar!",
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

                if (!isConfirmed) {
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                    return;
                }

                let dataEstab = $scope.establecimientos.find(
                    (item) => item.codEstab === $scope.data.codEstab
                );

                $scope.puntosEmision = dataEstab.puntosEmision;
                $scope.bodegas = dataEstab.bodegas;

                if (!($scope.puntosEmision.length > 0)) {
                    tS.toastr(
                        "info",
                        "No tienes Puntos de Emisión asignado a este establecimiento"
                    );
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                    return;
                }
                if (!($scope.bodegas.length > 0)) {
                    tS.toastr(
                        "info",
                        "No tienes bodegas asignado a este establecimiento"
                    );
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                    return;
                }

                // PtoEmi
                let dataPtoEmi = $scope.puntosEmision.find(
                    (item) => item.defaultPtoEmi
                );
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                //Bodegas
                let dataBodega = $scope.bodegas.find((item) => item.defaultBodega);
                $scope.data.idBodega = dataBodega.idBodega;

                $scope.dataClone.codEstab = $scope.data.codEstab;

                setIdBodegaInDetalle();
                resetCantidadToZeroAndRecalculateTotals();
                setWarehouseAndIVA();
                $scope.setInfoEstabPtoEmi();
                $scope.$apply();
            } catch (error) {
                console.trace(error);
            }
        };

        $scope.getAllTiempoCredito = function () {
            if (isUpdate()) {
                tS.toastr("warning", "No disponible en actualizar!");
                return;
            }
            facturaSvc
                .getDataForm()
                .then((response) => {
                    $scope.tiemposCredito = response.tiemposCredito;
                })
        };

        $scope.onChangeTiempoCredito = function () {
            if (!$scope.permisoComprobanteVenta.tiempoCredito) {
                tS.toastr("warning", "No tienes permiso para realizar esta acción");
                return;
            }

            getFechaVencimiento();
        };

        $scope.onChangeFechaEmision = function () {
            try {
                if (!$scope.permisoComprobanteVenta.fechaEmision) {
                    $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
                    tS.toastr("warning", "No tienes permiso para realizar esta acción");
                    return;
                }
                getFechaVencimiento();
            } catch (error) {
                console.log(error);
                $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
            }
            updateRefProductoVenta()
        };

        //==============================START CUSTOMER===========================
        $scope.onKeyupCustomer = function () {
            if (!$scope.cliente.nombreFiscal) {
                $scope.cliente = {};
                $scope.newCustomer = false;
            }
        };

        $scope.onSelectedClienteChange = async function (item) {
            try {
                if (
                    !item.validationSri &&
                    ["R", "C"].includes(item.tipoIdentificacion)
                ) {
                    Swal.fire({
                        icon: "warning",
                        html: "Datos Incorrectos!",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Actualizar con el SRI!.",
                        cancelButtonText: "Cancelar",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            let { fileCtrl, controllers, templates } =
                                nombreModalVenta.CLIENTE;
                            let ctrl = (await import(fileCtrl))[controllers["M"]];
                            let template = templates["M"];

                            let modalRef = modalSvc.openModalCustom({
                                controller: ctrl,
                                template,
                                size: "xl",
                                params: {
                                    ...item,
                                    isUpdateDataCustomerFromSRI: true,
                                },
                                isRenderRazorPartial: true,
                            });

                            modalRef.result.then((result) => {
                                if (typeof result === "object") {
                                    setCustomerData(item);
                                }
                            });
                        }
                    });
                    return;
                }

                if (
                    ["R", "C", "P"].includes(item.tipoIdentificacion) &&
                    $scope.notificacionVenta.notificacionVenta
                ) {
                    let isPendientAccount = await ventaSvc.verifyPendientAccount({
                        idCliente: item.idCliente,
                    });
                    if (isPendientAccount) {
                        setCustomerData(item);
                    } else {
                        setCustomerData(item);
                    }
                } else {
                    setCustomerData(item);
                }
            } catch (error) {
                $scope.cliente = {};
                console.log("ERROR AL OBTENER DATOS DEL CLIENTE", error);
                $scope.$apply();
            }
        };

        async function setCustomerData(item) {
            let dataCliente = await clienteSvc.findById(item.idCliente);
            $scope.cliente = dataCliente;
            if (!($scope.data.idFactura > 0)) {
                if ($scope.cliente.idTiempoCredito > 0) {
                    $scope.data.idTiempoCredito = $scope.cliente.idTiempoCredito || 0;
                }

                $scope.data.fechaEmision = new Date();
                getFechaVencimiento();
            }

            if ($scope.cliente.idFormaPagoSri > 0) {
                setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.FORMA_PAGO_SRI_CLIENTE);
            } else {
                setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.DEFAULT);
            }

            $scope.$apply();
        }

        $scope.receiveDataCustomerSRI = function (result) {
            $scope.newCustomer = !(result.idCliente > 0);
            $scope.cliente = result;
            setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.DEFAULT);
        };

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

        //=================================END CUSTOMER============================

        $scope.onChangeBodega = async function () {
            try {
                let bodega = $scope.bodegas.find(
                    (item) => item.idBodega === $scope.data.idBodega
                );
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger ml-2",
                    },
                    buttonsStyling: false,
                });

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: "<small>Cambiar Bodega</small>",
                    html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega.descripcion}</b>  en el detalle del Documento?</small>`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: `Si, cambiar!`,
                    cancelButtonText: "No, cancelar!",
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

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
                console.log(error);
            }
        };

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
                        columnDefs: $scope.gridOptions.columnDefs,
                    });

                    objCalculo["cantidad"] && objCalculo["cantidad"]();
                    objCalculo["calculoTotalDetalle"]();
                }
                recalculateTotalsSimple();
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onChangeTarifaGeneral = function () {
            if (!$scope.permisoComprobanteVenta.tarifa) {
                $scope.data.idTarifa = $scope.dataClone.idTarifa;
                tS.toastr("warning", "No tienes permiso para realizar esta acción");
                return;
            }

            let tarifa = $scope.tarifas.find(
                (item) => item.idTarifa === $scope.data.idTarifa
            );
            Swal.fire({
                html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: `Sí, cambiar!`,
                cancelButtonText: "No, cancelar!",
                allowOutsideClick: false,
            }).then(result => {


                if (result.isConfirmed) {
                    $scope.dataClone.idTarifa = $scope.data.idTarifa;

                    if ($scope.gridOptions.data.length > 0 &&
                        gridOptionsSvc.setTarifaInDetail(
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

                updateRefProductoVenta()
            })


        };

        //=================================START PRODUCT=======================================
        function addRow() {
            const obj = {
                uniqueRowDetalle: fS.generateUuidv4(),
                idFacturaDetalle: 0,
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
                valorDescuento: 0,
                totalDescuento: 0,
                ice: 0,
                idBodega: 0,
                subTotal: 0,
                total: 0,
                nota: null,
                llevaInventario: false,
                datosAdicionales: false,
                estado: 1,
            };
            return structuredClone(obj)
        }

        // $scope.setItemArticuloEnDetalle = function (dataArticulo) {
        //     try {
        //         $scope.dataArticulo = dataArticulo;

        //         const {
        //             articulo,
        //             medidas,
        //             datosAdicionalesArticulo,
        //             consolidacionesFecha,
        //         } = $scope.dataArticulo;

        //         let index = 0,
        //             entity = {},
        //             tarifaImpuesto = {},
        //             cantidad = 0;

        //         //verificar si hay un articulo que lleva inventario mas de uno
        //         let itemsDuplicated = $scope.gridOptions.data.filter(
        //             (item) =>
        //                 item.llevaInventario && item.idArticulo === articulo.idArticulo
        //         );

        //         let findIndexById = $scope.gridOptions.data.findIndex(
        //             (item) =>
        //                 item.llevaInventario && item.idArticulo === articulo.idArticulo
        //         );

        //         //Verificamos si tiene configurado: <<Duplicar Artículo en el detalle>>
        //         if ($scope.config.detailDuplicate) {
        //             addRow();
        //             index = $scope.gridOptions.data.length - 1;
        //             entity = $scope.gridOptions.data[index];
        //             entity.cantidad = 1;
        //         } else {
        //             if (itemsDuplicated.length > 1) {
        //                 fS.sweetAlert(
        //                     "warning",
        //                     `El elemento ${articulo.descripcion} aparece más de una vez en el detalle.`
        //                 );
        //                 return;
        //             }

        //             if (findIndexById === -1) {
        //                 addRow();
        //                 index = $scope.gridOptions.data.length - 1;
        //                 entity = $scope.gridOptions.data[index];
        //                 entity.cantidad = 1;
        //             } else {
        //                 index = findIndexById;
        //                 entity = $scope.gridOptions.data[index];
        //                 cantidad = entity.cantidad;
        //                 entity.cantidad = cantidad + 1;
        //             }
        //         }

        //         let dataMedida = medidas.find((medida) => medida.defaultMedida);

        //         entity.idArticulo = articulo.idArticulo;
        //         entity.codigo = articulo.codigoArticulo;
        //         entity.descripcion = articulo.descripcion;

        //         tarifaImpuesto = $scope.tarifasImpuesto.find(
        //             (ti) => ti.codigoPorcentaje === articulo.codigoPorcentaje
        //         );

        //         entity.idImpuesto = tarifaImpuesto.idImpuesto;
        //         entity.idTipoIva = articulo.idTipoIva;
        //         entity.codigoPorcentaje = articulo.codigoPorcentaje;
        //         entity.tarifa = articulo.tarifa;
        //         //}

        //         entity.ice = articulo.valorIce;
        //         entity.idBodega = $scope.data.idBodega;
        //         entity.llevaInventario = articulo.llevaInventario;
        //         entity.datosAdicionales = articulo.datosAdicionales;
        //         entity.productoFraccionable = articulo.productoFraccionable;
        //         entity.medidas = medidas; //Lista Medida
        //         entity.idMedida = dataMedida.idMedida; //Medida por defecto
        //         entity.conversion = dataMedida.conversion;
        //         entity.precioCosto = dataMedida.precioCosto;
        //         entity.precioCostoFraccionado = dataMedida.precioCostoFraccionado;
        //         entity.articuloTarifas = dataMedida.tarifas;

        //         entity.datosAdicionalesArticulo = datosAdicionalesArticulo.map(
        //             (daa) => {
        //                 return {
        //                     ...daa,
        //                     uniqueRowDetalle: entity.uniqueRowDetalle,
        //                 };
        //             }
        //         ); //
        //         entity.consolidacionesFecha = consolidacionesFecha;

        //         let tarifa = entity.articuloTarifas.find(
        //             (item) => item.idTarifa === $scope.data.idTarifa
        //         );
        //         entity.idTarifa = $scope.data.idTarifa;
        //         entity.precioSinSubsidio = articulo.precioSinSubsidio;
        //         entity.precioUnitario = fS.roundNumber(
        //             tarifa.precioVenta,
        //             $scope.decimal.nroPrecio
        //         );
        //         entity.precioConIva = fS.roundNumber(
        //             tarifa.precioConIva,
        //             $scope.decimal.nroPrecio
        //         );
        //         entity.cantMinimaVentaPorMayor = articulo.cantMinimaVentaPorMayor;
        //         $scope.indexRow = index;
        //         setCalculoTotales("precioUnitario", entity, 0);
        //         focusColumnCantidad();
        //         //checkNotificationStock("cantidad", entity, cantidad);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };

        function focusColumnCantidad(index, llevaInventario) {
            let indexCol = 0;

            if (($scope.config.searchCode == 1)) {
                setFocusInputBarcode();
                return
            }

            if (llevaInventario) {
                indexCol = $scope.gridOptions.columnDefs.findIndex(
                    (item) => item.field === "cantidad"
                );
            } else {
                indexCol = $scope.gridOptions.columnDefs.findIndex(
                    (item) => item.field === "descripcion"
                );
            }
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            );
            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[index],
                    $scope.gridOptions.columnDefs[indexCol]
                );
                $scope.indexRow = null;
            }, 30);

            counterGridOptions();
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
                columnDefs: $scope.gridOptions.columnDefs,
            });

            objCalculo[colField] && objCalculo[colField]();

            objCalculo["calculoTotalDetalle"]();
            recalculateTotalsSimple();
        }

        /**
         * Calculamos todos los totales y subtotales del comprobantes
         */
        function recalculateTotalsSimple() {
            drawImpuestoTotales();
        }

        $scope.calcularPorcentajeDescuento = function () {
            if (!$scope.permisoComprobanteVenta.porcentajeDescuento) {
                $scope.data.porcentajeDescuento = 0;
                tS.toastr("warning", "No tienes permiso para realizar esta acción");
                return;
            }
            if ($scope.gridOptions.data.length === 0) {
                return;
            }

            if (
                typeof $scope.data.porcentajeDescuento !== "number" ||
                isNaN($scope.data.porcentajeDescuento)
            ) {
                tS.toastr("warning", "Ingrese un Número Válido");
                return;
            }

            if ($scope.data.porcentajeDescuento <= 100) {
                gridOptionsSvc.setPorcentajeDescuentoAll(
                    $scope.gridOptions,
                    $scope.data,
                    $scope.decimal,
                    gridOptionsSvc.calculoColDef
                );
                //redondeo del numero porcentaje
                $scope.data.porcentajeDescuento = fS.roundNumber(
                    $scope.data.porcentajeDescuento,
                    $scope.decimal.nroTotalSubTotal
                );
                recalculateTotalsSimple();
            } else {
                tS.toastr(
                    "warning",
                    "El Porcentaje de Descuento tiene que ser menor o igual a 100"
                );
            }
        };

        //Calcular Porcentaje  Descuento
        $scope.calcularDescuento = function () {
            try {
                if (!$scope.permisoComprobanteVenta.descuento) {
                    $scope.data.descuento = 0;
                    tS.toastr("warning", "No tienes permiso para realizar esta acción");
                    return;
                }
                if ($scope.gridOptions.data.length === 0) {
                    return;
                }
                if (
                    typeof $scope.data.totalDescuento !== "number" ||
                    isNaN($scope.data.totalDescuento)
                ) {
                    tS.toastr("warning", "Ingrese un númeto válido", "Valor Descuento");
                    return;
                }

                const { subTotalSinImpuestos } = gridOptionsSvc.getSubTotalSinImpuesto(
                    $scope.gridOptions.data
                );
                if ($scope.data.totalDescuento <= subTotalSinImpuestos) {
                    let porcentajeDescuento =
                        ($scope.data.totalDescuento * 100) / subTotalSinImpuestos;
                    $scope.data.porcentajeDescuento = fS.roundNumber(
                        porcentajeDescuento,
                        $scope.decimal.nroDescuentoDetalle
                    );
                    //setPorcentajeDescuentoAll($scope.data.porcentajeDescuento)
                    gridOptionsSvc.setPorcentajeDescuentoAll(
                        $scope.gridOptions,
                        $scope.data,
                        $scope.decimal,
                        gridOptionsSvc.calculoColDef
                    );
                    recalculateTotalsSimple();
                } else {
                    tS.toastr(
                        "warning",
                        "El Valor Descuento no puede ser mayor al total"
                    );
                }
            } catch (error) {
                console.log("CALCULO DE TOTAL DESCUENTO", error);
            }
        };

        $scope.getImporteTotal = function () {
            if (!$scope.decimal) return;
            let total = Number($scope.data.total);
            let transporte = Number($scope.data.transporte);
            let recargo = Number($scope.data.recargo);
            let importeTotal = total + transporte + recargo;
            $scope.data.total = importeTotal;
            $scope.dataFormaPago.total = fS.roundNumber(
                importeTotal,
                $scope.decimal.importeTotal
            );
            return fS.roundNumber(importeTotal, $scope.decimal.importeTotal);
        };

        function drawImpuestoTotales() {
            try {
                let dataImpuestoTotales = gridOptionsSvc.getImpuestoTotales({
                    items: $scope.gridOptions.data,
                    decimal: $scope.decimal,
                    tarifasImpuesto: $scope.tarifasImpuesto.slice(),
                    TAX_RATE_CODE,
                });
                let {
                    subTotalSinImpuestos,
                    irbpnr,
                    importeTotal,
                    totalDescuento,
                    porcentajeDescuento,
                    propina,
                } = dataImpuestoTotales;

                // Crear la estructura HTML con un template literal
                const htmlTemplate =
                    gridOptionsSvc.impuestoTotalesHtml(dataImpuestoTotales);
                let drawImpuestoTotalesElement = document.getElementById(
                    "drawImpuestoTotales"
                );
                if (drawImpuestoTotalesElement) {
                    drawImpuestoTotalesElement.innerHTML = htmlTemplate;
                }

                $scope.data.subTotalSinImpuestos = subTotalSinImpuestos;
                $scope.data.total = importeTotal;
                $scope.data.totalDescuento = totalDescuento;
                $scope.data.porcentajeDescuento = porcentajeDescuento;
                $scope.data.irbpnr = irbpnr;
                $scope.data.propina = propina;

                $scope.dataFormaPago.total = importeTotal;

                updateRefProductoVenta()

            } catch (error) {
                console.log(error);
            }
        }

        function setDataFormaPagoSri(tipoAction) {
            let dataFormaPago = {};
            if (tipoAction === FORM_PAGO_SRI_ACCION.DEFAULT) {
                dataFormaPago =
                    $scope.formasPago.find((item) => {
                        if ($scope.config.idFormaPagoSri > 0) {
                            return item.idFormaPagoSri === $scope.config.idFormaPagoSri;
                        } else {
                            return item.codigo === "01";
                        }
                    }) || {};
            }
            if (tipoAction === FORM_PAGO_SRI_ACCION.FORMA_PAGO_SRI_CLIENTE) {
                dataFormaPago = findFormaPagoById($scope.cliente.idFormaPagoSri);
            }
            if (tipoAction === FORM_PAGO_SRI_ACCION.FORMA_PAGO_CHANGE) {
                dataFormaPago = findFormaPagoById($scope.dataFormaPago.idFormaPagoSri);
            }

            $scope.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
            $scope.dataFormaPago.infoReferencia = dataFormaPago.infoReferencia;

            function findFormaPagoById(idFormaPagoSri) {
                return (
                    $scope.formasPago.find(
                        (item) => item.idFormaPagoSri === idFormaPagoSri
                    ) || {}
                );
            }
        }
        $scope.onChangeFormaPago = function () {
            setDataFormaPagoSri(FORM_PAGO_SRI_ACCION.FORMA_PAGO_CHANGE);
        };

        function isValidForm() {
            if (!$scope.data.codEstab) {
                tS.toastr("warning", "Seleccione el Establecimiento");
                return;
            }
            if (!($scope.data.idPuntoEmision > 0)) {
                tS.toastr("warning", "Seleccione el Punto de Emisión");
                return;
            }
            if (!($scope.data.idTiempoCredito > 0)) {
                tS.toastr("warning", "Seleccione el Tiempo Credito");
                return;
            }
            if (!fS.isDateValid($scope.data.fechaEmision)) {
                tS.toastr("warning", "Ingrese la Fecha de emisión");
                return;
            }

            if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
                tS.toastr(
                    "warning",
                    "La fecha de emisión del documento no puede ser posterior a la fecha actual."
                );
                return;
            }

            let ajusteFechaEmision = fS.ajustarFechaEmision(
                isUpdate(),
                $scope.data.fechaEmision,
                $scope.data.fechaEmisionDocCreado
            );

            if (ajusteFechaEmision) {
                $scope.data.fechaEmision = ajusteFechaEmision;
            } else {
                console.log("Error al justar la fecha de Emisión");
                return;
            }

            if (!fS.isDateValid($scope.data.fechaVencimiento)) {
                tS.toastr("warning", "Seleccione la Fecha de vencimiento");
                return;
            }

            //===================Start customer validate ============================
            if (
                $scope.cliente.idCliente === 0 &&
                "razonSocialComprador" in $scope.cliente &&
                "nombreComercial"
            ) {
                if (!($scope.cliente.idTipoIdentificacion > 0)) {
                    tS.toastr(
                        "warning",
                        `idTipoIdentificacion no proporcionada: ${$scope.cliente.idTipoIdentificacion} `
                    );
                    return;
                }

                if (
                    !$scope.cliente.razonSocialComprador ||
                    !$scope.cliente.nombreComercial
                ) {
                    tS.toastr("warning", "Seleccione el Cliente");
                    return;
                }
            } else if (!($scope.cliente.idCliente > 0)) {
                tS.toastr("warning", "Seleccione el Cliente");
                return;
            }

            if (!($scope.data.idUsuario > 0)) {
                tS.toastr("warning", "Seleccione el Vendedor");
                return;
            }

            //===================End customer validate ============================

            if ($scope.gridOptions.data.length === 0) {
                tS.toastr("warning", "Ingrese al menon un artículo en el detalle");
                return;
            }

            if (
                $scope.gridOptions.data.some(
                    (row) => row.llevaInventario && row.cantidad === 0
                )
            ) {
                tS.toastr(
                    "warning",
                    "No es posible vender artículos con inventario cuando la cantidad es igual a 0."
                );
                return;
            }

            if ($scope.gridOptions.data.some((row) => !(row.idBodega > 0))) {
                tS.toastr(
                    "warning",
                    "Seleccione la bodega en el detalle de los artículos"
                );
                return;
            }

            for (let item of $scope.gridOptions.data) {
                if (item.precioSinSubsidio > 0 && item.precioUnitario >= item.precioSinSubsidio) {
                    tS.toastr({
                        type: "warning",
                        message: `Artículo ${item.descripcion}: El precio de venta no puede ser mayor o igual al precio sin subsidio.`,
                    });
                    throw new Error(`Artículo ${item.descripcion}: El precio de venta no puede ser mayor o igual al precio sin subsidio.`);
                }
            }



            // if (
            //     $scope.gridOptions.data.some((item) =>
            //         item.articuloTarifas.some(
            //             (ta) =>
            //                 ta.ventaPorMayor && item.cantidad < item.cantMinimaVentaPorMayor
            //         )
            //     )
            // ) {
            //     for (let item of $scope.gridOptions.data) {
            //         if (
            //             item.articuloTarifas.some(
            //                 (ta) =>
            //                     ta.ventaPorMayor && item.cantidad < item.cantMinimaVentaPorMayor
            //             )
            //         ) {
            //             fS.sweetAlert(
            //                 "warning",
            //                 `Artículo ${item.descripcion}: La cantidad mínima requerida para la venta al por mayor no se ajusta a la cantidad asignada al artículo.`
            //             );
            //         }
            //     }
            //     return;
            // }

            //validacion de calculos
            if (isRegister()) {
                let dataValicion = gridOptionsSvc.validarCalculosPorProducto(
                    $scope.gridOptions.data
                );
                if (!dataValicion.esValido) {
                    console.log(dataValicion);
                    return;
                }
            }

            if ($scope.data.total <= 0) {
                tS.toastr(
                    "warning",
                    "No se puede generar el documento con valor total 0!"
                );
                return;
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
            return params.action === "NUEVO" || params.action === "DUPLICAR";
        }

        function isUpdate() {
            return params.action === "EDITAR";
        }

        const validateCuota = function () {
            let objParamsCuota = {
                fechaEmision: $scope.data.fechaEmision,
                tiemposCredito: $scope.tiemposCredito,
                idTiempoCredito: $scope.data.idTiempoCredito,
                montoTotal: $scope.data.total,
                cuotas: $scope.cuotas,
            };
            let cuotas = [];
            let montoTotalCuota = 0;

            if (isRegister()) {
                let dataCuota = fS.calcularCuotas(objParamsCuota);
                cuotas = dataCuota.cuotas;
                montoTotalCuota = dataCuota.montoTotalCuota;
            }
            if (isUpdate()) {
                let dataCuota = fS.updateCuotas(objParamsCuota);
                cuotas = dataCuota.cuotas;
                montoTotalCuota = dataCuota.montoTotalCuota;
            }

            if (
                fS.roundNumber(montoTotalCuota, 2) !==
                fS.roundNumber($scope.data.total, 2)
            ) {
                tS.toastr(
                    "warning",
                    "No coincide el total de la cuota con el importe total del documento."
                );
                return [];
            }

            return cuotas;
        };

        function isValidTotals() {
            let { subTotalSinImpuestos, importeTotal, totalDescuento } =
                gridOptionsSvc.getImpuestoTotales({
                    items: $scope.gridOptions.data,
                    decimal: $scope.decimal,
                    tarifasImpuesto: $scope.tarifasImpuesto.slice(),
                    TAX_RATE_CODE,
                });

            if ($scope.data.subTotalSinImpuestos !== subTotalSinImpuestos) {
                tS.toastr(
                    "warning",
                    `El valor del Subtotal sin impuestos: ${$scope.data.subTotalSinImpuestos} difiere del valor del Subtotal sin impuestos en el detalle: ${subTotalSinImpuestos}`
                );
                return;
            }

            if ($scope.data.totalDescuento !== totalDescuento) {
                tS.toastr(
                    "warning",
                    `El valor total del descuento: ${$scope.data.totalDescuento} no coincide con el descuento total calculado en el detalle: ${totalDescuento}`
                );
                return;
            }

            if ($scope.data.total !== importeTotal) {
                tS.toastr(
                    "warning",
                    `El valor del importe total: ${$scope.data.total} difiere del importe total calculado en el detalle: ${importeTotal}`
                );
                return;
            }

            return true;
        }

        // Función para registrar el documento
        const registerAndUpdate = async (query) => {

            if (isRegister()) {
                return await facturaSvc.save(query)
            }

            if (isUpdate()) {
                return await facturaSvc
                    .update($scope.data.idFactura, query)
            }
        };

        $scope.isSaving = false;

        $scope.onSave = async function () {
            try {

                if ($scope.isSaving) return;

                let serieComprobante = null,
                    titleSwal = "",
                    htmlSwal = "",
                    confirmButtonText = "";
                let validateForm = isValidForm();
                if (!validateForm) {
                    throw "Invalid form!";
                }

                if (!isValidTotals()) return;

                let cuotas = validateCuota();

                if (cuotas && cuotas.length === 0) return;

                const responseValidateNormativeSri = await docElectSvc.validateNormativeSri({
                    accion: 'guardar',
                    identificacion: $scope.cliente.numeroIdentificacion,
                    importeTotal: $scope.data.total,
                    idFormaPago: $scope.dataFormaPago.idFormaPagoSri,
                    codDoc: '01'
                })

                if (isRegister()) {
                    serieComprobante = await facturaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    });
                    if (!serieComprobante)
                        throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                    titleSwal = "<small>Guardar Factura</small>";
                    confirmButtonText = "Guardar";
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;
                } else if (isUpdate()) {
                    serieComprobante = $scope.data.serieComprobante;
                    titleSwal = "<small>Actualizar Factura</small>";
                    confirmButtonText = "Actualizar";
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;
                }

                const customSwal = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger ml-2",
                    },
                    buttonsStyling: false,
                });

                let { isConfirmed } = await customSwal.fire({
                    title: titleSwal,
                    html: htmlSwal,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText,
                    cancelButtonText: "No, cancelar!",
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

                if (!isConfirmed) return;

                //Mappeamos todo el objecto necesario para guardar factura.
                let params = facturaSvc.queryMapper({
                    data: $scope.data,
                    dataFormaPago: $scope.dataFormaPago,
                    cliente: $scope.cliente,
                    detalles: $scope.gridOptions.data,
                    itemsDeleted: $scope.gridOptionsItemsDeleted,
                    infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                    cuotas,
                });

                //Registar Doc
                if (isRegister()) {
                    const managedRegister = fS.fetchManager(registerAndUpdate);

                    $scope.isSaving = true;
                    managedRegister(params).then(response => {
                        $scope.isSaving = false;
                        if (!response) return

                        if (response.code === "0") {
                            fS.sweetAlert("warning", response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert(
                                "success",
                                "Registrado Correctamente",
                                response.titleSms,
                                1000
                            );
                            let mainData = {
                                isRegister: true,
                                data: response.dataResponse,
                            };
                            $uibModalInstance.close(mainData);
                        }


                    }).catch(error => {
                        $scope.isSaving = false;
                        console.log(error);
                    }).finally(() => {
                        $scope.isSaving = false;
                    })
                }
                if (isUpdate()) {
                    const managedUpdate = fS.fetchManager(registerAndUpdate);

                    $scope.isSaving = true;
                    managedUpdate(params).then(response => {
                        $scope.isSaving = false;
                        if (!response) return;

                        if (response.code === "0") {
                            fS.sweetAlert("warning", response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert(
                                "success",
                                "Registrado Correctamente",
                                response.titleSms,
                                1000
                            );
                            $uibModalInstance.close({
                                ...response,
                                isUpdate: true,
                            });
                        }

                    }).catch(error => {
                        $scope.isSaving = false;
                        console.log(error);
                    }
                    ).finally(() => {
                        $scope.isSaving = false;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };

        $scope.resultModalDatoAdicional = function (result) {
            $scope.infoAdicionalDocumento = result;
        };

        async function askToSaveStorage() {
            try {
                await storageSvc.askToSaveDetailDoc(
                    "storeFacturaDetail",
                    $scope.gridOptions.data
                );
                $uibModalInstance.close();
            } catch (error) {
                console.log(error);
            }
        }

        $scope.closeModal = () => {
            if ($scope.gridOptions.data.length > 0) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        denyButton: "btn btn-info ml-2",
                        cancelButton: "btn btn-danger ml-2",
                    },
                    buttonsStyling: false,
                });

                swalWithBootstrapButtons
                    .fire({
                        title: "Salir ?",
                        html: "<small>Tienes un documento en proceso, desea salir ahora?</small>",
                        icon: "warning",
                        showCancelButton: true,
                        showConfirmButton: true,
                        showDenyButton: true,
                        confirmButtonText: "Apartar",
                        denyButtonText: "Si, salir",
                        cancelButtonText: "No, cancelar!",
                        focusDeny: true,
                        reverseButtons: false,
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            askToSaveStorage();
                        }

                        if (result.isDenied) {
                            $uibModalInstance.close();
                        }
                    });
                return;
            }
            $uibModalInstance.close();
        };
    }
})(window.angular);
