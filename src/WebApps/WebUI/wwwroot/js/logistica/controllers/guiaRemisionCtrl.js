(function () {

    'use strict';

    //Variables Constantes
    const URL_TEMPLATE = '~/Pages/GuiaRemision/Shared/'

    let guiaRemisionSvc = {};
    let commonSvc = {};
    let clienteSvc = {};
    let fS = {};
    let tS = {};

    let establecimientos = [];

    app.controller('guiaRemisionCtrl', guiaRemisionCtrl);

    guiaRemisionCtrl.$inject = ['$scope', '$injector', '$filter', 'modalService', 'decodeToken'];

    function guiaRemisionCtrl($scope, $injector, $filter, modalSvc, decodeToken) {


        guiaRemisionSvc = $injector.get('guiaRemisionService');
        commonSvc = $injector.get('commonService');
        clienteSvc = $injector.get('clienteService');
        fS = $injector.get('formulario');
        tS = $injector.get('toastService');

        let idUsuarioRol = Number(decodeToken.idUsuarioRol);

        $scope.estadosDocumento = [
            { codigo: 'AUTH', descripcion: 'AUTORIZADO' },
            { codigo: 'NAUTH', descripcion: 'NO AUTORIZADO' },
        ]
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 50,
            checkBoxDate: true
        };

        $scope.openModalNew = function () {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: 'ModalGuiaRemisionCtrl',
                    template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
                    params: {},
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })

                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getGuiasRemision();
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
            $scope.getGuiasRemision();
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
                $scope.dataSearch.checkBoxDate = true;
            }
        }

        $scope.selectedClienteSearchFiltro = function (item) {
            $scope.dataSearch.byCliente = item.idCliente;
            $scope.dataSearch.checkBoxDate = true;
            $scope.getGuiasRemision();
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
            let guiasRemision = JSON.parse(JSON.stringify($scope.cloneGuiasRemision));
            $scope.guiasRemision = $filter("filter")(guiasRemision, $scope.dataSearch.bySearch);

        }

        //=====================Eend Filters=======================

        $scope.getGuiasRemision = function () {
            try {

                if ($scope.dataSearch.nroSecuencial) {
                    if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
                        $scope.dataSearch.checkBoxDate = true;
                        tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                        return
                    }
                    if (!($scope.dataSearch.byCliente > 0)) {
                        $scope.dataSearch.checkBoxDate = false;
                    }
                }

                showLoader();
                $scope.guiasRemision = [];
                $scope.cloneGuiasRemision = [];

                let query = {
                    tipo: 1,
                    codEstab: $scope.dataSearch.codEstab,
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    checkBoxDate: $scope.dataSearch.checkBoxDate,
                    idCliente: $scope.dataSearch.byCliente,
                    codEstado: $scope.dataSearch.codEstado,
                    byUsuario: $scope.dataSearch.byUsuario,
                    fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    secuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                }

                guiaRemisionSvc.get(query).then(response => {
                    $scope.guiasRemision = response;
                    $scope.cloneGuiasRemision = JSON.parse(JSON.stringify($scope.guiasRemision))
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                }).finally(() => hideLoader())

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.initiload = function () {
            showLoader();
            guiaRemisionSvc.get({ tipo: 2 }).then(response => {
                establecimientos = response.estabs;
                $scope.establecimientos = response.estabs;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getGuiasRemision();
                }
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
        }
        $scope.initiload();

        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            if ($scope.puntosEmision.length > 0) {
                $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                $scope.getGuiasRemision();
            } else {
                fS.sweetAlert('warning', "No posee puntos de emisión asignadas!");
            }
        }



        $scope.openModalEdit = function (item) {
            try {

                showLoader();
                commonSvc.getDataGuiaRemision(item.idGuiaRemision).then(response => {
                    hideLoader();
                    if (!response.isComplete) throw response

                    let modalRef = modalSvc.openModalCustom({
                        controller: 'ModalGuiaRemisionCtrl',
                        template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
                        params: response,
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })

                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.getGuiasRemision();
                        }
                    })
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })

            } catch (error) {
                console.log(error);
            }
        }

        $scope.openModalDetalle = async function (item) {
            try {

                showLoader();
                await commonSvc.viewDetailDocument({
                    id: item.idGuiaRemision,
                    codigoDocumento: 'GR',
                    isRenderRazorPartial: true
                })
                hideLoader();
            } catch (error) {
                hideLoader();
                console.log(error);
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

                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    title: '<small>Anular Documento?</small>',
                    html: "<small>Este proceso no se puede revertir!</small>",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                })

                if (isConfirmed) {
                    showLoader();
                    guiaRemisionSvc.delete(item.idGuiaRemision).then(response => {
                        hideLoader()
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            hideLoader()
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.getGuiasRemision();
                        }
                    }).catch(err => {
                        hideLoader();
                        console.log(err)
                    })
                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        //Reporte 
        $scope.getReport = (item) => {
            try {
                let format = 'pdf';
                let parameters = {
                    dataParams: JSON.stringify({
                        id: item.idGuiaRemision,
                        normalMethod: true,
                    }),
                    reportParams: JSON.stringify({
                        codEstab: item.codEstab,
                        codigo: 'RGR',
                        format,
                    }),
                    hasService: true,
                }

                commonSvc.getReport({
                    parameters,
                    format
                })


            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }


    }


    /**
     * =====================================MODAL GUIA-REMISION================================= 
     * 
     */
    app.controller('ModalGuiaRemisionCtrl', ModalGuiaRemisionCtrl);
    ModalGuiaRemisionCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'transportistaService',
        'vehiculoService', 'params',];

    function ModalGuiaRemisionCtrl($scope, $uibModalInstance, $timeout, transportistaSvc,
        vehiculoSvc, params) {

        $scope.tipoDoc = {
            codigo: 'GR'
        }

        $scope.searchClienteOptions = {}
        $scope.searchClienteOptions.showBtnNew = true;
        $scope.searchClienteOptions.showBtnList = true;

        $scope.data = {}
        $scope.data.fechaEmision = new Date()
        $scope.data.fechaInicio = new Date();
        $scope.data.fechaFin = new Date();

        $scope.dataClone = {}

        $scope.establecimientos = establecimientos;

        $scope.gridOptionsDetalle = {
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            enableCellEdit: true,
        }

        $scope.gridOptionsDetalle.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }


            gridApi.grid.element.on('keyup', function (ev) {
                if (ev.which == 13 || ev.keyCode == '13') {
                    setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {

                if ([undefined, null, ""].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }
                if (colDef.field == "cantidad" && rowEntity.cantidad === 0) {
                    rowEntity.cantidad = oldValue;
                }
                if (colDef.field === "cantidad") {
                    rowEntity.cantidad = fS.roundNumber(newValue, 5);
                }

            })
        }

        $scope.gridOptionsDetalle.columnDefs = [{
            name: 'N°',
            field: 'n',
            type: 'number',
            width: '5%',
            minWidth: '50',
            enableCellEdit: false,
            allowCellFocus: false
        },
        {
            name: "Código",
            field: "codigo",
            type: 'string',
            width: '8%',
            minWidth: '50',
            enableCellEdit: false,
            allowCellFocus: false
        },
        {
            name: 'Descripcion',
            field: 'descripcion',
            type: 'string',
            width: '65%',
            minWidth: '150',
            enableCellEditOnFocus: true,
            cellEditableCondition: function (scope) {
                return scope.row.entity.llevaInventario !== true;

            },
            cellTooltip: function (row) {
                return row.entity.descripcion
            }
        },
        {
            name: "Cantidad",
            field: 'cantidad',
            type: "number",
            width: '10%',
            minWidth: '100',
            allowCellFocus: true,
            enableCellEditOnFocus: true
        },
        {
            name: 'Op',
            enableCellEdit: false,
            enableColumnMenu: false,
            allowCellFocus: false,
            width: '11%',
            minWidth: '100',
            cellTemplate: `<div class="text-center"><button type="button" class="btn btn-success btn-sm text-white" style="cursor:pointer;" title="Editar Item" ng-click="grid.appScope.openModalArticuloEditar(row.entity)"><i class="ti-pencil"></i></button>
                                <button type="button" class="btn btn-danger btn-sm text-white" style="cursor:pointer;" title="Eliminar Item" ng-click="grid.appScope.deleteRow(row.entity)"><i class="ti-trash"></i></button></div>`,
        },
        {
            name: '',
            field: 'goBackArticulo',
            enableCellEdit: false,
            width: '1%'
        },
        ]

        $scope.cliente = {};
        $scope.transportista = {};
        $scope.vehiculo = {};
        $scope.empleado = {};
        $scope.infoAdicionalDocumento = [];

        initiload();
        async function initiload() {
            try {

                if (typeof params.dataDocumento === 'object' && params.dataDocumento.idGuiaRemision > 0) {
                    $scope.tipoRegistro = 2;
                    $scope.titleModal = 'Actualizar';
                    $scope.iconBtnSave = 'ti-save';

                    $scope.searchClienteOptions.showBtnNew = true;
                    $scope.searchClienteOptions.showBtnList = true;
                    $scope.searchClienteOptions.showBtnEdit = true;


                    let {
                        dataDocumento,
                        cliente,
                        transportista,
                        vehiculo,
                        empleado,
                        detalleDocumento,
                        infoAdicionalDocumento
                    } = params;
                    $scope.data = dataDocumento;
                    $scope.cliente = cliente;
                    $scope.transportista = transportista;

                    $scope.vehiculo = vehiculo;
                    $scope.empleado = empleado;

                    $scope.infoAdicionalDocumento = infoAdicionalDocumento;

                    let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab)
                    $scope.puntosEmision = dataEstab.puntosEmision;

                    $scope.gridOptionsDetalle.data = detalleDocumento;
                    enumGridOptions()

                } else {
                    $scope.tipoRegistro = 1;
                    $scope.titleModal = 'Guardar';
                    $scope.iconBtnSave = 'ti-save';

                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));

                    $scope.data.codEstab = dataEstab.codEstab;
                    $scope.dataClone.codEstab = dataEstab.codEstab;

                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.data.idPuntoEmision = $scope.puntosEmision.length > 0 ? $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision : 0;

                }
            } catch (error) {
                console.log(error);
            }
        }


        //===========================Establecimiento==================== 
        $scope.onChangeEstablecimiento = async function () {
            try {

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: '<small>Cambiar Establecimiento?</small>',
                    html: "<small>Esta seguro de cambiar el <b>Establecimiento</b> y el <b>Punto de Emisión</b>?</small>",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (isConfirmed) {
                    $scope.dataClone.codEstab = $scope.data.codEstab;

                    const dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.data.idPuntoEmision = $scope.puntosEmision.length > 0 ? $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision : 0;
                    $scope.$apply();
                } else {
                    $scope.data.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                }

            } catch (error) {
                console.trace(error)
            }
        }


        $scope.selectedItemCliente = function (item) {
            $scope.cliente = item;
        }

        //----------------------------TRANSPORTISTA----------------------

        $scope.onKeyupTransportistaSearch = function () {
            if (!$scope.transportista.nombre) {
                $scope.transportista = {};
            }
        }

        $scope.transporteSearch = function (bySearch) {
            const json = {
                typeList: 2,
                bySearch
            }
            if (bySearch.length > 2) {
                return transportistaSvc.getAll(json);
            }
        }

        $scope.selectedTransportstaChange = function (data) {
            $scope.transportista = data;
        }

        $scope.vehiculoSearch = function (textSearch) {
            const json = {
                textSearch
            }

            if (textSearch.length > 2) {
                return vehiculoSvc.search(json);
            }
        }


        $scope.onKeyupVehiculoSearch = function () {
            if (!$scope.vehiculo.placa) {
                $scope.vehiculo = {}
            }
        }

        $scope.selectedVehiculoChange = function (item) {
            $scope.vehiculo = item;
        }

        $scope.resultModalVehiculo = function (result) {
            try {
                if (typeof result == 'object') {
                    $scope.vehiculo = result;
                }
            } catch (error) {
                console.log(error)
            }

        }

        $scope.empleadoSearch = function (textSearch) {
            return commonSvc.querySearchEmpleado(textSearch);
        }

        $scope.onKeyupSearchEmpleado = function () {
            if (!$scope.empleado.nombreCompleto) {
                $scope.empleado = {};
            }
        }

        $scope.selectedEmpleadoChange = function (item) {
            $scope.empleado = item;
        }

        //==========================Detalle==========================      
        $scope.indexRowDetalle = null;
        $scope.setItemArticuloEnDetalle = function (item) {

            try {

                showLoader();
                let { articulo } = item;

                let entity = {};

                if ([null, undefined].includes($scope.indexRowDetalle)) {
                    $scope.addRow()
                    $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.findIndex(value => value.idArticulo === 0);

                }

                entity = $scope.gridOptionsDetalle.data[$scope.indexRowDetalle];

                entity.idArticulo = articulo.idArticulo,
                    entity.codigo = articulo.codigoArticulo,
                    entity.descripcion = articulo.descripcion,
                    entity.llevaInventario = articulo.llevaInventario
                entity.cantidad = entity.cantidad + 1;


                enumGridOptions();
                $scope.focusColumnCantidad();
                hideLoader();
            } catch (error) {
                console.log(error)
                hideLoader();
            }

        }


        $scope.addRow = function () {
            $scope.gridOptionsDetalle.data.push({
                n: 0,
                idGuiaRemisionDetalle: 0,
                idArticulo: 0,
                codigo: null,
                descripcion: null,
                llevaInventario: false,
                cantidad: 0
            })
        }
        function enumGridOptions() {
            let index = 1;
            for (let item of $scope.gridOptionsDetalle.data) {
                item.n = index++;
            }
        }


        $scope.focusColumnCantidad = function () {
            let index = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'cantidad')
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


        $scope.setFocusArticulo = function () {
            setTimeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
        }


        $scope.openModalArticuloEditar = function (item) {
            $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.indexOf(item);
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptionsDetalle.data[0],
                $scope.gridOptionsDetalle.columnDefs[2]
            )
            $scope.$broadcast("editArticulo", item)
        }


        $scope.deleteRow = async function (row) {
            let index = $scope.gridOptionsDetalle.data.indexOf(row);

            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                html: `<small>¿Desea eliminar el artículo ${row.descripcion}?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                $scope.gridOptionsDetalle.data.splice(index, 1);
                enumGridOptions();
                $scope.$apply()
            }
        }



        //Información Adicional del Documento 
        $scope.resultModalInfoAdicional = function (infoAdicionalDocumento) {
            $scope.infoAdicionalDocumento = infoAdicionalDocumento
        }



        $scope.save = async function () {
            try {

                if (!$scope.data.codEstab) {
                    tS.toastr('warning', 'Seleccione el Establecimiento');
                    return
                }

                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.toastr('warning', 'Seleccione el Pto. Emisión');
                    return
                }

                if (!$scope.data.fechaEmision) {
                    tS.toastr('warning', 'Ingrese la Fecha de Emisión');
                    return
                }

                if (!($scope.cliente.idCliente > 0)) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }

                if (!$scope.data.fechaInicio) {
                    tS.toastr('warning', 'Ingrese Fecha de Inicio');
                    return
                }
                if (!$scope.data.fechaFin) {
                    tS.toastr('warning', 'Ingrese Fecha de Fin');
                    return
                }
                if (!(Date.parse(this.data.fechaFin) <= Date.parse($scope.data.fechaInicio))) {
                    tS.toastr('warning', 'Fecha Fin no tiene que ser menor al Fecha de Inicio');
                    return
                }
                if (!($scope.transportista.idTransportista > 0)) {
                    tS.toastr('warning', 'Seleccione el Transportista');
                    return
                }
                if (!($scope.vehiculo.idVehiculo > 0)) {
                    tS.toastr('warning', 'Seleccione el Vehiculo');
                    return
                }

                if (!$scope.data.ptoPartida) {
                    tS.toastr('warning', 'Ingrese el Punto de Partida');
                    return
                }
                if (!$scope.data.ptoLlegada) {
                    tS.toastr('warning', 'Ingrese el Punto de Llegada');
                    return
                }

                if (!$scope.data.estableDestino) {
                    tS.toastr('warning', 'Ingrese Est. Destino');
                    return
                }

                if (!$scope.data.ruta) {
                    tS.toastr('warning', 'Ingrese la Ruta');
                    return
                }

                if (!$scope.data.motivo) {
                    tS.toastr('warning', 'Ingrese el Motivo de Traslado');
                    return
                }

                if ($scope.gridOptionsDetalle.data.length === 0) {
                    tS.toastr('warning', 'Al menos ingrese un Articulo en el Detalle');
                    return
                }

                let nroDocSecuencial = null;
                if ($scope.data.idGuiaRemision > 0) {
                    nroDocSecuencial = $scope.data.serieComprobante;
                } else {
                    showLoader();
                    nroDocSecuencial = await commonSvc.generarNroDocumentoCompra({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                        codigoDocumento: $scope.tipoDoc.codigo
                    })
                    hideLoader();
                    if (!nroDocSecuencial) throw "NO SE GENERÓ CORRECTAMENTE EL NÚMERO SECUENCIAL";
                }

                const swalSave = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let { isConfirmed } = await swalSave.fire({
                    title: `<small>${$scope.titleModal} Guía de Remisión</small>`,
                    html: `<small>Esta Ud. seguro de ${$scope.titleModal} este <b> Documento</b> N° ${nroDocSecuencial}</small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (isConfirmed) {
                    showLoader();

                    let guia = Object.assign({}, $scope.data);

                    guia.idCliente = $scope.cliente.idCliente;
                    guia.idTransportista = $scope.transportista.idTransportista;
                    guia.idVehiculo = $scope.vehiculo.idVehiculo;
                    guia.idEmpleado = $scope.empleado.idEmpleado

                    guia.fechaEmision = fS.formatDateTimeZone($scope.data.fechaEmision);
                    guia.fechaInicio = fS.formatDateTimeZone($scope.data.fechaInicio);
                    guia.fechaFin = fS.formatDateTimeZone($scope.data.fechaFin);

                    let data = {
                        guia,
                        detalle: $scope.gridOptionsDetalle.data,
                        adicional: $scope.infoAdicionalDocumento
                    }

                    if ($scope.data.idGuiaRemision > 0) {
                        guiaRemisionSvc.update($scope.data.idGuiaRemision, data)
                            .then($scope.successResponse)
                            .catch(error => {
                                hideLoader();
                                console.log(error);
                            })
                    } else {
                        guiaRemisionSvc.save(data)
                            .then($scope.successResponse)
                            .catch(error => {
                                hideLoader();
                                console.log(error);
                            })
                    }
                }

            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.successResponse = function (response) {
            hideLoader();
            if (response.code === '0') {
                fS.sweetAlert('warning', response.message)
            }
            if (response.code === '1') {
                fS.sweetAlert('success', response.message, '', 1000)
                $uibModalInstance.close(response)
            }
        }


        $scope.closeModal = function () {
            $uibModalInstance.close();
        }
    }


})(window.angular)