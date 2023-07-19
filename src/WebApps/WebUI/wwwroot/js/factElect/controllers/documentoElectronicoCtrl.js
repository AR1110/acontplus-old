app.controller('documentoElectronicoCtrl', documentoElectronicoCtrl)

documentoElectronicoCtrl.$inject = ['$scope',
    'mainService',
    'commonService',
    'modalService',
    'nombreModal',
    'formulario',
    'toastService',
    '$window',
    'decodeToken',
    'FileSaver',
    'Blob'
]

function documentoElectronicoCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, $window, decodeToken, FileSaver, Blob) {
    $scope.comprobantes = [];
    $scope.selectedComprobantes = [];

    $scope.establecimientos = [];
    $scope.puntosEmision = [];
    $scope.tempPuntosEmision = [];
    $scope.codEstab_Asig = null;

    //DETECT MOBILE DEVICE
    _mS.detectDevice()

    const tipo = document.getElementById("tipo").value


    //Filtro
    $scope.recordsQuantity  = [10, 25, 50, 100]
    $scope.dataSearch = {
        order: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        pageSize: 50,
        pageIndex: 1,        
        maxSize: 5,
        totalRecords: 0
    };
    
    $scope.dataSearch.isCurrentDate = false;
    $scope.dataSearch.checkBoxDate = true;

    $scope.dataSearch.isSearchCustomerProvider = false; 

    $scope.getComprobantes = () => {
        try {
            showLoader();
            $scope.comprobantes = [];

            let dataSearch = {}

            if (tipo > 0) {
                dataSearch = {
                    tipo
                }
            } else {

                dataSearch = {
                    checkBoxEstab: $scope.dataSearch.checkBoxEstab,
                    estab: $scope.dataSearch.estab,
                    checKboxPuntoEmision: $scope.dataSearch.checKboxPuntoEmision,
                    ptoEmi: $scope.dataSearch.ptoEmi,
                    codDoc: $scope.dataSearch.codDoc,
                    checkBoxEstadoServicio: $scope.dataSearch.checkBoxEstadoServicio,
                    checkBoxComprobante: $scope.dataSearch.checkBoxComprobante,
                    codEstado: $scope.dataSearch.codEstado,
                    isCurrentDate: false,
                    checkBoxDate: $scope.dataSearch.checkBoxDate,
                    dateStart: _fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    dateEnd: _fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                    textSearch: $scope.dataSearch.textSearch,
                    isSearchCustomerProvider: $scope.dataSearch.isSearchCustomerProvider,
                    identificacionReceptor: $scope.dataSearch.identificacionReceptor,
                    isSearchUser: $scope.dataSearch.isSearchUser,
                    idUsuario: $scope.dataSearch.idUsuario,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize
                }   

            }
            _mS.getData('get', 'DocumentoElectronico/?json=' + JSON.stringify(dataSearch), null, true).then(response => {
                hideLoader()
                if (response.code === "0") {
                    $scope.comprobantes = [];
                    $scope.dataSearch.totalRecords = 0;
                    console.log(response)
                    return
                }
                if (!$scope.isMobile) {
                    document.getElementById('menu_toggle').click();
                }
                if(response.code==="1"){
                    $scope.comprobantes = JSON.parse(response.payload)[0] || [];
                    $scope.dataSearch.totalRecords = $scope.comprobantes[0].totalRecords;
                }    

            }).catch(error => {
                $scope.dataSearch.totalRecords = 0;
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
                if (!$scope.isMobile) {
                    document.getElementById('menu_toggle').click();
                }
            }, error => {
                console.log(error);
            }
        )

        _mS.getData('get', 'DocumentoElectronico/GetDataForm', null, true).then(response => {
            const results = JSON.parse(response.payload) || [];

            $scope.estadoServicios = results[0];
            $scope.establecimientos = results[1];
            $scope.tempPuntosEmision = results[2];
        })
    }
    $scope.initiload()


    $scope.resultRangeFilter = function (item) {
        $scope.dataSearch.fechaInicio = item.startDate,
        $scope.dataSearch.fechaFin = item.endDate
        $scope.getComprobantes();
    }

    $scope.onchangeEstablecimiento = () => {
        try {
            $scope.comprobantes = []
            $scope.dataSearch.checKboxPuntoEmision = false;
            $scope.dataSearch.ptoEmi = null;

            if ([null, undefined, ""].includes($scope.codEstab_Asig)) {
                $scope.dataSearch.checkBoxEstab = false;

            } else {
                $scope.dataSearch.checkBoxEstab = true;

                let dataEstab = $scope.establecimientos.find(item => item.codEstab_Asig === $scope.codEstab_Asig);
                $scope.dataSearch.estab = dataEstab.estab;
                $scope.puntosEmision = $scope.tempPuntosEmision.filter(item => item.codEstab_Asig === $scope.codEstab_Asig);
            }
            $scope.getComprobantes();
        } catch (error) {
            console.log(error);
        }
    }


    $scope.onchangePuntoEmision = () => {
        if ([null, undefined, ""].includes($scope.dataSearch.ptoEmi)) {
            $scope.dataSearch.checKboxPuntoEmision = false;
        } else {
            $scope.dataSearch.checKboxPuntoEmision = true;
        }
        $scope.getComprobantes();
    }

    $scope.onSelectTipoDoc = () => {
        $scope.comprobantes = [];
        $scope.modelCustomerProvider = null;
        $scope.dataSearch.isSearchCustomerProvider = false;

        if ([null, undefined, ""].includes($scope.dataSearch.codDoc)) {
            $scope.dataSearch.checkBoxComprobante = false;
        } else {
            $scope.dataSearch.checkBoxComprobante = true;
        }
        $scope.getComprobantes();
    }

    $scope.onChangeEstado = () => {
        if ([null, undefined, ""].includes($scope.dataSearch.codEstado)) {
            $scope.dataSearch.checkBoxEstadoServicio = false;
        } else {
            $scope.dataSearch.checkBoxEstadoServicio = true;
        }
        $scope.getComprobantes();
    }


    $scope.searchCustomerProvider = function (textSearch) {
        try {
            $scope.dataSearch.identificacionReceptor = null;
            $scope.dataSearch.isSearchCustomerProvider = false

            if (['01', '06', '04'].includes($scope.dataSearch.codDoc)) {
                return _commonSvc.clienteSearch(textSearch).then(response => {
                    return response.map(item => ({
                        idClienteProveedor: item.idCliente,
                        nameCustomerProvider: item.nombreFiscal,
                        identificacionReceptor: item.numeroIdentificacion
                    }))
                })
            } else {
                return _commonSvc.proveedorSearch(textSearch).then(response => {
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
        $scope.dataSearch.isSearchCustomerProvider = false;
        $scope.dataSearch.identificacionReceptor = null;
        $scope.getComprobantes();
    }

    $scope.searchUser = function (textSearch) {
        try {
            $scope.dataSearch.isSearchUser = false;

            let query = {
                busqueda: textSearch,
                idRol: decodeToken.idUsuarioRol
            }
            return _commonSvc.usuarioSearch(query)
        } catch (error) {
            console.log(error);
        }
    }

    $scope.onSelectedUser = function (user) {
        $scope.dataSearch.isSearchUser = true;
        $scope.modelUser = user.nombreCompleto;
        $scope.dataSearch.idUsuario = user.idUsuario;
        $scope.getComprobantes();
    }

    $scope.clearUserSearch = function () {
        $scope.modelUser = null;
        $scope.dataSearch.isSearchUser = false;
        $scope.dataSearch.idUsuario = null;
        $scope.getComprobantes();
    }

    $scope.pagechanged = function() {
        $scope.getComprobantes();
    }

    $scope.changePageSize = function() {
        $scope.dataSearch.pageIndex = 1;
        $scope.getComprobantes();
    }



    $scope.onSelectComprobante = (item) => {

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
                _tS.toastr('warning', 'No Disponible')
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

            _commonSvc.getReportDynamic({
                parameters,
                format
            })
        } catch (error) {

            console.log(item);
        }
    }


    $scope.downloadXml = (item) => {
        try {
            _mS.getFile('get', 'DocumentoElectronico/GetXmlSri/' + item.idDocumentoElectronico, null, true).then(response => {
                let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
                fileName = fileName.replace('"', "")
                let serverData = new Blob([response.data], { type: response.headers()['content-type'] })
                FileSaver.saveAs(serverData, fileName)
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(item);
        }
    }


    $scope.getDetalleDoc = async (item) => {
        try {
            const tipoDoc = $scope.tiposDocumento.find(doc => doc.codigoSri === item.codDoc);

            _commonSvc.viewDetailDocument({
                id: item.idDocumento,
                codigoDocumento: tipoDoc.codigo,
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
                _tS.toastr('warning', 'Seleccione al menos un comprobante');
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
                    _mS.getData('put', 'DocumentoElectronico/' + item.idDocumentoElectronico, null, true).then(response => {
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
            } = _nombreModalConst.common;
            const {
                ComprobanteErrorCtrl
            } = await import('./../../modal/' + MODAL_COMPROBANTE_ERROR_CTRL);

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
            const {
                MODAL_SEND_MAIL_CTRL,
                MODAL_STATUS_MAIL_CSHTML
            } = _nombreModalConst.common;
            const {
                StatusEmail
            } = await import(MODAL_SEND_MAIL_CTRL);
            _modalSvc.openModalCustom({
                controller: StatusEmail,
                template: MODAL_STATUS_MAIL_CSHTML,
                size: 'xl',
                params: item,
                isRenderRazorPartial: true
            })
        } catch (error) {

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
            _mS.getData('put', 'DocumentoElectronico/' + item.idDocumentoElectronico, null, true).then(response => {
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
        if (item.versionComp == '2.0.0') {
            location.href = '/RetencionAts/Index?id=' + item.idDocumentoElectronico
        } else {
            _tS.toastr('warning', 'No disponible')
        }
    }
    $scope.askToCancel = (item) => {
        try {
            if (item.codDoc != '07') {
                _tS.toastr('info', 'Aun no disponible')
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
        try {
            let url = '',
                data = {},
                forApi = false
            switch (item.codDoc) {
                case '01':

                    break
                case '07':
                    if (item.versionComp == '2.0.0') {
                        url = 'RetencionAts/Cancel/' + item.idDocumentoElectronico
                        forApi = true
                    }
                    break

                default:
                    break
            }
            _mS.getData('put', url, null, forApi).then(
                response => {
                    if (response.code == '1') {
                        _tS.toastr('success', response.message)
                        setTimeout(() => {
                            $scope.getComprobantes()
                        }, 3000)
                    }
                    if (response.code == '0') {
                        _tS.toastr('warning', response.message)
                    }
                }, error => {
                    console.log(error)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    $scope.refresh = () => {
        $window.location.href = '/DocumentoElectronico/Index';
    }
}