(() => {

    'use strict';

    //Variables Constantes
    const URL_TEMPLATE = '~/Pages/NotaCredito/'

    //Variable servicios 
    let notaCreditoSvc = {};
    let commonSvc = {};
    let modalSvc = {};
    let fS = {};
    let tS = {};
    let clienteSvc = {};

    let mainDataForm = {}


    //main Controller Ctrl
    app.controller('notaCreditoClienteCtrl', notaCreditoClienteCtrl);

    notaCreditoClienteCtrl.$inject = [
        '$scope',
        '$injector',
        'decodeToken'
    ]

    function notaCreditoClienteCtrl($scope, $injector, decodeToken) {

        notaCreditoSvc = $injector.get('notaCreditoService');
        commonSvc = $injector.get('commonService');
        modalSvc = $injector.get('modalService');
        fS = $injector.get('formulario');
        tS = $injector.get('toastService');
        clienteSvc = $injector.get('clienteService');

        const TIPO_DOC = commonSvc.tipoDoc['NC'];

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000,
            checkBoxFecha: true
        }

        $scope.cliente = {

        }
        let idUsuarioRol = Number(decodeToken.idUsuarioRol)

        //---------------------------------Busqueda Avanzada ----------------------------------
        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getNotaCreditos();
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
            $scope.getNotaCreditos();
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
            let notaCreditos = JSON.parse(JSON.stringify($scope.cloneNotaCreditos));
            $scope.notaCreditos = $filter("filter")(notaCreditos, $scope.dataSearch.bySearch);
            // $scope.calculoColumnTotal();
        }

        //=====================Eend Filters=======================

        $scope.getNotaCreditos = function () {
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

                showLoader();
                let dataSearch = {
                    tipo: 1,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    byUsuario: $scope.dataSearch.byUsuario,
                    idEstadoDocumento: $scope.dataSearch.idEstadoDocumento,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                }


                $scope.notaCreditos = [];
                notaCreditoSvc.get(dataSearch).then(response => {
                    $scope.notaCreditos = response || [];
                    $scope.cloneNotaCreditos = JSON.parse(JSON.stringify($scope.notaCreditos))
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)

            }
        }

        $scope.initiload = () => {

            showLoader();
            notaCreditoSvc.get({ tipo: 3 }).then(response => {
                hideLoader();
                $scope.establecimientos = response.estabs;
                $scope.estadoDocumentos = response.estadosDoc;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getNotaCreditos();
                }
            }).catch(() => {
                hideLoader();
            })

            notaCreditoSvc.get({ tipo: 2 }).then(response => {
                mainDataForm = response;
                console.log(response)
            })

        }
        $scope.initiload();

        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
            $scope.getNotaCreditos();
        }

        $scope.openModalParam = ({ controller, template, size = 'xl', params }) => {
            modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                windowClass: 'uibModalFullScreen',
                isRenderRazorPartial: true
            }).result.then(result => {

                if (typeof result === 'object') {
                    $scope.getNotaCreditos();
                }
            })
        }


        $scope.openModalNew = async () => {

            // let { MODAL_FILE_CTRL, MODAL_NUEVO } = nombreModalConst.nota_credito_cliente;
            // let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
            // let template = MODAL_NUEVO['template'];
            // let params = {
            //     TIPO_REGISTRO: 'NUEVO'
            // }
            $scope.openModalParam({
                controller: 'modalNotaCreditoCtrl',
                template: URL_TEMPLATE + '_ModalNuevo.cshtml',
                params: {
                    mainDataForm
                }
            })
        }


        $scope.openModalDetalle = async (item) => {
            try {
                let { MODAL_FILE_CTRL, MODAL_DETALLE } = nombreModalConst.nota_credito_cliente;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
                let template = MODAL_DETALLE['template'];
                let response = await commonSvc.getDataTipoDocVenta({
                    id: item.idNotaCredito,
                    codigoDocumento: TIPO_DOC.codigo
                })

                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'DETALLE',
                    data: response
                }

                $scope.openModalParam({
                    controller,
                    template,
                    params
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.openModalEditar = async (item) => {
            try {
                showLoader();
                let { MODAL_FILE_CTRL, MODAL_EDITAR } = nombreModalConst.nota_credito_cliente;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
                let template = MODAL_EDITAR['template'];

                let response = await commonSvc.getDataTipoDocVenta({
                    id: item.idNotaCredito,
                    codigoDocumento: TIPO_DOC.codigo
                })


                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'EDITAR',
                    data: response
                }
                $scope.openModalParam({
                    controller,
                    template,
                    params
                })
            } catch (error) {

                console.log(error)
            } finally {
                hideLoader();
            }
        }




        $scope.askToDelete = async (item) => {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: '<small>Anular Nota Credito?</small>',
                    html: `<small>Esta Ud. seguro/a de anular este documento <b>N° ${item.nroDoc}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    showLoader();
                    notaCreditoSvc.delete(item.idNotaCredito).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code == "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.getNotaCreditos();
                        }
                    }).finally(() => hideLoader())
                }
            } catch (error) {
                console.log(error)
            } finally {
                Swal.close()
            }

        }


        $scope.getReport = (item) => {
            try {
                let format = 'pdf';
                const parameters = {
                    dataParams: JSON.stringify({
                        id: item.idNotaCredito,
                        normalMethod: true,
                    }),
                    reportParams: JSON.stringify({
                        codEstab: item.codEstab,
                        codigo: 'RNCC',
                        format,
                    }),
                    hasService: true,
                }

                commonSvc.getReport({ parameters, format })
            } catch (error) {
                console.log(error)
            }
        }


    }



    app.controller('modalNotaCreditoCtrl', modalNotaCreditoCtrl);

    modalNotaCreditoCtrl.$inject = ['$scope', '$timeout', '$uibModalInstance', 'facturaService'];

    function modalNotaCreditoCtrl($scope, $timeout, $uibModalInstance, facturaSvc) {

        let { estabs, decimal, tarifaImpuestoVigente, tarifasImpuesto, tarifas, config, vendedores } = mainDataForm;

        $scope.establecimientos = estabs;
        $scope.decimal = decimal;
        $scope.tarifaImpuestoVigente = tarifaImpuestoVigente;
        $scope.tarifasImpuesto = tarifasImpuesto;
        $scope.tarifas = tarifas;
        $scope.config = config;
        $scope.vendedores = vendedores;

        $scope.clienteSearch = {};
        $scope.cliente = {};

        let COD_DOC_FV = 'FV';



        //let formattedDateTime = moment(new Date()).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss");        
        $scope.data = {
            fechaEmision: new Date()
        };
        $scope.dataClone = {};

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
                    // setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                // if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                //     rowEntity[colDef.field] = oldValue;
                // }

                // const objCalculo = self.uiGridInvoice.calculoColDef(rowEntity, oldValue)
                // objCalculo[colDef.field] && objCalculo[colDef.field]();
                // objCalculo["calculoTotalDetalle"]();
                // self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

            })
        }


        initiload();
        setColumnDefs()

        function initiload() {
            try {

                let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                $scope.puntosEmision = dataEstab.puntosEmision;
                $scope.bodegas = dataEstab.bodegas;

                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataClone.codEstab = dataEstab.codEstab;

                if ($scope.puntosEmision.length > 0) {
                    $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                } else {
                    tS.toastr('warning', 'No tienes asignados puntos de emisión')
                }

                if ($scope.bodegas.length > 0) {
                    $scope.data.idBodega = $scope.bodegas.find(ptoEmi => (ptoEmi.defaultBodega)).idBodega;
                    $scope.dataClone.idBodega = $scope.data.idBodega;
                } else {
                    tS.toastr('warning', 'No tienes asignados bodegas')
                }

                if ($scope.vendedores.length > 0) {
                    $scope.data.idUsuario = $scope.vendedores.find(item => (item.predeterminado)).idUsuario
                } else {
                    $scope.data.idUsuario = 0;
                }

                $scope.data.tarifa = $scope.tarifaImpuestoVigente.tarifa;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas.find(tarifa => (tarifa.predeterminada)).idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }


        function setColumnDefs(width = '5%') {
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

            const ventaDetailPermission = defaultPermission;
            const CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

            <a ng-if="articlePermission.editar" ng-click="grid.appScope.$ctrl.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >`;

            $scope.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width,
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
                enableCellEdit: ventaDetailPermission.medida.update,
                enableCellEditOnFocus: ventaDetailPermission.medida.update,
                allowCellFocus: ventaDetailPermission.medida.update,
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
                enableCellEdit: ventaDetailPermission.tipoIva.update,
                allowCellFocus: ventaDetailPermission.tipoIva.update,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva.update,
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
                enableCellEdit: ventaDetailPermission.tarifa.update,
                enableCellEditOnFocus: ventaDetailPermission.tarifa.update,
                allowCellFocus: ventaDetailPermission.tarifa.update,
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
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario.update : true;
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
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva.update : true;
                },
                // cellFilter: "currency:'$'",
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: ventaDetailPermission.porcentajeDescuento.update,
                allowCellFocus: ventaDetailPermission.porcentajeDescuento.update,
                enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento.update,
                min: 0,
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'%'",
                visible: ventaDetailPermission.porcentajeDescuento.update || false,
                type: 'number',
                /*cellFilter: "limitTo:3",*/
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento.update,
                enableCellEditOnFocus: ventaDetailPermission.descuento.update,
                allowCellFocus: ventaDetailPermission.descuento.update,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: ventaDetailPermission.descuento.update || false
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

            setWarehouseAndIVA();
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
         * @param {string} textSearch 
         * @returns 
         */
        $scope.clienteSearchDynamic = async function (textSearch) {
            try {
                if (textSearch.length < 3) return;
                let response = await commonSvc.clienteSearch(textSearch)

                if (response) return response;
            } catch (error) {
                console.log('Error search cliente', error)
            }
        }

        $scope.onKeyupSearchCliente = function () {
            if (!$scope.cliente.nombreFiscal) {
                $scope.cliente = {};
                $scope.data.idFactura = 0;
                $scope.nroFactura = '';
            }
        }


        $scope.onSelectedClienteChange = async function (item) {
            try {
                if (item.tipoIdentificacion == 'CF') {
                    Swal.fire({
                        icon: 'warning',
                        html: '<p>A nombre de consumir final no se puede generar el Documento Nota de Crédito</p>'
                    })
                    return
                }

                let dataCliente = await clienteSvc.findById(item.idCliente)
                $scope.cliente = dataCliente;
                getInvoiceByCustomer();
            } catch (error) {
                $scope.cliente = {};
                console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            }
        }

        function getInvoiceByCustomer() {
            try {
                showLoader();
                $scope.facturas = [];
                $scope.data.idFactura = 0;
                $scope.nroFactura = '';
                $scope.gridOptions.data = [];

                let json = {
                    byCliente: $scope.cliente.idCliente,
                    codEstab: $scope.data.codEstab,
                }

                facturaSvc.getForCreditNote(json).then(response => {
                    $scope.facturas = response.facturas || [];
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                console.log(error)
            }
        }

        $scope.onKeyupInvoice = function () {
            if (!$scope.nroFactura) {
                $scope.data.idFactura = 0;
                $scope.nroFactura = '';
                $scope.gridOptions.data = [];
                // $scope.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            }
        }

        $scope.selectedInvoiceChange = function (item) {
            $scope.data.idFactura = item.idDocumento;
            $scope.nroFactura = item.nroFactura;
            $scope.getDataFactura();
        }

        $scope.getDataFactura = async function () {
            try {
                showLoader();
                let response = await commonSvc.getDataTipoDocVenta({
                    id: $scope.data.idFactura,
                    codigoDocumento: COD_DOC_FV
                })

                if (!response.isComplete) return

                $scope.gridOptions.data = response.detalleDocumento;
                //$scope.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }


        console.log('modal')
        $scope.closeModal = () => {
            $uibModalInstance.close();
        }
    }

})(window.angular)