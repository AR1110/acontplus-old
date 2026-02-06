//@ts-check
(function () {

    'use strict';

    //Variables Constantes
    const URL_TEMPLATE = '~/Pages/AprobacionDocumento/'

    //Variable servicios
    let tS = {};
    let fS = {};
    let commonSvc = {};
    let aprobacionDocSvc = {};
    let notaEntregaSvc = {};
    let facturaSvc = {};
    let gridOptionsSvc = {};

    let mainDataForm = {};
    let DOC_TYPE = {}
    let SRI_IDENTIFITION_CODE = {}

    app.controller('aprobacionDocumentoCtrl', aprobacionDocumentoCtrl);

    aprobacionDocumentoCtrl.$inject = ['$scope', '$injector', 'modalService'];

    function aprobacionDocumentoCtrl($scope, $injector, modalSvc) {

        //Injection Services
        commonSvc = $injector.get('commonService');
        aprobacionDocSvc = $injector.get('aprobacionDocService');
        notaEntregaSvc = $injector.get('notaEntregaService');
        facturaSvc = $injector.get('facturaService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');
        gridOptionsSvc = $injector.get('gridOptionsService');
        DOC_TYPE = $injector.get('DOC_TYPE');
        SRI_IDENTIFITION_CODE = $injector.get('SRI_IDENTIFITION_CODE');
        const CODE_REPORT = $injector.get('CODE_REPORT');
        const DECODE_TOKEN = $injector.get("decodeToken");
        const policyService = $injector.get('PolicyService');



        $scope.dataSource = [];

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.moreSearchOptions = false;
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            maxSize: 5,
            totalRecords: 0,
            checkBoxFecha: true
        }

        $scope.estadoDocumentos = [];

        $scope.cliente = {

        }


        $scope.dataUserSearch = {}


        $scope.refresh = list;
        $scope.openModalNew = openModalNew;
        $scope.getStatusClass = getStatusClass;



        function openModalNew() {
            modalSvc.openWithComponent({
                component: 'modalAprobacionSeleccionarDoc',
                size: 'xl',
                windowClass: 'uibModalFullScreen',
                params: {
                    mainDataForm
                }
            }).result.then(result => {
                if (result && typeof result === 'object') {
                    $scope.refresh();
                }
            })


        }


        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate
            $scope.refresh();
        }

        $scope.onKeyupCliente = function () {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.byCliente = 0;
            }
        }

        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.byCliente = item.idCliente;
            $scope.refresh();
        }

        $scope.onKeyupUsuarioSearch = function () {
            if (!$scope.dataUserSearch.name) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            $scope.refresh()
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }


        //=====================Eend Filters=======================

        $scope.calculoColumnTotal = function () {
            let total = $scope.dataSource.reduce((prev, acc) => prev + acc.total, 0)
            $scope.total = fS.roundNumber(total, 2)
        }



        initiload();
        function initiload() {
            try {

                aprobacionDocSvc.filterData().then(response => {
                    $scope.establecimientos = response.estabs;
                    $scope.estadoDocumentos = response.estadoDocs;
                    if ($scope.establecimientos.length > 0) {
                        $scope.dataSearch.codEstab = $scope.establecimientos.find(item => (item.defaultEstab)).codEstab;
                        list();
                    } else {
                        tS.toastr('warning', 'No tienes asignado Establecimiento!')
                    }
                })

                aprobacionDocSvc.getFormData().then(response => {
                    mainDataForm = response;
                })

            } catch (error) {
                console.log(error);
            }
        }

        function list() {
            try {
                let checkBoxFecha = $scope.dataSearch.checkBoxFecha;
                if ($scope.dataSearch.nroSecuencial) {
                    if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
                        tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                        return
                    }
                    tS.toastr({
                        type: 'info',
                        message: 'Buscando por número secuencial'
                    })
                    checkBoxFecha = false;
                }

                $scope.aprobComprobantes = [];
                let dataSearch = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: $scope.dataSearch.codEstab,
                    byCliente: $scope.dataSearch.byCliente,
                    checkBoxFecha,
                    byUsuario: $scope.dataSearch.byUsuario,
                    byEstado: ["", 0, null, undefined].includes($scope.dataSearch.byEstado) ? null : $scope.dataSearch.byEstado,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
                }


                $scope.dataSource = [];
                setColumnTotal();

                aprobacionDocSvc.list(dataSearch).then(response => {
                    $scope.dataSource = response.data;
                    $scope.dataSearch.totalRecords = response.totalRecords;
                    setColumnTotal();
                })
            } catch (error) {
                console.log(error)
            }
        }

        function setColumnTotal() {
            const total = $scope.dataSource.reduce((prev, acc) => prev + acc.total, 0)
            $scope.total = fS.roundNumber(total, 2)
        }


        $scope.pageChanged = function () {
            $scope.refresh();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.refresh();
        };



        $scope.showBtnApprove = (item) => {
            return !['APR', 'A'].includes(item.codEstado)
        }

        $scope.showBtnEditar = (item) => {
            return !['APR', 'A'].includes(item.codEstado)
        }

        $scope.showBtnDelete = (item) => {
            return !['APR', 'A'].includes(item.codEstado)
        }

        function getStatusClass(codigo) {
            if (!codigo) return '';


            switch (codigo.toUpperCase()) {
                case 'A':
                    return 'table-danger';
                case 'APR':
                    return 'table-success';
                default:
                    return '';
            }
        }

        /**
         * =========Detalle Documento Aprobacion
         * @param {*} item
         */

        $scope.openModalDetalle = function (item) {
            try {
                aprobacionDocSvc.getDetalle(item.id).then(response => {
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
                })
            } catch (error) {
                console.log(error)
            }
        }


        /**
         * =========Editar Documento Aprobacion
         * @param {*} item
         */
        $scope.openModalEdit = function (item) {
            try {
                aprobacionDocSvc.getId(item.id).then(response => {
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
                        if (result && typeof result === 'object') {
                            $scope.refresh();
                        }
                    })
                })
            } catch (error) {
                console.log(error)
            }

        }


        $scope.openModalAprobarDoc = async (item) => {

            try {
                if (item.docDestino === DOC_TYPE.FV_SRI) {
                    await policyService.sendMaxDocuments();
                }


                aprobacionDocSvc.getId(item.id).then(response => {
                    let modalRef = modalSvc.open({
                        controller: 'ModalApproveDocCtrl',
                        template: URL_TEMPLATE + '_ModalAprobacionDocumento.cshtml',
                        size: 'xl',

                        windowClass: 'uibModalFullScreen',
                        params: {
                            docOrigenDesc: item.docOrigenDesc,
                            docDestinoDesc: item.docDestinoDesc,
                            data: response,
                            mainDataForm
                        },
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.refresh();
                        }
                    })
                })
            } catch (error) {
                console.log(error)
            }

        }


        $scope.askToDelete = async (item) => {
            try {
                let { isConfirmed } = await Swal.fire({
                    title: 'Anular Aprobación?',
                    html: `<small>Esta seguro de Anular este Documento Nro. <b>${item.serieDoc}</b>!</small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                })

                if (!isConfirmed) return;
                aprobacionDocSvc.anular(item.id).then(response => {
                    if (response.code === '0') {
                        fS.sweetAlert('warning', response.message);
                    }
                    if (response.code === '1') {
                        fS.sweetAlert('success', response.message);
                        $scope.refresh();
                    }
                })

            } catch (error) {
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
                    codigo = CODE_REPORT.PRE_F
                }
                if (item.docDestino === DOC_TYPE.NE) {
                    codigo = CODE_REPORT.P_NE
                }

                let format = 'pdf';
                let dataParms = {
                    id: item.id,
                    codEstab: item.codEstab,
                    codDoc: item.docDestino,
                    tipo: 1
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

        $scope.getReportHistorial = function (item) {
            try {

                let format = 'pdf';
                let dataParms = {
                    id: item.id,
                    codEstab: item.codEstab,
                    codDoc: item.docDestino,
                    tipo: 2
                }

                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: "RHA",
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

        $scope.getReportAprobTracking = function () {
            try {

                let format = 'excel';
                let dataParms = {
                    userRoleId: DECODE_TOKEN.userRoleId,
                    tipo: 3,
                    codEstab: $scope.dataSearch.codEstab,
                    byCliente: $scope.dataSearch.byCliente,
                    checkBoxFecha: true,
                    byUsuario: $scope.dataSearch.byUsuario,
                    byEstado: ["", 0, null, undefined].includes($scope.dataSearch.byEstado) ? null : $scope.dataSearch.byEstado,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
                }

                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: "RAPTR",
                        codEstab: $scope.dataSearch.codEstab,
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
     * =========================MODAL-EDITAR-APROBACION DOCUMENTO
     */

    app.controller('ModalAprobDocEditarCtrl', ModalAprobDocEditarCtrl);

    ModalAprobDocEditarCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', '$injector', 'articuloService', 'params']

    function ModalAprobDocEditarCtrl($scope, $uibModalInstance, $timeout, $injector, articuloSvc, params) {
        let pricingUtils = $injector.get('pricingUtils');
        let clienteSvc = $injector.get('clienteService');

        let { docOrigenDesc, docDestinoDesc, data } = params
        let { comprobante, cliente, detalles, datosAdicionalesArticulo } = data;

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc;

        $scope.vendedores = [];
        $scope.config = {};

        //params to MdAutocomplete to search article
        $scope.tipoDoc = {
            codigo: 'NE'
        }

        $scope.data = comprobante;

        // let formattedDateTime = moment($scope.data.fechaEmision).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss");
        //  $scope.data.fechaEmision = new Date(formattedDateTime)
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

                if (colDef.field === "idMedida" && rowEntity.idMedida == oldValue) return
                if (colDef.field === "cantidad" && rowEntity.cantidad == oldValue) return

                //Verificacion del stock
                if (["idMedida", "cantidad"].includes(colDef.field)) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }
                // if (colDef.field === 'cantidad' && rowEntity.cantidad !== oldValue) {
                //     checkNotificationStock(colDef.field, rowEntity, oldValue);
                //     return
                // }
                if (colDef.field === 'idBodega' && rowEntity.idBodega !== oldValue) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }

                $scope.setCalculoTotales(colDef.field, rowEntity, oldValue);

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

                // Si la fila no lleva inventario, realiza cálculos totales y termina la función.
                if (!rowEntity.llevaInventario) {
                    $scope.setCalculoTotales(field, rowEntity, oldValue);
                    return;
                }

                // Clona el objeto de la fila y la lista de artículos para evitar modificaciones directas.
                let rowItemClone = structuredClone(rowEntity);
                let gridOptionsClone = structuredClone($scope.gridOptionsDetalle.data);

                // Realiza la fusión de elementos en la lista de artículos clonada.
                let dataItemMerge = fS.mergeItemStock(gridOptionsClone, rowItemClone);

                // Si la cantidad no ha cambiado, no realizar más acciones.
                if (dataItemMerge.cantidad == oldValue) return;


                // Llama a un servicio para verificar la notificación de stock.
                let cantidadStock = fS.getCantidadStock(dataItemMerge, $scope.data.fechaEmision);
                if (cantidadStock === 0) {
                    $scope.setCalculoTotales(field, rowEntity, oldValue);
                    return;
                }


                articuloSvc.checkNotificationStock({
                    idArticulo: rowEntity.idArticulo,
                    cantidad: cantidadStock,
                    idBodega: rowEntity.idBodega,
                    idMedida: rowEntity.idMedida
                }).then(async responseApi => {

                    let { code, message, titleSms } = responseApi;
                    if (code === "1") {

                        $scope.setCalculoTotales(field, rowEntity, oldValue);
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
                            $scope.setCalculoTotales(field, rowEntity, oldValue);
                            $("#custom-template-md-autocomplete-articulo").focus();
                        }
                        if (code === "2") {
                            $scope.setCalculoTotales(field, rowEntity, oldValue);
                        }
                    }

                })

            } catch (error) {
                console.log(error);
            }
        }


        function drawImpuestoTotales() {
            try {
                const getTotals = gridOptionsSvc.getImpuestoTotales({
                    items: $scope.gridOptionsDetalle.data,
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
                } = getTotals;
                const htmlTemplate = gridOptionsSvc.impuestoTotalesHtml(getTotals);

                drawElementHTMLTotals(htmlTemplate)

                $scope.data.subTotalSinImpuestos = subTotalSinImpuestos;
                $scope.data.total = importeTotal;
                $scope.data.totalDescuento = totalDescuento;
                $scope.data.porcentajeDescuento = porcentajeDescuento;
                $scope.data.irbpnr = irbpnr
                $scope.data.propina = propina;
            } catch (error) {
                console.log(error);
            }
        }

        function calculateTotalItems(items) {
            return items.map(item => {

                let totalAntesDescuento = pricingUtils.calcularTotalAntesDescuento(item.precioUnitario, item.cantidad);
                let porcentajeDescuento = pricingUtils.getPorcentajeDescuento(totalAntesDescuento, item.valorDescuento);

                let total = item.precioTotalSinImpuesto + item.valorImpuesto;
                return {
                    ...item,
                    precioConIva: fS.roundNumber(item.precioConIva, $scope.decimal.nroPrecio),
                    total: fS.roundNumber(total, $scope.decimal.nroTotalDetalle),
                    porcentajeDescuento: fS.roundNumber(porcentajeDescuento, $scope.decimal.nroPorcentaje)
                }

            })
        }



        initiload();
        function initiload() {
            try {
                let {
                    estabs,
                    tarifasImpuesto,
                    // tiemposCredito,
                    tarifas,
                    permisoVenta,
                    decimal,
                    vendedores,
                    config
                } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa
                */
                $scope.establecimientos = estabs;
                let puntosEmisionMerge = $scope.establecimientos.flatMap((dt) => dt.puntosEmision);
                let codEstab = puntosEmisionMerge.find((dt) => dt.idPuntoEmision === $scope.data.idPuntoEmision).codEstab;

                let dataEstab = $scope.establecimientos.find(item => (item.codEstab === codEstab))

                $scope.data.codEstab = dataEstab.codEstab;

                //===========Puntos Emisiones==============================================
                $scope.ptosEmision = dataEstab.puntosEmision;
                //============Bodegas=======================================================
                $scope.bodegas = dataEstab.bodegas;
                let dataBodega = $scope.bodegas.find(item => (item.defaultBodega))
                $scope.data.idBodega = dataBodega.idBodega;

                //Decimal
                $scope.decimal = decimal;

                //Tipo Ivas
                $scope.tarifasImpuesto = tarifasImpuesto;

                //Tarifas(PVP1, PVP2)
                $scope.tarifas = tarifas;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;

                //Permisos para detalle y documento
                $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                $scope.permisoDetalleVenta = permisoVenta.detalle;

                $scope.vendedores = vendedores;
                $scope.config = config;


                setColumnDefs();
                $scope.gridOptionsDetalle.data = calculateTotalItems(detalles);
                $uibModalInstance.rendered.then(() => {
                    drawImpuestoTotales();
                })
            } catch (error) {

                console.log(error);
            }
        }

        function setColumnDefs() {

            const ventaDetailPermission = $scope.permisoDetalleVenta

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
                name: 'cód.',
                field: 'codigo',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '8%',
                minWidth: '100'
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

            let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
            let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
            $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
        }

        $scope.onSelectedClienteChange = async function (item) {
            try {

                let dataCliente = await clienteSvc.findById(item.idCliente);
                $scope.cliente = dataCliente;

                $scope.$apply();


            } catch (error) {
                $scope.cliente = {};
                console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
                $scope.$apply();
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


                let index = 0, entity = {}, cantidad = 0;


                //verificar si hay un articulo que lleva inventario mas de uno
                let itemsDuplicated = $scope.gridOptionsDetalle.data.filter(item => (
                    item.llevaInventario && item.idArticulo === articulo.idArticulo
                ))


                let findIndexById = $scope.gridOptionsDetalle.data.findIndex(
                    item => item.llevaInventario && item.idArticulo === articulo.idArticulo
                );

                if ($scope.config.detailDuplicate) {
                    $scope.gridOptionsDetalle.data.push(aprobacionDocSvc.addRow());
                    index = $scope.gridOptionsDetalle.data.length - 1;
                    entity = $scope.gridOptionsDetalle.data[index];
                    entity.cantidad = 1;
                } else {

                    if (itemsDuplicated.length > 1) {
                        fS.sweetAlert('warning', `El elemento ${articulo.descripcion} aparece más de una vez en el detalle.`);
                        return
                    }

                    if (findIndexById === -1) {
                        $scope.gridOptionsDetalle.data.push(aprobacionDocSvc.addRow());
                        index = $scope.gridOptionsDetalle.data.length - 1;
                        entity = $scope.gridOptionsDetalle.data[index];
                        entity.cantidad = 1;
                    } else {
                        index = findIndexById;
                        entity = $scope.gridOptionsDetalle.data[index];
                        cantidad = entity.cantidad;
                        entity.cantidad = cantidad + 1;
                    }
                }

                let dataMedida = medidas.find(medida => (medida.defaultMedida));

                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;


                let dataImpuestoTarifa = $scope.tarifasImpuesto.find(item => item.codigoPorcentaje === articulo.codigoPorcentaje);
                entity.idImpuesto = dataImpuestoTarifa.idImpuesto;
                entity.idTipoIva = dataImpuestoTarifa.idTipoIva;
                entity.codigoPorcentaje = dataImpuestoTarifa.codigoPorcentaje;
                entity.tarifa = dataImpuestoTarifa.tarifa;

                // entity.nombreTipoIva        = articulo.nombreTipoIva;
                entity.ice = articulo.valorIce;
                entity.idBodega = $scope.data.idBodega > 0 ? $scope.data.idBodega : 0;
                entity.llevaInventario = articulo.llevaInventario;
                entity.datosAdicionales = articulo.datosAdicionales;
                entity.productoFraccionable = articulo.productoFraccionable;
                entity.medidas = medidas; //Lista Medida
                entity.idMedida = dataMedida.idMedida; //Medida por defecto
                entity.precioCosto = dataMedida.precioCosto;
                entity.productoFraccionado = dataMedida.productoFraccionado;


                //Datos Adicionales
                entity.datosAdicionalesArticulo = datosAdicionalesArticulo; //

                entity.articuloTarifas = dataMedida.tarifas;
                let tarifa = entity.articuloTarifas.find(item => item.idTarifa === $scope.data.idTarifa);
                entity.idTarifa = $scope.data.idTarifa;
                entity.precioSinSubsidio = articulo.precioSinSubsidio;
                entity.precioUnitario = fS.roundNumber(tarifa.precioVenta, $scope.decimal.nroPrecio);
                entity.precioConIva = fS.roundNumber(tarifa.precioConIva, $scope.decimal.nroPrecio);

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
            drawImpuestoTotales();
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


        let detallesDeleted = [];
        $scope.askToDeleteRow = async function (rowEntity) {
            try {
                $scope.indexRowDetalle = null;
                let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

                if (isConfirmed) {
                    let index = $scope.gridOptionsDetalle.data.indexOf(rowEntity);
                    $scope.gridOptionsDetalle.data.splice(index, 1);

                    if (rowEntity.idAprob_Document_Detailt > 0) {
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


        function isValidTotals() {
            const getTotals = gridOptionsSvc.getImpuestoTotales({
                items: $scope.gridOptionsDetalle.data,
                decimal: $scope.decimal,
                tarifasImpuesto: $scope.tarifasImpuesto.slice(),
            });
            let {
                subTotalSinImpuestos,
                importeTotal,
                totalDescuento,
            } = getTotals;



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


        $scope.askToSave = async function () {
            try {
                if (!isValidTotals()) return

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

                if (!($scope.data.idUsuario > 0)) {
                    tS.toastr('warning', 'Seleccione el usuario')
                    return
                }
                if (!fS.isValidDate($scope.data.fechaEmision)) {
                    tS.toastr('warning', 'Ingrese la fecha de emisióm correctamente')
                    return
                }

                if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
                    tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
                    return
                }

                let ajusteFechaEmision = fS.ajustarFechaEmision(true, $scope.data.fechaEmision, $scope.data.fechaEmisionDocCreado);

                if (ajusteFechaEmision) {
                    $scope.data.fechaEmision = ajusteFechaEmision;
                } else {
                    console.log('Error al justar la fecha de Emisión')
                    return
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
                    const comprobante = {
                        ...$scope.data,
                        idCliente: $scope.cliente.idCliente,
                        totalSinImpuestos: $scope.data.subTotalSinImpuestos,
                        totalConImpuestos: $scope.data.total,
                        importeTotal: $scope.data.total,
                        fechaEmision: $scope.data.fechaEmision,
                    }
                    //Tarifa Aplicada al Documento
                    let detalles = $scope.gridOptionsDetalle.data.map(item => ({
                        ...item,
                        fechaEmision: item.idAprob_Document_Detailt > 0 ? item.fechaEmision : $scope.data.fechaEmision
                    }))

                    const data = {
                        comprobante: comprobante,
                        detalles: detalles,
                        infoAdicionalDocumento: [],
                        selectedDocshistorial: [],
                        historyDatosAdicionales: $scope.historyDatosAdicionales,
                        detallesDeleted: detallesDeleted
                    }


                    aprobacionDocSvc.update($scope.data.idAprob_Document, data).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message);
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            setTimeout(() => {
                                $uibModalInstance.close(response);
                            }, 1000)

                        }
                    })
                }

            } catch (error) {
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
    ModalApproveDocCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'articuloService', 'params', 'docElectService']

    function ModalApproveDocCtrl($scope, $uibModalInstance, $timeout, articuloSvc, params, docElectSvc) {


        let { docOrigenDesc, docDestinoDesc, data } = params
        let { comprobante, cliente, detalles, datosAdicionalesArticulo, formasPago, config } = data;

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc;

        $scope.data = {
          ...comprobante,
          fechaEmision: new Date()
        };

        $scope.mostrarFormasPago = $scope.data.docDestino === DOC_TYPE.FV_SRI;

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

        $scope.config = {};
        $scope.vendedores = [];

        $scope.infoAdicionalDocumento = [];

        $scope.formasPago = formasPago;
        $scope.config = config;

        $scope.dataFormaPago = {
            idFormaPagoSri: 0,
            idTiempoCredito: 0,
            plazo: 1,
            total: 0
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
                if (["idMedida", "cantidad"].includes(colDef.field)) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }
                // if (colDef.field === 'cantidad' && rowEntity.cantidad !== oldValue) {
                //     checkNotificationStock(colDef.field, rowEntity, oldValue);
                //     return
                // }
                if (colDef.field === 'idBodega' && rowEntity.idBodega !== oldValue) {
                    checkNotificationStock(colDef.field, rowEntity, oldValue);
                    return
                }

                $scope.setCalculoTotales(colDef.field, rowEntity, oldValue);

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

                // Si la fila no lleva inventario, realiza cálculos totales y termina la función.
                if (!rowEntity.llevaInventario) {
                    $scope.setCalculoTotales(field, rowEntity, oldValue);
                    return;
                }

                // Clona el objeto de la fila y la lista de artículos para evitar modificaciones directas.
                let rowItemClone = structuredClone(rowEntity);
                let gridOptionsClone = structuredClone($scope.gridOptionsDetalle.data);

                // Realiza la fusión de elementos en la lista de artículos clonada.
                let dataItemMerge = fS.mergeItemStock(gridOptionsClone, rowItemClone);

                // Si la cantidad no ha cambiado, no realizar más acciones.
                if (dataItemMerge.cantidad == oldValue) return;



                // Llama a un servicio para verificar la notificación de stock.

                let cantidadStock = fS.getCantidadStock(dataItemMerge, $scope.data.fechaEmision);
                if (cantidadStock === 0) {
                    $scope.setCalculoTotales(field, rowEntity, oldValue);
                    return;
                }

                articuloSvc.checkNotificationStock({
                    idArticulo: rowEntity.idArticulo,
                    cantidad: cantidadStock,
                    idBodega: rowEntity.idBodega,
                    idMedida: rowEntity.idMedida
                }).then(async responseApi => {
                    let { code, message, titleSms } = responseApi;
                    if (code === "1") {

                        $scope.setCalculoTotales(field, rowEntity, oldValue);
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
                            $scope.setCalculoTotales(field, rowEntity, oldValue);
                            $("#custom-template-md-autocomplete-articulo").focus();
                        }
                        if (code === "2") {
                            $scope.setCalculoTotales(field, rowEntity, oldValue);
                        }
                    }

                })

            } catch (error) {
                console.log(error);
            }
        }




        function calculateTotalItems(items) {
            return items.map(item => {
                let porcentajeDescuento = item.precioUnitario === 0 ? 0 : (item.valorDescuento / item.precioUnitario) * 100;
                let total = item.precioTotalSinImpuesto + item.valorImpuesto;
                return {
                    ...item,
                    precioConIva: fS.roundNumber(item.precioConIva, $scope.decimal.nroPrecio),
                    total: fS.roundNumber(total, 5),
                    porcentajeDescuento: fS.roundNumber(porcentajeDescuento, $scope.decimal.nroPorcentaje)
                }

            })
        }



        $scope.initiload = async function () {
            try {

                let {
                    estabs,

                    tarifasImpuesto,
                    tiemposCredito,
                    tarifas,
                    permisoVenta,
                    decimal,
                    vendedores,
                    config
                } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa
                 */
                $scope.establecimientos = estabs;
                const codEstab = $scope.establecimientos.flatMap((dt) => dt.puntosEmision).find((dt) => dt.idPuntoEmision === $scope.data.idPuntoEmision).codEstab;

                let dataEstab = $scope.establecimientos.find(item => (item.codEstab === codEstab))

                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataClone.codEstab = $scope.data.codEstab;


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
                $scope.tarifasImpuesto = tarifasImpuesto;

                //Tarifas(PVP1, PVP2)
                $scope.tarifas = tarifas;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;

                $scope.tiempoCreditos = tiemposCredito;
                if ($scope.tiempoCreditos.length > 0) {
                    let dataTiempoCredito = $scope.tiempoCreditos[0];
                    $scope.data.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.dataClone.idTiempoCredito = $scope.data.idTiempoCredito;

                    //Formas Pago
                    $scope.dataFormaPago.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.dataFormaPago.plazo = dataTiempoCredito.diasCredito;
                }

                //Por defecto tomamos SIN UTILIZACION DEL SISTEMA FINANCIERO
                if ($scope.formasPago.length > 0) {
                    setDataFormaPagoSri();
                }

                //Permisos para detalle y documento
                $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                $scope.permisoDetalleVenta = permisoVenta.detalle;

                //Vendedores-usuarios
                $scope.vendedores = vendedores;
                $scope.config = config;



                setColumnDefs();
                $scope.gridOptionsDetalle.data = calculateTotalItems(detalles);
                getFechaVencimiento();

                $uibModalInstance.rendered.then(() => {
                    drawImpuestoTotales();
                })
            } catch (error) {
                console.log(error);
            }
        }

        $scope.initiload();

        function setColumnDefs() {

            const ventaDetailPermission = $scope.permisoDetalleVenta

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

                // var formattedDateTime = moment(fechaVencimiento).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss");

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
            $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
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

                let index = 0, entity = {}, cantidad = 0;

                //verificar si hay un articulo que lleva inventario mas de uno
                let itemsDuplicated = $scope.gridOptionsDetalle.data.filter(item => (
                    item.llevaInventario && item.idArticulo === articulo.idArticulo
                ))


                let findIndexById = $scope.gridOptionsDetalle.data.findIndex(
                    item => item.llevaInventario && item.idArticulo === articulo.idArticulo
                );

                if ($scope.config.detailDuplicate) {
                    $scope.gridOptionsDetalle.data.push(aprobacionDocSvc.addRow());
                    index = $scope.gridOptionsDetalle.data.length - 1;
                    entity = $scope.gridOptionsDetalle.data[index];
                    entity.cantidad = 1;
                } else {

                    if (itemsDuplicated.length > 1) {
                        fS.sweetAlert('warning', `El elemento ${articulo.descripcion} aparece más de una vez en el detalle.`);
                        return
                    }

                    if (findIndexById === -1) {
                        $scope.gridOptionsDetalle.data.push(aprobacionDocSvc.addRow());
                        index = $scope.gridOptionsDetalle.data.length - 1;
                        entity = $scope.gridOptionsDetalle.data[index];
                        entity.cantidad = 1;
                    } else {
                        index = findIndexById;
                        entity = $scope.gridOptionsDetalle.data[index];
                        cantidad = entity.cantidad;
                        entity.cantidad = cantidad + 1;
                    }
                }


                let dataMedida = medidas.find(medida => (medida.defaultMedida));

                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;


                //Aplica a establecimiento que llevan actividad de Tipo Alojamiento
                // if ($scope.dataTarifaImpuesto.codigoPorcentaje === TAX_RATE_CODE.DIFFERENTIATED_TAX
                //     && articulo.codigoPorcentaje === TAX_RATE_CODE.TWELVE_PERCENT) {

                //     let dataImpuestoTarifa = $scope.tarifasImpuesto.find(item => item.codigoPorcentaje === $scope.dataTarifaImpuesto.codigoPorcentaje);
                //     entity.idTipoIva = dataImpuestoTarifa.idTipoIva;
                //     entity.codigoPorcentaje = dataImpuestoTarifa.codigoPorcentaje;
                //     entity.tarifa = dataImpuestoTarifa.tarifa;

                // } else {
                //     entity.idTipoIva = articulo.idTipoIva;
                //     entity.codigoPorcentaje = articulo.codigoPorcentaje;
                //     entity.tarifa = articulo.tarifa;

                // }

                let dataImpuestoTarifa = $scope.tarifasImpuesto.find(item => item.codigoPorcentaje === articulo.codigoPorcentaje);
                entity.idImpuesto = dataImpuestoTarifa.idImpuesto;
                entity.idTipoIva = dataImpuestoTarifa.idTipoIva;
                entity.codigoPorcentaje = dataImpuestoTarifa.codigoPorcentaje;
                entity.tarifa = dataImpuestoTarifa.tarifa;

                // entity.nombreTipoIva        = articulo.nombreTipoIva;
                entity.ice = articulo.valorIce;
                entity.idBodega = $scope.data.idBodega > 0 ? $scope.data.idBodega : 0;
                entity.llevaInventario = articulo.llevaInventario;
                entity.datosAdicionales = articulo.datosAdicionales;
                entity.productoFraccionable = articulo.productoFraccionable;
                entity.medidas = medidas; //Lista Medida
                entity.idMedida = dataMedida.idMedida; //Medida por defecto
                entity.conversion = dataMedida.conversion;
                entity.precioCosto = dataMedida.precioCosto;


                //Datos Adicionales
                entity.datosAdicionalesArticulo = datosAdicionalesArticulo; //
                entity.consolidacionesFecha = consolidacionesFecha;

                entity.articuloTarifas = dataMedida.tarifas;
                let tarifa = entity.articuloTarifas.find(item => item.idTarifa === $scope.data.idTarifa);
                entity.idTarifa = $scope.data.idTarifa;
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
            drawImpuestoTotales();
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

        function setDataFormaPagoSri() {
            let dataFormaPago = {};
            if ($scope.cliente.idFormaPagoSri > 0) {
                dataFormaPago = findFormaPagoById($scope.cliente.idFormaPagoSri);
            }
            else if ($scope.dataFormaPago.idFormaPagoSri > 0) {
                dataFormaPago = findFormaPagoById($scope.dataFormaPago.idFormaPagoSri);
            } else {
                dataFormaPago = $scope.formasPago.find(item => {
                    if ($scope.config.idFormaPagoSri > 0) {
                        return (item.idFormaPagoSri === $scope.config.idFormaPagoSri);
                    } else {
                        return (item.codigo === '01');
                    }
                }) || {};
            }
            $scope.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
            $scope.dataFormaPago.infoReferencia = dataFormaPago.infoReferencia;

            function findFormaPagoById(idFormaPagoSri) {
                return $scope.formasPago.find(item => item.idFormaPagoSri === idFormaPagoSri) || {};
            }

        }

        $scope.onChangeFormaPago = function () {
            $scope.cliente.idFormaPagoSri = 0;
            setDataFormaPagoSri();
        }

        function drawImpuestoTotales() {
            try {
                const getTotals = gridOptionsSvc.getImpuestoTotales({
                    items: $scope.gridOptionsDetalle.data,
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
                } = getTotals;
                const htmlTemplate = gridOptionsSvc.impuestoTotalesHtml(getTotals);

                drawElementHTMLTotals(htmlTemplate)

                $scope.data.subTotalSinImpuestos = subTotalSinImpuestos;
                $scope.data.total = importeTotal;
                $scope.data.totalDescuento = totalDescuento;
                $scope.data.porcentajeDescuento = porcentajeDescuento;
                $scope.data.irbpnr = irbpnr
                $scope.data.propina = propina;

                //Formas pago
                $scope.dataFormaPago.total = importeTotal;
            } catch (error) {
                console.log(error);
            }
        }

        function isValidForm() {
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


            if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
                tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
                return
            }

            let ajusteFechaEmision = fS.ajustarFechaEmision(null, $scope.data.fechaEmision);

            if (ajusteFechaEmision) {
                $scope.data.fechaEmision = ajusteFechaEmision;
            } else {
                console.log('Error al justar la fecha de Emisión')
                return
            }

            if ($scope.gridOptionsDetalle.data.some(row => !(row.idBodega > 0))) {
                tS.toastr('warning', 'Seleccione la bodega en el detalle de los artículos');
                return
            }

            if ($scope.data.total <= 0) {
                tS.toastr('warning', 'No se puede generar el documento en el importe total con un valor 0')
                return
            }

            //    let dataUsuario = $scope.vendedores.find(vendedor => (vendedor.predeterminado));
            if (!($scope.data.idUsuario > 0)) {
                tS.toastr('warning', 'No se encontró los datos del usuario');
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

            return true;
        }


        const validateCuota = function () {
            let objParamsCuota = {
                fechaEmision: $scope.data.fechaEmision,
                tiemposCredito: $scope.tiempoCreditos,
                idTiempoCredito: $scope.data.idTiempoCredito,
                montoTotal: $scope.data.total,
                cuotas: []
            }
            let cuotas = [];
            let montoTotalCuota = 0;


            let dataCuota = fS.calcularCuotas(objParamsCuota);
            cuotas = dataCuota.cuotas;
            montoTotalCuota = dataCuota.montoTotalCuota;




            if (fS.roundNumber(montoTotalCuota, 2) !== fS.roundNumber($scope.data.total, 2)) {
                tS.toastr('warning', 'No coincide el total de la cuota con el importe total del documento.');
                return [];
            }

            return cuotas;
        }

        function isValidTotals() {
            const getTotals = gridOptionsSvc.getImpuestoTotales({
                items: $scope.gridOptionsDetalle.data,
                decimal: $scope.decimal,
                tarifasImpuesto: $scope.tarifasImpuesto.slice(),
            });
            let {
                subTotalSinImpuestos,
                importeTotal,
                totalDescuento,
            } = getTotals;



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



        $scope.askToSaveDocDestino = async function () {
            try {

                if (!isValidForm()) return;
                if (!isValidTotals()) return;

                let cuotas = validateCuota();

                if (cuotas && cuotas.length === 0) return

                let serieComprobante = null;
                let codDocDestino = null;
                let codDoc = null;
                if ($scope.data.docDestino === DOC_TYPE.FV_SRI) {
                    codDocDestino = DOC_TYPE.FE;
                    codDoc = DOC_TYPE.FV_SRI;

                    await docElectSvc.validateNormativeSri({
                        accion: 'guardar',
                        identificacion: $scope.cliente.numeroIdentificacion,
                        importeTotal: $scope.data.total,
                        idFormaPago: $scope.dataFormaPago.idFormaPagoSri,
                        codDoc: '01'

                    })

                    serieComprobante = await facturaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    });
                }
                if ($scope.data.docDestino === DOC_TYPE.NE) {
                    codDocDestino = DOC_TYPE.NE;
                    codDoc = DOC_TYPE.NE;

                    serieComprobante = await notaEntregaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    })
                }

                if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

                let { isConfirmed } = await Swal.fire({
                    // title: 'Are you sure?',
                    html: `<small>Esta Ud. seguro de <b>guardar</b> este Aprobación Documento de: ${docOrigenDesc} -> ${docDestinoDesc} con <b>N° ${serieComprobante}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar'
                })

                if (isConfirmed) {

                    let query = aprobacionDocSvc.convertToDocAprobacionDocMapper({
                        id: $scope.data.idAprob_Document,
                        codDocDestino,
                        codDoc,
                        comprobante: $scope.data,
                        detalles: $scope.gridOptionsDetalle.data,
                        infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                        cuotas,
                        dataFormaPago: $scope.dataFormaPago,
                        historyDatosAdicionales: $scope.historyDatosAdicionales,
                    })

                    aprobacionDocSvc.convertToDoc(query).then(response => {
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })



                }

            } catch (error) {
                console.log(error)
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

        $scope.docOrigenDesc = docOrigenDesc;
        $scope.docDestinoDesc = docDestinoDesc

        $scope.data = comprobante;
        $scope.cliente = cliente;


        $scope.dataSource = []

        function drawImpuestoTotales() {
            try {
                const getTotals = gridOptionsSvc.getImpuestoTotales({
                    items: $scope.dataSource,
                    decimal: $scope.decimal,
                    tarifasImpuesto: $scope.tarifasImpuesto.slice(),
                });
                const htmlTemplate = gridOptionsSvc.impuestoTotalesHtml(getTotals);

                drawElementHTMLTotals(htmlTemplate)
            } catch (error) {
                console.log(error);
            }
        }

        function calculateTotalItems(items) {
            return items.map((item, index) => {
                let porcentajeDescuento = item.precioUnitario === 0 ? 0 : (item.descuento / item.precioUnitario) * 100;
                let total = item.precioTotalSinImpuesto + item.valorImpuesto;
                return {
                    n: index + 1,
                    ...item,
                    precioConIva: fS.roundNumber(item.precioConIva, $scope.decimal.nroPrecio),
                    total: fS.roundNumber(total, $scope.decimal.nroTotalDetalle),
                    porcentajeDescuento: fS.roundNumber(porcentajeDescuento, $scope.decimal.nroPorcentaje),
                    valorDescuento: item.descuento,
                    ice: item.ice || 0
                }

            })
        }


        initiload();

        async function initiload() {
            try {
                let {
                    // estabs,
                    tarifasImpuesto,
                    // tiemposCredito,
                    // tarifas,
                    // permisoVenta,
                    decimal,
                } = mainDataForm;
                $scope.decimal = decimal;
                $scope.tarifasImpuesto = tarifasImpuesto;
                $scope.dataSource = calculateTotalItems(items);
                $uibModalInstance.rendered.then(() => {
                    drawImpuestoTotales();
                })
            } catch (error) {
                console.log(error);
            }
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
     *
     * @param {*} htmlTemplate
     */

    function drawElementHTMLTotals(htmlTemplate) {



        const element = document.getElementById('drawImpuestoTotales');
        if (element) {
            element.innerHTML = htmlTemplate;
        }
    }

})(window.angular)
