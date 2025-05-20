export {
    modalResgitrarSolicitudAutorizacionCtrl
}

modalResgitrarSolicitudAutorizacionCtrl.$inject = [
    '$scope',
    '$uibModalInstance', 
    'formulario',
    'toastService',
    'solicitudAutorizacionService',
    'params'
];

function modalResgitrarSolicitudAutorizacionCtrl($scope, $uibModalInstance,  fS, tS, $solicitudAutorizacionSvc , params) {
 
    $scope.vendedores = [];
    $scope.esMultipleVendedor = false;
    $scope.data = {
        idUsuario: 0
    }

    $scope.gridOptions = {
        enableColumnMenus: false,
        enableColumnReordering: true,
        columnDefs: [
            {
                name: 'Op.',
                headerCellTemplate: `<button type="button" ng-click="grid.appScope.addRow()"   class="btn btn-secondary btn-xs">
                                        <i class="fa fa-plus-circle"></i>
                                    </button>`,
                enableCellEdit: false,
                width: '4%',
                minWidth: '10',
                cellTemplate: `<button type="button" ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;"   class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                                    <i class="fa fa-trash"></i>
                                </button>`,
            },
            {
                name: 'N°',
                field: 'n',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '25%', maxWidth: 50, minWidth: 50
            },
            {
                name: 'Campo',
                field: 'nombre',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '25%',
            },
            {
                name: 'Valor',
                field: 'valor',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '20%',
            },
            {
                name: 'Valor nuevo',
                field: 'nuevoValor',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '20%',
            },
            {
                name: 'Obs',
                field: 'obs',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '20%',
            },
        ],
        showGridFooter: false,
    }


    function setEnumeracion() {
        let index = 0, counter = 1;
        for (let _item of $scope.gridOptions.data) {
            $scope.gridOptions.data[index].n = counter++
            index++
        }
    }

    $scope.addRow = function () {
        $scope.gridOptions.data.push({
           
        });
        setEnumeracion();
    }

    $scope.deleteRow = function (row) {
        let index = $scope.gridOptions.data.indexOf(row.entity);
        $scope.gridOptions.data.splice(index, 1);
        setEnumeracion();
    }

 

    init();
    function init(){ 
        $scope.vendedores = params.vendedores;
        $scope.esMultipleVendedor = params.esMultipleVendedor;
        if ($scope.vendedores.length > 0) {
            let dataUsuario = $scope.vendedores.find(item=>item.predeterminado);
            if(dataUsuario && !$scope.esMultipleVendedor){
                $scope.data.idUsuario = dataUsuario.idUsuario;
            } 
        } 
    }
    
    function isValidFieldDetalle(prop){
        return $scope.gridOptions.data.some(item=>  !fS.isValidField(item[prop]))
    }

    $scope.save = function(){
        if(!fS.getValidId($scope.data.idUsuario)){
            tS.toastr({
                type: 'warning',
                message: 'Seleccione el Usuario Solicitante'
            })
            return 
        }

        if($scope.gridOptions.data.length>0){
            let isEmptyName =isValidFieldDetalle("nombre")
            let isEmptyValue =isValidFieldDetalle("valor")
            let isEmptyNewValue =isValidFieldDetalle("nuevoValor")
            
            if(isEmptyName){
                tS.toastr({
                    type: 'warning',
                    message: 'Ingrese "Nombre modificar" en el detalle'
                })
                return
            }
            if(isEmptyValue){
                tS.toastr({
                    type: 'warning',
                    message: 'Ingrese campo "Valor" en el detalle'
                })
                return
            }
            if(isEmptyNewValue){
                tS.toastr({
                    type: 'warning',
                    message: 'Ingrese campo "Nuevo valor" en el detalle'
                })
                return
            }
        }

        if(!fS.isValidField($scope.data.obs)){
            tS.toastr({
                type: 'warning',
                message: 'Ingrese la observación'
            })
            return 
        }

        let senData = {
            idUsuario: $scope.data.idUsuario,
            obs: $scope.data.obs,
            codigoModulo : params.data.codigoModulo,
            idDocumentoRef : params.data.idDocumento,
            codigoAccion : params.data.codigoAccion, 
            infoExtraJson : JSON.stringify(params.data.infoExtraJson),  
            detalles: $scope.gridOptions.data,

        }

        $solicitudAutorizacionSvc.create(senData).then(response=>{
            if(response.code==="0"){
                tS.toastr({
                    type: 'warning',
                    message: response.message
                }) 
            }
            if(response.code==="1"){
                tS.toastr({
                    type: 'success',
                    message: response.message
                })
                $scope.close()
            }
        })

    }


    $scope.close = function(){
        $uibModalInstance.close()
    }

}