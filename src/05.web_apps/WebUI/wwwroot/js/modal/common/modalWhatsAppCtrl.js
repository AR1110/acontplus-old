export {
    ModalWhatsAppCtrl
}

ModalWhatsAppCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    'toastService',
    'socketService',
    'mainService',
    'params'
]

function ModalWhatsAppCtrl($scope, uibModal, tS, socket, mS, params) {
    $scope.client = {}
    //$scope.client.id = params.codEstab
    //$scope.client.description = !params.description ? 'Session de Whatsapp del estab: ' + params.codEstab : params.description
    $scope.session = {}
    const _env = 2
    let url = _env == 1 ? 'http://localhost:8000' : 'http://205.209.99.71:8000'
    $scope.type = params.type
    $scope.codDoc = params.codDoc

    $scope.whatsapp = {}
    if (params.telefono) {
        $scope.whatsapp.number = params.telefono
    }
    if ($scope.type == 'SRI') {
        $scope.whatsapp.message = 'Estimado cliente adjuntamos el siguiente comprobante electrónico'
    } else {
        $scope.whatsapp.message = 'Estimado cliente adjuntamos el siguiente documento'
    }

    $scope.login = () => {
        //console.log($scope.client)
        socket.emit('create-session', {
            id: $scope.client.id,
        }, () => {
            console.log()
        })
    }

    $scope.insert = () => {
        mS.getData('post', 'WhatsAppSession/Post', null, true).then(response => {
            if (response.code == '1') {
                var temp = JSON.parse(response.payload)
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
        socket.emit('get-session', { id: $scope.session.id })
    }

    $scope.setOldSession = () => {

    }

    $scope.files = []
    $scope.fileName = ''

    $scope.initialLoad = () => {
        mS.getData('get', 'WhatsAppSession/', null, true).then(response => {
            if (response.code == '1') {
                $scope.session.id = JSON.parse(response.payload)[0].id
                $scope.client.id = JSON.parse(response.payload)[0].id
                //console.log($scope.session)
                $scope.getOldSession()
            }
            if (response.code == '0') {
                $scope.insert()
            }
        }).catch(error => {
            console.log(error)
        })

    }

    $scope.initialLoad()

    socket.on('message', (msg) => {
        if ($scope.session.id == msg.id) {
            hideLoader()
            $scope.session.message = msg.text
            tS.toastr('info', msg.text, 'Estado')
        }
    })

    socket.on('qr', (data) => {
        if (data) {
            showLoader()
            //console.log(session)
            if ($scope.session.id == data.id) {
                $scope.session.src = data.src
            } else {
                //$scope.logout(data.id)
            }
            hideLoader()
        }
    })

    socket.on('ready', (data) => {
        console.log(data)
        if (data.id == $scope.session.id) {
            $scope.session.isLogged = true
        }
    })

    socket.on('authenticated', function (data) {
        if (data.id == $scope.session.id) {
            $scope.session.isLogged = true
        }
    })
    socket.on('remote_session_saved', function (data) {
        if (data.id == $scope.session.id) {
            $scope.session.isLogged = true
            tS.toastr("info", data.text)
        }
    })

    $scope.sendSms = () => {

    }

    $scope.sendMedia = (caption, fileName) => {
        let data = { number: $scope.whatsapp.number, caption: caption, fileName: fileName }
        mS.getData('post', url + '/send-media', data).then(
            response => {
                console.log(response)
            }
        ).catch(error => {
            console.log(error)
        })
    }

    $scope.generateXml = () => {
        mS.getData('get', 'DocumentoElectronico/GetXmlSri/' + params.idDocumentoElectronico, null, true).then(response => {
            //$scope.fileName = response
            $scope.sendMedia('Xml Ride', response)
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
        mS.getData('post', 'Reporte/DynamicReport', JSON.stringify(parameters), true).then(response => {
            $scope.sendMedia('Pdf Ride', response)
        }).catch(error => {
            console.log(error)
        })
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
            let data = { number: $scope.whatsapp.number, message: $scope.whatsapp.message }
            mS.getData('post', url + '/send-message', data).then(
                response => {
                    if (response.status) {
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
                    }
                    console.log(response)
                }
            ).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }
    $scope.logout = () => {
        try {
            showLoader()
            //var file = getRide()
            let data = { sender: $scope.session.id }
            //let data = { number: $scope.whatsapp.number, file: file, caption: 'caption' }
            mS.getData('post', 'http://localhost:8000/logout', data).then(
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