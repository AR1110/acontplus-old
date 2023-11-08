(function () {
    'use strict';

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'mainService', 'docElectService'];

    function homeCtrl($scope, mS, docElectSvc) {
        $scope.docs = []
        function getDocs() {
            docElectSvc.getByStatus({ tipo: 3 }).then(response => {
                $scope.docs = response;
                $('#comprobantesErroneosModal').modal('show');
            }
            ).catch(error => {
                console.log(error)
            })
        }

        $scope.init = () => {
            mS.getData('get', 'Dashboard/', null, true).then(function (response) {
                if (response.code == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.cantidad = JSON.parse(response.payload)
            }).catch(error => {
                console.log(error)
            })
            getDocs()
        }

        $scope.init();


        $scope.fixDocs = () => {
            location.href = '/DocumentoElectronico/Index?tipo=' + 3
        }
    }
})(window.angular)