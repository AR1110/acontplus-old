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
        compraNoHabSvc = $injector.get('compraNoHabitualService');
        commonSvc = $injector.get('commonService');
        modalSvc = $injector.get('modalService');
        tS = $injector.get('toastService');
        fS = $injector.get('formulario');

        //Variables Generales
        let { fileCtrl, controllers, templates } = nombreModalCompra.COMPRA_NO_HABITUAL;

        //Filtro 

        $scope.proveedor = {
            nombreProveedor: ''
        }

        $scope.searchUser = {
            nombreCompleto: ''
        }
        $scope.moreSearchOptions = false;

        $scope.dataSearch = {
            checkBoxFecha: true,
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
                        $scope.getFacturas();
                    }
                })
                // let controller = (await import(fileCtrl))[controllers['MN']];
                // let template = templates['MN'];
                // let modalParms = {
                //     controller,
                //     template,
                //     params: {
                //         data: {}
                //     },
                //     isRenderRazorPartial: true
                // }
                // $scope.openModal(modalParms)

            } catch (error) {
                console.log(error)
            }

        }



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


        $scope.sumImporteTotal = function () {
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

                let query = {
                    typeList: 1,
                    codEstab: $scope.dataSearch.codEstab,
                    dateStart: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    dateEnd: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    checkBoxProveedor: $scope.dataSearch.idProveedor > 0,
                    idProveedor: $scope.dataSearch.idProveedor,
                    checkBoxEstado: $scope.dataSearch.estado ? true : false,
                    estado: $scope.dataSearch.estado,
                    isSearchNroDoc: $scope.dataSearch.nroSecuencial ? true : false,
                    nroSecuencial: $scope.dataSearch.nroSecuencial
                };
                $scope.documentoIngreso = [];
                $scope.sumImporteTotal();
                compraNoHabSvc.get(query).then(response => {
                    $scope.documentoIngreso = response;
                    $scope.sumImporteTotal();
                    hideLoader();

                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        //Formulario Nuevo
        $scope.openModalEditar = async (item) => {
            try {
                let controller = (await import(fileCtrl))[controllers['MU']];
                let template = templates['MU'];

                let modalParams = {
                    controller,
                    template,
                    isRenderRazorPartial: true
                }
                showLoader();
                compraNoHabSvc.findById(item.idDocumentoIngreso).then(response => {
                    hideLoader();
                    modalParams.params = response;
                    $scope.openModal(modalParams)
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        //Cancelar un Documento
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
                    title: '<small>Anular Compra no Habitual?</small>',
                    html: `<small>Esta Ud. seguro/a de anular esta Compra No Habitual <b>N° ${item.serieComprobante}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    compraNoHabSvc.updateStatus(item.idDocumentoIngreso).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.getComprasNoHabitual();
                        }
                    })
                }
            } catch (error) {
                Swal.close();
                console.log(error)
            }

        }

        $scope.initiload = () => {
            try {
                commonSvc.getEstabAsign().then(response => {
                    $scope.establecimientos = response;
                    let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
                    $scope.dataSearch.codEstab = codEstab;
                    $scope.getComprasNoHabitual();
                })
            } catch (error) {
                console.log(error);
            }
        }
        $scope.initiload();




        $scope.openModalDetalle = async (item) => {
            try {

                try {

                    let controller = (await import(fileCtrl))[controllers['MD']];
                    let template = templates['MD'];
                    let modalParams = {
                        controller,
                        template,
                        isRenderRazorPartial: true
                    }

                    compraNoHabSvc.get({
                        idDocumentoIngreso: item.idDocumentoIngreso,
                        typeList: 4
                    }).then(response => {
                        modalParams.params = response;
                        $scope.openModal(modalParams)
                    }).finally(() => hideLoader())
                } catch (error) {
                    console.log(error)
                }

            } catch (error) {
                console.log(error);
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
                // const {
                //     estabs,
                //     decimal,
                //     tarifasImpuesto,
                //     tiemposCredito,
                //     categoriasCompra,
                //     sustentosTributario
                // } =
                //     mainDataForm;

                // $scope.establecimientos = estabs;

                // $scope.decimal = decimal;
                // $scope.tarifasImpuesto = tarifasImpuesto;
                // $scope.tiemposCredito = tiemposCredito;
                // $scope.categoriasCompra = categoriasCompra;
                // $scope.sustentosTributario = sustentosTributario;

                // if (
                //     !(
                //         "comprobante" in params &&
                //         params.comprobante.idFacturaCompra > 0
                //     )
                // ) {
                //     if ($scope.establecimientos.length > 0) {
                //         let dataEstab = $scope.establecimientos.find(
                //             (estab) => estab.defaultEstab
                //         );
                //         if (dataEstab) {
                //             $scope.data.codEstab = dataEstab.codEstab;
                //             $scope.dataClone.codEstab = $scope.data.codEstab;
                //             $scope.bodegas = dataEstab.bodegas;
                //         }


                //         if ($scope.bodegas.length > 0) {
                //             let dataBodega = $scope.bodegas.find(
                //                 (bodega) => bodega.defaultBodega
                //             );
                //             if (dataBodega) {
                //                 $scope.data.idBodega = dataBodega.idBodega;
                //                 $scope.dataClone.idBodega = $scope.data.idBodega;
                //             }
                //         }
                //     }

                //     if ($scope.tiemposCredito.length > 0) {
                //         $scope.data.idTiempoCredito =
                //             $scope.tiemposCredito[0].idTiempoCredito;
                //     }

                //     getFechaVencimiento();

                //     if (Object.keys(storageSvc.getObject(NAME_KEY_DETALLE_STORAGE)).length > 0) {
                //         storageSvc.restoreInvoiceDetail(NAME_KEY_DETALLE_STORAGE).then(result => {
                //             if (result.isConfirmed) {
                //                 $scope.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value]);
                //                 delete result.dataInvoiceDetail[result.value];

                //                 storageSvc.setObject(NAME_KEY_DETALLE_STORAGE, result.dataInvoiceDetail)

                //                 recalculateTotalsSimple();
                //                 $scope.$apply();
                //             }

                //         })
                //     }
                // }

                // if (
                //     "comprobante" in params &&
                //     params.comprobante.idLiquidacionCompra > 0
                // ) {
                //     const { comprobante, proveedor, detalles, infoAdicionalDocumento } =
                //         params;

                //     $scope.data = comprobante;
                //     $scope.dataClone.codEstab = $scope.data.codEstab;

                //     $scope.proveedor = proveedor;
                //     $scope.proveedor.nombreProveedor = proveedor.nombreFiscal;
                //     $scope.gridOptions.data = calculateTotalItems(detalles);
                //     $scope.infoAdicionalDocumento = infoAdicionalDocumento;

                //     let dataEstab = $scope.establecimientos.find(
                //         (estab) => estab.codEstab === $scope.data.codEstab
                //     );
                //     if (dataEstab) {
                //         $scope.bodegas = dataEstab.bodegas;
                //         let dataBodega = $scope.bodegas.find(
                //             (bodega) => bodega.defaultBodega
                //         );
                //         if (dataBodega) {
                //             $scope.data.idBodega = dataBodega.idBodega;
                //             $scope.dataClone.idBodega = $scope.data.idBodega;
                //         }
                //     }
                // }

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