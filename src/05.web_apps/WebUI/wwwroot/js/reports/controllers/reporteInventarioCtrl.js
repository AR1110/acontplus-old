

app.controller('reporteInventarioCtrl', reporteInventarioCtrl);

reporteInventarioCtrl.$inject = ['$scope', 'commonService', 'mainService', 'formulario', 'toastService', 'FileSaver', 'Blob'];

function reporteInventarioCtrl($scope, _commonSvc, mS, form, toast, FileSaver, Blob) {

    $scope.dataSearch = {};
    $scope.dataSearch.byOrderCampo = 'ar.descripcion';
    $scope.dataSearch.byOrder = 'ASC';
    $scope.dataSearch.byTipoReporte = 1; //Tipo Reporte con Valoración
    $scope.dataSearch.byTipoFormato = 'pdf';


    $scope.getAsignaciones = function () {
        let dataEstab = $scope.sucursales.find(item => item.codEstab === $scope.dataSearch.codEstab)
        _commonSvc.getDataFormEstabAsig(dataEstab).then(response => {
            $scope.bodegas = response[1]
        })
    }

    $scope.load = function () {

        _commonSvc.getEstabAsign().then(response => {

            $scope.sucursales = response;

            if ($scope.sucursales.length > 0) {
                let dataEstab = $scope.sucursales[0]
                $scope.dataSearch.codEstab = dataEstab.codEstab; //Para Filtro avanzado 
                _commonSvc.getDataFormEstabAsig(dataEstab).then(response => {
                    $scope.bodegas = response[1]
                })
            } else {
                toastr.warning('NO TIENES ASIGNADO NINGUNA SUCURSAL')
            }
        })

        mS.getData('get', '/SubFamilia/GetBy').then(response => {
            if (response.id == 0) {
                toast.toastr('warning', response.message, response.titleSms);
                return;
            };
            $scope.subFamilias = response.data;
        }, error => console.log(error))
    }
    $scope.load();

    $scope.openModalReporte = function () {
        $("#modalFiltroInventario").modal('show');
        return
    };

    $scope.onChangeCheckboxSucursal = function () {
        if ($scope.dataSearch.checkboxSucursalFiltro) {
            $scope.dataSearch.checkboxBodegaFiltro = false;
            $scope.dataSearch.checkboxDetalleBodegaFiltro = false;
            return
        }
    }
    $scope.onChangeCheckboxBodega = function () {
        if ($scope.dataSearch.checkboxBodegaFiltro) {
            $scope.dataSearch.checkboxDetalleBodegaFiltro = false;
        }
    }

    $scope.onChangeTipoReporte = function () {
        if ($scope.dataSearch.byTipoReporte === 2) {
            $scope.dataSearch.checkboxDetalleBodegaFiltro = false;
            return
        }
    }

    $scope.proveedorSearch = (textSearch) => _commonSvc.proveedorSearch(textSearch);

    $scope.selectProveedorFiltro = (item) => {
        $scope.dataSearch.numeroIdentificacion = item.proveedor.numeroIdentificacion
        console.log($scope.dataSearch)
    }

    $scope.filtrar = async function () {
        // if($scope.dataSearch.checkboxSucursalFiltro){
        //     if(form.campo($scope.dataSearch.codEstab)){
        //         toast.toastr('warning', 'Seleccione la Sucursal', 'Reporte');
        //         return
        //     }
        // }

        // if($scope.dataSearch.checkboxBodegaFiltro){
        //     if(form.campo($scope.dataSearch.byBodega)){
        //         toast.toastr('warning', 'Seleccione la Bodega', 'Reporte');
        //         return
        //     }
        // }

        // if (!$scope.dataSearch.chkProveedor) {
        //     if (form.campo($scope.dataSearch.bySubFamilia)) {
        //         toast.toastr('warning', 'Seleccione la SubFamilia', 'Reporte');
        //         return
        //     }
        // }

        if ($scope.dataSearch.chkProveedor) {
            if (!$scope.dataSearch.numeroIdentificacion) {
                toast.toastr('warning', 'Debe ingresar el proveedor', 'Reporte');
                return
            }
        }

        if (!$scope.dataSearch.chkProveedor && $scope.dataSearch.checkboxSubFamiliaFiltro) {
            if (form.campo($scope.dataSearch.bySubFamilia)) {
                toast.toastr('warning', 'Seleccione la SubFamilia', 'Reporte');
                return
            }
        }
       
        if ($scope.dataSearch.checkboxStockFiltro) {
            if (form.campo($scope.dataSearch.byStock)) {
                toast.toastr('warning', 'Seleccione el Stock', 'Reporte');
                return
            }
        }

        $scope.getReport();
    }

    $scope.getReport = function () {
        let fechaHoy = new Date();
        let fecha = fechaHoy.getDate() + '-' + (fechaHoy.getMonth() + 1) + '-' + fechaHoy.getFullYear();
        let hora = fechaHoy.getHours() + ':' + fechaHoy.getMinutes();

        let codigo = $scope.dataSearch.byTipoReporte === 1 ? 'INVRV' : 'INVAT'

        $scope.dataSearch.filtroFecha = fecha + ' ' + hora;


        const parameters = {
            reportParams: JSON.stringify({
                codigo,
                format: $scope.dataSearch.byTipoFormato,
                aditionalParams: []
            }),
            dataParams: JSON.stringify($scope.dataSearch)
        }

        const params = {
            parameters,
            formatType: $scope.dataSearch.byTipoFormato
        }

        _commonSvc.getReport(params)
    }
}

