(function () {
    'use strict';

    app.controller('kardexCtrl', kardexCtrl);

    kardexCtrl.$inject = ['$scope', 'mainService'];

    function kardexCtrl($scope, mS) {

        initiload();
        function initiload() {
            try {

            } catch (error) {
                console.log(error)
            }
        } 
    } 
})(window.angular)