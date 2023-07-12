

(function() {

    'use strict';

    const PATH_MAIN_MODAL = '~Areas/Caja/Pages/Shared/_ModalAddUpdate.cshtml'
    const PATH_API = 'Caja/'
    let mS = {};
    let tS = {} 

    app.controller('cajaCtrl', cajaCtrl);
    
    cajaCtrl.$inject = ['$scope', '$injector'];

    function cajaCtrl($scope, $injector) {

        mS = $injector.get('mainService');

        $scope.dataSearch = {
            pageIndex:1,
            pageSize: 1000
        };

        $scope.initiload = function (){
            try {
                $scope.cajas = [];
                mS.getData('get', PATH_API + '?json=' + JSON.stringify($scope.dataSearch), null, true).then(response=>{
                    hideLoader();
                    if(response.code=='0'){
                        console.log(response)
                    }
                    if(response.code=='1'){
                        $scope.cajas = JSON.parse(response.payload) || [];
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.initiload();


    }
})(window.angular)