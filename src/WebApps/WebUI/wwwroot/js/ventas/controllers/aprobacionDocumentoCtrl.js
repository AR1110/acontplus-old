(function () {

    'use strict';

    //Variables Constantes
    const URL_TEMPLATE = '~/Pages/AprobacionDocumento/'

    //Variable servicios 
    let tS = {};
    let fS = {};
    let commonSvc = {};
    let aprobacionDocSvc = {};
    let clienteSvc = {};
    let notaEntregaSvc = {};
    let proformaSvc = {};
    let facturaSvc = {};
    let gridOptionsSvc = {};
    let TAX_RATE_CODE = {};
    let idUsuarioRol = 0;

    let mainDataForm = {};
    let DOC_TYPE = {}
    let SRI_IDENTIFITION_CODE = {}

    app.controller('aprobacionDocumentoCtrl', aprobacionDocumentoCtrl);

    aprobacionDocumentoCtrl.$inject = ['$scope', '$filter', '$injector', 'modalService', 'decodeToken'];

    function aprobacionDocumentoCtrl($scope, $filter, $injector, modalSvc, decodeToken) {

        //Injection Services 
        commonSvc = $injector.get('commonService');
        clienteSvc = $injector.get('clienteService');
        aprobacionDocSvc = $injector.get('aprobacionDocService');
        notaEntregaSvc = $injector.get('notaEntregaService');
        proformaSvc = $injector.get('proformaService');
        facturaSvc = $injector.get('facturaService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');
        gridOptionsSvc = $injector.get('gridOptionsService');
        TAX_RATE_CODE = $injector.get('TAX_RATE_CODE');
        DOC_TYPE = $injector.get('DOC_TYPE');
        SRI_IDENTIFITION_CODE = $injector.get('SRI_IDENTIFITION_CODE');

        idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.moreSearchOptions = false;
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            maxSize: 5,
            totalRecords: 0
        }


        let OPTION_APROBACION = Object.freeze({
            0: Object.freeze({
                docOrigen: {
                    descripcion: 'Nota de Entrega',
                    codDoc: DOC_TYPE.NE,
                },
                docDestino: {
                    descripcion: 'Factura',
                    codDoc: DOC_TYPE.FV_SRI,
                }
            }),
            1: Object.freeze({
                docOrigen: {
                    descripcion: 'Proforma',
                    codDoc: DOC_TYPE.PR
                },
                docDestino: {
                    descripcion: 'Factura',
                    codDoc: DOC_TYPE.FV_SRI,
                }
            }),
            2: Object.freeze({
                docOrigen: {
                    descripcion: 'Proforma',
                    codDoc: DOC_TYPE.PR,
                },
                docDestino: {
                    descripcion: 'Nota de Entrega',
                    codDoc: DOC_TYPE.NE,
                }
            })
        });

        $scope.askToOpenModalOption = async function () {
            try {

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger m-l-5'
                    },
                    buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                    title: 'Opción Aprobación Documento',
                    input: 'select',
                    inputOptions: {
                        0: 'NOTA DE ENTREGA A FACTURA',
                        1: 'PROFORMA A FACTURA',
                        2: 'PROFORMA A NOTA DE ENTREGA'
                    },
                    inputPlaceholder: 'Seleccionar...',
                    showCancelButton: true,
                    confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
                    cancelButtonText: '<small>&times; Cerrar</small>',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    focusConfirm: true,
                    inputValidator: (value) => {
                        return !value && 'Seleccione la opción de aprobación'
                    }
                }).then(result => {
                    if (result.isConfirmed) {

                        let modalRef = modalSvc.openModalCustom({
                            controller: 'ModalSelectDocCtrl',
                            template: URL_TEMPLATE + '_ModalSelectDocumento.cshtml',
                            size: 'xl',
                            windowClass: 'uibModalFullScreen',
                            params: OPTION_APROBACION[result.value],
                            isRenderRazorPartial: true
                        })

                        modalRef.result.then(result => {
                            if (typeof result === 'object') {
                                $scope.getAprobComprobantes();
                            }
                        })

                    }
                })

            } catch (error) {
                console.log(error);
            }
        }

        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getAprobComprobantes();
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
                $scope.dataSearch.byCliente = 0;
            }
        }

        $scope.selectedClienteSearchFiltro = function (item) {
            $scope.dataSearch.byCliente = item.idCliente;
            $scope.getAprobComprobantes();
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

        $scope.calculoColumnTotal = function () {
            let total = $scope.aprobComprobantes.reduce((prev, acc) => prev + acc.total, 0)
            $scope.total = fS.roundNumber(total, 2)
        }

        $scope.getAprobComprobantes = function () {
            try {
                showLoader();
                $scope.aprobComprobantes = [];

                let dataSearch = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: $scope.dataSearch.codEstab,
                    byCliente: $scope.dataSearch.byCliente,
                    checkBoxFecha: true,
                    byUsuario: $scope.dataSearch.byUsuario,
                    byEstado: $scope.dataSearch.byEstado,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    isSearchNroSequential: $scope.dataSearch.nroSecuencial ? true : false,
                    nroSecuencial: $scope.dataSearch.nroSecuencial,
                }


                $scope.aprobComprobantes = [];
                $scope.cloneAproComprobantes = [];
                $scope.calculoColumnTotal();

                aprobacionDocSvc.getAll(dataSearch).then(response => {
                    hideLoader();
                    $scope.aprobComprobantes = response;
                    $scope.cloneAproComprobantes = JSON.parse(JSON.stringify($scope.aprobComprobantes))
                    $scope.calculoColumnTotal();
                    hideLoader();

                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error)

            }
        }



        $scope.initiload = function () {
            try {
                showLoader();
                aprobacionDocSvc.getDataFilter().then(response => {
                    $scope.establecimientos = response.estabs;

                    $scope.dataSearch.codEstab = $scope.establecimientos.find(item => (item.defaultEstab)).codEstab;
                    $scope.getAprobComprobantes();
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
                aprobacionDocSvc.getDataForm().then(response => {
                    mainDataForm = response;
                })

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        };

        $scope.initiload();


        $scope.showBtnApprove = (item) => {
            return !['APR', 'A'].includes(item.codEstado)
        }

        $scope.showBtnEditar = (item) => {
            return !['APR', 'A'].includes(item.codEstado)
        }

        $scope.showBtnDelete = (item) => {
            return !['APR', 'A'].includes(item.codEstado)
        }

        /**
         * =========Detalle Documento Aprobacion 
         * @param {*} item 
         */

        $scope.openModalDetalle = function (item) {
            try {
                showLoader();
                aprobacionDocSvc.getIdForInfo(item.idAprob_Document).then(response => {
                    hideLoader();
                    modalSvc.openModalCustom({
                        controller: 'ModalAprobDocDetalleCtrl',
                        template: URL_TEMPLATE + '_ModalDetalle.cshtml',
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                        params: {
                            docOrigenDesc: item.docOrigenDesc,
                            docDestinoDesc: item.docDestinoDesc,
                            data: response
                        },
                        isRenderRazorPartial: true
                    })
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        /**
         * =========Editar Documento Aprobacion 
         * @param {*} item 
         */
        $scope.openModalEdit = function (item) {
            try {
                showLoader();
                aprobacionDocSvc.findById(item.idAprob_Document).then(response => {
                    console.log(response)
                    let modalRef = modalSvc.openModalCustom({
                        controller: 'ModalAprobDocEditarCtrl',
                        template: URL_TEMPLATE + '_ModalEditar.cshtml',
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                        params: {
                            docOrigenDesc: item.docOrigenDesc,
                            docDestinoDesc: item.docDestinoDesc,
                            data: response
                        },
                        isRenderRazorPartial: true
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.getAprobComprobantes();
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


        $scope.openModalAprobarDoc = async (item) => {

            try {
                showLoader();
                aprobacionDocSvc.findById(item.idAprob_Document).then(response => {
                    hideLoader();
                    let modalRef = modalSvc.openModalCustom({
                        controller: 'ModalApproveDocCtrl',
                        template: URL_TEMPLATE + '_ModalAprobacionDocumento.cshtml',
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                        params: {
                            docOrigenDesc: item.docOrigenDesc,
                            docDestinoDesc: item.docDestinoDesc,
                            data: response
                        },
                        isRenderRazorPartial: true
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.getAprobComprobantes();
                        }
                    })
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }

        }


        $scope.askToDelete = async (item) => {
            try {
                let { isConfirmed } = await Swal.fire({
                    title: 'Anular Aprobación?',
                    html: `<small>Esta seguro de Anular este Documento Nro. <b>${item.serieComprobante}</b>!</small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText: 'No, cancelar!'
                })

                if (isConfirmed) {
                    showLoader();
                    aprobacionDocSvc.delete(item.idAprob_Document).then(response => {
                        hideLoader();
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message);
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message);
                            $scope.getAprobComprobantes();
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error);
                    })
                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        /**
         * Reporte
         * @param {object} item 
         */
        $scope.getReport = function (item) {
            try {

                let codigo = null;
                if (item.docDestino === DOC_TYPE.FV_SRI) {
                    codigo = 'RAC'
                }
                if (item.docDestino === DOC_TYPE.NE) {
                    codigo = 'P-NE'
                }

                let format = 'pdf';
                let dataParms = {
                    id: item.idAprob_Document,
                    codEstab: item.codEstab,
                    codDoc: item.docDestino,
                }

                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo,
                        codEstab: item.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                }
                commonSvc.getReport({
                    parameters,
                    formatType: format
                })
            } catch (error) {
                console.log(error)
            }
        }

    }



    /**
     * 
     * _------------------Modal para seleccionar los documentos ----------------------
     * 
     */
    app.controller('ModalSelectDocCtrl', ModalSelectDocCtrl);

    ModalSelectDocCtrl.$inject = [
        '$scope',
        '$uibModalInstance',
        'uiGridConstants',
        'pricingUtils',
        'params'
    ];

    function ModalSelectDocCtrl($scope, $uibModalInstance, uiGridConstants, pricingUtils, params) {

        let { docOrigen, docDestino } = params;
        $scope.docOrigen = docOrigen;
        $scope.docDestino = docDestino;

        //-----------------Filters----------------------
        $scope.dataSearch = {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            pageIndex: 1,
            pageSize: 26,
            totalRecords: 0
        };

        $scope.selectedDocuments = [];


        $scope.gridOptionsSelectedDocs = {
            enableColumnMenus: false,
            enableFiltering: true,
            enableSorting: true,
            enableGridMenu: true,

            enableRowSelection: true,
            enableSelectAll: true,

            showColumnFooter: true,
            showGridFooter: true,
            expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" ui-grid-resize-columns ></div>',
            expandableRowScope: {
                subGridVariable: 'subGridScopeVariable'
            },
            expandableRowHeight: 150,
            isRowSelectable: function (row) {
                return ["AC", "PE"].includes(row.entity.codEstado);
            }
        }


        $scope.gridOptionsSelectedDocs.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            gridApi.selection.on.rowSelectionChanged($scope, () => {
                //------
            })
            gridApi.selection.on.rowSelectionChangedBatch($scope, function () { })
        }

        //------------------Documento Destino----------------------------------------      
        $scope.establecimientos = [];
        $scope.impuestosTarifas = []
        $scope.ptosEmision = [];

        $scope.data = {
            codEstab: 0,
            idTiempoCredito: 0,
            fechaEmision: new Date(),
            fechaVencimiento: new Date(),
            subTotalSinImpuestos: 0,
            iva: 0,
            subTotalIva: 0,
            subTotalIvaCero: 0,
            subTotalExentoIva: 0,
            subTotalNoObjetoIva: 0,
            subTotalNetoIva: 0,
            subTotalNetoExentoIva: 0,
            subTotalNetoNoObjetoIva: 0,
            totalIce: 0,
            irbpnr: 0,
            propina: 0,
            transporte: 0,
            recargo: 0,
            porcentajeDescuento: 0,
            totalDescuento: 0,
            total: 0
        };

        $scope.cliente = {
            idCliente: 0,
            nombreComercial: null,
            nombreFiscal: null,
            numeroIndentificacion: null,
        };


        $scope.dataClone = {};
        $scope.dataClone.fechaEmision = new Date();
        $scope.dataClone.porcentajeDescuento = 0;
        $scope.dataClone.totalDescuento = 0;

        //Detalle de los documentos seleccionados
        $scope.gridOptionsDetalle = {
            enableColumnMenus: false,
            enableSorting: true,
            suppressMultiSort: true,
        }

        $scope.infoAdicionalDocumento = [];
        $scope.historialVentas = [];

        // Step Uno -> Documento Origen 
        $scope.stepUno = function () {
            $scope.footerActionStepUno = true;
            $scope.footerActionStepDos = false;

            $("#step a:first-child").addClass('active');
            $("#step a:last-child").removeClass('active');

            $uibModalInstance.rendered.then(() => {
                const stepDocOrigen = document.getElementById("stepDocOrigen");
                const stepDocDestino = document.getElementById("stepDocDestino");
                stepDocOrigen.style.display = "block";
                stepDocDestino.style.display = "none";

                $("#clienteSearch").focus();

            })
        }


        //Step Dos -> Documento Destino 
        $scope.stepDos = function () {
            try {
                if (!$scope.cliente.idCliente > 0) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }

                $scope.selectedDocuments = $scope.gridApi.selection.getSelectedRows() || []
                if ($scope.selectedDocuments.length === 0) {
                    tS.toastr('warning', 'Seleccione al menos un Documento', 'Siguiente', 'toast-bottom-center');
                    return
                }

                $scope.columnDefsInvoice();

                // showLoader();
                //UNIMOS TODOS LOS DETALLES DEL COMPROBANTE

                let resultJoinItems = $scope.selectedDocuments.flatMap(item => item.subGridOptions.data);

                //  let arrGroup = [];

                //Si la Opcion es Agrupar Articulos del Detalle 
                // console.log([...resultJoinDetails])
                // resultJoinDetails = resultJoinDetails.reduce((arrGroup, current) => {
                //     let thatItem = arrGroup.find(item => item.idArticulo === current.idArticulo && item.llevaInventario);
                //     console.log(thatItem)
                //     if (!thatItem) {
                //         arrGroup = [...arrGroup, {
                //             ...current
                //         }]
                //     } else {
                //         let totalPrecioIVA = (thatItem.cantidad * thatItem.precioConIva);
                //         console.log(totalPrecioIVA)
                //         if (isNaN(thatItem.totalConImpuestos)){
                //             thatItem.totalConImpuestos = 0;
                //         }

                //         thatItem.cantidad += current.cantidad;
                //         thatItem.totalConImpuestos += (totalPrecioIVA += current.precioConIva)

                //         // let precioVenta = thatItem.precioVenta += current.precioVenta;
                //         // let precioConIva = thatItem.precioConIva += current.precioConIva;
                //         // let porcentajeDescuento = thatItem.porcentajeDescuento += current.porcentajeDescuento;
                //         // let valorDescuento = thatItem.valorDescuento += current.valorDescuento;
                //         // let totalDescuento = thatItem.totalDescuento += current.totalDescuento;
                //         // let subTotal = thatItem.subTotal += current.subTotal;
                //         // let total = thatItem.total += current.total;

                //         // thatItem.precioVenta = this._fS.roundNumber(precioVenta, this.decimal.nroPrecio);
                //         // thatItem.precioConIva = this._fS.roundNumber(precioConIva, this.decimal.nroPrecio);
                //         // thatItem.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroPorcentaje);
                //         // thatItem.valorDescuento = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuento);
                //         // thatItem.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle);
                //         // thatItem.subTotal = this._fS.roundNumber(subTotal, 5);
                //         // thatItem.total = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);
                //     }
                //     return arrGroup
                // }, [])
                // console.log(resultJoinDetails)
                // return 

               // const resultMergeItems = mergeItems(resultJoinItems); 

                //Agregamos Bodega e Indice
                let index = 1;
                $scope.gridOptionsDetalle.data = resultJoinItems.map(item => {
                    // item.idBodega = $scope.idBodega;
                    item.n = index++;
                    return item;
                })

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                    items: $scope.gridOptionsDetalle.data,
                    decimal: $scope.decimal,
                    dataTarifaImpuesto: $scope.dataTarifaImpuesto,
                    TAX_RATE_CODE
                }))

                if ($scope.cliente.tipoIdentificacion === 'CF' && $scope.docDestino.codDoc === '01' && $scope.data.total > 50) {
                    hideLoader();
                    Swal.fire({
                        icon: 'warning',
                        html: `<small>El importe total de los documentos seleccionados supera los 50 USD por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b></small>`,
                        confirmButtonText: 'Aceptar'
                    })
                    return
                }
                if($scope.data.total < 0){
                    tS.toastr('warning', 'No se puede generar el documento con valor total 0!');
                    return
                }

                $scope.footerActionStepUno = false;
                $scope.footerActionStepDos = true;

                $("#step a:first-child").removeClass('active');
                $("#step a:last-child").addClass('active');

                const stepDocOrigen = document.getElementById("stepDocOrigen");
                const stepDocDestino = document.getElementById("stepDocDestino");

                stepDocOrigen.style.display = "none";
                stepDocDestino.style.display = "block";
                hideLoader();
            } catch (error) {
                hideLoader();
                console.trace(error);
            }
        }

        // function mergeItems(array) {
        //     return array.reduce((acc, current) => {
        //         const totalConImpuestos = current.cantidad * current.precioConIva;
        //         //  console.log(acc)
        //         console.log('--------------------------------------------')
        //         const foundItem = acc.find(it => it.idArticulo === current.idArticulo);

        //         if (foundItem && current.llevaInventario) {
        //             let totalCantidadSum = foundItem.cantidad += current.cantidad;
        //             let totalConImpuestosSum = foundItem.totalConImpuestos += totalConImpuestos;
        //             let totalDescuentoSum = foundItem.valorDescuento += current.valorDescuento;

        //             let totalPrecioUnitario = pricingUtils.calcularPrecioVenta(totalConImpuestosSum, current.tarifa);
        //             let totalConImpuestosRounded = fS.roundNumber(totalConImpuestosSum, $scope.decimal.nroTotalDetalle);
        //             let precioConIva = totalConImpuestosSum / totalCantidadSum;
        //             let precioUnitario = totalPrecioUnitario / totalCantidadSum;
        //             let porcentajeDescuento = pricingUtils.getPorcentajeDescuento(precioUnitario, totalDescuentoSum);
        //             let total = ((precioUnitario * totalCantidadSum)) - totalDescuentoSum;

        //             foundItem.cantidad = totalCantidadSum;
        //             foundItem.totalConImpuestos = totalConImpuestosRounded;
        //             foundItem.precioUnitario = fS.roundNumber(precioUnitario, $scope.decimal.nroPrecio)
        //             foundItem.precioConIva = fS.roundNumber(precioConIva, $scope.decimal.nroPrecio);
        //             foundItem.total = fS.roundNumber(total, $scope.decimal.nroTotalDetalle);
        //             foundItem.porcentajeDescuento = fS.roundNumber(porcentajeDescuento, $scope.decimal.nroPorcentaje);
        //             foundItem.valorDescuento = fS.roundNumber(totalDescuentoSum, $scope.decimal.nroDescuento);

        //         } else {
        //             acc.push({
        //                 ...current,
        //                 idArticulo: current.idArticulo,
        //                 cantidad: current.cantidad,
        //                 descripcion: current.descripcion,
        //                 llevaInventario: current.llevaInventario,
        //                 totalConImpuestos: fS.roundNumber(totalConImpuestos, 3),
        //                 precioUnitario: fS.roundNumber(current.precioUnitario, $scope.decimal.nroPrecio)
        //             });
        //         }
        //         return acc;
        //     }, []);
        // }


        //Inicio 
        $scope.initiload = function () {
            try {
                let {
                    estabs,
                    tarifaImpuestoVigente,
                    tarifasImpuesto,
                    // tiemposCredito,
                    // tarifas,
                    permisoVenta,
                    decimal,
                } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa 
                 */
                $scope.establecimientos = estabs;

                let dataEstab = $scope.establecimientos.find(item => (item.defaultEstab))

                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataSearch.codEstab = $scope.data.codEstab; //Filtro
                $scope.dataClone.codEstab = $scope.data.codEstab;

                $scope.dataTarifaImpuesto = tarifaImpuestoVigente;

                //===========Puntos Emisiones============================================== 
                $scope.ptosEmision = dataEstab.puntosEmision;
                let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;
                $scope.dataSearch.idPuntoEmision = $scope.data.idPuntoEmision;

                //============Bodegas======================================================= 
                $scope.bodegas = dataEstab.bodegas;
                let dataBodega = $scope.bodegas.find(item => (item.defaultBodega))
                $scope.idBodega = dataBodega.idBodega;
                $scope.dataClone.idBodega = $scope.idBodega;

                //Decimal 
                $scope.decimal = decimal;

                $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                $scope.permisoDetalleVenta = permisoVenta.detalle;
                $scope.tipoIvas = tarifasImpuesto;
                $scope.stepUno()
            } catch (error) {
                console.log(error);
            }
        }

        $scope.initiload();


        //============================================ Filtros==============================
        $scope.isValidFilter = function () {
            if (!$scope.dataSearch.codEstab) {
                tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }
            if (!($scope.cliente.idCliente > 0)) {
                tS.toastr('warning', 'Seleccione el cliente');
                return
            }
            if (!$scope.dataSearch.fechaInicio || !$scope.dataSearch.fechaFin) {
                tS.toastr('warning', 'Seleccione rango de fecha')
                return
            }
            return true;
        }

        $scope.askToChangeEstabFilter = async function () {
            try {
                let { isConfirmed } = await Swal.fire({
                    title: 'Cambiar Establecimiento?',
                    text: "Se revertiran los documentos seleccionados en caso de existir!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                })

                if (isConfirmed) {
                    $scope.gridOptionsDetalle.data = [];
                    $scope.gridOptionsSelectedDocs.data = [];

                    let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.dataSearch.codEstab);

                    $scope.ptosEmision = dataEstab.puntosEmision;

                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                    $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                    $scope.dataClone.codEstab = $scope.dataSearch.codEstab;
                    if ($scope.isValidFilter()) {
                        $scope.getDocumentos();
                    }
                } else {
                    $scope.dataSearch.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                }

            } catch (error) {
                console.log(error);
            }
        }

        $scope.resultDateRange = function (item) {
            $scope.dataSearch.checkBoxFecha = true;
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate

            if ($scope.isValidFilter()) {
                $scope.getDocumentos();
            }
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

        $scope.selectedClienteSearch = function (item) {
            $scope.cliente = item;
            if ($scope.isValidFilter()) {
                $scope.getDocumentos();
            }
        }

        $scope.refresh = function () {

            let selectedDocuments = $scope.gridApi && $scope.gridApi.selection.getSelectedRows() || []
            if (selectedDocuments.length > 0) {
                tS.toastr('warning', 'Tienes documentos seleccionados')
                return
            }
            if ($scope.isValidFilter()) {
                $scope.getDocumentos();
            }
        }

        $scope.pageChanged = function () {
            $scope.getDocumentos();
        }


        $scope.getDocumentos = function () {
            try {
                $scope.documentos = [];
                $scope.dataSearch.byCliente = $scope.cliente.idCliente;

                if ($scope.docOrigen.codDoc === DOC_TYPE.NE) {
                    $scope.getNotaEntregas();
                }

                if ($scope.docOrigen.codDoc === DOC_TYPE.PR) {
                    $scope.getProformas();
                }

            } catch (error) {
                console.log(error)
            }
        }

        $scope.getNotaEntregas = function () {
            try {
                $scope.documentos = [];

                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    byCliente: $scope.dataSearch.byCliente,
                    checkBoxFecha: true,
                    codEstado: "PE",
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                }

                showLoader();
                notaEntregaSvc.getAll(dataSearch).then(async (response) => {
                    let { notaEntregas, dataTotals } = response;
                    $scope.gridOptionsSelectedDocs.columnDefs = [{
                        name: 'Nro. Doc',
                        field: 'serieComprobante'
                    },
                    {
                        name: 'F. Emisión',
                        field: 'fechaEmision'
                    },
                    {
                        name: 'F. Vcto',
                        field: 'fechaVencimiento'
                    },
                    {
                        name: 'Cliente',
                        field: 'nombreFiscal',
                        cellTemplate: `<div class="grid-tooltip"  tooltip-placement="left" uib-tooltip="{{row.entity.nombreFiscal }}">
                            <div class="ui-grid-cell-contents">
                            {{ COL_FIELD }}
                            </div>
                        </div>`
                    },
                    {
                        name: 'Total',
                        field: 'total',
                        cellTemplate: ` <div class="grid-tooltip"><div class="ui-grid-cell-contents">$ {{ COL_FIELD }}</div></div>`,
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationLabel: "Total: ",
                        aggregationHideLabel: true,
                        footerCellFilter: 'number:2',
                    },
                    {
                        name: 'Estado',
                        field: 'estadoFinanciero'
                    },
                    {
                        name: 'Usuario',
                        field: 'usuario'
                    },
                    ];

                    $scope.documentos = notaEntregas;
                    await $scope.setDataGridOptionsChildren();

                    $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                }).catch(error => {
                    console.log(error);
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }


        $scope.getProformas = function () {
            try {
                console.log($scope.dataSearch)
                showLoader();
                $scope.documentos = [];
                let dataSearch = {
                    tipo: 1,
                    checkBoxFecha: true,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision ? 0 : $scope.dataSearch.idPuntoEmision,
                    byCliente: $scope.dataSearch.byCliente,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                }

                proformaSvc.getAll(dataSearch).then(async ({ proformas }) => {
                    $scope.gridOptionsSelectedDocs.columnDefs = [{
                        name: 'Nro. Doc',
                        field: 'serieComprobante'
                    },
                    {
                        name: 'F. Emisión',
                        field: 'fechaEmision'
                    },
                    {
                        name: 'F. Vcto',
                        field: 'fechaVencimiento',
                        visible: false
                    },
                    {
                        name: 'Cliente',
                        field: 'nombreFiscal',
                        cellTemplate: `<div class="grid-tooltip"  tooltip-placement="left" uib-tooltip="{{row.entity.nombreFiscal }}">
                        <div class="ui-grid-cell-contents">
                          {{ COL_FIELD }}
                        </div>
                      </div>`
                    },
                    {
                        name: 'Total',
                        field: 'total',
                        cellTemplate: ` <div class="grid-tooltip"><div class="ui-grid-cell-contents">$ {{ COL_FIELD }}</div></div>`,
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationLabel: "Total: ",
                        aggregationHideLabel: true,
                        footerCellFilter: 'number:2',
                    },
                    {
                        name: 'Estado',
                        field: 'estadoDoc',
                        visible: true
                    },
                    {
                        name: 'Usuario',
                        field: 'usuario'
                    },
                    ];

                    $scope.documentos = proformas;
                    await $scope.setDataGridOptionsChildren();
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }


        $scope.setDataGridOptionsChildren = async function () {
            let tempHistorialInfoAdicional = []; //Datos Adicionales de NotaEntrega
            let tempInfoAdicionalDocumento = []; //

            for (let item of $scope.documentos) {

                item.subGridOptions = $scope.columnDefsSubGridOptions();
                if ($scope.docOrigen.codDoc === DOC_TYPE.NE) {
                    await notaEntregaSvc.getId(item.idDocumento).then(response => {
                        let { items, datosAdicionalesArticulo, infoAdicionalDocumento } = response;
                        item.subGridOptions.data = items;
                        tempHistorialInfoAdicional.push(datosAdicionalesArticulo);
                        tempInfoAdicionalDocumento.push(infoAdicionalDocumento)
                    })
                }

                if ($scope.docOrigen.codDoc === DOC_TYPE.PR) {
                    await proformaSvc.getId(item.idDocumento).then(response => {
                        let { items } = response;
                        item.subGridOptions.data = items;
                        // tempHistorialInfoAdicional.push(datosAdicionalesArticulo);
                        // tempInfoAdicionalDocumento.push(infoAdicionalDocumento);
                    })
                }

                //Obtenemos detalle de Nota de Entrega || Porforma
                // let { detalleDocumento, datosAdicionalesArticulo, infoAdicionalDocumento } = await commonSvc.getDataTipoDocVenta({
                //     id: item.idDocumento,
                //     codigoDocumento: $scope.docOrigen.codDoc
                // })
                // item.subGridOptions.data = detalleDocumento;

                // //Historial Ventas de Nota Entrega 
                // tempHistorialInfoAdicional.push(datosAdicionalesArticulo);
                // tempInfoAdicionalDocumento.push(infoAdicionalDocumento)
            }

            $scope.gridOptionsSelectedDocs.data = $scope.documentos;
            $scope.historialVentas = tempHistorialInfoAdicional.flat();
            $scope.infoAdicionalDocumento = tempInfoAdicionalDocumento.flat();

            hideLoader();
            if ($scope.documentos.length === 0) {
                tS.toastr('info', 'No se encontraron los Documentos');
            }

        }

        $scope.columnDefsSubGridOptions = function () {
            return {
                enableColumnMenus: false,
                showColumnFooter: true,
                columnDefs: [{
                    name: 'Cód.',
                    field: 'codigo',
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'Descripción',
                    field: 'descripcion',
                    cellTooltip: (row) => row.entity.descripcion,
                    width: '25%',
                    minWidth: '100'
                },
                {
                    name: 'Cant.',
                    field: 'cantidad',
                    width: '6%',
                    minWidth: '50',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${$scope.decimal.nroCantidad}`,
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
                    name: 'IVA',
                    field: 'tipoIva',
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'Tarifa',
                    field: 'idTarifa',
                    width: '12%',
                    minWidth: '100',
                    cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsFunction: function (rowEntity) {
                        return rowEntity.articuloTarifas.map(val => ({
                            id: val.idTarifa,
                            value: val.tarifa + ' - $' + val.precioConIva
                        }))
                    }
                },
                {
                    name: 'Precio U.',
                    field: 'precioUnitario',
                    width: '8%',
                    minWidth: '100',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${$scope.decimal.nroPrecio}`,
                },
                {
                    name: 'P. Iva',
                    field: 'precioConIva',
                    width: '7%',
                    minWidth: '100',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${$scope.decimal.nroPrecio}`,
                },
                // {
                //     name: '%',
                //     field: 'porcentajeDescuento',
                //     width: '6%',
                //     minWidth: '100',
                // },
                // {
                //     name: 'dsto.',
                //     field: 'valorDescuento',
                //     width: '6%',
                //     minWidth: '100',
                //     aggregationType: uiGridConstants.aggregationTypes.sum,
                //     customTreeAggregationFinalizerFn: function (aggregation) {
                //         aggregation.rendered = aggregation.value;
                //     },
                //     aggregationHideLabel: true,
                //     footerCellFilter: `number:${$scope.decimal.nroDescuento}`,
                // },
                // {
                //     name: 'T. Dsto.',
                //     field: 'totalDescuento',
                //     width: '7%',
                //     minWidth: '100',
                //     aggregationType: uiGridConstants.aggregationTypes.sum,
                //     customTreeAggregationFinalizerFn: function (aggregation) {
                //         aggregation.rendered = aggregation.value;
                //     },
                //     aggregationHideLabel: true,
                //     footerCellFilter: `number:${$scope.decimal.nroDescuentoDetalle}`
                // },
                {
                    name: 'Total',
                    field: 'total',
                    width: '5%',
                    minWidth: '100',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${$scope.decimal.nroTotalDetalle}`
                },
                ]
            }
        }


        $scope.columnDefsInvoice = function () {
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

            $scope.gridOptionsDetalle.columnDefs = [{
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
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEditOnFocus: false,
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
                enableCellEdit: false,
                enableCellEditOnFocus: false,
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
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                //    visible: config.porcentajeIva
            },
            {
                name: 'tarifas',
                field: 'articuloTarifas',
                visible: false
            },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                width: '12%',
                minWidth: '100',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
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
                type: 'number',
                width: '8%',
                minWidth: '100',
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
                // cellFilter: "currency:'$'",
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
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
                enableCellEdit: true,
                enableCellEditOnFocus: true,
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
                name: 'sub Total',
                field: 'subTotal',
                enableCellEdit: false,
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: false,
                // cellFilter: "currency:'$'",
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

            $scope.setWarehouseAndIVA();
        }



        /**
         * ==========================DOCUMENTO DESTINO===================================== 
         * 
         */
        /**
         * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
         */
        $scope.setWarehouseAndIVA = function () {
            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');

            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
            $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
        }

        $scope.onChangeEstab = async function () {
            try {
                let { isConfirmed } = await Swal.fire({
                    title: 'Cambiar Establecimiento?',
                    text: "Se cambiará puntos de Emisión y la bodega en el detalle!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                })

                if (isConfirmed) {

                    let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);

                    if (dataEstab.puntosEmision.length === 0) {
                        tS.toastr('info', 'No tienes Puntos de Emisión asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }
                    if (dataEstab.bodegas.length === 0) {
                        tS.toastr('info', 'No tienes bodegas asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }

                    //Impuesto Tarifa
                    $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                    $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];

                    //Puntos de Emision 
                    $scope.ptosEmision = dataEstab.puntosEmision;

                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                    $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                    //Bodegas 
                    $scope.bodegas = dataEstab.bodegas;

                    let dataBodega = $scope.bodegas.find(item => (item.defaultBodega));
                    $scope.idBodega = dataBodega.idBodega;

                    $scope.dataClone.codEstab = $scope.data.codEstab;

                    $scope.setWarehouseAndIVA();
                    for (let dd of $scope.gridOptionsDetalle.data) {
                        dd.idBodega = $scope.idBodega;
                    }
                    $scope.$apply();
                } else {
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                }

            } catch (error) {
                console.log(error);
            }
        }


        $scope.askToSaveDoc = async function () {
            try {
                if (!$scope.data.codEstab) {
                    tS.taostr('warning', 'Seleccione el establecimiento')
                    return
                }
                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.taostr('warning', 'Seleccione el establecimiento')
                    return
                }


                let fechaEmisionModificada = $scope.data.fechaEmision;

                let fechaActual = new Date();
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


                let { isConfirmed } = await Swal.fire({
                    //title: 'Are you sure?',
                    text: "Está seguro de guardar el Documento de Aprobación Documento!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar!'
                })

                if (isConfirmed) {
                    let comprobante = {
                        ...$scope.data,
                        codigoPorcentaje: $scope.dataTarifaImpuesto.codigoPorcentaje,
                        codDoc: $scope.docDestino.codDoc,
                        idCliente: $scope.cliente.idCliente,
                        fechaEmision: fS.formatDateTimeZone($scope.data.fechaEmision),
                        docOrigen: $scope.docOrigen.codDoc,
                        docDestino: $scope.docDestino.codDoc,
                        total: $scope.selectedDocuments.reduce((prev, acc) => prev + acc.total, 0)
                    }

                    //Tarifa Aplicada al Documento
                    //jsonHeader.tarifa = this.actividadTipoIva.tarifa;
                    let detalles = aprobacionDocSvc.detalleMapperTo($scope.gridOptionsDetalle.data, $scope.decimal)


                    let infoAdicional = $scope.infoAdicionalDocumento.filter(item => {
                        if (item) {
                            return $scope.selectedDocuments.some(docs => docs.idComprobante === item.idDocumento)
                        } else {
                            return false;
                        }
                    })

                    let historialVenta = $scope.historialVentas.filter(item => {
                        if (item) {
                            return $scope.selectedDocuments.some(docs => docs.idNotaEntrega === item.idDocumento)
                        } else {
                            return false;
                        }
                    })

                    const data = {
                        comprobante: JSON.stringify(comprobante),
                        detalle: JSON.stringify(detalles),
                        historial: JSON.stringify($scope.selectedDocuments.map(item => ({
                            idDocumento: item.idDocumento,
                            serie: item.serieComprobante,
                        }))),
                        infoAdicional: JSON.stringify(infoAdicional),
                        historialVenta: JSON.stringify(historialVenta),
                    }

                    showLoader();
                    aprobacionDocSvc.save(data).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message);
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message, '', 1000);
                            $uibModalInstance.close(response);
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                }

            } catch (error) {
                console.log(error);
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }
    }



    /**
     * ===========================MODAL-DETALLE-APROBACION DOCUMENTO==============
     */
    app.controller('ModalAprobDocDetalleCtrl', ModalAprobDocDetalleCtrl);

    ModalAprobDocDetalleCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'params']

    function ModalAprobDocDetalleCtrl($scope, $uibModalInstance, $timeout, params) {
        let { docOrigenDesc, docDestinoDesc, data } = params
        const {
            comprobante,
            cliente,
            items,
            historial
        } = data;

        let tarifaImpuesto = {
            [TAX_RATE_CODE.TWELVE_PERCENT]: "IVA 12%",
            [TAX_RATE_CODE.DIFFERENTIATED_TAX]: "IVA 8%",

        }

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc

        $scope.data = comprobante;
        console.log($scope.data)
        $scope.data.tarifaImpuestoVigente = tarifaImpuesto[$scope.data.codigoPorcentaje]
        $scope.cliente = cliente;
        $scope.dataDisabled = {
            isDisabledSucursal: true,
            isDisabledPuntoEmision: true
        }

        //GridOptions Invoice 
        $scope.gridOptionsDetalle = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }

        $scope.gridOptionsDetalle.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }

            gridApi.edit.on.afterCellEdit($scope, () => { })
        }

        initiload();

        async function initiload() {
            try {
                let {
                    // estabs,
                    tarifaImpuestoVigente,
                    // tarifasImpuesto,
                    // tiemposCredito,
                    // tarifas,
                    // permisoVenta,
                    decimal,
                } = mainDataForm;
                $scope.dataTarifaImpuesto = tarifaImpuestoVigente;
                $scope.decimal = decimal;
                setColumnDefs();
                $scope.gridOptionsDetalle.data = items.map((item, index) => ({
                    ...item,
                    index: index + 1
                }))

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                    items: $scope.gridOptionsDetalle.data,
                    decimal: $scope.decimal,
                    dataTarifaImpuesto: $scope.dataTarifaImpuesto,
                    TAX_RATE_CODE
                }))
                hideLoader();
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        function setColumnDefs() {
            $scope.gridOptionsDetalle.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '50',
                cellTemplate: `
                    <button type="button" disabled class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                        <i class="fa fa-trash"></i>
                    </button> `
            },
            {
                name: 'N°',
                field: 'index',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '5%',
                minWidth: '50'
            },
            {
                name: 'Cód.',
                field: 'codigo',
                width: '8%',
                minWidth: '100',
                enableCellEdit: false,
            },
            {
                name: 'Descripción',
                field: 'descripcion',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                cellTooltip: (row) => row.entity.descripcion,
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                width: '6%',
                minWidth: '50',
            },
            {
                name: 'Medida',
                field: 'medida',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'I.V.A',
                field: 'tipoIva',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                width: '8%',
                minWidth: '100',
                //    visible: config.porcentajeIva
            },
            {
                name: 'Tarifa',
                field: 'tarifa',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                width: '12%',
                minWidth: '100',
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: false,
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: false
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: false
            },
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '5%',
                minWidth: '100'
            },
            // {
            //     name: 'Nota',
            //     field: 'nota',
            //     enableCellEdit: true,
            //     allowCellFocus: true,
            //     enableCellEditOnFocus: true,
            //     type: 'string',
            //     width: '15%',
            //     minWidth:'100'
            // },
            {
                name: 'bodega',
                field: 'bodega',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                width: '11%',
                minWidth: '100'
            },
            ]
        }

        $scope.showHistorialDocumento = function () {
            try {
                let message = '';

                message = `<table class="table table-bordered table-sm">
                                <thead>
                                    <tr class="small">
                                        <th>Tipo Doc. Origen</th>
                                        <th>Serie Comprobante</th>
                                    </tr>
                                </thead>
                                <tbody>`
                for (const item of historial) {
                    message += `<tr class="small"><td>${item.tipoDoc}</td><td>${item.serieComprobante}</td></tr>`

                }
                message += `</tbody></table>`

                Swal.fire({
                    title: '<small>Documentos Relacionados</small>',
                    html: message,
                    icon: 'info',
                    //width: '700px',
                    showCancelButton: false,
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close()
        }
    }



    /**
     * =========================MODAL-EDITAR-APROBACION DOCUMENTO 
     */

    app.controller('ModalAprobDocEditarCtrl', ModalAprobDocEditarCtrl);

    ModalAprobDocEditarCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'params']

    function ModalAprobDocEditarCtrl($scope, $uibModalInstance, $timeout, params) {

        let { docOrigenDesc, docDestinoDesc, data } = params
        let { comprobante, cliente, detalles, datosAdicionalesArticulo } = data;

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc;

        //params to MdAutocomplete to search article
        $scope.tipoDoc = {
            codigo: 'NE'
        }

        $scope.data = comprobante;

        let formattedDateTime = moment($scope.data.fechaEmision).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss");
        $scope.data.fechaEmision = new Date(formattedDateTime)
        $scope.cliente = cliente;

        $scope.dataClone = {};

        $scope.dataDisabled = {
            isDisabledSucursal: true,
            isDisabledPuntoEmision: true
        }

        $scope.datosAdicionalesArticulo = datosAdicionalesArticulo || [];
        $scope.historyDatosAdicionales = datosAdicionalesArticulo.map(item => ({
            idArticulo: item.idArticulo,
            idInfoAdicional: item.idInfoAdicional,
            selected: true,
        }))


        //GridOptions Invoice 
        $scope.gridOptionsDetalle = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }
        $scope.gridOptionsDetalle.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }

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



        $scope.initiload = async function () {
            try {
                showLoader();
                let {
                    estabs,
                    tarifaImpuestoVigente,
                    tarifasImpuesto,
                    // tiemposCredito,
                    tarifas,
                    permisoVenta,
                    decimal,
                } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa 
                */
                $scope.establecimientos = estabs;
                let puntosEmisionMerge = $scope.establecimientos.flatMap((dt) => dt.puntosEmision);
                let codEstab = puntosEmisionMerge.find((dt) => dt.idPuntoEmision === $scope.data.idPuntoEmision).codEstab;

                let dataEstab = $scope.establecimientos.find(item => (item.codEstab === codEstab))

                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataTarifaImpuesto = tarifaImpuestoVigente;

                //===========Puntos Emisiones==============================================
                $scope.ptosEmision = dataEstab.puntosEmision;
                //============Bodegas======================================================= 
                $scope.bodegas = dataEstab.bodegas;
                let dataBodega = $scope.bodegas.find(item => (item.defaultBodega))
                $scope.data.idBodega = dataBodega.idBodega;

                //Decimal 
                $scope.decimal = decimal;

                //Tipo Ivas 
                $scope.tipoIvas = tarifasImpuesto;

                //Tarifas(PVP1, PVP2)
                $scope.tarifas = tarifas;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;

                //Permisos para detalle y documento  
                $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                $scope.permisoDetalleVenta = permisoVenta.detalle;


                setColumnDefs();
                $scope.gridOptionsDetalle.data = detalles;

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                    items: $scope.gridOptionsDetalle.data,
                    decimal: $scope.decimal,
                    dataTarifaImpuesto: $scope.dataTarifaImpuesto,
                    TAX_RATE_CODE
                }))
                hideLoader();
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.initiload();

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

            $scope.gridOptionsDetalle.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '100',
                cellTemplate: `
                    <button type="button" ng-click="grid.appScope.askToDeleteRow(row.entity)" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                        <i class="fa fa-trash"></i>
                    </button>

                    <button type="button"  update-article class= "btn btn-success btn-xs text-white" ng-click="grid.appScope.openModalArticulo(row.entity)" title = "Editar Articulo" >
                        <i class="fa fa-edit"></i>
                    </button > 

                    <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.historyDatosAdicionales" result-modal-adicional="grid.appScope.resultModalAdicional(result)" datos-adicionales="grid.appScope.datosAdicionalesArticulo" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`
            },
            {
                name: 'Cód.',
                field: 'codigo',
                width: '8%',
                minWidth: '100',
                enableCellEdit: false,
            },
            {
                name: 'Descripción',
                field: 'descripcion',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: (scope) => scope.row.entity.llevaInventario !== true,
                cellTooltip: (row) => row.entity.descripcion,
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '6%',
                minWidth: '50',
            },
            {
                name: 'Medida',
                field: 'idMedida',
                enableCellEdit: ventaDetailPermission.medida,
                enableCellEditOnFocus: ventaDetailPermission.medida,
                allowCellFocus: ventaDetailPermission.medida,
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity) => rowEntity.medidas.map(val => ({
                    id: val.idMedida,
                    value: val.descripcion
                })),
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: ventaDetailPermission.tipoIva,
                allowCellFocus: ventaDetailPermission.tipoIva,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva,
                type: 'number',
                width: '8%',
                minWidth: '100',
                //    visible: config.porcentajeIva
            },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
                enableCellEdit: ventaDetailPermission.tarifa,
                enableCellEditOnFocus: ventaDetailPermission.tarifa,
                allowCellFocus: ventaDetailPermission.tarifa,
                type: 'number',
                width: '12%',
                minWidth: '100',
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '8%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario : true;
                },
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '7%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva : true;
                },
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: ventaDetailPermission.porcentajeDescuento,
                allowCellFocus: ventaDetailPermission.porcentajeDescuento,
                enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: ventaDetailPermission.porcentajeDescuento,
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento,
                enableCellEditOnFocus: ventaDetailPermission.descuento,
                allowCellFocus: ventaDetailPermission.descuento,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: ventaDetailPermission.descuento
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: ventaDetailPermission.descuento
            },
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '5%',
                minWidth: '100'
            },
            // {
            //     name: 'Nota',
            //     field: 'nota',
            //     enableCellEdit: true,
            //     allowCellFocus: true,
            //     enableCellEditOnFocus: true,
            //     type: 'string',
            //     width: '15%',
            //     minWidth:'100'
            // },
            {
                name: 'bodega',
                field: 'idBodega',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                type: 'number',
                width: '11%',
                minWidth: '100'
            },
            ]

            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
            $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
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

                if ($scope.gridOptionsDetalle.data.length === 0) return

                if (gridOptionsSvc.setTarifaInDetail(
                    $scope.gridOptionsDetalle,
                    $scope.data.idTarifa,
                    $scope.decimal,
                    gridOptionsSvc.calculoColDef
                )
                ) {
                    $scope.recalculateTotalsSimple();
                }
                $scope.$apply();

            } else {
                $scope.data.idTarifa = $scope.dataClone.idTarifa;
                $scope.$apply();
            }
        }


        //Indice del detalle documento 
        $scope.indexRowDetalle = null;

        //Recibe datos de buscador articulo cuando seleccionan articulo
        $scope.setItemArticuloEnDetalle = function (dataArticulo) {

            try {

                const { articulo, medidas, datosAdicionalesArticulo } = dataArticulo;


                let index = 0, entity = {};

                let findIndexById = $scope.gridOptionsDetalle.data.findIndex(item => item.llevaInventario && item.idArticulo === articulo.idArticulo);

                if (findIndexById === -1) {
                    $scope.gridOptionsDetalle.data.push(aprobacionDocSvc.addRow());
                    $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.findIndex(value => value.idArticulo === 0);
                    index = $scope.gridOptionsDetalle.data.findIndex(value => value.idArticulo === 0);
                    entity = $scope.gridOptionsDetalle.data[index];
                } else {
                    index = findIndexById;
                    entity = $scope.gridOptionsDetalle.data[index];
                    entity.cantidad = entity.cantidad + 1;
                }


                let dataMedida = medidas.find(medida => (medida.defaultMedida));

                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;


                //Aplica a establecimiento que llevan actividad de Tipo Alojamiento
                if (
                    $scope.dataTarifaImpuesto.codigoPorcentaje === TAX_RATE_CODE.DIFFERENTIATED_TAX &&
                    articulo.codigoPorcentaje === TAX_RATE_CODE.TWELVE_PERCENT
                ) {

                    let dataImpuestoTarifa = $scope.tipoIvas.find(item => item.codigoPorcentaje === $scope.dataTarifaImpuesto.codigoPorcentaje);
                    entity.idTipoIva = dataImpuestoTarifa.idTipoIva;
                    entity.codigoPorcentaje = dataImpuestoTarifa.codigoPorcentaje;
                    entity.tarifa = dataImpuestoTarifa.tarifa;

                } else {
                    entity.idTipoIva = articulo.idTipoIva;
                    entity.codigoPorcentaje = articulo.codigoPorcentaje;
                    entity.tarifa = articulo.tarifa;

                }

                // entity.nombreTipoIva        = articulo.nombreTipoIva;
                entity.ice = articulo.valorIce;
                entity.idBodega = $scope.data.idBodega > 0 ? $scope.data.idBodega : 0;
                entity.llevaInventario = articulo.llevaInventario;
                entity.datosAdicionales = articulo.datosAdicionales;
                entity.productoFraccionable = articulo.productoFraccionable;
                entity.medidas = medidas; //Lista Medida 
                entity.idMedida = dataMedida.idMedida; //Medida por defecto 

                //Datos Adicionales 
                entity.datosAdicionalesArticulo = datosAdicionalesArticulo; //

                entity.articuloTarifas = dataMedida.tarifas;
                let tarifa = entity.articuloTarifas.find(item => item.idTarifa === $scope.data.idTarifa);
                entity.idTarifa = $scope.data.idTarifa;
                entity.precioSinSubsidio = articulo.precioSinSubsidio;
                entity.precioUnitario = fS.roundNumber(tarifa.precioVenta, $scope.decimal.nroPrecio);
                entity.precioConIva = fS.roundNumber(tarifa.precioConIva, $scope.decimal.nroPrecio);

                $scope.setCalculoTotales('precioUnitario', entity, 0);

                // const objCalculo =uiGridInvoice.calculoColDef(entity, 0);

                // objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();

                // objCalculo["calculoTotalDetalle"]();

                //data = Object.assign(self.data,uiGridInvoice.getTotales());
                $scope.indexRowDetalle = index;
                $scope.focusColumnCantidad(articulo);

            } catch (error) {
                console.log(error)
            }
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
                columnDefs: $scope.gridOptionsDetalle.columnDefs
            });

            objCalculo[colField] && objCalculo[colField]();

            objCalculo["calculoTotalDetalle"]();
            $scope.recalculateTotalsSimple();
        }


        /**
         * Calculamos todos los totales y subtotales del comprobantes 
         */
        $scope.recalculateTotalsSimple = function () {

            $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                items: $scope.gridOptionsDetalle.data,
                decimal: $scope.decimal,
                dataTarifaImpuesto: $scope.dataTarifaImpuesto,
                TAX_RATE_CODE
            }))

            $scope.dataClone.porcentajeDescuento = $scope.data.porcentajeDescuento;
            $scope.dataClone.totalDescuento = $scope.data.totalDescuento;
        }

        $scope.focusColumnCantidad = function (articulo) {
            let index = 0;
            if (articulo.llevaInventario) {
                index = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'cantidad')
            } else {
                index = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'descripcion')
            }

            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptionsDetalle.data[0],
                $scope.gridOptionsDetalle.columnDefs[2]
            )

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptionsDetalle.data[$scope.indexRowDetalle],
                    $scope.gridOptionsDetalle.columnDefs[index]
                );
                $scope.indexRowDetalle = null;
            }, 30)
        }


        $scope.askToDeleteRow = async function (rowEntity) {
            try {
                $scope.indexRowDetalle = null;
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptionsDetalle.data.indexOf(rowEntity);
                    $scope.gridOptionsDetalle.data.splice(index, 1);
                    //Recalculamos los totales 
                    $scope.setCalculoTotales("cantidad", rowEntity, 0);
                    $scope.$apply();
                }

                if (isConfirmed && rowEntity.datosAdicionales) {
                    $scope.datosAdicionalesArticulo = $scope.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.idArticulo);
                    $scope.historyDatosAdicionales = $scope.historyDatosAdicionales.filter(val => val.idArticulo !== rowEntity.idArticulo);
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.openModalArticulo = function (item) {
            $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.indexOf(item);
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptionsDetalle.data[0],
                $scope.gridOptionsDetalle.columnDefs[1]
            )
            $scope.$broadcast("editArticulo", item)
        }


        $scope.resultModalAdicional = function (result) {
            let { historyDatosAdicionales } = result;
            $scope.historyDatosAdicionales = historyDatosAdicionales;
        }


        $scope.askToSave = async function () {
            try {

                if (!$scope.data.codEstab) {
                    tS.toastr('warning', 'Seleccione el Establecimiento')
                    return
                }

                if (!($scope.cliente.idCliente > 0)) {
                    tS.toastr('warning', 'Seleccione el Cliente')
                    return
                }

                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.toastr('warning', 'Seleccione el Punto de Emisión')
                    return
                }

                if (!$scope.data.fechaEmision) {
                    tS.toastr('warning', 'Ingrese la Fecha de Emisión')
                    return
                }
                if (!fS.isValidDate($scope.data.fechaEmision)) {
                    tS.toastr('warning', 'Ingrese la fecha de emisióm correctamente')
                    return
                }

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


                let { isConfirmed } = await Swal.fire({
                    // title: 'Are you sure?',
                    html: `<small>Esta Ud. seguro de <b>actualizar</b> este Aprobación Documento <b>N° ${$scope.data.serieComprobante}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, actualizar!',
                    cancelButtonText: 'No, cancelar'
                })
                if (isConfirmed) {
                    const jsonHeader = {
                        ...$scope.data,
                        idCliente: $scope.cliente.idCliente,
                        totalSinImpuestos: $scope.data.subTotalSinImpuestos,
                        totalConImpuestos: $scope.data.total,
                        importeTotal: $scope.data.total,
                        fechaEmision: fS.formatDateTimeZone($scope.data.fechaEmision, "YYYY-MM-DD h:mm A"),
                    }
                    //Tarifa Aplicada al Documento
                    jsonHeader.tarifa = $scope.dataTarifaImpuesto.tarifa;
                    jsonHeader.codigoPorcentaje = $scope.dataTarifaImpuesto.codigoPorcentaje;

                    let detalles = aprobacionDocSvc.detalleMapperTo($scope.gridOptionsDetalle.data, $scope.decimal);

                    const query = {
                        comprobante: JSON.stringify(jsonHeader),
                        detalle: JSON.stringify(detalles),
                        historialVenta: JSON.stringify($scope.historyDatosAdicionales)
                    }
                    showLoader();
                    aprobacionDocSvc.update($scope.data.idAprob_Document, query).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message);
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response);
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                }

            } catch (error) {
                hideLoader();
                console.trace(error)
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close()
        }
    }





    /**
     * ======================MODAL APROBACION DEL DOCUMENTO DESTINO===============
     */
    app.controller('ModalApproveDocCtrl', ModalApproveDocCtrl);
    ModalApproveDocCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'params']

    function ModalApproveDocCtrl($scope, $uibModalInstance, $timeout, params) {
        let { docOrigenDesc, docDestinoDesc, data } = params
        let { comprobante, cliente, detalles, datosAdicionalesArticulo } = data;

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc;

        $scope.data = comprobante;
        $scope.cliente = cliente;

        $scope.dataClone = {};
        $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
        $scope.dataClone.fechaEmision = $scope.data.fechaEmision;

        $scope.tipoDoc = {
            codigo: DOC_TYPE.NE
        }

        $scope.dataDisabled = {
            isDisabledSucursal: true,
            isDisabledPuntoEmision: true
        }

        $scope.datosAdicionalesArticulo = datosAdicionalesArticulo || [];
        $scope.historyDatosAdicionales = datosAdicionalesArticulo.map(item => ({
            idArticulo: item.idArticulo,
            idInfoAdicional: item.idInfoAdicional,
            selected: true,
        }))

        $scope.infoAdicionalDocumento = [];

        //GridOptions Invoice 
        $scope.gridOptionsDetalle = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }

        $scope.gridOptionsDetalle.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }

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


        $scope.initiload = async function () {
            try {
                showLoader();

                let {
                    estabs,
                    tarifaImpuestoVigente,
                    tarifasImpuesto,
                    tiemposCredito,
                    tarifas,
                    permisoVenta,
                    decimal,
                } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa 
                 */
                $scope.establecimientos = estabs;
                const codEstab = $scope.establecimientos.flatMap((dt) => dt.puntosEmision)
                    .find((dt) => dt.idPuntoEmision === $scope.data.idPuntoEmision).codEstab;

                let dataEstab = $scope.establecimientos.find(item => (item.codEstab === codEstab))

                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataClone.codEstab = $scope.data.codEstab;

                $scope.dataTarifaImpuesto = tarifaImpuestoVigente;

                //===========Puntos Emisiones============================================== 
                $scope.ptosEmision = dataEstab.puntosEmision;
                let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                //============Bodegas======================================================= 
                $scope.bodegas = dataEstab.bodegas;
                let dataBodega = $scope.bodegas.find(item => (item.defaultBodega))
                $scope.data.idBodega = dataBodega.idBodega;

                //Decimal 
                $scope.decimal = decimal;

                //Tipo Ivas 
                $scope.tipoIvas = tarifasImpuesto;

                //Tarifas(PVP1, PVP2)
                $scope.tarifas = tarifas;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;

                $scope.tiempoCreditos = tiemposCredito;
                if ($scope.tiempoCreditos.length > 0) {
                    $scope.data.idTiempoCredito = $scope.tiempoCreditos[0].idTiempoCredito;
                    $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
                }

                //Permisos para detalle y documento    
                $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                $scope.permisoDetalleVenta = permisoVenta.detalle;

                setColumnDefs();
                $scope.gridOptionsDetalle.data = detalles;

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                    items: $scope.gridOptionsDetalle.data,
                    decimal: $scope.decimal,
                    dataTarifaImpuesto: $scope.dataTarifaImpuesto,
                    TAX_RATE_CODE
                }))
                getFechaVencimiento();
                hideLoader();
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.initiload();

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

            $scope.gridOptionsDetalle.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '100',
                cellTemplate: `
                    <button type="button" ng-click="grid.appScope.askToDeleteRow(row.entity)" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                        <i class="fa fa-trash"></i>
                    </button>

                    <button type="button"  update-article class= "btn btn-success btn-xs text-white" ng-click="grid.appScope.openModalArticulo(row.entity)" title = "Editar Articulo" >
                        <i class="fa fa-edit"></i>
                    </button > 

                    <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.historyDatosAdicionales" result-modal-adicional="grid.appScope.resultModalAdicional(result)" datos-adicionales="grid.appScope.datosAdicionalesArticulo" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`
            },
            {
                name: 'Cód.',
                field: 'codigo',
                width: '8%',
                minWidth: '100',
                enableCellEdit: false,
            },
            {
                name: 'Descripción',
                field: 'descripcion',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: (scope) => scope.row.entity.llevaInventario !== true,
                cellTooltip: (row) => row.entity.descripcion,
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '6%',
                minWidth: '50',
            },
            {
                name: 'Medida',
                field: 'idMedida',
                enableCellEdit: ventaDetailPermission.medida,
                enableCellEditOnFocus: ventaDetailPermission.medida,
                allowCellFocus: ventaDetailPermission.medida,
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity) => rowEntity.medidas.map(val => ({
                    id: val.idMedida,
                    value: val.descripcion
                })),
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: ventaDetailPermission.tipoIva,
                allowCellFocus: ventaDetailPermission.tipoIva,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva,
                type: 'number',
                width: '8%',
                minWidth: '100',
                //    visible: config.porcentajeIva
            },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
                enableCellEdit: ventaDetailPermission.tarifa,
                enableCellEditOnFocus: ventaDetailPermission.tarifa,
                allowCellFocus: ventaDetailPermission.tarifa,
                type: 'number',
                width: '12%',
                minWidth: '100',
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '8%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario : true;
                },
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '7%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva : true;
                },
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: ventaDetailPermission.porcentajeDescuento,
                allowCellFocus: ventaDetailPermission.porcentajeDescuento,
                enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: ventaDetailPermission.porcentajeDescuento,
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento,
                enableCellEditOnFocus: ventaDetailPermission.descuento,
                allowCellFocus: ventaDetailPermission.descuento,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: ventaDetailPermission.descuento
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: ventaDetailPermission.descuento
            },
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '5%',
                minWidth: '100'
            },
            {
                name: 'Nota',
                field: 'nota',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '15%',
                minWidth: '100'
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                type: 'number',
                width: '11%',
                minWidth: '100'
            },
            ]

            setWarehouseAndIVA();
        }

        $scope.onChangeTiempoCredito = function () {
            if (!$scope.permisoComprobanteVenta.tiempoCredito) {
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                $scope.data.idTiempoCredito = $scope.dataClone.idTiempoCredito
            }
            getFechaVencimiento();
        }


        $scope.onChangeFechaEmision = function () {
            if (!$scope.permisoComprobante.fechaEmision) {
                tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
            }
            getFechaVencimiento();
        }


        function getFechaVencimiento() {
            if ($scope.data.fechaEmision && $scope.tiempoCreditos.length > 0) {

                let tiempoCredito = $scope.tiempoCreditos.find(item => item.idTiempoCredito === $scope.data.idTiempoCredito);
                let diasCredito = typeof tiempoCredito === 'object' ? tiempoCredito.diasCredito : 0;
                let fechaEmision = fS.setHoursToDate($scope.data.fechaEmision)

                let {
                    fechaVencimiento,
                    fechaEmisionEscrita,
                    fechaVencimientoEscrita
                } = fS.sumarDiasAFecha(fechaEmision, diasCredito);

                var formattedDateTime = moment(fechaVencimiento).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss");

                $scope.data.fechaVencimiento = new Date(formattedDateTime);
                $scope.data.fechaEmisionEscrita = fechaEmisionEscrita;
                $scope.data.fechaVencimientoEscrita = fechaVencimientoEscrita;

                //Variables temporales
                $scope.dataClone.fechaEmision = fechaEmision;
                $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;
            }
        }


        $scope.onChangeEstab = async function () {
            try {
                let { isConfirmed } = await Swal.fire({
                    title: 'Cambiar Establecimiento?',
                    text: "Se cambiará puntos de Emisión y la bodega en el detalle!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                })

                if (isConfirmed) {

                    let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);

                    if (dataEstab.puntosEmision.length === 0) {
                        tS.toastr('info', 'No tienes Puntos de Emisión asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }
                    if (dataEstab.bodegas.length === 0) {
                        tS.toastr('info', 'No tienes bodegas asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }

                    //Impuesto Tarifa
                    // $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                    // $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];

                    //Puntos de Emision 
                    $scope.ptosEmision = dataEstab.puntosEmision;

                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                    $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                    //Bodegas 
                    $scope.bodegas = dataEstab.bodegas;

                    let dataBodega = $scope.bodegas.find(item => (item.defaultBodega));
                    $scope.data.idBodega = dataBodega.idBodega;

                    $scope.dataClone.codEstab = $scope.data.codEstab;

                    setWarehouseAndIVA();
                } else {
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                }

            } catch (error) {
                console.log(error);
            }
        }

        /**
        * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
        */
        function setWarehouseAndIVA() {
            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
            $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
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

                if ($scope.gridOptionsDetalle.data.length === 0) return

                if (gridOptionsSvc.setTarifaInDetail(
                    $scope.gridOptionsDetalle,
                    $scope.data.idTarifa,
                    $scope.decimal,
                    gridOptionsSvc.calculoColDef
                )
                ) {
                    $scope.recalculateTotalsSimple();
                }
                $scope.$apply();

            } else {
                $scope.data.idTarifa = $scope.dataClone.idTarifa;
                $scope.$apply();
            }
        }


        //Indice del detalle documento 
        $scope.indexRowDetalle = null;

        //Recibe datos de buscador articulo cuando seleccionan articulo
        $scope.setItemArticuloEnDetalle = function (dataArticulo) {

            try {
                const { articulo, medidas, datosAdicionalesArticulo, consolidacionesFecha } = dataArticulo;

                let index = 0, entity = {};

                let findIndexById = $scope.gridOptionsDetalle.data.findIndex(item => item.llevaInventario && item.idArticulo === articulo.idArticulo);

                if (findIndexById === -1) {
                    $scope.gridOptionsDetalle.data.push(aprobacionDocSvc.addRow());
                    index = $scope.gridOptionsDetalle.data.findIndex(value => value.idArticulo === 0);
                    entity = $scope.gridOptionsDetalle.data[index];
                } else {
                    index = findIndexById;
                    entity = $scope.gridOptionsDetalle.data[index];
                    entity.cantidad = entity.cantidad + 1;
                }


                let dataMedida = medidas.find(medida => (medida.defaultMedida));

                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;


                //Aplica a establecimiento que llevan actividad de Tipo Alojamiento
                if ($scope.dataTarifaImpuesto.codigoPorcentaje === TAX_RATE_CODE.DIFFERENTIATED_TAX
                    && articulo.codigoPorcentaje === TAX_RATE_CODE.TWELVE_PERCENT) {

                    let dataImpuestoTarifa = $scope.tipoIvas.find(item => item.codigoPorcentaje === $scope.dataTarifaImpuesto.codigoPorcentaje);
                    entity.idTipoIva = dataImpuestoTarifa.idTipoIva;
                    entity.codigoPorcentaje = dataImpuestoTarifa.codigoPorcentaje;
                    entity.tarifa = dataImpuestoTarifa.tarifa;

                } else {
                    entity.idTipoIva = articulo.idTipoIva;
                    entity.codigoPorcentaje = articulo.codigoPorcentaje;
                    entity.tarifa = articulo.tarifa;

                }

                // entity.nombreTipoIva        = articulo.nombreTipoIva;
                entity.ice = articulo.valorIce;
                entity.idBodega = $scope.data.idBodega > 0 ? $scope.data.idBodega : 0;
                entity.llevaInventario = articulo.llevaInventario;
                entity.datosAdicionales = articulo.datosAdicionales;
                entity.productoFraccionable = articulo.productoFraccionable;
                entity.medidas = medidas; //Lista Medida 
                entity.idMedida = dataMedida.idMedida; //Medida por defecto   
                entity.conversion = dataMedida.conversion;

                //Datos Adicionales 
                entity.datosAdicionalesArticulo = datosAdicionalesArticulo; //
                entity.consolidacionesFecha = consolidacionesFecha;

                entity.articuloTarifas = dataMedida.tarifas;
                let tarifa = entity.articuloTarifas.find(item => item.idTarifa === $scope.data.idTarifa);
                entity.idTarifa = $scope.data.idTarifa;
                entity.precioCosto = articulo.precioCosto;
                entity.precioUnitario = fS.roundNumber(tarifa.precioVenta, $scope.decimal.nroPrecio);
                entity.precioConIva = fS.roundNumber(tarifa.precioConIva, $scope.decimal.nroPrecio);
                entity.cantMinimaVentaPorMayor = articulo.cantMinimaVentaPorMayor;
                entity.precioSinSubsidio = articulo.precioSinSubsidio;

                $scope.setCalculoTotales('precioUnitario', entity, 0);

                $scope.indexRowDetalle = index;
                $scope.focusColumnCantidad(articulo);

            } catch (error) {
                console.log(error)
            }
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
                columnDefs: $scope.gridOptionsDetalle.columnDefs
            });

            objCalculo[colField] && objCalculo[colField]();

            objCalculo["calculoTotalDetalle"]();
            $scope.recalculateTotalsSimple();
        }


        /**
         * Calculamos todos los totales y subtotales del comprobantes 
         */
        $scope.recalculateTotalsSimple = function () {

            $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                items: $scope.gridOptionsDetalle.data,
                decimal: $scope.decimal,
                dataTarifaImpuesto: $scope.dataTarifaImpuesto,
                TAX_RATE_CODE
            }))

            $scope.dataClone.porcentajeDescuento = $scope.data.porcentajeDescuento;
            $scope.dataClone.totalDescuento = $scope.data.totalDescuento;
        }

        $scope.focusColumnCantidad = function (articulo) {
            let index = 0;
            if (articulo.llevaInventario) {
                index = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'cantidad')
            } else {
                index = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'descripcion')
            }

            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptionsDetalle.data[0],
                $scope.gridOptionsDetalle.columnDefs[2]
            )

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptionsDetalle.data[$scope.indexRowDetalle],
                    $scope.gridOptionsDetalle.columnDefs[index]
                );
                $scope.indexRowDetalle = null;
            }, 30)
        }


        $scope.gridOptionsItemsDeleted = [];
        $scope.askToDeleteRow = async function (rowEntity) {
            try {
                $scope.indexRowDetalle = null;
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptionsDetalle.data.indexOf(rowEntity);
                    $scope.gridOptionsDetalle.data.splice(index, 1);

                    // if (rowEntity.idAprob_Document_Detailt > 0) {
                    //     $scope.gridOptionsItemsDeleted.push({
                    //         ...rowEntity,
                    //         cantidad: rowEntity.cantidadOriginal,
                    //         estado: 0
                    //     });
                    // }

                    //Recalculamos los totales 
                    $scope.setCalculoTotales("cantidad", rowEntity, 0);
                    $scope.$apply();
                }

                if (isConfirmed && rowEntity.datosAdicionales) {
                    $scope.datosAdicionalesArticulo = $scope.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.idArticulo);
                    $scope.historyDatosAdicionales = $scope.historyDatosAdicionales.filter(val => val.idArticulo !== rowEntity.idArticulo);
                }

            } catch (error) {
                console.log(error);
            }
        }

        $scope.openModalArticulo = function (item) {
            $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.indexOf(item);
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptionsDetalle.data[0],
                $scope.gridOptionsDetalle.columnDefs[1]
            )
            $scope.$broadcast("editArticulo", item)
        }


        $scope.resultModalAdicional = function (result) {
            let { historyDatosAdicionales } = result;
            $scope.historyDatosAdicionales = historyDatosAdicionales;
        }

        $scope.resultModalInfoAdicional = function (result) {
            $scope.infoAdicionalDocumento = result;
        }


        $scope.askToSaveDocDestino = async function () {
            try {

                if (!$scope.data.codEstab) {
                    tS.toastr('warning', 'Seleccione el Establecimiento')
                    return
                }

                if (!($scope.cliente.idCliente > 0)) {
                    tS.toastr('warning', 'Seleccione el Cliente')
                    return
                }

                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.toastr('warning', 'Seleccione el Punto de Emisión')
                    return
                }

                if (!($scope.data.idTiempoCredito > 0)) {
                    tS.toastr('warning', 'Seleccione el Tiempo de Crédito')
                    return
                }

                if (!$scope.data.fechaEmision) {
                    tS.toastr('warning', 'Ingrese la Fecha de Emisión')
                    return
                }

                if (!fS.isValidDate($scope.data.fechaEmision)) {
                    tS.toastr('warning', 'Ingrese la fecha de emisióm correctamente')
                    return
                }

                if (!$scope.data.fechaVencimiento) {
                    tS.toastr('warning', 'Ingrese la Fecha de Vencimiento')
                    return
                }
                if (!fS.isValidDate($scope.data.fechaVencimiento)) {
                    tS.toastr('warning', 'Fecha de Vencimiento Inválido')
                    return
                }

                if ($scope.data.fechaEmision > $scope.data.fechaVencimiento) {
                    tS.toastr('warning', 'Fecha de Vencimiento no puede ser menor a Fecha de Emisión')
                    return
                }

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

                if ($scope.data.total <= 0) {
                    tS.toastr('warning', 'No se puede generar el documento en el importe total con un valor 0')
                    return
                }

                if (
                    $scope.data.docDestino === DOC_TYPE.FV_SRI &&
                    $scope.cliente.tipoIdentificacion === SRI_IDENTIFITION_CODE.CONSUMIR_FINAL &&
                    $scope.data.total > 50
                ) {
                    Swal.fire({
                        icon: 'warning',
                        html: `<small>La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b></small>`,
                        confirmButtonText: 'Aceptar'
                    })
                    return
                }
                if ($scope.gridOptionsDetalle.data.some(row => !(row.idBodega > 0))) {
                    tS.toastr('warning', 'Seleccione la bodega en el detalle de los artículos');
                    return
                }

                let serieComprobante = null;
                if ($scope.data.docDestino === DOC_TYPE.FV_SRI) {
                    showLoader();
                    serieComprobante = await facturaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    });
                    hideLoader();
                }
                if ($scope.data.docDestino === DOC_TYPE.NE) {
                    showLoader();
                    serieComprobante = await notaEntregaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    })
                    hideLoader();
                }

                if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                let { isConfirmed } = await Swal.fire({
                    // title: 'Are you sure?',
                    html: `<small>Esta Ud. seguro de <b>guardar</b> este Aprobación Documento de: ${docOrigenDesc} -> ${docDestinoDesc} con <b>N° ${$scope.data.serieComprobante}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar'
                })

                if (isConfirmed) {
                    showLoader();

                    $scope.data.codigoPorcentaje = $scope.dataTarifaImpuesto.codigoPorcentaje;
                    $scope.data.tarifa = $scope.dataTarifaImpuesto.tarifa;
                    $scope.data.idUsuario = 0;
                    //Documento Destino Factuta
                    if ($scope.data.docDestino === DOC_TYPE.FV_SRI) {
                        let query = facturaSvc.queryMapper({
                            data: $scope.data,
                            cliente: {
                                idCliente: $scope.cliente.idCliente
                            },
                            detalles: $scope.gridOptionsDetalle.data,
                            itemsDeleted: [],
                            infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                            historyDatosAdicionales: $scope.historyDatosAdicionales
                        })

                        facturaSvc.save(query).then(response => {
                            hideLoader();
                            if (response.code === "0") {
                                fS.sweetAlert('warning', response.message);
                            }
                            if (response.code === '1') {
                                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                $uibModalInstance.close(response);
                            }
                        }).catch(error => {
                            hideLoader();
                            console.error(error)
                        })
                    }


                    //Documento Destino Nota Entrega
                    if ($scope.data.docDestino === DOC_TYPE.NE) {
                        let query = notaEntregaSvc.queryMapper({
                            data: $scope.data,
                            cliente: {
                                idCliente: $scope.cliente.idCliente
                            },
                            detalles: $scope.gridOptionsDetalle.data,
                            itemsDeleted: [],
                            historyDatosAdicionales: $scope.historyDatosAdicionales
                        })

                        notaEntregaSvc.save(query).then(response => {
                            hideLoader()
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
                        })
                    }

                }

            } catch (error) {
                console.log(error)
            }
        }



        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

    }

})(window.angular)