app.controller('proformaCtrl', proformaCtrl);

proformaCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'proformaService', 'modalService', 'nombreModalVenta', 'nombreModal', 'toastService', 'formulario']

function proformaCtrl($scope, $filter, _mS, _commonSvc, proformaSvc, _modalSvc, nombreModalVenta, _nombreModalConst, _tS, _fS) {

    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if (accion === null) {
    //     location.href = "/Home/Index";
    //     return
    // } else { 
    //     $scope.accion = accion[0];
    // }


    const TIPO_DOC_PR = _commonSvc.tipoDoc['PR'];
    const PERMISSION_KEY_ACTIONS = {
        E: 'E',
        A: 'A',
    }
    
    let fileCtrl = nombreModalVenta.PROFORMA.fileCtrl;
    let template;
    let controller;
    let ctrl;

    $scope.jsonPermission = {}

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10000
    }

    $scope.clienteFiltro = {}
    $scope.usuarioSearchFiltro = {};
    $scope.mes = new Date().getMonth() + 1;
    $scope.proformas = [];


    $scope.sumarColumnaTotal = function () {
        let total = $scope.proformas.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
        return _fS.roundNumber(total, 5);
    }



    $scope.getProformas = async () => {

        try {
            showLoader();
            if ($scope.dataSearch.checkBoxCliente ||
                $scope.dataSearch.checkBoxFecha ||
                $scope.dataSearch.checkBoxUsuario) {
                $scope.dataSearch.checkBoxDefault = false
            } else {
                $scope.dataSearch.checkBoxDefault = true;
            }
            $scope.proformas = [];
            $scope.total = $scope.sumarColumnaTotal();
            proformaSvc.getAll($scope.dataSearch).then(response => {
                hideLoader();
                $scope.proformas = response;
                $scope.cloneProformas = JSON.parse(JSON.stringify($scope.proformas));
                $scope.total = $scope.sumarColumnaTotal();
                
            }).catch(error=>{
                hideLoader();
                console.log(error)
            })

            _commonSvc.getDataFormVenta().then(result => {
                $scope.jsonPermission = JSON.parse(result[9][0].jsonPermission)
            })


        } catch (error) {
            hideLoader();
            console.log(error)
        } 
    }



    $scope.initiload = () => {
        _commonSvc.getEstabAsign().then(response => {
            $scope.establecimientos = response;
            let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
            $scope.dataSearch.codEstab = codEstab;
            $scope.getProformas();

        })
    }
    $scope.initiload();



    $scope.openModalNew = async () => {
        try {
            ctrl = nombreModalVenta.PROFORMA.controllers['MN'];
            template = nombreModalVenta.PROFORMA.templates['MN'];
            let controller = (await import(fileCtrl))[ctrl];
            
            let params = {
                TIPO_REGISTRO: 'NUEVO'
            }
            $scope.openModalParam({
                controller,
                template,
                params
            })
        } catch (error) {
            console.log(error);
        }
    }


    $scope.openModalFiltro = async function() {
        try {
            ctrl = nombreModalVenta.PROFORMA.controllers['MF'];
            template = nombreModalVenta.PROFORMA.templates['MF'];
            controller = (await import(fileCtrl))[ctrl];
    
            let params = {
                dataSearch: $scope.dataSearch,
                clienteFiltro: $scope.clienteFiltro,
                usuarioSearchFiltro: $scope.usuarioSearchFiltro,
                mes: $scope.mes
            }
    
            let modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                params,
                size: 'lg'
            })
    
            modalRef.result.then(result => {
                let {
                    dataSearch,
                    clienteFiltro,
                    usuarioSearchFiltro,
                    mes,
                    isSearch
                } = result;
                $scope.dataSearch = dataSearch;
                $scope.clienteFiltro = clienteFiltro;
                $scope.usuarioSearchFiltro = usuarioSearchFiltro;
                $scope.mes = mes;
                if (isSearch) {
                    $scope.getProformas();
                }
            })
        } catch (error) {
            console.log(error)
        }
    }



    $scope.searchLocalProforma = function () {
        let proformas = JSON.parse(JSON.stringify($scope.cloneProformas));
        $scope.proformas = $filter('filter')(proformas, $scope.dataSearch.bySearch);
        $scope.total = $scope.sumarColumnaTotal();
    }


    $scope.openModalDetalle = async (item) => {
        try {
            ctrl = nombreModalVenta.PROFORMA.controllers['MD'];
            template = nombreModalVenta.PROFORMA.templates['MD'];
            controller = (await import(fileCtrl))[ctrl];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idProforma,
                codigoDocumento: TIPO_DOC_PR.codigo
            })
    
            if (!response.isComplete) return
    
            let params = {
                TIPO_REGISTRO: 'DETALLE',
                data: response
            }
    
            $scope.openModalParam({
                controller,
                template,
                params
            })            
        } catch (error) {
            console.log(error);
        }        
    }

    $scope.openModalEdit = async (item) => {
        try {

            let result = await _commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.E);
            if (result.code === "2") {
                _commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.E);
                return
            }

            showLoader();
            ctrl = nombreModalVenta.PROFORMA.controllers['ME'];
            template = nombreModalVenta.PROFORMA.templates['ME'];
            controller = (await import(fileCtrl))[ctrl];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idProforma,
                codigoDocumento: TIPO_DOC_PR.codigo
            })

            if (!response.isComplete) return

            let params = {
                TIPO_REGISTRO: 'EDITAR',
                data: response
            }

            _modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                params,
                windowClass: 'uibModalFullScreen'
            }).result.then(result => {
                if (typeof result === 'object') {

                    //Una vez actualizado el documento 
                    let {
                        additional
                    } = $scope.jsonPermission;
                    if (typeof $scope.jsonPermission === 'object' && additional.requestAuthorizationKey.requestKey) {
                        _commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.E);
                    }

                    $scope.getProformas();
                }
            })

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    $scope.openModalDuplicate = async (item) => {
        try {
            showLoader();
            ctrl = nombreModalVenta.PROFORMA.controllers['MDUPLICATE'];
            template = nombreModalVenta.PROFORMA.templates['MDUPLICATE'];
            controller = (await import(fileCtrl))[ctrl];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idProforma,
                codigoDocumento: TIPO_DOC_PR.codigo
            })

            if (!response.isComplete) return

            let params = {
                TIPO_REGISTRO: 'DUPLICAR',
                data: response
            }
            $scope.openModalParam({
                controller,
                template,
                params
            })
        } catch (error) {

            console.log(error)

        } finally {
            hideLoader();
        }

    }

    $scope.openModalParam = ({
        controller,
        template,
        size = 'xl',
        params
    }) => {

        _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params,
            windowClass: 'uibModalFullScreen'
        }).result.then(result => {
            console.log(result)
            if (typeof result === 'object') {
                $scope.getProformas();
            }
        })

    }


    $scope.askToDelete = async (item) => {
        try {
            if (item.anulada) {
                _fS.sweetAlert('warning', 'El documento ya se encuentra anulada');
                return
            }


            let result = await _commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.A);
            if (result.code === "2") {
                _commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.A);
                return
            }

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            let {
                isConfirmed
            } = await swalWithBootstrapButtons.fire({
                title: '<small>Anular Proforma?</small>',
                html: `<small>Esta Ud. seguro/a de anular este Documento <b>N° ${item.nroDocumento}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false
            })

            if (isConfirmed) {
                showLoader();
                proformaSvc.delete(item.idProforma).then(response => {
                    hideLoader();                    
                    if (response.code === "0") {                        
                        _fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {                        
                        _fS.sweetAlert('success', response.message, response.titleSms, 1000);


                        //Una vez actualizado el documento 
                        let {
                            additional
                        } = $scope.jsonPermission;
                        if (typeof $scope.jsonPermission === 'object' && additional.requestAuthorizationKey.requestKey) {
                            _commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.A);
                        }

                        $scope.getProformas();
                    }
                }).catch(error => {
                    console.log(error);
                    hideLoader();
                })

            }
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }



    $scope.askToSendEmail = async (item) => {
        try {
            let params = {
                TYPE_NOTIFICATION: 'N',
                serie: item.nroDocumento,
                correo: item.correo,
                subject: 'Documento Proforma - Acontplus N°: ' + item.nroDocumento,
                json: {
                    hasFile: true,
                    isReport: "SI",
                    reportParams: {
                        hasParams: true,
                        codEstab: item.codEstab,
                        codigo: "PR",
                        format: "pdf"
                    },
                    spParams: {
                        id: item.idProforma
                    }
                }
            }


            const {
                MODAL_SEND_MAIL_CTRL,
                MODAL_SEND_MAIL_CSHTML
            } = _nombreModalConst.common;
            const {
                SendMailCtrl
            } = await import('./../../modal/' + MODAL_SEND_MAIL_CTRL);
            _modalSvc.openModalCustom({
                controller: SendMailCtrl,
                template: 'Shared/' + MODAL_SEND_MAIL_CSHTML,
                size: 'md',
                params
            })
        } catch (error) {
            console.error(error)
        }
    }



    //Impresión 

    $scope.print = function (item) {
        let parameters = {
            idDocument: item.idProforma,
            idTipoDocumento: item.idTipoDocumento,
            codEstab: item.codEstab,
            codDoc: TIPO_DOC_PR.codigo,
            nroIdentificacion: item.nroIdentificacion,
            codigo: 'RNEPT'
        }

        _commonSvc.askToPrint({
            parameters: JSON.stringify(parameters)
        })

    }


    //Reporte 
    $scope.getReport = function (item) {

        let format = 'pdf';

        let dataParms = {
            id: item.idProforma,
        }



        const parameters = {
            hasService: true,
            reportParams: JSON.stringify({
                hasParams: true,
                codigo: 'PR',
                format,
                codEstab: item.codEstab,
                aditionalParams: []
            }),
            dataParams: JSON.stringify(dataParms)
        }

        _commonSvc.getReport({
            parameters,
            formatType: format
        })
    }

}