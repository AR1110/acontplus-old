

export {
    modalKardexCtrl
}

modalKardexCtrl.$inject = [
    '$scope',
    '$injector',
    '$uibModalInstance',
    'params'
];

function modalKardexCtrl($scope, $injector, $uibModalInstance, params) {

    let commonSvc = $injector.get('commonService');
    let transaccionSvc = $injector.get('TransaccionService');
    let articuloSvc = $injector.get('articuloService');
    let modalSvc = $injector.get('modalService');
    let nombreModalCompra = $injector.get('nombreModalCompra');
    let nombreModalVenta = $injector.get('nombreModalVenta');
    const nombreModalInventario = $injector.get('nombreModalInventario');
    let fS = $injector.get('formulario');
    let tS = $injector.get('toastService');
    let DOC_TYPE = $injector.get('DOC_TYPE');



    $scope.articulo = params;

    $scope.dataSearch = {
        checkBoxFecha: true,
        checkBoxBodega: true,
        consolidacion: 0,
        checkBoxDefault: false,
        estado: false
    };

    $scope.articuloFiltro = {
        descripcion: $scope.articulo.descripcion
    }

    $scope.estadoMovimientos = [];
    $scope.kardexs = [];
    $scope.dataArticulo = {};
    $scope.data = {};

    //Rango Fechas 
    let thisMoment = moment()
    let startOfMonth = moment(thisMoment).startOf('month')
    let endOfMonth = moment(thisMoment).endOf('month')
    // $scope.dataSearch.fechaInicio = startOfMonth;
    // $scope.dataSearch.fechaFin = endOfMonth;

    //https://www.daterangepicker.com/
    $scope.dateRangePicker = {
        date: { startDate: startOfMonth, endDate: endOfMonth },
        picker: null,
        options: {
            pickerClasses: 'custom-display', //angular-daterangepicker extra
            buttonClasses: 'btn',
            applyButtonClasses: 'btn-success',
            cancelButtonClasses: 'btn-danger',
            locale: {
                applyLabel: "Aplicar",
                cancelLabel: 'Cancelar',
                customRangeLabel: 'Rango Personalizado',
                separator: ' - ',
                format: "YYYY-MM-DD", //will give you 2017-01-06
                //format: "D-MMM-YY", //will give you 6-Jan-17
                //format: "D-MMMM-YY", //will give you 6-January-17
            },
            ranges: {
                'Hoy': [moment(), moment()],
                'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            },
            eventHandlers: {
                'apply.daterangepicker': function () {
                    $scope.dataSearch.fechaInicio = fS.formatDateMoment($scope.dateRangePicker.date.startDate);
                    $scope.dataSearch.fechaFin = fS.formatDateMoment($scope.dateRangePicker.date.endDate);

                }
            }
        }
    };

    $scope.dataSearch.fechaInicio = startOfMonth
    $scope.dataSearch.fechaFin = endOfMonth;

    load()
    function load() {
        transaccionSvc.getDataFilters().then(response => {
            $scope.establecimientos = response.estabs;
            let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
            $scope.dataSearch.codEstab = dataEstab.codEstab;
            $scope.bodegas = dataEstab.bodegas;
            let dataBodega = $scope.bodegas.find(estab => (estab.defaultBodega));
            $scope.dataSearch.byBodega = dataBodega.idBodega
            $scope.estadoMovimientos = response.tiposTransaccion;
            $scope.dataSearch.byArticulo = $scope.articulo.idArticulo;
            const params = Object.assign($scope.dataSearch, {
                checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                checkBoxMovement: $scope.dataSearch.movement ? true : false,
                fechaInicio: fS.formatDateMoment(startOfMonth),
                fechaFin: fS.formatDateMoment(endOfMonth),
            })

            getDataKardex(params)
        });
    }

    function getKardex() {
        try {

            const params = Object.assign($scope.dataSearch, {
                checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                checkBoxMovement: $scope.dataSearch.movement ? true : false,
                movement: [null, undefined, ""].includes($scope.dataSearch.movement) ? null : $scope.dataSearch.movement
            })

            getDataKardex(params)
        } catch (error) {
            hideLoader();
            console.error(error)
        }
    }

    function getDataKardex(params) {
        showLoader();
        transaccionSvc.get(params).then(response => {
            $scope.dataArticulo = response.dataArticulo || {};
            $scope.kardexs = response.kardex || [];
            if ($scope.kardexs.length === 0) {
                hideLoader();
                tS.toastr('info', 'No se encontraron los resultados');
                drawTabulator();
                return
            }

            $scope.data.cantTotalEntrada = calculoTotales("cantidadEntrada");
            $scope.data.totalEntrada = calculoTotales("totalEntrada");

            $scope.data.cantTotalSalida = calculoTotales("cantidadSalida");
            $scope.data.totalSalida = calculoTotales("totalSalida");

            $scope.data.stock = calculoTotales("saldo");
            $scope.data.totalGenetal = calculoTotales("totalGeneral");

            for (let value of $scope.kardexs) {
                value.totalGeneral = (value.precioCosto * value.saldo).toFixed(2)
            }
            drawTabulator();
        }).catch(error => {
            hideLoader()
            console.log(error)
        }).finally(() => hideLoader())
    }



    function drawTabulator() {
        let table = new Tabulator('#table-kardex', {
            height: "400px",
            width: "100%",
            pagination: "local",
            langs: {
                "es-es": {
                    "pagination": {
                        "first": "Primera", //text for the first page button
                        "first_title": "Primer Pagina", //tooltip text for the first page button
                        "last": "Last",
                        "last_title": "Last Page",
                        "prev": "Prev",
                        "prev_title": "Prev Page",
                        "next": "Next",
                        "next_title": "Next Page",
                        "all": "All",
                    },
                }
            },
            paginationSize: 50,
            paginationSizeSelector: [50, 100],
            // layout:"fitDataFill",
            // layout: "fitDataStretch",
            // layout:"fitColumns", 
            layout: "fitDataFill",

            //layout:"fitDataTable",           
            //renderHorizontal:"virtual",
            // autoColumns:true,
            columnHeaderVertAlign: "bottom",
            // movableRows:true,              
            rowFormatter: function (row) {
                if (row.getData().tipoDoc === 'CIV') {
                    // row.getElement().classList().add(row.getData().style);                                        
                    row.getElement().style.backgroundColor = "#fedf7e";
                }
                if (row.getData().style === 'table-danger') {
                    row.getElement().style.backgroundColor = "#F5BCB0";
                }
            },
            data: $scope.kardexs,
            columns: [{
                //create column group ---frozen:true,
                title: "Descripcion",
                widthGrow: 2,
                frozen: true,
                columns: [{
                    title: "F. Emision",
                    field: "fechaEmision",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 120
                },
                {
                    title: "T. Doc",
                    field: "tipoDoc",
                    hozAlign: "center",
                    headerSort: false,
                    width: 60
                },
                {
                    title: "Nro. Doc",
                    field: "nroDocumento",
                    hozAlign: "center",
                    headerSort: false,
                    width: 130
                },
                {
                    title: "Cliente/Proveedor",
                    field: "clienteProveedor",
                    headerSort: false,
                    hozAlign: "center",
                    width: 150,
                    tooltip: true
                },
                {
                    title: "Usuario",
                    field: "usuario",
                    hozAlign: "center",
                    headerSort: false,
                    width: 150
                },
                {
                    title: "Estado",
                    field: "estado",
                    hozAlign: "center",
                    headerSort: false,
                    width: 100
                },

                ],
            },
            { //create column group
                title: "Entradas",
                columns: [{
                    title: "Medida",
                    field: "medidaEntrada",
                    hozAlign: "center",
                    width: 70,
                    headerSort: false,
                    cssClass: "table-entradas",
                },
                {
                    title: "Cant.",
                    field: "cantidadEntrada",
                    width: 60,
                    headerSort: false,
                    hozAlign: "center",
                    cssClass: "table-entradas",
                    bottomCalc: sumCantidadEntrada,
                },
                {
                    title: "Costo U.",
                    field: "costo",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 75,
                    cssClass: "table-entradas",
                },
                {
                    title: "Total",
                    field: "totalEntrada",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 75,
                    cssClass: "table-entradas",
                },
                ],
            },
            { //create column group
                title: "Salidas",
                columns: [{
                    title: "Medida",
                    field: "medidaSalida",
                    width: 70,
                    hozAlign: "center",
                    headerSort: false,
                    cssClass: "table-salidas",
                },
                {
                    title: "Cant.",
                    field: "cantidadSalida",
                    width: 60,
                    headerSort: false,
                    hozAlign: "center",
                    cssClass: "table-salidas",
                    bottomCalc: sumCantidadSalida,
                },
                {
                    title: "P. Venta",
                    field: "venta",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 75,
                    cssClass: "table-salidas",
                },
                {
                    title: "Total",
                    field: "totalSalida",
                    hozAlign: "center",
                    headerSort: false,
                    width: 75,
                    cssClass: "table-salidas",
                    bottomCalc: sumTotalSalida,
                },
                ],
            },
            { //create column group
                title: "Saldos",
                columns: [
                    {
                        title: "Cant. ",
                        field: "cantidadTransaccion",
                        hozAlign: "center",
                        width: 60,
                        headerSort: false,
                        cssClass: "table-saldos",
                    },
                    {
                        title: "Stock. ",
                        hozAlign: "center",
                        field: "saldo",
                        width: 60,
                        headerSort: false,
                        cssClass: "table-saldos",
                    },
                    {
                        title: "Costo U.",
                        hozAlign: "center",
                        field: "precioCosto",
                        width: 70,
                        headerSort: false,
                        sorter: "number",
                        cssClass: "table-saldos",
                    },
                    {
                        title: "Total",
                        field: "totalGeneral",
                        hozAlign: "center",
                        width: 60,
                        headerSort: false,
                        sorter: "number",
                        cssClass: "table-saldos",
                    },
                ],
            },
            ]
        });

        //trigger an alert message when the row is clicked
        table.on("rowClick", function (e, row) {
            openModalTipoDocumento(row.getData())
        });
    }

    function sumCantidadEntrada() {
        return $scope.data.cantTotalEntrada || 0
    }

    function sumCantidadSalida() {
        return $scope.data.cantTotalSalida || 0
    }

    function sumTotalSalida() {
        return $scope.data.totalSalida || 0
    }


    function calculoTotales(prop) {
        let total = $scope.kardexs.map(item => (item[prop] || 0)).reduce((obj, cur) => Number(obj) + Number(cur), 0);

        return fS.roundNumber(total, 3)
    }


    $scope.getBodegas = function () {
        let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.dataSearch.codEstab);
        $scope.bodegas = dataEstab.bodegas;
        let dataBodega = $scope.bodegas.find(estab => (estab.defaultBodega));
        $scope.dataSearch.byBodega = dataBodega.idBodega
        getKardex();
    }


    $scope.articuloSearch = function (textSearch) {
        if (textSearch.length < 2) return;
        return articuloSvc.search({ busqueda: textSearch, pageIndex: 1, pageSize: 15 })
            .catch(error => {
                console.log(error)
            })
    }

    $scope.onKeyupArticuloSearchFiltro = function () {
        if ($scope.articuloFiltro.descripcion) {
            $scope.data = {};
            $scope.articulo = {};
            $scope.articuloFiltro = {};
        }
    }

    $scope.selectedArticuloSearchFiltro = function (item) {
        $scope.articulo = item;
        $scope.dataSearch.byArticulo = item.idArticulo;
        $scope.articuloFiltro.descripcion = item.descripcion;
    }


    $scope.onChangeUltimaConsolidacion = function () {
        if ($scope.dataSearch.checkBoxUltimaConsolidacion) {
            $scope.dataSearch.checkBoxConsolidacion = false;
            $scope.dataSearch.checkBoxFecha = false;
        }
    }

    $scope.onChangeFechaFiltro = function () {
        if ($scope.dataSearch.checkBoxFecha) {
            $scope.dataSearch.checkBoxConsolidacion = false;
            $scope.dataSearch.checkBoxUltimaConsolidacion = false;
        }
    }

    $scope.onChangecheckBoxConsolidacionInventario = function () {
        if ($scope.dataSearch.checkBoxConsolidacion) {
            $scope.dataSearch.checkBoxFecha = false;
            $scope.dataSearch.checkBoxUltimaConsolidacion = false;
        }
    }

    //Search Kardex 
    $scope.searchKardex = function () {
        if (!($scope.dataSearch.byArticulo > 0)) {
            tS.toastr('warning', 'Seleccione el Articulo');
            return
        }

        if ($scope.dataSearch.checkBoxBodega) {
            if (!($scope.dataSearch.byBodega > 0)) {
                tS.toastr('warning', 'Seleccione la Bodega');
                return
            }
        }

        if ($scope.dataSearch.checkBoxFecha) {
            if (!($scope.dataSearch.fechaInicio)) {
                tS.toastr('warning', 'Ingrese la Fecha de Inicio');
                return
            }
            if (!($scope.dataSearch.fechaFin)) {
                tS.toastr('warning', 'Ingrese la Fecha Fin');
                return
            }
        }

        if ($scope.dataSearch.checkBoxMovement) {
            if ($scope.dataSearch.movement === null || $scope.dataSearch.movement === undefined || $scope.dataSearch.movement === "") {
                // tS.toastr('warning', 'Seleccione el Movimiento');
                // return
            }
        }
        $scope.dataSearch.isSearch = true;
        getKardex();
    }

    $scope.getReport = async function () {
        if ($scope.kardexs.length === 0) {
            tS.toastr('warning', 'No hay registros para el reporte', 'Reporte')
            return
        }

        const {
            value: formatType
        } = await Swal.fire({
            icon: 'warning',
            title: 'Tipo Formato',
            input: 'radio',
            inputOptions: {
                pdf: 'PDF',
                excel: 'EXCEL'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Seleccione el Tipo de Formato!'
                }
            },
            confirmButtonText: '<i class="mdi mdi-download"></i> Descargar',
            showDenyButton: true,
            denyButtonText: 'No, cancelar',
            allowOutsideClick: false,
            showLoaderOnDeny: true,
            allowEscapeKey: false
        })

        if (!formatType) return

        let parameters = {
            hasIdUsuarioRol: true,
            reportParams: JSON.stringify({
                codigo: "RK",
                format: formatType,
                codEstab: $scope.dataSearch.codEstab,
                hasParams: true,
                aditionalParams: []
            }),

            dataParams: JSON.stringify(Object.assign($scope.dataSearch, {
                checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                tipo : 1,
                movement: [null, undefined, ""].includes($scope.dataSearch.movement) ? null : $scope.dataSearch.movement
            }))
        }

        commonSvc.getReport({
            parameters,
            formatType,
            v2: true
        })
    }


    async function openModalTipoDocumento(item) {
        try {

            if (("idDocumento" in item) && ("tipoDoc") in item) {

                //Nota Entrega
                if ([DOC_TYPE.NE].includes(item.tipoDoc)) {
                    $scope.openDocSale(item, item.tipoDoc);
                    return
                }
                //Factura Venta
                if ((item.tipoDoc === 'FE' && item.codTransaccion === 'S')) {
                    let params = {
                        ...item,
                        tipoDoc: DOC_TYPE.FV_SRI
                    }
                    $scope.openDocSale(params, 'FV_SRI');
                    return
                }

                if (item.codTransaccion == 'E' && item.tipoDoc == 'FE') {

                    let { fileCtrl, controller, F } = nombreModalCompra.DOCUMENTO_RECIBIDO;
                    let ctrl = (await import(fileCtrl))[controller];
                    let template = F.template;


                    const params = {
                        idDocumento: item.idDocumento
                    }
                    modalSvc.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params,
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })

                } else if (item.tipoDoc === 'CI') {
                    let fileCtrl = nombreModalInventario.CONSOLIDACION.fileCtrl;
                    let ctrl = nombreModalInventario.CONSOLIDACION.controllers['D'];
                    let template = nombreModalInventario.CONSOLIDACION.templates['D'];

                    let controller = (await import(fileCtrl))[ctrl];
                    modalSvc.openModalCustom({
                        controller,
                        template,
                        size: 'xl',
                        params: {
                            id: item.idDocumento
                        },
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })
                }

                else {
                    commonSvc.viewDetailDocumentII({
                        id: item.idDocumento,
                        codTransaccion: item.codTransaccion,
                        codigoDocumento: item.tipoDoc,
                        size: 'xl',
                        windowClass: 'uibModalFullScreen'
                    })
                }
            }



        } catch (error) {
            console.log(error)
        }
    }

    $scope.openDocSale = async function (params, codDoc) {
        try {
            let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
            let ctrl = (await import(fileCtrl))[controller];
            let template = templates[codDoc];
            modalSvc.openModalCustom({
                controller: ctrl,
                template: template,
                size: 'xl',
                params: {
                    codDoc: params.tipoDoc,
                    id: params.idDocumento
                },
                windowClass: 'uibModalFullScreen',
                isRenderRazorPartial: true
            })
        } catch (error) {
            console.log(error)
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}