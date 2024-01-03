(function () {

    'use strict';


    const TEMPLATE_URL = '~/Pages/Compras/CompraNoHabitual/';
    const NAME_KEY_DETALLE_STORAGE = 'CompraNoHabitualStorage'
    let mainDataForm = {};
    let compraNoHabSvc = {};
    let commonSvc = {};
    let modalSvc = {};
    let tS = {};
    let fS = {};


    app.controller('compraNoHabitualCtrl', compraNoHabitualCtrl);


    compraNoHabitualCtrl.$inject = [
        '$scope',
        '$injector',
        'nombreModalCompra',
    ]


    function compraNoHabitualCtrl($scope, $injector, nombreModalCompra) {
        const CODE_REPORT = $injector.get('CODE_REPORT');
        compraNoHabSvc = $injector.get('compraNoHabitualService');
        commonSvc = $injector.get('commonService');
        modalSvc = $injector.get('modalService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');

        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        //Filtro 

        $scope.proveedor = {
            nombreProveedor: ''
        }

        $scope.searchUser = {
            nombreCompleto: ''
        }
        $scope.moreSearchOptions = false;

        $scope.recordsQuantity = [25, 50, 100]
        $scope.dataSearch = {
            checkBoxFecha: true,
            codEstado: "",
            pageIndex: 1,
            pageSize: 25,
            maxSize: 5,
            totalRecords: 0
            // fechaInicio: new Date(),
            // fechaFin: new Date()
        };

        $scope.estadoDocs = [{
            estado: 'AC',
            descripcion: 'Activo'
        }, {
            estado: 'A',
            descripcion: 'Anulado',
        }]



        /**
         * 
         * @param {object} {controller, template, params}
         */
        $scope.openModal = ({
            controller,
            template,
            params,
            isRenderRazorPartial
        }) => {
            let modalRef = modalSvc.openModalCustom({
                controller,
                template,
                params,
                size: 'xl',
                windowClass: 'uibModalFullScreen',
                isRenderRazorPartial
            })

            modalRef.result.then(result => {
                if (typeof result === 'object') {
                    $scope.getComprasNoHabitual();
                }
            })
        }


        //Formulario Nuevo
        $scope.openModalNew = async () => {
            try {
                modalSvc.openModalCustom({
                    controller: 'modalCompraNoHabitualCtrl',
                    template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                    size: 'xl',
                    params: {},
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }).result.then(result => {

                    if (typeof result == 'object') {
                        $scope.getComprasNoHabitual();
                    }
                })

            } catch (error) {
                console.log(error)
            }

        }

        //---------------------FILTROS---------------------------------
        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);

            $scope.puntosEmision = dataEstab.puntosEmision;
            let dataPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi));
            if (dataPuntoEmision) {
                $scope.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
            }
            $scope.getComprasNoHabitual();
        }

        $scope.pagechanged = function () {
            $scope.getComprasNoHabitual();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getComprasNoHabitual();
        };



        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getComprasNoHabitual();
        }

        //====================Cliente===========
        $scope.onKeyupProveedor = function () {

            $scope.dataSearch.idProveedor = 0;

        }
        $scope.onSelectProveedor = function (item) {
            $scope.dataSearch.idProveedor = item.idProveedor;
            $scope.getComprasNoHabitual();
        }

        $scope.onKeyupUser = function () {
            if (!$scope.searchUser.nombreCompleto) {
                $scope.dataSearch.idUsuario = 0;
            }
        }
        $scope.onSelectUser = function (item) {
            $scope.dataSearch.idUsuario = item.idUsuario;
            $scope.getComprasNoHabitual();
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }


        function sumImporteTotal() {
            let importeTotal = 0;
            for (let item of $scope.documentoIngreso) {
                importeTotal += item.importeTotal;
            }
            $scope.importeTotal = fS.roundNumber(importeTotal, 2);
        }



        //Obtenemos Datos 
        $scope.getComprasNoHabitual = () => {
            try {
                showLoader();

                if ($scope.dataSearch.secuencial) {
                    if (!fS.validAndFormatedRangeSequential($scope.dataSearch.secuencial)) {
                        $scope.dataSearch.checkBoxFecha = true;
                        tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                        return
                    }
                    if (!($scope.dataSearch.idProveedor > 0)) {
                        $scope.dataSearch.checkBoxFecha = false;
                    }
                }

                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: fS.isValidField($scope.dataSearch.idPuntoEmision),
                    idProveedor: fS.isValidField($scope.dataSearch.idProveedor),
                    dateStart: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    dateEnd: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    codEstado: fS.isValidField($scope.dataSearch.codEstado),
                    secuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.secuencial),
                    ckFecha: $scope.dataSearch.checkBoxFecha,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                }
                $scope.documentoIngreso = [];
                sumImporteTotal();
                showLoader();
                compraNoHabSvc.getAll(dataSearch).then(response => {
                    $scope.documentoIngreso = response;
                    $scope.dataSearch.totalRecords = $scope.documentoIngreso.length > 0 ? $scope.documentoIngreso[0].totalRecords : 0;
                    sumImporteTotal();
                }).catch(error => {
                    console.log(error);
                    $scope.dataSearch.totalRecords = 0;
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.initiload = () => {
            try {
                compraNoHabSvc.getDataFilter().then(
                    response => {
                        const { estabs, estadosDoc } = response;
                        $scope.establecimientos = estabs;
                        $scope.estadosDoc = estadosDoc;

                        if ($scope.establecimientos.length > 0) {
                            let dataEstab = $scope.establecimientos.find(estab => estab.defaultEstab);
                            if (dataEstab) {
                                $scope.dataSearch.codEstab = dataEstab.codEstab;
                                $scope.puntosEmision = dataEstab.puntosEmision;
                                let dataPuntoEmision = $scope.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi);
                                if (dataPuntoEmision) {
                                    $scope.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                                }
                            }
                            $scope.getComprasNoHabitual();
                        }
                    }
                ).catch(error => {
                    console.log(error)
                })

                compraNoHabSvc.getDataForm().then(response => {
                    mainDataForm = response;
                })
            } catch (error) {
                console.log(error);
            }
        }
        $scope.initiload();


        //Formulario Editar
        $scope.openModalEditar = async (item) => {
            try {
                showLoader();
                compraNoHabSvc.getId(item.id).then(
                    response => {
                        modalSvc.openModalCustom({
                            controller: 'modalCompraNoHabitualCtrl',
                            template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                            size: 'xl',
                            params: response,
                            windowClass: 'uibModalFullScreen',
                            isRenderRazorPartial: true
                        }).result.then(result => {
                            if (typeof result == 'object') {
                                $scope.getComprasNoHabitual();
                            }
                        })
                    }
                )
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                console.log(error);
            }
        }




        $scope.openModalDetalle = async (params) => {
            try {
                let { fileCtrl, controller, templates } = nombreModalCompra.DOC_COMPRA_DETALLE;
                let ctrl = (await import(fileCtrl))[controller];
                let template = templates['CNH'];
                modalSvc.openModalCustom({
                    controller: ctrl,
                    template: template,
                    size: 'xl',
                    params: {
                        codDoc: params.codDoc,
                        id: params.id
                    },
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })
            } catch (error) {
                console.log(error);
            }
        }


        //Cancelar un Documento
        $scope.askToDelete = async (item) => {
            try {
                let { isConfirmed } = await Swal.fire({
                    title: "Anular Documento?",
                    html: `<small>Esta Ud. seguro de anular el documento Nro. ${item.serieComprobante}</small>?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si!",
                    cancelButtonText: "No",
                });


                if (isConfirmed) {
                    showLoader();
                    compraNoHabSvc.anular(item.id).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.getComprasNoHabitual();
                        }
                    }).finally(() => hideLoader())
                }
            } catch (error) {
                Swal.close();
                console.log(error)
            }

        }

        $scope.getReport = function (item) {
            try {
                let format = 'pdf';
                let dataParms = {
                    id: item.id,
                    tipo: 1
                }

                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: CODE_REPORT.RCNH,
                        codEstab: item.codEstab,
                        format,
                        aditionalParams: [

                        ]
                    }),
                    dataParams: JSON.stringify(dataParms)
                }

                showLoader();
                commonSvc.getReport({
                    parameters,
                    formatType: format
                }).finally(() => hideLoader())
            } catch (error) {
                console.log(error)
            }
        }






    }



    /**
     * 
     * 
     */
    app.controller('modalCompraNoHabitualCtrl', modalCompraNoHabitualCtrl);

    modalCompraNoHabitualCtrl.$inject = ['$scope', '$injector', '$uibModalInstance', 'params'];

    function modalCompraNoHabitualCtrl($scope, $injector, $uibModalInstance, params) {

        let $timeout = $injector.get("$timeout");
        let gridOptionsSvc = $injector.get("gridOptionsCompraService");
        let storageSvc = $injector.get('storageService');

        //Tipo Doc
        $scope.tipoDoc = {
            codigo: 'C'
        }

        $scope.establecimientos = [];
        $scope.bodegas = [];
        $scope.puntosEmision = [];
        $scope.datosAdicionalesArticulo = []

        $scope.data = {
            idBodega: 0,
            idPuntoEmision: 0,
            fechaEmision: new Date(),
        };
        $scope.dataClone = {
            idBodega: 0,
        };
        $scope.proveedor = {};

        const detallesDeleted = [];
        $scope.gridOptions = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
            data: [],
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
                if (ev.which == 13 || ev.keyCode == "13") {
                    setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();
                }
            });

            gridApi.edit.on.afterCellEdit(
                $scope,
                (rowEntity, colDef, newValue, oldValue) => {
                    //Validar campos
                    if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                        rowEntity[colDef.field] = oldValue;
                    }

                    //Validacion de numeros negativos
                    if (
                        [
                            "cantidad",
                            "precioUnitario",
                            "valorDescuento",
                            "porcentajeDescuento",
                        ].includes(colDef.field) &&
                        newValue < 0
                    ) {
                        rowEntity[colDef.field] = oldValue;
                    }

                    if (colDef.field === "cantidad" && rowEntity[colDef.field] === 0) {
                        rowEntity[colDef.field] = 1;
                    }

                    setCalculoTotales(colDef.field, rowEntity, oldValue);
                }
            );
        }

        function calculateTotalItems(items) {
            return items.map((item) => {
                let total = item.precioTotalSinImpuesto + item.valorImpuesto;
                return {
                    ...item,
                    total: fS.roundNumber(total, $scope.decimal.nroTotalDetalle),
                };
            });
        }

        initiload();
        function initiload() {
            try {
                const {
                    estabs,
                    decimal,
                    tarifasImpuesto,
                } =
                    mainDataForm;

                $scope.establecimientos = estabs;

                $scope.decimal = decimal;
                $scope.tarifasImpuesto = tarifasImpuesto;

                if (
                    !(
                        "comprobante" in params &&
                        params.comprobante.idDocumentoIngreso > 0
                    )
                ) {
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(
                            (estab) => estab.defaultEstab
                        );
                        if (dataEstab) {
                            $scope.data.codEstab = dataEstab.codEstab;
                            $scope.dataClone.codEstab = $scope.data.codEstab;
                            $scope.puntosEmision = dataEstab.puntosEmision || [];
                            $scope.bodegas = dataEstab.bodegas;

                            let dataPuntoEmision = $scope.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi);
                            if (dataPuntoEmision) {
                                $scope.data.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                            }
                        }


                        if ($scope.bodegas.length > 0) {
                            let dataBodega = $scope.bodegas.find(
                                (bodega) => bodega.defaultBodega
                            );
                            if (dataBodega) {
                                $scope.data.idBodega = dataBodega.idBodega;
                                $scope.dataClone.idBodega = $scope.data.idBodega;
                            }
                        }
                    }

                    if (Object.keys(storageSvc.getObject(NAME_KEY_DETALLE_STORAGE)).length > 0) {
                        storageSvc.restoreInvoiceDetail(NAME_KEY_DETALLE_STORAGE).then(result => {
                            if (result.isConfirmed) {
                                $scope.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value]);
                                delete result.dataInvoiceDetail[result.value];

                                storageSvc.setObject(NAME_KEY_DETALLE_STORAGE, result.dataInvoiceDetail)

                                recalculateTotalsSimple();
                                $scope.$apply();
                            }

                        })
                    }
                }

                if (
                    "comprobante" in params &&
                    params.comprobante.idDocumentoIngreso > 0
                ) {
                    const { comprobante, proveedor, detalles, infoAdicionalDocumento } = params;

                    $scope.data = comprobante;
                    $scope.dataClone.codEstab = $scope.data.codEstab;

                    $scope.proveedor = proveedor;
                    $scope.proveedor.nombreProveedor = proveedor.nombreFiscal;
                    $scope.gridOptions.data = calculateTotalItems(detalles);
                    $scope.infoAdicionalDocumento = infoAdicionalDocumento;

                    let dataEstab = $scope.establecimientos.find(
                        (estab) => estab.codEstab === $scope.data.codEstab
                    );
                    if (dataEstab) {
                        $scope.bodegas = dataEstab.bodegas;
                        $scope.puntosEmision = dataEstab.puntosEmision;
                        let dataBodega = $scope.bodegas.find(
                            (bodega) => bodega.defaultBodega
                        );
                        if (dataBodega) {
                            $scope.data.idBodega = dataBodega.idBodega;
                            $scope.dataClone.idBodega = $scope.data.idBodega;
                        }
                    }
                }

                setColumnDefs();
                $uibModalInstance.rendered.then(() => {
                    drawTotalsTarifaImpuesto();
                });
            } catch (error) {
                console.log(error);
            }
        }




        function setColumnDefs() {
            $scope.gridOptions.columnDefs = [
                {
                    name: "Op.",
                    enableCellEdit: false,
                    width: "5%",
                    minWidth: "100",
                    cellTemplate: `<a  ng-click="grid.appScope.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.openModalArticle(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >

                           <a  btn-data-adicional-articulo entity="row.entity" datos-adicionales="grid.appScope.datosAdicionalesArticulo" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `
                },
                {
                    name: "N°",
                    field: "n",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    width: "2%",
                    minWidth: "50",
                },
                {
                    name: "código",
                    field: "codigo",
                    allowCellFocus: false,
                    enableCellEdit: false,
                    width: "8%",
                    minWidth: "100",
                },
                {
                    name: "descripción",
                    field: "descripcion",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.llevaInventario !== true;
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
                    enableCellEditOnFocus: true,
                    validators: {
                        required: true,
                    },
                    min: 1,
                    type: "number",
                    width: "6%",
                    minWidth: "60",
                },
                {
                    name: "Medida",
                    field: "idMedida",
                    cellFilter: "mapMedida:row.entity.medidas",
                    editableCellTemplate: "ui-grid/dropdownEditor",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
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
                    name: "I.V.A",
                    field: "idTipoIva",
                    width: "8%",
                    minWidth: "100",
                    type: "number",
                    editableCellTemplate: "ui-grid/dropdownEditor",
                    cellFilter: "cellFilterTipoIva:this",
                    editDropdownValueLabel: "descripcion",
                    editDropdownIdLabel: "idTipoIva",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    //    visible: config.porcentajeIva
                },
                {
                    name: "Precio U.",
                    field: "precioUnitario",
                    min: 0,
                    enableCellEditOnFocus: true,
                    // cellFilter: "currency:'$':5",
                    type: "number",
                    width: "7%",
                    minWidth: "100",
                },

                {
                    name: "%",
                    field: "porcentajeDescuento",
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
                    min: 0,
                    width: "4%",
                    minWidth: "60",
                    // cellFilter: "currency:'%'",
                    visible: true,
                    type: "number",
                    /*cellFilter: "limitTo:3",*/
                },
                {
                    name: "Desc.",
                    field: "valorDescuento",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    allowCellFocus: true,
                    min: 0,
                    type: "number",
                    width: "4%",
                    minWidth: "65",
                },
                // {
                //     name: 'T. Dsto.',
                //     field: 'totalDescuento',
                //     enableCellEditOnFocus: true,
                //     allowCellFocus: true,
                //     enableCellEdit: true,
                //     min: 0,
                //     type: 'number',
                //     width: '6%',
                //     minWidth: '100',

                // },
                {
                    name: "SubTotal",
                    field: "precioTotalSinImpuesto",
                    enableCellEdit: false,
                    allowCellFocus: false,
                    type: "number",
                    width: "8%",
                    minWidth: "50",
                    visible: true,
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
                },
                {
                    name: "Ice",
                    field: "ice",
                    allowCellFocus: true,
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: "number",
                    width: "6%",
                    minWidth: "60",
                },
                {
                    name: "bodega",
                    field: "idBodega",
                    enableFiltering: false,
                    editableCellTemplate: "ui-grid/dropdownEditor",
                    cellFilter: "cellFilterBodega:this",
                    editDropdownValueLabel: "descripcion",
                    editDropdownIdLabel: "idBodega",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: "number",
                    width: "11%",
                    minWidth: "100",
                },

                {
                    name: "Nota",
                    field: "nota",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: "string",
                    width: "15%",
                    minWidth: "100",
                },
            ];
            setWarehouseAndIVA();
        }

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
        }

        /**
         *
         * @param {*} entity Datos del Articulo
         */
        $scope.deleteRow = async function (rowEntity) {
            let isConfirmed = await gridOptionsSvc.askToDeleteItem(rowEntity);

            if (isConfirmed) {
                let index = $scope.gridOptions.data.indexOf(rowEntity);
                $scope.gridOptions.data.splice(index, 1);

                if (rowEntity.idDocumentoIngresoDetail > 0) {
                    detallesDeleted.push({
                        ...rowEntity,
                        estado: 0,
                    });
                }

                //Recalculamos los totales
                setCalculoTotales("cantidad", rowEntity, 0);
                counterGridOptions();
                $scope.$apply();
            }

            if (isConfirmed && rowEntity.datosAdicionales) {
                $scope.datosAdicionalesArticulo = $scope.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.idArticulo);
            }

            // if (isConfirmed && rowEntity.datosAdicionales) {
            //     $scope.datosAdicionalesArticulo = $scope.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.idArticulo);
            //     $scope.historyDatosAdicionales = $scope.historyDatosAdicionales.filter(val => val.idArticulo !== rowEntity.idArticulo);
            // }
        };

        // * Add by Ignacio Manchu.
        function drawTotalsTarifaImpuesto() {
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
                });

                const template = `<table class="table table-clear table-sm">
                                    <tbody>
                                        <tr>
                                            <td class="left">
                                                <strong class="text-dark">Subtotal sin Impuestos</strong>
                                            </td>
                                            <td class="right">$${subTotalSinImpuestos}</td>
                                        </tr>
                                        ${htmlImpuestoTotal}
                                        <tr>
                                            <td class="left">
                                                <strong class="text-dark">Total descuento</strong>
                                            </td>
                                            <td class="right">$${totalDescuento}</td>
                                        </tr>
                                        <tr>
                                            <td class="left">
                                                <strong class="text-dark">Valor ICE</strong>
                                            </td>
                                            <td class="right">$${totalIce}</td>
                                        </tr>
                                        <tr>
                                            <td class="left">
                                                <strong class="text-dark">Valor irbpnr</strong>
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
                                </table>`;

                const element = document.getElementById("drawImpuestoTotales");

                if (element) {
                    element.innerHTML = template;
                }

                $scope.data.subTotalSinImpuestos = subTotalSinImpuestos;
                $scope.data.total = importeTotal;
                $scope.data.totalDescuento = totalDescuento;
                $scope.data.porcentajeDescuento = porcentajeDescuento;
                $scope.data.irbpnr = irbpnr;
                $scope.data.propina = propina;
            } catch (error) {
                console.log(error);
            }
        }


        $scope.onChangeEstablecimiento = async function () {
            try {
                if ($scope.data.idDocumentoIngreso > 0) {
                    tS.toastr("warning", "El Establecimiento no puede ser editada");
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    return;
                }

                const isConfirmed = await gridOptionsSvc.askToChangeEstablecimiento();

                if (isConfirmed) {
                    let dataEstab = $scope.establecimientos.find(
                        (estab) => estab.codEstab === $scope.data.codEstab
                    );
                    if (!dataEstab) {
                        tS.toastr("warning", "No se encontró el dato del Establecimiento!");
                        return;
                    }
                    $scope.bodegas = dataEstab.bodegas;
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    if ($scope.puntosEmision.length === 0) {
                        tS.toastr("warning", "No tienes asignado los puntos de emisión!");
                        return;
                    }
                    $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi).idPuntoEmision;

                    if ($scope.bodegas.length === 0) {
                        tS.toastr("warning", "No tienes asignado las bodegas!");
                        return;
                    }
                    $scope.dataClone.codEstab = dataEstab.codEstab;
                    $scope.data.idBodega = $scope.bodegas.find(
                        (bodega) => bodega.defaultBodega
                    ).idBodega;
                    $scope.dataClone.idBodega = $scope.data.idBodega;

                    setWarehouseAndIVA();
                    setIdBodegaInDetalle();
                } else {
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                }
                $scope.$apply();
            } catch (error) {
                console.log(error);
            }
        };

        function setIdBodegaInDetalle() {
            for (let item of $scope.gridOptions.data) {
                item.idBodega = $scope.data.idBodega;
            }
        }

        $scope.onKeyupProveedor = function () {
            if (!fS.isValidField($scope.proveedor.nombreProveedor)) {
                $scope.proveedor = {};
            }
        };

        $scope.onSelectProveedor = function (item) {
            $scope.proveedor = {
                idProveedor: item.idProveedor,
                diasCredito: item.diasCredito,
                nombreFiscal: item.nombreFiscal,
                nombreProveedor: item.nombreFiscal,
                numeroIdentificacion: item.numeroIdentificacion,
                direccion: item.direccion
            };
        }

        $scope.onChangeFechaEmision = function () {
            try {
                if ($scope.data.idDocumentoIngreso > 0) {
                    Swal.fire({
                        title: "<small>Modificar fecha emisión?</small>",
                        html: "<small>Esta seguro de modificar fecha emisión?</small>",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Si!",
                        cancelButtonText: "No!",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $scope.dataClone.fechaEmision = $scope.data.fechaEmision;
                        } else {
                            $scope.data.fechaEmision = $scope.dataClone.fechaEmision;
                        }
                        getFechaVencimiento();
                        $scope.$apply();
                    });
                } else {
                    getFechaVencimiento();
                }
            } catch (error) {
                console.log(error);
            }
        };

        $scope.askToChangeBodega = function () {
            try {
                Swal.fire({
                    title: "<small>Cambiar Bodega?</small>",
                    html: "<small>Esta seguro de cambiar la bodega en el detalle?</small>",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si!",
                    cancelButtonText: "No!",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.dataClone.idBodega = $scope.data.idBodega;
                        setIdBodegaInDetalle();
                    } else {
                        $scope.data.idBodega = $scope.dataClone.idBodega;
                    }
                    $scope.$apply();
                });
            } catch (error) {
                console.log(error);
            }
        };

        function addRow() {
            const obj = {
                n: 1,
                idDocumentoIngresoDetail: 0,
                idArticulo: 0,
                codigo: "",
                descripcion: "",
                cantidad: 1,
                precioUnitario: 0,
                porcentajeDescuento: 0,
                valorDescuento: 0,
                totalDescuento: 0,
                precioTotalSinImpuesto: 0,
                valorImpuesto: 0,
                ice: 0,
                idBodega: 0,
                total: 0,
                nota: null,
                estado: 1,
            };
            $scope.gridOptions.data.push(obj);
        }

        $scope.setItemArticuloEnDetalle = function (data) {
            try {
                $scope.mainDataArticulo = data;
                const { articulo, medidas, etiquetas } = $scope.mainDataArticulo;

                let index = $scope.gridOptions.data.findIndex(
                    (item) =>
                        item.llevaInventario && item.idArticulo === articulo.idArticulo
                );

                let entity = {};
                if (index === -1) {
                    addRow();
                    index = $scope.gridOptions.data.length - 1;
                    entity = $scope.gridOptions.data[index];
                } else {
                    entity = $scope.gridOptions.data[index];
                    entity.cantidad = entity.cantidad + 1;
                }

                let dataMedida = medidas.find((medida) => medida.defaultMedida);
                let dataTarifaImpuesto = $scope.tarifasImpuesto.find(
                    (ti) => ti.codigoPorcentaje === articulo.codigoPorcentaje
                );

                let precioCosto = dataMedida.precioCosto;

                entity.idArticulo = articulo.idArticulo;
                entity.codigo = articulo.codigoArticulo;
                entity.descripcion = articulo.descripcion;
                entity.precioUnitario = fS.roundNumber(
                    precioCosto,
                    $scope.decimal.nroPrecio
                );
                entity.etiquetas = etiquetas;

                //Medidas
                entity.medidas = medidas;
                entity.idMedida = dataMedida.idMedida;
                entity.conversion = dataMedida.conversion;

                //IVA
                entity.idImpuesto = dataTarifaImpuesto.idImpuesto;
                entity.idTipoIva = articulo.idTipoIva;
                entity.codigoPorcentaje = articulo.codigoPorcentaje;
                entity.tarifa = articulo.tarifa;

                entity.ice = articulo.valorIce;
                entity.idBodega =
                    entity.idDocumentoIngresoDetail > 0
                        ? entity.idBodega
                        : $scope.data.idBodega;
                entity.llevaInventario = articulo.llevaInventario;
                entity.datosAdicionales = articulo.datosAdicionales;

                focusColumnCantidad(index);
            } catch (error) {
                console.log(error);
            }
        };

        function focusColumnCantidad(indexRow) {
            let index = $scope.gridOptions.columnDefs.findIndex(
                (item) => item.field === "cantidad"
            );
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            );

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[indexRow],
                    $scope.gridOptions.columnDefs[index]
                );
            }, 30);
            counterGridOptions();
        }

        function counterGridOptions() {
            $scope.gridOptions.data.forEach((item, index) => {
                item.n = index + 1;
            });
        }

        $scope.openModalArticle = function (item) {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            );

            $scope.indexRow = $scope.gridOptions.data.indexOf(item);
            $scope.$broadcast("editArticulo", item);
        };

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
            drawTotalsTarifaImpuesto();
        }

        $scope.calcularPorcentajeDescuento = function () {
            if ($scope.gridOptions.data.length === 0) {
                return;
            }

            if (isNaN($scope.data.porcentajeDescuento)) {
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
                if ($scope.gridOptions.data.length === 0) {
                    return;
                }
                if (isNaN($scope.data.totalDescuento)) {
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


        const isRegister = () => !($scope.data.idDocumentoIngreso > 0);
        const isUpdate = () => $scope.data.idDocumentoIngreso > 0;

        const isValidaForm = () => {
            if (!fS.isValidField($scope.data.codEstab)) {
                tS.toastr("warning", "Seleccione el Establecimiento!");
                return;
            }

            if (!fS.isValidField($scope.data.idPuntoEmision)) {
                tS.toastr("warning", "Seleccione el Punto Emisión!");
                return;
            }
            if (!fS.isValidField($scope.proveedor.idProveedor)) {
                tS.toastr("warning", "Seleccione el Proveedor!");
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
                    "La cantidad del producto no puede ser igual a 0."
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

            if ($scope.data.total <= 0) {
                tS.toastr(
                    "warning",
                    "No se puede generar el documento con valor total 0!"
                );
                return;
            }
            return true;
        };

        $scope.onSave = async function () {
            try {
                if (!isValidaForm()) return;

                let textAccion = isUpdate() ? "Actualizar" : "Guardar";
                let title = isUpdate() ? "Actualizar Documento" : "Guardar Documento";
                let html = '';

                let serieComprobante = null;
                if (isRegister()) {
                    showLoader();
                    serieComprobante = await compraNoHabSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision
                    });
                    hideLoader();
                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"

                    html = `<small>Esta Ud. seguro de ${textAccion} este Documento <b> Nro. ${serieComprobante}</b></small>?`;
                }

                Swal.fire({
                    title,
                    html,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si!",
                    cancelButtonText: "No!",
                }).then((result) => {
                    if (result.isConfirmed) {

                        $scope.data.idProveedor = $scope.proveedor.idProveedor;

                        const params = compraNoHabSvc.queryMapper(
                            {
                                comprobante: $scope.data,
                                detalles: $scope.gridOptions.data,
                                detallesDeleted,
                                datosAdicionalesArticulo: $scope.datosAdicionalesArticulo
                            }
                        )

                        if (isRegister()) {
                            showLoader();
                            compraNoHabSvc.post(params).then(response => {
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

                        if (isUpdate()) {
                            showLoader();
                            compraNoHabSvc.put($scope.data.idDocumentoIngreso, params).then(response => {
                                if (response.code === '0') {
                                    fS.sweetAlert('warning', response.message, response.titleSms);
                                }

                                if (response.code == "1") {
                                    fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                    $uibModalInstance.close(response)
                                }
                            }).catch(error => {
                                console.log(error)
                            }).finally(() => hideLoader())
                        }


                    }
                });
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        };



        async function askToSaveStorage() {
            try {
                await storageSvc.askToSaveDetailDoc(NAME_KEY_DETALLE_STORAGE, $scope.gridOptions.data);
                $uibModalInstance.close();
            } catch (error) {
                console.log(error)
            }
        }


        $scope.closeModal = function () {
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
        };



    }


})(window.angular)