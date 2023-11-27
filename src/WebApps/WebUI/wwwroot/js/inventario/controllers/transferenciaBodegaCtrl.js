
(function () {


    'use strict';

    const PATH_HTML = 'Pages/TransferenciaBodega/'

    let transBogegaSvc = {};
    let commonSvc = {};
    let fS = {};
    let tS = {}; 
    let mainDataForm = {};


    app.controller('transferenciaBodegaCtrl', transferenciaBodegaCtrl);

    transferenciaBodegaCtrl.$inject = ['$scope', '$injector', '$filter', 'modalService', 'nombreModalInventario'];

    function transferenciaBodegaCtrl($scope, $injector, $filter, modalSvc, nombreModalInventario) {

        transBogegaSvc = $injector.get('transferenciaBodegaService');
        commonSvc = $injector.get('commonService');
        fS = $injector.get('formulario');
        tS = $injector.get('toastService');

        $scope.dataSearch = {};
        $scope.transferenciasBodegas = [];
        let tempTransferenciasBodegas = [];

        $scope.openModalNew = function () {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: 'ModalTransferenciaBodegaCtrl',
                    template: PATH_HTML + 'Shared/_ModalTransferenciaBodega.cshtml',
                    isRenderRazorPartial: true,
                    size: 'xl',
                    params: {}
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getTransferenciasBodega();
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }


        $scope.resultDateRange = function (item) {
            $scope.dataSearch.checkBoxFecha = true;
            $scope.dataSearch.startDate = item.startDate,
                $scope.dataSearch.endDate = item.endDate;

            $scope.getTransferenciasBodega();
        }

        $scope.getTransferenciasBodega = function () {

            try {
                showLoader();
                let query = {
                    codEstab: $scope.dataSearch.codEstab,
                    startDate: fS.formatDateMoment($scope.dataSearch.startDate),
                    endDate: fS.formatDateMoment($scope.dataSearch.endDate),
                }
                $scope.transferenciasBodegas = [];
                transBogegaSvc.getAll(query).then(response => {
                    hideLoader();

                    $scope.transferenciasBodegas = response;
                    tempTransferenciasBodegas = JSON.parse(JSON.stringify($scope.transferenciasBodegas))
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.initiload = function () {
            try {
                showLoader();
                transBogegaSvc.getDataFilter().then(response => {
                    $scope.establecimientos = response.estabs;
                    console.log($scope.establecimientos)
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                        $scope.dataSearch.codEstab = dataEstab.codEstab;
                        $scope.getTransferenciasBodega();
                    }
                }).finally(()=>hideLoader())
                transBogegaSvc.getDataForm().then(response => {
                    mainDataForm = response;
                    console.log(response)
                })
 

            } catch (error) {
                console.log(error)
            }
        }
        $scope.initiload();


        $scope.getFilterTransferencia = () => {
            let transferencias = JSON.parse(JSON.stringify(tempTransferenciasBodegas))
            $scope.transferenciasBodegas = $filter("filter")(transferencias, $scope.dataSearch.bySearch);
        }


        $scope.openModalEditar = async (item) => {
            try {
                showLoader();

                transBogegaSvc.getId(item.idTransferenciaBodega).then(response => {
                    let modalRef = modalSvc.openModalCustom({
                        controller: 'ModalTransferenciaBodegaCtrl',
                        template: PATH_HTML + 'Shared/_ModalTransferenciaBodega.cshtml',
                        isRenderRazorPartial: true,
                        size: 'xl',
                        params: {
                            data: response,
                        }
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.getTransferenciasBodega();
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

        $scope.openModalDetalle = async (item) => {
            try {
                showLoader();
                console.log(item)
                let fileCtrl = nombreModalInventario.TRANSFERENCIA_BODEGA.fileCtrl;
                let ctrl = nombreModalInventario.TRANSFERENCIA_BODEGA.controllers['D'];
                let template = nombreModalInventario.TRANSFERENCIA_BODEGA.templates['D'];
                let controller = (await import(fileCtrl))[ctrl];
                
                transBogegaSvc.getIdDetalle(item.idTransferenciaBodega).then(response => {
                    let modalRef = modalSvc.openModalCustom({
                        controller,
                        template,
                        isRenderRazorPartial: true,
                        size: 'xl',
                        params: {
                            data: response,
                        }
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            $scope.getTransferenciasBodega();
                        }
                    })
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())  
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }


        $scope.askToDelete = async (item) => {

            let { isConfirmed } = await Swal.fire({
                title: '<small>Anular Transferencia?</small>',
                html: `<small>Esta Ud. seguro de eliminar esta Transferencia <b>N° ${item.nroDoc}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar'
            })

            if (isConfirmed) {
                showLoader();
                transBogegaSvc.anular(item.idTransferenciaBodega).then(response => {
                    hideLoader()
                    if (response.code === "0") {
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {

                        fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        $scope.getTransferenciasBodega();
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }
        }



        //Reporte 
        $scope.getReport = function (item) {

            let format = 'pdf';
            let dataParms = {
                id: item.idTransferenciaBodega
            }

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: 'RTB',
                    codEstab: item.codEstab,
                    format,
                    aditionalParams: [

                    ]
                }),
                dataParams: JSON.stringify(dataParms)
            }

            commonSvc.getReport({
                parameters,
                formatType: format
            })
        }


    }




    app.controller('ModalTransferenciaBodegaCtrl', ModalTransferenciaBodegaCtrl);

    ModalTransferenciaBodegaCtrl.$inject = ["$scope", "$timeout", "$uibModalInstance", "params"];

    function ModalTransferenciaBodegaCtrl($scope, $timeout, $uibModalInstance, params) {
        let { data } = params; 

        $scope.tipoDoc = {
            codigo: 'TRA'
        }
        $scope.data = {
            fechaEmision: new Date()
        };
        $scope.puntosEmision = [];

        $scope.gridOptions = {
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
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
                    $scope.setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {

                //Validar campos                 
                if (rowEntity[colDef.field] === "" || rowEntity[colDef.field] === undefined || rowEntity[colDef.field] === null) {
                    rowEntity[colDef.field] = oldValue;
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);
                    rowEntity.precioCosto = dataMedida.precioCosto;
                }

                $scope.setTotal(rowEntity);


            })
        }

        $scope.setFocusArticulo = function () {
            setTimeout(function () {
                document.querySelector('#custom-template-md-autocomplete-articulo').focus();
            }, 100);
        }

        //Set Total Row 
        $scope.setTotal = function (rowEntity) {
            let total = rowEntity.cantidad * rowEntity.precioCosto;
            rowEntity.total = fS.roundNumber(total, 5); //Total Precio Venta
        }


        $scope.gridOptions.columnDefs = [
            {
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                        <button type="button"  ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></button>
                        <button type="button"  ng-click="grid.appScope.abrirModalArticulo(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></button >
                        `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: 'idArticulo',
                field: 'idArticulo',
                type: 'number',
                width: '10%',
                minWidth: '100',
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                allowCellFocus: false,
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
                width: '39%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '7%',
                minWidth: '100'
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
                        //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                        //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                        //}
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
            // { 
            //     name: 'codigoTipoIva', field: 'codigoTipoIva', allowCellFocus: false, type:'string',
            //     enableCellEdit: false, width: '8%', minWidth:'100', enableColumnMenu: false, visible: false
            // },
            // { 
            //     name: 'Iva', field: 'nombreTipoIva', allowCellFocus: false, 
            //     enableCellEdit: false, width: '8%', minWidth:'100', type:'string',
            //     enableColumnMenu: false, visible: true 
            // },
            // { 
            //     name: 'Stock', field: 'stock', allowCellFocus: false, 
            //     enableCellEdit: false, width: '5%', minWidth:'65', type:'number',
            //     enableColumnMenu: false, visible: true,  aggregationType: uiGridConstants.aggregationTypes.sum,customTreeAggregationFinalizerFn: function (aggregation) {
            //         aggregation.rendered = form.roundNumber(aggregation.value,2)
            //      }, aggregationLabel: "$",  
            // },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                // aggregationType: uiGridConstants.aggregationTypes.sum,
                // footerCellFilter: 'number:2',
                // cellFilter: "currency:'$'",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                // aggregationType: form.roundNumber(uiGridConstants.aggregationTypes.sum, 2),
                // customTreeAggregationFinalizerFn: function (aggregation) {
                //     aggregation.rendered = form.roundNumber(aggregation.value, 2)
                // },
                // aggregationLabel: "$",
            }
        ]






        initiload();
        async function initiload() {
            try {

                $scope.establecimientosOrigen = structuredClone(mainDataForm.estabs);
                $scope.establecimientosDestino = structuredClone(mainDataForm.estabs);

                if ($scope.establecimientosOrigen.length === 0) {
                    tS.toastr('info', 'No tienes asignado ningún Establecimiento');
                    return
                }

                if ( typeof data =='object' && data.dataDocumento && data.dataDocumento.idTransferenciaBodega > 0) {
                    let { dataDocumento, detalleDocumento } = params.data;  

                    let dataEstabOrigen = $scope.establecimientosOrigen
                        .filter((es) => es.puntosEmision.some((pp) => pp.idPuntoEmision === dataDocumento.idPuntoEmision))
                        .reduce((acc, curr) => {
                            return  curr;
                        }, {});
                    let dataEstabDestino = $scope.establecimientosOrigen
                        .filter((es) => es.bodegas.some((pp) => pp.idBodega === dataDocumento.idBodegaDestino))
                        .reduce((acc, curr) => {
                            return curr
                        }, {});
 
                    $scope.data = dataDocumento; 
                    // $scope.establecimientoOrigen = establecimientoOrigen;
                    // $scope.establecimientoDestino = establecimientoDestino;
                    // $scope.detalleDocumento = detalleDocumento;

                    $scope.data.codEstabOrigen = dataEstabOrigen.codEstab;
                    $scope.data.codEstabDestino = dataEstabDestino.codEstab; 
  
                    //Punto de Emision
                    $scope.puntosEmision = dataEstabOrigen.puntosEmision;

                    //Bodega Origen 
                    $scope.bodegasOrigen = dataEstabOrigen.bodegas;


                    //Bodega Destino 
                    $scope.bodegasDestino = dataEstabDestino.bodegas;
                    $scope.gridOptions.data = detalleDocumento;
                    enumGridOptions();
                    $scope.tituloModal = 'Editar';
                    $scope.btnText = 'Actualizar';
                    $scope.iconModal = 'ti-pencil'; 
                } else {
                    $scope.tituloModal = 'Nueva';
                    $scope.btnText = 'Guardar';
                    $scope.iconModal = 'ti-save';
                    const dataEstab = $scope.establecimientosOrigen.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegasOrigen = dataEstab.bodegas;
                    //Codigo Establecimiento 
                    $scope.data.codEstabOrigen = dataEstab.codEstab;
                    $scope.cloneCodEstabOrigen = dataEstab.codEstab;

                    if ($scope.puntosEmision.length > 0) {
                        $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                    } else {
                        tS.toastr('warning', 'No tienes Puntos de Emisión asignadas!')
                    }
                    if ($scope.bodegasOrigen.length > 0) {
                        $scope.data.idBodegaOrigen = $scope.bodegasOrigen.find(bodega => (bodega.defaultBodega)).idBodega;
                    } else {
                        tS.toastr('info', 'No tienes asignado ninguna Bodega');
                    }
                }

            } catch (error) {
                console.log(error)
            }

        }


        $scope.onChangeEstablecimientoOrigen = async function () {
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
                    html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                if (isConfirmed) {
                    let dataEstab = $scope.establecimientosOrigen.find(estab => estab.codEstab === $scope.data.codEstabOrigen);

                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.bodegasOrigen = dataEstab.bodegas;
                    //Codigo Establecimiento 
                    $scope.data.codEstabOrigen = dataEstab.codEstab;
                    $scope.cloneCodEstabOrigen = dataEstab.codEstab;

                    if ($scope.puntosEmision.length > 0) {
                        $scope.data.idPuntoEmision = $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision;
                    } else {
                        tS.toastr('warning', 'No tienes Puntos de Emisión asignadas!')
                    }
                    if ($scope.bodegasOrigen.length > 0) {
                        $scope.data.idBodegaOrigen = $scope.bodegasOrigen.find(bodega => (bodega.defaultBodega)).idBodega;
                    } else {
                        tS.toastr('info', 'No tienes asignado ninguna Bodega');
                    }
                    $scope.$apply();
                } else {
                    $scope.data.codEstabOrigen = $scope.cloneCodEstabOrigen;
                    $scope.$apply();
                }


            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.onChangeEstablecimientoDestino = async function () {
            try {
                let dataEstab = $scope.establecimientosDestino.find(item => item.codEstab === $scope.data.codEstabDestino);
                $scope.bodegasDestino = dataEstab.bodegas;
                if ($scope.bodegasDestino.length > 0) {
                    const dataBodega = $scope.bodegasDestino.find(bodega => (bodega.defaultBodega))
                    if (dataBodega) {
                        if (dataBodega.idBodega === $scope.data.idBodegaOrigen) {
                            tS.toastr('warning', 'No puedes transferir los productos a la misma bodega!');
                            $scope.data.codEstabDestino = null;
                            $scope.data.idBodegaDestino = 0;
                            return
                        }
                        $scope.data.idBodegaDestino = dataBodega.idBodega;
                    }
                } else {
                    tS.toastr('warning', 'No tienes asignado ninguna bodega');
                }
            } catch (error) {
                console.trace(error)
            }
        }


        $scope.abrirModalArticulo = function (item) {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )
            $scope.$broadcast("editArticulo", item)
        }

        $scope.setItemArticuloEnDetalle = function (item) {
            try {
                const { articulo, medidas } = item;

                let entity = {};

                $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === articulo.idArticulo);

                if ($scope.indexRow !== -1) {
                    entity = $scope.gridOptions.data[$scope.indexRow];
                    entity.cantidad = entity.cantidad + 1;

                    $scope.setTotal(entity)

                } else {

                    $scope.addRow();

                    $scope.indexRow = $scope.gridOptions.data.findIndex(value => value.idArticulo === 0);
                    entity = $scope.gridOptions.data[$scope.indexRow];
                }

                $scope.addItem(entity, articulo, medidas); // item row
                enumGridOptions();
                $scope.focusColumnaCantidad();

            } catch (error) {
                console.log(error)
            }
        }

        $scope.addRow = function () {
            $scope.gridOptions.data.push({
                idTransferenciaBodegaDetalle: 0,
                num: 1,
                idArticulo: 0,
                codigo: "",
                descripcion: "",
                cantidad: 1,
                medidas: [],
                stock: 0,
                precioCosto: 0,
                total: 0
            });
        }

        $scope.addItem = function (entity, item, medidas) {
            let dataMedida = medidas[0];
            entity.codigo = item.codigoArticulo;
            entity.idArticulo = item.idArticulo;
            entity.descripcion = item.descripcion;
            entity.stock = item.stock;
            entity.precioCosto = dataMedida.precioCosto;
            entity.precioActual = dataMedida.precioCosto;
            entity.total = dataMedida.precioCosto;
            entity.llevaInventario = item.llevaInventario;
            entity.medidas = medidas; //Lista Medida 
            entity.idMedida = dataMedida.idMedida; //Medida por defecto                                    
        }


        function enumGridOptions() {
            let num = 1;

            for (let item of $scope.gridOptions.data) {
                item.num = num++;
            }
        }

        $scope.focusColumnaCantidad = function () {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridOptions.data[0],
                $scope.gridOptions.columnDefs[2]
            )

            $timeout(() => {
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[$scope.indexRow],
                    $scope.gridOptions.columnDefs[5]
                );
            }, 10)
        }


        $scope.deleteRow = async function (row) {
            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                title: 'Eliminar Articulo',
                html: `<small>Esta seguro de eliminar este articulo ${row.entity.descripcion}</small>`,
                showConfirmButton: true,
                showDenyButton: true,
                allowOutsideClick: false,
                confirmButtonText: 'Si, eliminar',
                denyButtonText: 'No, cancelar'
            })

            if (isConfirmed) {
                let index = $scope.gridOptions.data.indexOf(row.entity);
                $scope.gridOptions.data.splice(index, 1);
                $scope.$apply()
            }
        }




        $scope.onSave = async function () {
            try {
                let tituloModal = $scope.data.idTransferenciaBodega > 0 ? 'Actualizar' : 'Guardar';
                const idTransferenciaBodega = $scope.data.idTransferenciaBodega;
                if (!$scope.data.codEstabOrigen) {
                    tS.toastr('warning', 'Seleccione Establecimiento Origen', tituloModal);
                    return
                }

                if (!($scope.data.idBodegaOrigen > 0)) {
                    tS.toastr('warning', 'Seleccione la Bodega Origen', tituloModal);
                    return
                }

                if (!($scope.data.idBodegaDestino > 0)) {
                    tS.toastr('warning', 'Seleccione la Bodega Destino', tituloModal);
                    return
                }

                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                    return
                }

                if (!$scope.data.fechaEmision) {
                    tS.toastr('warning', 'Ingrese fecha de Emisión', tituloModal);
                    return
                }

                if ($scope.gridOptions.data.length === 0) {
                    tS.toastr('warning', 'Ingrese al menos un articulo en el Detalle', tituloModal);
                    return
                }

                let serieComprobante = null, titleSwal = '', htmlSwal = '', confirmButtonText = '';

                if (!(idTransferenciaBodega > 0)) {
                    showLoader();
                    serieComprobante = await transBogegaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.data.idPuntoEmision,
                    })
                    hideLoader();
                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";
                    // showLoader();
                    // nroDocumentoSecuencial = await commonSvc.generarNroDocumentoCompra({
                    //     idPuntoEmision: $scope.data.idPuntoEmision,
                    //     codigoDocumento: $scope.tipoDoc.codigo
                    // })
                    // hideLoader();

                    // if (!nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";
                    titleSwal = '<small>Guardar Transferencia Bodega</small>';
                    confirmButtonText = 'Guardar';
                    htmlSwal = `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`;
                } else {
                    serieComprobante = $scope.data.serieComprobante;
                    titleSwal = '<small>Actualizar Transferencia Bodega</small>';
                    confirmButtonText = 'Actualizar';
                    htmlSwal = `<small>Esta Ud. seguro de actualizar este Documento</small>?`;
                }

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


                let header = Object.assign({}, $scope.data);
                header.total = $scope.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
                header.fechaEmision = fS.formatDateMoment($scope.data.fechaEmision);

                let data = {
                    header: JSON.stringify(header),
                    detail: JSON.stringify($scope.gridOptions.data.map(item => {
                        return {
                            idTransferenciaBodegaDetalle: item.idTransferenciaBodegaDetalle || 0,
                            idTransferenciaBodega: item.idTransferenciaBodega,
                            idArticulo: item.idArticulo,
                            idMedida: item.idMedida,
                            descripcion: item.descripcion,
                            cantidad: item.cantidad,
                            precioCosto: item.precioCosto,
                            estado: item.estado,
                            total: item.total
                        }
                    }))
                }

                showLoader();
                if (idTransferenciaBodega > 0) {
                    transBogegaSvc.update($scope.data.idTransferenciaBodega, data)
                        .then($scope.successResponse)
                        .catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                } else if (!(idTransferenciaBodega > 0)) {
                    transBogegaSvc.insert(data)
                        .then($scope.successResponse)
                        .catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                }
            } catch (error) {
                console.log(error)
            }
        }

        $scope.successResponse = function (response) {
            if (response.code === "0") {
                fS.sweetAlert('warning', response.message, response.titleSms);
            }
            if (response.code === "1") {
                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                $uibModalInstance.close(response)
            }
        }
        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

    }




})(window.angular)