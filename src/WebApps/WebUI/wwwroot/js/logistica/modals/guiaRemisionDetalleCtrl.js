
export {
    GuiaRemisionDetalleCtrl
}

GuiaRemisionDetalleCtrl.$inject = [
    '$scope', 
    '$uibModalInstance', 
    'commonService', 
    'toastService', 
    'guiaRemisionService',
    'params'
];

function GuiaRemisionDetalleCtrl($scope, $uibModalInstance, commonSvc, tS, guiaRemisionSvc, params) {


    let {
        dataDocumento,
        cliente,
        transportista,
        vehiculo,
        empleado,
        detalleDocumento,
        infoAdicionalDocumento
    } = params

    $scope.data = dataDocumento;
    $scope.cliente = cliente;
    $scope.transportista = transportista;
    $scope.vehiculo = vehiculo;
    $scope.empleado = empleado;
    $scope.detalleDocumento = detalleDocumento;
    $scope.infoAdicionalDocumento = infoAdicionalDocumento;

    $scope.gridOptionsDetalle = {
        enableColumnMenus: false,
        enableSorting: false,
        enableFiltering: false,
        enableRowHashing: false,
        enableCellEdit: true,
    }

    $scope.gridOptionsDetalle.columnDefs = [{
        name: 'N°',
        field: 'n',
        type: 'number',
        width: '5%',
        minWidth: '50',
        enableCellEdit: false,
        allowCellFocus: false
    },
    {
        name: "Código",
        field: "codigo",
        type: 'string',
        width: '8%',
        minWidth: '50',
        enableCellEdit: false,
        allowCellFocus: false
    },
    {
        name: 'Descripcion',
        field: 'descripcion',
        type: 'string',
        width: '65%',
        minWidth: '150',
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
            return scope.row.entity.llevaInventario !== true;

        },
        cellTooltip: function (row) {
            return row.entity.descripcion
        }
    },
    {
        name: "Cantidad",
        field: 'cantidad',
        type: "number",
        width: '10%',
        minWidth: '100',
        allowCellFocus: true,
        enableCellEditOnFocus: true
    },
    {
        name: 'Op',
        enableCellEdit: false,
        enableColumnMenu: false,
        allowCellFocus: false,
        width: '11%',
        minWidth: '100',
        cellTemplate: `<div class="text-center"><a class="btn btn-success btn-sm text-white disabled" style="cursor:pointer;" title="Editar Item"><i class="ti-pencil"></i></a>
                               <a class="btn btn-danger btn-sm text-white disabled" style="cursor:pointer;" title="Eliminar Item" ><i class="ti-trash"></i></a></div>`,
    },
    {
        name: '',
        field: 'goBackArticulo',
        enableCellEdit: false,
        width: '1%'
    },
    ]


    onInit();
    async function onInit() {

        try {

            showLoader();
            
            await guiaRemisionSvc.get({tipo: 2}).then(response=>{
                $scope.establecimientos = response.estabs;
                if ($scope.establecimientos.length > 0) {    
                    let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);     
                    $scope.puntosEmision = dataEstab.puntosEmision;
                } else {
                    tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
                }

            }).finally(()=>hideLoader()) 
            $scope.gridOptionsDetalle.data = detalleDocumento;
            enumGridOptions()            
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }

    }

    function enumGridOptions () {
        let index = 1;
        for (let item of $scope.gridOptionsDetalle.data) {
            item.n = index++;                
        }
    }

    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}