(function(){

    'use strict';

    //Variable servicios
    let mS = {};
    let tS = {};
    let notaEntregaSvc = {};
    let proformaSvc = {};
    let facturaSvc = {};

    //Variables Constantes
    const URL_TEMPLATE = 'AprobDocumento/'


    app.controller('aprobacionDocumentoCtrl', aprobacionDocumentoCtrl);

    aprobacionDocumentoCtrl.$inject = ['$scope', '$injector', 'modalService', 'nombreModalVenta'];

    function aprobacionDocumentoCtrl($scope, $injector, modalSvc, nombreModalVenta) {

        //Injection Services
        mS             = $injector.get('mainService');
        tS             = $injector.get('toastService');
        notaEntregaSvc = $injector.get('notaEntregaService');
        proformaSvc    = $injector.get('proformaService');
        facturaSvc     = $injector.get('facturaService');


        let OPTION_APROBACION = {
            0: {
                codigoDocOrigen: 'NE',
                codigoDocDestino: 'FV'
            },
            1: {
                codigoDocOrigen: 'PR',
                codigoDocDestino: 'FV'
            },
            2: {
                codigoDocOrigen: 'PR',
                codigoDocDestino: 'NE'
            }
        };

        $scope.askToOpenModalOption = async function() {
            try {
                  
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger m-l-5'
                    },
                    buttonsStyling: false
                })
        
                swalWithBootstrapButtons.fire({
                    title: 'Opción Aprobación Documento',                    
                    input: 'select',
                    inputOptions: {
                        0: 'NOTA DE ENTREGA A FACTURA',
                        1: 'PROFORMA A FACTURA',
                        2: 'PROFORMA A NOTA DE ENTREGA'
                    },
                    inputPlaceholder: 'Seleccionar...',
                    showCancelButton: true,
                    confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
                    cancelButtonText: '<small>&times; Cerrar</small>',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    focusConfirm: true,
                    inputValidator: (value) => {
                        return !value && 'Seleccione la opción de aprobación'
                    }
                }).then(result => {
                    if(result.isConfirmed){
                        let resultOption = OPTION_APROBACION[result.value]
                        
                        let modalRef = modalSvc.openModalCustom({
                            controller: 'ModalSelectDocCtrl',
                            template: ''
                        })

                    }
                })
                
            } catch (error) {
                console.log(error);
            }
        }

    }



    app.controller('ModalSelectDocCtrl', ModalSelectDocCtrl);

    ModalSelectDocCtrl.$inject = ['$scope'];

    function ModalSelectDocCtrl($scope){

    }


})(window.angular)