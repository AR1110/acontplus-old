export {
    SendMailCtrl,
    StatusEmail
}
SendMailCtrl.$inject =  ['$scope', '$uibModalInstance', 'mainService', 'formulario', 'params', 'decodeToken']

function SendMailCtrl($scope, $uibModalInstance, mS, fS, params, decodeToken) {
    let {typeSend} = params
    $scope.data = params || {};
    
    let idUsuarioRol = Number(decodeToken.idUsuarioRol)

    $scope.correos = [];
    // console.log($scope.data) 
    // console.log(idUsuarioRol)
    // console.log(typeSend)
    onInit();
    function onInit() { 
        if ($scope.data.hasOwnProperty("correo") && $scope.data.correo) {
            if ($scope.data.correo.includes(',')) {
                $scope.correos = $scope.data.correo.split(',');
                return
            }
            if ($scope.data.correo.includes(';')) {
                $scope.correos = $scope.data.correo.split(';');
                return
            }
            $scope.correos = $scope.data.correo.split(';');
        }
    }

    $scope.onKeyupEmail = function(item) {
        let textChip = item.target.value || "";
        textChip = fS.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();
    }

    $scope.validarEmail = function(valor) {
        return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
    }

    // const getTypeSendMail = ()=>['CI'].includes($scope.data.codDoc) ? '/Notificacion/Post?json=': 'NotificacionTributaria/'

    $scope.saveResendEmail = function() {
        try {
            let url = '';
            let data = {}
            if ($scope.correos.length === 0) {
                fS.sweetAlert('warning', 'Ingrese al menos un correo del destinatorio', 'Reenvío de Correo');
                return
            }


            if (!$scope.correos.every(item => $scope.validarEmail(item))) {
                fS.sweetAlert('warning', 'Verifique que los correos del destinatario esten ingresado correctamente', 'Reenvío de Correo');
                return
            }
            if(!typeSend){
                fS.sweetAlert('warning', 'No Definido el tipo de notificación');
                return
            }

            fS.showLoaderSendEmail();
           
            if (typeSend === 'N') {
                url = 'Common/Notificacion/?json='
                data = {
                    codDoc: $scope.data.codDoc,
                    serieComprobante: $scope.data.serieComprobante,
                    subject: $scope.data.subject,
                    params: $scope.data.json,
                    idUsuarioRol,
                    receptor: $scope.correos.join(';')
                }

                mS.getData('post', url + JSON.stringify(data), null, true).then($scope.successResponse).catch(error => {
                    Swal.close();
                    console.log(error)
                })
            } else if(typeSend==='SRI') {
                url = 'NotificacionTributaria/'
                data = {
                    codDoc: $scope.data.codDoc,
                    codEstado: $scope.data.codEstado,
                    idDocumento: $scope.data.idDocumento,
                    idDocumentoElectronico: $scope.data.idDocumentoElectronico,
                    receptor: $scope.correos.join(';')
                }
                mS.getData('post', url, {data}, true).then($scope.successResponse).catch(error => {
                    Swal.close();
                    console.log(error)
                })
            }

        } catch (error) {
            Swal.close();
            console.log(error)
        }

    }

    $scope.successResponse = (response) => {
        if (response.code === "0") {
            fS.sweetAlert('warning', response.message, response.titleSms);
        }
        if (response.code === "1") {
            fS.sweetAlert('success', response.message, response.titleSms, 1000);
            response.isComplete = true;
            $uibModalInstance.close(response)
        }
    }

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }
    

}


StatusEmail.$inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params'];
 
function StatusEmail($scope, $uibModalInstance, mS, commonSvc, tS, fS, params) {
    $scope.data = params;
    $scope.estadoCorreos = [];

    $scope.typeSend = 'SRI';

    

    onInit();
    function onInit() {
        if ($scope.data.hasOwnProperty('comprobantes')) {
            $scope.showStatusMailMasive = true;
            $scope.estadoCorreos = $scope.data.comprobantes.map(item => {
                item.statusEmail = [];
                item.isStatusMail = true;
                mS.getData('get', 'NotificacionTributaria/' + item.idDocumentoElectronico, null, true).then(
                    response => {
                        const tempEmails = JSON.parse(response.payload) || [];
                        item.statusEmail = tempEmails.map(item => {

                            item.correos = item.receptor ? item.receptor.split(',') : []
                            return item;
                        })
                    }
                )
                return item;
            })

            return
        }

        $scope.showStatusMailByComp = true;
        mS.getData('get', 'NotificacionTributaria/' + $scope.data.idDocumentoElectronico, null, true).then(
            response => {
                if (response.code === '0') {
                    tS.toastr('warning', response.message)
                }
                if (response.code === '1') {
                    const tempCorreos = JSON.parse(response.payload) || [];
                    $scope.estadoCorreos = tempCorreos.map(item => {
                        item.correos = item.receptor ? item.receptor.split(',') : []
                        return item;
                    })
                }
            }
        )
    }


    $scope.showError = function(item) {
        Swal.fire({
            icon: 'info',
            html: `<small>${item.msgError}</small>`,
        })
    }


    $scope.closeModal = function() {
        $uibModalInstance.close();
    }
}