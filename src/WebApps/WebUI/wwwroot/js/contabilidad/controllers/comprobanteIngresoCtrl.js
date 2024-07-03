(function(){

    'use strict';

    app.controller('comprobanteIngresoCtrl', [
        '$scope',
        '$filter',
        '$injector', 
        
        function comprobanteIngresoCtrl($scope, $filter, $injector) {
        let commonSvc = $injector.get('commonService')
        let modalSvc = $injector.get('modalService')
        let nombreModalContabilidad = $injector.get('nombreModalContabilidad')
        let fS = $injector.get('formulario');
        let tS = $injector.get('toastService');
        let compIngresoSvc = $injector.get('comprobanteIngresoService');


        //Filtro y Pagination  
        $scope.moreSearchOptions = false;

        $scope.tiposPersona = [
            { codigo: 1, descripcion: 'Cliente' },
            { codigo: 2, descripcion: 'Empleado' },
        ]

        $scope.tiposDoc = [
            { codigo: 'FV', descripcion: 'Factura Venta' },
            { codigo: 'NE', descripcion: 'Nota Entrega' },
        ]

        $scope.showCliente = false;
        $scope.showEmpleado = false;

        $scope.searchCliente = {
            nombreCliente: ''
        }
        $scope.searchEmpleado = {
            nombreCompleto: ''
        }

        $scope.searchUser = {
            nombreCompleto: ''
        }

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25, 
            maxSize: 5
        }
        $scope.recordsQuantity = [25,50,100];

        $scope.typeSend = 'GenericFile';
        $scope.typeSendMail = 'N';


        $scope.openModalCobroLote = async function () {
            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CL'];
                let template = nombreModalContabilidad.COBRO.templates['CL'];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    params: {
                    },
                    size: 'xl',
                    isRenderRazorPartial: true
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getCobros();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }


        //Filters 
        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
            $scope.filterValidation();
        }

        $scope.onKeyupUser = function () {
            if (!$scope.searchUser.nombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }
        $scope.onSelectUser = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            $scope.filterValidation();
        }



        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.onChangePersona = function () {
            $scope.showCliente = false;
            $scope.showEmpleado = false;
            $scope.dataSearch.nroIdentificacion = null;
            if ($scope.dataSearch.byTipoPersona === 1) {
                $scope.showCliente = true;
                $scope.showEmpleado = false;
            }
            if ($scope.dataSearch.byTipoPersona === 2) {
                $scope.showCliente = false;
                $scope.showEmpleado = true;
            }
        }

        //====================Cliente===========
        $scope.onKeyupCliente = function () {
            if (!$scope.searchCliente.nombreCompleto) {
                $scope.dataSearch.nroIdentificacion = null;
            }
        }
        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.nroIdentificacion = item.numeroIdentificacion;
            $scope.filterValidation();
        }
        //====================Cliente===========

        //====================Empleado===========
        $scope.onKeyupEmpleado = function () {
            if (!$scope.searchEmpleado.nombreCompleto) {
                $scope.dataSearch.nroIdentificacion = null;
            }
        }
        $scope.onSelectEmpleado = function (item) {
            $scope.dataSearch.nroIdentificacion = item.nroIdentificacion;
            $scope.filterValidation();
        }
        //====================Empleado===========



        $scope.onChangeTipoDoc = function () {
            if ($scope.dataSearch.codTipoDoc) {
                $scope.disabledTempInputPersona = true; //Bloqueamos tipo persona(buscador cliente y empleado)
            } else {
                $scope.disabledTempInputPersona = false;
                $scope.dataSearch.nroSecuencialTipoDoc = null;
            }
            if (!$scope.dataSearch.nroSecuencialTipoDoc) return;

            $scope.getCobros();
        }

        $scope.filterValidation = function () {
            if ($scope.dataSearch.byTipoPersona) {
                if (!$scope.dataSearch.nroIdentificacion) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione el cliente o el empleado'
                    });
                    return
                }
            }

            if (['FV', 'NE'].includes($scope.dataSearch.codTipoDoc)) {
                if (!$scope.dataSearch.nroSecuencialTipoDoc) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese número secuencial de tipo documento (Nota Entrega o Factura)'
                    })
                    return
                }
            }

            $scope.getCobros();
        }


        $scope.filterLocal = function () {
            let cobros = JSON.parse(JSON.stringify($scope.cloneCobros));
            $scope.cobros = $filter("filter")(cobros, $scope.dataSearch.bySearch);
            setTotalsColumn();
        }


        function setTotalsColumn() {
            let total = 0, abono = 0, cambio = 0;
            for (let item of $scope.cobros) {
                total += item.total;
                abono += item.abono;
                cambio += item.cambio;
            }
            $scope.total = fS.roundNumber(total);
            $scope.abono = fS.roundNumber(abono);
            $scope.cambio = fS.roundNumber(cambio);
        }

        $scope.refresh = function () {
            $scope.getCobros();
        }


        $scope.getCobros = function () {
            try {
                $scope.cobros = [];
                $scope.cloneCobros = [];
                setTotalsColumn();

                let isSearchDate = true;

                if (fS.isValidField($scope.dataSearch.nroIdentificacion)) {
                    isSearchDate = false;
                }

                if (fS.isValidField($scope.dataSearch.nroSecuencialDoc)) {
                    isSearchDate = false;
                    tS.toastr({
                        type: 'info',
                        message: 'Buscando por número secuencial'
                    })
                }

                const dataSearch = { 
                    codEstab: $scope.dataSearch.codEstab,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    checkBoxPersona: $scope.tiposPersona.some(item => item.codigo === $scope.dataSearch.byTipoPersona),
                    nroIdentificacion: fS.isValidField($scope.dataSearch.nroIdentificacion),
                    checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                    byUsuario: $scope.dataSearch.byUsuario,
                    checkBoxEstado: [0, 1].includes($scope.dataSearch.byEstado),
                    byEstado: $scope.dataSearch.byEstado,
                    codTipoDoc: $scope.dataSearch.codTipoDoc,
                    nroSecuencialTipoDoc: $scope.dataSearch.nroSecuencialTipoDoc,
                    isSearchNroDoc: $scope.dataSearch.nroSecuencialDoc ? true : false,
                    nroSecuencialDoc: $scope.dataSearch.nroSecuencialDoc,
                    isSearchDate,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize
                }

                showLoader();

                compIngresoSvc.getAll(dataSearch).then(response => {
                    $scope.cobros = response;
                    $scope.cloneCobros = structuredClone(response)
                    setTotalsColumn();

                    if($scope.cobros.length>0){
                        $scope.dataSearch.totalRecords = $scope.cobros[0].totalRecords;

                    }

                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.initiload = () => {
            commonSvc.getEstabAsign().then(response => {
                $scope.establecimientos = response
                let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
                $scope.dataSearch.codEstab = codEstab;
                $scope.getCobros();
            })
        }
        $scope.initiload();

        $scope.pagechanged = function () {
            $scope.getCobros();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getCobros();
        };

        $scope.openModalParam = async ({
            controller,
            template,
            size = 'xl',
            params
        }) => {
            modalSvc.openModalCustom({
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

            try {
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

                if (!isConfirmed) return


                let data = {
                    idComprobanteIngreso: item.idComprobanteIngreso,
                    observacion: value
                }
                showLoader();
                compIngresoSvc.update(item.idComprobanteIngreso, data).then(response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getCobros();
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }

        }


        $scope.getParamToSendMail = function (item) {
            return {
                codDoc: 'CI',
                serieComprobante: item.nroDoc,
                correo: item.correo,
                subject: 'Acontplus - Comprobante de Cobro N°: ' + item.nroDoc,
                json: {
                    hasFile: true,
                    isReport: "SI",
                    reportParams: {
                        hasParams: true,
                        codEstab: item.codEstab,
                        codigo: "RCINGR",
                        format: "pdf"
                    },
                    spParams: {
                        id: item.idComprobanteIngreso
                    }
                }
            }
        }







    }
]); 



})(window.angular)