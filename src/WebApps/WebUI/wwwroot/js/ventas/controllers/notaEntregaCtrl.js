(function () {

    'use strict';

    app.controller('notaEntregaCtrl', notaEntregaCtrl);

    notaEntregaCtrl.$inject = [
        '$scope',
        '$filter',
        'mainService',
        'notaEntregaService',
        'commonService',
        'modalService',
        'nombreModal',
        'nombreModalContabilidad',
        'toastService',
        'formulario',
        'decodeToken'
    ];

    function notaEntregaCtrl($scope, $filter, _mS, notaEntregaSvc, _commonSvc, _modalSvc, _nombreModalConst, nombreModalContabilidad, _tS, _fS, decodeToken) {


        const TIPO_DOC_NE = _commonSvc.tipoDoc['NE'];
        const PERMISSION_KEY_ACTIONS = {
            E: 'E',
            A: 'A',
        }

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            order: '',
            tipo: 1,
            pageSize: 50,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
            busqueda: "",
            byStock: 0,
        };

        $scope.typeSend = 'GenericFile';

        $scope.jsonPermission = {}

        $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento 
        $scope.parametersPrint = {};


        $scope.cliente = {}
        $scope.notaEntregas = [];

        let idUsuarioRol = Number(decodeToken.idUsuarioRol)





        // removed focus new NE
        let btnNewDocument = document.getElementById("btnNewDocument");
        btnNewDocument.addEventListener("click", () => {
            btnNewDocument.blur();
        })

        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getNotaEntregas();
        }



        $scope.onKeyupCliente = function (e) {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.idCliente = 0;
            }
        }
        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.idCliente = item.idCliente;
            $scope.getNotaEntregas();
        }

        $scope.usuarioSearch = function (textSearch) {
            try {
                let query = {
                    idRol: idUsuarioRol,
                    busqueda: textSearch
                }

                if (query.busqueda.length > 2) {
                    return _commonSvc.usuarioSearch(query)
                        .catch(error => {
                            console.log(error);
                            throw error;
                        })
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onKeyupUsuarioSearch = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.searchFilterLocal = function () {
            let aprobComprobantes = JSON.parse(JSON.stringify($scope.cloneAproComprobantes));
            $scope.aprobComprobantes = $filter("filter")(aprobComprobantes, $scope.dataSearch.bySearch);
            $scope.calculoColumnTotal();
        }

        //=====================Eend Filters=======================



        $scope.getTotales = function () {
            let { total, totalAbono, totalSaldo } = notaEntregaSvc.getTotales($scope.notaEntregas)
            $scope.total = _fS.roundNumber(total, 5);
            $scope.totalAbono = _fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = _fS.roundNumber(totalSaldo, 5);

        }


        $scope.getNotaEntregas = async () => {
            try {
                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    checkBoxDefault: false,
                    checkBoxCliente: $scope.dataSearch.idCliente > 0,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: true,
                    checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                    byUsuario: $scope.dataSearch.byUsuario,
                    checkBoxEstado: $scope.dataSearch.codEstado ? true : false,
                    codEstado: $scope.dataSearch.codEstado,
                    fechaInicio: _fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: _fS.formatDateMoment($scope.dataSearch.fechaFin),
                    tipoFecha: 'FE',
                    isSearchNroSequential: $scope.dataSearch.nroSecuencial ? true : false,
                    nroSecuencial: $scope.dataSearch.nroSecuencial
                }

                showLoader();
                $scope.notaEntregas = [];
                $scope.cloneNotaEntregas = [];
                $scope.getTotales();

                notaEntregaSvc.getAll(dataSearch).then(response => {
                    hideLoader();
                    let { notaEntregas, dataTotals } = response;
                    $scope.notaEntregas = notaEntregas;
                    $scope.cloneNotaEntregas = JSON.parse(JSON.stringify($scope.notaEntregas));

                    //Totals 
                    $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                    $scope.total = _fS.roundNumber(dataTotals.totalDocument, 5);
                    $scope.totalAbono = _fS.roundNumber(dataTotals.totalAbono, 5);
                    $scope.totalSaldo = _fS.roundNumber(dataTotals.totalSaldo, 5);

                }).catch(error => {
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


        $scope.initiload = async function () {
            _commonSvc.getEstabAsign().then(response => {
                $scope.establecimientos = response;
                let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;

                $scope.dataSearch.codEstab = codEstab;
                $scope.getNotaEntregas();
            })

            _commonSvc.getDataFormVenta().then(result => {
                $scope.jsonPermission = JSON.parse(result[9][0].jsonPermission)
            })

            $scope.estadoDocumentos = await _commonSvc.getEstadoDocByCodDoc('NE');

        }
        $scope.initiload();

        $scope.pagechanged = function () {
            $scope.getNotaEntregas();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getNotaEntregas();
        };
        //Filtro de Nota de Entregas localmente 
        $scope.searchFilterLocal = function () {
            let notaEntregas = JSON.parse(JSON.stringify($scope.cloneNotaEntregas));
            $scope.notaEntregas = $filter("filter")(notaEntregas, $scope.dataSearch.bySearch);
            $scope.getTotales();
        }



        $scope.validateOperationPrintAndPayment = (result) => {

            let { isRegister, data } = result;

            $scope.isRegister = isRegister;
            $scope.isPrintDocument = data.printerAutomatic;

            $scope.parametersPrint = {
                ...data,
                codDoc: data.codDoc === '01' ? 'FV' : 'NE',
                idDocument: data.idDocumento,
                codigo: data.codDoc === "01" ? 'RFPT' : 'RNEPT',
            }

            if (data.payAutomatic) {
                if (data.esContado) {
                    $scope.openModalRapido(result)
                } else {
                    $scope.openModalCobroDocumento(result)
                }
                return
            }

            if (data.printerAutomatic) {
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
                id: item.idDocumento,
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
                    id: item.idDocumento,
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
                    id: item.idDocumento,
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
                    notaEntregaSvc.delete(item.idDocumento).then(response => {
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
                data: item
            }

            if (item.tiempoCredito) {
                $scope.openModalRapido(params);
            } else {
                $scope.openModalCobroDocumento(params)
            }
        }




        $scope.openModalCobroDocumento = async (params) => {
            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CL'];
                let template = nombreModalContabilidad.COBRO.templates['CL'];
                let controller = (await import(fileCtrl))[ctrl];

                $scope.openModalCobro({
                    controller,
                    template,
                    params,
                    size: 'xl',
                    //   windowClass: 'uibModalFullScreen'
                })
            } catch (error) {
                console.log(error)
            }
        }



        /**
         * 
         * @param {object} params 
         */
        $scope.openModalRapido = async (params) => {

            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CR'];
                let template = nombreModalContabilidad.COBRO.templates['CR'];
                let controller = (await import(fileCtrl))[ctrl];

                $scope.openModalCobro({
                    controller,
                    template,
                    params,
                })
            } catch (error) {
                console.log(error)
            }

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
                params,
                isRenderRazorPartial: true
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
                let fileCtrl = nombreModalContabilidad.COBRO.fileCuotaCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['MC'];
                let template = nombreModalContabilidad.COBRO.templates['MC'];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = _modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params: item,
                    isRenderRazorPartial: true
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object' && result.isReload) {
                        $scope.getNotaEntregas();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }





        $scope.openModalHistorialCobro = async (ev, item) => {
            try {
                if (['PE'].includes(item.codEstado)) return

                // showLoader();
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CD'];
                let templateUrl = nombreModalContabilidad.COBRO.templates['CD'];
                let controller = (await import(fileCtrl))[ctrl];

                let config = {
                    controller,
                    templateUrl,
                    // Appending dialog to document.body to cover sidenav in docs app
                    // Modal dialogs should fully cover application to prevent interaction outside of dialog
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    params: Object.assign({}, item)
                }

                _modalSvc.openMdDialog(config)
            } catch (error) {
                hideLoader();
                console.log(error)
            }

        }




        $scope.print = function (item) {
            let parameters = {
                isPrint: 1,
                idDocument: item.idDocumento,
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


        $scope.typeSendToMail = 'N'
        $scope.getParamToSendMail = function (item) {
            return {
                TYPE_NOTIFICATION: 'N',
                serieComprobante: item.serieComprobante,
                correo: item.correo,
                subject: 'Documento Nota Entrega - Acontplus N°: ' + item.serieComprobante,
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
                        id: item.idDocumento
                    }
                }
            }
        }


        $scope.getReport = function (item) {
            let format = 'pdf';
            let dataParms = {
                id: item.idDocumento
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

