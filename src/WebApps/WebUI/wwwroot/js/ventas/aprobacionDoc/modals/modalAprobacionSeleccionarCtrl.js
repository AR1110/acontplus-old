(function () {

    var mainPath = `/Home/Index?name=~/Pages/AprobacionDocumento/`;

    app.component("modalAprobacionSeleccionarDoc", {
        templateUrl: `${mainPath}_ModalSeleccionarDoc.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
            isNotModal: '='
        },
        controller: ['$scope', '$injector', function ($scope, $injector) {

            const $ctrl = this;
            const DOC_TYPE = $injector.get('DOC_TYPE');

            const tS = $injector.get('toastService');
            const fS = $injector.get('formulario');
            const proformaSvc = $injector.get('proformaService');
            const notaEntregaSvc = $injector.get('notaEntregaService');
            const modalSvc = $injector.get('modalService');

            $scope.tiposDocOrigen = [];
            $scope.tiposDocDestino = [];

            $scope.tipos = [
                { code: 1, desc: 'NOTA DE ENTREGA A FACTURA' },
                { code: 2, desc: 'PROFORMA A FACTURA' },
                { code: 3, desc: 'PROFORMA A NOTA DE ENTREGA' },
            ]

            let OPTION_APROBACION = Object.freeze({
                1: Object.freeze({
                    docOrigen: {
                        descripcion: 'Nota de Entrega',
                        codDoc: DOC_TYPE.NE,
                    },
                    docDestino: {
                        descripcion: 'Factura',
                        codDoc: DOC_TYPE.FV_SRI,
                    }
                }),
                2: Object.freeze({
                    docOrigen: {
                        descripcion: 'Proforma',
                        codDoc: DOC_TYPE.PR
                    },
                    docDestino: {
                        descripcion: 'Factura',
                        codDoc: DOC_TYPE.FV_SRI,
                    }
                }),
                3: Object.freeze({
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

            $scope.dataSearch = {
                idTipoDocOrigen: 0,
                idTipoDocDestino: 0,
                tipo: 0,
                fechaInicio: new Date(),
                fechaFin: new Date(),
                pageIndex: 1,
                pageSize: 10,
                totalRecords: 0,
                maxSize: 5,
                checkBoxFecha: true
            }
            $scope.dataClone = {}

            $scope.cliente = {
                idCliente: 0,
                nombreComercial: null,
                nombreFiscal: null,
                numeroIndentificacion: null,
            };

            $scope.establecimientos = [];
            $scope.ptosEmision = [];

            $scope.docsSelected = [];

            let mainDataForm = null;


            $scope.onChangeTipoDocOrigen = onChangeTipoDocOrigen;


            $ctrl.$onInit = function () {
                const { params } = $ctrl.resolve;
                try {
                    mainDataForm = params.mainDataForm;
                    let {
                        estabs,
                        tiposDoc
                    } = mainDataForm; 

                    $scope.tiposDocOrigen = tiposDoc.filter(item => [DOC_TYPE.NE, DOC_TYPE.PR].includes(item.codigo));
                    $scope.tiposDocDestino = tiposDoc.filter(item => [DOC_TYPE.NE, DOC_TYPE.FV].includes(item.codigo));
                    $scope.establecimientos = estabs;

                    let dataEstab = $scope.establecimientos.find(item => (item.defaultEstab))
                    $scope.dataSearch.codEstab = dataEstab.codEstab; //Filtro
                    $scope.dataClone.codEstab = dataEstab.codEstab;


                    //===========Puntos Emisiones============================================== 
                    $scope.ptosEmision = dataEstab.puntosEmision;
                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                    $scope.dataSearch.idPuntoEmision = dataPtoEmi.idPuntoEmision;


                } catch (error) {
                    console.log(error);
                }
            }


            function clearDocs() {
                $scope.docsSelected = [];
            }

            function onChangeTipoDocOrigen() {
                let {
                    tiposDoc
                } = mainDataForm;
                clearDocs();
                $scope.dataSearch.idTipoDocDestino = 0;
                const dataTipoDocOrigen = $scope.tiposDocOrigen.find(item => item.idTipoDocumento === $scope.dataSearch.idTipoDocOrigen);
                if (dataTipoDocOrigen && dataTipoDocOrigen.codigo === DOC_TYPE.NE) {
                    $scope.tiposDocDestino = tiposDoc.filter(item => [DOC_TYPE.FV].includes(item.codigo));
                } else {
                    $scope.tiposDocDestino = tiposDoc.filter(item => [DOC_TYPE.NE, DOC_TYPE.FV].includes(item.codigo));
                }

            }

            function isValidFilter() {
                if (!($scope.dataSearch.idTipoDocOrigen > 0)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione el documento Origen'
                    })
                    return
                }

                if (!($scope.dataSearch.idTipoDocDestino > 0)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione el documento Destino'
                    })
                    return
                }

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

                $scope.dataSearch.checkBoxFecha = true;
                if (fS.isValidField($scope.dataSearch.nroSecuencial)) {
                    if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
                        tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                        return
                    }
                    $scope.dataSearch.checkBoxFecha = false;
                }

                return true;
            }

            $scope.onChangeEstab = async function () {
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
                        clearDocs()

                        let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.dataSearch.codEstab);

                        $scope.ptosEmision = dataEstab.puntosEmision;

                        let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                        $scope.dataSearch.idPuntoEmision = dataPtoEmi.idPuntoEmision;
                        $scope.dataClone.codEstab = $scope.dataSearch.codEstab;

                        getDocs()
                        $scope.$apply()

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
                $scope.dataSearch.fechaInicio = item.startDate;
                $scope.dataSearch.fechaFin = item.endDate;

                getDocs()

            }

            $scope.onKeyupCliente = function () {
                if (fS.isValidField($scope.cliente.nombreCliente)) {
                    $scope.dataSearch.byCliente = 0;
                    clearDocs()
                }
            }

            $scope.selectedClienteSearch = function (item) {
                $scope.cliente = item;
                $scope.cliente.nombreCliente = item.nombreFiscal;
                clearDocs();
                getDocs()

            }

            $scope.getDocs = getDocs;

            function getDataTipoDocOrigen() {
                let dataTipoDocOrigen = $scope.tiposDocOrigen.find(item => item.idTipoDocumento === $scope.dataSearch.idTipoDocOrigen);
                if (!dataTipoDocOrigen) {
                    tS.toastr({

                        type: 'warning',
                        message: 'Seleccione un tipo de documento origen válido'
                    })
                    return null;

                }
                return dataTipoDocOrigen;
            }

            function getDocs() {

                if (!isValidFilter()) return;

                const dataTipoDocOrigen = getDataTipoDocOrigen();
                if (!dataTipoDocOrigen) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione un tipo de documento origen válido'
                    })
                    return
                }

                if (dataTipoDocOrigen.codigo === DOC_TYPE.NE) {
                    getNotasEntrega();
                    return
                }
                if (dataTipoDocOrigen.codigo === DOC_TYPE.PR) {
                    getProformas();
                    return
                }
                tS.toastr({
                    type: 'warning',
                    message: 'Tipo de documento origen no soportado'
                })

            }

            function getDataSearchNotasEntrega() {
                return {
                    codEstab: $scope.dataSearch.codEstab,
                    byCliente: $scope.cliente.idCliente,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    //codEstado: "PAPR",
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision > 0 ? $scope.dataSearch.idPuntoEmision : null,
                    convertToDoc: false,
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
                }
            }

            function getNotasEntrega() {
                //  clearDocs()
                notaEntregaSvc.getAll(getDataSearchNotasEntrega()).then(async (response) => {
                    let { notaEntregas } = response;
                    if (notaEntregas.length > 0) {
                        openModalDocs(notaEntregas, getDataSearchNotasEntrega(), notaEntregaSvc.getAll)
                    } else {
                        tS.toastr({
                            type: 'info',
                            message: 'No se encontró los resultados'
                        })
                    }
                })
            }

            function getDataSearchProformas() {
                return {
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision > 0 ? $scope.dataSearch.idPuntoEmision : 0,
                    byCliente: $scope.cliente.idCliente,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstado: "PE",
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
                }
            }

            function getProformas() {
                //    clearDocs()
                proformaSvc.getAll(getDataSearchProformas()).then(response => {
                    const { proformas } = response;
                    if (proformas.length > 0) {
                        openModalDocs(proformas, getDataSearchProformas(), proformaSvc.getAll)
                    } else {
                        tS.toastr({
                            type: 'info',
                            message: 'No se encontró los resultados'
                        })
                    }

                })
            }


            function openModalDocs(docs, dataSearch, $getDocs) {

                let modalRef = modalSvc.openWithComponent({
                    component: 'modalDocs',
                    size: 'xl',
                    params: {
                        docs,
                        dataSearch,
                        $getDocs,
                        setDocs
                    }
                })
                modalRef.result.then(result => {
                    if (result && typeof result === 'object' && result.docs.length > 0) {
                        setDocs(result.docs)
                    }
                })
            }

            function setDocs(data) {
                const mergedArray = [
                    ...new Map([...$scope.docsSelected, ...data].map(item => [item.idDocumento, item])).values()
                ];
                $scope.docsSelected = mergedArray;
            }

            $scope.askToRemoveDoc = function (item) {
                let index = $scope.docsSelected.indexOf(item);
                if (index !== -1) {
                    $scope.docsSelected.splice(index, 1)
                }
            }

            $scope.verItems = function (item) {
                const { codigo } = getDataTipoDocOrigen()

                let fnGetItems = function () { }

                if (codigo === DOC_TYPE.NE) {
                    fnGetItems = notaEntregaSvc.getDetalleDoc
                }

                if (codigo === DOC_TYPE.PR) {
                    fnGetItems = proformaSvc.getDetalleDoc
                }

                modalSvc.openWithComponent({
                    component: 'modalItems',
                    size: 'xl',
                    params: {
                        item,
                        mainDataForm,
                        fnGetItems
                    }
                })
            }


            function obtenerDetallesDoc() {
                const { codigo } = getDataTipoDocOrigen()
                let promises = null;

                if (codigo === DOC_TYPE.NE) {

                    promises = $scope.docsSelected.map(item => notaEntregaSvc.getDetalleDoc(item.idDocumento));
                }

                if (codigo === DOC_TYPE.PR) {
                    promises = $scope.docsSelected.map(item => proformaSvc.getDetalleDoc(item.idDocumento));
                }
                return Promise.all(promises)
                    .then(results => {
                        let detalles = results.flatMap(item => item.items).map((item, i) => ({ ...item, n: i + 1 }))
                        return detalles;
                    })
                    .catch(error => {
                        console.error('Al menos una solicitud falló:', error);
                        // Manejar el error
                    })
            }


            $scope.continuar = function () {
                if (!($scope.dataSearch.idTipoDocDestino > 0)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione el documento Destino'
                    })
                    return
                }

                if (!fS.isValidField($scope.dataSearch.codEstab)) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Establecimiento no seleccionado'
                    })
                    return
                }

                if (!($scope.cliente.idCliente > 0)) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }

                if ($scope.docsSelected.length === 0) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione al menos un documento'
                    })
                    return
                }
                // const { docDestino, docOrigen } = getDataTipoDocOrigen()

                obtenerDetallesDoc().then(detalles => {

                    if (detalles.length > 300) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Advertencia',
                            text: 'El número máximo de items permitidos es 300.',
                            confirmButtonText: 'Aceptar'
                        });
                        return;
                    }


                    let modalRef = modalSvc.openWithComponent({
                        component: 'modalAddEditAprobarDoc',
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                        params: {
                            docsSelected: structuredClone($scope.docsSelected),
                            cliente: structuredClone($scope.cliente),
                            detalles,
                            mainDataForm,
                            codEstab: $scope.dataSearch.codEstab,
                            idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                            idTipoDocDestino: $scope.dataSearch.idTipoDocDestino,
                            idTipoDocOrigen: $scope.dataSearch.idTipoDocOrigen,
                            tiposDocDestino: $scope.tiposDocDestino,
                            tiposDocOrigen: $scope.tiposDocOrigen,
                            // data: $scope.data,
                            // estabs: $scope.establecimientos,


                        }
                    })

                    modalRef.result.then(result => {
                        if (result && typeof result === 'object') {
                            $ctrl.close({
                                $value: result
                            });
                        }
                    })

                })

                // if ($scope.cliente.tipoIdentificacion === 'CF' &&  docDestino.codDoc === DOC_TYPE.FV_SRI && $scope.data.total > 50) { 
                //     Swal.fire({
                //         icon: 'warning',
                //         html: `<small>El importe total de los documentos seleccionados supera los 50 USD por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b></small>`,
                //         confirmButtonText: 'Aceptar'
                //     })
                //     return
                // }
                // if ($scope.data.total <= 0) {
                //     tS.toastr('warning', 'No se puede generar el documento con valor total 0!');
                //     return
                // }



            }


            $scope.close = function () {
                $ctrl.close();
            }

        }]

    })


    app.component('modalDocs', {
        templateUrl: `${mainPath}_ModalDocs.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
            isNotModal: '='
        },
        controller: ['$scope', '$injector', function ($scope, $injector) {
            const $ctrl = this;

            $scope.recordsQuantity = [10, 25, 50, 100];

            $scope.docs = []
            $scope.docsSelected = [];

            $scope.optionsTable = {
                rowSelection: true,
                multiSelect: true,
                autoSelect: true
            }

            $scope.dataSearch = {};

            let $getDocs = function () { }
            let $setDocs = function () { }

            $ctrl.$onInit = function () {
                const { dataSearch, docs, $getDocs: fnGetDocs, setDocs } = $ctrl.resolve.params;

                $scope.dataSearch = structuredClone(dataSearch);
                $scope.dataSearch.maxSize = 5;
                $scope.docs = structuredClone(docs);
                $scope.dataSearch.totalRecords = $scope.docs.length > 0 ? $scope.docs[0].totalRecords : 0;
                $getDocs = fnGetDocs
                $setDocs = setDocs

            }

            $scope.pageChanged = function () {
                loadDocs()
            };


            $scope.changePageSize = function () {
                $scope.dataSearch.pageIndex = 1;
                loadDocs()
            };

            function loadDocs() {
                $scope.docsSelected = [];
                // $scope.dataSearch.totalRecords  = 0;
                $getDocs($scope.dataSearch).then(response => {

                    $scope.docs = response.notaEntregas || response.proformas;

                    $scope.dataSearch.totalRecords = $scope.docs.length > 0 ? $scope.docs[0].totalRecords : 0;
                })
            }


            $scope.addDocClose = function () {
                $ctrl.close({
                    $value: {
                        docs: $scope.docsSelected
                    }
                })
            }

            $scope.addDoc = function () {
                $setDocs($scope.docsSelected)
            }



            $scope.close = function () {
                $ctrl.close()
            }

        }]
    })



    app.component('modalItems', {
        templateUrl: `${mainPath}_ModalItems.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
            isNotModal: '='
        },
        controller: ['$scope', '$injector', function ($scope, $injector) {
            const $ctrl = this;

            const fS = $injector.get('formulario');

            //GridOptions Invoice 
            $scope.gridOptionsDetalle = {
                enableColumnMenus: false,
                enableColumnReordering: true,
                showGridFooter: false,
            }

            $scope.tarifasImpuesto = [];
            $scope.bodegas = [];

            $ctrl.$onInit = function () {
                const { item, fnGetItems, mainDataForm } = $ctrl.resolve.params;
                $scope.tarifasImpuesto = mainDataForm.tarifasImpuesto;
                setColumnDefs()


                fnGetItems(item.idDocumento).then(response => { 
                    $scope.gridOptionsDetalle.data = response.items;
                })
            }


            function setColumnDefs() {
                $scope.gridOptionsDetalle.columnDefs = [
                    {
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
                        name: 'I.V.A',
                        field: 'idTipoIva',
                        width: '8%',
                        minWidth: '100',
                        type: 'number',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
                        cellFilter: 'cellFilterTipoIva:this',
                        editDropdownValueLabel: 'descripcion',
                        editDropdownIdLabel: 'idTipoIva',
                        //    visible: config.porcentajeIva
                    },
                    {
                        name: 'Tarifa',
                        field: 'idTarifa',
                        width: '9%',
                        minWidth: '80',
                        cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
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
                        type: 'number',
                        width: '8%',
                        minWidth: '90',
                    },
                    {
                        name: 'P. Iva',
                        field: 'precioConIva',
                        min: 0,
                        type: 'number',
                        width: '7%',
                        minWidth: '90',
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                    },
                    {
                        name: 'Desc.',
                        field: 'valorDescuento',
                        min: 0,
                        type: 'number',
                        width: '4%',
                        minWidth: '65',
                    },
                    {
                        name: 'SubTotal',
                        field: 'precioTotalSinImpuesto',
                        enableCellEdit: false,
                        allowCellFocus: false,
                        type: 'number',
                        width: '9%',
                        minWidth: '50',
                        visible: true,
                        cellFilter: fS.cellFilterRoundToNumber(),
                        cellTooltip: function (row, col) {
                            return fS.cellTooltipGrid(row.entity, col.field)
                        },
                    },
                    {
                        name: 'Iva',
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
                            if (row.entity[col.field]) {
                                return fS.cellTooltipGrid(row.entity, col.field)
                            }
                            return 0;
                        },

                    },
                ]

                let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
                // let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');

                $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
                //  $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
            }




            $scope.close = function () {
                $ctrl.close()
            }

        }]
    })




})()