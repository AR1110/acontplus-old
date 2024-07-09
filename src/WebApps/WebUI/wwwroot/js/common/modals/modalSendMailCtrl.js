//@ts-check
export {
    modalSendMailCtrl,
    StatusEmail
}
modalSendMailCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', 'sharedService', 'formulario', 'params']

function modalSendMailCtrl($scope, $uibModalInstance, $injector, sharedSvc, fS, params) {
    let DOC_TYPE = $injector.get('DOC_TYPE');
    let mS = $injector.get('mainService');

    let { data } = params;
    
    $scope.data = data || {};

    $scope.correos = []; 
    
    let esNotificacionTributaria = false;
    let esNotificacionGeneral = false;
 

    function createDataParamDocSri() {
        let id = data.id;
        let idDocumentoElectronico = data.idDocumentoElectronico;
        let codDoc = data.codDoc;
        return { 
            tipo: 2,
            id,
            idDocumentoElectronico,
            codDoc,
            esNotificacionTributaria: true
        };
    }
    function createDataParamDoc(id, codDoc) {
        return { 
            tipo:3,
            id,
            codDoc: codDoc,
            esNotificacionGeneral: true
        };
    }
 

    let dataParamGetDataForm = {
        [DOC_TYPE.FV_SRI]: createDataParamDocSri(),
        [DOC_TYPE.LC_SRI]: createDataParamDocSri(),
        [DOC_TYPE.GR_SRI]: createDataParamDocSri(),
        [DOC_TYPE.R_SRI]: createDataParamDocSri(),
        [DOC_TYPE.NC_SRI]: createDataParamDocSri(),
        [DOC_TYPE.NE]: createDataParamDoc(data.idDocumento, data.codDoc)
    };
    

    function getDataForm(){
        
        let params = dataParamGetDataForm[data.codDoc];
        if (!params) {
            console.error(`No se encontraron parámetros para el tipo de documento: ${data.codDoc}`);
            return;
        }
        esNotificacionTributaria = params.esNotificacionTributaria;
        esNotificacionGeneral = params.esNotificacionGeneral;

         
        sharedSvc.getDataFormNotificacion(params).then(response=>{  
            $scope.correos =  response.correos; 
        }) 
    }

    onInit();
    function onInit() {
        getDataForm() 
    }

    $scope.onKeyupEmail = function (item) {
        let textChip = item.target.value || "";
        textChip = fS.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();
    }

    $scope.validarEmail = function (valor) {
        return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
    }

    // const getTypeSendMail = ()=>['CI'].includes($scope.data.codDoc) ? '/Notificacion/Post?json=': 'NotificacionTributaria/'

    $scope.saveResendEmail = function () {
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
         

       

            if (esNotificacionGeneral) {
                url = 'Common/Notificacion/?json='
                data = {
                    codDoc: $scope.data.codDoc,
                    serieComprobante: $scope.data.serieComprobante,
                    subject: $scope.data.subject,
                    params: $scope.data.json, 
                    receptor: $scope.correos.join('|')
                }

                mS.getData('post', url + JSON.stringify(data), null, true).then($scope.successResponse).catch(error => {
                    Swal.close();
                    console.log(error)
                })
            } 
            
            if (esNotificacionTributaria) { 
                let data = {
                    codDoc: $scope.data.codDoc,
                    codEstado: $scope.data.codEstado,
                    idDocumento: $scope.data.idDocumento,
                    idDocumentoElectronico: $scope.data.idDocumentoElectronico,
                    receptor: $scope.correos.join(',')
                }
                mS.getData('post', 'FactElect/NotificacionTributaria/', { data }, true)
                .then($scope.successResponse) 
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

    $scope.closeModal = function () {
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
        if (('comprobantes') in $scope.data) {
            $scope.showStatusMailMasive = true;
            $scope.estadoCorreos = $scope.data.comprobantes.map(item => {
                item.statusEmail = [];
                item.isStatusMail = true;
                mS.getData('get', 'FactElect/NotificacionTributaria/' + item.idDocumentoElectronico, null, true).then(
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
        mS.getData('get', 'FactElect/NotificacionTributaria/' + $scope.data.idDocumentoElectronico, null, true).then(
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


    $scope.showError = function (item) {
        Swal.fire({
            icon: 'info',
            html: `<small>${item.msgError}</small>`,
        })
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}