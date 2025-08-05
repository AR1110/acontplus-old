//@ts-check
export {
    modalSendWhatsAppCtrl
}

modalSendWhatsAppCtrl.$inject = [
    '$scope',
    '$http',
    '$uibModalInstance',
    'toastService',
    'mainService',
    'commonService',
    'params',
    'decodeToken',
    "sharedService"
]

function modalSendWhatsAppCtrl($scope, $http, uibModal, tS, mS, commonSvc, params, _token, _sharedSvc) {
    $scope.client = {}
    $scope.whatsapp = {}
    $scope.connected_devices = []
    $scope.current_device = {}
    const { data } = params;

    $scope.hasPermissions = _token.userRoleId == '26'

    let parser = new UAParser(navigator.userAgent)
    let parserResults = parser.getResult()
    $scope.browser = parserResults.browser.name + parserResults.browser.version
    $scope.os = parserResults.os.name + parserResults.os.version

    $scope.session = {}
    $scope.session.is_logged_in = false

    $scope.hasPhoneNumber = true;
    $scope.phoneNumbers = []

    $scope.type = ['01', '03', '04', '05', '06', '07'].includes(data.codDoc) ? 'SRI' : 'GenericFile';
    $scope.codDoc = data.codDoc
    $scope.comprobante = data.comprobante + ': ' + data.serieComprobante

    let idInstance = "7103845341"
    let apiTokenInstance = "a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c";


    function createDataParamDocSri({ idDocumentoElectronico, codDoc }) {
        let id = idDocumentoElectronico > 0 ? idDocumentoElectronico : data.idDocumento;
        return {
            tipo: 2,
            id,
            idDocumentoElectronico,
            codDoc,
            esNotificacionTributaria: true,
        };
    }
    function createDataParamDoc(data) {
        //estandarizar el codDoc para notificaciones generales
        const codDoc = data.codDoc === '09' ? 'PF' : data.codDoc;
        return {
            tipo: 3,
            id: data.idDocumento,
            codDoc,
            esNotificacionGeneral: true,
        };
    }


    let dataParamGetDataForm = {
        "01": createDataParamDocSri(data),
        "NE": createDataParamDoc(data),
        "09": createDataParamDoc(data),
    };

    let phoneNumbers = [];
    let esNotificacionTributaria = false;
    let esNotificacionGeneral = false;

    let telefonoEstab;
    let nombreEstab;
    let customerName;
    let serieDocumento;

    getDataForm();
    function getDataForm() {

        let params = dataParamGetDataForm[data.codDoc];
        if (!params) {
            console.error(`No se encontraron parámetros para el tipo de documento: ${data.codDoc}`);
            return;
        }
        esNotificacionTributaria = params.esNotificacionTributaria;
        esNotificacionGeneral = params.esNotificacionGeneral;

        _sharedSvc.getDataFormNotificacion(params).then(response => {
            telefonoEstab = response.telefonoEstab;
            nombreEstab = response.nombreEstab;

            // if (response.telefono) {

            //     if (response.telefono.includes(";")) {
            //         phoneNumbers = response.telefono.split(";")
            //     } else if (response.telefono.includes("|")) {
            //         phoneNumbers = response.telefono.split("|")
            //     } else {
            //         phoneNumbers = response.telefono.split(" ")
            //     }
            // }

            phoneNumbers = response.telefonos.filter((p) => p.length === 10);
            $scope.phoneNumbers = phoneNumbers.map((p) => {
                return {
                    number: p,
                }
            });


            if ($scope.phoneNumbers.length == 0) {
                $scope.hasPhoneNumber = false
            } else {
                $scope.whatsapp.number = $scope.phoneNumbers[0].number
            }

            if (esNotificacionTributaria) {
                $scope.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante electrónico:'
            } else {
                $scope.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante:'
            }


        })
    }


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


    // if (data.telefono) {

    //     if (data.telefono.includes(";")) {
    //         phoneNumbers = data.telefono.split(";")
    //     } else if (data.telefono.includes("|")) {
    //         phoneNumbers = data.telefono.split("|")
    //     } else {
    //         phoneNumbers = data.telefono.split(" ")
    //     }
    // } else {
    //     $scope.hasPhoneNumber = false
    // }


    // if (phoneNumbers) {
    //     //Only cellphone numbers
    //     for (const p of phoneNumbers) {
    //         if (p.length == 10) {
    //             $scope.phoneNumbers.push({
    //                 number: p,
    //             })
    //         }
    //     }
    // }



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

    function getQrCode() {
        return new Promise(async (resolve, reject) => {
            try {
                let url = `/waInstance${idInstance}/qr/${apiTokenInstance}` // `/app/login`
                $http.get(`https://api.green-api.com${url}`).then(
                    response => {
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

                        setTimeout(() => {
                            if (!$scope.session.is_logged_in) {
                                getQrCode()
                            }
                        }, (results.qr_duration * 1000))

                        resolve()
                    },
                    error => {
                        if (error.data) {
                            reject(error.data.message)
                        } else {
                            reject(error.message || 'Error occurred')
                        }
                    }
                )
            } catch (error) {
                reject(error.message || 'Error occurred')
            }
        })
    }

    let totalMessages = 1;

    function getMessageText() {

        let tipoDocNombre = null;
        let contactoNombre = null;
        let serieComprobante = null;
        if (data.codDoc === '01') {
            tipoDocNombre = 'Factura';
        }

        if (data.codDoc === 'NE') {
            tipoDocNombre = 'Nota Entrega';
        }
        if (data.codDoc === '09') {
            tipoDocNombre = 'Proforma';
        }

        if(telefonoEstab){
            contactoNombre = `Contactos: ${telefonoEstab}`
        }


        const mainMessage = `Estimado(a) *${data.razonSocialComprador || data.nombreComercial}*\n Adjunto su ${tipoDocNombre} Nro. ${data.serieComprobante} emitida por *${nombreEstab}*\n ${contactoNombre}`;

        const promoMessage = 'Este documento fue generado y enviado de forma segura por *Acontplus*.\n\n';

        // const promoMessage = 'Este documento fue generado y enviado de forma segura por *Acontplus*.\n\n' +
        //                     'Optimiza tu facturación con **Acontplus**. Visita nuestro sitio web para conocer más:\n' +
        //                     '👉 https://acontplus.com.ec';

                            return {
                                mainMessage,
                                promoMessage
                            }
    }


    function sendSms(message, firstMessage = null) {
        return new Promise((resolve, reject) => {
            try {
                showLoader()
                let url = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`
                let payload = {
                    chatId: phoneNumberFormatter($scope.whatsapp.number),
                    //message: message ? message : $scope.whatsapp.message,
                    message: message ? message:  getMessageText().mainMessage
                }

                $http.post(url, payload).then(
                    response => {
                        resolve(response.data.message)
                        totalMessages++
                        if (firstMessage) {
                            $scope.sendFiles()
                        }
                        hideLoader()
                    },
                    error => {
                        if (error.data) {
                            reject(error.data.message)
                        } else {
                            reject(error.message || 'Error occurred')
                        }
                        hideLoader()
                    }
                )
            } catch (error) {
                hideLoader()
                reject(error.message || 'Error occurred')
            }
        })
    }

    $scope.sendMedia = (caption, file, lastMessage = null, contentTye = null) => {
        return new Promise((resolve, reject) => {
            try {
                showLoader()
                let url = `https://api.green-api.com/waInstance${idInstance}/sendFileByUpload/${apiTokenInstance}`
                let payload = new FormData();
                let phone = phoneNumberFormatter($scope.whatsapp.number)
                payload.append("caption", caption)
                payload.append("chatId", phone)
                payload.append("file", file)

                $http.post(url, payload, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(
                    response => {
                        resolve(response.data.message)
                        totalMessages++
                        if (lastMessage) {
                            let messageAdd = '';


                            // if (telefonoEstab) {
                            //     messageAdd = `Si tiene alguna observación, favor comunicarse con la empresa *${nombreEstab}* al siguiente número: *${telefonoEstab}*`;
                            //     sendSms(messageAdd)
                            // }

                            // setTimeout(() => {
                            //     sendSms(`Gracias por preferirnos, este comprobante se adjuntara a su correo electrónico!.`)
                            // }, 2000)

                            setTimeout(() => {
                             //   sendSms(`*_Por favor responda con un OK y agregue este número a sus contactos_*`)
                             sendSms(getMessageText().promoMessage)
                                saveHistory()
                            }, 3000)
                        }
                        hideLoader()
                    },
                    error => {
                        if (error.data) {
                            reject(error.data.message)
                        } else {
                            reject(error.message || 'Error occurred')
                        }
                        hideLoader()
                    }
                )
            } catch (error) {
                hideLoader()
                reject(error.message || 'Error occurred')
            }
        })
    }

    $scope.generateXml = () => {
        if (!data.idDocumentoElectronico) {
            return;
        }
        mS.getFile('get', 'FactElect/DocumentoElectronico/GetXmlSri/' + data.idDocumentoElectronico).then(response => {
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

    function generateFileAndSend(response) {
        let fileName = response
            .headers()["content-disposition"].split(";")[1]
            .split("=")[1];
        const file = new File([response.data], fileName, { type: response.headers()["content-type"], })

        $scope.sendMedia(fileName, file, true)
    }

    $scope.generateFile = () => {
        let format = 'pdf'
        let dataParms = {
            hasParams: true,
            id: data.idDocumento || data.idDocumentoElectronico,
            idDocumentoElectronico: data.idDocumentoElectronico,
            versionComp: data.versionComp
        }
        let reportParams = {
            hasParams: true,
            codigo: REPORT_CODES[data.codDoc],
            format,
            codEstab: data.codEstab,
            aditionalParams: [],
            versionComp: data.versionComp
        }



        if (data.codDoc === 'CI') {
            dataParms.tipo = 3;
            dataParms.hasParams = true;
            let parameters = {
                dataParams: JSON.stringify(dataParms),
                reportParams: JSON.stringify(reportParams)
            }
            commonSvc.getReport({
                parameters,
                formatType: format,
                v2: true,
                returnFile: true
            }).then(generateFileAndSend)
                .catch(error => {
                    console.log(error)
                })
        } else {

            let parameters = {
                hasService: true,
                dataParams: JSON.stringify(dataParms),
                reportParams: JSON.stringify(reportParams)
            }
            commonSvc.getReport({
                parameters,
                formatType: format,
                returnFile: true
            }).then(generateFileAndSend)
                .catch(error => {
                    console.log(error)
                })
        }



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

            // if (!$scope.whatsapp.message) {
            //     tS.toastr('warning', 'El mensaje no puede estar vacio!')
            //     return
            // }
            sendSms(null, true)
        } catch (error) {
            console.log(error)
        }
    }

    function logoutApi() {
        return new Promise((resolve, reject) => {
            try {
                showLoader()
                let url = `https://api.green-api.com/waInstance${idInstance}/logout/${apiTokenInstance}`
                $http.get(url).then(
                    result => {
                        if (result) {
                            let { isLogout } = result.data
                            if (isLogout) {
                                tS.toastr('info', "Logout success")
                                getQrCode()
                            }
                        }
                        resolve()
                        hideLoader()
                    },
                    error => {
                        if (error.data) {
                            reject(error.data.message)
                        } else {
                            reject(error.message || 'Error occurred')
                        }
                        hideLoader()
                    }
                )
            } catch (error) {
                hideLoader()
                reject(error.message || 'Error occurred')
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
        mS.getData('post', 'Common/WhatsappMessage', data).then(response => {
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
