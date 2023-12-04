
export {
    ModalTransferenciaBodegaDetalleCtrl
}
ModalTransferenciaBodegaDetalleCtrl.$inject = ['$scope',  '$uibModalInstance',   'commonService', 'toastService',   'params']
function ModalTransferenciaBodegaDetalleCtrl($scope,  $uibModalInstance, commonSvc, tS, params){
     
    let {dataDocumento, detalleDocumento} = params.data;
    
   
 
        
    $scope.gridOptions = {
        enableColumnMenus: false,
        enableSorting: false,
        enableFiltering: false,
        enableRowHashing: false,
        enableColumnReordering: true,
        showGridFooter: false,            
    }

 
    $scope.gridOptions.columnDefs = [        
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
            allowCellFocus: false,
            headerCellClass: 'header-text-retencion',
            cellClass: 'body-text-retencion',
        },
        {
            name: 'idArticulo',
            field: 'idARticulo',
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
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            cellEditableCondition: function (scope) {
                return scope.row.entity.llevaInventario !== true;
            },
            cellTooltip: function (row) {
                return row.entity.descripcion;
            },
            width: '50%',
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
            enableCellEdit: false,
            enableCellEditOnFocus: false,
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
    async function initiload(){
        try {
             
            $scope.data = dataDocumento;
            $scope.gridOptions.data = detalleDocumento;

            enumGridOptions(); 
        } catch (error) {
            console.log(error)
        }             
    }

    function enumGridOptions() {
        let num = 1;
        
        for(let item of $scope.gridOptions.data){
            item.num = num ++;
        }      
    }


    $scope.closeModal = function() {
        $uibModalInstance.close();
    }

}
