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
    $scope.whatsapp = {}
    $scope.connected_devices = []
    $scope.current_device = {}

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

    let idInstance = "7103845341"
    let apiTokenInstance = "a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c"
    $scope.getInstanceStatus = () => {
        $http.get(`https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`).then(
            (response) => {
                let { stateInstance } = response.data
                if (stateInstance === "authorized") {
                    $scope.session.is_logged_in = true
                } else {
                    getQrCode()
                }
            }
        )
    }

    $scope.connectGreenApi = () => {
        $http.get(`https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`).then(
            response => {
                if (response.data) {
                    let { wid } = response.data
                    $scope.current_device.device = wid
                    $scope.getInstanceStatus()
                }
            }
        )
    }
    $scope.connectGreenApi();

    $scope.hasPhoneNumber = true
    let phoneNumbers
    if (params.telefono) {
        phoneNumbers = params.telefono.split(";")
    } else {
        $scope.hasPhoneNumber = false
    }

    $scope.phoneNumbers = []
    if (phoneNumbers) {
        //Only cellphone numbers
        for (const p of phoneNumbers) {
            if (p.length == 10) {
                $scope.phoneNumbers.push({
                    number: p,
                })
            }
        }
    }

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
                }  
            })
        }
    }

    const http = axios.create({
        baseURL: "https://api.green-api.com"
    })

    function getQrCode() {
        return new Promise(async (resolve, reject) => {
            try {
                let url = `/waInstance${idInstance}/qr/${apiTokenInstance}` // `/app/login`
                let response = await http.get(url)
                if ($scope.hasPermissions) {
                    tS.toastr("info", "Por favor escanee el codigo QR, con su cuenta de whatsapp")
                    if (response) {
                        let { type, message } = response.data
                        if (type === "qrCode") {
                            $scope.session.src = "data:image/png;base64," + message
                        }
                    }
                } else {
                    tS.toastr("info", "Ha perdido session de whatsapp, comuniquese con el administrador del sistema")
                }

                $scope.$digest()
                resolve()

                setTimeout(() => {
                    if (!$scope.session.is_logged_in) {
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

    function sendSms(message, firstMessage = null) {
        return new Promise(async (resolve, reject) => {
            try {
                showLoader()
                let url = `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`
                let payload = {
                    chatId: phoneNumberFormatter($scope.whatsapp.number),
                    message: message ? message : $scope.whatsapp.message,
                }
                let response = await http.post(url, JSON.stringify(payload), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                resolve(response.data.message)
                totalMessages++
                if (firstMessage) {
                    $scope.sendFiles()
                }
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

    $scope.sendMedia = (caption, file, lastMessage = null, contentTye = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                showLoader()
                let url = `/waInstance${idInstance}/sendFileByUpload/${apiTokenInstance}`
                let payload = new FormData();
                let phone = phoneNumberFormatter($scope.whatsapp.number)
                payload.append("caption", caption)
                payload.append("chatId", phone)
                payload.append("file", file)
                let response = await http.post(url, payload)
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
                        sendSms(`*_Por favor responda con un OK y agregue este número a sus contactos_*`)
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
            }
        })
    }

    $scope.generateXml = () => {
        mS.getFile('get', 'FactElect/DocumentoElectronico/GetXmlSri/' + params.idDocumentoElectronico, null, true).then(response => {
            let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
            fileName = fileName.replace('"', "")
            const file = new File([response.data], fileName, { type: response.headers()["content-type"], })
            $scope.sendMedia(fileName, file, null, "text/xml")
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
        'NE': 'RNE',
        '09': 'PR',
        'CI': 'RCINGR'
    })

    const reportHasService = () => ['NE', '09', 'CI'].includes($scope.codDoc);
    const getTypeReport = () => ['NE', '09', 'CI'].includes($scope.codDoc) ? "Reporte/Download" : "Reporte/DynamicReport"

    $scope.generateFile = () => {
        let format = 'pdf'
        let dataParms = {
            hasParams: true,
            id: params.idDocumento,
            codEstab: params.codEstab,
            codigo: REPORT_CODES[params.codDoc],
            format,
            versionComp: params.versionComp
        }

        let parameters = {
            hasService: reportHasService(),
            sendToWhatsapp: true,
            dataParams: JSON.stringify(dataParms),
            reportParams: JSON.stringify(dataParms)
        }
        let url = getTypeReport();
        mS.getFile('post', url, JSON.stringify(parameters), true).then(response => {
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
        if (!formatted.endsWith('@c.us')) {
            formatted += '@c.us'
        }
        return formatted
    }

    $scope.sendFiles = () => {
        switch ($scope.type) {
            case 'SRI':
                $scope.generateXml()
                $scope.generateFile()
                break
            case 'GenericFile':
                $scope.generateFile()
                break
            default:
                break
        }
    }
    //first request
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
            sendSms(null, true)
        } catch (error) {
            console.log(error)
        }
    }

    function logoutApi() {
        return new Promise(async (resolve, reject) => {
            try {
                showLoader()
                let url = `/waInstance${idInstance}/logout/${apiTokenInstance}`
                let result = await http.get(url)
                if (result) {
                    let { isLogout } = result.data
                    if (isLogout) {
                        tS.toastr('info', "Logout success")
                        getQrCode()
                    }
                }
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

    $scope.askToLogout = async () => {
        let { isConfirmed } = await Swal.fire({
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
        if (isConfirmed) {
            await logoutApi()
            $scope.session.is_logged_in = false
        }
    }

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
                tS.toastr("info", response.message)
            } else {
                console.log(response)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    /************************************************************** */
    /*******************************END ****************************/
    $scope.closeModal = function () {
        uibModal.close()
    }
}