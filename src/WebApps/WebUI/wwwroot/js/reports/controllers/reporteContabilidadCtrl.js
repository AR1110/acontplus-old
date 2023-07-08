(function(){

    'use strict';

    app.controller('reporteContabilidadCtrl', reporteContabilidadCtrl);

    reporteContabilidadCtrl.$inject = ['$scope', 'commonService', 'toastService', 'formulario']

    function reporteContabilidadCtrl($scope, commonSvc, tS, fS){

        $scope.showCliente = false;
        $scope.showEmpleado = true;

        $scope.searchCliente = {
            nombreCliente: ''
        }
        $scope.searchUser = {
            nombreCompleto: ''
        }

        $scope.tiposDoc = [
            {codDoc: 'MC', descripcion: 'Movimiento Caja'},
            {codDoc: 'A', descripcion: 'Anticipo'},
        ]


        $scope.dataSearch = {
            codDoc : 'MC',
            fechaInicio : new Date(),
            fechaFin : new Date(),
            format: 'pdf'
        }


        $scope.onload = function(){
            try {
                showLoader();
                commonSvc.getEstabAsign().then(response=>{
                    hideLoader();
                    $scope.establecimientos = response;
                    $scope.dataSearch.codEstab = $scope.establecimientos.length>0 && $scope.establecimientos[0].codEstab;
                }).catch(error=>{
                    console.log(error)
                    hideLoader();
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.onload();



        $scope.onChangeTipoDoc = function(){
            if($scope.dataSearch.codDoc==='A'){
                $scope.showCliente = true;
                $scope.showEmpleado = false;
                $scope.dataSearch.idEmpleado = 0;
            }
            if($scope.dataSearch.codDoc==='MC'){
                $scope.showCliente = false;
                $scope.showEmpleado = true;
                $scope.dataSearch.idCliente = 0;
            }
        }


        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
            $scope.dataSearch.fechaFin = item.endDate 
        }


        $scope.onKeyupCliente = function(){
            if(!$scope.searchCliente.nombreCliente){
                $scope.dataSearch.idCliente = 0;
            }
        }

        $scope.onSelectCliente = function(item){
            $scope.dataSearch.idCliente = item.idCliente;
        }

        $scope.onKeyupUser = function(){
            if(!$scope.searchUser.nombreCompleto){
                $scope.dataSearch.idUsuario = 0;
            }
        }

        $scope.onSelectUser = function(item){
            $scope.dataSearch.idUsuario = item.idUsuario;
        }

        $scope.getReport = function(){
            try {

                if(!$scope.dataSearch.codEstab){
                    tS.toatsr('warning', 'Establecimiento es requerido!')
                    return
                }
                

                const dataParams = {
                    codEstab: $scope.dataSearch.codEstab,
                    tipoDoc: $scope.dataSearch.codDoc,
                    checkBoxCliente: $scope.dataSearch.idCliente > 0 ,
                    idCliente: $scope.dataSearch.idCliente,
                    checkBoxEmpleado: $scope.dataSearch.idEmpleado > 0,
                    idEmpleado: $scope.dataSearch.idEmpleado,
                    checkBoxUsuario: $scope.dataSearch.idUsuario > 0,
                    idUsuario: $scope.dataSearch.idUsuario,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),

                } 
 
                const parameters = {
                    reportParams: JSON.stringify({
                        codEstab: $scope.dataSearch.codEstab,
                        hasParams: true,
                        codigo: 'RMC',
                        format: $scope.dataSearch.format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParams)
                }
    
    
                commonSvc.getReport({
                    parameters,
                    formatType: $scope.dataSearch.format
                })       
            } catch (error) {
                console.log(error)
            }
        }

    }


})(window.angular)