(function () {
    'use strict';

    app.controller('testCtrl', testCtrl);

    testCtrl.$inject = ['$scope', '$http', 'mainService'];

    function testCtrl($scope, $http, mS) {
        $scope.title = 'testCtrl';

        $scope.client = {}
        $scope.sessions = []

        $scope.whatsapp = { number: '0991229095' }


        $scope.print = () => {
            $http.post("http://localhost:5000/api/Print", {
                headers: {
                    "Authorization": null
                }
            }).then(response => {
               console.log(response.data.data)
            });
        }

        $scope.login = () => {
            //socket.emit('create-session', {
            //    id: $scope.client.id,
            //    description: $scope.client.description
            //})
        }

        //socket.on('init', (data) => {
        //    for (const session of data) {
        //        if ($scope.client.id == session.id) {
        //            $scope.sessions.push({ id: session.id, description: session.description })
        //        }
        //        if (session.ready) {
        //            //$(`.client.${clientClass} .logs`).prepend($('<li>').text('Whatsapp is ready!'))
        //            $('.logs').append($('<li>').text('Whatsapp is ready!'))
        //        } else {
        //            //$(`.client.${clientClass} .logs`).prepend($('<li>').text('Connecting...'))
        //            $('.logs').append($('<li>').text('Connecting...'))
        //        }
        //    }
        //})

        //socket.on('remove-session', (id) => {
        //    //$(`.client.client-${id}`).remove()
        //})

        //socket.on('message', (msg) => {
        //    $('.logs').append($('<li>').text(msg.text))
        //})

        //socket.on('qr', (data) => {
        //    console.log(data)
        //    //$('#qrcode').attr('src', src)
        //    if ($scope.client.id == data.id) {
        //        $scope.sessions.push({
        //            id: data.id,
        //            description: data.description
        //        })
        //        $(`#${data.id}-qrcode`).attr('src', data.src);
        //    }
        //})

        //socket.on('ready', (data) => {
        //    //$(`.client.client-${data.id} #qrcode`).hide()
        //})
        
        $scope.getRide = () => {
            let format = 'pdf';
            let dataParms = {
                id: item.idFactura,
                codEstab: item.codEstab,
                codigo: 'RF',
                format,
            }

            let parameters = {
                dataParams: JSON.stringify(dataParms)
            }
            mS.getFile('post', 'Reporte/DynamicReport', JSON.stringify(parameters), true).then(response => {
                hideLoader();
                let fileBlob = new Blob([response.data], {
                    type: response.data.type,
                })
                return fileBlob
            }).catch(error => {
                hideLoader();
                console.log(error)
            })
        }



        $scope.sendMessage = () => {
            try {
                showLoader()
                //var file = getRide()
                let data = { number: $scope.whatsapp.number, message: $scope.whatsapp.message, sender: $scope.client.id }
                //let data = { number: $scope.whatsapp.number, file: file, caption: 'caption' }
                $http.post('http://localhost:8000/send-message', data).then(
                    response => {
                        console.log(response)
                        hideLoader()
                    }
                ).catch(error => {
                    hideLoader()
                    console.log(error)
                })
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }


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
