(function(){

    'use strict';

    let mainPath = `/Home/Index?name=~/Pages/TransferenciaBodega/Shared/`;

    app.component('transferenciaBodegaAdvancedSearch', { 
        templateUrl: `${mainPath}_ModalAdvancedSearch.cshtml`,
        bindings: {
            resolve: '<', 
            close: '&',
            
        },
        controller: ['$scope', function($scope){
            const $ctrl = this;

            $scope.articlesSelected = [];
            $scope.articlesFounded = [];
            
            $scope.bodegasOrigen = [];
            $scope.dataSearch = {
                bodegaOrigenId: 0
            }

            console.log($ctrl)

            $ctrl.$onInit = function(){
                const {bodegasOrigen, bodegaOrigenId} = $ctrl.resolve.params;

                $scope.bodegasOrigen = bodegasOrigen;
                $scope.dataSearch.bodegaOrigenId = bodegaOrigenId;


            }

            console.log('ctrl')




            $scope.close = function(){
                $ctrl.close()
            }


        }]
    })



})()


