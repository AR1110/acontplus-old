

app.controller('documentoElectronicoCtrl', documentoElectronicoCtrl)

documentoElectronicoCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService'];

function documentoElectronicoCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS) {
    $scope.comprobantes = [];
    $scope.selectedComprobantes = [];

    //Filtro 
    $scope.dataSearch = {};
    $scope.meses = _fS.meses();
    $scope.dataSearch.mes = new Date().getMonth() + 1;

    $scope.getComprobantes = () => {
        try {
            showLoader();
            $scope.comprobantes = [];


            if ($scope.dataSearch.checkBoxDate || $scope.checkBoxEstadoServicio || $scope.dataSearch.checkBoxComprobante) {
                $scope.dataSearch.isCurrentDate = false;
            } else {
                $scope.dataSearch.isCurrentDate = true;
            }

            _mS.getData('get', '/DocumentoElectronico/Get?json=' + JSON.stringify($scope.dataSearch)).then(
                response => {
                    if (response.code === "0") {
                        console.log(response)
                    }
                    $scope.comprobantes = JSON.parse(response.payload) || [];
                    hideLoader();
                }
            ).catch(error => {
                console.log(error)
                hideLoader();
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    $scope.getComprobantes();


    $scope.initiload = () => {
        _mS.getData('get', '/TipoDocumento/Get').then(
            response => {
                $scope.tiposDocumento = JSON.parse(response.data).filter(doc => ["01", "03", "04", "06", "07"].includes(doc.codigoSri))
            }, error => {
                console.log(error);
            }
        )

        _mS.getData('get', '/DocumentoElectronico/GetDataForm').then(response => {
            const results = JSON.parse(response.payload) || [];
            $scope.estadoServicios = results[0]
        })
    }
    $scope.initiload()

    $scope.openModalFiltro = () => {
        $("#modalFiltroComprobante").modal('show');
    }

    $scope.onChangeFechaFiltro = () => {
        $scope.dataSearch.mes = new Date().getMonth() + 1;
        $scope.getFechaInicioFinFilter()
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro AVanzado
    $scope.getFechaInicioFinFilter = () => {
        let { fechaInicio, fechaFin } = _fS.getFechaInicioFinFilter($scope.dataSearch.mes);
        $scope.dataSearch.dateStart = fechaInicio;
        $scope.dataSearch.dateEnd = fechaFin;
    }

    $scope.onSelectTipoDoc = () => {
        $scope.comprobantes = []
    }

    $scope.searchComprobante = () => {

        if ($scope.dataSearch.checkBoxComprobante) {
            if (!$scope.dataSearch.codDoc) {
                _tS.toastr('warning', 'Seleccione el Tipo Documento');
                return
            }
        }

        if ($scope.checkBoxEstadoServicio) {
            if (!dataSearch.codEstado) {
                _tS.toastr('warning', 'Seleccione el Estado Servicio');
                return
            }
        }

        if ($scope.dataSearch.checkBoxDate) {
            if (!$scope.dataSearch.dateStart) {
                _tS.toastr('warning', 'Seleccione Fecha Inicio');
                return
            }

            if (!$scope.dataSearch.dateEnd) {
                _tS.toastr('warning', 'Seleccione Fecha Fin');
                return
            }

            if ($scope.dataSearch.dateEnd < $scope.dataSearch.dateStart) {
                _tS.toastr('warning', 'Fecha Fin no puede se menor a Fecha Inicio');
                return
            }
        }


        $scope.getComprobantes();
        $("#modalFiltroComprobante").modal('hide');
    }


    $scope.onSelectComprobante = (item) => {

    }

    $scope.getDetalleDoc = async (item) => {
        try {
            const tipoDoc = $scope.tiposDocumento.find(doc => doc.codigoSri === item.codDoc);
            let data = {}, modal = {}, response = {};

            switch (tipoDoc.codigo) {
                case 'FV':
                    data = {
                        idFactura: item.idDocumento,
                        nroDocumento: item.nroDocumento
                    }
                    response = await _commonSvc.getDataTipoDocVenta({
                        item: data,
                        codigoDocumento: tipoDoc.codigo
                    })

                    if (!response.isComplete) return

                    const { MODAL_CTRL, MODAL_DETALLE_CSHTML } = _nombreModalConst.factura_venta
                    const { ModalDetalleCtrl } = await import('./../../modal/' + MODAL_CTRL);
                    _modalSvc.openModalCustom({
                        controller: ModalDetalleCtrl,
                        template: 'FacturaVenta/' + MODAL_DETALLE_CSHTML,
                        params: response,
                        keyboard: true,
                        windowClass: 'uibModalFullScreen'
                    })
                    break
                case 'LC':
                    data = {
                        idLiquidacionCompra: item.idDocumento,
                        nroDocumento: item.nroDocumento
                    }
                    response = await _commonSvc.getDataTipoDocCompra({
                        item: data,
                        codigoDocumento: tipoDoc.codigo
                    })

                    if (!response.isComplete) return

                    const { liquidacion_compra } = _nombreModalConst;
                    modal = await import('./../../modal/' + liquidacion_compra.MODAL_CTRL);
                    _modalSvc.openModalCustom({
                        controller: modal.ModalDetalleCtrl,
                        template: 'LiquidacionCompra/' + liquidacion_compra.MODAL_DETALLE_CSHTML,
                        size: 'xl',
                        params: response,
                        keyboard: true,
                        windowClass: 'uibModalFullScreen'
                    })
                    break

                case 'NC':
                    data = {
                        idNotaCredito: item.idDocumento,
                        nroDoc: item.nroDocumento
                    }
                    response = await _commonSvc.getDataTipoDocVenta({
                        item: data,
                        codigoDocumento: tipoDoc.codigo
                    })
                    if (!response.isComplete) return

                    const { nota_credito_cliente } = _nombreModalConst;
                    modal = await import('./../../modal/' + nota_credito_cliente.MODAL_CTRL);
                    _modalSvc.openModalCustom({
                        controller: modal.ModalDetalleCtrl,
                        template: 'NotaCreditoCliente/' + nota_credito_cliente.MODAL_DETALLE_CSHTML,
                        size: 'xl',
                        keyboard: true,
                        params: response,
                        windowClass: 'uibModalFullScreen'
                    })

                    break

                case 'RC':
                    data = {
                        idRetencionCompra: item.idDocumento,
                    }

                    response = await _commonSvc.getDataTipoDocCompra({
                        item: data,
                        codigoDocumento: tipoDoc.codigo
                    })
                    if (!response.isComplete) return

                    const { retencion_compra } = _nombreModalConst;
                    const { RetencionCompraDetalle } = await import('./../../modal/' + retencion_compra.MODAL_CTRL);
                    _modalSvc.openModalCustom({
                        controller: RetencionCompraDetalle,
                        template: retencion_compra.MODAL_DETALLE_CSHTML,
                        size: 'xl',
                        params: response.dataDocumento
                    })
                    break
            }
        } catch (error) {
            console.error(error)
        }
    }

    $scope.getAuthorizate = async () => {
        try {
            if ($scope.selectedComprobantes.length === 0) {
                _tS.toastr('warning', 'Seleccione al menos un comprobante');
                return
            }
            let { isConfirmed } = await Swal.fire({
                title: '<small>Autorizar</small>',
                icon: 'warning',
                html: `<small>Estás seguro/a de Autorizar <h4><b>${$scope.selectedComprobantes.length}</b></h4> comprobantes?</small>`,
                showDenyButton: true,
                confirmButtonText: 'Si, autorizar',
                denyButtonText: 'No, cancelar',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                showLoader();
                for (let item of $scope.selectedComprobantes) {
                    _mS.getData('put', '/DocumentoElectronico/Put?id=' + item.idDocumentoElectronico).then(response => {
                        let index = $scope.selectedComprobantes.indexOf(item);
                        $scope.selectedComprobantes.splice(index, 1);
                    })
                }
                Swal.fire({
                    icon: 'success',
                    html: `<small>Autorizando...</small>`
                })
                hideLoader();
            }
        } catch (error) {
            console.log(error)
        }


    }


    $scope.getError = async (params) => {
        try {
            const { MODAL_COMPROBANTE_ERROR_CTRL, MODAL_COMPROBANTE_ERROR_CSHTML } = _nombreModalConst.common;
            const { ComprobanteErrorCtrl } = await import('./../../modal/' + MODAL_COMPROBANTE_ERROR_CTRL);

            _modalSvc.openModalCustom({
                controller: ComprobanteErrorCtrl,
                template: 'Shared/' + MODAL_COMPROBANTE_ERROR_CSHTML,
                params,
                size: 'lg',
                keyboard: true
            })
        } catch (error) {
            console.error(error)
        }
    }


    $scope.estadoCorreoComprobantes = () => {
        if (!$scope.comprobantes.some(item => item.codEstado === 4)) return

        //codEstado 4 Autorizadas
        const params = {
            comprobantes: $scope.comprobantes.filter(item => item.codEstado === 4)
        }
        $scope.getStatusSendMail(params);
    }

    $scope.getStatusSendMail = async (item) => {
        try {
            const { MODAL_SEND_MAIL_CTRL, MODAL_STATUS_MAIL_CSHTML } = _nombreModalConst.common;
            const { StatusEmail } = await import('./../../modal/' + MODAL_SEND_MAIL_CTRL);
            _modalSvc.openModalCustom({
                controller: StatusEmail,
                template: MODAL_STATUS_MAIL_CSHTML,
                size: 'xl',
                params: item
            }).result.then(response => {
                if (response) {
                    console.log(response)
                }
            })
            // _mS.getData('get', '/NotificacionTributaria/Get?json=' + JSON.stringify(item)).then(response=>{
            //     if()
            // })
        } catch (error) {

        }
    }

    //@ts-check    
    $scope.openModalSendMail = async (item) => {
        try {
            item.typeSendMail = 'SRI';
            const { MODAL_SEND_MAIL_CTRL, MODAL_SEND_MAIL_CSHTML } = _nombreModalConst.common;
            const { SendMailCtrl } = await import('./../../modal/' + MODAL_SEND_MAIL_CTRL);
            _modalSvc.openModalCustom({
                controller: SendMailCtrl,
                template: 'Shared/' + MODAL_SEND_MAIL_CSHTML,
                size: 'md',
                params: item
            })
        } catch (error) {
            console.error(error)
        }
    }


    $scope.showBtnUpdateXml = (item) => {
        return [2, 0, 5].includes(item.codEstado)
    }

    $scope.updateXml = async (item) => {
        const { isConfirmed } = await Swal.fire({
            title: '<small>Actualizar XML</small>',
            icon: 'warning',
            html: `<small>Esta seguro de actualizar el Xml de este Comprobante <b>Nro. ${item.serie}</b></small>`,
            showDenyButton: true,
            confirmButtonText: 'Si, actualizar',
            denyButtonText: 'No, cancelar',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            _mS.getData('put', '/DocumentoElectronico/Put?id=' + item.idDocumentoElectronico).then(response => {
                if (response.code === '0') {
                    _tS.toastr('warning', response.message, response.titleSms);
                }
                if (response.code === '1') {
                    _tS.toastr('success', response.message, response.titleSms);
                    $scope.getComprobantes();
                }
            })
        }
    }
    $scope.edit = (item) => {
        location.href = '/RetencionAts/Index?id=' + item.idDocumentoElectronico
    }
}