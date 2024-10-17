//@ts-check
export {
    modalSendWhatsAppCtrl
}

modalSendWhatsAppCtrl.$inject = [
    '$scope', 
    '$uibModalInstance',
    '$injector',
    'toastService',
    'mainService',
    'commonService',
    'params',
    'sharedService',
    'decodeToken'
]

function modalSendWhatsAppCtrl($scope, uibModalInstance, $injector, tS, mS, commonSvc, params, sharedSvc, _token) {

    let DOC_TYPE = $injector.get('DOC_TYPE');
    let CODE_REPORT = $injector.get('CODE_REPORT');
    let $http = $injector.get('$http');

    const {data} = params;
 
    $scope.whatsapp = {}
    $scope.connected_devices = []
    $scope.current_device = {}
 

    let parser = new UAParser(navigator.userAgent)
    let parserResults = parser.getResult()
    $scope.browser = parserResults.browser.name + parserResults.browser.version
    $scope.os = parserResults.os.name + parserResults.os.version

    $scope.session = {
        is_logged_in: false
    } 
 
    $scope.comprobante = "";

    let idInstance = "7103845341"
    let apiTokenInstance = "a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c"
 

    let phoneNumbers;
    $scope.hasPhoneNumber = true;
    let esNotificacionTributaria = false;
    let esNotificacionGeneral = false;

    let telefonoEstab = null;
    let nombreEstab = null;

    function createDataParamDocSri() {
        let id = data.idDocumentoElectronico > 0 ? data.idDocumentoElectronico : data.idDocumento;
        return {
            tipo: 2,
            id,
            codDoc: data.codDoc,
            esNotificacionTributaria: true,
            comprobante: `${data.comprobanteVersion || data.comprobante} : ${data.serieComprobante}`,
            versionComp: data.versionComp
        };
    }
 
    function createDataParamDoc() {
        return {
            tipo: 3,
            id: data.idDocumento,
            codDoc: data.codDoc,
            esNotificacionGeneral: true,
            comprobante: `${data.comprobanteVersion || data.comprobante} : ${data.serieComprobante}`,
            versionComp: data.versionComp
        };
    }


    let dataParamGetDataForm = {
        [DOC_TYPE.FV_SRI]: createDataParamDocSri(),
        [DOC_TYPE.LC_SRI]: createDataParamDocSri(),
        [DOC_TYPE.GR_SRI]: createDataParamDocSri(),
        [DOC_TYPE.R_SRI]: createDataParamDocSri(),
        [DOC_TYPE.NC_SRI]: createDataParamDocSri(),
        [DOC_TYPE.NE]: createDataParamDoc(),
        [DOC_TYPE.PR]: createDataParamDoc(),
        ["09"]: createDataParamDoc(),


    };


    function createDataParamSenFile(codigo){
        let id = data.idDocumento;
        let idDocumentoElectronico = data.idDocumentoElectronico;
        return {
            codigo,
            id,
            idDocumentoElectronico,
            codEstab: data.codEstab,
            versionComp: data.versionComp
        }
    }
     
 
    let dataParamSenFile = {
        [DOC_TYPE.FV_SRI]: createDataParamSenFile(CODE_REPORT.RF),
        [DOC_TYPE.LC_SRI]: createDataParamSenFile(CODE_REPORT.RLC),
        [DOC_TYPE.GR_SRI]: createDataParamSenFile(CODE_REPORT.RGR),
        [DOC_TYPE.R_SRI]: createDataParamSenFile(CODE_REPORT.RRC),
        [DOC_TYPE.NC_SRI]: createDataParamSenFile(CODE_REPORT.RNC),
        [DOC_TYPE.NE]: createDataParamSenFile(CODE_REPORT.RNE),
        [DOC_TYPE.PR]: createDataParamSenFile(CODE_REPORT.PR),
        ["09"]: createDataParamSenFile(CODE_REPORT.PR),
        [DOC_TYPE.CI]: createDataParamSenFile(CODE_REPORT.RCINGR), 
    };


    getDataForm();
    function getDataForm() { 

        let params = dataParamGetDataForm[data.codDoc];
        if (!params) {
            console.error(`No se encontraron parámetros para el tipo de documento: ${data.codDoc}`);
            return;
        }
        esNotificacionTributaria = params.esNotificacionTributaria;
        esNotificacionGeneral = params.esNotificacionGeneral;
        $scope.comprobante = params.comprobante;

        sharedSvc.getDataFormNotificacion(params).then(response => {
            phoneNumbers = response.telefonos; 
            telefonoEstab = response.telefonoEstab;
            nombreEstab = response.nombreEstab;
            
            $scope.phoneNumbers = phoneNumbers.filter(p=>p.length===10).map(p=>({
                number: p
            }))
  
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

    connectGreenApi()
    function connectGreenApi  ()  {
        $http.get(`https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`).then(
            response => {
                if (response.data) {
                    let { wid } = response.data
                    $scope.current_device.device = wid 
                }
            }
        )
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
                    if (telefonoEstab) {
                        messageAdd = `Si tiene alguna observación, favor comunicarse con la empresa *${nombreEstab}* al siguiente número: *${telefonoEstab}*`
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
        if (!(data.idDocumentoElectronico > 0 && data.fechaAutorizacion)) {
            return;
        }
        mS.getFile('get', 'FactElect/DocumentoElectronico/GetXmlSri/' + data.idDocumentoElectronico, null, true).then(response => {
            let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
            fileName = fileName.replace('"', "")
            const file = new File([response.data], fileName, { type: response.headers()["content-type"], })
            $scope.sendMedia(fileName, file, null, "text/xml")
        }).catch(error => {
            console.log(error)
        })
    }

    

    function generateFileAndSend(response) {
        let fileName = response
            .headers()["content-disposition"].split(";")[1]
            .split("=")[1];
        const file = new File([response.data], fileName, { type: response.headers()["content-type"], })

        $scope.sendMedia(fileName, file, true)
    }

    $scope.generateFile = () => {
        let dataParamFile = dataParamSenFile[data.codDoc];
   
        if(!dataParamFile){
            console.error('no definido el codigo documento');
            return 
        }
        let format = 'pdf'
        let dataParms = {
            hasParams: true,
            id: dataParamFile.id,
            idDocumentoElectronico: dataParamFile.idDocumentoElectronico,
            versionComp: dataParamFile.versionComp
        }
        let reportParams = {
            hasParams: true,
            codigo: dataParamFile.codigo,
            format,
            codEstab: dataParamFile.codEstab,
            aditionalParams: [],
            versionComp: dataParamFile.versionComp
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
        if (esNotificacionTributaria){
            $scope.generateXml()
            $scope.generateFile()
        }
        if (esNotificacionGeneral){
            $scope.generateFile();
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
        mS.getData('post', 'Config/WhatsappMessage/Post', { data: data }, true).then(response => {
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
        uibModalInstance.close()
    }
}