
(function(){

    'use strict';

    app.controller('configGeneralCtrl', configGeneralCtrl);

    configGeneralCtrl.$inject = ['$scope', 'mainService']

    function configGeneralCtrl($scope, mS){


        $scope.data = {};
        $scope.decimales = [2,3,4,5];



        $scope.getDataTabs = function(codConfig){
            try {
                hideLoader();
                $scope.codConfig = codConfig;

                mS.getData('get','Sistema/Get/'+JSON.stringify({codConfig}), null, true).then(response=>{
                    if(response.code === '0'){
                        hideLoader();
                        console.log(response)
                    }

                    if(response.code === '1'){
                        hideLoader();
                        switch (codConfig) {
                            case 'CV':
                                $scope.gestionSistema = JSON.parse(response.payload)[0][0];
                                $scope.searchText = $scope.gestionSistema.nombreFiscal;
                                $scope.searchTextArticle = $scope.gestionSistema.descripcion;
                                break;
                        
                            case 'CI':
                                $scope.gestionSistema = JSON.parse(response.payload)[0][0];
                                $scope.valoracionMetodos = JSON.parse(response.payload)[0][1];
                                console.log(JSON.parse(response.payload));
                                break;

                            case 'CD':
                                $scope.response =  JSON.parse(response.payload)[0];
                                $scope.decimalAlmacen = $scope.response.find(item=>item.codTransaccion === 'AL')
                                $scope.decimalVenta = $scope.response.find(item=>item.codTransaccion === 'V')
                                $scope.decimalCompra = $scope.response.find(item=>item.codTransaccion === 'C')
                                break;

                            case 'CS':
                                $scope.entidadNotificaciones = JSON.parse(response.payload)[0];
                                break;
                            default:
                                break;
                        }

                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.getDataTabs("CV")
    }

})(window.angular)