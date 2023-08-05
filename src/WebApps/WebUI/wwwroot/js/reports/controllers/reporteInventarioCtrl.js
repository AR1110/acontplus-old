(function(){

    'use strict';

    

    app.controller('reporteInventarioCtrl', reporteInventarioCtrl);

    reporteInventarioCtrl.$inject = ['$scope', 'commonService', 'mainService', 'formulario', 'toastService'];

    function reporteInventarioCtrl($scope, _commonSvc, mS, fS, tS) {

        $scope.dataSearch = {};
        $scope.dataSearch.byOrderCampo = 'ar.descripcion';
        $scope.dataSearch.byOrder = 'ASC';
        $scope.dataSearch.byTipoReporte = 0 //Consumo Diario
        $scope.dataSearch.byTipoFormato = 'pdf';
        $scope.dataSearch.codTransaccion = 'S'; 
        $scope.dataSearch.tipoReporteArticulo = 'INVRV'; 

        $scope.getAsignaciones = function () {
            let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.dataSearch.codEstab)
            _commonSvc.getDataFormEstabAsig(dataEstab).then(response => {
                $scope.bodegas = response[1]
            })
        }

        $scope.initiload = function () {

            _commonSvc.getEstabAsign().then(response => {

                $scope.establecimientos = response;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos[0]
                    $scope.dataSearch.codEstab = dataEstab.codEstab; //Para Filtro avanzado 
                    _commonSvc.getDataFormEstabAsig(dataEstab).then(response => {
                        $scope.bodegas = response[1]
                    })
                } else {
                    tS.toastr('warning', 'NO TIENES ASIGNADO NINGUN ESTABLECIMIENTO')
                }
            })

            mS.getData('get', '/SubFamilia/GetBy').then(response => {
                if (response.id == 0) {
                    tS.toastr('warning', response.message, response.titleSms)                
                    return;
                };
                $scope.subFamilias = response.data;
            })
        }
        $scope.initiload(); 

        $scope.onTab = function(e, type) {
            $scope.dataSearch.byTipoReporte = type;
            let contentTab = document.querySelectorAll(".tab-content .tab-pane");
            let getTabPane = contentTab[type]; 
        
            for(let item of contentTab){
                item.classList.remove("active");
            }
            getTabPane.classList.add("active");
        } 

        $scope.onKeyupProveedor= function(){
            if(!$scope.proveedor.nombreProveedor){
                $scope.dataSearch.numeroIdentificacion = null;
            }
        }
        $scope.onSelectProveedor = function(item){
            $scope.dataSearch.numeroIdentificacion = item.numeroIdentificacion; 
        }

 
        $scope.onKeyupArticle = function(){
            if(!$scope.dataSearchArticle){
                $scope.dataSearch.idArticulo = 0;
            } 
        }
        $scope.onSelectArticle = function(item){ 
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

            $scope.dataSearch.filtroFecha =  getFilterDate();
            
            if($scope.dataSearch.byTipoReporte===0){
                $scope.getReportConsumoDiario();
            }
            if($scope.dataSearch.byTipoReporte===1){
                $scope.getReportArticle();
            }
            if($scope.dataSearch.byTipoReporte===2){
                $scope.getReportArticuloFraccionado();
            }
        }

        function getFilterDate(){
            let fechaHoy = new Date();
            let fecha = fechaHoy.getDate() + '-' + (fechaHoy.getMonth() + 1) + '-' + fechaHoy.getFullYear();
            let hora = fechaHoy.getHours() + ':' + fechaHoy.getMinutes();
            return fecha + ' ' + hora;
        }

        // REPORTE DE CONSUMO DIARIO DE ARTICULOS
        $scope.getReportConsumoDiario = function() {
            let dataSearch = {
                tipo : 4,
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

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: 'CDA',
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

        // REPORTE DE ARTICULOS CON TARIFAS DE PRECIO ||  REPORTE DE ARTICULOS CON STOCK POR BODEGA
        $scope.getReportArticle = function(){
            let dataSearch = {
                tipo : $scope.dataSearch.tipoReporteArticulo ==='INVRV'? 3: 2,
                codEstab: $scope.dataSearch.codEstab,
                chkProveedor: $scope.dataSearch.chkProveedor,
                numeroIdentificacion: $scope.dataSearch.numeroIdentificacion,
                checkboxSubFamiliaFiltro: $scope.dataSearch.checkboxSubFamiliaFiltro,
                ckFechaCaducidad: $scope.dataSearch.ckFechaCaducidad,
                fechaInicio : fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                fechaFin : fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                chkUbicacion: $scope.dataSearch.chkUbicacion,
                bySubFamilia: $scope.dataSearch.bySubFamilia,
                byOrderCampo: $scope.dataSearch.byOrderCampo,
                byTipoFormato: $scope.dataSearch.byTipoFormato,
                byTipoReporte: $scope.dataSearch.byTipoReporte,
                byOrder: $scope.dataSearch.byOrder,
                filtroFecha: $scope.dataSearch.filtroFecha
            }

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: $scope.dataSearch.tipoReporteArticulo ==='INVRV'? 'INVRV': 'INVAT',
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

        // REPORTE DE ARTICULOS FRACCIONADOS 
        $scope.getReportArticuloFraccionado = function () {
            let dataSearch = {
                tipo : 1,
                checkBoxArticulo : $scope.dataSearch.checkboxArticuloFiltro,
                idArticulo : $scope.dataSearch.idArticulo
            }
            const parameters = {
                reportParams: JSON.stringify({
                    codigo: 'RAF',
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