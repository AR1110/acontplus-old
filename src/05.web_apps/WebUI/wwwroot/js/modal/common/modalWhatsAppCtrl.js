export {
    ModalWhatsAppCtrl
}

ModalWhatsAppCtrl.$inject = [
    '$scope',
    '$http',
    '$uibModalInstance',
    'toastService',
    'mainService',
    'params'
]

function ModalWhatsAppCtrl($scope, $http, uibModal, tS, mS, params) {
    $scope.client = {}
    // $scope.agent = navigator.userAgent
    // $scope.platform = navigator.platform

    // console.log($scope.agent)
    // console.log($scope.platform)

    let parser = new UAParser(navigator.userAgent) // you need to pass the user-agent for nodejs
    //console.log(parser) // {}
    let parserResults = parser.getResult()
    //console.log(parserResults)

    //return
    $scope.browser = parserResults.browser.name + parserResults.browser.version
    $scope.os = parserResults.os.name + parserResults.os.version

    //$scope.client.id = params.codEstab
    //$scope.client.description = !params.description ? 'Session de Whatsapp del estab: ' + params.codEstab : params.description
    $scope.session = {}
    $scope.session.is_logged_in = false
    const _env = 2
    let url = _env == 1 ? 'http://localhost:8000' : 'http://74.50.85.164:3000'
    $scope.type = params.type
    $scope.codDoc = params.codDoc

    $scope.whatsapp = {}
    if (params.telefono) {
        $scope.whatsapp.number = params.telefono
    }
    if ($scope.type == 'SRI') {
        $scope.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante electrónico:'
    } else {
        $scope.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante:'
    }

    // $scope.login = () => {
    //     //console.log($scope.client)
    //     socket.emit('create-session', {
    //         id: $scope.client.id,
    //     }, () => {
    //         console.log()
    //     })
    // }

    $scope.insert = () => {
        let data = {
            browser: JSON.stringify(parserResults.browser),
            os: JSON.stringify(parserResults.os),
        }
        mS.getData('post', 'WhatsAppSession/Post', { data: data }, true).then(response => {
            if (response.code == '1') {
                let temp = JSON.parse(response.payload)
                $scope.client.id = temp[0].id
                $scope.client.description = 'Session with token: ' + temp[0].id
                //$scope.session.id = JSON.parse(response.payload)[0].id
                $scope.login()
            }
            if (response.code == '0') {
                tS.toastr('warning', response.message)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    $scope.getOldSession = () => {
        //socket.emit('get-session', { id: $scope.session.id })
    }

    $scope.setOldSession = () => {

    }

    $scope.files = []
    $scope.fileName = ''

    const http = axios.create({
        baseURL: 'http://74.50.85.164:3000'
    })
    $scope.initialLoad = () => {
        let data = {
            browser: JSON.stringify(parserResults.browser),
            os: JSON.stringify(parserResults.os),
        }
        mS.getData('get', 'WhatsAppSession/Get?json=' + JSON.stringify(data), null, true).then(response => {
            if (response.code == '1') {
                $scope.session.id = JSON.parse(response.payload)[0].id
                $scope.client.id = JSON.parse(response.payload)[0].id
                //console.log($scope.session)
                //$scope.getOldSession()
            }
            if (response.code == '0') {
                $scope.insert()
            }
        }).catch(error => {
            console.log(error)
        })




    }

    $scope.initialLoad()



    $scope.mainApp = {
        app_ws: null,
        app_host: '74.50.85.164:3000',
        app_name: 'Whatsapp API Multi Device ({{ .AppVersion }})',
        is_logged_in: false,
        connected_devices: null,
        type_group: "g.us",
        type_user: "s.whatsapp.net"
    }
    $scope.connected_devices = []

    $scope.current_device = {}
    $scope.getSockets = () => {

        if (window["WebSocket"]) {
            let wsType = location.protocol !== 'https:' ? 'ws://' : 'wss://'
            //$scope.mainApp.app_ws = new WebSocket(wsType + document.location.host + "/ws");
            $scope.mainApp.app_ws = new WebSocket(wsType + $scope.mainApp.app_host + "/ws");

            $scope.mainApp.app_ws.onopen = (evt) => {
                $scope.mainApp.app_ws.send(JSON.stringify({
                    "code": "FETCH_DEVICES",
                    "message": "List device"
                }))
            };

            $scope.mainApp.app_ws.onmessage = (evt) => {
                const message = JSON.parse(evt.data)
                switch (message.code) {
                    case 'LOGIN_SUCCESS':
                        //showSuccessInfo(message.message)
                        //$('#modalLogin').modal('hide');

                        tS.toastr('info', 'message.message')

                        // fetch devices
                        $scope.mainApp.app_ws.send(JSON.stringify({ "code": "FETCH_DEVICES" }))
                        break;
                    case 'LIST_DEVICES':
                        //this.connected_devices = message.result
                        if (message.result) {
                            $scope.connected_devices = message.result

                            $scope.current_device.device = '+' + $scope.connected_devices[0].device.substring(0, $scope.connected_devices[0].device.indexOf('.'))

                            console.log($scope.current_device)
                            //console.log($scope.connected_devices)
                            if ($scope.current_device.device) {
                                $scope.session.is_logged_in = true
                            }
                        } else {
                            if (!$scope.session.is_logged_in) {
                                getQrCode()
                            }
                        }

                        $scope.$digest()
                        break;
                    default:
                        console.log(message)
                }
            };
        } else {
            console.error('Your browser does not support WebSockets');
        }
    }

    $scope.getSockets()

    function getQrCode() {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await http.get(`/app/login`)
                let results = response.data.results
                console.log(results)
                // this.login_link = results.qr_link;
                // this.login_duration_sec = results.qr_duration;

                // let image = document.getElementById("qrcode");
                // image.src = results.qr_link
                tS.toastr("info", "Por favor escanee el codigo QR, con su cuenta de whatsapp")
                $scope.session.src = results.qr_link
                $scope.$digest()
                resolve()

                setTimeout(() => {
                    if (!$scope.session.is_logged_in) {
                        console.log('Refreshing QR')
                        tS.toastr('info', 'Obteniendo nuevo QR')
                        getQrCode()
                    }
                }, (results.qr_duration * 1000))
            } catch (error) {
                if (error.response) {
                    reject(error.response.data.message)
                } else {
                    reject(error.message)
                }
            }
        })
    }

    // socket.on('message', (msg) => {
    //     if ($scope.session.id == msg.id) {
    //         hideLoader()
    //         $scope.session.message = msg.text
    //         tS.toastr('info', msg.text, 'Estado')
    //     }
    // })

    //socket.on('qr', (data) => {
    //     if (data) {
    //         showLoader()
    //         //console.log(session)
    //         if ($scope.session.id == data.id) {
    //             //$scope.session.src = data.src
    //             let image = document.getElementById("qrcode");
    //             image.src = data.src
    //         } else {
    //             //$scope.logout(data.id)
    //         }
    //         hideLoader()
    //     }
    // })

    // socket.on('ready', (data) => {
    //     console.log(data)
    //     if (data.id == $scope.session.id) {
    //         $scope.session.is_logged_in = true
    //         let image = document.getElementById("qrcode");
    //         image.setAttribute('src', '');
    //         tS.toastr("info", data.text)
    //     }
    // })

    // socket.on('authenticated', function (data) {
    //     if (data.id == $scope.session.id) {
    //         $scope.session.is_logged_in = true
    //         let image = document.getElementById("qrcode");
    //         image.setAttribute('src', '');
    //         tS.toastr("info", data.text)
    //     }
    // })
    // socket.on('remote_session_saved', function (data) {
    //     if (data.id == $scope.session.id) {
    //         $scope.session.is_logged_in = true
    //         tS.toastr("info", data.text)
    //     }
    // })

    function sendSms(message) {

        return new Promise(async (resolve, reject) => {
            try {
                //this.message_loading = true;
                showLoader()
                let phone = phoneNumberFormatter($scope.whatsapp.number)

                let payload = new FormData();
                payload.append("phone", phone)
                payload.append("message", message ? message : $scope.whatsapp.message)
                let response = await http.post(`/send/message`, payload)
                //this.sendMessageReset();
                resolve(response.data.message)



            } catch (error) {
                if (error.response) {
                    reject(error.response.data.message)
                } else {
                    reject(error.message)
                }
            } finally {
                hideLoader()
                //this.message_loading = false;
            }
        })
    }

    $scope.lastMessage = false


    $scope.sendMedia = (caption, file) => {

        return new Promise(async (resolve, reject) => {
            try {
                //this.message_loading = true;
                showLoader()
                let payload = new FormData();
                let phone = phoneNumberFormatter($scope.whatsapp.number)
                payload.append("caption", caption)
                payload.append("phone", phone)
                payload.append("file", file)

                let response = await http.post(`/send/file`, payload)
                //this.sendMessageReset();
                resolve(response.data.message)

                if ($scope.lastMessage) {
                    sendSms('Gracias por preferirnos, este comprobante se adjuntara a su correo electrónico!')
                }


            } catch (error) {
                if (error.response) {
                    reject(error.response.data.message)
                } else {
                    reject(error.message)
                }
            } finally {
                hideLoader()
                //this.message_loading = false;
            }
        })

        // let data = {
        //     number: $scope.whatsapp.number,
        //     caption: caption,
        //     fileName: response.fileName,
        //     contentTye: response.contentTye,
        //     base64: response.base64
        // }
        // console.log(data)
        // mS.getData('post', url + '/send-media', data).then(
        //     response => {
        //         console.log(response)
        //     }
        // ).catch(error => {
        //     console.log(error)
        // })
    }

    $scope.generateXml = () => {
        $scope.lastMessage = false
        mS.getFile('get', 'DocumentoElectronico/GetXmlSri/' + params.idDocumentoElectronico, null, true).then(response => {
            //$scope.fileName = response
            let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
            fileName = fileName.replace('"', "")

            const file = new File([response.data], fileName, { type: response.headers()["content-type"], })

            $scope.sendMedia(fileName, file)
        }).catch(error => {
            console.log(error)
        })
    }


    $scope.generateFile = () => {
        let format = 'pdf'
        let dataParms = {
            id: params.idDocumento,
            codEstab: params.codEstab,
            codigo: 'RF',
            format,
        }

        let parameters = {
            sendToWhatsapp: true,
            dataParams: JSON.stringify(dataParms)
        }
        mS.getFile('post', 'Reporte/DynamicReport', JSON.stringify(parameters), true).then(response => {

            // let serverData = new Blob([response.data], {
            //     type: response.headers()["content-type"],
            // });
            let fileName = response
                .headers()["content-disposition"].split(";")[1]
                .split("=")[1];
            const file = new File([response.data], fileName, { type: response.headers()["content-type"], })

            $scope.sendMedia(fileName, file)

            $scope.lastMessage = true

        }).catch(error => {
            console.log(error)
        })
    }

    const phoneNumberFormatter = (number) => {
        let formatted = number.replace(/\D/g, '')
        if (formatted.startsWith('0')) {
            formatted = '593' + formatted.substr(1)
        }
        // if (!formatted.endsWith('@c.us')) {
        //     formatted += '@c.us'
        // }
        return formatted
    }

    $scope.sendMessage = () => {
        try {
            if (!$scope.whatsapp.number) {
                tS.toastr('warning', 'El número de celular no puede estar vacio!')
                return
            }

            if ($scope.whatsapp.number.length < 10) {
                tS.toastr('warning', 'El número de celular no puede ser menor a diez digitos!')
                return
            }

            if ($scope.whatsapp.number.length > 10) {
                tS.toastr('warning', 'El número de celular no puede ser mayor a diez digitos!')
                return
            }


            if (!$scope.whatsapp.message) {
                tS.toastr('warning', 'El mensaje no puede estar vacio!')
                return
            }


            sendSms()

            switch ($scope.type) {
                case 'SRI':
                    $scope.generateXml()
                    // if (!$scope.generateXml()) {
                    //     tS.toastr('warning', 'No se pudo general el xml para enviar por correo')
                    //     return
                    // }
                    // if (!$scope.generateFile()) {
                    //     return
                    // }
                    $scope.generateFile()
                    break
                case 'GenericFile':
                    // if (!$scope.generateFile()) {
                    //     return
                    // }
                    $scope.generateFile()
                    break
                default:
                    break
            }

            // let data = { number: $scope.whatsapp.number, message: $scope.whatsapp.message }
            // mS.getData('post', url + '/send-message', data).then(
            //     response => {
            //         if (response.status) {
            //             switch ($scope.type) {
            //                 case 'SRI':
            //                     $scope.generateXml()
            //                     // if (!$scope.generateXml()) {
            //                     //     tS.toastr('warning', 'No se pudo general el xml para enviar por correo')
            //                     //     return
            //                     // }
            //                     // if (!$scope.generateFile()) {
            //                     //     return
            //                     // }
            //                     $scope.generateFile()
            //                     break
            //                 case 'GenericFile':
            //                     // if (!$scope.generateFile()) {
            //                     //     return
            //                     // }
            //                     $scope.generateFile()
            //                     break
            //                 default:
            //                     break
            //             }
            //         }
            //         console.log(response)
            //     }
            // ).catch(error => {
            //     console.log(error)
            // })
        } catch (error) {
            console.log(error)
        }
    }


    function logoutApi() {
        return new Promise(async (resolve, reject) => {
            try {
                showLoader()
                await http.get(`/app/logout`)
                $scope.session.is_logged_in = false
                $scope.lastMessage = false
                resolve()
            } catch (error) {
                if (error.response) {
                    reject(error.response.data.message)
                } else {
                    reject(error.message)
                }
            } finally {
                hideLoader()
            }
        })
    }
    $scope.logout = async () => {
        try {
            await logoutApi()
            tS.toastr('info', "Logout success")
            // fetch devices
            $scope.mainApp.app_ws.send(JSON.stringify({ "code": "FETCH_DEVICES" }))
        } catch (err) {
            console.log(err)
        }
    }


    $scope.askToLogout = () => {
        Swal.fire({
            //title: '',
            text: "Esta seguro de cerrar la session?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $scope.logout()
            }
        })
    }


    function reconnectApi() {
        return new Promise(async (resolve, reject) => {
            try {
                await http.get(`/app/reconnect`)
                resolve()
            } catch (error) {
                if (error.response) {
                    reject(error.response.data.message)
                } else {
                    reject(error.message)
                }
            }
        })
    }

    $scope.reconnect = async () => {
        try {
            await reconnectApi()
            tS.toastr('info', "Reconnect success")
            // fetch devices
            $scope.mainApp.app_ws.send(JSON.stringify({ "code": "FETCH_DEVICES" }))
        } catch (err) {
            console.log(err)
        }
    }


    $scope.closeModal = function () {
        uibModal.close()
    }
}