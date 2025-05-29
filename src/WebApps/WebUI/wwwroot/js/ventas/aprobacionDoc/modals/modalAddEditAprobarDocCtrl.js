(function () {
    //@ts-check
    var mainPath = `/Home/Index?name=~/Pages/AprobacionDocumento/`;

    app.component('modalAddEditAprobarDoc', {
        templateUrl: `${mainPath}_ModalAddEditAprobarDoc.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
            isNotModal: '='
        },
        controller: ['$scope', '$injector', function ($scope, $injector) {
            const $ctrl = this;

            const fS = $injector.get('formulario')
            const gridOptionsSvc = $injector.get('gridOptionsService');
            const aprobacionDocSvc = $injector.get('aprobacionDocService');
            const tS = $injector.get('toastService');
            const DOC_TYPE = $injector.get('DOC_TYPE');
            let params = {};


            let tiposDocDestino = [];
            let tiposDocOrigen = [];

            $scope.title = null;

            let docsSelected = []; 


            $scope.establecimientos = [];
            $scope.ptosEmision = [];
            $scope.config = {};
            $scope.tarifas = [];
            $scope.tarifasImpuesto = [];
            $scope.bodegas = [];

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
            }
            $scope.dataClone = {
                fechaEmision: new Date(),
                porcentajeDescuento: 0,
                totalDescuento: 0,

            };

            $scope.gridOptionsDetalle = {
                enableColumnMenus: false,
            }

            $scope.dataDisabled = {
                isDisabledSucursal: true,
                isDisabledPuntoEmision: true
            }
 

            $scope.esEditar = function () {
                return params.id > 0
            }

            $scope.esGuardar = function () {
                return !(params.id > 0)
            }

            function calculateTotalItems(items) {
                return items.map(item => {
                    return {
                        ...item,
                        precioConIva: fS.roundNumber(item.precioConIva, $scope.decimal.nroPrecio),
                    }

                })
            }


            function getDocDestino(id) {
                return tiposDocDestino.find(item => item.idTipoDocumento === id);
            }
            function getDocOrigen(id) {
                return tiposDocOrigen.find(item => item.idTipoDocumento === id);
            }


            $ctrl.$onInit = function () {
                params = $ctrl.resolve.params || {};
                const {
                    cliente,
                    detalles,
                    id, 
                    mainDataForm, 
                    codEstab,
                    idPuntoEmision,
                } = params;

                let {
                    estabs,
                    tarifasImpuesto, 
                    tarifas,
                    permisoVenta,
                    decimal,
                    vendedores,
                    config
                } = mainDataForm;

                tiposDocDestino = params.tiposDocDestino || [];
                tiposDocOrigen = params.tiposDocOrigen || [];

                docsSelected = params.docsSelected;  


                $scope.title = id > 0 ? 'Editar Aprobación Documento' : `Aprobar Documento: ${getDocOrigen(params.idTipoDocOrigen).descripcion}->${getDocDestino(params.idTipoDocDestino).descripcion}`;

                $scope.establecimientos = estabs;

                let dataEstab = $scope.establecimientos.find(item => (item.codEstab === codEstab))

                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataClone.codEstab = $scope.data.codEstab;

                //===========Puntos Emisiones============================================== 
                $scope.ptosEmision = dataEstab.puntosEmision;
                let dataPtoEmi = $scope.ptosEmision.find(item => {
                    if (idPuntoEmision > 0) {
                        return item.idPuntoEmision === idPuntoEmision;
                    }
                    return (item.defaultPtoEmi);
                })
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;


                //============Bodegas======================================================= 
                $scope.bodegas = dataEstab.bodegas;
                let dataBodega = $scope.bodegas.find(item => (item.defaultBodega))
                $scope.idBodega = dataBodega.idBodega;
                $scope.dataClone.idBodega = $scope.idBodega;

                $scope.cliente = cliente;

                $scope.config = config;

                $scope.decimal = decimal;

                //Tarifas(PVP1, PVP2)
                $scope.tarifas = tarifas;
                $scope.data.idTarifa = $scope.tarifas.length > 0 ? $scope.tarifas[0].idTarifa : 0;
                $scope.dataClone.idTarifa = $scope.data.idTarifa;

                $scope.permisoComprobanteVenta = permisoVenta.comprobante;
                $scope.permisoDetalleVenta = permisoVenta.detalle;
                $scope.tarifasImpuesto = tarifasImpuesto;

                $scope.vendedores = vendedores;

                let dataUsuario = $scope.vendedores.find(v => v.predeterminado);
                if (dataUsuario) {
                    $scope.data.idUsuario = dataUsuario.idUsuario;
                }

                $scope.gridOptionsDetalle.data = calculateTotalItems(detalles);

                loadColumns();
                drawImpuestoTotales()
            }

            //GridOptions Documento Aprobación 
            function loadColumns() {
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
                    width: '8%',
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



            /**
             * ==========================DOCUMENTO DESTINO===================================== 
             * 
             */
            /**
             * Agregamos lista de tipos IVA y bodegas en sus respectivas columnas
             */
            function setWarehouseAndIVA() {
                let indexTipoIva = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idTipoIva');
                let indexBodega = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'idBodega');

                $scope.gridOptionsDetalle.columnDefs[indexTipoIva].editDropdownOptionsArray = $scope.tarifasImpuesto;
                $scope.gridOptionsDetalle.columnDefs[indexBodega].editDropdownOptionsArray = $scope.bodegas;
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

            function drawElementHTMLTotals(htmlTemplate) {

                const element = document.getElementById('drawImpuestoTotales');
                if (element) {
                    element.innerHTML = htmlTemplate;
                }
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
                    tS.toastr({
                        type: 'warning',
                        message: `El valor del Subtotal sin impuestos: ${$scope.data.subTotalSinImpuestos} difiere del valor del Subtotal sin impuestos en el detalle: ${subTotalSinImpuestos}`
                    })
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

            function isValidForm() {
                if (!isValidTotals()) return;

                if (!fS.isValidField($scope.data.codEstab)) {
                    tS.taostr('warning', 'Seleccione el establecimiento')
                    return
                }
                if (!($scope.data.idPuntoEmision > 0)) {
                    tS.taostr('warning', 'Seleccione el punto de emisión')
                    return
                }

                if (!($scope.data.idUsuario > 0)) {
                    tS.taostr('warning', 'Seleccione el Usuario')
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


                if ($scope.cliente.tipoIdentificacion === 'CF' && getDocDestino(params.idTipoDocDestino).codigo === DOC_TYPE.FV && $scope.data.total > 50) {
                    Swal.fire({
                        icon: 'warning',
                        html: `<small>El importe total de los documentos seleccionados supera los 50 USD por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b></small>`,
                        confirmButtonText: 'Aceptar'
                    })
                    return
                }
                if ($scope.data.total <= 0) {
                    tS.toastr('warning', 'No se puede generar el documento con valor total 0');
                    return
                }

                return true;
            }

            $scope.askToSave = async function () {
                try {

                    if (!isValidForm()) return;



                    let { isConfirmed } = await Swal.fire({
                        //title: 'Are you sure?',
                        text: `¿Estás seguro de ${$scope.esGuardar() ? 'Guardar' : 'Actualizar'} el Documento de Aprobación Documento?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si!',
                        cancelButtonText: 'No!'
                    })

                    if (!isConfirmed) return;

                    const comprobante = {
                        // ...$scope.data,
                        // codDoc: $scope.docDestino.codDoc,
                        // idCliente: $scope.cliente.idCliente,
                        // fechaEmision: fS.formatDateTimeZone($scope.data.fechaEmision),
                        // docOrigen: $scope.docOrigen.codDoc,
                        // docDestino: $scope.docDestino.codDoc,
                        // total: docsSelected.reduce((prev, acc) => prev + acc.total, 0)


                        idCliente: $scope.cliente.idCliente,

                        idPuntoEmision: $scope.data.idPuntoEmision,
                        idUsuario: $scope.data.idUsuario,
                        idTipoDocDestino: params.idTipoDocDestino,
                        idTipoDocOrigen: params.idTipoDocOrigen,
                        fechaEmision: $scope.data.fechaEmision,
                        subTotalSinImpuestos: $scope.data.subTotalSinImpuestos,
                        totalDescuento: $scope.data.totalDescuento,
                        propina: $scope.data.propina,
                        total: $scope.data.total,
                        observacion: $scope.data.observacion,
                    }

                    // let infoAdicionalDocumento = $scope.infoAdicionalDocumento.filter(item => {
                    //     if (item) {
                    //         return docsSelected.some(docs => docs.idComprobante === item.idDocumento)
                    //     } else {
                    //         return false;
                    //     }
                    // })

                    // let datosAdicionalesArticulo = $scope.datosAdicionalesArticulo.filter(item => {
                    //     if (item) {
                    //         return docsSelected.some(docs => docs.idNotaEntrega === item.idDocumento)
                    //     } else {
                    //         return false;
                    //     }
                    // })
                    const { codigo } = getDocOrigen(params.idTipoDocOrigen);
                    const selectedDocshistorial = docsSelected.map(item => {
                        const idProforma = codigo === DOC_TYPE.PR ? item.idDocumento : null;
                        const idNotaEntrega = codigo === DOC_TYPE.NE ? item.idDocumento : null;

                        return {
                            idProforma,
                            idNotaEntrega,
                        }
                    })

                    if (selectedDocshistorial.some(item => !(item.idProforma || item.idNotaEntrega))) {
                        fS.sweetAlert('warning', 'Error al generar el historial de documentos seleccionados. Por favor, asegúrese de que los documentos seleccionados sean válidos.');
                        return;
                    }

                    const data = {
                        comprobante,
                        detalles: $scope.gridOptionsDetalle.data,
                        infoAdicionalDocumento: [],
                        selectedDocshistorial,
                        datosAdicionalesArticulo: [],
                        detallesDeleted: []
                    }

                    aprobacionDocSvc.create(data).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message);
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message, '', 1000);
                            setTimeout(() => {
                                $ctrl.close({
                                    $value: response
                                });
                            }, 1000);
                        }
                    })

                } catch (error) {
                    console.log(error);
                }
            }




            $scope.close = function () {
                $ctrl.close();
            }







        }]
    })
})()