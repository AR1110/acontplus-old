(()=>{

    'use strict';
    
    app.controller('carteraProveedorCtrl', carteraProveedorCtrl);
    carteraProveedorCtrl.$inject = ['$scope', '$injector'];

    function carteraProveedorCtrl($scope, $injector){
        const commonSvc = $injector.get('commonService');
        const tS = $injector.get('toastService');
        const fS = $injector.get('formulario');



        $scope.dataSearch = {
            checkboxRangeDate: true
        };
        $scope.establecimientos = [];
        $scope.estadoDocumentos = [];
        
        $scope.proveedor = {};

        initLoad();
        function initLoad(){
            try {
                showLoader();
                commonSvc.getEstabAsign().then(response => {
                    $scope.establecimientos = response;
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => estab.predeterminado);
                        if (dataEstab) {
                            $scope.dataSearch.codEstab = dataEstab.codEstab;
                        }
                    } else {
                        tS.taostr('warning', 'No tienes establecimientos asignadas');
                    } 
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());

                commonSvc.getEstadoDocByCodDoc('CPR').then(response => {
                    $scope.estadoDocumentos = response;
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.resultRangeFilter = function(item){ 
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
        }

        $scope.onKeyupProveedor = function(){
            if (!$scope.proveedor.nombreProveedor){
                $scope.dataSearch.idProveedor = 0;
            }
        }

        $scope.onSelectProveedor = function(item){
            $scope.dataSearch.idProveedor = item.idProveedor; 
        }



        function isValidForm(){
            if(!fS.isValidField($scope.dataSearch.codEstab)){
                tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }
            if ($scope.dataSearch.checkboxDate){
                if (!fS.isValidField($scope.dataSearch.fechaInicio)){
                    tS.toastr('warning', 'Seleccione la fecha de inicio');
                    return
                }
                if (!fS.isValidField($scope.dataSearch.fechaFin)) {
                    tS.toastr('warning', 'Seleccione la fecha de finalización.');
                    return
                }
            }
            if ($scope.dataSearch.checkboxSupplier){
                if(!($scope.dataSearch.idProveedor>0)){
                    tS.toastr('warning', 'Seleccione el proveedor!');
                    return 
                }
            }
            return true;
        }

        function getParameterReport(format){

            const dataParams = {
                byProveedor: $scope.dataSearch.idProveedor,
                checkBoxProveedor: $scope.dataSearch.checkboxSupplier,
                checkBoxFecha: $scope.dataSearch.checkboxRangeDate,
                checkBoxEstado: $scope.dataSearch.byEstado > 0, 
                tipoFecha: $scope.dataSearch.checkboxRangeDate? "FE": "FV",
                byEstado: fS.isValidField($scope.dataSearch.byEstado),
                fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
            }
            const parameters = {
                reportParams: JSON.stringify({
                    codigo: "RCPRV",
                    format,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataParams)
            }
            return parameters; 
        }


        $scope.getReportPdf = function(){
            try {
                if(!isValidForm()) return

                const formatType = 'pdf';

                const parameters = getParameterReport(formatType)
                commonSvc.getReport({
                    parameters,
                    formatType
                });
            } catch (error) {
                console.log(error)
            }
        }

        $scope.getReportExcel = function(){
            try {
                if (!isValidForm()) return

                const formatType = 'excel';

                const parameters = getParameterReport(formatType)
                commonSvc.getReport({
                    parameters,
                    formatType
                });
            } catch (error) {
                console.log(error)
            }
        } 

        
    } 
})(window.angular) 