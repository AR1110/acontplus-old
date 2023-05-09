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

    $scope.whatsapp = { number: '0991229095' }
    //$scope.whatsapp.number = params.celular

    $scope.login = () => {
        //console.log($scope.client)
        socket.emit('create-session', {
            id: $scope.client.id,
            description: $scope.client.description
        }, () => {
            console.log()
        })
    }

    $scope.logout = (id) => {
        socket.emit('disconnected', {
            id: id
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

    $scope.init = () => {
        socket.on('init', (data) => {
            console.log('SEARCHING SESSIONS')
            console.log(data)
            showLoader()
            // for (const session of data) {
            //     if ($scope.session.id == session.id) {
            //         if (session.ready) {
            //             hideLoader()
            //             $scope.session.isLogged = true
            //             tS.toastr('success', 'Whatsapp esta listo')
            //         } else {
            //             $scope.session.isLogged = false
            //             $scope.insert()
            //         }
            //     }
            // }
            console.log($scope.session.id)
            var sessionMatch = data.find(x => x.id == $scope.session.id)
            if (sessionMatch) {
                if (sessionMatch.ready) {
                    hideLoader()
                    $scope.session.isLogged = true
                    tS.toastr('success', 'Whatsapp esta listo')
                } else {
                    hideLoader()
                    tS.toastr('success', 'Connectado con el servidor')
                }
            } else {
                $scope.session.isLogged = false
            }
        })

    }

    $scope.initialLoad = () => {
        mS.getData('get', 'WhatsAppSession/', null, true).then(response => {
            if (response.code == '1') {
                $scope.session.id = JSON.parse(response.payload)[0].id
                $scope.session.description = 'Session with token: ' + JSON.parse(response.payload)[0].id
                //console.log($scope.session)
                $scope.init()
            }
            if (response.code == '0') {
                $scope.insert()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    $scope.initialLoad()



    socket.on('remove-session', (id) => {
        if ($scope.session.id == id) {
            $scope.session.isLogged = false
            $scope.session = {}
        }
    })

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
                $scope.logout(data.id)
            }
            hideLoader()
        }
    })

    socket.on('ready', (data) => {
        //console.log(data)
        if (data.id == $scope.session.id) {
            $scope.session.isLogged = true
        }
    })

    $scope.sendMessage = () => {
        try {
            showLoader()
            //var file = getRide()
            let data = { number: $scope.whatsapp.number, message: $scope.whatsapp.message, sender: $scope.session.id }
            //let data = { number: $scope.whatsapp.number, file: file, caption: 'caption' }
            mS.getData('post', 'http://localhost:8000/send-message', data).then(
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