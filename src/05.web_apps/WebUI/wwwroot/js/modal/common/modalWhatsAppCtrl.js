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

    $scope.whatsapp = { number: '0989297817' }
    //$scope.whatsapp.number = params.celular

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
        mS.getData('get', 'DocumentoElectronico/GetXmlSri/' + params.idDocumentoElectronico, null, true).then(response => {
            console.log(response)
            $scope.fileName = response //response.headers()['content-disposition'].split(';')[1].split('=')[1];
            // console.log($scope.fileName)
            // let mimetype = response.headers()['content-type']
            // $scope.files.push({
            //         data: response.data,
            //         name: fileName,
            //         mimetype
            // })
            //console.log($scope.files)
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
        }
    })
    $scope.sendMessage = () => {
        try {
            showLoader()
            //var file = getRide()
            let data = {
                number: $scope.whatsapp.number,
                message: $scope.whatsapp.message,
                sender: $scope.session.id,
                caption: 'test caption', 
                fileName:  $scope.fileName
            }
            //let data = { number: $scope.whatsapp.number, file: file, caption: 'caption' }
            mS.getData('post', 'http://localhost:8000/send-media', data).then(
                response => {
                    console.log(response)
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
            // socket.emit('message', {
            //     number: $scope.whatsapp.number,
            //     message: $scope.whatsapp.message,
            // })
        } catch (error) {
            hideLoader()
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