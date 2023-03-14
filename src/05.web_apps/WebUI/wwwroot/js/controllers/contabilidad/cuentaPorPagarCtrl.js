(function () {
    'use strict';

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl);

    cuentaPorPagarCtrl.$inject = ['$scope'];

    function cuentaPorPagarCtrl($scope) {
        $scope.title = 'cuentaPorPagarCtrl';

        activate();

        function activate() { }
    }
})(window.angular);
