export {
    modalConsolidacionDetalleCtrl
}

modalConsolidacionDetalleCtrl.$inject = [
    '$scope',
    '$uibModalInstance', 
    'consolidacionInvService',
    'uiGridConstants',
    'commonService',
    'formulario',
     'params'
    ];
function modalConsolidacionDetalleCtrl($scope, $uibModalInstance, consolidacionInvSvc, uiGridConstants, commonSvc, fS, params) {
    const {id} = params;

    $scope.gridOptions = {
        enableColumnMenus: false,
        showColumnFooter: false,
        showGridFooter: true,
        enableCellEdit: false,
    } 
    $scope.gridOptions.columnDefs = [
        {
            name: 'N°',
            field: 'index',
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
            name: "Descripción",
            field: "descripcion",
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            cellTooltip: function (row) {
                return row.entity.descripcion;
            },
            width: '40%',
            minWidth: '100'
        },
        {
            name: 'Cant.',
            field: 'cantidad',
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            min: 1,
            type: 'number',
            width: '7%',
            minWidth: '100'
        },
        {
            name: 'Medida',
            field: 'medida',

            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '8%',
            minWidth: '100'
        },
        {
            name: 'Stock',
            field: 'stock',
            allowCellFocus: false,
            enableCellEdit: false,
            width: '5%',
            minWidth: '65',
            type: 'number',
            enableColumnMenu: false,
            visible: true,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            customTreeAggregationFinalizerFn: function (aggregation) {
                aggregation.rendered = fS.roundNumber(aggregation.value, 2)
            },
            aggregationLabel: "$",
        },
        {
            name: 'P. Costo',
            field: 'precioCosto',
            enableCellEditOnFocus: false,
            enableColumnMenu: false,
            type: 'number',
            width: '8%',
            minWidth: '100',
            cellFilter: "currency:'$'",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            customTreeAggregationFinalizerFn: function (aggregation) {
                aggregation.rendered = fS.roundNumber(aggregation.value, 2)
            },
            aggregationLabel: "$",
        },
        {
            name: 'P. Costo Actual',
            field: 'precioActual',
            min: 0,
            type: 'number',
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '12%',
            minWidth: '100',
            cellFilter: "currency:'$'",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            customTreeAggregationFinalizerFn: function (aggregation) {
                aggregation.rendered = fS.roundNumber(aggregation.value, 2)
            },
            aggregationLabel: "$",
        },
        {
            name: 'Total',
            field: 'total',
            allowCellFocus: false,
            enableCellEdit: false,
            width: '8%',
            minWidth: '100',
            type: 'number',
            aggregationType: fS.roundNumber(uiGridConstants.aggregationTypes.sum, 2),
            customTreeAggregationFinalizerFn: function (aggregation) {
                aggregation.rendered = fS.roundNumber(aggregation.value, 2)
            },
            aggregationLabel: "$",
        },
        {
            name: 'bodega',
            field: 'bodega',
            enableFiltering: false,
            enableColumnMenu: false,
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            type: 'number',
            width: '11%',
            minWidth: '100'
        }
    ];
 

 
    initiload();
    function initiload(){
        try {
            showLoader();
            consolidacionInvSvc.getInfoById(id).then(response => {
                const { comprobante, detalles } = response;
                $scope.data = comprobante;
                $scope.gridOptions.data = detalles;
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader());
        } catch (error) {
            hideLoader();
        }
    } 


    $scope.getReport = () => {
        try { 

            let format = 'excel';

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: 'RCD',
                    codEstab: $scope.data.codEstab,
                    format,
                    aditionalParams: [

                    ]
                }),
                dataParams: JSON.stringify({
                    codDoc: 'CI',
                    id,
                })
            }


            commonSvc.getReport({
                parameters,
                formatType: format
            })
        } catch (error) {
            console.log(error)
        }
    }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}