
//@ts-check
export {
    InfoAdicionalTipoDocCtrl
}
InfoAdicionalTipoDocCtrl.$inject = ['$scope', '$uibModalInstance', 'toastService', 'params', 'formulario'];

function InfoAdicionalTipoDocCtrl($scope, $uibModalInstance, tS, params, fS) {

    $scope.params = params;
    $scope.gridOptions = {
        enableColumnMenus: false,
        enableColumnReordering: true,
        columnDefs: columnDefs(!params.isView),
        showGridFooter: false,
    }
    $scope.gridOptions.data = params.infoAdicionalDocumento || [];
    setEnumeracion();



    function columnDefs(isView) {
        return [
            {
                name: 'Op.',
                headerCellTemplate: `<button type="button" ng-click="grid.appScope.addRow()"  ng-disabled="grid.appScope.params.isView" class="btn btn-secondary btn-xs">
                                        <i class="fa fa-plus-circle"></i>
                                    </button>`,
                enableCellEdit: false,
                width: '4%',
                minWidth: '10',
                cellTemplate: `<button type="button" ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;"  ng-disabled="grid.appScope.params.isView" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
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
                name: 'Nombre',
                field: 'nombre',
                enableCellEdit: isView,
                allowCellFocus: isView,
                enableCellEditOnFocus: isView,
                type: 'string',
                width: '30%',
            },
            {
                name: 'Valor',
                field: 'valor',
                enableCellEdit: isView,
                allowCellFocus: isView,
                enableCellEditOnFocus: isView,
                type: 'string',
                width: '59%',
            },
        ]
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
            idInfoAdicionalDoc: 0,
            n: 0,
            nombre: '',
            valor: ''
        });
        setEnumeracion();
    }

    $scope.deleteRow = function (row) {
        let index = $scope.gridOptions.data.indexOf(row.entity);
        $scope.gridOptions.data.splice(index, 1);
        setEnumeracion();
    }

    let validacion = (val) => !fS.isValidField(val.nombre) || !fS.isValidField(val.valor);

    $scope.closeModal = function () {
        if (!params.isView) {

            if ($scope.gridOptions.data.some(validacion)) {
                tS.toastr({
                    type: 'warning',
                    message: 'Llene todos los campos'
                })
                return
            }
        }

        $uibModalInstance.close($scope.gridOptions.data)
    }

}
