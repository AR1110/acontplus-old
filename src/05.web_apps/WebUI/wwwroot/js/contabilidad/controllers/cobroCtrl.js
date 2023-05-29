(function(){

    'use strict';

    app.controller('cobroCtrl', cobroCtrl);

    cobroCtrl.$inject = [
        '$scope', 
        'mainService', 
        'commonService', 
        'modalService', 
        'nombreModal',
        'nombreModalContabilidad' ,
        'formulario', 
        'toastService', 
        'decodeToken',
        '$mdDialog'
    ]

    function cobroCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, nombreModalContabilidad, _form, _tS, decodeToken, $mdDialog) {

        // let accion = JSON.parse(localStorage.getItem("accion"));  
        // if(accion===null){
        //     location.href ="/Home/Index";
        //     return
        // }else{
        //     $scope.accion = accion[0];
        // }

        const TIPO_DOC = _commonSvc.tipoDoc['FC'];
        let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)


        //Filtro y Pagination 
        $scope.meses = _form.meses();
        $scope.mes = new Date().getMonth() + 1;



        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000
        }

        
        $scope.openModalCobroLote = async function() {
            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CL'];
                let template = nombreModalContabilidad.COBRO.templates['CL']; 
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = _modalSvc.openModalCustom({
                    controller,
                    template,
                    params: {
                    },
                    size:'xl',
                    isRenderRazorPartial: true
                })  
                modalRef.result.then(result=>{
                    if(typeof result==='object'){
                        $scope.getCobros();
                    }
                })         
            } catch (error) {
                console.log(error)
            }
        }






        $scope.getCobros = function () {
            try {
                showLoader();
                $scope.cobros = [];
                _mS.getData('get', '/ComprobanteIngreso/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        console.warn(response)
                    }
                    if (response.id === "1") {
                        hideLoader();
                        $scope.cobros = JSON.parse(response.payload) || [];
                    }

                }).catch(error => {
                    hideLoader();
                    console.error(error)
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.initiload = () => {
            _commonSvc.getEstabAsign().then(response => {
                $scope.establecimientos = response
                let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
                $scope.dataSearch.codEstab = codEstab;
                $scope.getCobros();
            })
        }
        $scope.initiload();






        $scope.openModalFiltro = function () {
            $("#modalCobroFiltro").modal('show');
        }


        $scope.clienteSearch = (textSearch) => {
            return _commonSvc.clienteSearch(textSearch);
        }

        $scope.onChangeFechaFiltro = () => {
            $scope.mes = new Date().getMonth() + 1;
            $scope.getFechaInicioFinFilter($scope.mes)
        }

        //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Buscador AVanzado
        $scope.getFechaInicioFinFilter = (mes) => {
            let {
                fechaInicio,
                fechaFin
            } = _form.getFechaInicioFinFilter(mes);
            $scope.dataSearch.fechaInicio = fechaInicio;
            $scope.dataSearch.fechaFin = fechaFin;
        }

        $scope.onKeyupSearchClienteFilter = () => {
            if (_form.campo($scope.selectedClienteFilter)) {
                $scope.dataSearch.byPersona = null;
            }
        }

        $scope.selectedClienteFiltroChange = (item) => {
            $scope.dataSearch.byPersona = item.numeroIdentificacion
        }

        $scope.onKeyupSearchEmpleadoFiltro = () => {
            if (_form.campo($scope.selectedEmpleadoFiltro)) {
                $scope.dataSearch.byPersona = null;
            }
        }

        $scope.searchEmpleadoFilter = (textSearch) => {
            return _mS.getData('get', '/Empleado/Search?busqueda=' + textSearch).then(response => {
                return response.data;
            })
        }


        $scope.selectedEmpleadoFiltroChange = (item) => {
            $scope.dataSearch.byPersona = item.nroIdentificacion;
        }

        //------------------------Usuario-----------------------------------------------
        $scope.dataUsuarioSearch = {}
        $scope.usuarioSearch = (textSearch) => {
            return _commonSvc.usuarioSearch({
                idRol: idUsuarioRol,
                busqueda: textSearch
            })
        }

        $scope.onKeyupUsuarioSearchFilter = () => {
            if (_form.campo($scope.dataUsuarioFilter.nombreCompleto)) {
                $scope.dataSearch.byUsuario = null;
            }
        }

        $scope.selectedUsuarioSearchFilter = (item) => {
            $scope.dataSearch.byUsuario = item.idUsuario;
        }

        $scope.onChangeDocumentoFiltro = () => {
            $scope.dataSearch.checkBoxPersona = false;
        }

        $scope.onChangeTipoDocumento = () => {
            $scope.dataSearch.byComprobante = null
            $scope.dataSearch.byTipoDocumento = null;

            if ($scope.dataSearch.tipoDocumento === 'FV') {
                $scope.getFacturas();
            }

            if ($scope.dataSearch.tipoDocumento === 'NE') {
                $scope.getNotaEntregas();
            }

        }

        //Get Facturas 
        $scope.getFacturas = () => {
            try {
                showLoader();
                $scope.facturas = [];
                _mS.getData('get', '/FacturaVenta/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
                    if (response.id === "0") {
                        hideLoader();
                        _form.sweetAlert('warning', response.message, response.titleSms);
                        return
                    }
                    $scope.facturas = JSON.parse(response.data) || [];
                    hideLoader();
                }).catch(error => {
                    hideLoader();
                    const msg = error.config ? error.config.url : error;
                    toastr.error(msg)
                })
            } catch (error) {
                hideLoader();
            }
        }

        $scope.getNotaEntregas = () => {
            try {
                showLoader();
                $scope.notaEntregas = [];
                _mS.getData('get', '/NotaEntrega/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
                    if (response.id === "0") {
                        hideLoader();
                        Swal.fire({
                            icon: 'warning',
                            html: `<small>${response.message}</small>`
                        })
                        return
                    }

                    $scope.notaEntregas = JSON.parse(response.data) || [];
                    hideLoader();
                }).catch(error => {
                    hideLoader();
                    const msg = error.config ? error.config.url : error
                    toastr.error(msg)
                })
            } catch (error) {
                hideLoader();
            }
        };



        $scope.onChangeSelectDocumentoFiltro = (item) => {
            $scope.dataSearch.byTipoDocumento = item.idTipoDocumento;

            if ($scope.dataSearch.tipoDocumento === 'FV') {
                $scope.dataSearch.byComprobante = item.idFactura;
            }

            if ($scope.dataSearch.tipoDocumento === 'NE') {
                $scope.dataSearch.byComprobante = item.idNotaEntrega;
            }
        }

        $scope.buscarCobro = () => {
            if ($scope.dataSearch.checkBoxFecha) {
                if (_form.campo($scope.dataSearch.fechaInicio)) {
                    toastr.warning('Seleccione la Fecha de Inicio');
                    return
                }
                if (_form.campo($scope.dataSearch.fechaFin)) {
                    toastr.warning('Seleccione la Fecha Fin');
                    return
                }
            }

            if ($scope.dataSearch.checkBoxPersona) {
                if (_form.campo($scope.dataSearch.byTipoPersona)) {
                    toastr.warning('Seleccione el Tipo Persona (Cliente/Empleado)');
                    return
                }

                if (_form.campo($scope.dataSearch.byPersona)) {
                    toastr.warning('Seleccione la Persona');
                    return
                }
            }

            if ($scope.dataSearch.checkBoxUsuario) {
                if (_form.campo($scope.dataSearch.byUsuario)) {
                    toastr.warning('Seleccione el Usuario');
                    return
                }
            }

            if ($scope.dataSearch.checkBoxEstado) {
                if (_form.campo($scope.dataSearch.byEstado)) {
                    toastr.warning('Seleccione el Estado');
                    return
                }
            }

            if ($scope.dataSearch.checkBoxDocumento) {
                if (_form.campo($scope.dataSearch.tipoDocumento)) {
                    toastr.warning('Seleccione el Tipo Documento');
                    return
                }

                if (_form.campo($scope.dataSearch.byTipoDocumento)) {
                    toastr.warning('Seleccione el Documento');
                    return
                }


            }

            $scope.getCobros();
            $("#modalCobroFiltro").modal('hide');

        }




        $scope.openModalDetalle = async (item) => {
            try {
                showLoader();
                let {
                    MODAL_FILE_CTRL,
                    MODAL_DETALLE
                } = _nombreModalConst.factura_compra;
                let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
                let template = MODAL_DETALLE['template'];

                let response = await _commonSvc.getDataTipoDocCompra({
                    id: item.idFacturaCompra,
                    codigoDocumento: TIPO_DOC.codigo
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
                console.log(error)
            } finally {
                hideLoader();
            }
        }

    

        $scope.openModalParam = async ({
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
                    $scope.getCobros()
                }
            })
        }



        $scope.askToDelete = async (item) => {

            let {
                isConfirmed,
                value
            } = await Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de Anular este registro ahora?</small>',
                input: 'text',
                inputPlaceholder: 'Ingrese la observación',
                showConfirmButton: true,
                confirmButtonText: 'Si, anular',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Ingrese la Observación!'
                    }
                }
            })

            if (isConfirmed) {
                _mS.getData('delete', `/ComprobanteIngreso/Anular?idComprobanteIngreso=${item.idComprobanteIngreso}&observacion=${value}`).then(response => {
                    if (response.id == "0") {
                        _tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.id == "1") {
                        _tS.toastr('success', response.message, response.titleSms);
                        $scope.getCobros();
                    }
                });
            }
        }



        //----------------------------Detalle Comprobante Ingreso ---------------------
        $scope.openModalCobroDetalle = async function (ev, item) {
            try {
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
        };


        //Reporte 
        $scope.getReport = function (item) {
            let formatType = 'pdf'
            let parameters = {
                reportParams: JSON.stringify({
                    codigo: "RCINGR",
                    format: formatType,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify({
                    idComprobanteIngreso: item.idComprobanteIngreso,
                    codEstab: item.codEstab
                })
            }

            _commonSvc.getReport({
                parameters,
                formatType
            })
        }

    }

})(window.angular)