

app.controller('documentoElectronicoCtrl', documentoElectronicoCtrl)

documentoElectronicoCtrl.$inject = ['$scope',
                                    'mainService',
                                    'commonService',
                                    'modalService',
                                    'nombreModal',
                                    'formulario',
                                    'toastService',
                                    '$window'
                                ]

function documentoElectronicoCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, $window) {
    $scope.comprobantes = [];
    $scope.selectedComprobantes = [];
    $scope.isMobile = true;


    $scope.establecimientos = [];
    $scope.puntosEmision = [];
    $scope.tempPuntosEmision = [];
    $scope.codEstab_Asig = null;

    //DETECT MOBILE DEVICE
    $scope.detectMobilDevice = function () {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            Swal.fire(
                'Dispositivo Movil Detectado!',
                'Para una mejor comodidad, le recomendamos usar una Laptop o PC.',
                'success'
            )
        } else {
            $scope.isMobile = false
        }
    }
    $scope.detectMobilDevice()


    const tipo = document.getElementById("tipo").value


    //Filtro 
    $scope.dataSearch = {};
    $scope.dataSearch.isCurrentDate = false;
    $scope.dataSearch.checkBoxDate = true;
    // $scope.meses = _fS.meses();
    // $scope.dataSearch.mes = new Date().getMonth() + 1;

    let thisMoment = moment()
    // let endOfMonth = moment(thisMoment).endOf('month')
    // let startOfMonth = moment(thisMoment).startOf('month')
    
    //https://www.daterangepicker.com/
    $scope.dateRangePicker = {
        date: { startDate: thisMoment, endDate: thisMoment },
        picker: null,
        options: {
            pickerClasses: 'custom-display', //angular-daterangepicker extra
            buttonClasses: 'btn',
            applyButtonClasses: 'btn-success',
            cancelButtonClasses: 'btn-danger',
            locale: {
                applyLabel: "Aplicar",
                cancelLabel: 'Cancelar',
                customRangeLabel: 'Rango Personalizado',
                separator: ' - ',
                format: "YYYY-MM-DD", //will give you 2017-01-06
                //format: "D-MMM-YY", //will give you 6-Jan-17
                //format: "D-MMMM-YY", //will give you 6-January-17
            },
            ranges:  {
                'Hoy': [moment(), moment()],
                'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                'Este Mes': [moment().startOf('month'), moment().endOf('month')],              
            },
            eventHandlers: {
                'apply.daterangepicker': function (event, picker) {
                    $scope.getComprobantes()
                    console.log('applied')
                }
            }
        }
    };


    $scope.getComprobantes = () => {
        try {
            showLoader();
            $scope.comprobantes = [];

            let data = {}


            // if ($scope.dataSearch.checkBoxDate || $scope.checkBoxEstadoServicio || $scope.dataSearch.checkBoxComprobante) {
            //     $scope.dataSearch.isCurrentDate = false;
            // } else {
            //     $scope.dataSearch.isCurrentDate = true;
            // }

            if (tipo > 0) {
                data = { tipo }
            } else {
                data = $scope.dataSearch;
                
                data.dateStart = $scope.dateRangePicker.date.startDate
                data.dateEnd = $scope.dateRangePicker.date.endDate
            }

            console.log(data)

            $scope.comprobantes = [];
            _mS.getData('get', 'DocumentoElectronico/' + JSON.stringify(data), null, true).then(
                response => {

                    if (response.code === "0") {
                        hideLoader()
                        $scope.comprobantes = [];
                        console.log(response)
                        return
                    }
                    if (!$scope.isMobile) {
                        document.getElementById('menu_toggle').click();
                    }
                    $scope.comprobantes = JSON.parse(response.payload)[0] || [];
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
                if (!$scope.isMobile) {
                    document.getElementById('menu_toggle').click();
                }
            }, error => {
                console.log(error);
            }
        )

        _mS.getData('get', 'DocumentoElectronico/GetDataForm', null, true).then(response => {
            const results = JSON.parse(response.payload) || [];
            console.log(results);            
            $scope.estadoServicios = results[0];
            $scope.establecimientos = results[1];
            $scope.tempPuntosEmision = results[2];            
        })
    }
    $scope.initiload()

    $scope.openModalFiltro = () => {
        $("#modalFiltroComprobante").modal('show');
    }

    $scope.onchangeEstablecimiento = () => {
        try {
            $scope.comprobantes = []
            $scope.dataSearch.checKboxPuntoEmision = false;
            $scope.dataSearch.ptoEmi = null;
            
            if($scope.codEstab_Asig){
                $scope.dataSearch.checkBoxEstab = true;

                let dataEstab = $scope.establecimientos.find(item=>item.codEstab_Asig===$scope.codEstab_Asig);            
                $scope.dataSearch.estab = dataEstab.estab;            
                $scope.puntosEmision = $scope.tempPuntosEmision.filter(item=>item.codEstab_Asig===$scope.codEstab_Asig);
                
            }else{
                $scope.dataSearch.checkBoxEstab = false;
            }
            $scope.getComprobantes();        
        } catch (error) {
            console.log(error);
        }
    }


    $scope.onchangePuntoEmision = ()=>{
        if($scope.dataSearch.ptoEmi){
            
            $scope.dataSearch.checKboxPuntoEmision = true;
        }else{
            $scope.dataSearch.checKboxPuntoEmision = false;
        }
        $scope.getComprobantes();
    }

    $scope.onSelectTipoDoc = ()=>{
        $scope.comprobantes = []
        if($scope.dataSearch.codDoc){
            $scope.dataSearch.checkBoxComprobante = true;
        }else{
            $scope.dataSearch.checkBoxComprobante = false;
        }
        $scope.getComprobantes();
    }

    $scope.onChangeEstado = ()=>{
        if([null, undefined, ""].includes($scope.dataSearch.codEstado)){
            $scope.dataSearch.checkBoxEstadoServicio = false;
        }else{
            $scope.dataSearch.checkBoxEstadoServicio = true;
        }
        $scope.getComprobantes();
    }

    // $scope.onChangeFechaFiltro = () => {
    //     $scope.dataSearch.mes = new Date().getMonth() + 1;
    //     $scope.getFechaInicioFinFilter()
    // }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro AVanzado
    // $scope.getFechaInicioFinFilter = () => {
    //     let { fechaInicio, fechaFin } = _fS.getFechaInicioFinFilter($scope.dataSearch.mes);
    //     $scope.dataSearch.dateStart = fechaInicio;
    //     $scope.dataSearch.dateEnd = fechaFin;
    // }


    // $scope.searchComprobante = () => {

    //     if ($scope.dataSearch.checkBoxComprobante) {
    //         if (!$scope.dataSearch.codDoc) {
    //             _tS.toastr('warning', 'Seleccione el Tipo Documento');
    //             return
    //         }
    //     }

    //     if ($scope.checkBoxEstadoServicio) {
    //         if (!dataSearch.codEstado) {
    //             _tS.toastr('warning', 'Seleccione el Estado Servicio');
    //             return
    //         }
    //     }

    //     if ($scope.dataSearch.checkBoxDate) {
    //         if (!$scope.dataSearch.dateStart) {
    //             _tS.toastr('warning', 'Seleccione Fecha Inicio');
    //             return
    //         }

    //         if (!$scope.dataSearch.dateEnd) {
    //             _tS.toastr('warning', 'Seleccione Fecha Fin');
    //             return
    //         }

    //         if ($scope.dataSearch.dateEnd < $scope.dataSearch.dateStart) {
    //             _tS.toastr('warning', 'Fecha Fin no puede se menor a Fecha Inicio');
    //             return
    //         }
    //     }


    //     $scope.getComprobantes();
    //     $("#modalFiltroComprobante").modal('hide');
    // }


    $scope.onSelectComprobante = (item) => {

    }



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
                params: item,
                isRenderRazorPartial: true
            })
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
            let url = '', data = {}, forApi = false
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