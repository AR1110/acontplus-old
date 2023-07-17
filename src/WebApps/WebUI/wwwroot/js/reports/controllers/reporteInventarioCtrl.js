(function(){

    'use strict';

    

    app.controller('reporteInventarioCtrl', reporteInventarioCtrl);

    reporteInventarioCtrl.$inject = ['$scope', 'commonService', 'mainService', 'formulario', 'toastService'];

    function reporteInventarioCtrl($scope, _commonSvc, mS, fS, tS) {

        $scope.dataSearch = {};
        $scope.dataSearch.byOrderCampo = 'ar.descripcion';
        $scope.dataSearch.byOrder = 'ASC';
        $scope.dataSearch.byTipoReporte = 3 //Tipo Reporte con Valoración
        $scope.dataSearch.byTipoFormato = 'pdf';
        $scope.dataSearch.codTransaccion = 'S';

        $scope.tipoReportes = [
            {codigo: 1, descripcion: 'Con Valoración', codigoReporte: 'INVRV'},
            {codigo: 2, descripcion: 'Con Lista de Precios', codigoReporte: 'INVAT'},
            {codigo: 3, descripcion: 'Consumo Diario', codigoReporte: 'CDA'}
        ] 

        $scope.hideCheckbox = true; //Oculta: chechboxk proveedor, subfamilia si es tipo-reporte 2



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
                    tS.toastr('warning', 'NO TIENES ASIGNADO NINGUNA SUCURSAL')
                }
            })

            mS.getData('get', '/SubFamilia/GetBy').then(response => {
                if (response.id == 0) {
                    tS.toastr('warning', response.message, response.titleSms)                
                    return;
                };
                $scope.subFamilias = response.data;
            }, error => console.log(error))
        }
        $scope.load(); 

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
            $scope.hideCheckbox= false;
            if ($scope.dataSearch.byTipoReporte === 2) {
                $scope.dataSearch.checkboxDetalleBodegaFiltro = false;
                return
            }
            if($scope.dataSearch.byTipoReporte ===3){
                $scope.hideCheckbox = true;
                $scope.dataSearch.chkProveedor = false;
            }
        }

        $scope.proveedorSearch = (textSearch) => _commonSvc.proveedorSearch(textSearch);

        $scope.onKeyupProvedorAutocompleteFiltro = function(){
            $scope.dataSearch.numeroIdentificacion = null;
        }
        $scope.selectProveedorFiltro = (item) => {
            $scope.dataSearch.numeroIdentificacion = item.proveedor.numeroIdentificacion 
        }



        $scope.onKeyupArticle = function(){
            if(!$scope.dataSearchArticle){
                $scope.dataSearch.idArticulo = 0;
            } 
        }
        $scope.onSelectArticle = function(item){
            console.log(item); 
            $scope.dataSearchArticle = item.descripcion;
            $scope.dataSearch.idArticulo = item.idArticulo;
        }


        $scope.onSelectUser = function(item){
            $scope.dataSearch.idUsuario = item.idUsuario;
        }
        $scope.onKeyupUser = function(){
            if(!$scope.dataSearchUser.nombreCompleto){
                $scope.dataSearch.idUsuario = 0;
            }
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
                    tS.toastr('warning',  'Debe ingresar el proveedor', 'Reporte');
                    return
                }
            }

            if (!$scope.dataSearch.chkProveedor && $scope.dataSearch.checkboxSubFamiliaFiltro) {
                if (!$scope.dataSearch.bySubFamilia) {
                    tS.toastr('warning',  'Seleccione la SubFamilia', 'Reporte');
                    return
                }
            }
        
            if ($scope.dataSearch.checkboxStockFiltro) {
                if (!$scope.dataSearch.byStock) {
                    tS.toastr('warning',  'Seleccione el Stock', 'Reporte');
                    return
                }
            }

            if($scope.dataSearch.checkboxUsuarioFiltro){
                if(!($scope.dataSearch.idUsuario>0)){
                    tS.toastr('warning', 'Seleccione el Usuario');
                    return;
                }
            }

            $scope.getReport();
        }

        $scope.getReport = function () {
            let fechaHoy = new Date();
            let fecha = fechaHoy.getDate() + '-' + (fechaHoy.getMonth() + 1) + '-' + fechaHoy.getFullYear();
            let hora = fechaHoy.getHours() + ':' + fechaHoy.getMinutes();

            let codigo = $scope.tipoReportes.find(item=>item.codigo===$scope.dataSearch.byTipoReporte).codigoReporte;

            $scope.dataSearch.filtroFecha = fecha + ' ' + hora;

            let dataSearch = {}

            if($scope.dataSearch.byTipoReporte===3){
                dataSearch = {
                    checkBoxArticulo : $scope.dataSearch.checkboxArticuloFiltro,
                    checkBoxUsuario : $scope.dataSearch.checkboxUsuarioFiltro,
                    checkBoxFecha : true,
                    checkBoxTransaccion : true,
                    idUsuario : $scope.dataSearch.idUsuario,
                    idArticulo : $scope.dataSearch.idArticulo,
                    codTransaccion : $scope.dataSearch.codTransaccion,
                    fechaInicio : fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    fechaFin : fS.formatDateTimeZone($scope.dataSearch.fechaFin)
                }

            }

            if([1, 2].includes($scope.dataSearch.byTipoReporte)){
                dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    chkProveedor: $scope.dataSearch.chkProveedor,
                    numeroIdentificacion: $scope.dataSearch.numeroIdentificacion,
                    checkboxSubFamiliaFiltro: $scope.dataSearch.checkboxSubFamiliaFiltro,
                    bySubFamilia: $scope.dataSearch.bySubFamilia,
                    byOrderCampo: $scope.dataSearch.byOrderCampo,
                    byTipoFormato: $scope.dataSearch.byTipoFormato,
                    byTipoReporte: $scope.dataSearch.byTipoReporte,
                    byOrder: $scope.dataSearch.byOrder,
                    filtroFecha: $scope.dataSearch.filtroFecha

                }
            } 
            const parameters = {
                reportParams: JSON.stringify({
                    codigo,
                    format: $scope.dataSearch.byTipoFormato,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataSearch)
            }

            const params = {
                parameters,
                formatType: $scope.dataSearch.byTipoFormato
            }

            _commonSvc.getReport(params)
        }
    }




})(window.angular)