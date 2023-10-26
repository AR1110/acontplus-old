(function () {

    'use strict';

    app.controller('documentoElectronicoCtrl', documentoElectronicoCtrl)
    documentoElectronicoCtrl.$inject = [
        '$scope',
        'mainService',
        'commonService',
        'docElectService',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'decodeToken',
    ]

    function documentoElectronicoCtrl(
        $scope,
        mS,
        commonSvc,
        docElectSvc,
        modalSvc,
        nombreModalConst,
        fS,
        tS,
        decodeToken,
    ) {

        $scope.comprobantes = [];
        $scope.selectedComprobantes = [];

        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.tempPuntosEmision = [];
        $scope.codEstab_Asig = null;

        //DETECT MOBILE DEVICE
        mS.detectDevice()

        //const tipo = document.getElementById("tipo").value


        //Filtro
        $scope.recordsQuantity = [10, 25, 50, 100]
        $scope.dataSearch = {
            order: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            checkBoxDate: true,
            pageSize: 50,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0
        };

        $scope.dataSearch.isCurrentDate = false; 

        $scope.dataSearch.isSearchCustomerProvider = false;

        //Cuando la redieccion es del home - comprobantes error 
        let params = new URLSearchParams(document.location.search);
        // Imprime el valor
        $scope.tipo =  params.get("tipo");

        $scope.getComprobantes = () => {
            try {
               
                $scope.comprobantes = [];

                if($scope.dataSearch.nroSecuencial){
                    if(!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)){
                        $scope.dataSearch.checkBoxDate = true;
                        tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                        return
                    }
                    if(!($scope.dataSearch.identificacionReceptor)){
                        $scope.dataSearch.checkBoxDate = false;
                    }
                } 


                if ($scope.tipo > 0) {
                    showLoader();
                    docElectSvc.getByStatus({ tipo: Number($scope.tipo) }).then(response => {
                        if (!$scope.isMobile) {
                            document.getElementById('menu_toggle').click();
                        }
                        $scope.comprobantes = response;
                        $scope.dataSearch.totalRecords = $scope.comprobantes.length > 0 ? $scope.comprobantes[0].totalRecords : 0
                    })
                        .finally(() => hideLoader())
                        .catch(error => {
                            $scope.dataSearch.totalRecords = 0;
                            console.log(error)
                        })
                } else {
                    showLoader();                    
                    let dataSearch = {
                        tipo: 1,
                        codDoc: $scope.dataSearch.codDoc,
                        codEstado: $scope.dataSearch.codEstado,
                        checkBoxDate: $scope.dataSearch.checkBoxDate,
                        dateStart: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                        dateEnd: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                        codEstab: $scope.dataSearch.codEstab,
                        idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                        identificacionReceptor: $scope.dataSearch.identificacionReceptor,
                        idUsuario: $scope.dataSearch.idUsuario,
                        pageIndex: $scope.dataSearch.pageIndex,
                        pageSize: $scope.dataSearch.pageSize,
                        nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
                    }

                    docElectSvc.get(dataSearch).then(response => {
                        if (!$scope.isMobile) {
                            document.getElementById('menu_toggle').click();
                        }
                        $scope.comprobantes = response;
                        $scope.dataSearch.totalRecords = $scope.comprobantes.length > 0 ? $scope.comprobantes[0].totalRecords : 0
                    })
                        .finally(() => hideLoader())
                        .catch(error => {
                            $scope.dataSearch.totalRecords = 0;
                            console.log(error)
                        })
                }
            } catch (error) {
                console.log(error)
            }
        }

        //$scope.getComprobantes();


        $scope.initiload = () => {
            showLoader();
            docElectSvc.get({ tipo: 2 }).then(response => {
                let {
                    estabs,
                    tiposDoc,
                    estadosDoc
                } = response;
                $scope.establecimientos = estabs;
                $scope.tiposDocumento = tiposDoc;
                $scope.tiposDoc = tiposDoc;
                $scope.estadosDoc = estadosDoc;

                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    if ($scope.puntosEmision.length > 0) {
                        $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    } else {
                        tS.toastr('warning', 'No tienes asigando Puntos de Emisión')
                    }
                    $scope.getComprobantes();
                }
            }).finally(() => hideLoader())
        }
        $scope.initiload()


        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
            $scope.getComprobantes();
        }

        $scope.onchangeEstablecimiento = () => {
            try {
                let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
                $scope.puntosEmision = dataEstab.puntosEmision;

                if ($scope.puntosEmision.length > 0) {
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getComprobantes();
                } else {
                    tS.toastr('warning', 'No tiene puntos de emisión asignados')
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onSelectTipoDoc = () => {
            if ([null, undefined, ""].includes($scope.dataSearch.codDoc)) {
                $scope.modelCustomerProvider = null;
                $scope.dataSearch.identificacionReceptor = null;
            }
            $scope.getComprobantes();
        }


        $scope.searchCustomerProvider = function (textSearch) {
            try {
                $scope.dataSearch.identificacionReceptor = null;
                $scope.dataSearch.isSearchCustomerProvider = false;


                if (['01', '06', '04'].includes($scope.dataSearch.codDoc)) {
                    return commonSvc.clienteSearch(textSearch).then(response => {
                        return response.map(item => ({
                            idClienteProveedor: item.idCliente,
                            nameCustomerProvider: item.nombreFiscal,
                            identificacionReceptor: item.numeroIdentificacion
                        }))
                    })
                } else {
                    return commonSvc.proveedorSearch(textSearch).then(response => {
                        return response.map(item => ({
                            idClienteProveedor: item.proveedor.idProveedor,
                            nameCustomerProvider: item.proveedor.nombreFiscal,
                            identificacionReceptor: item.proveedor.numeroIdentificacion
                        }))
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onSelectedCustomerProvider = function (item) {
            $scope.dataSearch.isSearchCustomerProvider = true;
            $scope.dataSearch.identificacionReceptor = item.identificacionReceptor;
            $scope.getComprobantes();
        }

        $scope.clearSearchCustomer = function () {
            $scope.modelCustomerProvider = null;
            $scope.dataSearch.identificacionReceptor = null;
            $scope.getComprobantes();
        }

        $scope.searchUser = function (textSearch) {
            try {
                let query = {
                    busqueda: textSearch,
                    idRol: decodeToken.idUsuarioRol
                }
                return commonSvc.usuarioSearch(query)
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onSelectedUser = function (user) {
            $scope.modelUser = user.nombreCompleto;
            $scope.dataSearch.idUsuario = user.idUsuario;
            $scope.getComprobantes();
        }

        $scope.clearUserSearch = function () {
            $scope.modelUser = null;
            $scope.dataSearch.idUsuario = 0;
            $scope.getComprobantes();
        }

        $scope.pagechanged = function () {
            $scope.getComprobantes();
        }

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getComprobantes();
        }

        $scope.onSelectComprobante = (item) => {
            console.log(item)
        }
        //=====================================================END FILTER===============================================
        const REPORT_CODES = Object.freeze({
            '01': 'RF',
            '03': 'RLC',
            '04': 'RNCC',
            '06': 'RGR',
            '07': 'RRC',
        })

        //Get Report 
        $scope.getReport = (item) => {
            try {

                if (!(Object.keys(REPORT_CODES).includes(item.codDoc))) {
                    tS.toastr('warning', 'No Disponible')
                    return
                }

                let format = 'pdf';
                let dataParms = {
                    versionComp: item.versionComp,
                    id: item.idDocumento,
                    codEstab: item.codEstab,
                    codigo: REPORT_CODES[item.codDoc],
                    format,
                }

                const parameters = {
                    dataParams: JSON.stringify(dataParms)
                }

                commonSvc.getReportDynamic({
                    parameters,
                    format
                })
            } catch (error) {
                console.log(item);
            }
        }


        $scope.downloadXml = (item) => {
            showLoader();
            docElectSvc.downloadXml(item.idDocumentoElectronico).finally(() => hideLoader())
        }


        $scope.getDetalleDoc = async (item) => {
            try {
                const tipoDoc = $scope.tiposDocumento.find(doc => doc.codDoc === item.codDoc);
                let codigo = '';
                if (tipoDoc.codDoc === "01") {
                    codigo = 'FV'
                }
                if (tipoDoc.codDoc === "06") {
                    codigo = 'GR'
                }
                commonSvc.viewDetailDocument({
                    id: item.idDocumento,
                    codigoDocumento: codigo,
                    size: 'xl',
                    windowClass: 'uibModalFullScreen'
                })

            } catch (error) {
                console.error(error)
            }
        }

        $scope.getAuthorizate = async () => {
            try {
                if ($scope.selectedComprobantes.length === 0) {
                    tS.toastr('warning', 'Seleccione al menos un comprobante');
                    return
                }
                let {
                    isConfirmed
                } = await Swal.fire({
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
                        docElectSvc.updateXml(item.idDocumentoElectronico).then(() => {
                            let index = $scope.selectedComprobantes.indexOf(item);
                            $scope.selectedComprobantes.splice(index, 1);
                        })
                    }
                    Swal.fire({
                        icon: 'success',
                        html: `<small>Autorizando...</small>`,
                        timer: 1000
                    })
                    hideLoader();
                }
            } catch (error) {
                console.log(error)
            }
        }


        $scope.getError = async (params) => {
            try {
                const {
                    MODAL_COMPROBANTE_ERROR_CTRL,
                    MODAL_COMPROBANTE_ERROR_CSHTML
                } = nombreModalConst.common;
                const {
                    ComprobanteErrorCtrl
                } = await import('./../../modal/' + MODAL_COMPROBANTE_ERROR_CTRL);

                modalSvc.openModalCustom({
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
                const {
                    MODAL_SEND_MAIL_CTRL,
                    MODAL_STATUS_MAIL_CSHTML
                } = nombreModalConst.common;
                const {
                    StatusEmail
                } = await import(MODAL_SEND_MAIL_CTRL);
                modalSvc.openModalCustom({
                    controller: StatusEmail,
                    template: MODAL_STATUS_MAIL_CSHTML,
                    size: 'xl',
                    params: item,
                    isRenderRazorPartial: true
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.typeSendMail = 'SRI';

        //------------------SEND WHATSAPP
        $scope.typeSend = 'SRI';
        $scope.hasPermissions = decodeToken.role == 'RT' ? true : false

        $scope.paramsToWhatsapp = {
            loginOnly: true
        }

        $scope.showBtnUpdateXml = (item) => {
            return [2, 0, 5].includes(item.codEstado)
        }

        $scope.updateXml = async (item) => {
            const {
                isConfirmed
            } = await Swal.fire({
                title: '<small>Actualizar XML</small>',
                icon: 'warning',
                html: `<small>Esta seguro de actualizar el Xml de este Comprobante <b>Nro. ${item.serie}</b></small>`,
                showDenyButton: true,
                confirmButtonText: 'Si, actualizar',
                denyButtonText: 'No, cancelar',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                showLoader();
                docElectSvc.updateXml(item.idDocumentoElectronico).then(response => {
                    if (response.code === '0') {
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code === '1') {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getComprobantes();
                    }
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())

            }
        }
        $scope.edit = (item) => {
            if (item.versionComp == '2.0.0') {
                location.href = '/RetencionAts/Index?id=' + item.idDocumentoElectronico
            } else {
                tS.toastr('warning', 'No disponible')
            }
        }
        $scope.askToCancel = (item) => {
            try {
                if (item.codDoc != '07') {
                    tS.toastr('info', 'Aun no disponible')
                    return
                }
                Swal.fire({
                    title: '¿Está seguro de anular este comprobante?',
                    html: `<small>Asegurese de haber dado de baja este comprobante en el portal del SRI</small>`, // "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        $scope.cancel(item)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        $scope.cancel = (item) => {
            showLoader();
            docElectSvc.retencionAtsCancel(item.idDocumentoElectronico).then(response => {
                if (response.code == '1') {
                    tS.toastr('success', response.message)
                    $scope.getComprobantes()
                }
                if (response.code == '0') {
                    tS.toastr('warning', response.message)
                }
            }).finally(() => hideLoader())
        }


        $scope.refresh = () => {
            location.href = '/DocumentoElectronico/Index';
        }
    }
})(window.angular)