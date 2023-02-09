
angular
    .module('acontPlusApp')
    .controller('atsCtrl', atsCtrl);

atsCtrl.$inject = ['$scope', 'mainService', 'toastService', 'FileSaver', 'Blob'];

function atsCtrl($scope, mS, tS, FileSaver, Blob) {
    'use strict';
    $scope.getAts = getAts;
    $scope.downloadXml = downloadXml;
    $scope.initialLoad = initialLoad;

    function getActualMonth() {
        let actualDate = new Date();
        //$scope.yearSelected = actualDate.getFullYear();
        return actualDate.getMonth() + 1;
    }

    function initialLoad() {
        try {
            mS.getData('get', '/Ats/GetPeriods').then(response => {
                $scope.years = response[0];
                $scope.months = response[1];
                $scope.yearSelected = response[0][0];
                for (const element of $scope.months) {
                    if (getActualMonth() === element.month) {
                        $scope.monthSelected = element;
                    }
                }
                if (getActualMonth()===6 || getActualMonth() == 12) {
                    declarationType()
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    initialLoad();

    $scope.semiannual = false;
    $scope.showSemiAnual = false;

    $scope.declarationType = function () {
        if ($scope.yearSelected.year >= 2020 && ($scope.monthSelected.month == 6 || $scope.monthSelected.month == 12)) {
            $scope.semiannual = false;
            $scope.showSemiAnual = true;
            return;
        }
        $scope.semiannual = false;
    }

    function getAts() {
        try {
            let json = {
                semianual: $scope.semiannual,
                year: Number($scope.yearSelected.year),
                month: Number($scope.monthSelected.month)
            };
            mS.getFile('get', '/Ats/Get?json=' + JSON.stringify(json)).then(response => {
                if (response.id == 0) {
                    tS.toastr('warning', response.message)
                    return;
                }
                if (response.data.size > 0) {
                    let serverData = new Blob([response.data], { type: response.headers()['content-type'] });
                    let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1];
                    FileSaver.saveAs(serverData, fileName);

                    // let element = document.createElement('a');
                    // let fileBlob = new Blob([response.data], {
                    //     type: response.data.type
                    // });
                    // let url = URL.createObjectURL(fileBlob);
                    // element.href = url;
                    // element.setAttribute('download', 'fileName.xml');
                    // document.body.appendChild(element); 
                    // element.click();
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    function downloadXml() {
        window.open("/AtsVenta/getXmlSales?year=" + $scope.year.year + "&month=" + $scope.month.codigo, '_blank');
    }
}
