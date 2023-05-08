export {
    ModalWhatsAppCtrl
}

ModalWhatsAppCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    'toastService',
    'socketService',
    'params'
]

function ModalWhatsAppCtrl($scope, uibModal, tS, socket, params) {
    $scope.client = {}
    $scope.client.id = params.codEstab
    $scope.client.description = !params.description ? 'Session de Whatsapp del estab: ' + params.codEstab : params.description
    $scope.sessions = []

    $scope.whatsapp = { number: '0991229095' }
    //$scope.whatsapp.number = params.celular

    $scope.login = () => {
        socket.emit('create-session', {
            id: $scope.client.id,
            description: $scope.client.description
        })
    }

    socket.on('init', (data) => {
        for (const session of data) {
            if ($scope.client.id == session.id) {
                $scope.sessions.push({ id: session.id, description: session.description })
            }
            if (session.ready) {
                $scope.client.isLogged = true
                tS.toastr('success', 'Whatsapp esta listo')
            } else {
                tS.toastr('info', 'Conectando con el servicio de Whatsapp ...')
            }
        }
    })

    socket.on('remove-session', (id) => {
        if ($scope.client.id == id) {
            $scope.client.isLogged = false
        }
    })

    socket.on('message', (msg) => {
        tS.toastr('info', msg.text, 'Estado')
    })

    socket.on('qr', (data) => {
        console.log(data)
        if ($scope.client.id == data.id) {
            $scope.sessions.push({
                id: data.id,
                description: data.description
            })
            $(`#${data.id}-qrcode`).attr('src', data.src)
        }
    })

    socket.on('ready', (data) => {
        console.log(data)
    })

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

    $scope.closeModal = function () {
        uibModal.close()
    }
}