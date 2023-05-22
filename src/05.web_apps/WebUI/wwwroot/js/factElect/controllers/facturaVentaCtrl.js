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
    'toastService',
    'formulario'    
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
    _tS, 
    _fS    
) {
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if (accion === null) {
    //     location.href = "/Home/Index";
    //     return
    // } else {
    //     $scope.accion = accion[0]; 
    // }



    const TIPO_DOC_FV = _commonSvc.tipoDoc['FV'];
    const PERMISSION_KEY_ACTIONS = {
        E: 'E',
        A: 'A',
    }


    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10000
    }

    $scope.clienteFiltro = {}
    $scope.usuarioSearchFiltro = {};
    $scope.mes = new Date().getMonth() + 1;


    $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento 
    $scope.parametersPrint = {};


    //Remove Focus new invoice 
    let btnNewInvoice = document.getElementById("btnNewInvoice");
    btnNewInvoice.addEventListener("click", () => {
        btnNewInvoice.blur();
    })





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
            if ($scope.dataSearch.checkBoxCliente ||
                $scope.dataSearch.checkBoxFecha ||
                $scope.dataSearch.checkBoxUsuario ||
                $scope.dataSearch.checkBoxEstado) {
                    $scope.dataSearch.checkBoxDefault = false
            } else {
                $scope.dataSearch.checkBoxDefault = true;
            }
                
            showLoader();
            $scope.facturas = [];
            facturaSvc.getAll($scope.dataSearch).then(response=>{
                $scope.facturas = response;
                $scope.cloneFacturas = JSON.parse(JSON.stringify($scope.facturas));
                $scope.getTotales();
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



    $scope.initiload = () => {
        _commonSvc.getEstabAsign().then(response => {
            $scope.establecimientos = response;
            let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
            $scope.dataSearch.codEstab = codEstab;
            $scope.getFacturas();
        })
    }
    $scope.initiload();



    $scope.validateOperationPrintAndPayment = (result) => {
        //Verificamos 
        $scope.isRegister = result.isRegister;
        $scope.isPrintDocument = result.printerAutomatic;

        $scope.parametersPrint = {
            ...result.data,
            idDocument: result.data.id,
            codigo: 'RFPT',
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


    $scope.openModalFiltro = async () => {
        let {
            MODAL_FILE_CTRL,
            MODAL_FILTRO
        } = _nombreModalConst.factura_venta;
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
                $scope.getFacturas();
            }
        })
    }

    //Filtro de Retencion 
    $scope.filterLocalRetencion = function () {

        let facturas = JSON.parse(JSON.stringify($scope.cloneFacturas));

        if ($scope.dataSearch.filterCheckedLocal === "SR") {
            facturas = facturas.filter(val => val.nroRetencion == "SN");
        }
        if ($scope.dataSearch.filterCheckedLocal === "CR") {
            facturas = facturas.filter(val => val.nroRetencion !== "SN");
        };

        if ($scope.dataSearch.filterCheckedLocal === "CNC") {
            facturas = facturas.filter(val => val.nroNotaCredito !== "SN");
        }

        if ($scope.dataSearch.filterCheckedLocal === "SNC") {
            facturas = facturas.filter(val => val.nroNotaCredito == "SN");
        }
        // facturas = facturas.filter(item=>item.estadoFinanciero!=='Anulada');
        $scope.facturas = $filter("filter")(facturas, $scope.textSearch);
        $scope.getTotales();
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

        let response = await $scope.getDataDocumento(item.idFactura);

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

            let response = await $scope.getDataDocumento(item.idFactura);

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

            let response = await $scope.getDataDocumento(item.idFactura);

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
                facturaSvc.delete(item.idFactura).then(response => {
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
            id: item.idFactura,
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
                ...item,
                id: item.idFactura,
                codEstab: item.codEstab,
                nroFactura: item.nroFactura,
                esContado: item.tipo,
                razonSocialComprador: item.nombreFiscal,
                identificacionComprador: item.nroIdentificacion,
                nroDocumento: item.nroFactura,
            },
            TIPO_DOC: TIPO_DOC_FV
        }

        if (params.data.esContado) {
            $scope.openModalRapido(params);
        } else {
            $scope.openModalCobroDocumento(params)
        }
    }




    $scope.openModalCobroDocumento = async (params) => {
        let {
            MODAL_FILE_CTRL,
            MODAL_COBRO_DOCUMENTO
        } = _nombreModalConst.cobro;
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

        let {
            MODAL_FILE_CTRL,
            MODAL_COBRO_RAPIDO
        } = _nombreModalConst.cobro;
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

    $scope.openModalCobro = ({
        controller,
        template,
        size = 'lg',
        params
    }) => {
        let $modalRef = _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params,
            keyboard: true
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
            let {
                MODAL_FILE_CUOTA,
                MODAL_CUOTA_VENTA
            } = _nombreModalConst.cobro;
            let controller = (await import('./../../' + MODAL_FILE_CUOTA))[MODAL_CUOTA_VENTA['controller']];
            let template = MODAL_CUOTA_VENTA['template'];

            let params = {}

            let response = await _mS.getData('get', `/CuotaXCobrar/GetByDocument?idComprobante=${item.idFactura}&idTipoDoc=${TIPO_DOC_FV.idTipoDocumento}`)

            if (response.id === "0") {
                _fS.sweetAlert('warning', response.message, response.titleSms)
                return
            }

            if (response.id === "1") {
                params = {
                    cuotas: response.data,
                    data: {
                        ...item,
                        id: item.idFactura,
                        codEstab: item.codEstab,
                        nroFactura: item.nroFactura,
                        esContado: item.tipo,
                        razonSocialComprador: item.nombreFiscal,
                        identificacionComprador: item.nroIdentificacion,
                        nroDocumento: item.nroFactura,
                    },
                    TIPO_DOC: TIPO_DOC_FV
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
                    $scope.getFacturas();
                }
            })
        } catch (error) {

        }
    }


    $scope.openModalHistorialCobro = async (item) => {
        try {
            let {
                MODAL_FILE_HISTORIAL_COBRO,
                MODAL_HISTORIAL_COBRO
            } = _nombreModalConst.cobro;
            let controller = (await import('./../../' + MODAL_FILE_HISTORIAL_COBRO))[MODAL_HISTORIAL_COBRO['controller']];
            let template = MODAL_HISTORIAL_COBRO['template'];
            let params = {}


            await _mS.getData('get', `/ComprobanteIngreso/GetByDocument?idTipoDocumento=${TIPO_DOC_FV.idTipoDocumento}&idComprobante=${item.idFactura}`).then(response => {
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
                            id: item.idFactura,
                            codEstab: item.codEstab,
                            nroFactura: item.nroFactura,
                            esContado: item.tipo,
                            razonSocialComprador: item.nombreFiscal,
                            identificacionComprador: item.nroIdentificacion,
                            nroDocumento: item.nroFactura,
                        },
                        TIPO_DOC: TIPO_DOC_FV
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
            idDocument: item.idFactura,
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