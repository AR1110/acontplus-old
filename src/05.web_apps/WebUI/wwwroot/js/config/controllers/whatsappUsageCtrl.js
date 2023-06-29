(function () {
    'use strict'

    app.controller('whatsappUsageCtrl', whatsappUsageCtrl)

    whatsappUsageCtrl.$inject = ['$scope', 'mainService', 'toastService']

    function whatsappUsageCtrl($scope, _mS, _tS) {
        
        _mS.detectDevice()

        $scope.usages = []
        $scope.usage = {}

        $scope.initialLoad = () => {
            showLoader()
            _mS.getData('GET', 'WhatsappUsage/?json=' + JSON.stringify({ tipo: 1, idEntidad: 0 }), null, true).then(
                response => {
                    if (response.code == '0') {
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        let tempArray = JSON.parse(response.payload)
                        $scope.usages = tempArray[0]
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }
        $scope.initialLoad()

        $scope.save = (item) => {
            showLoader()
            let method, url
            if (item.idWhatsappUsage == 0) {
                if (item.limite < 1 && !item.ilimitado) {
                    _tS.toastr('warning', 'El limite debe ser mayor a 1')
                    return
                }
                method = "POST"
                url = "WhatsappUsage/"
            } else {
                if (item.limite < 1 && !item.ilimitado) {
                    _tS.toastr('warning', 'El limite debe ser mayor a 1')
                    return
                }
                method = "PUT"
                url = 'WhatsappUsage/?id=' + item.idWhatsappUsage
            }
            _mS.getData(method, url, { data: item }, true).then(
                response => {
                    if (response.code == '0') {
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        _tS.toastr('success', response.message)
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }
        $scope.delete = () => {
            showLoader()
            _mS.getData('DELETE', 'WhatsappUsage/?id=' + $scope.usage.idWhatsappUsage, null, true).then(
                response => {
                    if (response.code == '0') {
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        _tS.toastr('success', response.message)
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader()
                console.log(error)
            })
        }
    }
}(window.angular))