(function () {
    'use strict';

    app.controller('reporteTpvCtrl', reporteTpvCtrl);

    reporteTpvCtrl.$inject = ['$scope', 'mainService', 'toastService', '$localStorage', 'jwtHelper', 'FileSaver', 'Blob', 'commonService'];

    function reporteTpvCtrl($scope, mS, tS, $localStorage, jwtHelper, FileSaver, Blob, cS) {
        $scope.configurations = []
        $scope.empresas = []

        $scope.initialLoad = () => {
            try {
                $scope.configurations = []
                $scope.empresas = []
                let data = {
                    tipo: 6,
                    txtSearch: $scope.search == '' ? '' : ''
                }
                mS.getData('get', '/consumoTpv/Get?json=' + JSON.stringify(data)).then(
                    response => {
                        if (response.code == '1') {
                            let tempArray = JSON.parse(response.payload)
                            $scope.configurations = tempArray[0]
                            $scope.empresas = tempArray[1]
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
        $scope.initialLoad()

        $scope.getReport = () => {
            try {
                showLoader() 
                let format = 2
                let dataParams = {
                    tipo: 7,
                    idConfigTpv: document.getElementById('idConfigTpv').value,
                    idEmpresa: $scope.report.idEmpresa,
                    fechaInicio: $scope.report.fechaInicio,
                    fechaFin: $scope.report.fechaFin
                }
                let authData = $localStorage.currentUser
                let decodedJwt = {}
                if (authData) {
                    decodedJwt = jwtHelper.decodeToken(authData.token)
                }
                let parameters = {
                    reportParams: JSON.stringify({
                        idUsuarioRol: decodedJwt.idUsuarioRol,
                        codigo: 'RCETPV',
                        format: format == 1 ? 'pdf' : 'excel',
                        hasParams: false
                    }),
                    dataParams: JSON.stringify(dataParams)
                }
                let formatType =  format == 1 ? 'pdf' : 'excel'
                cS.getReport({
                    parameters,
                    formatType
                })
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }
    }
})(window.angular);
