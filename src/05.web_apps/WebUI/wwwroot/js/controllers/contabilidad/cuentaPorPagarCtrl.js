(function () {
    'use strict';

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl)

    cuentaPorPagarCtrl.$inject = ['$scope', 'toastService', 'mainService', 'screenSize', '$timeout']

    function cuentaPorPagarCtrl($scope, _tS, _mS, _sS, $timeout) {

        $scope.isMobile = _sS.on('xs, sm', function (isMatch) {
            $scope.isMobile = isMatch
        })

        if ($scope.isMobile) {
            Swal.fire(
                'Dispositivo Movil Detectado!',
                'Para una mejor comodidad, le recomendamos usar una Laptop o PC.',
                'success'
            )
        } else {
            $timeout(() => {
                document.getElementById('menu_toggle').click()
            }, 1100)
        }

        $scope.cuenntasPorPagar = []


        $scope.initialLoad = () => {
            try {
                _mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({ tipo: 1 }), null, true).then((response) => {
                    if (response.code == '0') {
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        _tS.toastr('success', response.message)
                        $scope.cuenntasPorPagar = JSON.parse(response.payload)
                        console.log($scope.cuenntasPorPagar)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }
        $scope.initialLoad()
    }
})(window.angular)
