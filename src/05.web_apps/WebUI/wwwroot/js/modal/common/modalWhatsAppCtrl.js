export {
    ModalWhatsAppCtrl
}

ModalWhatsAppCtrl.$inject = [
    '$scope',
    '$http',
    '$uibModalInstance',
    'toastService',
    'mainService',
    'params',
    'decodeToken'
]

function ModalWhatsAppCtrl($scope, $http, uibModal, tS, mS, params, _token) {
    $scope.client = {}
    $scope.hasPermissions = _token.role == 'RT' ? true : false

    let parser = new UAParser(navigator.userAgent)
    let parserResults = parser.getResult()
    $scope.browser = parserResults.browser.name + parserResults.browser.version
    $scope.os = parserResults.os.name + parserResults.os.version

    $scope.session = {}
    $scope.session.is_logged_in = false

    $scope.type = params.type
    $scope.codDoc = params.codDoc
    $scope.comprobante = params.comprobante + ': ' + params.serieComprobante

    $scope.whatsapp = {}
    $scope.hasPhoneNumber = true
    let phoneNumbers
    if (params.telefono) {
        phoneNumbers = params.telefono.split(";")
    } else {
        $scope.hasPhoneNumber = false
    }

    //console.log(phoneNumbers)
    $scope.phoneNumbers = []
    if (phoneNumbers) {
        for (const p of phoneNumbers) {
            if (p.length == 10) {
                $scope.phoneNumbers.push({
                    number: p,
                })
            }
        }
    }


    console.log($scope.phoneNumbers)

    if ($scope.phoneNumbers.length == 0) {
        $scope.hasPhoneNumber = false
    } else {
        $scope.whatsapp.number = $scope.phoneNumbers[0].number
    }

    if ($scope.type == 'SRI') {
        $scope.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante electrónico:'
    } else {
        $scope.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante:'
    }


    $scope.validatePhoneNumber = (phone) => {
        if (!phone) {
            tS.toastr('warning', 'El número de celular no puede estar vacio!')
            return
        }

        if (phone.length < 10) {
            tS.toastr('warning', 'El número de celular no puede ser menor a diez digitos!')
            return
        }

        if (phone.length > 10) {
            tS.toastr('warning', 'El número de celular no puede ser mayor a diez digitos!')
            return
        }
        return true
    }

    $scope.addOtherNumber = (value) => {
        console.log(value)
        if (value == '0') {
            Swal.fire({
                text: "Igrese el numero de whatsapp a enviar",
                icon: 'warning',
                html: `<div class="col-12"><div class="form-group"><label for="whatsappNumber">Número de WhatsApp:</label><input type="tel" id="whatsappNumber" onfocus="this.select();" class="form-control text-center" placeholder="0000000000"  min="10" maxlength="10" /></div></div>`,
                preConfirm: () => {
                    let prephone = Swal.getPopup().querySelector('#whatsappNumber').value
                    if (!$scope.validatePhoneNumber(prephone)) {
                        return false
                    }
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Añadir',
                cancelButtonText: 'Cancelar',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    let phone = document.getElementById('whatsappNumber').value
                    $scope.phoneNumbers.push({ number: phone })
                    $scope.whatsapp.number = phone
                    $scope.$apply()
                } else {
                }
            })
        }

    }

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
                $scope.login()
            }
            if (response.code == '0') {
                tS.toastr('warning', response.message)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    $scope.initialLoad = () => {
        let data = {
            browser: JSON.stringify(parserResults.browser),
            os: JSON.stringify(parserResults.os),
        }
        mS.getData('get', 'WhatsAppSession/Get?json=' + JSON.stringify(data), null, true).then(response => {
            if (response.code == '1') {
                $scope.session.id = JSON.parse(response.payload)[0].id
                $scope.client.id = JSON.parse(response.payload)[0].id
                $scope.login()
            }
            if (response.code == '0') {
                $scope.insert()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    //$scope.initialLoad()



    /***************************************************************/

    /**USING WHATSAPP WEB PEDRO LOPEZ */

    /************************************************************ */

    const _env = 1
    let url = _env == 1 ? 'http://localhost:8000' : 'http://74.50.85.164:8000'

    // $scope.login = () => {
    //     //console.log($scope.client)
    //     socket.emit('create-session', {
    //         id: $scope.client.id,
    //     }, () => {
    //         console.log()
    //     })
    // }


    $scope.getOldSession = () => {
        //socket.emit('get-session', { id: $scope.session.id })
    }

    // socket.on('message', (msg) => {
    //     if ($scope.session.id == msg.id) {
    //         hideLoader()
    //         $scope.session.message = msg.text
    //         tS.toastr('info', msg.text, 'Estado')
    //     }
    // })

    //socket.on('hello', (data) => {
    //    console.log(data)
    //})



    //socket.on('qr', (data) => {
    //    if (data) {
    //        showLoader()
    //        //console.log(session)
    //        if ($scope.session.id == data.id) {
    //            //$scope.session.src = data.src
    //            let image = document.getElementById("qrcode");
    //            image.src = data.src
    //        } else {
    //            //$scope.logout(data.id)
    //        }
    //        hideLoader()
    //    }
    //})

    //socket.on('ready', (data) => {
    //    console.log(data)
    //    if (data.id == $scope.session.id) {
    //        $scope.session.is_logged_in = true
    //        let image = document.getElementById("qrcode");
    //        image.setAttribute('src', '');
    //        tS.toastr("info", data.text)
    //    }
    //})

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


    /************************************************************** */
    /*******************************END ****************************/

    /***************************************************************/

    /** USING GO-WHATSAPP MULTIDEVICE */

    /************************************************************ */
    const http = axios.create({
        baseURL: 'http://74.50.85.164:3000'
    })

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
                if ($scope.hasPermissions) {
                    tS.toastr("info", "Por favor escanee el codigo QR, con su cuenta de whatsapp")
                    $scope.session.src = results.qr_link
                } else {
                    tS.toastr("info", "Ha perdido session de whatsapp, comuniquese con el administrador del sistema")
                }

                $scope.$digest()
                resolve()

                setTimeout(() => {
                    if (!$scope.session.is_logged_in) {
                        console.log('Refreshing QR')
                        //tS.toastr('info', 'Obteniendo nuevo QR')
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

    let totalMessages = 1

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
                totalMessages++
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

    $scope.sendMedia = (caption, file, lastMessage = null) => {

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
                totalMessages++
                if (lastMessage) {
                    let messageAdd = ''
                    if (params.telefonoEstablecimiento) {
                        messageAdd = `Si tiene alguna observación, favor comunicarse con la empresa *${params.nombreComercial}* al siguiente número: *${params.telefonoEstablecimiento}*`
                        sendSms(messageAdd)
                    }

                    setTimeout(() => {
                        sendSms(`Gracias por preferirnos, este comprobante se adjuntara a su correo electrónico!.`)
                    }, 2000)

                    setTimeout(() => {
                        sendSms(`*_No es necesario responder a este número_*`)
                        saveHistory()
                    }, 3000)

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

    const REPORT_CODES = Object.freeze({
        '01': 'RF',
        '03': 'RLC',
        '04': 'RNCC',
        '06': 'RGR',
        '07': 'RRC',
    })


    $scope.generateFile = () => {
        let format = 'pdf'
        let dataParms = {
            id: params.idDocumento,
            codEstab: params.codEstab,
            codigo: REPORT_CODES[params.codDoc],
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

            $scope.sendMedia(fileName, file, true)

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
            totalMessages = 0
            if (!$scope.validatePhoneNumber($scope.whatsapp.number)) {
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
            $scope.session.is_logged_in = false
            // fetch devices
            $scope.mainApp.app_ws.send(JSON.stringify({ "code": "FETCH_DEVICES" }))
        } catch (err) {
            console.log(err)
        }
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

    /************************************************************** */
    /*******************************END ****************************/



    /** USING VENOM */

    /************************************************************ */


    /************************************************************** */
    /*******************************END ****************************/




    /** STATISCS */

    /************************************************************ */

    function saveHistory() {
        let data = {
            browser: JSON.stringify(parserResults.browser),
            os: JSON.stringify(parserResults.os),
            emisor: $scope.current_device.device,
            receptor: $scope.whatsapp.number,
            mensaje: $scope.whatsapp.message,
            totalMensajes: totalMessages,
            params: JSON.stringify(params)
        }
        mS.getData('post', 'WhatsappMessage/Post', { data: data }, true).then(response => {
            if (response.code == '1') {
                console.log(response.message)
            }
            tS.toastr('success', 'Mensaje enviado exitosamente')
        }).catch(err => {
            console.log(err)
        })
    }

    /************************************************************** */
    /*******************************END ****************************/


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

    $scope.closeModal = function () {
        uibModal.close()
    }
}