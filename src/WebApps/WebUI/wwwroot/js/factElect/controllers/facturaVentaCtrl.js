app.controller('facturaVentaCtrl', facturaVentaCtrl)

facturaVentaCtrl.$inject = [    
    '$scope',
    '$filter',
    'mainService',
    'commonService',
    'documentoVentaService',
    'facturaService',
    'modalService',
    'nombreModal',
    'nombreModalContabilidad',
    'toastService',
    'formulario',
    'decodeToken'    
]

function facturaVentaCtrl(
    $scope, 
    $filter, 
    _mS, 
    _commonSvc, 
    _docVentaSvc, 
    facturaSvc, 
    _modalSvc, 
    _nombreModalConst, 
    nombreModalContabilidad,
    _tS, 
    _fS    ,
    decodeToken
) {
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if (accion === null) {
    //     location.href = "/Home/Index";
    //     return
    // } else {
    //     $scope.accion = accion[0]; 
    // }

    $scope.typeSend = 'SRI';


    const TIPO_DOC_FV = _commonSvc.tipoDoc['FV'];
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

    $scope.cliente = {
        nombreCliente: ''
    }


    $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento 
    $scope.parametersPrint = {};

    let idUsuarioRol = Number(decodeToken.idUsuarioRol)


    //Remove Focus new invoice 
    let btnNewInvoice = document.getElementById("btnNewInvoice");
    btnNewInvoice.addEventListener("click", () => {
        btnNewInvoice.blur();
    })

    //========================Start Filters=================

    $scope.resultRangeFilter = function (item) {
        $scope.dataSearch.fechaInicio = item.startDate,
        $scope.dataSearch.fechaFin = item.endDate
        $scope.getFacturas();
    }

   

    $scope.onKeyupCliente = function(e) {
        if(!$scope.cliente.nombreCliente){
            $scope.dataSearch.idCliente = 0;
        }
    }
    $scope.onSelectCliente = function(item) {
       $scope.dataSearch.idCliente = item.idCliente;
       $scope.getFacturas();
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
        $scope.getFacturas();
    }

    $scope.onClickBtnMore = function () {
        $scope.moreSearchOptions = !$scope.moreSearchOptions;
    }
    

    $scope.searchFilterLocal = function () {
        let facturas = JSON.parse(JSON.stringify($scope.cloneFacturas));
        $scope.facturas = $filter("filter")(facturas, $scope.dataSearch.bySearch);
        $scope.getTotales();
    }

    //=====================Eend Filters=======================





    $scope.getTotales = () => {
        let total = 0,
            totalAbono = 0,
            totalSaldo = 0;
        for (let val of $scope.facturas) {
            if (val.estadoFinanciero !== 'Anulada') {
                total += val.total;
                totalAbono += val.abono;
                totalSaldo += val.saldo;
            }
        };
        $scope.total = _fS.roundNumber(total, 5);
        $scope.totalAbono = _fS.roundNumber(totalAbono, 5);
        $scope.totalSaldo = _fS.roundNumber(totalSaldo, 5);
    }


    

    $scope.getFacturas = function () {

        try {
            let dataSearch = {
                pageIndex: $scope.dataSearch.pageIndex,
                pageSize: $scope.dataSearch.pageSize,
                codEstab: $scope.dataSearch.codEstab,
                checkBoxDefault: false,
                checkBoxCliente: $scope.dataSearch.idCliente > 0,
                byCliente: $scope.dataSearch.idCliente,
                checkBoxFecha: true,
                checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                byUsuario: $scope.dataSearch.byUsuario,
                checkBoxEstado: $scope.dataSearch.byEstado ? true : false,
                byEstado: $scope.dataSearch.byEstado,
                fechaInicio: _fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: _fS.formatDateMoment($scope.dataSearch.fechaFin),
                tipoFecha: 'FE',
                isSearchNroSequential: $scope.dataSearch.nroSecuencial? true: false,
                nroSecuencial: $scope.dataSearch.nroSecuencial
            }
                
            showLoader();
            $scope.facturas = [];
            $scope.getTotales();
            facturaSvc.getAll(dataSearch).then(response=>{
                let {facturas, dataTotals} = response;

                $scope.facturas = facturas;
                $scope.cloneFacturas = JSON.parse(JSON.stringify($scope.facturas));

                //Totales
                $scope.dataSearch.totalRecords = dataTotals.totalRecords;
                $scope.total = _fS.roundNumber(dataTotals.total, 5);
                $scope.totalAbono = _fS.roundNumber(dataTotals.totalAbono, 5);
                $scope.totalSaldo = _fS.roundNumber(dataTotals.totalSaldo, 5);
                // $scope.getTotales();
                hideLoader();
            }).catch(error => {
                hideLoader();
                console.log(error);
            })           
            _commonSvc.getDataFormVenta().then(result => {
                $scope.jsonPermission = JSON.parse(result[9][0].jsonPermission)
            })

        } catch (error) {
            hideLoader();
            console.log(error)
        } 
    }



    $scope.initiload = async function() {
        _commonSvc.getEstabAsign().then(response => {
            $scope.establecimientos = response;
            let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
            $scope.dataSearch.codEstab = codEstab;
            $scope.getFacturas();
        })

        
        $scope.estadoDocumentos = await _commonSvc.getEstadoDocByCodDoc('FV');
    }
    $scope.initiload();

    
    $scope.pagechanged = function () {
        $scope.getFacturas();
    };
    
    $scope.changePageSize = function () {
        $scope.dataSearch.pageIndex = 1;
        $scope.getFacturas();
    };


    $scope.onOrderInvoice = function (item) {
        console.log('test order', item)
        console.log($scope.dataSearch.order)
    }









    $scope.validateOperationPrintAndPayment = (result) => {
        //Verificamos 
        let {isRegister, data} = result;
        $scope.isRegister = isRegister;
        $scope.isPrintDocument = data.printerAutomatic;

        $scope.parametersPrint = {
            ...data,
            codDoc: 'FV',
            idDocument: data.idDocumento,
            codigo: 'RFPT',
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

        $scope.getFacturas();

        //Focus New Invoice
        btnNewInvoice.focus();
    }

    $scope.openModalInvoiceNew = async () => {


        let {
            MODAL_FILE_CTRL,
            MODAL_NUEVO
        } = _nombreModalConst.factura_venta;
        let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
        let template = MODAL_NUEVO['template'];
        let params = {
            dataForm: await _docVentaSvc.initiload(),
            TIPO_REGISTRO: 'NUEVO'
        }

        let modalRef = _modalSvc.openModalCustom({
            controller,
            template,
            size: 'xl',
            params,
            windowClass: 'uibModalFullScreen'
        })

        modalRef.result.then(result => {

            if (typeof result !== 'object') return

            $scope.validateOperationPrintAndPayment(result)
        })


    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */

    $scope.getDataDocumento = (id) => {
        return _commonSvc.getDataTipoDocVenta({
            id,
            codigoDocumento: TIPO_DOC_FV.codigo
        })
    }


    $scope.openModalDetalle = async (item) => {
        let {
            MODAL_FILE_CTRL,
            MODAL_DETALLE
        } = _nombreModalConst.factura_venta;
        let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
        let template = MODAL_DETALLE['template'];

        let response = await $scope.getDataDocumento(item.idDocumento);

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

    $scope.openModalInvoiceEdit = async (item) => {
        try {
            if (item.anulada) {
                _fS.sweetAlert('warning', 'Este documento ya se cuentra anulada');
                return
            }

            let result = await _commonSvc.checkHasPermissionToEditOrDelete(PERMISSION_KEY_ACTIONS.E);
            if (result.code === "2") {
                _commonSvc.requestAuthorizationKey(PERMISSION_KEY_ACTIONS.E);
                return
            }

            showLoader();
            let {
                MODAL_FILE_CTRL,
                MODAL_EDITAR
            } = _nombreModalConst.factura_venta;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
            let template = MODAL_EDITAR['template'];

            let response = await $scope.getDataDocumento(item.idDocumento);

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
                if (typeof result === 'object' && result.isUpdate) {

                    //Actualizar el estado de solicitud en caso de tener 
                    let {
                        additional
                    } = $scope.jsonPermission;
                    if (typeof $scope.jsonPermission === 'object' && additional.requestAuthorizationKey.requestKey) {
                        _commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.E);
                    }

                    $scope.getFacturas();
                }
            })
        } catch (error) {

            console.log(error)
        } finally {
            hideLoader();
        }
    }


    $scope.openModalInvoiceDuplicate = async (item) => {
        try {
            showLoader();
            let {
                MODAL_FILE_CTRL,
                MODAL_DUPLICAR
            } = _nombreModalConst.factura_venta;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DUPLICAR['controller']];
            let template = MODAL_DUPLICAR['template'];

            let response = await $scope.getDataDocumento(item.idDocumento);

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

    $scope.openModalInvoiceParam = ({
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

            if (typeof result === 'object') {
                $scope.getFacturas();
            }
        })

    }


    $scope.askToDelete = async (item) => {
        try {

            if (item.anulada) {
                _fS.sweetAlert('warning', 'Este documento ya se cuentra anulada');
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
                title: '<small>Anular Factura?</small>',
                html: `<small>Esta Ud. seguro/a de anular este Factura de Venta <b>N° ${item.nroFactura}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false
            })

            if (isConfirmed) {
                showLoader();
                facturaSvc.delete(item.idDocumento).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        _fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        hideLoader();
                        _fS.sweetAlert('success', response.message, response.titleSms, 1000);

                        //Una vez actualizado el documento 
                        let {
                            additional
                        } = $scope.jsonPermission;
                        if (typeof $scope.jsonPermission === 'object' && additional.requestAuthorizationKey.requestKey) {
                            _commonSvc.updateRequestKey(PERMISSION_KEY_ACTIONS.A);
                        }


                        $scope.getFacturas();
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }



    $scope.getReport = function (item) {
        showLoader();
        let format = 'pdf';
        let dataParms = {
            id: item.idDocumento,
            codEstab: item.codEstab,
            codigo: 'RF',
            format,
        }

        let parameters = {
            dataParams: JSON.stringify(dataParms)
        }

        _commonSvc.getReportDynamic({
            parameters,
            format
        })
    }




    //--------------------------------------------------COBROS----------

    $scope.opcionCobro = (item) => {
        if (item.estadoFinanciero === "Cobrada") {
            _fS.sweetAlert('warning', '<small>Este documento ya se encuentra cobrada!</small>')
            return
        }

        let params = {
            data: {
                ...item
            }
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

    $scope.openModalCobro = ({
        controller,
        template,
        size = 'lg',
        params,
        windowClass
    }) => {
      
        let $modalRef = _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params,
            keyboard: true,
            windowClass,
            isRenderRazorPartial: true
        })

        $modalRef.result.then(result => {

            if (typeof result == 'object' || $scope.isRegister) {
                $scope.getFacturas();
            }

            //Cuando el documento es Nuevo o Duplicado 
            if ($scope.isPrintDocument == 1) {
                //    $scope.getFacturas();
                _commonSvc.getPrinter(JSON.stringify($scope.parametersPrint))
                $scope.isPrintDocument = null;
            }

            //Focus New Invoice
            btnNewInvoice.focus();
            $scope.isRegister = null;
            $scope.isPrintDocument = null;
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
            modalRef.result.then(result=>{
                if(typeof result==='object' && result.isReload){
                    $scope.getFacturas();
                }
            })
        } catch (error) {
            console.log(error)
        }
    }


    //----------------------------Detalle Comprobante Ingreso ---------------------
    $scope.openModalHistorialCobro = async (ev, item) => {        
        try {
            if(['PE'].includes(item.codEstado)) return
            
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
            idDocument: item.idDocumento,
            idTipoDocumento: item.idTipoDocumento,
            codEstab: item.codEstab,
            codDoc: TIPO_DOC_FV.codigo,
            nroIdentificacion: item.nroIdentificacion,
        }

        _commonSvc.askToPrint({
            parameters: JSON.stringify(parameters)
        })

    }






}