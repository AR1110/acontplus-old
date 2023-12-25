export {
    modalDocCompraDetalleCtrl
}

modalDocCompraDetalleCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    '$timeout',
    'params'
];

function modalDocCompraDetalleCtrl($scope, $uibModalInstance, $injector, $timeout, params) {
    const DOC_TYPE = $injector.get('DOC_TYPE');
    const liquidacionCompraSvc = $injector.get('liquidacionCompraService');
    let gridOptionsSvc = $injector.get('gridOptionsCompraService');
    const fS = $injector.get('formulario');
    const CODE_REPORT = $injector.get('CODE_REPORT');
    const commonSvc = $injector.get('commonService');

    let { id, codDoc } = params;
    $scope.showHeader = true;
    $scope.infoAdicionalDocumento = [];
    $scope.tarifasImpuesto = [];
    $scope.proveedor = {}
    $scope.gridOptions = {
        enableColumnMenus: false,
        enableColumnReordering: true,
        showGridFooter: false,
        data: []
    }
    setColumnDefsVista();

    function renderedModal() {
        $uibModalInstance.rendered.then(() => {
            drawImpuestoTotales();
        })
    }

    function calculateTotalItems(items) {
        return items.map((item) => {
            let total = item.precioTotalSinImpuesto + item.valorImpuesto;
            return {
                ...item,
                total: fS.roundNumber(total, 3)
            }
        })
    }

    //Liquidacion Compra
    if (codDoc === DOC_TYPE['LC']) {
        try {
            showLoader();
            liquidacionCompraSvc.getIdForInfo(id).then(response => {
                const {
                    comprobante,
                    proveedor,
                    detalles,
                    infoAdicionalDocumento,
                    tarifasImpuesto
                } = response;
                $scope.data = comprobante;
                $scope.proveedor = proveedor;
                $scope.gridOptions.data = calculateTotalItems(detalles)
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


    function setColumnDefsVista() {
        $scope.gridOptions.columnDefs = [
            {
                name: 'N°',
                field: 'n',
                width: '2%',
                minWidth: '50'
            },
            {
                name: 'código',
                field: 'codigo',
                width: '8%',
                minWidth: '100'
            },
            {
                name: "descripción",
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
                minWidth: '60'
            },
            {
                name: 'Medida',
                field: 'medida',
                type: 'string',
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
                name: 'Precio U.',
                field: 'precioUnitario',
                min: 0,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },

            {
                name: '%',
                field: 'porcentajeDescuento',
                min: 0,
                width: '4%',
                minWidth: '60',
                visible: true,
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
                width: '8%',
                minWidth: '50',
                visible: true,
            },
            {
                name: 'IVA',
                field: 'valorImpuesto',
                type: 'number',
                width: '5%',
                minWidth: '50',
                visible: true,
            },
            {
                name: 'Total',
                field: 'total',
                type: 'number',
                width: '5%',
                minWidth: '100',
                visible: true,
            },
            {
                name: 'Ice',
                field: 'ice',
                type: 'number',
                width: '6%',
                minWidth: '60',
            },
            {
                name: 'bodega',
                field: 'bodega',
                type: 'string',
                width: '11%',
                minWidth: '100'
            },

            {
                name: 'Nota',
                field: 'nota',
                type: 'string',
                width: '15%',
                minWidth: '100'
            },
        ]
    }

    // * Add by Ignacio Manchu.
    function drawImpuestoTotales() {
        try {
            let {
                subTotalSinImpuestos,
                htmlImpuestoTotal,
                htmlIvaTotal,
                irbpnr,
                totalIce,
                importeTotal,
                totalDescuento,
            } = gridOptionsSvc.getImpuestoTotales({
                items: $scope.gridOptions.data,
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

            const element = document.getElementById('drawImpuestoTotalesDetalle');
            if (element) {
                element.innerHTML = template;
            } else {
                console.error('Elemento para dibujar totales impuestos no definido')
            }
        } catch (error) {
            console.log(error);
        }
    }


    function getDataReport() {
        const dataReport = {
            [DOC_TYPE.LC]: {
                codDoc: DOC_TYPE.LC,
                codigo: CODE_REPORT.RCD
            }
        }

        return dataReport[codDoc]

    }
    $scope.getReport = function () {
        try {
            let { codDoc, codigo } = getDataReport();
            let format = 'excel';
            const parameters = {
                dataParams: JSON.stringify({
                    id: id,
                    codDoc,
                }),
                reportParams: JSON.stringify({
                    codigo,
                    codEstab: $scope.data.codEstab,
                    format,

                }),
                hasService: true,
            }

            commonSvc.getReport({ parameters, formatType: format })
        } catch (error) {
            console.log(error)
        }
    }

    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}