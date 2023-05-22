(function () {

    'use strict';

    app.controller('notaEntregaCtrl', notaEntregaCtrl);

    notaEntregaCtrl.$inject = ['$scope', '$filter', 'mainService', 'notaEntregaService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario'];

    function notaEntregaCtrl($scope, $filter, _mS, notaEntregaSvc, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS) {
        'use strict';

        const TIPO_DOC_NE = _commonSvc.tipoDoc['NE'];
        const PERMISSION_KEY_ACTIONS = {
            E: 'E',
            A: 'A',
        }

        $scope.jsonPermission = {}

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000
        }

        $scope.clienteFiltro = {}
        $scope.usuarioSearchFiltro = {};
        $scope.mes = new Date().getMonth() + 1;
        $scope.notaEntregas = [];


        $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento 
        $scope.parametersPrint = {};


        // removed focus new NE
        let btnNewDocument = document.getElementById("btnNewDocument");
        btnNewDocument.addEventListener("click", () => {
            btnNewDocument.blur();
        })


        $scope.getTotales = function () {
            let { total, totalAbono, totalSaldo } = notaEntregaSvc.getTotales($scope.notaEntregas)
            $scope.total = _fS.roundNumber(total, 5);
            $scope.totalAbono = _fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = _fS.roundNumber(totalSaldo, 5);

        }


        $scope.getNotaEntregas = async () => {
            try {

                if ($scope.dataSearch.checkBoxCliente ||
                    $scope.dataSearch.checkBoxFecha ||
                    $scope.dataSearch.checkBoxUsuario ||
                    $scope.dataSearch.checkBoxEstado
                ) {
                    $scope.dataSearch.checkBoxDefault = false
                } else {
                    $scope.dataSearch.checkBoxDefault = true;
                }

                showLoader();
                $scope.notaEntregas = [];

                notaEntregaSvc.getAll($scope.dataSearch).then(response => {
                    hideLoader();
                    $scope.notaEntregas = response;
                    $scope.cloneNotaEntregas = JSON.parse(JSON.stringify($scope.notaEntregas));
                    $scope.getTotales();
                    
                }).catch(error => {
                    hideLoader();
                    $scope.getTotales();
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
                $scope.getNotaEntregas();
            })

            _commonSvc.getDataFormVenta().then(result => {
                $scope.jsonPermission = JSON.parse(result[9][0].jsonPermission)
            })

        }
        $scope.initiload();


        //Filtro de Nota de Entregas localmente 
        $scope.searchLocalNotaEntregas = function () {
            let notaEntregas = JSON.parse(JSON.stringify($scope.cloneNotaEntregas));
            $scope.notaEntregas = $filter("filter")(notaEntregas, $scope.dataSearch.bySearch);
            $scope.getTotales();
        }

        $scope.openModalFiltro = async () => {

            let { MODAL_FILE_CTRL, MODAL_FILTRO } = _nombreModalConst.nota_entrega;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_FILTRO['controller']];
            let template = MODAL_FILTRO['template'];

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
                let { dataSearch, clienteFiltro, usuarioSearchFiltro, mes, isSearch } = result;
                $scope.dataSearch = dataSearch;
                $scope.clienteFiltro = clienteFiltro;
                $scope.usuarioSearchFiltro = usuarioSearchFiltro;
                $scope.mes = mes;
                if (isSearch) {
                    $scope.getNotaEntregas();
                }
            })
        }


        $scope.validateOperationPrintAndPayment = (result) => {
            //Verificamos 
            
            $scope.isRegister = result.isRegister;

            $scope.isPrintDocument = result.printerAutomatic;

            $scope.parametersPrint = {
                ...result.data,
                idDocument: result.data.id,
                codigo: result.TIPO_DOC.codigo === "FV" ? 'RFPT' : 'RNEPT',
            }

            if (result.payAutomatic) {
                if (result.data.esContado) {
                    $scope.openModalRapido(result)
                } else {
                    $scope.openModalCobroDocumento(result)
                }
                return
            }

            if (result.printerAutomatic) {
                _commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
            }

            $scope.getNotaEntregas();
            btnNewDocument.focus();
        }




        $scope.openModalNew = async () => {
            try {
                let { MODAL_FILE_CTRL, MODAL_NUEVO } = _nombreModalConst.nota_entrega;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
                let template = MODAL_NUEVO['template'];
                let params = {
                    TIPO_REGISTRO: 'NUEVO'
                }

                _modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params,
                    windowClass: 'uibModalFullScreen'
                }).result.then(result => {

                    if (typeof result !== 'object') return

                    $scope.validateOperationPrintAndPayment(result)
                })
            } catch (error) {
                console.log(error)
            }
        }


        /**
         * 
         * @param {*} id 
         * @returns 
         */

        $scope.getDataDocumento = (id) => {
            return _commonSvc.getDataTipoDocVenta({
                id,
                codigoDocumento: TIPO_DOC_NE.codigo
            })
        }

        $scope.openModalDetalle = async (item) => {
            let { MODAL_FILE_CTRL, MODAL_DETALLE } = _nombreModalConst.nota_entrega;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
            let template = MODAL_DETALLE['template'];
            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idNotaEntrega,
                codigoDocumento: TIPO_DOC_NE.codigo
            })

            if (!response.isComplete) return

            let params = {
                TIPO_REGISTRO: 'DETALLE',
                data: response
            }

            $scope.openModalInvoiceParam({
                controller,
                template,
                params
            })
        }

        $scope.openModalEdit = async (item) => {
            try {

                if (item.anulada) {
                    _fS.sweetAlert('warning', 'El documento ya se encuentra anulada');
                    return
                }


                let result = await _commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.E);
                if (result.code === "2") {
                    _commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.E);
                    return
                }

                showLoader();


                let { MODAL_FILE_CTRL, MODAL_EDITAR } = _nombreModalConst.nota_entrega;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
                let template = MODAL_EDITAR['template'];

                let response = await _commonSvc.getDataTipoDocVenta({
                    id: item.idNotaEntrega,
                    codigoDocumento: TIPO_DOC_NE.codigo
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
                }).result.then(response => {
                    if (typeof response === 'object') {

                        //Una vez actualizado el documento 
                        let { additional } = $scope.jsonPermission;
                        if (typeof $scope.jsonPermission === 'object' && additional.requestAuthorizationKey.requestKey) {
                            _commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.E);
                        }

                        $scope.getNotaEntregas();
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
                let { MODAL_FILE_CTRL, MODAL_DUPLICAR } = _nombreModalConst.nota_entrega;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DUPLICAR['controller']];
                let template = MODAL_DUPLICAR['template'];

                let response = await _commonSvc.getDataTipoDocVenta({
                    id: item.idNotaEntrega,
                    codigoDocumento: TIPO_DOC_NE.codigo
                })

                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'DUPLICAR',
                    data: response
                }

                _modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params,
                    windowClass: 'uibModalFullScreen'
                }).result.then(result => {

                    if (typeof result !== 'object') return

                    $scope.validateOperationPrintAndPayment(result)

                })

            } catch (error) {

                console.log(error)
            } finally {
                hideLoader();
            }

        }

        $scope.openModalInvoiceParam = ({ controller, template, size = 'xl', params }) => {

            _modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                windowClass: 'uibModalFullScreen'
            }).result.then(result => {

                if (typeof result === 'object') {
                    $scope.getNotaEntregas();
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

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: '<small>Anular Nota de Entrega?</small>',
                    html: `<small>Esta Ud. seguro/a de anular este Documento <b>N° ${item.nroDocumento
                        }</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    showLoader();
                    notaEntregaSvc.delete(item.idNotaEntrega).then(response => {
                        hideLoader();
                        if (response.code === "0") {
                            _fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            hideLoader();
                            _fS.sweetAlert('success', response.message, response.titleSms, 1000);

                            //Una vez actualizado el documento 
                            let { additional } = $scope.jsonPermission;
                            if (typeof $scope.jsonPermission === 'object' && additional.requestAuthorizationKey.requestKey) {
                                _commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.A);
                            }
                            $scope.getNotaEntregas();
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error);
                    })

                }
            } catch (error) {
                console.log(error)
            } finally {

            }
        }



        //--------------------------------------------------COBROS----------

        $scope.opcionCobro = (item) => {

            if (item.estadoFinanciero === "Cobrada") {
                _fS.sweetAlert('warning', '<small>Este documento ya se encuentra cobrada!</small>')
                return
            }

            let params = {
                data: {
                    ...item,
                    id: item.idNotaEntrega,
                    codEstab: item.codEstab,
                    esContado: item.credito,
                    razonSocialComprador: item.nombreFiscal,
                },
                TIPO_DOC: TIPO_DOC_NE
            }

            if (params.data.esContado) {
                $scope.openModalRapido(params);
            } else {
                $scope.openModalCobroDocumento(params)
            }
        }




        $scope.openModalCobroDocumento = async (params) => {
            let { MODAL_FILE_CTRL, MODAL_COBRO_DOCUMENTO } = _nombreModalConst.cobro;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_COBRO_DOCUMENTO['controller']];
            let template = MODAL_COBRO_DOCUMENTO['template'];

            $scope.openModalCobro({
                controller,
                template,
                params,
                size: 'xl'
            })
        }



        /**
         * 
         * @param {object} params 
         */
        $scope.openModalRapido = async (params) => {

            let { MODAL_FILE_CTRL, MODAL_COBRO_RAPIDO } = _nombreModalConst.cobro;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_COBRO_RAPIDO['controller']];
            let template = MODAL_COBRO_RAPIDO['template'];

            $scope.openModalCobro({
                controller,
                template,
                params
            })

        }

        /**
         * 
         * @param {object} param0 
         */

        $scope.openModalCobro = ({ controller, template, size = 'lg', params }) => {
            let $modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size,
                params
            })

            $modalRef.result.then(result => {
                if (typeof result == 'object' || $scope.isRegister) {
                    $scope.getNotaEntregas();
                }

                //Cuando el documento es Nuevo o Duplicado 
                if ($scope.isPrintDocument == 1) {
                    $scope.getNotaEntregas();
                    _commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
                    $scope.isPrintDocument = null;
                }

                btnNewDocument.focus();
                $scope.isPrintDocument = null;
                $scope.isRegister = null;
                $scope.parametersPrint = {}
            })
        }


        $scope.openModalCuota = async (item) => {
            try {
                let { MODAL_FILE_CUOTA, MODAL_CUOTA_VENTA } = _nombreModalConst.cobro;
                let controller = (await import('./../../' + MODAL_FILE_CUOTA))[MODAL_CUOTA_VENTA['controller']];
                let template = MODAL_CUOTA_VENTA['template'];

                let params = {}

                let response = await _mS.getData('get', `/CuotaXCobrar/GetByDocument?idComprobante=${item.idNotaEntrega}&idTipoDoc=${TIPO_DOC_NE.idTipoDocumento}`)

                if (response.id === "0") {
                    _fS.sweetAlert('warning', response.message, response.titleSms)
                    return
                }

                if (response.id === "1") {
                    params = {
                        cuotas: response.data,
                        data: {
                            ...item,
                            id: item.idNotaEntrega,
                            codEstab: item.codEstab,
                            esContado: item.credito,
                            razonSocialComprador: item.nombreFiscal,
                        },
                        TIPO_DOC: TIPO_DOC_NE
                    }
                }


                let $modalRef = _modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params
                })

                $modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getNotaEntregas();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }





        $scope.openModalHistorialCobro = async (item) => {
            try {
                let { MODAL_FILE_HISTORIAL_COBRO, MODAL_HISTORIAL_COBRO } = _nombreModalConst.cobro;
                let controller = (await import('./../../' + MODAL_FILE_HISTORIAL_COBRO))[MODAL_HISTORIAL_COBRO['controller']];
                let template = MODAL_HISTORIAL_COBRO['template'];
                let params = {}


                await _mS.getData('get', `/ComprobanteIngreso/GetByDocument?idTipoDocumento=${TIPO_DOC_NE.idTipoDocumento}&idComprobante=${item.idNotaEntrega}`).then(response => {
                    if (response.id === null) {
                        _fS.sweetAlert('error', "Ups! algo salio mal <i class='far fa-frown'></i>!", response.titleSms);
                        return
                    }
                    if (response.id == "0") {
                        _fS.sweetAlert('warning', response.message, response.titleSms);
                        throw response
                    }

                    if (response.id === "1") {
                        params = {
                            historialCobros: response.data,
                            data: {
                                ...item,
                                id: item.idNotaEntrega,
                                codEstab: item.codEstab,
                                esContado: item.credito,
                                razonSocialComprador: item.nombreFiscal,
                            },
                            TIPO_DOC: TIPO_DOC_NE
                        }
                    }
                })

                let $modalRef = _modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params
                })
            } catch (error) {
                console.log(error)
            }


        }




        $scope.print = function (item) {
            let parameters = {
                isPrint: 1,
                idDocument: item.idNotaEntrega,
                idTipoDocumento: item.idTipoDocumento,
                codEstab: item.codEstab,
                codDoc: TIPO_DOC_NE.codigo,
                nroIdentificacion: item.nroIdentificacion,
                codigo: 'RNEPT'
            }

            _commonSvc.askToPrint({
                parameters: JSON.stringify(parameters)
            })

        }


        $scope.askToSendEmail = async (item) => {
            try {
                let params = {
                    TYPE_NOTIFICATION: 'N',
                    serie: item.nroDocumento,
                    correo: item.correo,
                    subject: 'Documento Nota Entrega - Acontplus N°: ' + item.nroDocumento,
                    json: {
                        hasFile: true,
                        isReport: "SI",
                        reportParams: {
                            hasParams: true,
                            codEstab: item.codEstab,
                            codigo: "RNE",
                            format: "pdf"
                        },
                        spParams: {
                            id: item.idNotaEntrega
                        }
                    }
                }


                const { MODAL_SEND_MAIL_CTRL, MODAL_SEND_MAIL_CSHTML } = _nombreModalConst.common;
                const { SendMailCtrl } = await import('./../../modal/' + MODAL_SEND_MAIL_CTRL);
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


        $scope.getReport = function (item) {
            let format = 'pdf';
            let dataParms = {
                id: item.idNotaEntrega
            }

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: 'RNE',
                    codEstab: item.codEstab,
                    format,
                    aditionalParams: [

                    ]
                }),
                dataParams: JSON.stringify(dataParms)
            }

            _commonSvc.getReport({
                parameters,
                formatType: format
            })
        }








    }
})(window.angular)

