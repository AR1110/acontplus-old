export {
    modalDocVentaDetalleCtrl
}

modalDocVentaDetalleCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    '$timeout',
    'DOC_TYPE',
    'TAX_RATE_CODE',
    'params'
];

function modalDocVentaDetalleCtrl($scope, $uibModalInstance, $injector, $timeout, DOC_TYPE, TAX_RATE_CODE, params) {
    const notaEntregaSvc = $injector.get('notaEntregaService');
    let { id, codDoc } = params;
    let tarifaImpuesto = {
        [TAX_RATE_CODE.TWELVE_PERCENT]: "IVA 12%",
        [TAX_RATE_CODE.DIFFERENTIATED_TAX]: "IVA 8%",

    }
    $scope.gridOptions = {
        enableColumnMenus: false,
        enableColumnReordering: true,
        showGridFooter: false,
        data: []
    }
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        if ($scope.gridApi) {
            $timeout(() => {
                $scope.gridApi.core.handleWindowResize();
                $scope.gridApi.grid.refresh();
            }, 5);
        }
    }
    if (codDoc === DOC_TYPE.NE) {
        showLoader();
        notaEntregaSvc.getIdForInfo(id).then(response => {
            let { data, cliente, items } = response;
            $scope.data = data;
            $scope.data.tarifaImpuestoVigente = tarifaImpuesto[$scope.data.codigoPorcentaje]
            $scope.cliente = cliente;
            $scope.gridOptions.data = items;
            setColumnDefsVista();
            gridOptionsEnumeracion();
        }).catch(error => {
            console.warn(error)
        }).finally(() => {
            hideLoader();
        })
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
            field: 'index',
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
            field: 'tarifa',
            width: '12%',
            minWidth: '100',
        },
        {
            name: 'Precio U.',
            field: 'precioUnitario',
            type: 'number',
            width: '8%',
            minWidth: '100',
        },
        {
            name: 'P. Iva',
            field: 'precioConIva',
            min: 0,
            type: 'number',
            width: '7%',
            minWidth: '100',
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

    function gridOptionsEnumeracion() {
        let index = 1;
        for (let item of $scope.gridOptions.data) {
            item.index = index++;
        }
    }



    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}