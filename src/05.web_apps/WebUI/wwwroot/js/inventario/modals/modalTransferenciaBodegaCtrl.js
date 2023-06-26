
export {
    ModalTransferenciaBodegaDetalleCtrl
}
ModalTransferenciaBodegaDetalleCtrl.$inject = ['$scope',  '$uibModalInstance',   'commonService', 'toastService',   'params']
function ModalTransferenciaBodegaDetalleCtrl($scope,  $uibModalInstance, commonSvc, tS, params){
     
    let {dataDocumento, establecimientoOrigen, establecimientoDestino, detalleDocumento} = params.data;
    
    $scope.data = dataDocumento;

    $scope.establecimientoOrigen = establecimientoOrigen;
    $scope.establecimientoDestino = establecimientoDestino;
    $scope.detalleDocumento = detalleDocumento;

    $scope.data.codEstabOrigen = $scope.establecimientoOrigen.codEstab;
    $scope.data.codEstabDestino = $scope.establecimientoDestino.codEstab;
        
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
            field: 'idMedida',
            cellFilter: 'mapMedida:row.entity.medidas',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            editDropdownOptionsFunction: function (rowEntity, colDef) {
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
            showLoader();
            let establecimientos = await commonSvc.getEstabAsign();           
            
            $scope.establecimientosOrigen = establecimientos
            $scope.establecimientosDestino = establecimientos;

            if($scope.establecimientosOrigen.length>0){
                                             
                let dataEstabOrigen  = $scope.establecimientosOrigen.find(item=>item.codEstab===$scope.data.codEstabOrigen);         
                let dataEstabDestino  = $scope.establecimientosOrigen.find(item=>item.codEstab===$scope.data.codEstabDestino);         
                       
                //Obtenemos Puntos de Emision, Bodegas, actividad Tipo Iva 
                let dataFormEstabOrigen = await commonSvc.getDataFormEstabAsig(dataEstabOrigen);               
                let dataFormEstabDestino = await commonSvc.getDataFormEstabAsig(dataEstabDestino);               
                
                //Punto de Emision
                $scope.puntosEmision = dataFormEstabOrigen[0]; 
                            
                //Bodega Origen 
                $scope.bodegasOrigen = dataFormEstabOrigen[1];                               
             

                //Bodega Destino 
                $scope.bodegasDestino = dataFormEstabDestino[1];                               
                
            
                
            }else{
                tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }
            
            $scope.gridOptions.data = detalleDocumento;

            enumGridOptions();
            $scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
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
