(function () {
    'use strict';

    app.controller('reporteTpvCtrl', reporteTpvCtrl);

    reporteTpvCtrl.$inject = ['$scope', 'mainService', 'toastService'];

    function reporteTpvCtrl($scope, mS, tS) {
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

        $scope.getReportApi = (data) => {
            try {
                showLoader()
                let tempArray = JSON.parse(data)[0][0]
                let parameters = {
                    rdlcProps: JSON.parse(tempArray.rdlcProps)[0],
                    dataSources: JSON.parse(tempArray.dataSources)[0],
                    rdlcParams: JSON.parse(tempArray.rdlcParams)[0]
                } 
                let urlReports = document.getElementById('urlReports').value
                mS.getFile('POST', urlReports + 'api/Reporte/DownloadDynamic', parameters).then(
                    response => {
                        if (response) {
                            hideLoader()
                            let fileBlob = new Blob([response.data], { type: response.headers()['content-type'] });
                            let objectUrl = window.URL || window.webkitURL;
                            let urlFile = objectUrl.createObjectURL(fileBlob)
                            window.open(urlFile, "_blank")
                        }
                    }, error => {
                        hideLoader()
                        console.log(error)
                    }
                )
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }
        
        
        $scope.getReport = () => {
            try {
                let format = 2
                let data = {
                    tipo: 7,
                    formato: format == 1 ? 'pdf' : 'excel',
                    idConfigTpv: document.getElementById('idConfigTpv').value,
                    idEmpresa: $scope.report.idEmpresa,
                    fechaInicio: $scope.report.fechaInicio,
                    fechaFin: $scope.report.fechaFin
                }
                mS.getData('get', '/consumoTpv/Get?json=' + JSON.stringify(data)).then(
                    response => {
                        if (response.code == '1') {
                            $scope.getReportApi(response.payload)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
    }
})(window.angular);
