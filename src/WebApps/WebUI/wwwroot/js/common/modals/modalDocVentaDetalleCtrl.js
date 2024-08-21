export {
    modalDocVentaDetalleCtrl
}

modalDocVentaDetalleCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    '$timeout',
    'params'
];

function modalDocVentaDetalleCtrl($scope, $uibModalInstance, $injector, $timeout, params) {
    const DOC_TYPE = $injector.get('DOC_TYPE');
    const notaEntregaSvc = $injector.get('notaEntregaService');
    const facturaSvc = $injector.get('facturaService');
    const proformaSvc = $injector.get('proformaService');
    const notaCreditoSvc = $injector.get('notaCreditoService');
    const nombreModalVenta = $injector.get('nombreModalVenta');
    const modalSvc = $injector.get('modalService');
    let gridOptionsSvc = $injector.get('gridOptionsService');
    const fS = $injector.get('formulario')

    let { id, codDoc, idDocumentoElectronico } = params; 
    $scope.showHeader = true;
    $scope.infoAdicionalDocumento = [];
    $scope.tarifasImpuesto = [];
    $scope.gridOptions = {
        enableColumnMenus: false,
        enableColumnReordering: true,
        showGridFooter: false,
        data: []
    }
    $scope.dataFormaPago = {};

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        if ($scope.gridApi) {
            $timeout(() => {
                $scope.gridApi.core.handleWindowResize();
                $scope.gridApi.grid.refresh();
            }, 5);
        }
    }
    setColumnDefsVista();

    function renderedModal() {
        $uibModalInstance.rendered.then(() => {
            drawImpuestoTotales();
        })
    }

    function calculateTotalItems(items) {
        return items.map((item, index) => {
            let precioConIva = typeof item.precioConIva === 'number' ? item.precioConIva : item.precioUnitario + item.valorImpuesto;
           // let precioTotalSinImpuesto = ((item.precioUnitario * item.cantidad)) - item.valorDescuento;
            let total = item.precioTotalSinImpuesto + item.valorImpuesto;
            return {
                n: index + 1,
                ...item,
                precioConIva: fS.roundNumber(precioConIva, 5),
              //  precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, 3),
                total: fS.roundNumber(total, 5)
            }
        })
    }

    //Nota Entrega
    if (codDoc === DOC_TYPE['NE']) {
        try {
            showLoader();
            notaEntregaSvc.getIdForInfo(id).then(response => {
                let { data, cliente, items, infoAdicionalDocumento, tarifasImpuesto } = response;
                $scope.data = data;

                $scope.cliente = cliente;
                $scope.gridOptions.data = calculateTotalItems(items)
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;
                $scope.tarifasImpuesto = tarifasImpuesto;
                renderedModal();
            }).catch(error => {
                console.warn(error)
            }).finally(() => {
                hideLoader();
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    //Factura
    if (codDoc === DOC_TYPE['FV_SRI']) {
        try {
            showLoader();
            facturaSvc.getIdForInfo(id, idDocumentoElectronico).then(response => {
                let { data, cliente, items, infoAdicionalDocumento, tarifasImpuesto, formasPago } = response;
                $scope.data = data;
                $scope.cliente = cliente;
                $scope.gridOptions.data = calculateTotalItems(items);
                $scope.infoAdicionalDocumento = infoAdicionalDocumento || [];
                $scope.tarifasImpuesto = tarifasImpuesto;
                $scope.dataFormaPago = formasPago[0];
                renderedModal();
            }).catch(error => {
                console.error(error)
            }).finally(() => {
                hideLoader();
            })
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }

    //Proforma
    if (codDoc === '09') {
        try {
            showLoader();
            proformaSvc.getIdForInfo(id).then(response => {
                let { data, cliente, items, tarifasImpuesto, infoAdicionalDocumento } = response;
                $scope.data = data;
                $scope.cliente = cliente;
                $scope.gridOptions.data = calculateTotalItems(items)
                $scope.tarifasImpuesto = tarifasImpuesto;

                $scope.infoAdicionalDocumento = infoAdicionalDocumento || [];

                renderedModal();
            }).catch(error => {
                console.error(error)
            }).finally(() => {
                hideLoader();
            })
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }

    //Nota Credito  
    if (codDoc === DOC_TYPE['NC_SRI']) {
        try {
            showLoader();
            notaCreditoSvc.getIdForInfo(id).then(response => {
                let { data, cliente, items, factura, infoAdicionalDocumento } = response;
                $scope.data = data;
                $scope.cliente = cliente;
                $scope.gridOptions.data = items;
                $scope.factura = factura;
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;
            }).catch(error => {
                console.error(error)
            }).finally(() => {
                hideLoader();
            })
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }




    function setColumnDefsVista() {
        $scope.gridOptions.columnDefs = [{
            name: 'Op',
            enableCellEdit: false,
            width: '3%',
            minWidth: '50',
        },
        {
            name: 'N°',
            field: 'n',
            width: '5%',
            minWidth: '50'
        },
        {
            name: 'cód.',
            field: 'codigo',
            width: '8%',
            minWidth: '100'
        },
        {
            name: "Descripción",
            field: "descripcion",
            cellTooltip: function (row) {
                return row.entity.descripcion;
            },
            width: '25%',
            minWidth: '100'
        },
        {
            name: 'Cant.',
            field: 'cantidad',
            min: 1,
            type: 'number',
            width: '6%',
            minWidth: '50'
        },
        {
            name: 'Medida',
            field: 'medida',
            type: 'number',
            width: '8%',
            minWidth: '100'
        },
        {
            name: 'I.V.A',
            field: 'tipoIva',
            width: '8%',
            minWidth: '100',
        },
        {
            name: 'Tarifa',
            field: 'pvp',
            width: '8%',
            minWidth: '50',
        },
        {
            name: 'Precio U.',
            field: 'precioUnitario',
            type: 'number',
            width: '7%',
            minWidth: '50',
        },
        {
            name: 'P. Iva',
            field: 'precioConIva',
            min: 0,
            type: 'number',
            width: '7%',
            minWidth: '50',
        },
        {
            name: '%',
            field: 'porcentajeDescuento',
            min: 0,
            width: '4%',
            minWidth: '60',
            type: 'number',
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
            type: 'number',
            width: '7%',
            minWidth: '50',
            cellFilter: fS.cellFilterRoundToNumber(),
            cellTooltip: function (row, col) {
                return fS.cellTooltipGrid(row.entity, col.field)
            },
        },
        {
            name: 'IVA',
            field: 'valorImpuesto',
            type: 'number',
            width: '5%',
            minWidth: '50',
            cellFilter: fS.cellFilterRoundToNumber(),
            cellTooltip: function (row, col) {
                return fS.cellTooltipGrid(row.entity, col.field)
            },
        },
        {
            name: 'Total',
            field: 'total',
            type: 'number',
            width: '5%',
            minWidth: '100',
            cellFilter: fS.cellFilterRoundToNumber(),
            cellTooltip: function (row, col) {
                return fS.cellTooltipGrid(row.entity, col.field)
            },
        },
        {
            name: 'Nota',
            field: 'nota',
            type: 'string',
            width: '15%',
            minWidth: '100'
        },
        {
            name: 'bodega',
            field: 'bodega',
            type: 'number',
            width: '11%',
            minWidth: '100'
        }
        ]

        // let indexTipoIva = this.gridOptions.columnDefs.findIndex(item => item.field === 'idTipoIva');
        // let indexBodega = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
        // this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        // this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;
    }



    $scope.getDetalleFactura = async function () {
        try {
            console.log($scope.factura)
            if (!($scope.factura.idDocumento > 0)) return


            let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
            let ctrl = (await import(fileCtrl))[controller];
            let template = templates['FV_SRI'];
            modalSvc.openModalCustom({
                controller: ctrl,
                template: template,
                size: 'xl',
                params: {
                    codDoc: DOC_TYPE.FV_SRI,
                    id: $scope.factura.idDocumento
                },
                windowClass: 'uibModalFullScreen',
                isRenderRazorPartial: true
            })


        } catch (error) {
            console.error(error)
        }
    }


    // * Add by Ignacio Manchu.
    function drawImpuestoTotales() {
        try { 
            let dataImpuestoTotales = gridOptionsSvc.getImpuestoTotales({
                items: $scope.gridOptions.data,
                tarifasImpuesto: $scope.tarifasImpuesto.slice(),
            }); 

            const template = gridOptionsSvc.impuestoTotalesHtml(dataImpuestoTotales);

            const element = document.getElementById('draw-dynamic-subtotal');
            if (element) {
                element.innerHTML = template;
            } else {
                console.error('Elemento para dibujar totales impuestos no definido')
            }
        } catch (error) {
            console.log(error);
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}