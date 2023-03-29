(function () {
    'use strict';

    app.controller('testCtrl', testCtrl);

    testCtrl.$inject = ['$scope', '$http'];

    function testCtrl($scope, $http) {
        $scope.title = 'testCtrl';

        $scope.postLocalHost = () => {
            try {
                let data = {
                    rdlcProps: {
                        rdlcName: 'Test.rdlc',
                        printerName: 'Microsoft XPS Document Writer',
                        isThermal: false,
                        format: 'Image',
                        deviceInfo: '<DeviceInfo><OutputFormat>EMF</OutputFormat><PageWidth>2.99in</PageWidth><PageHeight>11.69in</PageHeight><MarginTop>0.0in</MarginTop><MarginLeft>0.0in</MarginLeft><MarginRight>0.0in</MarginRight><MarginBottom>0.0in</MarginBottom></DeviceInfo>'
                    },
                    dataSources: {
                        testDs: [
                            {
                                name: 'ivan',
                                email: 'ifer343@gmail.com'
                            },
                            {
                                name: 'fernando',
                                email: 'ifer777@outlook.com'
                            }
                        ],
                        testSecondDs: [
                            {
                                name: 'ivan',
                                email: 'ifer343@gmail.com'
                            },
                            {
                                name: 'fernando',
                                email: 'ifer777@outlook.com'
                            }
                        ]
                    },
                    rdlcParams: {
                        testParam: 'THIS IS A TEST PRINT'
                    }
                }
                $http.post('http://127.0.0.1:8000?json=' + JSON.stringify(data)).then(response => {
                    console.log(response)
                }).catch(error => {
                    console.log(error)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
})();
