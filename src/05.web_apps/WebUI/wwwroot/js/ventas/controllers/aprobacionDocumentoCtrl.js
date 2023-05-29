(function () {

    'use strict';

    //Variables Constantes
    const URL_TEMPLATE = '~/Areas/AprobacionDocumento/Pages/Shared/'

    //Variable servicios
    let mS = {};
    let tS = {};
    let fS = {};
    let commonSvc = {};
    let aprobacionDocSvc = {};
    let clienteSvc = {};
    let notaEntregaSvc = {};
    let proformaSvc = {};
    let articuloSvc = {};
    let facturaSvc = {};
    let ventaSvc = {};
    let gridOptionsSvc = {};
    let idUsuarioRol = 0;

    let mainDataForm = {};

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    app.controller('aprobacionDocumentoCtrl', aprobacionDocumentoCtrl);

    aprobacionDocumentoCtrl.$inject = ['$scope', '$filter', '$injector', 'modalService', 'nombreModalVenta', 'decodeToken'];

    function aprobacionDocumentoCtrl($scope, $filter, $injector, modalSvc, nombreModalVenta, decodeToken) {

        //Injection Services
        mS               = $injector.get('mainService');
        commonSvc        = $injector.get('commonService');
        clienteSvc       = $injector.get('clienteService');
        aprobacionDocSvc = $injector.get('aprobacionDocService');
        ventaSvc         = $injector.get('ventaService');
        notaEntregaSvc   = $injector.get('notaEntregaService');
        proformaSvc      = $injector.get('proformaService');
        articuloSvc      = $injector.get('articuloService');
        facturaSvc       = $injector.get('facturaService');
        tS               = $injector.get('toastService');
        fS               = $injector.get('formulario');
        gridOptionsSvc   = $injector.get('gridOptionsService');

        idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

        $scope.moreSearchOptions = false;
        $scope.dataSearch = {}



        let OPTION_APROBACION = Object.freeze({
            0: Object.freeze({
                docOrigen: {
                    descripcion: 'Nota de Entrega',
                    codDoc: 'NE',
                },
                docDestino: {
                    descripcion: 'Factura',
                    codDoc: '01',
                }
            }),
            1: Object.freeze({
                docOrigen: {
                    descripcion: 'Proforma',
                    codDoc: 'PR'
                },
                docDestino: {
                    descripcion: 'Factura',
                    codDoc: '01',
                }
            }),
            2: Object.freeze({
                docOrigen: {
                    descripcion: 'Proforma',
                    codDoc: 'PR',
                },
                docDestino: {
                    descripcion: 'Nota de Entrega',
                    codDoc: 'NE',
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
                $scope.dataSearch.byEstado = 0;
            }
        }

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byEstado = item.idUsuario;
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
            let total = $scope.aprobComprobantes.map(item => item.total).reduce((prev, acc) => prev + acc, 0)
            $scope.total = fS.roundNumber(total, 2)
        }

        $scope.getAprobComprobantes = function () {
            try {
                showLoader();
                $scope.aprobComprobantes = [];

                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    checkBoxDefault: false,
                    checkBoxCliente: $scope.dataSearch.byCliente > 0,
                    byCliente: $scope.dataSearch.byCliente,
                    checkBoxFecha: true,
                    checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                    byUsuario: $scope.dataSearch.byUsuario,
                    checkBoxEstado: $scope.dataSearch.byEstado ? true : false,
                    byEstado: $scope.dataSearch.byEstado,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin)
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
                ventaSvc.getDataForm({ typeList: 1 }).then((response) => {
                    mainDataForm = response;
                    $scope.establecimientos = mainDataForm.establecimientos;
                    console.log($scope.establecimientos)
                    $scope.dataSearch.codEstab = $scope.establecimientos[0].codEstab;
                    $scope.getAprobComprobantes();
                }).catch((errorResponse) => {
                    console.log(errorResponse);
                });

                commonSvc.getEstadoDocByCodDoc('PRE').then(response => {
                    $scope.estadoDocumentos = response;
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
                aprobacionDocSvc.findById(item.idAprob_Document).then(response => {
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
                try {
                    showLoader();
                    aprobacionDocSvc.findById(item.idAprob_Document).then(response => {
                        hideLoader();
                        modalSvc.openModalCustom({
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
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    })
                } catch (error) {
                    hideLoader();
                    console.log(error)
                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        $scope.openModalAprobDoc = async (item) => {
            try {
                modalSvc.openModalCustom({
                    controller: 'ModalAprobDocEditarCtrl',
                    template: URL_TEMPLATE + '_ModalSelectDocumento.cshtml',
                    size: 'xl',
                    windowClass: 'uibModalFullScreen',
                    params: {}
                })
            } catch (error) {
                console.log(error)
            }
        }


        $scope.askToDelete = async (item) => {
            try {
                let {isConfirmed} = await Swal.fire({
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
                            Toast.fire({
                                icon: 'warning',
                                html: response.message
                            })
                        }
                        if (response.code === '1') {
                            Toast.fire({
                                icon: 'successs',
                                html: response.message
                            })
                            $scope.aprobComprobantes();
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
                
                let format = 'pdf';
                let dataParms = {
                    id: item.idAprob_Document,
                    codEstab: item.codEstab,
                    docDestino: item.docDestino,
                    codigo: 'RAC',
                    format,
                }

                const parameters = {
                    dataParams: JSON.stringify(dataParms)
                }

                commonSvc.getReportDynamic({
                    parameters,
                    format
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
        'params'
    ];

    function ModalSelectDocCtrl($scope, $uibModalInstance, uiGridConstants, params) {

        let { docOrigen, docDestino } = params;
        $scope.docOrigen = docOrigen;
        $scope.docDestino = docDestino;

        //-----------------Filters----------------------
        $scope.dataSearch = {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            checkBoxDefault: false,
            checkBoxCliente: true,
            checkBoxEstado: true
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
            gridApi.selection.on.rowSelectionChanged($scope, (row) => {
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

                showLoader();
                //UNIMOS TODOS LOS DETALLES DEL COMPROBANTE

                let resultJoinDetails = $scope.selectedDocuments.flatMap(item => item.subGridOptions.data);


                //Si la Opcion es Agrupar Articulos del Detalle 
                // if (this.groupByArticle) {
                //     resultJoinDetails = resultJoinDetails.reduce((arrGroup, current) => {
                //         let thatItem = arrGroup.find(item => item.codigo == current.codigo);
                //         if (thatItem == undefined) arrGroup = [...arrGroup, {
                //             ...current
                //         }]
                //         else {
                //             thatItem.cantidad += current.cantidad;

                //             let precioVenta = thatItem.precioVenta += current.precioVenta;
                //             let precioConIva = thatItem.precioConIva += current.precioConIva;
                //             let porcentajeDescuento = thatItem.porcentajeDescuento += current.porcentajeDescuento;
                //             let valorDescuento = thatItem.valorDescuento += current.valorDescuento;
                //             let totalDescuento = thatItem.totalDescuento += current.totalDescuento;
                //             let subTotal = thatItem.subTotal += current.subTotal;
                //             let total = thatItem.total += current.total;

                //             thatItem.precioVenta = this._fS.roundNumber(precioVenta, this.decimal.nroPrecio);
                //             thatItem.precioConIva = this._fS.roundNumber(precioConIva, this.decimal.nroPrecio);
                //             thatItem.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroPorcentaje);
                //             thatItem.valorDescuento = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuento);
                //             thatItem.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle);
                //             thatItem.subTotal = this._fS.roundNumber(subTotal, 5);
                //             thatItem.total = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);
                //         }
                //         return arrGroup
                //     }, [])
                // }

                //Agregamos Bodega e Indice
                let index = 1;
                $scope.gridOptionsDetalle.data = resultJoinDetails.map(item => {
                    item.idBodega = $scope.idBodega;
                    item.n = index++;
                    return item;
                })

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                    items: $scope.gridOptionsDetalle.data,
                    decimal: $scope.decimal,
                    dataTarifaImpuesto: $scope.dataTarifaImpuesto
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
                console.log($scope.cliente)
                //Creamos objeto GridOptions para calculos de totales y subtotales             
                // this.uiGridInvoice = new UiGridOptions({
                //     $scope: this.$scope,
                //     gridOptions: this.gridOptionsDetailDocument,
                //     _fS: this._fS,
                //     _mS: this._mS,
                //     _tS: this._tS,
                //     tipoIvas: this.tipoIvas
                // })

                // this.uiGridInvoice.setInitiload({
                //     bodegas: this.bodegas,
                //     tipoIvas: this.tipoIvas,
                //     decimal: this.decimal,
                //     actividadTipoIva: this.actividadTipoIva
                // })

                // this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());

                // this.getImporteTotal();

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

        // $scope.getDataImpuestoTarifa = function () {
        // 	let actividadEstabImpuesto = $scope.impuestosTarifas.find(item => item.codigoPorcentaje === $scope.data.impuestoTarifa.codigoPorcentaje);
        // 	$scope.data.impuestoTarifa.codigoPorcentaje = actividadEstabImpuesto.codigoPorcentaje;
        // 	$scope.data.impuestoTarifa.tarifa = actividadEstabImpuesto.tarifa;
        // 	return actividadEstabImpuesto;
        // }

        //Inicio 
        $scope.initiload = function () {
            try {
                let { establecimientos, ptosEmision, bodegas, configVenta, decimal, configDetalle, tipoIvas, tarifas, tiempoCreditos, articuloPredeterminado, clientePredeterminado, permisonVenta, permisoArticulo } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa 
                 */

                let dataEstab = establecimientos.find(item => (item.predeterminado))

                $scope.establecimientos = establecimientos;
                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataSearch.codEstab = $scope.data.codEstab; //Filtro
                $scope.dataClone.codEstab = $scope.data.codEstab;


                $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];

                console.log($scope.dataTarifaImpuesto)

                //===========Puntos Emisiones==============================================
                $scope.tempPuntosEmision = ptosEmision;
                $scope.ptosEmision = $scope.tempPuntosEmision.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);
                let dataPtoEmi = $scope.ptosEmision.find(item => (item.predeterminado))
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                //============Bodegas=======================================================
                $scope.tempBodegas = bodegas;

                $scope.bodegas = $scope.tempBodegas.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);
                let dataBodega = $scope.bodegas.find(item => (item.predeterminado))
                $scope.idBodega = dataBodega.idBodega;
                $scope.dataClone.idBodega = $scope.idBodega;

                //Decimal 
                $scope.decimal = decimal;

                //Config. Detalle (Mostrar/Ocultar Columnas de talle)
                $scope.configDetalle = configDetalle;
                $scope.tipoIvas = tipoIvas;
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
            if (!$scope.cliente.idCliente > 0) {
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
                let {isConfirmed} = await Swal.fire({
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

                    $scope.ptosEmision = $scope.tempPuntosEmision.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);

                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.predeterminado))
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
            $scope.getDocumentos();
        }


        $scope.getDocumentos = function () {
            try {
                $scope.documentos = [];
                $scope.dataSearch.byCliente = $scope.cliente.idCliente;
                if ($scope.docOrigen.codDoc === 'NE') {
                    $scope.getNotaEntregas();
                }

                if ($scope.docOrigen.codDoc === 'PR') {
                    $scope.getProformas();
                }

            } catch (error) {
                console.log(error)
            }
        }

        $scope.getNotaEntregas = function () {
            try {
                showLoader();
                $scope.documentos = [];
                $scope.dataSearch.typeList = 2;
                notaEntregaSvc.getAll($scope.dataSearch).then(async response => {

                    $scope.gridOptionsSelectedDocs.columnDefs = [{
                        name: 'Nro. Doc',
                        field: 'nroDocumento'
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

                    $scope.documentos = response;
                    await $scope.setDataGridOptionsChildren();

                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }


        $scope.getProformas = function () {
            try {
                showLoader();
                $scope.documentos = [];
                $scope.dataSearch.typeList = 2;
                proformaSvc.getAll($scope.dataSearch).then(async response => {
                    $scope.gridOptionsSelectedDocs.columnDefs = [{
                        name: 'Nro. Doc',
                        field: 'nroDocumento'
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

                    this.documentos = response;
                    await this.setDataGridOptionsChildren();
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

                //Obtenemos detalle de Nota de Entrega || Porforma
                let { detalleDocumento, datosAdicionalesArticulo, infoAdicionalDocumento } = await commonSvc.getDataTipoDocVenta({
                    id: item.idDocumento,
                    codigoDocumento: $scope.docOrigen.codDoc
                })
                item.subGridOptions.data = detalleDocumento;

                //Historial Ventas de Nota Entrega 
                tempHistorialInfoAdicional.push(datosAdicionalesArticulo);
                tempInfoAdicionalDocumento.push(infoAdicionalDocumento)
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
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
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
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
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
                {
                    name: '%',
                    field: 'porcentajeDescuento',
                    width: '6%',
                    minWidth: '100',
                },
                {
                    name: 'dsto.',
                    field: 'valorDescuento',
                    width: '6%',
                    minWidth: '100',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${$scope.decimal.nroDescuento}`,
                },
                {
                    name: 'T. Dsto.',
                    field: 'totalDescuento',
                    width: '7%',
                    minWidth: '100',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${$scope.decimal.nroDescuentoDetalle}`
                },
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
                editDropdownOptionsFunction: function (rowEntity, colDef) {
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
                editDropdownOptionsFunction: (rowEntity, colDef) => {
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
                visible: $scope.configDetalle.porcentajeDescuento || false,
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
                visible: $scope.configDetalle.descuento || false
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
                visible: $scope.configDetalle.totalDescuento || false
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
                visible: $scope.configDetalle.ice || false
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
            {
                name: 'llevaInventario',
                field: 'llevaInventario',
                visible: false
            },
            {
                name: 'datosAdicionales',
                field: 'datosAdicionales',
                visible: false
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
                let {isConfirmed} = await Swal.fire({
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

                    if (!$scope.tempPuntosEmision.some(item => item.codEstab_Asig === dataEstab.codEstab_Asig)) {
                        tS.toastr('info', 'No tienes Puntos de Emisión asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }
                    if (!$scope.tempBodegas.some(item => item.codEstab_Asig === dataEstab.codEstab_Asig)) {
                        tS.toastr('info', 'No tienes bodegas asignado a este establecimiento');
                        $scope.data.codEstab = $scope.dataClone.codEstab;
                        $scope.$apply();
                        return
                    }

                    //Impuesto Tarifa
                    $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                    $scope.dataTarifaImpuesto = $scope.tarifasImpuestos[0];

                    //Puntos de Emision 
                    $scope.ptosEmision = $scope.tempPuntosEmision.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);

                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.predeterminado))
                    $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                    //Bodegas 
                    $scope.bodegas = $scope.tempBodegas.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);

                    let dataBodega = $scope.bodegas.find(item => (item.predeterminado));
                    $scope.idBodega = dataBodega.idBodega;

                    $scope.dataClone.codEstab = $scope.data.codEstab;
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
                if (!$scope.data.idPuntoEmision) {
                    tS.taostr('warning', 'Seleccione el establecimiento')
                    return
                }

                let { isConfirmed } = await Swal.fire({
                    //title: 'Are you sure?',
                    text: "Está seguro de guardar el Documento de Aprobación Documnento!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar!'
                })

                if (isConfirmed) {
                    showLoader();
                    let comprobante = {
                        ...$scope.data,
                        codigoPorcentaje: $scope.dataTarifaImpuesto.codigoPorcentaje,
                        codDoc: $scope.docDestino.codDoc,
                        idCliente: $scope.cliente.idCliente,
                        fechaEmision: fS.formatDateTimeZone(this.data.fechaEmision),
                        docOrigen: $scope.docOrigen.codDoc,
                        docDestino: $scope.docDestino.codDoc,
                        total: $scope.selectedDocuments.map(item => item.total).reduce((prev, acc) => prev + acc, 0)
                    }

                    //Tarifa Aplicada al Documento
                    //jsonHeader.tarifa = this.actividadTipoIva.tarifa;

                    let tempDetail = [];
                    let orderIndex = 1;
                    for (let item of $scope.gridOptionsDetalle.data) {

                        let precioTotalSinImpuesto = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                        let obj = {
                            orderIndex: orderIndex++,
                            idAprob_Document_Detailt: 0,
                            idTarifa: item.idTarifa,
                            idArticulo: item.idArticulo,
                            idTipoIva: item.idTipoIva,
                            idMedida: item.idMedida,
                            cantidad: item.cantidad,
                            descripcion: item.descripcion,
                            precioUnitario: item.precioUnitario,
                            precioConIva: item.precioConIva,
                            valorDescuento: item.valorDescuento,
                            descuento: item.valorDescuento,
                            precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, $scope.decimal.nroTotalDetalle),
                            baseImponible: fS.roundNumber(precioTotalSinImpuesto, $scope.decimal.nroTotalDetalle),
                            codigoPorcentaje: item.codigoPorcentaje,
                            tarifa: item.tarifa
                        }
                        tempDetail.push(obj);
                    }

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
                        detalle: JSON.stringify(tempDetail),
                        historial: JSON.stringify($scope.selectedDocuments.map(item => ({
                            idDocumento: item.idDocumento,
                            serie: item.serieComprobante,
                        }))),
                        infoAdicional: JSON.stringify(infoAdicional),
                        historialVenta: JSON.stringify(historialVenta),
                    }

                    aprobacionDocSvc.save(data).then(response => {
                        hideLoader();
                        if (response.code === "0") {
                            Toast.fire({
                                icon: 'warning',
                                html: `${response.message}`
                            })
                        }
                        if (response.code === '1') {
                            hideLoader();
                            Toast.fire({
                                icon: 'success',
                                html: `${response.message}`
                            })
                            $uibModalInstance.close(response);
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    })
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
        let { comprobante, cliente, detalles, historial, infoAdicionalDocumento, datosAdicionalesArticulo } = data;

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc

        $scope.data = comprobante;
        $scope.data.fechaEmision = fS.formatDate($scope.data.fechaEmision)
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

            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => { })
        }

        initiload();

        async function initiload() {
            try {
                showLoader();
                let { establecimientos, ptosEmision, bodegas, configVenta, decimal, configDetalle, tipoIvas, tarifas, tiempoCreditos, articuloPredeterminado, clientePredeterminado, permisonVenta, permisoArticulo } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa 
                 */
                let dataEstab = establecimientos.find(item => (item.estab === $scope.data.estab))

                $scope.establecimientos = establecimientos;
                $scope.data.codEstab = dataEstab.codEstab;

                $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                $scope.dataTarifaImpuesto = $scope.tarifasImpuestos.find(item => item.codigoPorcentaje === $scope.data.codigoPorcentaje)

                //===========Puntos Emisiones==============================================
                $scope.ptosEmision = ptosEmision.filter(item => item.idPuntoEmision === $scope.data.idPuntoEmision);

                //============Bodegas=======================================================
                $scope.tempBodegas = bodegas;

                $scope.bodegas = bodegas.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);
                let dataBodega = $scope.bodegas.find(item => (item.predeterminado))
                $scope.idBodega = dataBodega.idBodega;

                //Decimal 
                $scope.decimal = decimal;

                //Config. Detalle (Mostrar/Ocultar Columnas de talle)
                $scope.configDetalle = configDetalle;

                //Tipo Ivas
                $scope.tipoIvas = tipoIvas;


                setColumnDefs();
                $scope.gridOptionsDetalle.data = await aprobacionDocSvc.detalleMapperFrom({
                    detalles,
                    fS,
                    decimal,
                    findForSale: articuloSvc.findForSale
                })

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                    items: $scope.gridOptionsDetalle.data,
                    decimal: $scope.decimal,
                    dataTarifaImpuesto: $scope.dataTarifaImpuesto
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
                field: 'enumeracion',
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
                cellEditableCondition: (scope) => scope.row.entity.llevaInventario !== true,
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
                field: 'idMedida',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity, colDef) => rowEntity.medidas.map(val => ({
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
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
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
                editDropdownOptionsFunction: (rowEntity, colDef) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
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
                visible: $scope.configDetalle.porcentajeDescuento || false,
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
                visible: $scope.configDetalle.descuento || false
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
                visible: $scope.configDetalle.totalDescuento || false
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
                // {
                //     name: 'bodega',
                //     field: 'idBodega',   
                //     enableCellEdit: true,
                //     allowCellFocus: true,
                //     enableCellEditOnFocus: true,                 
                //     editableCellTemplate: 'ui-grid/dropdownEditor',
                //     cellFilter: 'cellFilterBodega:this',
                //     editDropdownValueLabel: 'descripcion',
                //     editDropdownIdLabel: 'idBodega',                
                //     type: 'number',
                //     width: '11%',
                //     minWidth:'100'
                // }, 
            ]

            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            // let indexBodega  = this.gridOptionsDetailDocument.columnDefs.findIndex(item=>item.field==='idBodega');
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
            // this.gridOptionsDetailDocument.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;             
        }

        $scope.showHistorialDocumento = function () {
            try {
                let message = '', title = ''

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
        let { comprobante, cliente, detalles, historial, infoAdicionalDocumento, datosAdicionalesArticulo } = data;

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc;

        //params to MdAutocomplete to search article
        $scope.tipoDoc = {
            codigo: 'NE'
        }

        $scope.data = comprobante;
        $scope.data.fechaEmision = fS.formatDate($scope.data.fechaEmision)
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



       

        $scope.initiload = async function() {
            try {
                showLoader();
                let { establecimientos, ptosEmision, bodegas, configVenta, decimal, configDetalle, tipoIvas, tarifas, tiempoCreditos, articuloPredeterminado, clientePredeterminado, permisoVenta, permisoArticulo } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa 
                 */
                let dataEstab = establecimientos.find(item => (item.estab === $scope.data.estab))

                $scope.establecimientos = establecimientos;
                $scope.data.codEstab = dataEstab.codEstab;

                $scope.tarifasImpuestos = dataEstab.tarifasImpuestos;
                $scope.dataTarifaImpuesto = $scope.tarifasImpuestos.find(item => item.codigoPorcentaje === $scope.data.codigoPorcentaje)

                //===========Puntos Emisiones==============================================
                $scope.ptosEmision = ptosEmision.filter(item => item.idPuntoEmision === $scope.data.idPuntoEmision);

                //============Bodegas=======================================================
                $scope.tempBodegas = bodegas;

                $scope.bodegas = bodegas.filter(item => item.codEstab_Asig === dataEstab.codEstab_Asig);
                let dataBodega = $scope.bodegas.find(item => (item.predeterminado))
                $scope.data.idBodega = dataBodega.idBodega;

                //Decimal 
                $scope.decimal = decimal;

                //Config. Detalle (Mostrar/Ocultar Columnas de talle)
                $scope.configDetalle = configDetalle;
                
                //Tipo Ivas 
                $scope.tipoIvas = tipoIvas;

                //Tarifas(PVP1, PVP2)
                $scope.tarifas = tarifas;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;
                console.log($scope.tarifas)
                //Permisos para detalle y documento 
                let { detail, comprobante } = permisoVenta;
                $scope.permisoDetalle = Object.freeze(detail);
                $scope.permisoComprobante = Object.freeze(comprobante);


                setColumnDefs();
                $scope.gridOptionsDetalle.data = await aprobacionDocSvc.detalleMapperFrom({
                    detalles,
                    fS,
                    decimal,
                    findForSale: articuloSvc.findForSale
                })

                $scope.data = Object.assign($scope.data, gridOptionsSvc.calculoTotales({
                    items: $scope.gridOptionsDetalle.data,
                    decimal: $scope.decimal,
                    dataTarifaImpuesto: $scope.dataTarifaImpuesto
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

            const ventaDetailPermission = $scope.permisoVenta || defaultPermission;

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
                width: '6%',
                minWidth: '50',
            },
            {
                name: 'Medida',
                field: 'idMedida',
                enableCellEdit: ventaDetailPermission.medida.update,
                enableCellEditOnFocus: ventaDetailPermission.medida.update,
                allowCellFocus: ventaDetailPermission.medida.update,
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity, colDef) => rowEntity.medidas.map(val => ({
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
                enableCellEdit: ventaDetailPermission.tipoIva.update,
                allowCellFocus: ventaDetailPermission.tipoIva.update,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva.update,
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
                editDropdownOptionsFunction: (rowEntity, colDef) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
                enableCellEdit: ventaDetailPermission.tarifa.update,
                enableCellEditOnFocus: ventaDetailPermission.tarifa.update,
                allowCellFocus: ventaDetailPermission.tarifa.update,
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
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario.update : true;
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
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva.update : true;
                },
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: ventaDetailPermission.porcentajeDescuento.update,
                allowCellFocus: ventaDetailPermission.porcentajeDescuento.update,
                enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento.update,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: $scope.configDetalle.porcentajeDescuento || false,
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento.update,
                enableCellEditOnFocus: ventaDetailPermission.descuento.update,
                allowCellFocus: ventaDetailPermission.descuento.update,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: $scope.configDetalle.descuento || false
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
                visible: $scope.configDetalle.totalDescuento || false
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
                // {
                //     name: 'bodega',
                //     field: 'idBodega',   
                //     enableCellEdit: true,
                //     allowCellFocus: true,
                //     enableCellEditOnFocus: true,                 
                //     editableCellTemplate: 'ui-grid/dropdownEditor',
                //     cellFilter: 'cellFilterBodega:this',
                //     editDropdownValueLabel: 'descripcion',
                //     editDropdownIdLabel: 'idBodega',                
                //     type: 'number',
                //     width: '11%',
                //     minWidth:'100'
                // }, 
            ]

            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            // let indexBodega  = this.gridOptionsDetailDocument.columnDefs.findIndex(item=>item.field==='idBodega');
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tipoIvas;
            // this.gridOptionsDetailDocument.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;             
        }


        $scope.onChangeTarifaGeneral = async function () {            
			if (!$scope.permisoComprobante.tarifa.update) {
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
        $scope.indexRowDetalle =null;

        //Recibe datos de buscador articulo cuando seleccionan articulo
        $scope.setItemArticuloEnDetalle = function(dataArticulo) {

            try {
               console.log($scope.indexRowDetalle)
                const {articulo, medidas, datosAdicionalesArticulo } = dataArticulo;
                let dataMedida = medidas[0];

                if([null, undefined].includes($scope.indexRowDetalle)){
                    $scope.gridOptionsDetalle.data.push(aprobacionDocSvc.addRow());
                    $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.findIndex(value => value.idArticulo === 0);

                }

                let entity =  $scope.gridOptionsDetalle.data[$scope.indexRowDetalle];

                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;


                //Aplica a establecimiento que llevan actividad de Tipo Alojamiento
                if ($scope.dataTarifaImpuesto.codigoPorcentaje === '8' && articulo.codigoPorcentaje === '2') {

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

                entity.articuloTarifas = JSON.parse(dataMedida.tarifas);
                let tarifa = entity.articuloTarifas.find(item => item.idTarifa === $scope.data.idTarifa);
                entity.idTarifa = $scope.data.idTarifa;
                entity.precioUnitario = fS.roundNumber(tarifa.precioVenta, $scope.decimal.nroPrecio);
                entity.precioConIva = fS.roundNumber(tarifa.precioConIva, $scope.decimal.nroPrecio);

                $scope.setCalculoTotales('precioUnitario', entity, 0);

                // const objCalculo = self.uiGridInvoice.calculoColDef(entity, 0);

                // objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();

                // objCalculo["calculoTotalDetalle"]();

                // self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

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
                dataTarifaImpuesto: $scope.dataTarifaImpuesto
            }))

			$scope.dataClone.porcentajeDescuento = $scope.data.porcentajeDescuento;
			$scope.dataClone.totalDescuento = $scope.data.totalDescuento;
		}

        $scope.focusColumnCantidad = function(articulo) {
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
        

        $scope.askToDeleteRow = async function(rowEntity) {            
            try {
                $scope.indexRowDetalle = null;
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);        
    
                if(isConfirmed) {
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

        $scope.openModalArticulo = function(item) {
            $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.indexOf(item);
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptionsDetalle.data[0],
                $scope.gridOptionsDetalle.columnDefs[1]
            )
            $scope.$broadcast("editArticulo", item)
        }

        
        $scope.resultModalAdicional = function(result) {
            let {entity, historyDatosAdicionales} = result;
            $scope.historyDatosAdicionales = historyDatosAdicionales;
        }


        $scope.askToSave = function() {
            try { 
                
                if (!$scope.data.codEstab) {
                    tS.toastr('warning','Seleccione el Establecimiento')                  
                    return
                }
    
                if (!($scope.cliente.idCliente>0)) {
                    tS.toastr('warning','Seleccione el Cliente')                                                   
                    return
                }
    
                if (!($scope.data.idPuntoEmision>0)) {
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
                  
                Swal.fire({
                    // title: 'Are you sure?',
                    html: `<small>Esta Ud. seguro de <b>${actualizar}</b> este Aprobación Documento <b>N° ${$scope.data.serieComprobante}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, actualizar!',
                    cancelButtonText: 'No, cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                                             
                    }
                })
                
                  
                
                console.log()
                // const swalWithBootstrapButtons = Swal.mixin({
                //     customClass: {
                //         confirmButton: 'btn btn-success',
                //         cancelButton: 'btn btn-danger m-l-5'
                //     },
                //     buttonsStyling: false
                // })
    
                // const {
                //     isConfirmed
                // } = await swalWithBootstrapButtons.fire({
                //     html: `<small>Esta Ud. seguro de <b>${textAccion}</b> este Aprobación <b>N° ${this.data.serie}</b></small>?`,
                //     icon: 'warning',
                //     showCancelButton: true,
                //     confirmButtonText: `<small><i class='ti-pencil'></i> Sí, ${textAccion}!</small>`,
                //     cancelButtonText: '<small>&times; No, cancelar!</small>',
                //     reverseButtons: false,
                //     allowOutsideClick: false,
                //     focusConfirm: true
                // })
    
    
                // if (isConfirmed) {
                //     showLoader();
    
                //     const jsonHeader = {
                //         ...this.data,
                //         totalSinImpuestos: this.data.subTotalSinImpuestos,
                //         totalConImpuestos: this.data.total,
                //         importeTotal: this.data.total,
                //         fechaEmision: this._fS.formatDateTimeZone(this.data.fechaEmision, "YYYY-MM-DD h:mm A"),
                //     }
    
                //     //Tarifa Aplicada al Documento
                //     jsonHeader.tarifa = this.uiGridInvoice.actividadTipoIva.tarifa;
                //     jsonHeader.codigoPorcentaje = this.uiGridInvoice.actividadTipoIva.codigoPorcentaje;
    
                //     let tempDetail = [];
                //     let orderIndex = 1;
                //     for (let item of this.gridOptionsDetailDocument.data) {
                //         const precioTotalSinImpuesto = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                //         const obj = {
                //             orderIndex: orderIndex++,
                //             idAprob_Document_Detailt: item.idAprob_Document_Detailt,
                //             idTarifa: item.idTarifa,
                //             idArticulo: item.idArticulo,
                //             idTipoIva: item.idTipoIva,
                //             idMedida: item.idMedida,
                //             cantidad: item.cantidad,
                //             descripcion: item.descripcion,
                //             precioUnitario: item.precioUnitario,
                //             precioConIva: item.precioConIva,
                //             valorDescuento: item.valorDescuento,
                //             descuento: item.valorDescuento,
                //             precioTotalSinImpuesto: this._fS.roundNumber(precioTotalSinImpuesto, this.decimal.nroTotalDetalle),
                //             baseImponible: this._fS.roundNumber(precioTotalSinImpuesto, this.decimal.nroTotalDetalle),
                //             nota: item.nota,
                //             codigoPorcentaje: item.codigoPorcentaje,
                //             tarifa: item.tarifa
                //         }
                //         tempDetail.push(obj);
                //     }
    
                //     const data = {
                //         comprobante: JSON.stringify(jsonHeader),
                //         detalle: JSON.stringify(tempDetail),
                //         historialVenta: JSON.stringify(this.historyDatosAdicionales)
                //     }
                //     console.log(this.TIPO_DOC_FV)
    
                //     this.aprobacionDocSvc.update(this.data.idAprob_Document, data).then(response => {
                //         if (response.code === "0") {
                //             hideLoader();
                //             this._fS.sweetAlert('warning', response.message);
                //         }
                //         if (response.code === '1') {
                //             hideLoader();
                //             this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                //             this.$uibModalInstance.close(response);
                //         }
                //     }).catch(error => {
                //         hideLoader();
                //         console.log(error)
                //     })
                // }
            } catch (error) {
                hideLoader();
                console.trace(error)
            }
        }
    




        $scope.closeModal = function () {
            $uibModalInstance.close()
        }
    }

})(window.angular)